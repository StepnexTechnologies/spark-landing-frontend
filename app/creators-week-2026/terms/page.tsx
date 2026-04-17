import LegalFooter from "@/components/LegalFooter";
import Link from "next/link";
import {Home} from "lucide-react";

export default function CreatorsWeekTermsPage() {
    return (
        <>
            <div className="relative max-w-4xl mx-auto px-4 py-10 text-gray-800">
                <Link href="/?skipIntro=true" className="absolute top-3 right-3 text-primary hover:text-primary/80 transition-colors">
                    <Home className="w-6 h-6" />
                </Link>
                <h1 className="text-3xl font-bold text-primary mb-2">
                    International Creator&apos;s Day Promo — Terms &amp; Conditions
                </h1>
                <p className="text-sm text-gray-500 mb-8">
                    Effective Date: April 20, 2026
                </p>

                <h2 className="text-xl font-semibold mt-8 mb-4">1. The Offer</h2>
                <p className="mb-4">
                    We&apos;re celebrating International Creators&apos; Day by giving you something
                    we think every creator deserves. A full year of our Invoicing Pro
                    Annual Subscription (valued at ₹3,600), completely free.
                </p>

                <h2 className="text-xl font-semibold mt-8 mb-4">2. Who Can Avail This</h2>
                <p className="mb-4">
                    This one&apos;s for new creators joining the Sparkonomy community.
                    You&apos;re eligible if you: (a) Create a new Sparkonomy account during
                    the Promotion Period (April 20 - April 26, 2026); and (b) Are 18
                    years of age or older with the legal capacity to enter into a
                    binding agreement, consistent with our{" "}
                    <Link
                        href="/legal/terms"
                        className="font-bold hover:underline text-primary"
                    >
                        Terms of Service
                    </Link>{" "}
                    (Section 3). If you already have a Sparkonomy account, this offer
                    isn&apos;t available to you, but stay tuned, we&apos;ve got more coming.
                    One upgrade per creator, and accounts created solely to game this
                    offer will be disqualified.
                </p>

                <h2 className="text-xl font-semibold mt-8 mb-4">
                    3. How to Activate Your Upgrade
                </h2>
                <p className="mb-4">
                    Getting your free Invoicing Pro upgrade takes two steps:
                </p>
                <ol className="list-decimal list-inside space-y-2 mb-6 ml-4">
                    <li>
                        Sign up for a new Sparkonomy account during the Promotion
                        Period; and
                    </li>
                    <li>
                        Create and send at least one invoice using &quot;Send via
                        Sparkonomy&quot; by April 26, 2026, 11:59 PM IST.
                    </li>
                </ol>
                <p className="mb-4">
                    Quick clarification: &quot;Send via Sparkonomy&quot; means using our
                    built-in delivery feature to send your invoice via email or
                    WhatsApp directly from the platform. If you download your invoice
                    and share it outside Sparkonomy (say, over a personal WhatsApp
                    message), that won&apos;t count as activation. If you don&apos;t complete
                    both steps by the deadline, no worries. Your account stays on the
                    standard tier, and you can always upgrade later.
                </p>

                <h2 className="text-xl font-semibold mt-8 mb-4">
                    4. What You Get with Invoicing Pro
                </h2>
                <p className="mb-4">
                    Once activated, here&apos;s what&apos;s unlocked for you:
                </p>
                <ul className="list-disc list-inside space-y-2 mb-6">
                    <li>
                        <strong>Unlimited invoices,</strong> create and send as many as
                        you need, no caps.
                    </li>
                    <li>
                        <strong>Automated payment reminders,</strong> we follow up with
                        brands on your behalf so you don&apos;t have to chase payments.
                    </li>
                    <li>
                        <strong>Professional invoice formats,</strong> clean, polished
                        templates that make you look sharp.
                    </li>
                    <li>
                        <strong>Proof of work attachments,</strong> attach your
                        deliverables directly to invoices to cut down on back-and-forth
                        with brands.
                    </li>
                </ul>

                <h2 className="text-xl font-semibold mt-8 mb-4">5. How Long It Lasts</h2>
                <p className="mb-4">
                    Your Invoicing Pro upgrade stays active until April 26, 2027, no
                    matter when during the Promotion Period you signed up or activated.
                    On April 27, 2027, your account will automatically move back to the
                    standard tier. You will never be charged as part of this promotion.
                    Not at sign-up, not during the year, and not at the time your
                    account moves back to standard. This promotion will never result in
                    automatic billing.
                </p>

                <h2 className="text-xl font-semibold mt-8 mb-4">6. Your Data Is Safe</h2>
                <p className="mb-4">
                    When your account moves back to the standard tier: Every invoice
                    you created during the Invoicing Pro period stays fully accessible.
                    All your client data, invoice history, and account information is
                    preserved in full. Nothing gets deleted, locked, or made
                    inaccessible. Your work is yours.
                </p>

                <h2 className="text-xl font-semibold mt-8 mb-4">
                    7. Want to Upgrade to Paid Mid-Year?
                </h2>
                <p className="mb-4">
                    If you love Invoicing Pro and decide to purchase a paid
                    subscription while you&apos;re still on the promotional upgrade, great.
                    Your remaining unused promotional days will be applied as a credit
                    toward your paid plan. We&apos;ll share the credit details with you at
                    the time of upgrade.
                </p>

                <h2 className="text-xl font-semibold mt-8 mb-4">
                    8. A Few Things to Keep in Mind
                </h2>
                <p className="mb-4">
                    We reserve the right to modify, pause, or end this promotion at
                    any time, with reasonable notice to affected creators. This offer
                    can&apos;t be combined with other promotions unless we say otherwise.
                    It has no cash value and is non-transferable. We take fair use
                    seriously. If we detect abuse, like multiple accounts, automated
                    sign-ups, or invoices sent solely to game the activation condition,
                    we reserve the right to disqualify the account. We may verify your
                    activation eligibility at our discretion.
                </p>

                <h2 className="text-xl font-semibold mt-8 mb-4">9. Governing Law</h2>
                <p className="mb-4">
                    This promotion and these terms are governed by the laws of
                    Singapore, consistent with our{" "}
                    <Link
                        href="/legal/terms"
                        className="font-bold hover:underline text-primary"
                    >
                        Terms of Service
                    </Link>{" "}
                    (Section 12). If a dispute arises, it&apos;ll follow the resolution
                    process described in our Terms of Service.
                </p>

                <h2 className="text-xl font-semibold mt-8 mb-4">
                    10. How This Fits with Our Other Policies
                </h2>
                <p className="mb-4">
                    This promotion lives alongside, and is subject to, our{" "}
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
                    . If anything in these promotional terms conflicts with our Terms
                    of Service, these promotional terms take priority, but only for
                    the duration of this promotion.
                </p>

                <h2 className="text-xl font-semibold mt-8 mb-4">11. Acceptance</h2>
                <p className="mb-4">
                    By using Invoicing Pro features during this promotional period,
                    you&apos;re agreeing to these terms. No extra sign-off or checkbox
                    needed.
                </p>

                <h2 className="text-xl font-semibold mt-8 mb-4">12. Questions?</h2>
                <p className="mb-6">
                    We&apos;re here. Reach us anytime at{" "}
                    <a
                        href="mailto:hello@sparkonomy.com"
                        className={"text-primary font-bold hover:underline"}
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
