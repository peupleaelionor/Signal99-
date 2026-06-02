import Link from "next/link";
import { LayoutContainer } from "@/components/LayoutContainer";

export const DISCLAIMER =
  "SIGNAL99 est une expérience symbolique et introspective destinée au divertissement et au développement personnel. Les résultats ne constituent pas une vérité scientifique, médicale, psychologique, financière ou spirituelle.";

export function Footer() {
  return (
    <footer className="border-t border-line py-12">
      <LayoutContainer>
        <p className="font-serif text-xl text-ink">SIGNAL99</p>
        <p className="mt-3 max-w-xl text-xs leading-relaxed text-muted">
          {DISCLAIMER}
        </p>
        <nav className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted">
          <Link href="/legal" className="hover:text-ink">
            Mentions légales
          </Link>
          <Link href="/privacy" className="hover:text-ink">
            Confidentialité
          </Link>
          <Link href="/terms" className="hover:text-ink">
            Conditions
          </Link>
          <Link href="/test" className="hover:text-ink">
            Faire le test
          </Link>
        </nav>
        <p className="mt-6 text-xs text-muted/70">
          © {new Date().getFullYear()} SIGNAL99. Tous droits réservés.
        </p>
      </LayoutContainer>
    </footer>
  );
}
