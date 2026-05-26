# Architecture

## High-level

A Next.js app on Vercel. Server Components by default; Server Actions for mutations; one streaming API route for the humanizer; one webhook route for Stripe. Postgres on Neon, queried with Drizzle. Auth by Clerk. Rate limiting by Upstash. AI by Vercel AI SDK calling OpenAI (with Anthropic as a fallback).

```
Browser
  │
  ├── (marketing) /              → SSR Server Components, no auth
  ├── (app) /app                 → Clerk-gated, client editor + Server Actions
  └── /api/humanize              → Edge runtime, streams text
            │
            ├── Clerk auth check
            ├── Upstash rate limit (per user / per IP for free)
            ├── Drizzle: check plan + usage
            ├── Vercel AI SDK → OpenAI gpt-4o-mini
            │     ├── pass 1: humanize with SKILL prompt
            │     ├── pass 2: audit
            │     └── pass 3: revise
            └── Drizzle: increment word usage
                  │
                  └── PostHog: track event
```

## Why each piece

**Next.js 16 / App Router**: Server Components mean the landing page ships almost no JS. Server Actions remove the need for half the API routes. Turbopack dev is fast.

**Drizzle over Prisma**: lighter, edge-compatible, type-safe without a code generation step. Prisma's bundle bloat hurts edge functions.

**Neon Postgres**: serverless, scales to zero, generous free tier, instant branching for preview deploys. Same SQL skills as any Postgres.

**Clerk over Auth.js**: hosted UI is good out of the box, social login works on day 1, orgs come free for the Business tier later. Costs more at scale but we'll cross that bridge when MRR justifies it.

**Stripe**: subscriptions, trials, proration, tax all solved. Webhooks update our `subscriptions` table; the app reads from there, never trusts the client.

**Vercel AI SDK**: streaming response handling is one line. Swapping providers (OpenAI → Anthropic for outages) is one line. We get back-pressure handling for free.

**Upstash Redis**: edge-friendly rate limiting. Free tier handles 10k requests/day. We use it for anonymous demo + per-user burst limits.

**PostHog**: product analytics + feature flags + session replay in one. Self-hostable later if cost matters.

## Data model

```ts
users          // mirrors Clerk; id = clerk_user_id
  id, email, created_at, plan ('free' | 'pro' | 'business')

subscriptions
  id, user_id, stripe_customer_id, stripe_subscription_id,
  plan, status, current_period_end

usage           // per user, rolling monthly window
  user_id, period_start, words_used

documents       // saved humanized outputs (Pro+)
  id, user_id, tone, voice_sample_hash, input_text, output_text, created_at

voice_samples   // optional per-user sample for voice matching
  user_id, sample_text, updated_at
```

Indexes: `usage(user_id, period_start)`, `documents(user_id, created_at desc)`.

## Plan enforcement

The single source of truth is `usage.words_used` for the current period. Every humanize request:

1. Reads `users.plan`
2. Reads `usage` for the current period (create row if missing)
3. Compares input word count + `words_used` to the plan limit
4. If over: return 402 with upgrade URL
5. If under: process, then `UPDATE usage SET words_used = words_used + N`

This runs inside the API route. The client never decides whether a request is allowed.

## Streaming pipeline

```ts
// pseudo-code
const result = await streamText({
  model: openai('gpt-4o-mini'),
  system: HUMANIZER_SYSTEM_PROMPT,  // built from docs/HUMANIZER-SPEC.md
  messages: [{ role: 'user', content: buildUserMessage(input, tone, voiceSample) }],
})

// Stream pass 1 to client immediately for perceived speed.
// Then run audit + pass 2 server-side and stream the diff.
```

The audit pass is not streamed — it's fast and the user is reading pass 1 while it runs.

## Why no message queue

For MVP, humanize is synchronous from the user's perspective. A request takes 3-8 seconds; that's fine for a "click button → watch it stream" UX. We add a queue if we need batch processing or API customers.

## Failure modes we handle

| Failure | Handling |
|---|---|
| OpenAI rate limit | Fall back to Anthropic Haiku for that request |
| OpenAI outage | Same |
| User over plan limit | 402 + upgrade modal |
| Webhook out of order | Stripe sends events with timestamps; we compare and ignore older |
| Clerk down | Cached session keeps users in; new logins fail with a clear message |
| Neon cold start | First request takes ~1s extra; we don't bother optimizing |

## What we don't have yet (and shouldn't add prematurely)

- Background jobs (no Inngest, no QStash)
- Caching layer beyond Next's built-in
- Microservices (it's a monolith on purpose)
- E2E tests (Playwright comes when the UI stabilizes)
- A design system beyond shadcn (we don't have enough surface area)
