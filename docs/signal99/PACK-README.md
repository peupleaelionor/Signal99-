# SIGNAL99 — GitHub Ready Master Pack

SIGNAL99 est une expérience digitale premium d’identité personnelle.

**Promesse :** What’s your Signal?  
**Phrase centrale :** Your energy speaks before you do.  
**Mécanique :** 7 questions → Signal dominant → carte unique → partage.

Ce pack contient tout ce qu’il faut remettre dans le repo avant ou pendant la phase code : brand, produit, quiz, IA invisible, copywriting, assets, social, PWA, analytics, prompts Claude Code/Lovable/Recraft, légal.

## Structure recommandée dans le repo

```txt
/public/brand/
/public/signals/
/docs/signal99/
/data/signals.ts
/data/questions.ts
/lib/scoring.ts
/lib/ai/*
/lib/analytics.ts
/lib/experiments.ts
/app/test
/app/result/[id]
/app/share/[slug]
```

## Ordre d’intégration

1. Copier `06_ASSETS/public` vers `/public`.
2. Copier les docs vers `/docs/signal99`.
3. Utiliser `09_PROMPTS/master-prompt-claude-code.md` pour Claude Code.
4. Utiliser `03_QUIZ/questions.json` et `02_PRODUCT/signals.json` comme base data.
5. Garder l’IA invisible et après paiement par défaut : `AI_PREGENERATE=false`.
