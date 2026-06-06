import type { Metadata } from "next";
import { LegalLayout } from "@/components/LegalLayout";
import { DISCLAIMER } from "@/components/Footer";

export const metadata: Metadata = { title: "Legal" };

export default function LegalPage() {
  return (
    <LegalLayout title="Legal">
      <h2>Publisher</h2>
      <p>
        SIGNAL99 is a digital experience published by its owner. For any request,
        contact us at the address shown on the site.
      </p>
      <h2>Hosting</h2>
      <p>
        The site is hosted by a cloud hosting provider. Exact details can be
        provided on request.
      </p>
      <h2>Payment</h2>
      <p>
        Payments are processed securely by Stripe (or a hosted payment link).
        SIGNAL99 never stores card data.
      </p>
      <h2>Nature of the service</h2>
      <p>{DISCLAIMER}</p>
    </LegalLayout>
  );
}
