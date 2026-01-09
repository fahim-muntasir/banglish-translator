import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

export async function POST(req: NextRequest) {
  try {
    const { text } = await req.json();

    if (!text) {
      return NextResponse.json({ error: "No text provided" }, { status: 400 });
    }

    // const prompt = `
    //   Convert the following text into casual Banglish (Romanized Bangla) suitable for modern social media, chats, and messaging:
    //   "${text}"

    //   Rules:
    //   - Convert ALL languages into Banglish (Romanized Bangla).
    //   - For Bangla text: transliterate strictly and exactly into Banglish (word by word), keeping the meaning and structure intact.
    //   - For other languages (English, Hindi, Arabic, etc.): convert them into Banglish as they would naturally be spoken in casual chat.
    //   - Preserve only short, casual English words commonly used in everyday conversation (e.g., hi, hello, okay, wow) as they are.
    //   - Do NOT preserve full English sentences; convert them into Banglish (e.g., "How are you?" → "tumi kamon acho?").
    //   - Keep it short, friendly, and easy to read.
    //   - Use commonly spoken Banglish words and phrases.
    //   - Avoid formal grammar; focus on natural, conversational style.
    //   - Use emojis naturally if they fit the context.
    //   - Preserve punctuation from the original text.
    //   - Output ONLY the Banglish text, nothing else.
    //   `;

    const prompt = `
      Convert the following text into casual Banglish (Romanized Bangla) suitable for modern social media, chats, and messaging:

      "${text}"

      Rules:
      - Convert all languages into Banglish (Romanized Bangla), EXCEPT short casual English chat words.
      - For Bangla text: transliterate strictly and exactly into Banglish (word by word), keeping meaning and structure intact.
      - If the input is already Banglish:
        - DO NOT rewrite or translate it.
        - Only fix spelling or typing mistakes.
        - Do NOT change sentence structure, wording, or tone.
      - For other languages (English, Hindi, Arabic, Chinese, etc.): convert them into Banglish as naturally spoken in casual conversation.
      - Preserve only short, commonly used English chat words (hi, hello, ok, okay, wow).
      - Do NOT preserve full English sentences; convert them into Banglish (e.g., "How are you?" → "tumi kamon acho?").
      - Keep it friendly, simple, and easy to read.
      - Use commonly spoken Banglish words.
      - Avoid formal grammar.
      - Preserve punctuation and line breaks.
      - Use emojis only if they naturally fit.
      - Output ONLY the Banglish text. Do not add explanations.
      `;


    // Use Gemini API to generate Banglish
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash", // latest fast model
      contents: prompt,
    });

    const convertedText = response?.text || "";

    return NextResponse.json({ convertedText });

  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to convert text" }, { status: 500 });
  }
}
