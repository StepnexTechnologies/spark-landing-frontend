import LegalFooter from "@/components/LegalFooter";
import Link from "next/link";
import { Home } from "lucide-react";

export const metadata = {
  title: "Summer Sign-up Promo — Terms & Conditions | Sparkonomy",
  description:
    "Terms and conditions for the Sparkonomy Summer Sign-up Promo running May 4–31, 2026.",
};

export default function SummerPromoTermsPage() {
  return (
    <>
      <div className="relative max-w-4xl mx-auto px-4 py-10 text-gray-800">
        <Link
          href="/?skipIntro=true"
          className="absolute top-3 right-3 text-primary hover:text-primary/80 transition-colors"
        >
          <Home className="w-6 h-6" />
        </Link>

        <h1 className="text-3xl font-bold text-primary mb-2">
          Summer Sign-up Promo — Terms &amp; Conditions
        </h1>
        <p className="text-sm text-gray-500 mb-8">
          Effective Date: May 04, 2026
        </p>

        <h2 className="text-xl font-semibold mt-8 mb-4">1. The Promo</h2>
        <p className="mb-4">
          We&apos;re kicking off summer with something fun for creators.
          Sparkonomy is running the &ldquo;Summer Sign-up Promo&rdquo; (the
          &ldquo;Promo&rdquo;), each day during the Promo Period, the first
          eligible creators who complete a full sign-up within a designated
          time window win an Amazon voucher. Simple as that.
        </p>

        <h2 className="text-xl font-semibold mt-8 mb-4">2. Promo Period</h2>
        <p className="mb-4">
          The Promo runs from May 04, 2026 to May 31, 2026 (the &ldquo;Promo
          Period&rdquo;), inclusive of both dates. We may extend or withdraw
          the Promo at any time, at our sole discretion. If we do, we&apos;ll
          let you know through our promotional channels. All times referenced
          in the Promo are in Indian Standard Time (IST).
        </p>

        <h2 className="text-xl font-semibold mt-8 mb-4">3. How It Works</h2>
        <p className="mb-4">
          Each day during the Promo Period, we&apos;ll announce a Daily Offer
          Window through our promotional channels, including our official
          Facebook page (
          <a
            href="https://www.facebook.com/share/1CFz7nvVi5/?mibextid=wwXIfr"
            target="_blank"
            rel="noopener noreferrer"
            className="font-bold hover:underline text-primary break-all"
          >
            https://www.facebook.com/share/1CFz7nvVi5/?mibextid=wwXIfr
          </a>
          ). The Daily Offer Window and reward details will be shared at the
          time of each announcement.
        </p>
        <p className="mb-4">
          Here&apos;s how the standard offer works: the first 5 eligible
          creators who complete a Qualifying Sign-Up (defined in Section 4
          below) within the announced Daily Offer Window will each receive an
          Amazon voucher worth ₹500.
        </p>
        <p className="mb-4">
          A few things to know: We may change the following Promo parameters
          for any given day or period, with or without prior notice:
        </p>
        <ul className="list-disc list-inside space-y-2 mb-6">
          <li>
            The duration of the Daily Offer Window (which may range from one
            hour to any duration we decide);
          </li>
          <li>
            The value of the Amazon voucher (which may be higher or lower than
            ₹500); and
          </li>
          <li>The maximum number of winners per day.</li>
        </ul>
        <p className="mb-4">
          Any changes will be shared in the daily announcement. If there&apos;s
          no announcement on a given day, no Daily Offer Window is active and
          no vouchers are available for that day.
        </p>
        <p className="mb-4">
          <strong>Important:</strong> We&apos;re not committed to giving out
          any minimum number of vouchers on any given day. If fewer creators
          than the stated daily maximum complete a Qualifying Sign-Up within
          the Daily Offer Window, only those who qualify will receive a
          voucher. Unused vouchers don&apos;t carry over to the next day,
          they&apos;re simply forfeited.
        </p>

        <h2 className="text-xl font-semibold mt-8 mb-4">
          4. What Counts as a Qualifying Sign-Up
        </h2>
        <p className="mb-4">
          To qualify for a daily voucher, you need to complete all of the
          following steps within the announced Daily Offer Window:
        </p>
        <ol className="list-decimal list-inside space-y-2 mb-6 ml-4">
          <li>
            Sign up for Sparkonomy using your phone number and email address
            (new account) or complete the sign-up process if you have an
            existing account with us but haven&apos;t previously completed full
            sign-up;
          </li>
          <li>
            Link at least one social media account (YouTube or Instagram);
          </li>
          <li>Complete all personal details as required by the sign-up form;</li>
          <li>Add your billing entity details; and</li>
          <li>Add your payment details.</li>
        </ol>
        <p className="mb-4">
          All steps need to be completed within the Daily Offer Window,
          partial completion doesn&apos;t count. The timestamp of your final
          qualifying step, as recorded by our systems, determines your
          position in the daily queue. Sparkonomy&apos;s system records are
          final and binding.
        </p>

        <h2 className="text-xl font-semibold mt-8 mb-4">
          5. Who Can Participate
        </h2>
        <p className="mb-4">This Promo is open to you if you:</p>
        <ul className="list-disc list-inside space-y-2 mb-6">
          <li>
            Meet all eligibility requirements under our{" "}
            <Link
              href="/legal/terms"
              className="font-bold hover:underline text-primary"
            >
              Terms of Service
            </Link>
            ;
          </li>
          <li>Are a resident of India; and</li>
          <li>Complete a Qualifying Sign-Up as defined in Section 4 above.</li>
        </ul>
        <p className="mb-4">
          <strong>One voucher per creator:</strong> Each creator can receive a
          voucher under this Promo only once during the entire Promo Period.
          If you&apos;ve already received one, subsequent sign-ups won&apos;t
          entitle you to another.
        </p>
        <p className="mb-4">Who can&apos;t participate:</p>
        <ul className="list-disc list-inside space-y-2 mb-6">
          <li>
            Employees and contractors of Sparkonomy Pte. Ltd. and their
            immediate family members (spouse, partner, parents, siblings and
            children);
          </li>
          <li>
            Talent agencies, intermediaries, or any third party signing up on
            behalf of a creator; and
          </li>
          <li>Anyone who doesn&apos;t meet the eligibility criteria listed above.</li>
        </ul>
        <p className="mb-4">
          Your account must be created and operated by you. Sign-ups done by
          agents, managers, or anyone else on your behalf are not eligible.
        </p>

        <h2 className="text-xl font-semibold mt-8 mb-4">
          6. Social Account Authenticity
        </h2>
        <p className="mb-4">
          The social media account you link during sign-up must be genuine,
          actively maintained, and yours. We reserve the right to disqualify
          any participant and withhold or revoke a voucher if the linked
          social media account:
        </p>
        <ul className="list-disc list-inside space-y-2 mb-6">
          <li>Appears to be inactive, dormant, or has no original content;</li>
          <li>
            Shows signs of artificially inflated followers, engagement, or
            reach (including purchased followers or engagement);
          </li>
          <li>Was created primarily to participate in this Promo;</li>
          <li>Belongs to someone other than the Sparkonomy account holder; or</li>
          <li>Otherwise appears fraudulent, misleading, or inauthentic.</li>
        </ul>
        <p className="mb-4">
          We&apos;re not required to disclose our verification methods, and
          our determination on social account authenticity is final.
        </p>

        <h2 className="text-xl font-semibold mt-8 mb-4">
          7. Voucher Fulfilment
        </h2>
        <p className="mb-4">Here&apos;s what to expect if you win:</p>
        <ul className="list-disc list-inside space-y-2 mb-6">
          <li>
            <strong>How we&apos;ll reach you:</strong> Winners will be notified
            via the email address and/or WhatsApp number associated with their
            Sparkonomy account.
          </li>
          <li>
            <strong>When you&apos;ll get it:</strong> Your Amazon voucher will
            be delivered via email and/or WhatsApp within 10 days of your
            qualifying sign-up date.
          </li>
          <li>
            <strong>Voucher terms:</strong> Amazon vouchers are subject to
            Amazon&apos;s own terms and conditions. We&apos;re not responsible
            for any issues with use, redemption, expiry, or non-acceptance of
            the voucher. Vouchers are non-transferable and cannot be exchanged
            for cash.
          </li>
          <li>
            <strong>Tax:</strong> Any tax liability from receiving the voucher
            is your responsibility. We&apos;ll comply with applicable tax
            deduction at source (TDS) requirements under Indian law, if any.
          </li>
        </ul>

        <h2 className="text-xl font-semibold mt-8 mb-4">
          8. Winner Announcement
        </h2>
        <p className="mb-4">
          We may announce winners on our official Facebook page. By
          participating in this Promo, you&apos;re giving us consent to use
          your name (as provided in your Sparkonomy account), your social
          media handle, and your public profile photo for the following
          purposes:
        </p>
        <ul className="list-disc list-inside space-y-2 mb-6">
          <li>
            Winner announcements on our Facebook page and other promotional
            channels; and
          </li>
          <li>
            Marketing and promotional purposes for a period of 6 months from
            the date of the winner announcement.
          </li>
        </ul>
        <p className="mb-4">
          You may opt out of marketing use at any time by writing to{" "}
          <a
            href="mailto:hello@sparkonomy.com"
            className="text-primary font-bold hover:underline"
          >
            hello@sparkonomy.com
          </a>
          . Upon receiving your request, we will stop using your materials in
          new marketing within a reasonable timeframe, though materials
          already published or in circulation may remain. Opting out does not
          affect your voucher or your eligibility in this Promo. If you have
          concerns about any of the above, please reach out to us before
          participating.
        </p>

        <h2 className="text-xl font-semibold mt-8 mb-4">9. Fair Play</h2>
        <p className="mb-4">
          We take fair play seriously. We reserve the right to disqualify any
          participant and withhold, revoke, or reclaim a voucher if we detect
          or reasonably suspect any of the following:
        </p>
        <ul className="list-disc list-inside space-y-2 mb-6">
          <li>
            Multiple accounts created by the same person to claim more than
            one voucher;
          </li>
          <li>Use of bots, scripts, or automated tools to complete sign-up;</li>
          <li>False, misleading, or fabricated personal information;</li>
          <li>
            Linked social accounts that fail the authenticity criteria in
            Section 6;
          </li>
          <li>
            Sign-up completed by a talent agency, intermediary, or anyone else
            on your behalf; or
          </li>
          <li>
            Any other conduct that we determine, at our sole discretion, to be
            an abuse of this Promo.
          </li>
        </ul>
        <p className="mb-4">
          We may verify eligibility and authenticity at any time, including
          after a voucher has been issued. Our decisions on disqualification
          are final.
        </p>

        <h2 className="text-xl font-semibold mt-8 mb-4">
          10. Changes, Pauses &amp; Ending the Promo
        </h2>
        <p className="mb-4">
          We reserve the right to modify, pause, or end this Promo at any
          time, with reasonable notice where practicable. This includes
          changing the Promo Period, the daily voucher amount, the number of
          daily winners, the Daily Offer Window, or any other Promo terms. Any
          change won&apos;t affect vouchers that have already been validly
          issued.
        </p>

        <h2 className="text-xl font-semibold mt-8 mb-4">
          11. No Purchase Necessary
        </h2>
        <p className="mb-4">
          Participating in this Promo is completely free. No purchase,
          subscription, or payment of any kind is required to enter or win.
          You will not be charged at any point as a result of participating.
          Vouchers awarded under this Promo cannot be exchanged for cash,
          resold, or transferred to another person.
        </p>

        <h2 className="text-xl font-semibold mt-8 mb-4">
          12. Limitation of Liability
        </h2>
        <p className="mb-4">
          To the maximum extent permitted by applicable law, Sparkonomy and
          its affiliates shall not be liable for any direct, indirect,
          incidental, or consequential damages arising from this Promo,
          including any delay in voucher delivery, issues with Amazon voucher
          redemption, or any technical issues on the Sparkonomy platform
          during the Promo Period.
        </p>

        <h2 className="text-xl font-semibold mt-8 mb-4">13. Governing Law</h2>
        <p className="mb-4">
          This Promo and these terms are governed by the laws of the Republic
          of Singapore, consistent with our{" "}
          <Link
            href="/legal/terms"
            className="font-bold hover:underline text-primary"
          >
            Terms of Service
          </Link>{" "}
          (Section 12). Any disputes will follow the resolution process
          described in our Terms of Service.
        </p>

        <h2 className="text-xl font-semibold mt-8 mb-4">
          14. How This Fits with Our Other Policies
        </h2>
        <p className="mb-4">
          This Promo lives alongside, and is subject to, our{" "}
          <Link
            href="/legal/terms"
            className="font-bold hover:underline text-primary"
          >
            Terms of Service
          </Link>
          ,{" "}
          <Link
            href="/legal/privacy-policy"
            className="font-bold hover:underline text-primary"
          >
            Privacy Policy
          </Link>
          , and{" "}
          <Link
            href="/legal/refund-policy"
            className="font-bold hover:underline text-primary"
          >
            Refund &amp; Cancellation Policy
          </Link>
          . If anything in these Promo terms conflicts with our Terms of
          Service, these Promo terms take priority, but only for the duration
          of this Promo.
        </p>

        <h2 className="text-xl font-semibold mt-8 mb-4">15. Acceptance</h2>
        <p className="mb-4">
          By completing a Qualifying Sign-Up during the Promo Period,
          you&apos;re agreeing to these terms. No extra sign-off or checkbox
          needed.
        </p>

        <h2 className="text-xl font-semibold mt-8 mb-4">16. Questions?</h2>
        <p className="mb-6">
          We&apos;re here. Reach us anytime at{" "}
          <a
            href="mailto:hello@sparkonomy.com"
            className="text-primary font-bold hover:underline"
          >
            hello@sparkonomy.com
          </a>
          .
        </p>

        <LegalFooter />
      </div>
    </>
  );
}
