import LegalFooter from "@/components/LegalFooter";
import Link from "next/link";
import { Home } from "lucide-react";

export const metadata = {
  title: "Gold Shagun Promo — Terms & Conditions | Sparkonomy",
  description:
    "Terms and conditions for the Sparkonomy Gold Shagun Promo lucky draw running May 4–31, 2026.",
};

export default function GoldPromoTermsPage() {
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
          Gold Shagun Promo — Terms &amp; Conditions
        </h1>
        <p className="text-sm text-gray-500 mb-8">
          Effective Date: May 04, 2026
        </p>

        <h2 className="text-xl font-semibold mt-8 mb-4">1. The Promo</h2>
        <p className="mb-4">
          We believe every invoice you send is a step toward building your
          creator business. To celebrate that, Sparkonomy is running &ldquo;Gold
          Shagun&rdquo; (the &ldquo;Promo&rdquo;), a lucky draw where eligible
          creators who send an invoice through Sparkonomy get a chance to win
          a 0.5 gram gold coin. One lucky winner is selected at the end of the
          draw period.
        </p>

        <h2 className="text-xl font-semibold mt-8 mb-4">2. Promo Period</h2>
        <p className="mb-4">
          The Promo runs from May 04, 2026 to May 31, 2026 (the &ldquo;Promo
          Period&rdquo;), inclusive of both dates. This Promo has one draw
          period, covering the full Promo Period. All times referenced in the
          Promo are in Indian Standard Time (IST).
        </p>
        <p className="mb-4">
          We may, at our sole discretion, extend the Promo to include
          additional draw periods in subsequent months. Any extension will be
          communicated through our promotional channels and will be governed
          by these terms (or updated terms, if applicable). We may also
          withdraw the Promo at any time.
        </p>

        <h2 className="text-xl font-semibold mt-8 mb-4">3. How It Works</h2>
        <p className="mb-4">Here&apos;s the simple version:</p>
        <ul className="list-disc list-inside space-y-2 mb-6">
          <li>
            Send a qualifying invoice (defined in Section 4) via Sparkonomy
            during the Promo Period. This earns you one entry into the lucky
            draw.
          </li>
          <li>
            <strong>One entry per creator.</strong> Whether you send one
            invoice or twenty during the Promo Period, you get one entry.
            Quality over quantity.
          </li>
          <li>
            One winner is selected through a certified random selection
            process (see Section 8). If we extend the Promo to include
            additional draw periods, one winner will be selected per draw
            period.
          </li>
        </ul>

        <h2 className="text-xl font-semibold mt-8 mb-4">
          4. What Counts as a Qualifying Invoice
        </h2>
        <p className="mb-4">
          To earn an entry into the draw, your invoice must meet all of the
          following criteria:
        </p>
        <ul className="list-disc list-inside space-y-2 mb-6">
          <li>
            Created and sent using Sparkonomy&apos;s &ldquo;Send via
            Sparkonomy&rdquo; feature, which delivers your invoice directly to
            your client&apos;s email or WhatsApp from within the platform.
            Important: If you download your invoice from Sparkonomy and share
            it outside the platform (for example, over a personal WhatsApp
            message or email), that does not count as a qualifying invoice.
            Only invoices sent through the in-product &ldquo;Send via
            Sparkonomy&rdquo; feature are eligible.
          </li>
          <li>
            Sent to an external recipient — the email address or phone number
            must belong to a genuine business contact, client, or brand.
            Invoices sent to yourself, to another Sparkonomy account you
            control, or to contacts that aren&apos;t legitimate recipients are
            not eligible.
          </li>
          <li>
            The invoice must reflect a genuine commercial transaction.
            Invoices that appear to be created solely for the purpose of
            entering this Promo may be disqualified at our discretion.
          </li>
          <li>Sent during the Promo Period (May 4 – May 31, 2026).</li>
        </ul>
        <p className="mb-4">
          The timestamp of your invoice submission, as recorded by
          Sparkonomy&apos;s systems, determines whether it falls within the
          Promo Period. Sparkonomy&apos;s system records are final and
          binding.
        </p>

        <h2 className="text-xl font-semibold mt-8 mb-4">
          5. Invoice Verification
        </h2>
        <p className="mb-4">
          We want this Promo to reward creators who are genuinely building
          their businesses. To that end, we reserve the right to verify that
          any qualifying invoice was sent to a legitimate business contact for
          a genuine commercial purpose. This may include, but is not limited
          to, verifying the recipient&apos;s email address or phone number.
        </p>
        <p className="mb-4">
          We may disqualify an entry and withhold or revoke the prize if we
          determine, at our sole discretion, that:
        </p>
        <ul className="list-disc list-inside space-y-2 mb-6">
          <li>
            The invoice was sent to a fabricated, non-functional, or unrelated
            email address or phone number;
          </li>
          <li>
            The invoice was sent to the creator&apos;s own contact details or
            to a contact controlled by the creator;
          </li>
          <li>
            The invoice does not represent a genuine commercial transaction;
            or
          </li>
          <li>
            The invoice appears to have been created solely to qualify for
            this Promo.
          </li>
        </ul>
        <p className="mb-4">
          We&apos;re not required to disclose our verification methods. Our
          decisions on invoice eligibility are final.
        </p>

        <h2 className="text-xl font-semibold mt-8 mb-4">
          6. Who Can Participate
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
          <li>Are a resident of India;</li>
          <li>
            Have a fully completed Sparkonomy account, which means you have
            signed up using your phone number and email address, linked at
            least one social media account (YouTube or Instagram), completed
            all personal details, added your billing entity details, and added
            your payment details; and
          </li>
          <li>
            Send at least one qualifying invoice as defined in Section 4.
          </li>
        </ul>
        <p className="mb-4">
          Winners of the Summer Sign-up Promo are welcome to participate in
          this Promo, the two are independent of each other.
        </p>
        <p className="mb-4">Who can&apos;t participate:</p>
        <ul className="list-disc list-inside space-y-2 mb-6">
          <li>
            Employees and contractors of Sparkonomy Pte. Ltd. and their
            immediate family members (spouse, partner, siblings, and
            children);
          </li>
          <li>
            Talent agencies, intermediaries, or any third party participating
            on behalf of a creator; and
          </li>
          <li>
            Anyone who doesn&apos;t meet the eligibility criteria listed
            above.
          </li>
        </ul>

        <h2 className="text-xl font-semibold mt-8 mb-4">
          7. Social Account Authenticity
        </h2>
        <p className="mb-4">
          Since your Sparkonomy account is linked to your social media
          presence, the same authenticity standards apply. The social media
          account(s) linked to your Sparkonomy profile must be genuine,
          actively maintained, and yours. We reserve the right to disqualify
          any participant if the linked account:
        </p>
        <ul className="list-disc list-inside space-y-2 mb-6">
          <li>Appears to be inactive, dormant, or has no original content;</li>
          <li>Shows signs of artificially inflated followers or engagement;</li>
          <li>Belongs to someone other than the Sparkonomy account holder; or</li>
          <li>Otherwise appears fraudulent, misleading, or inauthentic.</li>
        </ul>
        <p className="mb-4">
          Our determination on social account authenticity is final.
        </p>

        <h2 className="text-xl font-semibold mt-8 mb-4">
          8. How the Winner Is Selected
        </h2>
        <p className="mb-4">
          At the end of the Promo Period, all eligible entries are compiled
          into a draw pool. Within 21 days after the close of the Promo
          Period, Sparkonomy will select one winner using a certified random
          selection process.
        </p>
        <p className="mb-4">What this means:</p>
        <ul className="list-disc list-inside space-y-2 mb-6">
          <li>
            The selection is fully randomised, every eligible entry has an
            equal chance.
          </li>
          <li>
            The process generates an auditable record of the draw for
            transparency.
          </li>
          <li>
            Sparkonomy&apos;s draw results are final and not subject to
            appeal.
          </li>
        </ul>

        <h2 className="text-xl font-semibold mt-8 mb-4">
          9. Winner Notification &amp; Prize Claim
        </h2>
        <p className="mb-4">Here&apos;s what happens when you win:</p>
        <ul className="list-disc list-inside space-y-2 mb-6">
          <li>
            <strong>We&apos;ll reach out:</strong> The winner will be notified
            via the email address and phone number associated with their
            Sparkonomy account.
          </li>
          <li>
            <strong>Verify your identity:</strong> To claim your prize,
            you&apos;ll need to provide a valid government-issued photo ID and
            a delivery address for courier shipment. This helps us confirm you
            are who you say you are and ensures your gold coin reaches the
            right person.
          </li>
          <li>
            <strong>Respond within 14 days:</strong> You must acknowledge the
            notification and provide the required verification details within
            14 days of being notified. If we don&apos;t hear from you within
            14 days, the prize is forfeited. No exceptions, no extensions.
          </li>
          <li>
            <strong>Delivery:</strong> Once verified, your 0.5 gram gold coin
            will be shipped via courier to the delivery address you provide.
            Sparkonomy is not responsible for any loss, damage, or delay
            caused by the courier service after dispatch.
          </li>
        </ul>

        <h2 className="text-xl font-semibold mt-8 mb-4">
          10. Winner Announcement &amp; Marketing Use
        </h2>
        <p className="mb-4">
          We may announce winners on our official Facebook page and other
          promotional channels. By participating in this Promo, you&apos;re
          giving us consent to use your name (as provided in your Sparkonomy
          account), your social media handle, and your public profile photo
          for the following purposes:
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
          affect your prize or your eligibility in this Promo. If you have
          concerns about any of the above, please reach out to us before
          participating.
        </p>

        <h2 className="text-xl font-semibold mt-8 mb-4">11. The Prize</h2>
        <ul className="list-disc list-inside space-y-2 mb-6">
          <li>
            <strong>What you win:</strong> One 0.5 gram gold coin.
          </li>
          <li>
            <strong>No substitution:</strong> The prize is non-transferable
            and cannot be exchanged for cash or any other item. Sparkonomy
            reserves the right to substitute the prize with one of equal or
            greater value if the specified prize becomes unavailable.
          </li>
          <li>
            <strong>Tax:</strong> Any tax liability arising from receipt of
            the prize is the sole responsibility of the winner. Sparkonomy
            will comply with applicable tax deduction at source (TDS)
            requirements under Indian law, if any.
          </li>
        </ul>

        <h2 className="text-xl font-semibold mt-8 mb-4">12. Fair Play</h2>
        <p className="mb-4">
          We take fair play seriously. We reserve the right to disqualify any
          participant and withhold, revoke, or reclaim a prize if we detect or
          reasonably suspect any of the following:
        </p>
        <ul className="list-disc list-inside space-y-2 mb-6">
          <li>
            Invoices sent to fabricated, non-functional, or self-controlled
            contacts;
          </li>
          <li>
            Invoices that don&apos;t represent a genuine commercial
            transaction;
          </li>
          <li>
            Multiple accounts created by the same person to earn additional
            entries;
          </li>
          <li>Use of bots, scripts, or automated tools;</li>
          <li>False, misleading, or fabricated personal information;</li>
          <li>
            Participation by a talent agency, intermediary, or anyone acting
            on a creator&apos;s behalf; or
          </li>
          <li>
            Any other conduct that we determine, at our sole discretion, to be
            an abuse of this Promo.
          </li>
        </ul>
        <p className="mb-4">
          We may verify eligibility at any time, including after a prize has
          been dispatched. Our decisions on disqualification are final.
        </p>

        <h2 className="text-xl font-semibold mt-8 mb-4">
          13. No Purchase Necessary
        </h2>
        <p className="mb-4">
          Participating in this Promo is completely free. No purchase,
          subscription, or payment of any kind is required to enter or win.
          The invoicing feature used for this Promo is available on
          Sparkonomy&apos;s free tier. You will not be charged at any point as
          a result of participating.
        </p>

        <h2 className="text-xl font-semibold mt-8 mb-4">
          14. Changes, Pauses &amp; Ending the Promo
        </h2>
        <p className="mb-4">
          We reserve the right to modify, pause, or end this Promo at any
          time, with reasonable notice where practicable. This includes
          changing the Promo Period, the prize, the number of draw periods,
          or any other Promo terms. Any change won&apos;t affect prizes
          already validly awarded.
        </p>

        <h2 className="text-xl font-semibold mt-8 mb-4">
          15. Limitation of Liability
        </h2>
        <p className="mb-4">
          To the maximum extent permitted by applicable law, Sparkonomy and
          its affiliates shall not be liable for any direct, indirect,
          incidental, or consequential damages arising from this Promo,
          including any delay in prize delivery, courier issues, or any
          technical issues on the Sparkonomy platform during the Promo
          Period.
        </p>

        <h2 className="text-xl font-semibold mt-8 mb-4">16. Governing Law</h2>
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
          17. How This Fits with Our Other Policies
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

        <h2 className="text-xl font-semibold mt-8 mb-4">18. Acceptance</h2>
        <p className="mb-4">
          By sending a qualifying invoice during the Promo Period,
          you&apos;re agreeing to these terms. No extra sign-off or checkbox
          needed.
        </p>

        <h2 className="text-xl font-semibold mt-8 mb-4">19. Questions?</h2>
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
