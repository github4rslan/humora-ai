# Humora AI

Humora turns AI-flavored writing into text that sounds like a real human wrote it. Not "passes a detector" — actually *reads* like a person. Friendly, fast, and aesthetic.

## What this file is for

You're an AI assistant working on this codebase. Read this first. It's the source of truth for stack choices, conventions, and tone. If anything below conflicts with what a file appears to do, ask before "fixing" it.

## Stack

- **Framework**: Next.js 16 (App Router, Server Components, Server Actions, Turbopack)
- **Language**: TypeScript (strict mode)
- **UI**: React 19, Tailwind v4, shadcn/ui, Motion (Framer rebrand), Lucide icons
- **Auth**: Clerk
- **DB**: Neon Postgres + Drizzle ORM
- **Payments**: Stripe (subscriptions + webhooks)
- **AI**: Vercel AI SDK (`ai`, `@ai-sdk/openai`, `@ai-sdk/anthropic`) — OpenAI primary, Anthropic fallback
- **Rate limiting**: Upstash Redis
- **Email**: Resend + React Email
- **Analytics**: PostHog
- **Hosting**: Vercel

## Folder map

```
src/
  app/
    (marketing)/        marketing pages — landing, pricing, blog, legal
    (app)/app/          authed dashboard — humanizer UI lives here
    api/
      humanize/         POST, streams humanized text
      stripe/webhook/   stripe events → DB
  components/
    ui/                 shadcn primitives. Don't edit by hand.
    marketing/          hero, pricing, FAQ — landing page parts
    humanizer/          editor, diff view, tone selector, output panel
  lib/
    ai/
      prompts.ts        SYSTEM PROMPT lives here. Source: docs/HUMANIZER-SPEC.md
      humanize.ts       calls the model, streams response
      audit.ts          the "what makes this obviously AI" second-pass
    db/                 drizzle schema + neon client
    stripe/             plan config, checkout session, webhook handlers
    usage.ts            word counting + plan-limit enforcement
docs/                   product, brand, architecture, roadmap
```

## The humanizer engine

The product's IP is `docs/HUMANIZER-SPEC.md` — a 29-pattern editor prompt sourced from Wikipedia's "Signs of AI writing" guide. `src/lib/ai/prompts.ts` is built from it. **Do not rewrite the prompt casually.** If you need to change behavior, edit `HUMANIZER-SPEC.md` first and regenerate the prompt module from it.

The pipeline:
1. User input → token-budget check → plan-limit check
2. Pass 1: humanize with the 29-pattern prompt + optional voice sample
3. Audit pass: "what still reads as AI?" returns bullet tells
4. Pass 2: revise based on the audit
5. Stream the final result to the client; persist usage to DB

## Plans

| Plan | Price | Words / mo | Notes |
|---|---|---|---|
| Free | $0 | 500 | Account required. No voice matching. |
| Pro | $19 | 50,000 | Voice matching, history, faster queue |
| Business | $49 | Unlimited | Team seats (5), API access, priority |

## Voice and tone (this matters)

Read `docs/BRAND.md` before writing copy. Short version:

- Warm, second-person, conversational. "you" not "users."
- Confident, not corny. We don't write "supercharge" or "unleash."
- Acknowledge the awkward: yes, we're an AI that fixes AI writing. Own it.
- Examples beat adjectives. Show a before/after, don't claim "superior quality."

Do **not** ship copy that violates the patterns in `HUMANIZER-SPEC.md`. Our own marketing has to pass the test.

## Conventions

- Server Components by default. Add `"use client"` only when needed (state, effects, browser APIs).
- Server Actions for mutations from the UI. API routes for streaming and webhooks.
- Use `cn()` from `src/lib/utils.ts` for className merging.
- Forms: `react-hook-form` + `zod` resolvers. Validate on the server too.
- Never trust the client for plan limits — enforce in the API route from the DB.
- Use Drizzle's typed queries; no raw SQL unless there's a measured reason.
- Errors: throw typed errors from `lib/`, render fallbacks in the UI. Don't `try/catch` to swallow.

## What not to do

- Don't add libraries without checking — bundle size matters on the landing page.
- Don't write multi-paragraph comments. One line max, only for non-obvious *why*.
- Don't gate features behind feature flags "for later." YAGNI.
- Don't mock the OpenAI call in dev — use a tiny fixture or hit the real API with a cheap model.
- Don't put long-lived secrets in `.env.local` examples. Use `.env.example` with placeholders.

## Useful commands

```bash
npm run dev          # turbopack dev server
npm run build        # production build
npm run lint
npm run db:push      # drizzle-kit push (when schema changes)
npm run db:studio    # drizzle studio
```
