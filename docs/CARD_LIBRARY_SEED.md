# SIGNAL99 — Card Library Seed

Source de vérité du deck : [`data/cards.ts`](../data/cards.ts) (banques de copy par
Signal + générateur déterministe). Chaque Signal possède **99 cartes**
(`7 × 99 = 693`). Tout est déterministe : un Signal produit toujours le même deck.

## Structure d'un deck (99 cartes / Signal)

| Position | Contenu | Source |
| --- | --- | --- |
| `#1` | Carte principale (signature du Signal) | authored |
| `#2 → #6` | Cartes héros (premium / rares / lockscreen) | authored (`heroes`) |
| `#7 → #99` | Facettes composées (Identité, Aura, Charisme, Pouvoir, Vision, Discipline, Relation, Destin, Argent, Protection, Ombre) | générées via banques par catégorie |

> Le MVP demande « 7 principales + 9 premium + 3 lockscreen + 3 rares par Signal ».
> La structure est **prête pour 99** : les positions `#7 → #99` sont déjà peuplées
> (verrouillées par défaut, teasers désirables), prêtes à être remplacées par des
> cartes authored au fil du temps.

## Rareté (fixe par carte, par position)

`rarityForNumber(n)` vise la distribution cible :

| Rareté | Règle de position | Part visée |
| --- | --- | --- |
| Divine | `#99` | ~1 % |
| Prime | `#98` | ~2 % |
| Légendaire | `#1`, `#94–97` | ~5 % |
| Mythique | `#84–93` | ~10 % |
| Épique | `#62–83` | ~22 % |
| Rare | `n % 3 === 0` (reste) | ~22 % |
| Commune | reste | ~60 % |

## Trois couches de copy par carte

- `publicCopy` — courte, partageable, peu intime (carte virale).
- `premiumCopy` — lecture profonde, visible après paiement.
- `lockscreenCopy` — phrase courte pour écran de verrouillage (keepsake).
- `lockedCopy` — teaser affiché tant que la carte est verrouillée.
- `shareCopy` — texte prêt à partager.

## Cartes principales (signatures) par Signal

| Signal | Signature (publicCopy #1) |
| --- | --- |
| Roi / Reine | Tu n'entres pas dans une pièce. Tu changes sa hiérarchie. |
| Stratège | Tu gagnes avant même que les autres comprennent le jeu. |
| Visionnaire | Tu vois des portes là où les autres voient des murs. |
| Bâtisseur | Tu transformes le chaos en structure. |
| Rebelle | Tu n'es pas né pour entrer dans le cadre. |
| Protecteur | Ta force se révèle quand quelqu'un compte sur toi. |
| Oracle | Tu ressens ce que les autres n'ont pas encore compris. |

## Cartes héros authored (exemples, `#2 → #6`)

Chaque Signal a 5 cartes héros nommées couvrant Pouvoir / Identité / Aura / Ombre /
Charisme (ou Vision / Relation / Destin selon le Signal). Exemples :

- **Roi / Reine** : Le Roi Silencieux (Mythique), Couronne Intérieure (Rare),
  Aura de Souverain (Épique), Le Poids de la Couronne (Épique, Ombre),
  Magnétisme du Centre (Rare).
- **Stratège** : L'Œil Froid, Le Coup d'Avance, Silence Calculé, Le Piège de
  l'Analyse (Ombre), Carte Maîtresse.
- **Visionnaire** : Le Premier à Voir, Architecte d'Avenir, Aura de Possibilité,
  Mille Futurs (Ombre), Étincelle.
- **Bâtisseur** : La Main Solide, Fondation, Patience d'Acier, Le Mur Trop Lourd
  (Ombre), Pierre Angulaire.
- **Rebelle** : Briseur de Règles, Flamme Libre, Sang Indépendant, La Fuite
  Déguisée (Ombre), Onde de Choc.
- **Protecteur** : Le Bouclier Calme, Cœur Gardien, Force Tranquille, Le Don de
  Trop (Ombre), Lien Sacré.
- **Oracle** : Le Regard Profond, Aura Mystique, Sens du Silence, Le Trop-Plein
  (Ombre), Fil Invisible.

Exemple de carte complète :

```
CardName: Le Roi Silencieux
Signal: Roi/Reine   ·   Rarity: Mythique   ·   #?? / 99
publicCopy:    Il ne parle pas fort. Il impose le rythme.
premiumCopy:   Tu n'as pas besoin d'élever la voix. Ta présence fixe déjà le tempo.
lockscreenCopy: Le calme est ma couronne.
shareCopy:     J'ai débloqué « Le Roi Silencieux » sur SIGNAL99.
```

## Cartes lockscreen & rares

- **Lockscreen** : chaque carte porte une `lockscreenCopy` courte (toutes les
  cartes sont exportables en format lockscreen). Les signatures `#1` et les héros
  fournissent les lignes lockscreen phares (≥ 3 par Signal).
- **Rares** : les héros incluent au moins 3 cartes `rare`/`épique`/`mythique` par
  Signal ; les positions hautes du deck (`#84+`) ajoutent mythique → divine.

## Déblocage par palier (entitlements)

Voir [`lib/cards.ts`](../lib/cards.ts) — `UNLOCK_TIERS` :

| SKU | Prix | Cartes débloquées |
| --- | --- | --- |
| `signal_unlock` | 0,99 € | `#1` (carte principale) |
| `bonus_pack` | 2,99 € | `#1 → #4` |
| `complete_pack` | 4,99 € | `#1 → #13` |
| `collection_99` | 9,99 € | `#1 → #99` |

Le palier est résolu **côté serveur** (SKU vérifié via Stripe), jamais par le client.

## Légal

Aucune référence à des personnes réelles, marques, clubs, logos ou licences.
Uniquement des archétypes universels et originaux. Aucune promesse de gain
financier — uniquement valeur perçue, rareté, statut, identité, édition limitée.

## Vers 99 cartes authored / Signal

1. Remplacer progressivement les facettes générées (`#7 → #99`) par des cartes
   nommées, en respectant la distribution de rareté ci-dessus.
2. Ajouter `visualPrompt` par carte pour la génération d'illustrations originales.
3. Ajouter les cartes `comparaison` (duo) pour le comparateur ami.
4. Introduire des `edition_speciale` (éditions limitées datées).
