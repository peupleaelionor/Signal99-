interface CreditUpsellProps {
  /** Credits the visitor currently holds (0 in the MVP). */
  balance?: number;
  onUseCredit?: () => void;
}

/**
 * Secondary unlock path via credits.
 * Hidden when the visitor has no credits (the default in the MVP), but the
 * component is ready for when the credits system ships.
 */
export function CreditUpsell({ balance = 0, onUseCredit }: CreditUpsellProps) {
  if (balance <= 0) return null;

  return (
    <button
      type="button"
      onClick={onUseCredit}
      className="w-full rounded-full border border-line bg-surface px-6 py-3 text-sm text-ink transition-colors hover:border-copper/60 hover:text-gold"
    >
      Ou utiliser 1 crédit ({balance} disponible{balance > 1 ? "s" : ""})
    </button>
  );
}
