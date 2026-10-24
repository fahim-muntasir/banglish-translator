import { FirebaseAuthError } from "firebase-admin/auth";
import { GoogleGenAI } from "@google/genai";
import { NextRequest, NextResponse } from "next/server";
import { getConversionSystemInstruction, isTranslationStyle } from "@/lib/conversionPrompts";
import { getBearerToken } from "@/lib/serverAuth";
import { adminAuth } from "@/lib/firebaseAdmin";
import { releaseConversion, reserveConversion } from "@/lib/serverUsage";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const token = getBearerToken(req);
  if (!token) {
    return NextResponse.json({ error: "Authentication required" }, { status: 401 });
  }

  let uid: string;
  try {
    ({ uid } = await adminAuth.verifyIdToken(token));
  } catch (error) {
    if (error instanceof FirebaseAuthError) {
      console.error("Firebase ID token verification failed", {
        code: error.code,
      });

      const projectMismatch =
        error.code === "auth/argument-error" &&
        /incorrect "(aud|iss)" claim|same Firebase project/i.test(error.message);

      return NextResponse.json(
        {
          error: projectMismatch
            ? "Authentication project mismatch"
            : "Invalid authentication token",
        },
        { status: projectMismatch ? 500 : 401 },
      );
    }

    console.error("Firebase ID token verification is unavailable", error);
    return NextResponse.json(
      { error: "Authentication verification unavailable" },
      { status: 500 },
    );
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error("Gemini API key is not configured");
    return NextResponse.json(
      { error: "Conversion service is not configured" },
      { status: 503 },
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const { text, style } = body as { text?: unknown; style?: unknown };
  if (typeof text !== "string" || !text.trim()) {
    return NextResponse.json({ error: "No text provided" }, { status: 400 });
  }
  if (text.length > 4000) {
    return NextResponse.json(
      { error: "Text exceeds the 4000 character limit" },
      { status: 413 },
    );
  }
  if (!isTranslationStyle(style)) {
    return NextResponse.json(
      { error: "Invalid style selected" },
      { status: 400 },
    );
  }

  let result: Awaited<ReturnType<typeof reserveConversion>>;
  try {
    result = await reserveConversion(uid);
  } catch (error) {
    console.error("Conversion usage reservation failed", {
      message: error instanceof Error ? error.message : "Unknown error",
    });
    return NextResponse.json(
      { error: "Unable to verify conversion allowance" },
      { status: 503 },
    );
  }
  if (!result.allowed) {
    const status = result.reason === "ACCOUNT_UNAVAILABLE" ? 403 : 429;
    return NextResponse.json({ error: result.reason }, { status });
  }

  try {
    const response = await new GoogleGenAI({ apiKey }).models.generateContent({
      model: "gemini-2.5-flash",
      contents: text,
      config: {
        systemInstruction: getConversionSystemInstruction(style),
        httpOptions: { timeout: 30_000 },
      },
    });
    const convertedText = response.text;
    if (!convertedText?.trim()) {
      throw new Error("Gemini returned an empty conversion");
    }

    return NextResponse.json({ convertedText });
  } catch (error) {
    console.error("Conversion request failed", {
      message: error instanceof Error ? error.message : "Unknown error",
    });
    try {
      await releaseConversion(uid, result.reservation);
    } catch (releaseError) {
      console.error("Failed to release conversion usage reservation", releaseError);
    }
    return NextResponse.json(
      { error: "Failed to convert text" },
      { status: 502 },
    );
  }
}
