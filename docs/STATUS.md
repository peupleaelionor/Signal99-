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

## Reste à faire (phase enrichissement, après validation sécurité)

- **Copy premium FR/EN** + i18n (`locales/en.ts`, `locales/fr.ts`) — non hardcodé.
- **Scoring avancé** (polarity, movementStyle, confidenceLabel…) sans rallonger le quiz.
- **3 cartes par Signal** (public viral / premium / lockscreen) + fallback SVG.
- **Compare with a friend** (referral link → comparaison réelle plus tard).
- **AI `compareHook`** + champs enrichis dans le schéma.
- **WebP** : `brand-sheet.png` (1,3 Mo), `app-icon.png` (1,2 Mo), emblèmes ~650 Ko —
  conversion à faire (aucun encodeur dispo dans cet environnement) + `next/image`.
- **Rate limit distribué** : actuellement en mémoire (per-instance) ; passer à
  Upstash/Vercel KV pour le multi-instance.
- **Email réel** depuis `/api/delivery` (actuellement persiste/loggue la demande).
