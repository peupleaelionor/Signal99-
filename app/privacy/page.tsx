import type { Metadata } from "next";
import { LegalLayout } from "@/components/LegalLayout";

export const metadata: Metadata = { title: "Privacy policy" };

export default function PrivacyPage() {
  return (
    <LegalLayout title="Privacy policy">
      <p>
        SIGNAL99 is built to minimize data collection. No account is required to
        take the test.
      </p>
      <h2>Data processed</h2>
      <p>
        Your answers and your result are stored locally on your device (browser)
        so you can find your card again. When you pay, the payment provider
        processes the information needed for the transaction; an email address may
        be collected by the provider for the receipt. If you ask us to deliver your
        card manually, the email or handle you submit is stored to fulfil delivery.
      </p>
      <h2>Purpose</h2>
      <p>
        Data is used only to provide the result, unlock the card after payment, and
        improve the experience in an aggregated, anonymous way.
      </p>
      <h2>Cookies & analytics</h2>
      <p>
        Minimal, anonymous analytics may be used to understand the journey (without
        identifying individuals).
      </p>
      <h2>Your rights (GDPR)</h2>
      <p>
        You can request access, correction or deletion of your data by contacting
        us. You can also clear local data by clearing your browser storage.
      </p>
    </LegalLayout>
  );
}
