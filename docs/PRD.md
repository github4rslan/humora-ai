# Humora AI — Product Requirements

## What it is

A web app that takes AI-generated text and rewrites it so it reads like a person wrote it. The user pastes a draft, picks a tone, optionally provides a voice sample, and gets back a revised version with the AI tells removed.

## Who it's for

- **Marketers and content writers** cleaning up AI drafts before publishing
- **Students** who want their AI-assisted writing to sound like them
- **Founders and indie hackers** writing blog posts, sales pages, emails
- **Agencies** processing volume — they buy the Business tier for seats and API access

## What it's not

We're not a "bypass AI detection" tool, even though the output will read more natural to detectors as a side effect. The framing is "make AI drafts sound like you wrote them." This is intentional. It avoids platform-policy risk and reaches a bigger audience.

## Core user flow

1. Land on `/` → see the value, hit "Try free" or paste text into the inline demo
2. Demo runs (rate-limited, no auth, 200 words max) → shows real output
3. Sign up to get full word counts and the dashboard
4. Dashboard `/app` → paste, pick tone, paste optional voice sample, hit humanize
5. Stream output appears; user can copy, regenerate, or save to history
6. Hit the plan word limit → upgrade modal → Stripe checkout

## Pricing

| Plan | Monthly | Words / mo | What's included |
|---|---|---|---|
| Free | $0 | 1,000 | One tone, basic output |
| Pro | $9 | 30,000 | All tones, voice matching, history, side-by-side diff |
| Business | $29 | 200,000 | 5 seats, API access, priority queue, custom tones |

Annual: 2 months free (Pro $90/yr, Business $290/yr).

## MVP scope (what ships first)

- Landing page (hero, demo, social proof slot, pricing, FAQ, footer)
- Auth (Clerk: email, Google, GitHub)
- Dashboard with humanizer (paste → humanize → stream output)
- Tone selector: Natural, Casual, Professional, Academic
- Plan limits enforced by DB
- Stripe checkout for Pro
- Settings page (manage subscription, sign out)

## Out of scope for MVP

- Voice matching from sample (Pro feature, ship in week 2)
- History / saved documents (ship in week 3)
- Team seats and Business tier
- API access
- Browser extension
- Mobile app

## Success metrics

- Day 1: landing page deploys, demo works for anonymous users
- Week 1: first paid signup
- Month 1: 100 signups, 10 paid, $90 MRR
- Month 3: 1,000 signups, 100 paid, $900 MRR

These are *targets*, not promises. Reality usually under-shoots month 1 and over-shoots month 3 if the product is good.

## Differentiators

1. **Wikipedia-grounded prompt.** Our humanizer is built on `docs/HUMANIZER-SPEC.md` — 29 patterns sourced from Wikipedia's "Signs of AI writing" page. Most competitors run a vague "make this sound human" prompt. Ours is specific.
2. **Voice matching.** Pro users paste 2-3 paragraphs of their own writing; we match rhythm and word choice, not just remove AI-isms.
3. **Audit pass.** After the first rewrite, the model is prompted "what still reads as AI in this?" and revises again. Two passes beats one.
4. **Aesthetic.** Most humanizer sites look like 2014 SEO landing pages. We don't.
