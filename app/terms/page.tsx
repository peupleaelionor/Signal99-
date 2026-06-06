import type { Metadata } from "next";
import { LegalLayout } from "@/components/LegalLayout";
import { DISCLAIMER } from "@/components/Footer";

export const metadata: Metadata = { title: "Terms of use" };

export default function TermsPage() {
  return (
    <LegalLayout title="Terms of use">
      <h2>Purpose</h2>
      <p>
        SIGNAL99 offers a symbolic 7-question test that reveals a dominant
        archetype, plus a shareable personal card unlocked by a single purchase.
      </p>
      <h2>Price and payment</h2>
      <p>
        Unlocking a result costs $0.99. Payment is processed by Stripe (or a hosted
        payment link). The result is available as soon as payment is confirmed.
      </p>
      <h2>Nature of the content</h2>
      <p>{DISCLAIMER}</p>
      <h2>Refunds</h2>
      <p>
        As the product is digital and delivered immediately, purchases are
        generally non-refundable, except in the case of a proven technical issue.
      </p>
      <h2>Liability</h2>
      <p>
        Results are provided “as is”, for entertainment and self-reflection.
        SIGNAL99 cannot be held responsible for decisions made on the basis of
        these symbolic readings.
      </p>
    </LegalLayout>
  );
}
