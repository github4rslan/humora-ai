"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Loader2, ArrowDown, Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

const SAMPLE = `In today's rapidly evolving technological landscape, AI-assisted coding stands as an enduring testament to the transformative potential of large language models, marking a pivotal moment in the evolution of software development. It's not just about autocomplete—it's about unlocking creativity at scale, ensuring that organizations can remain agile while delivering seamless experiences.`;

export function Demo() {
  const [input, setInput] = useState(SAMPLE);
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  async function run() {
    if (!input.trim() || loading) return;
    setLoading(true);
    setOutput("");
    try {
      const res = await fetch("/api/humanize/demo", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ text: input, tone: "natural" }),
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
        <Card className="p-5">
          <div className="mb-3 flex items-center justify-between text-xs text-muted-foreground">
            <span>Your AI draft</span>
            <span>{input.trim().split(/\s+/).filter(Boolean).length} words</span>
          </div>
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Paste something an AI wrote for you."
            className="min-h-[260px] border-0 bg-transparent p-0 shadow-none focus-visible:ring-0 focus-visible:ring-offset-0"
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
                className="flex h-[260px] items-center justify-center text-sm text-muted-foreground"
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
                className="min-h-[260px] whitespace-pre-wrap text-sm leading-relaxed"
              >
                {output}
              </motion.div>
            )}
            {!loading && !output && (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex h-[260px] items-center justify-center text-sm text-muted-foreground"
              >
                I&apos;ll drop my version right here.
              </motion.div>
            )}
          </AnimatePresence>
        </Card>
      </div>

      <div className="mt-6 flex justify-center">
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
