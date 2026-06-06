const POINTS = [
  "Secure payment",
  "Instant result",
  "No account needed",
  "Personal card included",
];

/** Reassurance row near the CTA / checkout to reduce friction. */
export function TrustBar() {
  return (
    <ul className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs text-muted">
      {POINTS.map((p) => (
        <li key={p} className="flex items-center gap-1.5">
          <span className="text-gold">✓</span>
          {p}
        </li>
      ))}
    </ul>
  );
}
