import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileText, ScanLine, Wand2 } from "lucide-react";

const STEPS = [
  {
    icon: FileText,
    title: "You paste your draft",
    body:
      "Bring me anything. A blog post, an email, an essay, an assignment. If it came out of an AI and reads like it, I want it.",
  },
  {
    icon: ScanLine,
    title: "I scan for 29 AI tells",
    body:
      "Em-dash overload. Synonym cycling. The word &ldquo;delve.&rdquo; The &ldquo;in conclusion, the future looks bright&rdquo; ending. I check each one.",
  },
  {
    icon: Wand2,
    title: "I rewrite, audit, rewrite",
    body:
      "First a clean rewrite. Then I ask myself &ldquo;what still sounds like AI?&rdquo; Then I fix that too. Two passes catch what one misses.",
  },
];

export function HowItWorks() {
  return (
    <section id="how" className="mx-auto max-w-6xl scroll-mt-20 px-6 py-20">
      <Badge>How I work</Badge>
      <h2 className="mt-3 text-3xl font-semibold tracking-tight md:text-4xl">
        I&apos;m built on the Wikipedia guide to AI tells.
      </h2>
      <p className="mt-3 max-w-2xl text-muted-foreground">
        Other humanizers run a vague &ldquo;make this sound human&rdquo; prompt. I&apos;m
        built on the 29-pattern editor spec maintained by Wikipedia&apos;s
        WikiProject AI Cleanup, and I run every rewrite through two passes
        before I hand it back.
      </p>

      <div className="mt-12 grid gap-5 md:grid-cols-3">
        {STEPS.map((s, i) => (
          <Card key={s.title} className="p-6">
            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              <s.icon className="h-4 w-4 text-primary" />
              Step {i + 1}
            </div>
            <h3 className="mt-3 text-lg font-semibold tracking-tight">{s.title}</h3>
            <p
              className="mt-2 text-sm leading-relaxed text-muted-foreground"
              dangerouslySetInnerHTML={{ __html: s.body }}
            />
          </Card>
        ))}
      </div>
    </section>
  );
}
