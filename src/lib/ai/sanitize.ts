const CONTRACTION_REPLACEMENTS: Array<[RegExp, string]> = [
  [/\bcan['\u2019]t\b/gi, "cannot"],
  [/\bwon['\u2019]t\b/gi, "will not"],
  [/\bdon['\u2019]t\b/gi, "do not"],
  [/\bdoesn['\u2019]t\b/gi, "does not"],
  [/\bdidn['\u2019]t\b/gi, "did not"],
  [/\bisn['\u2019]t\b/gi, "is not"],
  [/\baren['\u2019]t\b/gi, "are not"],
  [/\bwasn['\u2019]t\b/gi, "was not"],
  [/\bweren['\u2019]t\b/gi, "were not"],
  [/\bhasn['\u2019]t\b/gi, "has not"],
  [/\bhaven['\u2019]t\b/gi, "have not"],
  [/\bhadn['\u2019]t\b/gi, "had not"],
  [/\bwouldn['\u2019]t\b/gi, "would not"],
  [/\bshouldn['\u2019]t\b/gi, "should not"],
  [/\bcouldn['\u2019]t\b/gi, "could not"],
  [/\bit['\u2019]s\b/gi, "it is"],
  [/\bthat['\u2019]s\b/gi, "that is"],
  [/\bthere['\u2019]s\b/gi, "there is"],
  [/\bwhat['\u2019]s\b/gi, "what is"],
  [/\bI['\u2019]m\b/g, "I am"],
  [/\bI['\u2019]ll\b/g, "I will"],
  [/\bI['\u2019]ve\b/g, "I have"],
  [/\bwe['\u2019]re\b/gi, "we are"],
  [/\bwe['\u2019]ll\b/gi, "we will"],
  [/\bthey['\u2019]re\b/gi, "they are"],
  [/\bthey['\u2019]ll\b/gi, "they will"],
  [/\byou['\u2019]re\b/gi, "you are"],
  [/\byou['\u2019]ll\b/gi, "you will"],
];

const BANNED_AI_PATTERNS: RegExp[] = [
  /\bhowever\b/gi,
  /\bactually\b/gi,
  /\badditionally\b/gi,
  /\balign with\b/gi,
  /\bcrucial\b/gi,
  /\bdelve\b/gi,
  /\bemphasizing\b/gi,
  /\benduring\b/gi,
  /\benhance\b/gi,
  /\bfostering\b/gi,
  /\bgarner\b/gi,
  /\bhighlight(?:s|ed|ing)?\b/gi,
  /\binterplay\b/gi,
  /\bintricac(?:y|ies)\b/gi,
  /\bintricate\b/gi,
  /\bkey\b/gi,
  /\blandscape\b/gi,
  /\bpivotal\b/gi,
  /\bshowcas(?:e|es|ed|ing)\b/gi,
  /\btapestry\b/gi,
  /\btestament\b/gi,
  /\btransformative\b/gi,
  /\bunderscor(?:e|es|ed|ing)\b/gi,
  /\bunlock(?:s|ed|ing)?\b/gi,
  /\bseamless\b/gi,
  /\bvaluable\b/gi,
  /\bvibrant\b/gi,
  /\brapidly evolving\b/gi,
  /\bevolving landscape\b/gi,
  /\bindelible mark\b/gi,
  /\bdeeply rooted\b/gi,
  /\bserves as\b/gi,
  /\bstands as\b/gi,
  /\bfunctions as\b/gi,
  /\brepresents\b/gi,
  /\bboasts\b/gi,
  /\bnestled\b/gi,
  /\bbreathtaking\b/gi,
  /\bstunning\b/gi,
  /\bmust[\s-]+visit\b/gi,
  /\bin the heart of\b/gi,
  /\bexperts believe\b/gi,
  /\bobservers have noted\b/gi,
  /\bindustry reports say\b/gi,
  /\bdespite challenges\b/gi,
  /\bnot only\b/gi,
  /\bit is not just\b/gi,
  /\bit is not merely\b/gi,
  /\bat its core\b/gi,
  /\bthe real question is\b/gi,
  /\bwhat really matters\b/gi,
  /\blet us dive in\b/gi,
  /\bhere is what you need to know\b/gi,
  /\bnow let us explore\b/gi,
  /\bI hope this helps\b/gi,
  /\blet me know if\b/gi,
  /\bof course\b/gi,
  /\bcertainly\b/gi,
  /\bas of my last training update\b/gi,
  /\bwhile specific details are limited\b/gi,
  /\bgreat question\b/gi,
  /\byou are absolutely right\b/gi,
  /\bin order to\b/gi,
  /\bdue to the fact that\b/gi,
  /\bat this point in time\b/gi,
  /\bit is important to note that\b/gi,
  /\bthe future looks bright\b/gi,
  /\bexciting times ahead\b/gi,
];

export function sanitizeHumanizedOutput(text: string): string {
  const expanded = CONTRACTION_REPLACEMENTS.reduce(
    (sanitized, [pattern, replacement]) => sanitized.replaceAll(pattern, replacement),
    text
  );

  return BANNED_AI_PATTERNS.reduce(
    (sanitized, pattern) => sanitized.replaceAll(pattern, " "),
    expanded
  )
    .replaceAll(/\b(?:don|isn|can|won|aren|wasn|weren|hasn|haven|hadn|wouldn|shouldn|couldn)\s+t\b/gi, " ")
    .replaceAll(/\bI\s+(?:ll|m|ve)\b/g, " ")
    .replaceAll(/\b(?:you|we|they)\s+(?:re|ll|ve)\b/gi, " ")
    .replaceAll(/[,'\u2018\u2019\u2014-]/g, "  ")
    .replaceAll(/[;:()]/g, " ");
}

export function toSanitizedTextStreamResponse(textStream: ReadableStream<string>): Response {
  const sanitizedStream = textStream
    .pipeThrough(
      new TransformStream<string, string>({
        transform(chunk, controller) {
          controller.enqueue(sanitizeHumanizedOutput(chunk));
        },
      })
    )
    .pipeThrough(new TextEncoderStream());

  return new Response(sanitizedStream, {
    headers: {
      "content-type": "text/plain; charset=utf-8",
    },
  });
}
