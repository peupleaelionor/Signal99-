# SIGNAL99 — Reuse Report

Tracks what was reused vs. built, and the result of the request to harvest
reusable bricks from other repos.

## 1. Cross-repo harvest — BLOCKED by session scope

The request was to selectively reuse clean bricks (AI wrappers, prompts, JSON
validation, AI fallback, quiz scoring, Supabase helpers, Stripe checkout/webhook,
analytics, dynamic OpenGraph, premium UI, cards/share, PWA, landing, pricing,
trust bar, FAQ/legal, env validation, rate limiting, session recovery,
mobile-first layouts) from other repositories.

This session's GitHub scope is restricted to **`peupleaelionor/signal99-`**.
Read access to every other repo was verified as **denied**:

- `git ls-remote` → no credentials available in this environment.
- GitHub API on `peupleaelionor/qquizz` → *"Access denied: repository not
  configured for this session. Allowed repositories: peupleaelionor/signal99-"*.

Per the brief's fallback rule, the MVP was **not blocked**: it was completed using
the bricks already present in `signal99-` plus the SIGNAL99 pack as the source of
truth. Below is the exact list to add to the session scope so a future pass can
harvest from them.

### Repos to add to scope (relevant, confirmed to exist)

| Repo | Why it's relevant (per metadata) | Bricks to harvest |
| --- | --- | --- |
| `peupleaelionor/qquizz` | Quiz · Next.js · React · Supabase · TS | scoring, Supabase helpers, quiz UI, analytics |
| `peupleaelionor/Qquizz-Prodigy` | Quiz consolidation | scoring, result UI |
| `peupleaelionor/qquizz-frontend` | Quiz frontend | premium quiz components |
| `peupleaelionor/MABELE-CORE` | Core TS platform | AI wrappers, env validation, rate limiting |
| `peupleaelionor/techflow-agency` | Premium portfolio (Next.js/Vercel) | landing sections, premium UI, OG |
| `peupleaelionor/ezonga` | Premium portfolio (Next.js/Vercel) | landing sections, trust bar, pricing |
| `peupleaelionor/failfrenzy-platform` | Premium portfolio (Next.js/Vercel) | premium UI, mobile-first layouts |
| `peupleaelionor/Lumia-` | Recent TS app | AI wrappers, premium UI |
| `peupleaelionor/YAYOFAM-` | Recent TS app | UI, share/cards |
| `peupleaelionor/lmnoxtools` | AI micro-tools | AI prompts, JSON validation, fallback |
| `peupleaelionor/55secondes-` | Timed game | quiz/timer mechanics |

> Harvest rule respected: **none** of these were imported, so no dashboards,
> mandatory auth, marketplaces, messaging, social graphs, heavy deps or unstable
> experimental code entered SIGNAL99.

## 2. Reused from within `signal99-` (already present, kept & adapted)

| Brick | File(s) | Adaptation |
| --- | --- | --- |
| Deterministic scoring | `lib/scoring.ts` | Added the pack tie-breaker (Q7→Q6→stable order) |
| Rarity / combo | `lib/rarity.ts` | New `king_queen` id + English labels |
| Stripe checkout + webhook + verify | `app/api/checkout`, `app/api/stripe/webhook`, `app/api/verify-session`, `lib/stripe.ts` | Kept; currency → USD; English copy |
| Supabase helpers | `lib/supabase.ts`, `lib/results-server.ts` | Kept; added `delivery_orders` store |
| Analytics + funnel | `lib/analytics.ts`, `lib/funnel-metrics.ts` | Kept; expanded event set |
| Dynamic OG / card images | `app/api/og`, `app/api/card` | Kept; English + new ids |
| Premium UI kit | `components/*` (CardShell, PrimaryButton, etc.) | Kept; English copy |
| Local result store | `lib/storage.ts`, `lib/ids.ts` | Kept |

## 3. Built new for this MVP (pack as source of truth)

| Area | Files |
| --- | --- |
| Invisible AI layer + premium fallback | `lib/ai/{schema,validate,fallback,prompt,cache,orchestrator,index}.ts`, `app/api/personalize` |
| Central premium copy + quality filter | `lib/copy.ts`, `lib/ai/validate.ts` (`qualityCheckCopy`) |
| Revenue-first payment (link/checkout/mock) | `lib/config.ts`, `lib/checkout-client.ts` |
| Never-lose-a-payer delivery + admin export | `lib/orders.ts`, `app/api/orders`, `app/api/admin/orders`, `app/delivery`, `app/paid`, `components/DeliveryForm.tsx` |
| 3 card types (public / premium / lockscreen) | `components/SignalCard.tsx` |
| PWA (manifest, SW, offline, install) | `public/manifest.webmanifest`, `public/sw.js`, `public/offline.html`, `components/{ServiceWorkerRegister,InstallPrompt}.tsx`, `app/layout.tsx` |
| Pack data alignment (EN, 7 Signals) | `data/signals.ts`, `data/questions.ts`, `types/index.ts` |
| Pack reference docs | `docs/signal99/*` |

## 4. Risks / follow-ups

- **Payment-link unlock is client-trusted** (revenue-first). For hard
  entitlement, switch `NEXT_PUBLIC_PAYMENT_MODE=stripe_checkout` (webhook is the
  source of truth) once ready.
- **Orders persistence** falls back to in-memory + server logs without Supabase;
  set Supabase env vars for durable storage, and `ADMIN_SECRET` for the export.
- **Signal images** for builder/rebel/protector/oracle reuse existing emblem PNGs
  as clean placeholders until premium renders are produced.
- **AI** is off by default (`AI_PREGENERATE=false`, no key); the premium fallback
  serves identical-shaped content. Add a provider key to enable personalization.
