"use client";

import type { CardCategory, CardRarity } from "@/types";
import { CardShell } from "@/components/CardShell";
import { SignalGlyph } from "@/components/SignalGlyph";
import { categoryLabel, rarityLabel } from "@/data/cards";

export interface CardTileData {
  name: string;
  cardNumber: number;
  rarity: CardRarity;
  category: CardCategory;
  symbol: string;
  copy: string;
  unlocked: boolean;
  rarityRoll: number;
  auraColor: string;
}

const RARITY_GLOW: Record<CardRarity, string> = {
  commune: "#8a8a8a",
  rare: "#5aa9e6",
  epique: "#a06bff",
  mythique: "#ff7ad1",
  legendaire: "#f0b34a",
  prime: "#36e0c0",
  divine: "#ffe9a8",
};

/** A single collectible card tile — unlocked (revealed) or locked (teaser). */
export function CardTile(props: CardTileData) {
  const accent = props.unlocked ? RARITY_GLOW[props.rarity] : "#3a3a3a";

  return (
    <CardShell
      glow={props.unlocked}
      className="relative aspect-[3/4] overflow-hidden p-0"
    >
      <div className="flex h-full flex-col p-3 text-left">
        <div className="flex items-center justify-between text-[10px] uppercase tracking-widest text-muted">
          <span>#{String(props.cardNumber).padStart(2, "0")}</span>
          <span style={{ color: accent }}>{rarityLabel(props.rarity)}</span>
        </div>

        <div className="flex flex-1 items-center justify-center">
          <span
            style={{ color: props.unlocked ? props.auraColor : "#444" }}
            className={props.unlocked ? "" : "opacity-40"}
          >
            <SignalGlyph name={props.symbol} size={40} />
          </span>
        </div>

        {props.unlocked ? (
          <div>
            <p className="text-[10px] uppercase tracking-wider text-muted">
              {categoryLabel(props.category)}
            </p>
            <p className="font-serif text-sm leading-tight text-ink">
              {props.name}
            </p>
            <p className="mt-1 line-clamp-2 text-[11px] leading-snug text-muted">
              {props.copy}
            </p>
          </div>
        ) : (
          <div>
            <p className="text-[10px] uppercase tracking-wider text-gold/70">
              Verrouillé
            </p>
            <p className="mt-1 line-clamp-2 text-[11px] leading-snug text-muted/80">
              {props.copy}
            </p>
          </div>
        )}
      </div>

      {!props.unlocked && (
        <div className="pointer-events-none absolute inset-0 backdrop-blur-[3px]" />
      )}
    </CardShell>
  );
}
