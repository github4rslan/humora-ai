"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Loader2, Copy, Check, RefreshCw, Sparkles } from "lucide-react";
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
          <Card className="p-5">
            <div className="mb-3 flex items-center justify-between text-xs text-muted-foreground">
              <span>Your draft</span>
              <span>{wordCount} words</span>
            </div>
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Paste the AI text here."
              className="min-h-[420px] border-0 bg-transparent p-0 shadow-none focus-visible:ring-0 focus-visible:ring-offset-0"
            />
          </Card>

          <Card className="relative p-5">
            <div className="mb-3 flex items-center justify-between text-xs text-muted-foreground">
              <span>My version</span>
              {output && (
                <Button
                  onClick={copy}
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  aria-label={copied ? "Copied" : "Copy humanized text"}
                  title={copied ? "Copied" : "Copy humanized text"}
                >
                  {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                </Button>
              )}
            </div>
            <AnimatePresence mode="wait">
              {loading && !output && (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex h-[420px] items-center justify-center text-sm text-muted-foreground"
                >
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Working on it. Give me a sec.
                </motion.div>
              )}
              {output && (
                <motion.div
                  key="output"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="min-h-[420px] whitespace-pre-wrap text-sm leading-relaxed"
                >
                  {output}
                </motion.div>
              )}
              {!loading && !output && (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex h-[420px] items-center justify-center text-sm text-muted-foreground"
                >
                  Drop your text on the left and hit humanize.
                </motion.div>
              )}
            </AnimatePresence>
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
