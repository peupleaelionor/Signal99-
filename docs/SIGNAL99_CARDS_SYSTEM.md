# SIGNAL99 CARDS — Documentation Système

> **SIGNAL99 CARDS : 99 cartes, 1 Signal, une identité à collectionner.**

---

## 1. Vision produit

**Phrase centrale : « Ton énergie parle avant toi. »**

**Promesse : « Révèle ton Signal. Débloque tes cartes. Collectionne ton identité. »**

### L'expérience

SIGNAL99 transforme une introspection rapide en une collection identitaire premium et partageable.

1. L'utilisateur répond à **7 questions** courtes et instinctives.
2. Le système révèle son **Signal dominant** — l'archétype qui définit son énergie.
3. Il reçoit une **carte Signal principale premium**, puis débloque progressivement une **collection de 99 cartes**.

Chaque carte représente une **facette de l'identité** :

| Facette | Ce qu'elle révèle |
|---|---|
| Aura | La présence ressentie avant les mots |
| Charisme | Le magnétisme social |
| Pouvoir | Le rapport à l'influence et au contrôle |
| Ombre | La part cachée, la faiblesse assumée |
| Destin | La trajectoire, la direction profonde |
| Relation | La manière de lier et de se lier |
| Argent | Le rapport à la valeur et à l'abondance |
| Vision | La capacité à voir plus loin |
| Protection | Les mécanismes de défense et de loyauté |
| Stratégie | La façon d'agir et de décider |

### Positionnement

SIGNAL99 est une **expérience de collection identitaire premium, partageable et personnalisée**.

**Ce que SIGNAL99 N'EST PAS :**

- ❌ Pas une app IA
- ❌ Pas de l'astrologie
- ❌ Pas de la voyance
- ❌ Pas un diagnostic psychologique
- ❌ Pas un clone Pokémon

C'est un objet de statut, de jeu et d'identité — pensé pour être collectionné, comparé et partagé.

---

## 2. Modèle économique

Une entrée volontairement basse, suivie d'une montée en valeur claire et désirable.

| Étape | Prix | Contenu |
|---|---|---|
| **Entrée** | **0,99 €** | Carte Signal principale |
| **Upsell 1** | **2,99 €** | 3 cartes bonus |
| **Upsell 2 — Pack Signal complet** | **4,99 €** | Carte principale + 9 cartes identité + 1 ombre + 1 relation + 1 lockscreen |
| **Upsell 3 — Collection 99** | **9,99 €** | Accès progressif aux 99 cartes, cartes rares, lockscreen, comparateur ami, profil premium |
| **Abonnement (futur)** | **4,99 €/mois** | 1 carte hebdo + 1 rare mensuelle + 1 relation + 1 argent/destin + 1 édition limitée |

### Règle d'or — Aucune promesse de gain financier

SIGNAL99 ne promet **jamais** de gain d'argent, de chance, de réussite garantie ni de résultat matériel.

Le discours commercial repose exclusivement sur :

- **Valeur perçue**
- **Rareté**
- **Statut**
- **Collection**
- **Identité**
- **Édition limitée**

---

## 3. Architecture

- **Next.js App Router** — structure de routes moderne, server components par défaut.
- **TypeScript strict** — typage strict de bout en bout.
- **Stripe Checkout + Webhook** — paiement délégué et confirmé côté serveur.
- **Supabase / PostgreSQL** — stockage durable des résultats, cartes et déblocages.
- **Upstash / Vercel KV** — rate limiting et anti-abus.
- **API routes propres** — chaque opération sensible passe par une route serveur.
- **Composants UI premium, mobile-first** — l'expérience se vit d'abord sur téléphone.
- **Aucun secret côté client** — clés et logique sensible confinées au serveur.
- **Aucun résultat premium généré uniquement côté client** — le Signal final et le contenu premium proviennent toujours du serveur.

---

## 4. Sécurité

Le paiement et le déblocage sont les zones critiques. Principes appliqués :

- **Paiement vérifié côté serveur** — jamais sur la seule confiance du client.
- **Anti-rejeu** — un `session_id` ne peut débloquer **qu'un seul** `resultId`. Une session déjà consommée ne rouvre rien.
- **Webhook `checkout.session.completed`** — c'est lui qui met à jour le résultat (`isPaid`, `paidAt`, identifiants Stripe).
- **`/success` revérifie** — la page de succès recroise Stripe **et** la base de données avant d'afficher quoi que ce soit.
- **`localStorage` n'est jamais source de vérité** pour `isPaid` — purement décoratif/cache.
- **`/api/personalize` refuse si non payé** — aucune personnalisation premium sans paiement confirmé en base.
- **Rate limiting** — sur toutes les routes sensibles.
- **Validation Zod** — chaque entrée d'API est validée par schéma.
- **Mode mock en dev uniquement** — désactivé en production.

### Tests de sécurité

| Test | Vérifie |
|---|---|
| Anti-rejeu | Une session Stripe ne débloque pas deux résultats |
| Anti-triche | `isPaid` ne peut pas être forcé côté client |
| `result_mismatch` | Le `session_id` correspond bien au `resultId` attendu |

---

## 5. Scoring (côté serveur)

Le calcul du Signal est **exclusivement serveur**. Le client ne décide **jamais** du Signal final.

À partir des réponses, le serveur produit :

- `dominantSignal` — le Signal principal révélé
- `secondarySignal` — le Signal secondaire
- `tensionSignal` — le Signal en tension (la friction interne)
- `scoreMap` — la carte complète des scores par axe
- `recommendedCards` — les cartes prioritaires à proposer
- `raritySeed` — la graine déterminant la rareté des tirages

### Axes de pondération

1. Choix instinctif
2. Rapport au pouvoir
3. Rapport au risque
4. Rapport aux autres
5. Rapport à l'argent
6. Rapport à la solitude
7. Rapport à l'action

### Tie-breaker stable

En cas d'égalité, le départage est **déterministe et reproductible**, basé sur :

```
hash(answers + resultId + server_salt)
```

Le même résultat donnera toujours le même Signal — sans jamais exposer la logique au client.

---

## 6. Rareté

Sept niveaux de rareté, du plus commun au plus prestigieux.

| Niveau | Distribution cible |
|---|---|
| Commune | 60 % |
| Rare | 22 % |
| Épique | 10 % |
| Mythique | 5 % |
| Légendaire | 2 % |
| Prime | ~0,5 % |
| Divine | ~0,5 % |

> Prime et Divine se partagent le dernier **1 %** de la distribution — les éditions les plus rares de la collection.

---

## 7. Catégories de cartes

- Identité
- Aura
- Pouvoir
- Ombre
- Destin
- Relation
- Argent
- Charisme
- Discipline
- Vision
- Protection
- Comparaison
- Lockscreen
- Édition spéciale

---

## 8. Les 7 Signaux

| Signal | Énergie dominante |
|---|---|
| Roi / Reine | Autorité, présence souveraine |
| Stratège | Calcul, maîtrise, anticipation |
| Visionnaire | Idées, futur, horizons |
| Bâtisseur | Construction, endurance, concret |
| Rebelle | Rupture, liberté, audace |
| Protecteur | Loyauté, défense, soin |
| Oracle | Intuition, lecture, profondeur |

Chaque Signal possède **99 cartes**, soit un potentiel total de **7 × 99 = 693 cartes**.

### Périmètre MVP (par Signal)

| Élément | Quantité |
|---|---|
| Carte principale | 7 (1 par Signal) |
| Cartes premium / Signal | 9 |
| Lockscreen / Signal | 3 |
| Rares / Signal | 3 |

La structure de données est **prête à monter jusqu'à 99 cartes par Signal** sans refonte.

---

## 9. Routes

| Méthode | Route | Rôle |
|---|---|---|
| GET | `/` | Accueil |
| GET | `/test` | Les 7 questions |
| POST | `/api/result/create` | Crée un résultat à partir des réponses |
| GET | `/result/[id]` | Affiche le résultat (teaser) |
| POST | `/api/checkout` | Crée la session Stripe Checkout |
| GET | `/success` | Page de succès (revérifie Stripe + DB) |
| POST | `/api/stripe/webhook` | Reçoit `checkout.session.completed` |
| POST | `/api/personalize` | Personnalisation premium (refuse si non payé) |
| POST | `/api/cards/unlock` | Débloque des cartes |
| GET | `/collection/[id]` | La collection de l'utilisateur |
| GET | `/share/[slug]` | Page de partage publique |
| GET | `/compare/[slug]` | Comparateur ami |
| POST | `/api/delivery` | Livraison/envoi du contenu |

---

## 10. Modèles de données

### Result / UserSession

| Champ | Description |
|---|---|
| `id` | Identifiant unique |
| `createdAt` | Date de création |
| `updatedAt` | Dernière mise à jour |
| `answers` | Réponses aux 7 questions |
| `dominantSignal` | Signal dominant calculé |
| `secondarySignals` | Signaux secondaires |
| `scoreMap` | Carte des scores par axe |
| `isPaid` | Statut de paiement (vérité serveur) |
| `paidAt` | Date de paiement |
| `stripeSessionId` | ID de session Stripe |
| `stripePaymentIntentId` | ID du PaymentIntent Stripe |
| `unlockTokenHash` | Hash du token de déblocage |
| `email` | Email de l'utilisateur |
| `locale` | Langue (FR par défaut) |
| `shareSlug` | Slug de partage public |
| `collectionSeed` | Graine de la collection |
| `fraudFlags` | Indicateurs de fraude détectés |

### Signal

Définit l'un des 7 archétypes (nom, énergie, jeu de cartes associé). Référencé par `Card.signal` et `Result.dominantSignal`.

### Card

| Champ | Description |
|---|---|
| `id` | Identifiant unique |
| `signal` | Signal d'appartenance |
| `cardNumber` | Numéro de carte (1–99) |
| `name` | Nom de la carte |
| `slug` | Slug |
| `category` | Catégorie (voir §7) |
| `rarity` | Niveau de rareté (voir §6) |
| `edition` | Édition |
| `visualPrompt` | Prompt visuel de génération |
| `publicCopy` | Texte public |
| `premiumCopy` | Texte premium |
| `lockedCopy` | Texte affiché quand verrouillée |
| `shareCopy` | Texte de partage |
| `lockscreenCopy` | Texte pour lockscreen |
| `attributes` | Attributs de la carte |
| `compatibilityTags` | Tags de compatibilité (comparateur) |
| `isPublic` | Visible publiquement |
| `isPremium` | Réservée au premium |
| `createdAt` | Date de création |

### UserCard

| Champ | Description |
|---|---|
| `id` | Identifiant unique |
| `resultId` | Résultat propriétaire |
| `cardId` | Carte débloquée |
| `unlockedAt` | Date de déblocage |
| `source` | Origine du déblocage (pack, abonnement, etc.) |
| `rarityRoll` | Tirage de rareté obtenu |
| `editionNumber` | Numéro d'exemplaire de l'édition |
| `isFavorite` | Marquée comme favorite |
| `isShared` | A été partagée |
| `shareCount` | Nombre de partages |

---

## 11. Prochaines étapes

- Atteindre **99 cartes par Signal** (collection complète).
- **Compare ami réel** — comparaison entre deux profils.
- **Abonnement** mensuel (voir §2).
- **Email via Resend** — livraison et rétention.
- **Marketplace symbolique** — échange/collection, **sans aucune promesse financière**.
- **Application mobile** native.
