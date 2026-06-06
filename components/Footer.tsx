import Link from "next/link";
import { LayoutContainer } from "@/components/LayoutContainer";
import { LEGAL_DISCLAIMER } from "@/lib/copy";

export const DISCLAIMER = LEGAL_DISCLAIMER;

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
            Legal
          </Link>
          <Link href="/privacy" className="hover:text-ink">
            Privacy
          </Link>
          <Link href="/terms" className="hover:text-ink">
            Terms
          </Link>
          <Link href="/test" className="hover:text-ink">
            Take the test
          </Link>
        </nav>
        <p className="mt-6 text-xs text-muted/70">
          © {new Date().getFullYear()} SIGNAL99. All rights reserved.
        </p>
      </LayoutContainer>
    </footer>
  );
}
