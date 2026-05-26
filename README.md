# Humora AI

> Hi, I&apos;m Humora. I&apos;ll humanize your AI text.

A web app that rewrites AI-generated drafts so they read like a person wrote them. Built on the 29-pattern Wikipedia guide to AI tells, with a two-pass audit pipeline.

## Stack

- **Framework**: Next.js 16 (App Router, React 19, Turbopack)
- **Auth**: Clerk
- **Database**: MongoDB Atlas + Mongoose
- **Payments**: Stripe (subscriptions + webhooks)
- **AI**: Vercel AI SDK with OpenAI gpt-4o-mini + Anthropic Claude Haiku fallback
- **Rate limiting**: Upstash Redis
- **Email**: Resend + React Email
- **Analytics**: PostHog
- **Hosting**: Vercel

## Quick start

```bash
git clone <this-repo>
cd humora-ai
npm install
cp .env.example .env.local
# fill in the required keys (at minimum: Clerk, OpenAI, MongoDB)
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Required environment variables

| Variable | Required for | Get from |
|---|---|---|
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Auth (boot blocker) | [dashboard.clerk.com](https://dashboard.clerk.com) |
| `CLERK_SECRET_KEY` | Auth (boot blocker) | [dashboard.clerk.com](https://dashboard.clerk.com) |
| `OPENAI_API_KEY` | The humanizer itself | [platform.openai.com](https://platform.openai.com/api-keys) |
| `MONGODB_URI` | Storage | [cloud.mongodb.com](https://cloud.mongodb.com) |
| `NEXT_PUBLIC_APP_URL` | Absolute URLs in emails/redirects | self (e.g. `http://localhost:3000`) |

Optional but recommended:

| Variable | What it enables |
|---|---|
| `UPSTASH_REDIS_REST_URL` + `UPSTASH_REDIS_REST_TOKEN` | Rate limiting (anon demo + per-user burst) |
| `RESEND_API_KEY` + `CLERK_WEBHOOK_SIGNING_SECRET` | Welcome emails on signup |
| `STRIPE_SECRET_KEY` + `STRIPE_PRO_PRICE_ID` + `STRIPE_BUSINESS_PRICE_ID` + `STRIPE_WEBHOOK_SECRET` | Paid subscriptions |
| `ANTHROPIC_API_KEY` | Fallback when OpenAI is down |
| `NEXT_PUBLIC_POSTHOG_KEY` + `NEXT_PUBLIC_POSTHOG_HOST` | Analytics (not wired yet) |
| `ADMIN_USER_IDS` | Access to `/admin` dashboard (comma-separated Clerk user IDs) |

## Project structure

```
src/
  app/
    (marketing)         /  landing, pricing, FAQ (sentence-cased, friendly tone)
    app                 /  authed dashboard with the humanizer UI
    admin               /  admin overview, users, activity (gated by ADMIN_USER_IDS)
    api/
      humanize          POST, streams humanized text
      humanize/demo     POST, anon demo with rate limit
      stripe/webhook    Stripe subscription events
      stripe/checkout   create Stripe checkout sessions
      webhooks/clerk    Clerk user.created → welcome email
    sign-in, sign-up
  components/
    ui                  shadcn primitives
    marketing           hero, demo, pricing, FAQ
    humanizer           editor, tone selector, output panel
  emails/               React Email templates
  lib/
    ai/                 prompts (29-pattern spec), humanize pipeline
    db/                 Mongoose schema + connection
    stripe/             Stripe client
    admin.ts            isAdmin guard + stats queries
    usage.ts            plan enforcement + monthly word counting
    email.ts            Resend client + sendWelcomeEmail
    ratelimit.ts        Upstash limiters
    plans.ts            Free/Pro/Business definitions
docs/
  HUMANIZER-SPEC.md     the 29-pattern editor spec (source of truth)
  BRAND.md              voice and tone guide
  PRD.md                product requirements
  ARCHITECTURE.md       why each piece was chosen
  ROADMAP.md            phased plan
CLAUDE.md               instructions for AI assistants working on this repo
```

## Commands

```bash
npm run dev          # turbopack dev server
npm run build        # production build
npm run start        # serve the production build
npm run lint
npm run typecheck    # tsc --noEmit
```

## Deployment

This project deploys cleanly to Vercel:

1. Push the repo to GitHub
2. Import the repo on [vercel.com](https://vercel.com)
3. Paste every env var from `.env.local` (with rotated production values) into Vercel&apos;s env settings
4. Click Deploy
5. After deploy: update `NEXT_PUBLIC_APP_URL` to your live domain, add the domain to Clerk allowed origins, update the Clerk webhook endpoint to `https://your-domain/api/webhooks/clerk`

See [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) for the full system overview.

## License

Private. All rights reserved.
