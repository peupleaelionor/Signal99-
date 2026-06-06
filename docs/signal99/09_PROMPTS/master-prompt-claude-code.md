# MASTER PROMPT CLAUDE CODE — SIGNAL99

Tu es Claude Code. Agis comme Staff Product Engineer, Product Designer, Growth Engineer, UX Strategist, Security Reviewer et AI Systems Architect.

Construis / finalise le MVP premium SIGNAL99 dans ce repo.

## Vision
SIGNAL99 est une expérience mobile-first d’identité personnelle.

Promesse : **What’s your Signal?**
Phrase centrale : **Your energy speaks before you do.**
Produit : 7 questions → Signal dominant → carte unique → partage.

Ne présente jamais SIGNAL99 comme une app IA, horoscope, voyance ou diagnostic.
L’IA est invisible. La magie est visible.

## MVP à construire
1. Landing premium.
2. Quiz 7 questions.
3. Scoring déterministe.
4. Résultat verrouillé.
5. Paiement Stripe / mock dev.
6. Résultat débloqué.
7. IA invisible après paiement par défaut.
8. Fallback premium si IA échoue.
9. 3 types de cartes : publique, premium, lockscreen.
10. Page `/share/[slug]`.
11. PWA mobile-first.
12. Analytics events.
13. Legal pages.

## Assets à intégrer
Copier :
- `/public/brand/hero-signal99.png`
- `/public/brand/intro-7-questions.png`
- `/public/brand/seven-signals.png`
- `/public/signals/king-queen.png`
- `/public/signals/strategist.png`
- `/public/signals/visionary.png`

Utiliser `next/image`. Priorité uniquement sur hero. Lazy load pour les autres.

## Landing
Title: What’s your Signal?
Subtitle: Your energy speaks before you do. Answer 7 questions and reveal the card that reflects your presence.
CTA: Reveal my Signal
Secondary CTA: See the 7 Signals
Trust bar: 60 seconds / Unique card / Secure payment / No account needed

## Quiz
Utiliser `03_QUIZ/questions.json`.
1 question par écran. Boutons larges. Sauvegarde localStorage après chaque réponse.

## Locked result
Title: Your Signal is ready.
Text: Your answers reveal a clear dominant presence. Your full profile includes your Signal, hidden strength, social energy and personal card.
CTA: Unlock my card — $0.99
Trust: Instant result. Secure payment. No account needed.

Ne révèle jamais le Signal avant paiement.

## AI
`AI_PREGENERATE=false` par défaut.
L’IA s’exécute après paiement.
Créer :
- `lib/ai/orchestrator.ts`
- `lib/ai/prompt.ts`
- `lib/ai/schema.ts`
- `lib/ai/validate.ts`
- `lib/ai/fallback.ts`
- `lib/ai/cache.ts`

L’IA retourne uniquement JSON strict selon `04_AI/ai-schema.json`.
Si erreur, timeout, JSON invalide ou safety fail : fallback premium. Jamais d’erreur IA visible utilisateur.

## Result page
Afficher :
- dominant Signal
- secondary Signal
- mirror phrase
- hidden strength
- soft shadow
- social energy
- What should you do with your Signal?
- Recommended for your Signal
- power phrase
- cards
- share/download/compare buttons

## Cards
1. Public viral card : I’m [Signal]. What’s your Signal?
2. Premium personal card : Signal + secondary + mirror + strength + shadow + power.
3. Lockscreen card : Signal + power phrase.

## Recommendations
Ajouter bloc `RecommendedForYourSignal` category-based. Si sponsorisé plus tard, afficher label clair.

## Payment
Stripe Checkout $0.99. Mock dev autorisé seulement si `NEXT_PUBLIC_ENABLE_MOCK_PAYMENT=true` et jamais en production.

## Share page
`/share/[slug]` :
Title: I’m [Signal]. What’s your Signal?
Description: Discover your Signal in 7 questions.
Use signal image if available, fallback hero.

## PWA
manifest, icons, theme #050505, offline fallback, install prompt discret.

## Analytics
Implémenter `lib/analytics.ts` avec events listés dans `11_ANALYTICS/events.md`.

## Legal
Afficher disclaimer :
SIGNAL99 is a symbolic and introspective experience for entertainment and self-reflection. Results are not scientific, medical, psychological, financial, or spiritual advice.

## Quality
Run:
- lint
- typecheck
- build

Do not overbuild. Keep MVP simple, premium, fast, mobile-first and shareable.

Final criterion: a mobile user must understand in 2 seconds: “I want to know my Signal.”
