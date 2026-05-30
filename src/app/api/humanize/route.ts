import { NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";
import { streamText } from "ai";
import { openai } from "@ai-sdk/openai";
import { HUMANIZER_SYSTEM_PROMPT, buildHumanizeUserMessage, type Tone } from "@/lib/ai/prompts";
import { checkUsage, incrementUsage, getOrCreateUser } from "@/lib/usage";
import { getUserLimiter } from "@/lib/ratelimit";
import { countWords } from "@/lib/utils";
import { connectDB } from "@/lib/db";
import { Document } from "@/lib/db/schema";

export const runtime = "nodejs";

const TONES: Tone[] = ["natural", "casual", "professional", "academic"];

export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Sign in to use the humanizer." }, { status: 401 });

  const limiter = getUserLimiter();
  if (limiter) {
    try {
      const { success } = await limiter.limit(userId);
      if (!success) {
        return NextResponse.json(
          { error: "Slow down a sec. You're sending requests faster than the limit allows." },
          { status: 429 }
        );
      }
    } catch (err) {
      console.warn("[humanize] rate limit unavailable", err);
    }
  }

  const body = await req.json().catch(() => null);
  if (!body || typeof body.text !== "string" || !body.text.trim()) {
    return NextResponse.json({ error: "Send some text." }, { status: 400 });
  }
  const text: string = body.text;
  const tone: Tone = TONES.includes(body.tone) ? body.tone : "natural";
  const voiceSample: string | undefined =
    typeof body.voiceSample === "string" && body.voiceSample.trim()
      ? body.voiceSample.slice(0, 4000)
      : undefined;

  if (text.length > 30_000) {
    return NextResponse.json({ error: "Drafts are capped at 30,000 characters per run." }, { status: 400 });
  }

  const user = await currentUser();
  if (user) {
    await getOrCreateUser({
      id: userId,
      email: user.emailAddresses[0]?.emailAddress ?? "unknown@humora.ai",
    });
  }

  const check = await checkUsage({ userId, inputText: text });
  if (!check.allowed) {
    return NextResponse.json(
      {
        error: `You're out of words for this month on the ${check.plan} plan. Upgrade or wait until next month.`,
        upgradeUrl: "/#pricing",
      },
      { status: 402 }
    );
  }

  const result = streamText({
    model: openai("gpt-4o-mini"),
    system: HUMANIZER_SYSTEM_PROMPT,
    prompt: buildHumanizeUserMessage({ text, tone, voiceSample }),
    onFinish: async ({ text: outputText }) => {
      const words = countWords(text);
      await incrementUsage({ userId, words });
      try {
        await connectDB();
        await Document.create({
          userId,
          tone,
          inputText: text.slice(0, 50_000),
          outputText: outputText.slice(0, 50_000),
          wordCount: words,
        });
      } catch (err) {
        console.error("[humanize] failed to persist document", err);
      }
    },
  });

  return result.toTextStreamResponse();
}
