"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Loader2, ArrowDown, Copy, Check, FileText, Wand2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { EngineSelectInline } from "@/components/humanizer/engine-select";

const SAMPLE = `In today's rapidly evolving technological landscape, AI-assisted coding stands as an enduring testament to the transformative potential of large language models, marking a pivotal moment in the evolution of software development. It's not just about autocomplete—it's about unlocking creativity at scale, ensuring that organizations can remain agile while delivering seamless experiences.`;

export function Demo() {
  const [input, setInput] = useState(SAMPLE);
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [engine, setEngine] = useState<string>("humora-original");

  async function run() {
    if (!input.trim() || loading) return;
    setLoading(true);
    setOutput("");
    try {
      const res = await fetch("/api/humanize/demo", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ text: input, tone: "natural", engine }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({ error: "Something broke on my end." }));
        toast.error(data.error ?? "Something broke on my end.");
        setLoading(false);
        return;
      }

      const reader = res.body?.getReader();
      const decoder = new TextDecoder();
      let acc = "";
      while (reader) {
        const { value, done } = await reader.read();
        if (done) break;
        acc += decoder.decode(value, { stream: true });
        setOutput(acc);
      }
    } catch {
      toast.error("Couldn't reach me. Try again in a sec.");
    } finally {
      setLoading(false);
    }
  }

  async function copy() {
    await navigator.clipboard.writeText(output);
    setCopied(true);
    toast.success("Copied. Go ship it.");
    setTimeout(() => setCopied(false), 1600);
  }

  return (
    <section id="demo" className="mx-auto max-w-5xl scroll-mt-20 px-6 py-16">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <Badge>Try me</Badge>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight md:text-4xl">
            Throw your AI-iest paragraph at me.
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            No sign-up needed. I&apos;ll show you what I can do. (3 runs an hour
            per device on the demo.)
          </p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="group relative overflow-hidden p-0 transition-shadow hover:shadow-lg focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary/40">
          <div className="flex items-center justify-between border-b border-border/60 bg-muted/40 px-5 py-3">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-muted-foreground/60" />
              <FileText className="h-3.5 w-3.5 text-muted-foreground" />
              <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Your AI draft
              </span>
            </div>
            <span className="text-xs tabular-nums text-muted-foreground">
              {input.trim().split(/\s+/).filter(Boolean).length.toLocaleString()} words
            </span>
          </div>
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Paste something an AI wrote for you."
            className="min-h-[300px] resize-none border-0 bg-transparent px-5 py-4 text-[15px] leading-7 shadow-none focus-visible:ring-0 focus-visible:ring-offset-0"
          />
        </Card>

        <Card className="group relative overflow-hidden p-0 transition-shadow hover:shadow-lg">
          {output && (
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-primary/[0.04] via-transparent to-accent/[0.03]" />
          )}
          <div className="relative flex items-center justify-between border-b border-border/60 bg-muted/40 px-5 py-3">
            <div className="flex items-center gap-2">
              <span className={cn(
                "h-2 w-2 rounded-full transition-colors",
                output ? "bg-primary" : "bg-muted-foreground/40"
              )} />
              <Wand2 className={cn(
                "h-3.5 w-3.5 transition-colors",
                output ? "text-primary" : "text-muted-foreground"
              )} />
              <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                My version
              </span>
            </div>
            {output && (
              <button
                onClick={copy}
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium transition-colors",
                  copied
                    ? "bg-primary/15 text-primary"
                    : "bg-muted hover:bg-muted-foreground/10 text-muted-foreground hover:text-foreground"
                )}
                aria-label={copied ? "Copied" : "Copy humanized text"}
              >
                {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                {copied ? "Copied" : "Copy"}
              </button>
            )}
          </div>
          <div className="relative px-5 py-4">
            <AnimatePresence mode="wait">
              {loading && !output && (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex h-[300px] flex-col items-center justify-center gap-3 text-sm text-muted-foreground"
                >
                  <div className="relative">
                    <div className="absolute inset-0 animate-ping rounded-full bg-primary/30" />
                    <Loader2 className="relative h-5 w-5 animate-spin text-primary" />
                  </div>
                  <span>Working on it. Give me a sec.</span>
                </motion.div>
              )}
              {output && (
                <motion.div
                  key="output"
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="min-h-[300px] whitespace-pre-wrap text-[15px] leading-7 text-foreground/90"
                >
                  {output}
                </motion.div>
              )}
              {!loading && !output && (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex h-[300px] flex-col items-center justify-center gap-3 text-center text-sm text-muted-foreground"
                >
                  <div className="rounded-full border border-dashed border-border p-4">
                    <Wand2 className="h-5 w-5 text-muted-foreground/60" />
                  </div>
                  <p className="text-xs">I&apos;ll drop my version right here.</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </Card>
      </div>

      <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
        <EngineSelectInline value={engine} onChange={setEngine} />
        <Button onClick={run} disabled={loading || !input.trim()} size="lg">
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <ArrowDown className="h-4 w-4" />
          )}
          {loading ? "Working" : "Humanize this"}
        </Button>
      </div>
    </section>
  );
}
