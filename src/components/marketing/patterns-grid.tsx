import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const PATTERNS = [
  { label: "Em-dash overload", example: "&ldquo;not the people—yet this continues—&rdquo;" },
  { label: "It&apos;s not just X, it&apos;s Y", example: "&ldquo;not merely a song, it&apos;s a statement&rdquo;" },
  { label: "Forced rule of three", example: "&ldquo;innovation, inspiration, and insights&rdquo;" },
  { label: "AI vocabulary", example: "delve · testament · landscape · pivotal · showcase" },
  { label: "Vague attributions", example: "&ldquo;experts believe&rdquo; · &ldquo;observers have noted&rdquo;" },
  { label: "Synonym cycling", example: "&ldquo;the protagonist&hellip; the main character&hellip; the hero&rdquo;" },
  { label: "Promotional puff", example: "&ldquo;nestled in the breathtaking region&rdquo;" },
  { label: "Significance inflation", example: "&ldquo;marking a pivotal moment&rdquo;" },
  { label: "Chatbot artifacts", example: "&ldquo;I hope this helps&rdquo; · &ldquo;Let me know if&rdquo;" },
  { label: "Filler phrases", example: "&ldquo;in order to&rdquo; · &ldquo;at this point in time&rdquo;" },
  { label: "Excessive hedging", example: "&ldquo;could potentially possibly might&rdquo;" },
  { label: "Generic conclusions", example: "&ldquo;the future looks bright&rdquo;" },
];

export function PatternsGrid() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-20">
      <Badge>What I clean up</Badge>
      <h2 className="mt-3 text-3xl font-semibold tracking-tight md:text-4xl">
        A small sample of the 29 things I hunt for.
      </h2>
      <p className="mt-3 max-w-2xl text-muted-foreground">
        Each one comes from real AI output catalogued on Wikipedia. If your
        draft has any of these, trust me, your reader already noticed.
      </p>

      <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {PATTERNS.map((p) => (
          <Card key={p.label} className="p-4">
            <div className="text-sm font-semibold tracking-tight">{p.label}</div>
            <div
              className="mt-1 text-xs text-muted-foreground"
              dangerouslySetInnerHTML={{ __html: p.example }}
            />
          </Card>
        ))}
      </div>
    </section>
  );
}
