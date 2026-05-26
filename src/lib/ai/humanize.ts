import { generateText, streamText } from "ai";
import { openai } from "@ai-sdk/openai";
import { anthropic } from "@ai-sdk/anthropic";
import {
  HUMANIZER_SYSTEM_PROMPT,
  buildHumanizeUserMessage,
  buildAuditUserMessage,
  buildReviseUserMessage,
  type Tone,
} from "./prompts";

const PRIMARY_MODEL = openai("gpt-4o-mini");
const FALLBACK_MODEL = anthropic("claude-haiku-4-5-20251001");

export type HumanizeInput = {
  text: string;
  tone: Tone;
  voiceSample?: string;
};

export type HumanizeResult = {
  draft: string;
  tells: string;
  final: string;
};

async function callWithFallback(args: {
  system: string;
  prompt: string;
}): Promise<string> {
  try {
    const { text } = await generateText({
      model: PRIMARY_MODEL,
      system: args.system,
      prompt: args.prompt,
    });
    return text;
  } catch {
    const { text } = await generateText({
      model: FALLBACK_MODEL,
      system: args.system,
      prompt: args.prompt,
    });
    return text;
  }
}

export async function humanize(input: HumanizeInput): Promise<HumanizeResult> {
  const draft = await callWithFallback({
    system: HUMANIZER_SYSTEM_PROMPT,
    prompt: buildHumanizeUserMessage(input),
  });

  const tells = await callWithFallback({
    system: HUMANIZER_SYSTEM_PROMPT,
    prompt: buildAuditUserMessage(draft),
  });

  if (tells.trim().toLowerCase().includes("clean")) {
    return { draft, tells, final: draft };
  }

  const final = await callWithFallback({
    system: HUMANIZER_SYSTEM_PROMPT,
    prompt: buildReviseUserMessage({
      original: input.text,
      draft,
      tells,
      tone: input.tone,
    }),
  });

  return { draft, tells, final };
}

export function streamHumanizeDraft(input: HumanizeInput) {
  return streamText({
    model: PRIMARY_MODEL,
    system: HUMANIZER_SYSTEM_PROMPT,
    prompt: buildHumanizeUserMessage(input),
  });
}
