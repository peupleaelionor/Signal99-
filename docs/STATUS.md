# SIGNAL99 — Statut (sécurité & revenue-first)

Mise à jour : correctif paywall serveur + Stripe lié au résultat + persistance abstraite.

## Critère final de mise en vente

| Exigence | État |
| --- | --- |
| Impossible de débloquer le premium via localStorage | ✅ |
| Impossible d'utiliser un paiement pour plusieurs résultats | ✅ |
| `/api/personalize` protégé (paiement vérifié serveur) | ✅ |
| Tunnel complet fonctionnel | ✅ |
| Fallback premium (template) | ✅ |
| Paiement Stripe Checkout **ou** Payment Link | ✅ |
| build / lint / typecheck OK | ✅ |
| Analytics minimum actif (Plausible/PostHog) | ✅ |

## Modèle de sécurité du paiement

Source de vérité = **serveur** (Stripe + store durable), jamais le navigateur.

- **Création checkout** → `metadata.quiz_result_id`, `result_token`, `sku`.
- **Vérification** (`/api/verify-session`, `/api/result-status`, `/api/personalize`)
  passe par `verifyResultPaid()` qui valide via `validatePaidSession()` :
  `payment_status === "paid"` **et** `metadata.quiz_result_id === id demandé`
  **et** `amount_total` attendu **et** `currency` attendue.
- **Un paiement = un quiz_result_id** : une session ne déverrouille que le résultat
  pour lequel elle a été créée.
- **localStorage** : UX / session recovery uniquement. Modifier `isPaid` localement
  ne débloque rien (le contenu premium vient de `/api/personalize`, gardé serveur).

## Abstraction storage — `lib/storage/`

| Adapter | Durable | Usage |
| --- | --- | --- |
| `stripe-only` | non | MVP rapide, sans DB. Paiement re-vérifié en direct via Stripe. |
| `supabase` | oui | Recommandé prod : recovery cross-device, webhook = source persistante. |
| `kv` | non | Cache mémoire optionnel (per-instance). |

Sélection : `STORAGE_DRIVER` (`auto` par défaut → Supabase si configuré, sinon stripe-only).

## Phase 2 — Plateforme de cartes (livré)

- **Scoring 100 % serveur** : `POST /api/result/create` calcule le Signal ; le
  client n'envoie que ses réponses brutes et ne connaît jamais le Signal avant
  paiement (record local sans `dominantSignal`/`scores`).
- **Signal caché avant paiement** : révélé uniquement par `/api/personalize`
  (gated). L'écran verrouillé ne montre qu'un teaser de rareté (sans nom).
- **Système de cartes** : 99 cartes/Signal déterministes (`data/cards.ts`),
  7 niveaux de rareté, 14 catégories, 3 couches de copy + teaser verrouillé.
- **Collection 1/99** : page `/collection/[id]` + `POST /api/collection` (gated,
  copy premium retirée des cartes verrouillées).
- **Paliers d'upsell** : `signal_unlock` (1), `bonus_pack` (4), `complete_pack`
  (13), `collection_99` (99) — résolus serveur depuis le SKU Stripe.
- **i18n FR/EN** : `locales/{fr,en}.ts` + `lib/i18n.ts` (FR par défaut).
- **Docs** : `SIGNAL99_CARDS_SYSTEM.md`, `COPY_GUIDE.md`, `CARD_LIBRARY_SEED.md`.

## Reste à faire (prochaines itérations)

- **Adoption i18n dans l'UI** : les dictionnaires existent ; reste à brancher les
  composants existants (landing/quiz/résultat) sur `getDictionary`.
- **99 cartes authored / Signal** : remplacer les facettes générées (`#7→#99`) par
  des cartes nommées + `visualPrompt` + illustrations originales.
- **Compare ami réel** : structure prête (referral) ; comparaison de deux Signaux
  (`/compare/[slug]`, cartes `comparaison`) à implémenter.
- **Multi-SKU durable** : agrégation des achats multiples nécessite Supabase
  (table `purchases`) ; en stripe-only, le palier = SKU de la session vérifiée.
- **Scoring avancé** (polarity, movementStyle, confidenceLabel…) sans rallonger le quiz.
- **WebP** : `brand-sheet.png` (1,3 Mo), `app-icon.png` (1,2 Mo), emblèmes ~650 Ko —
  conversion à faire (aucun encodeur dispo dans cet environnement) + `next/image`.
- **Rate limit distribué** : actuellement en mémoire (per-instance) ; passer à
  Upstash/Vercel KV pour le multi-instance.
- **Email réel** depuis `/api/delivery` (actuellement persiste/loggue la demande) —
  brancher Resend.
