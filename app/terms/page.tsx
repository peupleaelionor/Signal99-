import type { Metadata } from "next";
import { LegalLayout } from "@/components/LegalLayout";
import { DISCLAIMER } from "@/components/Footer";

export const metadata: Metadata = { title: "Conditions d'utilisation" };

export default function TermsPage() {
  return (
    <LegalLayout title="Conditions d'utilisation">
      <h2>Objet</h2>
      <p>
        SIGNAL99 propose un test symbolique de 7 questions révélant un archétype
        dominant, ainsi qu&apos;une carte personnelle partageable débloquée par un
        achat unique.
      </p>
      <h2>Prix et paiement</h2>
      <p>
        Le déblocage d&apos;un résultat coûte 0,99 €. Le paiement est traité par
        Stripe. Le résultat est accessible immédiatement après confirmation du
        paiement.
      </p>
      <h2>Nature du contenu</h2>
      <p>{DISCLAIMER}</p>
      <h2>Remboursement</h2>
      <p>
        Le produit étant numérique et délivré immédiatement, les achats ne sont en
        principe pas remboursables, sauf problème technique avéré.
      </p>
      <h2>Responsabilité</h2>
      <p>
        Les résultats sont fournis « tels quels », à des fins de divertissement et
        d&apos;introspection. SIGNAL99 ne saurait être tenu responsable des décisions
        prises sur la base de ces lectures symboliques.
      </p>
    </LegalLayout>
  );
}
