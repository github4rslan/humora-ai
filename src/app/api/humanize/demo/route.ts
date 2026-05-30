import { NextResponse } from "next/server";
import { streamText } from "ai";
import { openai } from "@ai-sdk/openai";
import { HUMANIZER_SYSTEM_PROMPT, buildHumanizeUserMessage, type Tone } from "@/lib/ai/prompts";
import { toSanitizedTextStreamResponse } from "@/lib/ai/sanitize";
import { getAnonLimiter } from "@/lib/ratelimit";
import { countWords } from "@/lib/utils";

export const runtime = "nodejs";

const TONES: Tone[] = ["natural", "casual", "professional", "academic"];

export async function POST(req: Request) {
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    req.headers.get("x-real-ip") ??
    "unknown";

  const limiter = getAnonLimiter();
  if (limiter) {
    try {
      const { success } = await limiter.limit(ip);
      if (!success) {
        return NextResponse.json(
          { error: "The demo is rate-limited to 3 runs an hour. Sign up free for more." },
          { status: 429 }
        );
      }
    } catch (err) {
      console.warn("[humanize/demo] rate limit unavailable", err);
    }
  }

  const body = await req.json().catch(() => null);
  if (!body || typeof body.text !== "string" || !body.text.trim()) {
    return NextResponse.json({ error: "Send some text." }, { status: 400 });
  }
  const text: string = body.text;
  const tone: Tone = TONES.includes(body.tone) ? body.tone : "natural";

  const words = countWords(text);
  if (words > 400) {
    return NextResponse.json(
      { error: "The demo handles up to 400 words. Sign up free for longer drafts." },
      { status: 400 }
    );
  }

  const result = streamText({
    model: openai("gpt-4o-mini"),
    system: HUMANIZER_SYSTEM_PROMPT,
    prompt: buildHumanizeUserMessage({ text, tone }),
  });

  return toSanitizedTextStreamResponse(result.textStream);
}
