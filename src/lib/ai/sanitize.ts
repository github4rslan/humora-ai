export function sanitizeHumanizedOutput(text: string): string {
  return text
    .replaceAll(/[,'\u2019\u2014-]/g, "  ")
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
