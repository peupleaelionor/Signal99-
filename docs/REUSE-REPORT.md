# SIGNAL99 — Rapport de réutilisation

## Audit des repos existants

94 repos trouvés sous le compte. Candidats pertinents pour SIGNAL99 :
`qquizz` (quiz Next.js + Supabase), `techflow-agency` / `ezonga` / `failfrenzy-platform`
(vitrines premium Next.js), `MABELE-CORE`, `MABELE.DRC`, `Lumia-`, `55secondes-`,
`Qquizz-Prodigy`.

## Accès

**Le scope de cette session est verrouillé sur `peupleaelionor/signal99-`.** Toute
lecture d'un autre repo est refusée (`Access denied: repository ... is not
configured for this session`), et l'outil `add_repo` n'est pas disponible ici. Je
n'ai donc **pas pu importer de code** depuis `qquizz` & co.

> Pour activer la récupération réelle : rouvrir une session avec ces repos ajoutés
> au scope (ou m'autoriser `add_repo`). Je pourrai alors auditer `qquizz`
> (scoring, helpers Supabase) et les vitrines premium et porter ce qui est propre.

## Couverture actuelle (construit proprement dans SIGNAL99)

Chaque catégorie listée est déjà couverte par du code maison, aligné sur les
conventions du repo — l'import n'est pas nécessaire pour le MVP :

| Besoin | Où c'est dans SIGNAL99 |
| --- | --- |
| Wrappers IA + prompts structurés + génération JSON | `lib/ai/*` (orchestrator, prompt, schema, validate, fallback, cache) |
| Supabase helpers | `lib/supabase.ts`, `lib/results-server.ts`, `supabase/schema.sql` |
| Stripe checkout | `app/api/checkout`, `app/api/stripe/webhook`, `app/api/verify-session`, `lib/stripe.ts` |
| Analytics | `lib/analytics.ts`, `lib/funnel-metrics.ts` |
| OpenGraph (dynamique) | `app/api/og`, `app/api/card`, metadata `share/[slug]` |
| UI premium / mobile-first | `components/*` (PrimaryButton, CardShell, LayoutContainer…) |
| Cartes partageables | `components/SignalCard`, `SignalEmblem`, `app/api/card` |
| Landing / pricing / FAQ / trust bar / legal | `app/page.tsx`, `PricingBlock`, `FAQ`, `TrustBar`, `app/{legal,privacy,terms}` |
| Env validation | `lib/config.ts` (accès typé centralisé) + `.env.example` |
| PWA mobile-first | `public/manifest.webmanifest`, `public/sw.js`, `public/offline.html`, `PwaRegister`, `InstallPrompt` |

## Risques restants

- Pas de portage depuis `qquizz` : si du scoring/Supabase y est déjà éprouvé, on
  duplique un peu. À réconcilier si tu ouvres le scope.
- Rate limiting : non implémenté (les routes IA/checkout pourraient en bénéficier).
  À ajouter (ex. Upstash) quand le trafic le justifie.
