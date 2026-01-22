import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

export async function POST(req: NextRequest) {
  try {
    const { text, style } = await req.json();

    if (!text) {
      return NextResponse.json({ error: "No text provided" }, { status: 400 });
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
    if (!validStyles.includes(style)) {
      return NextResponse.json(
        { error: "Invalid style selected" },
        { status: 400 },
      );
    }

    // const prompt = `
    //   Convert the following text into casual Banglish (Romanized Bangla) suitable for modern social media, chats, and messaging:

    //   "${text}"

    //   Rules:
    //   - Convert all languages into Banglish (Romanized Bangla), EXCEPT short casual English chat words.
    //   - For Bangla text: transliterate strictly and exactly into Banglish (word by word), keeping meaning and structure intact.
    //   - If the input is already Banglish:
    //     - DO NOT rewrite or translate it.
    //     - Only fix spelling or typing mistakes.
    //     - Do NOT change sentence structure, wording, or tone.
    //   - For other languages (English, Hindi, Arabic, Chinese, etc.): convert them into Banglish as naturally spoken in casual conversation.
    //   - Preserve only short, commonly used English chat words (hi, hello, ok, okay, wow).
    //   - Do NOT preserve full English sentences; convert them into Banglish (e.g., "How are you?" → "tumi kamon acho?").
    //   - Keep it friendly, simple, and easy to read.
    //   - Use commonly spoken Banglish words.
    //   - Avoid formal grammar.
    //   - Preserve punctuation and line breaks.
    //   - Use emojis only if they naturally fit.
    //   - Output ONLY the Banglish text. Do not add explanations.
    //   `;

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

    const finalPrompt = PROMPTS[style as keyof typeof PROMPTS];

    // Use Gemini API to generate Banglish
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: finalPrompt,
    });

    const convertedText = response?.text || "";

    return NextResponse.json({ convertedText });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to convert text" },
      { status: 500 },
    );
  }
}
