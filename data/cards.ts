import type {
  Card,
  CardCategory,
  CardRarity,
  SignalId,
} from "@/types";
import { SIGNAL_ORDER, getSignal } from "@/data/signals";

/**
 * SIGNAL99 CARDS — deterministic 99-card deck per Signal.
 *
 * Each Signal owns a 99-card deck. Cards 1..N are authored (the main card + the
 * premium / lockscreen / rare heroes); the rest are composed from per-category
 * copy banks so the structure is "ready for 99" with on-brand copy. Everything
 * is deterministic: the same Signal always yields the same deck.
 *
 * Legal: no real people, brands, clubs, logos or licences — only original,
 * universal archetypes. No financial-gain promises anywhere in the copy.
 */

const EDITION = "Édition Origine";

const DECK_SIZE = 99;

/** Fixed rarity layout per deck position → hits the target distribution. */
function rarityForNumber(n: number): CardRarity {
  // 1 = main (legendaire). Hand-tuned ramp toward rarer high numbers.
  if (n === 1) return "legendaire";
  if (n === DECK_SIZE) return "divine"; // ~1%
  if (n >= 98) return "prime"; // ~2% incl. divine bucket
  if (n >= 94) return "legendaire"; // ~5%
  if (n >= 84) return "mythique"; // ~10%
  if (n >= 62) return "epique"; // ~22%
  return n % 3 === 0 ? "rare" : "commune"; // remainder ~60/22 split
}

interface Hero {
  name: string;
  category: CardCategory;
  rarity: CardRarity;
  publicCopy: string;
  premiumCopy: string;
  lockscreenCopy: string;
}

interface CategoryLine {
  publicCopy: string;
  premiumCopy: string;
  lockscreenCopy: string;
}

interface SignalCopyBank {
  /** Main card (deck #1) signature. */
  signatureShare: string;
  signaturePremium: string;
  signatureLockscreen: string;
  /** Authored hero cards (#2.. in order). */
  heroes: Hero[];
  /** Pools used to compose the remaining facet cards. */
  lines: Record<CardCategory, CategoryLine>;
}

/** Cycle of categories used to compose generated facet cards. */
const FACET_CYCLE: CardCategory[] = [
  "identite",
  "aura",
  "charisme",
  "pouvoir",
  "vision",
  "discipline",
  "relation",
  "destin",
  "argent",
  "protection",
  "ombre",
];

const CATEGORY_LABEL: Record<CardCategory, string> = {
  identite: "Identité",
  aura: "Aura",
  pouvoir: "Pouvoir",
  ombre: "Ombre",
  destin: "Destin",
  relation: "Relation",
  argent: "Argent",
  charisme: "Charisme",
  discipline: "Discipline",
  vision: "Vision",
  protection: "Protection",
  comparaison: "Comparaison",
  lockscreen: "Lockscreen",
  edition_speciale: "Édition spéciale",
};

export function categoryLabel(category: CardCategory): string {
  return CATEGORY_LABEL[category];
}

const RARITY_LABEL: Record<CardRarity, string> = {
  commune: "Commune",
  rare: "Rare",
  epique: "Épique",
  mythique: "Mythique",
  legendaire: "Légendaire",
  prime: "Prime",
  divine: "Divine",
};

export function rarityLabel(rarity: CardRarity): string {
  return RARITY_LABEL[rarity];
}

const ROMAN = [
  "",
  "I",
  "II",
  "III",
  "IV",
  "V",
  "VI",
  "VII",
  "VIII",
  "IX",
  "X",
];

function roman(n: number): string {
  return ROMAN[n] ?? String(n);
}

// ── Per-Signal copy banks ────────────────────────────────────────────────────

const BANKS: Record<SignalId, SignalCopyBank> = {
  sovereign: {
    signatureShare: "Tu n'entres pas dans une pièce. Tu changes sa hiérarchie.",
    signaturePremium:
      "Ton autorité ne vient pas du bruit. Elle vient de ta capacité à rester stable quand tout le monde cherche une réaction.",
    signatureLockscreen: "Reste calme. Ton rang parle déjà.",
    heroes: [
      {
        name: "Le Roi Silencieux",
        category: "pouvoir",
        rarity: "mythique",
        publicCopy: "Il ne parle pas fort. Il impose le rythme.",
        premiumCopy:
          "Tu n'as pas besoin d'élever la voix. Ta présence fixe déjà le tempo de la pièce.",
        lockscreenCopy: "Le calme est ma couronne.",
      },
      {
        name: "Couronne Intérieure",
        category: "identite",
        rarity: "rare",
        publicCopy: "Ton autorité ne se demande pas. Elle se ressent.",
        premiumCopy:
          "Tu portes une légitimité qui ne dépend d'aucun titre. Les autres s'alignent avant même que tu décides.",
        lockscreenCopy: "Je n'attends aucune permission.",
      },
      {
        name: "Aura de Souverain",
        category: "aura",
        rarity: "epique",
        publicCopy: "Quelque chose se réaligne quand tu arrives.",
        premiumCopy:
          "Ton aura ordonne le désordre. Là où tu passes, le chaos cherche un centre — et te choisit.",
        lockscreenCopy: "Mon énergie tient debout.",
      },
      {
        name: "Le Poids de la Couronne",
        category: "ombre",
        rarity: "epique",
        publicCopy: "Vouloir tout porter seul peut t'écraser.",
        premiumCopy:
          "Ton ombre, c'est l'orgueil qui refuse l'aide. La vraie force royale, c'est aussi savoir déléguer sans perdre ton rang.",
        lockscreenCopy: "Je règne, je ne m'épuise pas.",
      },
      {
        name: "Magnétisme du Centre",
        category: "charisme",
        rarity: "rare",
        publicCopy: "Tu deviens vite le centre, sans le demander.",
        premiumCopy:
          "On gravite autour de toi parce que tu offres un point fixe. Ton charisme rassure autant qu'il impose.",
        lockscreenCopy: "Je suis le point fixe.",
      },
    ],
    lines: bankLines("sovereign"),
  },
  strategist: {
    signatureShare: "Tu gagnes avant même que les autres comprennent le jeu.",
    signaturePremium:
      "Tu ne réagis pas vite. Tu lis ce que les autres ne voient pas, puis tu joues le seul coup qui compte.",
    signatureLockscreen: "Je ne joue pas vite. Je joue juste.",
    heroes: [
      {
        name: "L'Œil Froid",
        category: "vision",
        rarity: "mythique",
        publicCopy: "Tu vois la structure cachée d'une situation.",
        premiumCopy:
          "Pendant que les autres ressentent, tu cartographies. Tu repères la pièce qui fera tomber tout le reste.",
        lockscreenCopy: "Je vois le plateau entier.",
      },
      {
        name: "Le Coup d'Avance",
        category: "pouvoir",
        rarity: "epique",
        publicCopy: "Tu as déjà joué le coup d'après.",
        premiumCopy:
          "Ton pouvoir n'est pas la force, c'est l'anticipation. Tu transformes la patience en avantage décisif.",
        lockscreenCopy: "J'ai déjà un coup d'avance.",
      },
      {
        name: "Silence Calculé",
        category: "charisme",
        rarity: "rare",
        publicCopy: "On te croit discret. Tu observes tout.",
        premiumCopy:
          "Ton silence n'est pas du retrait, c'est de la collecte. Tu parles peu et frappes au bon moment.",
        lockscreenCopy: "Mon silence travaille.",
      },
      {
        name: "Le Piège de l'Analyse",
        category: "ombre",
        rarity: "epique",
        publicCopy: "À trop attendre, le moment passe.",
        premiumCopy:
          "Ton ombre, c'est la sur-analyse. Parfois la meilleure stratégie, c'est de décider avant d'avoir toutes les données.",
        lockscreenCopy: "Je décide, puis j'ajuste.",
      },
      {
        name: "Carte Maîtresse",
        category: "destin",
        rarity: "rare",
        publicCopy: "Tu gardes toujours une carte cachée.",
        premiumCopy:
          "Ton destin se joue en réserve. Tu avances masqué pour mieux choisir l'instant où tout bascule.",
        lockscreenCopy: "Je garde une carte.",
      },
    ],
    lines: bankLines("strategist"),
  },
  visionary: {
    signatureShare: "Tu vois des portes là où les autres voient des murs.",
    signaturePremium:
      "Tu sens l'ouverture avant qu'elle existe. Ta force, c'est de donner une forme visible à ce que personne n'imagine encore.",
    signatureLockscreen: "Je n'attends pas qu'on comprenne. Je construis.",
    heroes: [
      {
        name: "Le Premier à Voir",
        category: "vision",
        rarity: "mythique",
        publicCopy: "Tu sens le futur avant qu'il devienne évident.",
        premiumCopy:
          "Tu vis un temps d'avance. Ce que les autres appelleront évidence demain, tu le ressens déjà aujourd'hui.",
        lockscreenCopy: "Je vois avant.",
      },
      {
        name: "Architecte d'Avenir",
        category: "identite",
        rarity: "epique",
        publicCopy: "Tu donnes une forme à l'impossible.",
        premiumCopy:
          "Ton identité, c'est la création. Tu ne subis pas le réel, tu en dessines une version qui n'existait pas.",
        lockscreenCopy: "Je dessine le réel.",
      },
      {
        name: "Aura de Possibilité",
        category: "aura",
        rarity: "rare",
        publicCopy: "On sent une possibilité autour de toi.",
        premiumCopy:
          "Les gens respirent plus large près de toi. Ton aura ouvre des chemins avant même que tu parles.",
        lockscreenCopy: "Près de moi, tout s'ouvre.",
      },
      {
        name: "Mille Futurs",
        category: "ombre",
        rarity: "epique",
        publicCopy: "Vivre dans trop de futurs à la fois.",
        premiumCopy:
          "Ton ombre, c'est la dispersion. Choisis une vision et donne-lui une forme visible — une seule suffit à changer la suite.",
        lockscreenCopy: "Une vision. Une forme.",
      },
      {
        name: "Étincelle",
        category: "charisme",
        rarity: "rare",
        publicCopy: "Tu allumes des idées chez les autres.",
        premiumCopy:
          "Ton charisme est contagieux : après toi, les gens osent des choses qu'ils n'osaient pas.",
        lockscreenCopy: "J'allume ce qui dort.",
      },
    ],
    lines: bankLines("visionary"),
  },
  builder: {
    signatureShare: "Tu transformes le chaos en structure.",
    signaturePremium:
      "Tu ne te disperses pas. Tu poses des fondations, une à une, jusqu'à ce que tienne ce que les autres croyaient impossible.",
    signatureLockscreen: "Ce que je commence, je le tiens debout.",
    heroes: [
      {
        name: "La Main Solide",
        category: "pouvoir",
        rarity: "mythique",
        publicCopy: "Tu transformes la pression en progrès.",
        premiumCopy:
          "Là où d'autres craquent, tu poses une pierre. Ton pouvoir, c'est de rendre durable ce qui était fragile.",
        lockscreenCopy: "Je rends durable.",
      },
      {
        name: "Fondation",
        category: "identite",
        rarity: "epique",
        publicCopy: "On se repose sur ce que tu construis.",
        premiumCopy:
          "Ton identité inspire la stabilité. Les gens bâtissent leur calme sur ta fiabilité.",
        lockscreenCopy: "Je suis le socle.",
      },
      {
        name: "Patience d'Acier",
        category: "discipline",
        rarity: "rare",
        publicCopy: "Tu avances quand les autres abandonnent.",
        premiumCopy:
          "Ta discipline est silencieuse mais implacable. Tu gagnes par constance, pas par éclat.",
        lockscreenCopy: "Je tiens la distance.",
      },
      {
        name: "Le Mur Trop Lourd",
        category: "ombre",
        rarity: "epique",
        publicCopy: "À trop bâtir, tu oublies de lever les yeux.",
        premiumCopy:
          "Ton ombre, c'est la rigidité et le sacrifice de toi-même. Renforce une fondation à la fois — pas toutes en même temps.",
        lockscreenCopy: "Je lève aussi les yeux.",
      },
      {
        name: "Pierre Angulaire",
        category: "relation",
        rarity: "rare",
        publicCopy: "Les autres tiennent debout grâce à toi.",
        premiumCopy:
          "Dans tes liens, tu es l'appui. Mais l'appui aussi a le droit de s'appuyer.",
        lockscreenCopy: "Je porte, je me porte.",
      },
    ],
    lines: bankLines("builder"),
  },
  rebel: {
    signatureShare: "Tu n'es pas né pour entrer dans le cadre.",
    signaturePremium:
      "Tu n'es pas difficile à comprendre. Tu refuses simplement les cages. Ta force, c'est d'ouvrir des portes qu'on t'a appris à ne pas toucher.",
    signatureLockscreen: "Je n'étais pas fait pour le cadre.",
    heroes: [
      {
        name: "Briseur de Règles",
        category: "pouvoir",
        rarity: "mythique",
        publicCopy: "Tu rends cassable ce qu'on croyait fixe.",
        premiumCopy:
          "Ton pouvoir, c'est le mouvement. Tu montres que les murs étaient des décors et que les portes existaient déjà.",
        lockscreenCopy: "Rien n'est figé.",
      },
      {
        name: "Flamme Libre",
        category: "identite",
        rarity: "epique",
        publicCopy: "On sent du mouvement autour de toi.",
        premiumCopy:
          "Ton identité dérange le confort des autres — et c'est précisément ce qui les libère.",
        lockscreenCopy: "Je brûle, donc j'éclaire.",
      },
      {
        name: "Sang Indépendant",
        category: "discipline",
        rarity: "rare",
        publicCopy: "Tu ne suis pas, tu choisis.",
        premiumCopy:
          "Ta discipline est intérieure, pas imposée. Tu obéis à ta propre loi, et tu la tiens.",
        lockscreenCopy: "Ma loi est intérieure.",
      },
      {
        name: "La Fuite Déguisée",
        category: "ombre",
        rarity: "epique",
        publicCopy: "Confondre liberté et fuite.",
        premiumCopy:
          "Ton ombre, c'est l'opposition automatique. Brise une fausse règle, mais garde un vrai engagement.",
        lockscreenCopy: "Libre, pas en fuite.",
      },
      {
        name: "Onde de Choc",
        category: "charisme",
        rarity: "rare",
        publicCopy: "Ta présence réveille les endormis.",
        premiumCopy:
          "Ton charisme est électrique. Tu donnes aux autres l'autorisation d'oser.",
        lockscreenCopy: "Je réveille.",
      },
    ],
    lines: bankLines("rebel"),
  },
  protector: {
    signatureShare: "Ta force se révèle quand quelqu'un compte sur toi.",
    signaturePremium:
      "Ta puissance n'est pas toujours bruyante. Elle se voit dans ce que tu protèges et dans le calme que tu offres sans rien demander.",
    signatureLockscreen: "Ma douceur n'annule pas ma force.",
    heroes: [
      {
        name: "Le Bouclier Calme",
        category: "protection",
        rarity: "mythique",
        publicCopy: "On se sent en sécurité près de toi.",
        premiumCopy:
          "Tu tiens l'espace sans avoir besoin d'attention. Ta présence est un abri que les autres reconnaissent d'instinct.",
        lockscreenCopy: "Je tiens l'abri.",
      },
      {
        name: "Cœur Gardien",
        category: "identite",
        rarity: "epique",
        publicCopy: "Ta loyauté est une forteresse.",
        premiumCopy:
          "Ton identité se construit dans le lien. Tu n'abandonnes pas — et ceux que tu protèges le savent.",
        lockscreenCopy: "Je ne lâche pas les miens.",
      },
      {
        name: "Force Tranquille",
        category: "pouvoir",
        rarity: "rare",
        publicCopy: "Ta puissance n'a pas besoin de bruit.",
        premiumCopy:
          "Tu rassures par ta stabilité. Ton pouvoir est celui qu'on ne remarque que lorsqu'il manque.",
        lockscreenCopy: "Stable, donc fort.",
      },
      {
        name: "Le Don de Trop",
        category: "ombre",
        rarity: "epique",
        publicCopy: "Protéger tout le monde, en t'oubliant.",
        premiumCopy:
          "Ton ombre, c'est l'oubli de soi et la colère retenue. Protège aussi une frontière qui n'appartient qu'à toi.",
        lockscreenCopy: "Ma paix compte aussi.",
      },
      {
        name: "Lien Sacré",
        category: "relation",
        rarity: "rare",
        publicCopy: "Avec toi, les gens se sentent tenus.",
        premiumCopy:
          "Dans tes relations, tu offres une sécurité rare. Apprends à recevoir autant que tu donnes.",
        lockscreenCopy: "Je tiens, je reçois.",
      },
    ],
    lines: bankLines("protector"),
  },
  oracle: {
    signatureShare: "Tu ressens ce que les autres n'ont pas encore compris.",
    signaturePremium:
      "Tu lis les silences, les variations, la tension invisible. Ta force, c'est de transformer une intuition en une décision claire.",
    signatureLockscreen: "Ce que je ressens porte déjà une vérité.",
    heroes: [
      {
        name: "Le Regard Profond",
        category: "vision",
        rarity: "mythique",
        publicCopy: "Tu lis ce que les mots cachent.",
        premiumCopy:
          "Tu perçois les courants sous la surface. Ce que les autres comprendront trop tard, tu le ressens déjà.",
        lockscreenCopy: "Je lis sous la surface.",
      },
      {
        name: "Aura Mystique",
        category: "aura",
        rarity: "epique",
        publicCopy: "On sent une profondeur autour de toi.",
        premiumCopy:
          "Ton aura intrigue sans s'expliquer. Les gens te confient ce qu'ils ne disent à personne.",
        lockscreenCopy: "Ma profondeur parle.",
      },
      {
        name: "Sens du Silence",
        category: "charisme",
        rarity: "rare",
        publicCopy: "Tu entends ce qui n'est pas dit.",
        premiumCopy:
          "Ton charisme est dans l'écoute. Tu captes les variations que personne d'autre ne remarque.",
        lockscreenCopy: "J'écoute l'invisible.",
      },
      {
        name: "Le Trop-Plein",
        category: "ombre",
        rarity: "epique",
        publicCopy: "Rester trop longtemps dans l'invisible.",
        premiumCopy:
          "Ton ombre, c'est la surcharge mentale et le retrait. Écris ce que tu ressens, puis transforme une intuition en acte.",
        lockscreenCopy: "Je ressens, puis j'agis.",
      },
      {
        name: "Fil Invisible",
        category: "destin",
        rarity: "rare",
        publicCopy: "Tu relies des signes que d'autres ignorent.",
        premiumCopy:
          "Ton destin se lit entre les lignes. Suis le fil sans t'y perdre — l'intuition est une boussole, pas un refuge.",
        lockscreenCopy: "Je suis le fil.",
      },
    ],
    lines: bankLines("oracle"),
  },
};

/** Per-category copy pool, composed with the Signal's vocabulary. */
function bankLines(signal: SignalId): Record<CardCategory, CategoryLine> {
  const name = getSignal(signal).shortLabel;
  const k = getSignal(signal).keywords;
  const kw = (i: number) => k[i % k.length];
  return {
    identite: {
      publicCopy: `Une facette de ton identité de ${name}.`,
      premiumCopy: `Cette carte éclaire ta ${kw(0)} : une part de toi que les autres ressentent avant de la nommer.`,
      lockscreenCopy: `Je sais qui je suis.`,
    },
    aura: {
      publicCopy: `Ton aura laisse une trace.`,
      premiumCopy: `Ton énergie modifie l'atmosphère autour de toi, par ta ${kw(1)}.`,
      lockscreenCopy: `Mon aura parle pour moi.`,
    },
    pouvoir: {
      publicCopy: `Ton pouvoir n'a pas besoin de preuve.`,
      premiumCopy: `Ta force agit par ${kw(2)}, sans avoir à s'imposer.`,
      lockscreenCopy: `Ma force est calme.`,
    },
    ombre: {
      publicCopy: `Une zone d'ombre à apprivoiser.`,
      premiumCopy: `Ce que tu caches peut te freiner : reconnais-le pour le désamorcer.`,
      lockscreenCopy: `Je connais mon ombre.`,
    },
    destin: {
      publicCopy: `Une direction se dessine.`,
      premiumCopy: `Ton chemin se précise quand tu suis ta ${kw(0)} plutôt que le bruit.`,
      lockscreenCopy: `Je trace ma route.`,
    },
    relation: {
      publicCopy: `Ce que les autres ressentent près de toi.`,
      premiumCopy: `Dans tes liens, ta ${kw(1)} crée une dynamique unique.`,
      lockscreenCopy: `On me ressent.`,
    },
    argent: {
      publicCopy: `Ton rapport à la valeur.`,
      premiumCopy: `Ta manière de créer de la valeur suit ta ${kw(2)} — pas les modes.`,
      lockscreenCopy: `Je crée de la valeur.`,
    },
    charisme: {
      publicCopy: `On te remarque sans que tu forces.`,
      premiumCopy: `Ton charisme tient à ta ${kw(1)}, jamais à l'effort.`,
      lockscreenCopy: `Je marque sans forcer.`,
    },
    discipline: {
      publicCopy: `Ta constance fait la différence.`,
      premiumCopy: `Ta discipline s'appuie sur ta ${kw(0)} : tu tiens quand d'autres lâchent.`,
      lockscreenCopy: `Je tiens.`,
    },
    vision: {
      publicCopy: `Tu vois plus loin.`,
      premiumCopy: `Ta vision s'ouvre par ta ${kw(2)}, là où d'autres voient des murs.`,
      lockscreenCopy: `Je vois loin.`,
    },
    protection: {
      publicCopy: `Tu sais tenir l'espace.`,
      premiumCopy: `Ta présence protège sans bruit, portée par ta ${kw(1)}.`,
      lockscreenCopy: `Je protège.`,
    },
    comparaison: {
      publicCopy: `Comment ton énergie rencontre celle des autres.`,
      premiumCopy: `Cette carte révèle l'alignement et la friction entre ton Signal et un autre.`,
      lockscreenCopy: `Deux énergies, une lecture.`,
    },
    lockscreen: {
      publicCopy: `Une carte à garder pour toi.`,
      premiumCopy: `Conçue pour ton écran : courte, belle, à ton image.`,
      lockscreenCopy: `Ton énergie parle avant toi.`,
    },
    edition_speciale: {
      publicCopy: `Une carte d'édition limitée.`,
      premiumCopy: `Une facette rare de ton Signal, frappée en édition limitée.`,
      lockscreenCopy: `Édition limitée.`,
    },
  };
}

// ── Deck builder ─────────────────────────────────────────────────────────────

function slugify(signal: SignalId, n: number, name: string): string {
  const base = name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
  return `${signal}-${n}-${base}`.slice(0, 80);
}

const deckCache = new Map<SignalId, Card[]>();

/** Returns the full 99-card deck for a Signal (deterministic, cached). */
export function getDeck(signal: SignalId): Card[] {
  const cached = deckCache.get(signal);
  if (cached) return cached;

  const bank = BANKS[signal];
  const signalName = getSignal(signal).name;
  const cards: Card[] = [];

  // #1 — main card.
  cards.push({
    id: `${signal}-1`,
    signal,
    cardNumber: 1,
    name: `Signal ${getSignal(signal).shortLabel}`,
    slug: slugify(signal, 1, "signal-" + signal),
    category: "identite",
    rarity: rarityForNumber(1),
    edition: EDITION,
    symbol: getSignal(signal).symbol,
    publicCopy: bank.signatureShare,
    premiumCopy: bank.signaturePremium,
    lockedCopy: "Ta carte principale t'attend.",
    shareCopy: `Mon Signal est ${signalName}. Et toi, quel est ton Signal ?`,
    lockscreenCopy: bank.signatureLockscreen,
    isPublic: true,
    isPremium: true,
  });

  // Authored hero cards.
  bank.heroes.forEach((hero, i) => {
    const n = i + 2;
    cards.push({
      id: `${signal}-${n}`,
      signal,
      cardNumber: n,
      name: hero.name,
      slug: slugify(signal, n, hero.name),
      category: hero.category,
      rarity: hero.rarity,
      edition: EDITION,
      symbol: getSignal(signal).symbol,
      publicCopy: hero.publicCopy,
      premiumCopy: hero.premiumCopy,
      lockedCopy: "Une facette de ton énergie attend d'être révélée.",
      shareCopy: `J'ai débloqué « ${hero.name} » sur SIGNAL99.`,
      lockscreenCopy: hero.lockscreenCopy,
      isPublic: true,
      isPremium: true,
    });
  });

  // Composed facet cards up to 99.
  for (let n = cards.length + 1; n <= DECK_SIZE; n++) {
    const category = FACET_CYCLE[(n - 2) % FACET_CYCLE.length];
    const line = bank.lines[category];
    const idx = Math.ceil((n - 16) / FACET_CYCLE.length);
    const label = `${CATEGORY_LABEL[category]} ${roman(((idx - 1) % 10) + 1)}`.trim();
    cards.push({
      id: `${signal}-${n}`,
      signal,
      cardNumber: n,
      name: label,
      slug: slugify(signal, n, label),
      category,
      rarity: rarityForNumber(n),
      edition: EDITION,
      symbol: getSignal(signal).symbol,
      publicCopy: line.publicCopy,
      premiumCopy: line.premiumCopy,
      lockedCopy: lockedTeaser(category),
      shareCopy: `J'explore mon Signal ${getSignal(signal).shortLabel} sur SIGNAL99.`,
      lockscreenCopy: line.lockscreenCopy,
      isPublic: false,
      isPremium: true,
    });
  }

  deckCache.set(signal, cards);
  return cards;
}

function lockedTeaser(category: CardCategory): string {
  switch (category) {
    case "ombre":
      return "Ton côté caché n'est pas encore révélé.";
    case "relation":
      return "Une carte compatible avec un proche t'attend.";
    case "argent":
      return "Ton rapport à la valeur reste à révéler.";
    case "destin":
      return "Cette carte change la lecture de ton profil.";
    default:
      return "Une carte rare dort dans ton Signal.";
  }
}

export function getCard(signal: SignalId, cardNumber: number): Card | null {
  return getDeck(signal).find((c) => c.cardNumber === cardNumber) ?? null;
}

/** Convenience for tests / tooling: every deck, every Signal. */
export function getAllDecks(): Record<SignalId, Card[]> {
  return SIGNAL_ORDER.reduce(
    (acc, s) => {
      acc[s] = getDeck(s);
      return acc;
    },
    {} as Record<SignalId, Card[]>,
  );
}

export const DECK_LENGTH = DECK_SIZE;
