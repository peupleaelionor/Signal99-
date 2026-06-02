import type { Metadata } from "next";
import { LegalLayout } from "@/components/LegalLayout";

export const metadata: Metadata = { title: "Politique de confidentialité" };

export default function PrivacyPage() {
  return (
    <LegalLayout title="Politique de confidentialité">
      <p>
        SIGNAL99 est conçu pour minimiser la collecte de données. Aucune création
        de compte n&apos;est requise pour faire le test.
      </p>
      <h2>Données traitées</h2>
      <p>
        Tes réponses au test et ton résultat sont stockés localement sur ton
        appareil (navigateur) pour te permettre de retrouver ta carte. Lors d&apos;un
        achat, Stripe traite les informations de paiement nécessaires à la
        transaction ; une adresse e-mail peut être collectée par Stripe pour le
        reçu.
      </p>
      <h2>Finalités</h2>
      <p>
        Les données servent uniquement à fournir le résultat, débloquer la carte
        après paiement et améliorer l&apos;expérience de façon agrégée et anonyme.
      </p>
      <h2>Cookies & mesure d&apos;audience</h2>
      <p>
        Une mesure d&apos;audience minimale et anonyme peut être utilisée pour
        comprendre le parcours (sans identifier les personnes).
      </p>
      <h2>Tes droits (RGPD)</h2>
      <p>
        Tu peux demander l&apos;accès, la rectification ou la suppression de tes
        données en nous contactant. Tu peux aussi effacer les données locales en
        vidant le stockage de ton navigateur.
      </p>
    </LegalLayout>
  );
}
