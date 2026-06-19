import LegalFooter from "@/components/LegalFooter";
import Link from "next/link";
import { Home } from "lucide-react";

export const metadata = {
  title: "Super Fan — Invite & Win Terms & Conditions | Sparkonomy",
  description:
    "Terms and conditions for the Sparkonomy Super Fan referral programme. Invite creators, earn ₹100 per referral, and enter the monthly ₹5,000 lucky draw. Live from June 20, 2026.",
};

export default function SuperFanTermsPage() {
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
          Super Fan — Invite &amp; Win
        </h1>
        <p className="text-lg font-semibold text-gray-700 mb-2">
          Terms &amp; Conditions
        </p>
        <p className="text-sm text-gray-500 mb-8">
          Effective Date: June 20, 2026
        </p>

        <h2 className="text-xl font-semibold mt-8 mb-4">
          1. What Is Super Fan?
        </h2>
        <p className="mb-4">
          Love a creator? Help them discover Sparkonomy and earn rewards while
          you&apos;re at it. Super Fan is Sparkonomy&apos;s referral programme
          (the &ldquo;Programme&rdquo;). You get a unique invitation link. When
          a creator with 5,000+ followers joins Sparkonomy through your link and
          completes a full sign-up, you earn an Amazon voucher worth ₹100. Refer
          10 creators and you also get a chance to win a ₹5,000 Amazon voucher
          in a monthly lucky draw.
        </p>

        <h2 className="text-xl font-semibold mt-8 mb-4">2. Programme Period</h2>
        <p className="mb-4">
          The Programme is live starting June 20, 2026 and runs until withdrawn
          by Sparkonomy. We may withdraw, pause, or modify the Programme at any
          time, at our sole discretion. If we do, we&apos;ll let you know
          through our promotional channels. Referrals completed and rewards
          earned before any withdrawal remain valid.
        </p>

        <h2 className="text-xl font-semibold mt-8 mb-4">3. How It Works</h2>
        <p className="mb-4">Here&apos;s the breakdown:</p>
        <ul className="list-disc list-inside space-y-2 mb-6">
          <li>
            <strong>Get your link:</strong> Sparkonomy generates a unique
            invitation link for you. This link is tied to your account and is
            how we track your referrals.
          </li>
          <li>
            <strong>Share it privately:</strong> Send your link directly to
            creators via private DM or WhatsApp. One-to-one messages only. See
            Section 5 for sharing rules.
          </li>
          <li>
            <strong>Creator joins:</strong> When a creator clicks your link,
            signs up for Sparkonomy, and completes a full sign-up (defined in
            Section 4), that counts as a Qualifying Referral.
          </li>
          <li>
            <strong>Earn ₹100 per referral:</strong> For every Qualifying
            Referral, you earn an Amazon voucher worth ₹100. There&apos;s no
            cap — the more creators you bring in, the more you earn.
          </li>
          <li>
            <strong>Hit 10, enter the draw:</strong> For every 10 Qualifying
            Referrals you accumulate, you earn one entry into the monthly lucky
            draw for an Amazon voucher worth ₹5,000. 20 referrals = 2 entries,
            30 = 3, and so on.
          </li>
        </ul>

        <h2 className="text-xl font-semibold mt-8 mb-4">
          4. What Counts as a Qualifying Referral
        </h2>
        <p className="mb-4">
          A referral counts only when the referred creator meets all of the
          following:
        </p>
        <ul className="list-disc list-inside space-y-2 mb-6">
          <li>Clicks your unique invitation link to reach Sparkonomy;</li>
          <li>Signs up using their phone number and email address;</li>
          <li>
            Links at least one social media account (YouTube or Instagram) with
            5,000 or more followers;
          </li>
          <li>Completes all personal details as required by the sign-up form;</li>
          <li>Adds billing entity details; and</li>
          <li>Adds payment details.</li>
        </ul>
        <p className="mb-4">
          The referred creator must be a new Sparkonomy user who has not
          previously completed a full sign-up. Referring someone who already
          has a completed Sparkonomy account does not count.
        </p>
        <p className="mb-4">
          Sparkonomy&apos;s system records are final and binding for tracking
          referrals, sign-up completion, and follower counts.
        </p>

        <h2 className="text-xl font-semibold mt-8 mb-4">5. Sharing Rules</h2>
        <p className="mb-4">
          Your invitation link is meant for genuine, personal recommendations.
          Here&apos;s what&apos;s allowed and what isn&apos;t:
        </p>
        <p className="mb-2 font-semibold">Allowed:</p>
        <ul className="list-disc list-inside space-y-2 mb-6">
          <li>
            Sharing your link via private, one-to-one messages (DM on Instagram,
            WhatsApp message, or similar private channels);
          </li>
          <li>
            Sharing to as many individual creators as you like, one at a time.
          </li>
        </ul>
        <p className="mb-2 font-semibold">Not allowed:</p>
        <ul className="list-disc list-inside space-y-2 mb-6">
          <li>
            Posting your link in comments on any social media platform
            (Instagram, YouTube, Facebook, X, or elsewhere);
          </li>
          <li>
            Sharing your link in group chats, WhatsApp broadcast lists, Telegram
            groups, or any group messaging channel;
          </li>
          <li>
            Posting your link on social media feeds, stories, or public posts;
            or
          </li>
          <li>
            Any form of bulk, automated, or mass distribution of your link.
          </li>
        </ul>
        <p className="mb-4">
          If we detect that your link was shared in violation of these rules, we
          reserve the right to disqualify all referrals associated with that
          link, withhold or revoke rewards, and disable your link entirely. Our
          determination on sharing rule violations is final.
        </p>

        <h2 className="text-xl font-semibold mt-8 mb-4">
          6. Who Can Be a Super Fan
        </h2>
        <p className="mb-4">To participate as a Super Fan, you must:</p>
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
          <li>Be a resident of India;</li>
          <li>
            Have an active Sparkonomy account (must have at least one social
            media account linked and personal details added).
          </li>
        </ul>
        <p className="mb-4">Who can&apos;t participate:</p>
        <ul className="list-disc list-inside space-y-2 mb-6">
          <li>
            Employees and contractors of Sparkonomy Pte. Ltd. and their
            immediate family members (spouse, partner, siblings, and children);
          </li>
          <li>Talent agencies, intermediaries, or any third party; and</li>
          <li>Anyone who doesn&apos;t meet the eligibility criteria listed above.</li>
        </ul>
        <p className="mb-4">
          You cannot refer yourself. Self-referrals (including referrals to
          accounts you own or control) are not eligible.
        </p>

        <h2 className="text-xl font-semibold mt-8 mb-4">
          7. Referred Creator Authenticity
        </h2>
        <p className="mb-4">
          The referred creator&apos;s social media account must be genuine,
          actively maintained, and theirs. We reserve the right to reject a
          referral and withhold or revoke rewards if the referred creator&apos;s
          linked social account:
        </p>
        <ul className="list-disc list-inside space-y-2 mb-6">
          <li>Appears to be inactive, dormant, or has no original content;</li>
          <li>Shows signs of artificially inflated followers or engagement;</li>
          <li>Was created on or after January 1, 2026;</li>
          <li>Belongs to someone other than the Sparkonomy account holder; or</li>
          <li>Otherwise appears fraudulent, misleading, or inauthentic.</li>
        </ul>
        <p className="mb-4">
          We&apos;re not required to disclose our verification methods. Our
          determination on referred creator authenticity is final.
        </p>

        <h2 className="text-xl font-semibold mt-8 mb-4">
          8. Rewards &amp; Fulfilment
        </h2>
        <p className="mb-2 font-semibold">Per-referral reward:</p>
        <ul className="list-disc list-inside space-y-2 mb-6">
          <li>
            For each Qualifying Referral, you receive an Amazon voucher worth
            ₹100.
          </li>
          <li>
            Vouchers will be delivered via email and/or WhatsApp within 10 days
            of the referral being verified.
          </li>
          <li>There is no cap on the number of referral rewards you can earn.</li>
        </ul>
        <p className="mb-2 font-semibold">Monthly lucky draw (₹5,000):</p>
        <ul className="list-disc list-inside space-y-2 mb-6">
          <li>
            For every 10 Qualifying Referrals you accumulate, you earn one entry
            into the monthly lucky draw for an Amazon voucher worth ₹5,000.
            Entries are cumulative: 20 referrals = 2 entries, 30 = 3, and so on.
          </li>
          <li>
            One winner is selected each month through a certified random
            selection process. The draw will take place within 21 days after the
            end of each calendar month.
          </li>
          <li>Draw results are final and not subject to appeal.</li>
        </ul>
        <p className="mb-2 font-semibold">General voucher terms:</p>
        <ul className="list-disc list-inside space-y-2 mb-6">
          <li>
            Amazon vouchers are subject to Amazon&apos;s own terms and
            conditions. We&apos;re not responsible for any issues with use,
            redemption, expiry, or non-acceptance.
          </li>
          <li>
            Vouchers cannot be exchanged for cash, resold, or transferred to
            another person.
          </li>
          <li>
            Any tax liability from receiving rewards is your responsibility.
            We&apos;ll comply with applicable TDS requirements under Indian law,
            if any.
          </li>
        </ul>

        <h2 className="text-xl font-semibold mt-8 mb-4">9. Fair Play</h2>
        <p className="mb-4">
          We take fair play seriously. In addition to the sharing rules in
          Section 5, we reserve the right to disqualify any Super Fan and
          withhold, revoke, or reclaim rewards if we detect or reasonably
          suspect:
        </p>
        <ul className="list-disc list-inside space-y-2 mb-6">
          <li>
            Fake, fabricated, or coordinated sign-ups designed to game the
            referral system;
          </li>
          <li>
            Use of bots, scripts, or automated tools to generate referrals;
          </li>
          <li>
            Collusion between a Super Fan and referred creators to manufacture
            qualifying referrals;
          </li>
          <li>False, misleading, or fabricated personal information;</li>
          <li>
            Multiple accounts created by the same person to earn additional
            referral rewards; or
          </li>
          <li>
            Any other conduct that we determine, at our sole discretion, to be
            an abuse of this Programme.
          </li>
        </ul>
        <p className="mb-4">
          We may verify referrals at any time, including after rewards have been
          issued. Our decisions on disqualification are final.
        </p>

        <h2 className="text-xl font-semibold mt-8 mb-4">
          10. Winner Announcement &amp; Marketing Use
        </h2>
        <p className="mb-4">
          We may announce lucky draw winners on our official Facebook page and
          other promotional channels. By participating in this Programme,
          you&apos;re giving us consent to use your name (as provided in your
          Sparkonomy account), your social media handle, and your public profile
          photo for the following purposes:
        </p>
        <ul className="list-disc list-inside space-y-2 mb-6">
          <li>
            Winner announcements on our Facebook page and other promotional
            channels; and
          </li>
          <li>
            Marketing and promotional purposes for a period of 6 months from the
            date of the winner announcement.
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
          new marketing within a reasonable timeframe, though materials already
          published or in circulation may remain. Opting out does not affect
          your rewards or eligibility in this Programme. If you have concerns
          about any of the above, please reach out to us before participating.
        </p>

        <h2 className="text-xl font-semibold mt-8 mb-4">
          11. No Purchase Necessary
        </h2>
        <p className="mb-4">
          Participating in this Programme is completely free. No purchase,
          subscription, or payment of any kind is required to earn referral
          rewards or enter the lucky draw. You will not be charged at any point
          as a result of participating.
        </p>

        <h2 className="text-xl font-semibold mt-8 mb-4">
          12. Changes, Pauses &amp; Ending the Programme
        </h2>
        <p className="mb-4">
          We reserve the right to modify, pause, or end this Programme at any
          time, with reasonable notice where practicable. This includes changing
          the referral reward amount, the lucky draw prize, the qualifying
          criteria, or any other Programme terms. Any change won&apos;t affect
          rewards already validly earned.
        </p>

        <h2 className="text-xl font-semibold mt-8 mb-4">
          13. Limitation of Liability
        </h2>
        <p className="mb-4">
          To the maximum extent permitted by applicable law, Sparkonomy and its
          affiliates shall not be liable for any direct, indirect, incidental,
          or consequential damages arising from this Programme, including any
          delay in reward delivery, issues with Amazon voucher redemption, or
          any technical issues on the Sparkonomy platform.
        </p>

        <h2 className="text-xl font-semibold mt-8 mb-4">14. Governing Law</h2>
        <p className="mb-4">
          This Programme and these terms are governed by the laws of the
          Republic of Singapore, consistent with our{" "}
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
          15. How This Fits with Our Other Policies
        </h2>
        <p className="mb-4">
          This Programme lives alongside, and is subject to, our{" "}
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
          . If anything in these Programme terms conflicts with our Terms of
          Service, these Programme terms take priority, but only for the
          duration of this Programme.
        </p>

        <h2 className="text-xl font-semibold mt-8 mb-4">16. Acceptance</h2>
        <p className="mb-4">
          By sharing your unique invitation link, you&apos;re agreeing to these
          terms. No extra sign-off or checkbox needed.
        </p>

        <h2 className="text-xl font-semibold mt-8 mb-4">17. Questions?</h2>
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
