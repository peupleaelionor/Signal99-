import { describe, it, expect } from "vitest";
import { getDeck, getAllDecks, DECK_LENGTH } from "@/data/cards";
import {
  buildCollection,
  hashToUnit,
  unlockedCountForSku,
} from "@/lib/cards";
import { SIGNAL_ORDER } from "@/data/signals";

describe("card decks", () => {
  it("builds exactly 99 cards for every Signal", () => {
    const decks = getAllDecks();
    for (const signal of SIGNAL_ORDER) {
      expect(decks[signal]).toHaveLength(DECK_LENGTH);
    }
  });

  it("numbers cards 1..99 with no gaps or duplicates", () => {
    for (const signal of SIGNAL_ORDER) {
      const numbers = getDeck(signal).map((c) => c.cardNumber).sort((a, b) => a - b);
      expect(numbers[0]).toBe(1);
      expect(numbers[numbers.length - 1]).toBe(DECK_LENGTH);
      expect(new Set(numbers).size).toBe(DECK_LENGTH);
    }
  });

  it("gives each card a non-empty name and all three copy layers", () => {
    for (const card of getDeck("sovereign")) {
      expect(card.name.length).toBeGreaterThan(0);
      expect(card.publicCopy.length).toBeGreaterThan(0);
      expect(card.premiumCopy.length).toBeGreaterThan(0);
      expect(card.lockscreenCopy.length).toBeGreaterThan(0);
      expect(card.lockedCopy.length).toBeGreaterThan(0);
    }
  });

  it("is deterministic (same deck across calls)", () => {
    const a = getDeck("oracle").map((c) => c.id);
    const b = getDeck("oracle").map((c) => c.id);
    expect(a).toEqual(b);
  });

  it("makes the main card #1", () => {
    const main = getDeck("visionary").find((c) => c.cardNumber === 1)!;
    expect(main.category).toBe("identite");
    expect(main.isPremium).toBe(true);
  });

  it("includes rare-or-better cards in every deck", () => {
    const rare = getDeck("rebel").filter((c) => c.rarity !== "commune");
    expect(rare.length).toBeGreaterThan(0);
  });
});

describe("entitlements", () => {
  it("maps SKUs to unlock tiers, cheapest unlocks the least", () => {
    expect(unlockedCountForSku(null)).toBe(0);
    expect(unlockedCountForSku("signal_unlock")).toBe(1);
    expect(unlockedCountForSku("bonus_pack")).toBe(4);
    expect(unlockedCountForSku("complete_pack")).toBe(13);
    expect(unlockedCountForSku("collection_99")).toBe(DECK_LENGTH);
  });
});

describe("buildCollection", () => {
  it("unlocks exactly the entitled prefix and locks the rest", () => {
    const view = buildCollection("sovereign", "seed-123", 4, "bonus_pack");
    expect(view.total).toBe(DECK_LENGTH);
    expect(view.unlockedCount).toBe(4);
    const unlocked = view.entries.filter((e) => e.user.unlocked);
    expect(unlocked).toHaveLength(4);
    expect(unlocked.every((e) => e.card.cardNumber <= 4)).toBe(true);
    expect(view.entries.find((e) => e.card.cardNumber === 5)?.user.unlocked).toBe(
      false,
    );
  });

  it("produces deterministic foil rolls in [0,1)", () => {
    const a = buildCollection("oracle", "seed-xyz", 1, "signal_unlock");
    const b = buildCollection("oracle", "seed-xyz", 1, "signal_unlock");
    for (let i = 0; i < a.entries.length; i++) {
      const roll = a.entries[i].user.rarityRoll;
      expect(roll).toBeGreaterThanOrEqual(0);
      expect(roll).toBeLessThan(1);
      expect(roll).toBe(b.entries[i].user.rarityRoll);
    }
  });
});

describe("hashToUnit", () => {
  it("is stable and bounded", () => {
    expect(hashToUnit("abc")).toBe(hashToUnit("abc"));
    expect(hashToUnit("abc")).not.toBe(hashToUnit("abd"));
    expect(hashToUnit("anything")).toBeGreaterThanOrEqual(0);
    expect(hashToUnit("anything")).toBeLessThan(1);
  });
});
