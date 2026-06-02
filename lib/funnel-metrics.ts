import { track } from "@/lib/analytics";
import type { AnalyticsEvent } from "@/types";

/**
 * Central funnel instrumentation.
 *
 * One place to fire the conversion-critical events so the drop-off between each
 * step is measurable from day one. Target benchmarks (to monitor, not enforce):
 *   landing → quiz_started      ~35%
 *   quiz_started → completed    ~70%
 *   completed → checkout        ~25%
 *   checkout → purchase         ~50%
 *   purchase → share/download   ~40%
 */

type Props = Record<string, string | number | boolean | null | undefined>;

function fire(event: AnalyticsEvent, props?: Props) {
  track(event, props);
}

export const funnel = {
  visitorLanded: (page: string) => fire("visitor_landed", { page }),
  quizStarted: () => fire("quiz_started"),
  questionAnswered: (question: number, option: string) =>
    fire("question_answered", { question, option }),
  quizCompleted: (dominant: string, secondary: string) =>
    fire("quiz_completed", { dominant, secondary }),
  lockedResultSeen: (id: string) => fire("result_locked_viewed", { id }),
  checkoutStarted: (id: string, sku: string) =>
    fire("checkout_started", { id, sku }),
  purchaseCompleted: (id: string, sku: string, mode: string) =>
    fire("purchase_completed", { id, sku, mode }),
  upsellSeen: (id: string) => fire("upsell_seen", { id }),
  upsellPurchased: (id: string) => fire("upsell_purchased", { id }),
  unlockedResultSeen: (id: string, signal: string) =>
    fire("result_unlocked_viewed", { id, signal }),
  cardDownloaded: (signal: string) => fire("card_downloaded", { signal }),
  shareClicked: (signal: string, channel: string) =>
    fire("share_clicked", { signal, channel }),
  sharePageViewed: (slug: string, signal: string) =>
    fire("share_page_viewed", { slug, signal }),
  referralStarted: (signal: string) => fire("referral_started", { signal }),
  testRestarted: () => fire("test_restarted"),
};
