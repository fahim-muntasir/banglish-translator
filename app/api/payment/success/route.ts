import { NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import { doc, updateDoc, serverTimestamp } from "firebase/firestore";

export async function POST(req: Request) {
  const body = await req.formData();

  const status = body.get("status");
  const uid = body.get("value_a");
  const tran_id = body.get("tran_id");

  if (status === "VALID") {
    await updateDoc(doc(db, "users", uid as string), {
      plan: "PRO",
      // monthlyUsage: 0,
      usage:{
        count: 0,
        resetAt: serverTimestamp(),
      }
      // subscriptionActive: true,
    });

    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_APP_URL}/?success=true&plan=pro&transaction=${tran_id}`
    );
  }

  return NextResponse.redirect(
    `${process.env.NEXT_PUBLIC_APP_URL}/payment/failed`
  );
}
