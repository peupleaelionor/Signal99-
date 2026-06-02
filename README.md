# SIGNAL99

> **Quel est ton Signal ?** — Réponds à 7 questions, découvre ton archétype dominant, et reçois ta carte personnelle à partager. 0,99 €.

SIGNAL99 est une expérience mobile-first d'identité personnelle, pensée comme une **machine de conversion + viralité** : curiosité → test → résultat verrouillé → paiement → carte → partage → nouveaux visiteurs.

## Stack

- **Next.js 14** (App Router) · **TypeScript strict** · **Tailwind CSS**
- **Framer Motion** (micro-animations)
- **Stripe Checkout** (paiement unique 0,99 €, architecture crédits/upsell prête)
- **Supabase** (optionnel — persistance serveur des achats)
- Génération de carte / OG via `next/og` (PNG serveur)

## Démarrer

```bash
npm install
cp .env.example .env.local   # ajuste les variables (voir ci-dessous)
npm run dev                  # http://localhost:3000
```

Aucune clé n'est nécessaire pour explorer le produit : sans Stripe configuré et
avec `NEXT_PUBLIC_ENABLE_MOCK_PAYMENT=true`, un bouton **« Simuler le paiement »**
(dev uniquement) débloque le résultat.

### Scripts

| Commande | Rôle |
| --- | --- |
| `npm run dev` | Serveur de développement |
| `npm run build` | Build de production |
| `npm run start` | Sert le build |
| `npm run lint` | ESLint (next/core-web-vitals) |
| `npm run typecheck` | Vérification TypeScript (`tsc --noEmit`) |

## Tester le tunnel complet

1. **Landing** `/` — pitch en < 2 s, les 7 Signaux, CTA « Commencer le test ».
2. **Test** `/test` — 7 questions, une par écran, progression `n/7`, auto-avance.
3. **Résultat verrouillé** `/result/[id]` — teasing (rareté/combo) sans révéler le Signal, CTA « Débloquer pour 0,99 € ».
4. **Paiement** — Stripe Checkout (ou mock dev). Retour sur `/success` qui **vérifie la session côté serveur** puis débloque.
5. **Résultat débloqué** — Signal dominant/secondaire, force cachée, danger, énergie sociale, conseil, phrase de pouvoir, **carte personnelle**, partage + upsell.
6. **Partage** `/share/[slug]?s=<signal>` — page publique virale avec **OG dynamique** par Signal.

> En mock : sur l'écran verrouillé, clique « Simuler le paiement » → le résultat se débloque immédiatement.

## Variables d'environnement

Voir [`.env.example`](./.env.example). Résumé :

- `NEXT_PUBLIC_SITE_URL` — base des liens de partage / OG / redirections Stripe.
- `NEXT_PUBLIC_ENABLE_MOCK_PAYMENT` — bouton de simulation (dev only, désactivé en prod).
- `NEXT_PUBLIC_ENABLE_UPSELL` — active le Pack complet (laisser `false` tant que le contenu n'est pas livré).
- `STRIPE_SECRET_KEY` / `STRIPE_WEBHOOK_SECRET` / `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` / `STRIPE_PRICE_SIGNAL99`.
- `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY` / `SUPABASE_SERVICE_ROLE_KEY` (optionnel).

## Paiement (Stripe)

- `POST /api/checkout` crée une session Checkout (metadata `quiz_result_id`, `result_token`, `sku`).
- `POST /api/stripe/webhook` — **seule source de vérité** du statut payé ; vérifie la signature et persiste l'achat (si Supabase).
- `GET /api/verify-session` — utilisé par `/success` pour confirmer le paiement côté serveur avant de révéler le résultat.

Le client ne valide **jamais** un paiement seul.

Configurer le webhook en local :

```bash
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

## Base de données (optionnelle)

Schéma dans [`supabase/schema.sql`](./supabase/schema.sql) : `quiz_results`, `purchases`, `credits`.
Sans Supabase, les résultats sont stockés dans le navigateur (localStorage) et
référencés par un id non devinable — aucune inscription requise.

## Structure

```
app/            routes (App Router) + routes API (checkout, webhook, card/og)
components/     UI réutilisable (Hero, QuizFlow, Result*, SignalCard, Share…)
data/           signals.ts (7 archétypes), questions.ts (7 questions)
lib/            scoring, rarity, analytics, funnel-metrics, experiments, stripe, supabase, storage…
public/brand/   logo, app icon, et les 7 emblèmes d'archétypes
types/          types partagés
```

## Architecture future (prévue, non construite)

Love / Money / Creator / Couple / Daily / Friend Signal · Aura Card · crédits ·
abonnement · multi-langue FR/EN · parrainage · leaderboard. Le MVP reste centré
sur **« Quel est ton Signal ? »**.

## Disclaimer

SIGNAL99 est une expérience symbolique et introspective destinée au
divertissement et au développement personnel. Les résultats ne constituent pas
une vérité scientifique, médicale, psychologique, financière ou spirituelle.
