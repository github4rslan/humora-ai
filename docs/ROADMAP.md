# Roadmap

## Phase 0 — Scaffolding (today)

- [x] Next.js 16 + TS + Tailwind v4
- [x] Folder structure, docs, brand
- [ ] shadcn/ui installed and themed
- [ ] `.env.example` with all keys
- [ ] CLAUDE.md committed

## Phase 1 — Landing page (this week)

- [ ] Hero with inline demo widget (rate-limited, no auth)
- [ ] Before/After comparison section
- [ ] Pricing table (Free / Pro / Business)
- [ ] FAQ
- [ ] Footer with legal links
- [ ] SEO meta + Open Graph image
- [ ] Mobile responsive

## Phase 2 — Auth + dashboard

- [ ] Clerk sign in/up with Google + GitHub
- [ ] `/app` protected route
- [ ] Editor UI (paste box, tone selector, output panel, copy button)
- [ ] User menu (settings, sign out)

## Phase 3 — Humanizer engine

- [ ] `src/lib/ai/prompts.ts` from `HUMANIZER-SPEC.md`
- [ ] `POST /api/humanize` streaming endpoint
- [ ] Pass 1 → audit → pass 2 pipeline
- [ ] Anthropic Haiku fallback wired
- [ ] Error states (rate limit, over plan, model error)

## Phase 4 — Plans and billing

- [ ] Drizzle schema + Neon connection
- [ ] Usage tracking with monthly reset
- [ ] Stripe products + prices (Pro $19, Business $49)
- [ ] Checkout session route
- [ ] Webhook handler (subscription created / updated / cancelled)
- [ ] Upgrade modal when over limit
- [ ] Billing portal link in settings

## Phase 5 — Pro features

- [ ] Voice sample upload (analyze + store)
- [ ] History (list saved humanizations)
- [ ] Side-by-side diff view
- [ ] Export to .md / .docx

## Phase 6 — Growth

- [ ] Public sharing of before/after (with consent) for marketing
- [ ] Blog with SEO content (humanizer comparisons, writing guides)
- [ ] Chrome extension (humanize in any textarea)
- [ ] API for Business customers
- [ ] Referral program (free month for each paid signup)

## Things we'll be tempted to build and shouldn't yet

- Team workspaces — wait until 50+ Business signups ask
- Mobile app — the web works on mobile, ship the PWA manifest instead
- AI detector — adjacent product, separate decision
- Multi-language — start English-only until product-market fit in EN
