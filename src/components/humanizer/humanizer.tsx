"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Loader2, Copy, Check, RefreshCw, Sparkles, FileText, Wand2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import type { Tone } from "@/lib/ai/prompts";

const TONES: { id: Tone; label: string; hint: string }[] = [
  { id: "natural", label: "Natural", hint: "My default. Varied, a little opinionated." },
  { id: "casual", label: "Casual", hint: "Looser. Sentence fragments allowed." },
  { id: "professional", label: "Professional", hint: "Clean and clear, no fluff." },
  { id: "academic", label: "Academic", hint: "Precise. Hedging where it earns its keep." },
];

export function Humanizer() {
  const [input, setInput] = useState("");
  const [voiceSample, setVoiceSample] = useState("");
  const [tone, setTone] = useState<Tone>("natural");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showVoice, setShowVoice] = useState(false);

  const wordCount = input.trim().split(/\s+/).filter(Boolean).length;
  const outputWordCount = output.trim().split(/\s+/).filter(Boolean).length;
  const outputCharCount = output.length;

  async function run() {
    if (!input.trim() || loading) return;
    setLoading(true);
    setOutput("");
    try {
      const res = await fetch("/api/humanize", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ text: input, tone, voiceSample: voiceSample || undefined }),
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
      toast.success("All yours. Read it through before you ship.");
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
    <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Hey, paste your draft.</h1>
            <p className="text-sm text-muted-foreground">
              I&apos;ll send back something that reads like you wrote it.
            </p>
          </div>
        </div>

        <div className="grid gap-5 lg:grid-cols-2">
          <Card className="group relative overflow-hidden p-0 transition-shadow hover:shadow-lg focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary/40">
            <div className="flex items-center justify-between border-b border-border/60 bg-muted/40 px-5 py-3">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-muted-foreground/60" />
                <FileText className="h-3.5 w-3.5 text-muted-foreground" />
                <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Your draft
                </span>
              </div>
              <span className="text-xs tabular-nums text-muted-foreground">
                {wordCount.toLocaleString()} {wordCount === 1 ? "word" : "words"}
              </span>
            </div>
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Paste the AI text here. I'll send back a human version."
              className="min-h-[460px] resize-none border-0 bg-transparent px-5 py-4 text-[15px] leading-7 shadow-none focus-visible:ring-0 focus-visible:ring-offset-0"
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
              <div className="flex items-center gap-3">
                {output && (
                  <span className="text-xs tabular-nums text-muted-foreground">
                    {outputWordCount.toLocaleString()} words · {outputCharCount.toLocaleString()} chars
                  </span>
                )}
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
            </div>
            <div className="relative px-5 py-4">
              <AnimatePresence mode="wait">
                {loading && !output && (
                  <motion.div
                    key="loading"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex h-[460px] flex-col items-center justify-center gap-3 text-sm text-muted-foreground"
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
                    className="min-h-[460px] whitespace-pre-wrap text-[15px] leading-7 text-foreground/90"
                  >
                    {output}
                  </motion.div>
                )}
                {!loading && !output && (
                  <motion.div
                    key="empty"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex h-[460px] flex-col items-center justify-center gap-3 text-center text-sm text-muted-foreground"
                  >
                    <div className="rounded-full border border-dashed border-border p-4">
                      <Wand2 className="h-5 w-5 text-muted-foreground/60" />
                    </div>
                    <div className="space-y-1">
                      <p className="font-medium text-foreground/80">Your version lands here.</p>
                      <p className="text-xs">Drop a draft on the left, then hit humanize.</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </Card>
        </div>
      </div>

      <aside className="space-y-5">
        <Card className="p-5">
          <Badge>Tone</Badge>
          <div className="mt-3 grid grid-cols-2 gap-2">
            {TONES.map((t) => (
              <button
                key={t.id}
                onClick={() => setTone(t.id)}
                className={cn(
                  "rounded-xl border border-border p-3 text-left text-sm transition-colors hover:bg-muted",
                  tone === t.id && "border-primary bg-primary/10 text-foreground"
                )}
              >
                <div className="font-medium">{t.label}</div>
                <div className="text-xs text-muted-foreground">{t.hint}</div>
              </button>
            ))}
          </div>
        </Card>

        <Card className="p-5">
          <div className="flex items-center justify-between">
            <Badge>Voice matching</Badge>
            <button
              onClick={() => setShowVoice((v) => !v)}
              className="text-xs text-muted-foreground hover:text-foreground"
            >
              {showVoice ? "Hide" : "Add a sample"}
            </button>
          </div>
          {showVoice && (
            <div className="mt-3 space-y-2">
              <p className="text-xs text-muted-foreground">
                Paste 2-3 paragraphs of your own writing. I&apos;ll match your
                rhythm and word choices.
              </p>
              <Textarea
                value={voiceSample}
                onChange={(e) => setVoiceSample(e.target.value)}
                placeholder="Paste a sample of your writing here."
                className="min-h-[140px] text-xs"
              />
            </div>
          )}
        </Card>

        <Button
          onClick={run}
          disabled={loading || !input.trim()}
          size="lg"
          className="w-full"
        >
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : output ? (
            <RefreshCw className="h-4 w-4" />
          ) : (
            <Sparkles className="h-4 w-4" />
          )}
          {loading ? "Working" : output ? "Run again" : "Humanize"}
        </Button>
      </aside>
    </div>
  );
}
