import type { Card, SignalId, UserCard } from "@/types";
import type { Sku } from "@/lib/config";
import { getDeck, DECK_LENGTH } from "@/data/cards";

/**
 * Card entitlements + collection assembly (pure, runs anywhere).
 *
 * The set of unlocked cards is derived from the highest SKU a result has paid
 * for — never from the client. The server resolves the SKU (verifyResultPaid)
 * and this maps it to how many cards of the deck are revealed.
 */

/** How many deck cards each SKU unlocks (cumulative by tier). */
export const UNLOCK_TIERS: Record<Sku, number> = {
  signal_unlock: 1, // main card
  bonus_pack: 4, // main + 3 bonus
  complete_pack: 13, // main + 9 identity + ombre + relation + lockscreen
  collection_99: DECK_LENGTH, // progressive access to all 99
};

export function unlockedCountForSku(sku: Sku | null): number {
  if (!sku) return 0;
  return UNLOCK_TIERS[sku] ?? 1;
}

/** Deterministic unit value in [0,1) from a seed string. */
export function hashToUnit(input: string): number {
  let h = 2166136261 >>> 0; // FNV-1a
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return (h >>> 0) / 4294967296;
}

export interface CollectionEntry {
  card: Card;
  user: UserCard;
}

export interface CollectionView {
  signal: SignalId;
  total: number;
  unlockedCount: number;
  entries: CollectionEntry[];
}

/**
 * Assembles the full collection view for a result.
 * Locked cards are still returned (with `unlocked: false`) so the UI can show
 * desirable teasers — but their premium copy must be withheld by the caller.
 */
export function buildCollection(
  signal: SignalId,
  collectionSeed: string,
  unlockedCount: number,
  sku: Sku | null,
): CollectionView {
  const deck = getDeck(signal);
  const entries: CollectionEntry[] = deck.map((card) => {
    const unlocked = card.cardNumber <= unlockedCount;
    return {
      card,
      user: {
        cardId: card.id,
        cardNumber: card.cardNumber,
        unlocked,
        rarityRoll: hashToUnit(`${collectionSeed}:${card.cardNumber}`),
        source: sku ?? "signal_unlock",
      },
    };
  });

  return {
    signal,
    total: deck.length,
    unlockedCount: Math.min(unlockedCount, deck.length),
    entries,
  };
}

/**
 * Strips premium/locked fields from a card the user hasn't unlocked.
 * Keeps just enough to render a desirable, on-brand locked teaser.
 */
export function publicCardShape(card: Card): Pick<
  Card,
  "id" | "signal" | "cardNumber" | "category" | "rarity" | "edition" | "symbol"
> & { lockedCopy: string; name: string } {
  return {
    id: card.id,
    signal: card.signal,
    cardNumber: card.cardNumber,
    category: card.category,
    rarity: card.rarity,
    edition: card.edition,
    symbol: card.symbol,
    name: "Carte verrouillée",
    lockedCopy: card.lockedCopy,
  };
}
