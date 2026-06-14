/**
 * French dictionary (default locale). Keep keys flat and stable; English mirrors
 * this shape in en.ts. Copy must follow docs/COPY_GUIDE.md.
 */
export const fr = {
  brand: {
    tagline: "Ton énergie parle avant toi.",
    promise: "Révèle ton Signal. Débloque tes cartes. Collectionne ton identité.",
    collectionLine: "99 cartes. 1 Signal. Une identité à collectionner.",
  },
  home: {
    heroSub:
      "Réponds à 7 questions. Révèle ton Signal. Débloque ta première carte.",
    ctaPrimary: "Révéler mon Signal",
    ctaSecondary: "Voir les cartes",
  },
  quiz: {
    microcopy: [
      "Suis ton premier instinct.",
      "Aucune mauvaise réponse.",
      "Ton Signal se forme.",
      "Ton schéma se précise.",
      "Encore une réponse.",
      "Ta carte est presque prête.",
    ],
    footer: "Aucune inscription. 7 questions. 60 secondes.",
  },
  locked: {
    title: "Ton Signal est prêt.",
    body: "Une carte unique a été générée pour toi.",
    body2: "Débloque-la pour découvrir ce que ton énergie révèle.",
    cta: "Débloquer ma carte — 0,99 €",
    trust: "Résultat instantané. Paiement sécurisé. Aucun compte requis.",
    comboDetected: "Combinaison spéciale détectée",
    alreadyPaid: "Déjà payé ?",
    recover: "Récupérer ma carte",
  },
  result: {
    dominant: "Ton Signal dominant",
    secondary: "Ton Signal secondaire",
    hiddenStrength: "Ta force cachée",
    shadow: "Ton danger intérieur",
    socialEnergy: "Ton énergie sociale",
    advice: "Ton conseil du jour",
    powerPhrase: "Ta phrase de pouvoir",
    yourCard: "Ta carte personnelle",
    revealing: "Révélation de ton Signal…",
  },
  collection: {
    title: "Ta collection",
    revealed: "cartes révélées",
    locked: "Verrouillé",
    complete: "Complète ta collection.",
    completeSub: "Débloque tes 99 cartes, tes cartes rares et le comparateur ami.",
    bonusCta: "Débloquer mes 3 cartes bonus — 2,99 €",
    seeCollection: "Voir ma collection",
    collection99Cta: "Compléter ma Collection 99 — 9,99 €",
  },
  share: {
    cta: "Révéler mon Signal",
    foundSignal: (signal: string) =>
      `Quelqu'un a découvert son Signal : ${signal}.`,
    whatsYours: "Et toi, quel est le tien ?",
  },
  compare: {
    cta: "Comparer avec un ami",
    invite: "J'ai trouvé mon Signal. Fais le test et compare avec moi.",
  },
};

export type Dictionary = typeof fr;
