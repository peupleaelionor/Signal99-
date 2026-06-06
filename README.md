# SIGNAL99

> **What’s your Signal?** — Answer 7 questions, reveal your dominant Signal, and
> get your personal card to keep and share. **$0.99.**
>
> _Your energy speaks before you do._

SIGNAL99 is a premium, mobile-first, **installable PWA** for symbolic personal
identity, built as a conversion + virality machine:
curiosity → quiz → locked result → payment → result → card → share → new visitors.

It is **not** an AI app, an horoscope, fortune-telling or a psychological
diagnosis. The AI is invisible; the magic is visible.

## Stack

- **Next.js 14** (App Router) · **TypeScript strict** · **Tailwind CSS**
- **Framer Motion** micro-animations
- **Revenue-first payments**: Stripe Payment Link · Stripe Checkout · dev mock
- **Invisible AI** (OpenAI / Anthropic / OpenRouter) with a **premium
  deterministic fallback** — dependency-free JSON + quality validation
- **Supabase** (optional) for purchases + delivery orders
- **PWA**: manifest, service worker, offline fallback, discreet install prompt
- Dynamic card / OG images via `next/og`

## Quick start

```bash
npm install
cp .env.example .env.local   # adjust variables (see below)
npm run dev                  # http://localhost:3000
```

No keys are needed to explore: with `NEXT_PUBLIC_ENABLE_MOCK_PAYMENT=true` a dev
**“Simulate payment”** button unlocks the result, and the premium fallback
generates the full result without any AI key.

### Scripts

| Command | Role |
| --- | --- |
| `npm run dev` | Dev server |
| `npm run build` | Production build |
| `npm run start` | Serve the build |
| `npm run lint` | ESLint |
| `npm run typecheck` | `tsc --noEmit` |

## Revenue-first: get paid in 24–48h

Set `NEXT_PUBLIC_PAYMENT_MODE`:

- `payment_link` — the **“Unlock my card — $0.99”** button redirects to a hosted
  Stripe/PayPal Payment Link (configure its success URL to `/paid`). Fastest to
  cash. The result id is passed as `client_reference_id` and remembered locally so
  `/paid` can unlock and route to the result.
- `stripe_checkout` — full Checkout + webhook (server source of truth) → `/success`.
- `mock_dev` — dev-only simulated unlock.

**Never lose a payer:** if automatic unlock fails (e.g. cross-device), the user
lands on `/paid` or `/delivery` and submits an email / Instagram handle. It is
saved via `POST /api/orders` (Supabase `delivery_orders` if configured, otherwise
in-memory + server log) so the card can be delivered manually.

**Admin export:** `GET /api/admin/orders?secret=<ADMIN_SECRET>` (add `&format=csv`
for CSV). Disabled when `ADMIN_SECRET` is unset.

## Invisible AI

Default: `AI_PREGENERATE=false`. The Signal is always chosen by **deterministic
scoring** — the AI only personalizes the text **after payment**.

Pipeline (`lib/ai/orchestrator.ts`):
`cache → AI (if a provider key is set) → JSON validation → quality/safety filter → premium fallback`.

The user **never** sees an AI error: if the AI is slow, down, invalid or unsafe,
the premium fallback (`lib/ai/fallback.ts`, built from `data/signals.ts`) serves
identical-shaped content. Add `OPENAI_API_KEY` / `ANTHROPIC_API_KEY` /
`OPENROUTER_API_KEY` to enable personalization.

## Test the full funnel

1. **Landing** `/` — 2-second pitch, the 7 Signals, “Reveal my Signal”. No price.
2. **Test** `/test` — 7 questions, one per screen, auto-advance, instinct microcopy.
3. **Locked result** `/result/[id]` — “Your Signal is ready.” Teaser only, never
   reveals the Signal. Price appears here: **“Unlock my card — $0.99”**.
4. **Payment** — payment link / Checkout / mock.
5. **Unlocked result** — stepped premium reveal: name → mirror phrase → social
   energy → hidden strength → soft shadow → direction → power phrase → guidance →
   recommendations → **3 cards** (premium / public viral / lockscreen) → share /
   compare / download.
6. **Share** `/share/[slug]?s=<signal>` — viral page with dynamic OG per Signal.
7. **Delivery** `/delivery` / `/paid` — contact capture fallback.

> Mock: on the locked screen click **“[dev] Simulate payment”** → result unlocks.

## The 7 Signals

King / Queen · Strategist · Visionary · Builder · Rebel · Protector · Oracle.
Source of truth: `data/signals.ts` (premium copy) and `docs/signal99/`.

## Environment variables

See [`.env.example`](./.env.example). Highlights: `NEXT_PUBLIC_SITE_URL`,
`NEXT_PUBLIC_PAYMENT_MODE`, `NEXT_PUBLIC_SIGNAL99_PAYMENT_LINK`,
`NEXT_PUBLIC_ENABLE_MOCK_PAYMENT`, `AI_PREGENERATE`, provider keys, `ADMIN_SECRET`,
Stripe keys, Supabase keys.

## Database (optional)

Schema in [`supabase/schema.sql`](./supabase/schema.sql): `quiz_results`,
`purchases`, `delivery_orders`, `credits`. Without Supabase the app degrades
gracefully (results in `localStorage`, orders in memory + logs).

## Structure

```
app/            routes + API (checkout, personalize, orders, admin, card/og, webhook)
components/     UI (Hero, QuizFlow, Result*, SignalCard, DeliveryForm, PWA…)
data/           signals.ts (7 Signals), questions.ts (7 questions)
lib/            scoring, rarity, ai/*, copy, config, orders, analytics, share…
public/         brand + signals images, manifest.webmanifest, sw.js, offline.html
docs/signal99/  the SIGNAL99 pack (source of truth)
docs/REUSE-REPORT.md
```

## Disclaimer

SIGNAL99 is a symbolic and introspective experience for entertainment and
self-reflection. Results are not scientific, medical, psychological, financial, or
spiritual advice.
