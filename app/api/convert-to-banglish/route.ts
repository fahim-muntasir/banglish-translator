import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";
import { FirebaseAuthError } from "firebase-admin/auth";
import { adminAuth } from "@/lib/firebaseAdmin";
import { releaseConversion, reserveConversion } from "@/lib/serverUsage";

export const runtime = "nodejs";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

export async function POST(req: NextRequest) {
  const authorization = req.headers.get("authorization");
  const token = authorization?.match(/^Bearer (.+)$/i)?.[1];
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
        message: error.message,
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

  let reservation:
    | Awaited<ReturnType<typeof reserveConversion>> & { allowed: true }
    | undefined;
  try {
    const body: unknown = await req.json();
    if (!body || typeof body !== "object") {
      return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
    }
    const { text, style } = body as { text?: unknown; style?: unknown };

    if (typeof text !== "string" || !text.trim()) {
      return NextResponse.json({ error: "No text provided" }, { status: 400 });
    }
    if (text.length > 4000) {
      return NextResponse.json({ error: "Text exceeds the 4000 character limit" }, { status: 413 });
    }

    const validStyles = [
      "casual",
      "funny",
      "professional",
      "romantic",
      "attitude",
      "facebook",
      "storytelling",
    ] as const;
    
    const validStyle = validStyles.find((candidate) => candidate === style);

    if (!validStyle) {
      return NextResponse.json(
        { error: "Invalid style selected" },
        { status: 400 },
      );
    }

    const result = await reserveConversion(uid);
    if (!result.allowed) {
      const status = result.reason === "ACCOUNT_UNAVAILABLE" ? 403 : 429;
      return NextResponse.json({ error: result.reason }, { status });
    }
    reservation = result;

    const BASE_RULES = `
    You are a Banglish conversion engine.

    Convert the following text into Banglish (Romanized Bangla):

    "${text}"

    GLOBAL RULES (STRICT):
    - Convert ALL languages into Banglish (Romanized Bangla).
    - If input is Bangla → transliterate strictly word-by-word.
    - If input is already Banglish:
      - DO NOT rewrite or paraphrase.
      - ONLY fix spelling or typing mistakes.
      - DO NOT change tone or sentence structure.
    - If input is English or any other language:
      - Convert fully into natural Banglish.
      - Do NOT keep full English sentences.
    - Preserve short casual English words only (hi, hello, ok, okay, wow).
    - Preserve punctuation and line breaks.
    - Do NOT add explanations.
    - Do NOT add titles or headings.
    - Output ONLY Banglish text.
    `;

    const CASUAL_PROMPT = `
    ${BASE_RULES}

    STYLE RULES:
    - Tone should feel natural, friendly, and conversational.
    - Use everyday Banglish used in chats.
    - Keep it simple and relaxed.
    - Avoid formal or heavy words.
    - Emojis allowed only if they feel natural.
    `;

    const FUNNY_PROMPT = `
    ${BASE_RULES}

    STYLE RULES:
    - Make the tone light, playful, and funny.
    - Use common Banglish humor or expressions.
    - Light sarcasm is allowed.
    - Emojis like 😂😆🤣 allowed.
    - Do NOT overdo jokes or make it cringe.
    - Keep it short and punchy.
    `;

    const PROFESSIONAL_PROMPT = `
    ${BASE_RULES}

    STYLE RULES:
    - Tone must be polite, clean, and professional.
    - Suitable for office or formal communication.
    - No slang.
    - No emojis.
    - Use respectful and clear Banglish.
    `;

    const ROMANTIC_PROMPT = `
    ${BASE_RULES}

    STYLE RULES:
    - Tone should be soft, emotional, and warm.
    - Use gentle and expressive Banglish.
    - Emotion should feel natural, not dramatic.
    - Emojis like ❤️🥺✨ allowed if they fit naturally.
    - Avoid exaggeration.
    `;

    const ATTITUDE_PROMPT = `
    ${BASE_RULES}

    STYLE RULES:
    - Tone should be confident, bold, and stylish.
    - Slight swag or attitude is allowed.
    - Should sound cool, not rude.
    - Emojis like 😎🔥💯 allowed.
    - Keep it sharp and impactful.
    `;

    const FACEBOOK_PROMPT = `
    ${BASE_RULES}

    STYLE RULES:
    - Friendly and expressive.
    - Feels like a real Facebook status.
    - Slight emotional or personal touch allowed.
    - Emojis allowed but not too many.
    - Should feel relatable and natural.
    `;

    const STORYTELLING_PROMPT = `
    ${BASE_RULES}

    STYLE RULES:
    - Narrative and flowing tone.
    - Feels like telling a short moment or story.
    - Natural pacing and emotional flow.
    - Avoid sounding robotic or formal.
    - Do NOT shorten too much.
    `;

    const PROMPTS = {
      casual: CASUAL_PROMPT,
      funny: FUNNY_PROMPT,
      professional: PROFESSIONAL_PROMPT,
      romantic: ROMANTIC_PROMPT,
      attitude: ATTITUDE_PROMPT,
      facebook: FACEBOOK_PROMPT,
      storytelling: STORYTELLING_PROMPT,
    } as const;

    const finalPrompt = PROMPTS[validStyle];

    // Use Gemini API to generate Banglish
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: finalPrompt,
    });

    const convertedText = response?.text || "";

    return NextResponse.json({ convertedText });
  } catch (err) {
    console.error(err);
    if (reservation?.allowed) {
      try {
        await releaseConversion(uid, reservation.reservation);
      } catch (releaseError) {
        console.error("Failed to release conversion usage reservation", releaseError);
      }
    }
    return NextResponse.json(
      { error: "Failed to convert text" },
      { status: 500 },
    );
  }
}
