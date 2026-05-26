import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const FAQS = [
  {
    q: "Are you a &ldquo;bypass AI detection&rdquo; tool?",
    a: "Kind of, yeah. I&apos;m tested against the patterns GPTZero, Turnitin, and Copyleaks look for. But the real goal is text that reads like a person actually wrote it. The detector part is a happy side effect.",
  },
  {
    q: "What model do you use?",
    a: "OpenAI gpt-4o-mini under the hood, with Claude Haiku as a backup when OpenAI hiccups. The model matters less than the prompt though, and mine is a 29-pattern editor spec sourced from Wikipedia, not a vague &ldquo;make this sound human.&rdquo;",
  },
  {
    q: "What&apos;s &ldquo;voice matching&rdquo;?",
    a: "If you&apos;re on Pro, paste 2-3 paragraphs of your own writing. I study your sentence rhythm, your word choices, your tics. Then I match those when I rewrite. The output reads like you on a good day, not a generic &ldquo;cleaned up&rdquo; version.",
  },
  {
    q: "Will my text be used to train AI?",
    a: "No. I send your text to OpenAI through their API, which they don&apos;t use for training by default. On Pro and Business, I store your inputs and outputs so you can find them later. You can delete any time from settings.",
  },
  {
    q: "Can I cancel?",
    a: "Yep. One click in settings. You keep access until the end of the billing period, then drop to the free tier with your history intact. I won&apos;t make you email anyone.",
  },
  {
    q: "What about refunds?",
    a: "Within 7 days of your first charge, just email me and I&apos;ll refund. After that I don&apos;t, but I won&apos;t fight you about it either.",
  },
];

export function FAQ() {
  return (
    <section id="faq" className="mx-auto max-w-6xl scroll-mt-20 px-6 py-20">
      <Badge>FAQ</Badge>
      <h2 className="mt-3 text-3xl font-semibold tracking-tight md:text-4xl">
        Honest answers to fair questions.
      </h2>

      <div className="mt-10 grid gap-4 md:grid-cols-2">
        {FAQS.map((f) => (
          <Card key={f.q} className="p-6">
            <div
              className="text-base font-semibold tracking-tight"
              dangerouslySetInnerHTML={{ __html: f.q }}
            />
            <div
              className="mt-2 text-sm leading-relaxed text-muted-foreground"
              dangerouslySetInnerHTML={{ __html: f.a }}
            />
          </Card>
        ))}
      </div>
    </section>
  );
}
