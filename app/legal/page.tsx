import type { Metadata } from "next";
import { LegalLayout } from "@/components/LegalLayout";
import { DISCLAIMER } from "@/components/Footer";

export const metadata: Metadata = { title: "Mentions légales" };

export default function LegalPage() {
  return (
    <LegalLayout title="Mentions légales">
      <h2>Éditeur</h2>
      <p>
        SIGNAL99 est une expérience numérique éditée par son propriétaire. Pour
        toute demande, contactez-nous à l&apos;adresse indiquée sur le site.
      </p>
      <h2>Hébergement</h2>
      <p>
        Le site est hébergé par un fournisseur d&apos;hébergement cloud. Les
        coordonnées précises peuvent être communiquées sur demande.
      </p>
      <h2>Paiement</h2>
      <p>
        Les paiements sont traités de manière sécurisée par Stripe. SIGNAL99 ne
        stocke aucune donnée de carte bancaire.
      </p>
      <h2>Nature du service</h2>
      <p>{DISCLAIMER}</p>
    </LegalLayout>
  );
}
