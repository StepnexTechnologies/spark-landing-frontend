import LegalFooter from "@/components/LegalFooter";
import LegalHeader from "@/components/LegalHeader";
import Link from "next/link";

// TODO: replace with the published Trusted Partner Program Guide URL once it exists.
const PROGRAM_GUIDE_URL = "#";

export default function TrustedPartnerTermsPage() {
    return (
        <>
            <div className="max-w-4xl mx-auto px-4 py-10 text-gray-800">
                <LegalHeader
                    title="Sparkonomy Trusted Partner Program — Terms & Conditions"
                    effectiveDate="July 14, 2026"
                    lastUpdated="July 14, 2026"
                    homeHref="/"
                    homeClassName="mr-4 mt-1"
                />

                <p className="mb-4">
                    These are the Terms &amp; Conditions (&quot;Terms&quot;) for the Sparkonomy Trusted Partner Program
                    (&quot;Program&quot;). They&apos;re issued by Sparkonomy Pte. Ltd., a company based in Singapore
                    (company number UEN: 202523662W, address: 100D Pasir Panjang #05-03 Meissa, Singapore 118520)
                    (&quot;Sparkonomy&quot;, &quot;we&quot;, &quot;us&quot;). When you check the box for the Trusted
                    Partner Program on the Sparkonomy site, you&apos;re agreeing to these Terms (&quot;Partner&quot;,
                    &quot;you&quot;).
                </p>
                <p className="mb-6">
                    These Terms work together with Sparkonomy&apos;s{" "}
                    <Link
                        href="/legal/terms"
                        className="font-bold hover:underline text-primary"
                    >
                        Terms of Service
                    </Link>
                    , which you already agreed to when you made your Sparkonomy account. If something in these Terms is
                    different from the Terms of Service, and it&apos;s about the Trusted Partner Program, these Terms
                    win.
                </p>

                <h2 className="text-xl font-semibold mt-8 mb-4">
                    About the Program
                </h2>
                <p className="mb-4">
                    The Sparkonomy Trusted Partner Program lets you earn real commission by telling other creators about
                    Sparkonomy. It costs nothing to join, and there&apos;s nothing to buy — you just share your personal
                    Partner link.
                </p>
                <p className="mb-4">
                    When someone buys a paid Sparkonomy plan through your link, you earn 50% of that sale. If they go on
                    to invite other creators who also become Partners, you earn 10% more on the sales those Partners
                    make, and another 5% on the sales made by the Partners they bring in.
                </p>
                <p className="mb-4">
                    You only earn money from a real, confirmed, paid Sparkonomy subscription — never just for referring
                    or signing someone up. The full commission rates, bonus rules, and payment details are in the
                    Sparkonomy Trusted Partner Program Guide, explained more in Section 2 below.
                </p>
                <p className="mb-4">
                    Read the full{" "}
                    <a
                        href={PROGRAM_GUIDE_URL}
                        className="text-primary font-bold hover:underline"
                    >
                        Sparkonomy Trusted Partner Program Guide
                    </a>
                    .
                </p>
                <p className="mb-6">
                    These Terms apply from the moment you check the box to join the Program on the Sparkonomy site.
                </p>

                <h2 className="text-xl font-semibold mt-8 mb-4">
                    1. Relationship of the Parties
                </h2>
                <p className="mb-4">
                    You&apos;re your own boss here — in legal terms, you&apos;re an &quot;independent contractor&quot;
                    working with Sparkonomy on what&apos;s called a &quot;principal-to-principal&quot; basis. This means
                    Sparkonomy is not your employer, and you&apos;re not our business partner or agent. Being a Trusted
                    Partner doesn&apos;t create a job, a partnership, or any other formal relationship between you and
                    Sparkonomy. Because of that, you can&apos;t make promises or sign deals for Sparkonomy, and we
                    won&apos;t be held to anything you say outside of the official materials we give you (see Section
                    3).
                </p>
                <p className="mb-4">
                    You&apos;re always free to decide how, when, and whether you promote Sparkonomy. We&apos;re not here
                    to tell you what hours to keep, how to run things, or stop you from working with other clients or
                    businesses — the only rules we ask you to follow are the ones in this Agreement.
                </p>
                <p className="mb-6">
                    One more thing: this Agreement, the Program Guide, and our Terms of Service are the only terms that
                    apply to this Program, and they win over anything else — no matter where you saw it. This includes
                    social media, DMs, and any third-party platform or listing, including Meta Creator Marketplace. If a
                    number, rate, or promise shown anywhere else — including on Meta Creator Marketplace — is different
                    from what&apos;s written here, it does not apply to you. The real commission rates are the ones in
                    Section 2 below, not any figure shown anywhere else.
                </p>

                <h2 className="text-xl font-semibold mt-8 mb-4">
                    2. Program Participation &amp; Commissions
                </h2>
                <p className="mb-4">
                    You earn commission (a share of the sale) when someone you invite buys a paid Sparkonomy plan and
                    stays on it for 30 days. Here&apos;s how much you earn:
                </p>
                <ul className="list-disc list-inside space-y-2 mb-6">
                    <li>
                        <strong>Level 1</strong> (people you invite directly): 50% of the sale.
                    </li>
                    <li>
                        <strong>Level 2</strong> (people invited by Partners you invited): 10% of the sale.
                    </li>
                    <li>
                        <strong>Level 3</strong> (people invited by Level 2 network): 5% of the sale.
                    </li>
                </ul>
                <p className="mb-4">
                    You only earn commissions and bonuses from a real, confirmed, paid Sparkonomy subscription. We call
                    this a &quot;Paid Signup.&quot; You do not earn anything just for signing someone up, inviting them,
                    or getting them to make a free account. If the Program Guide uses words like &quot;signup&quot; or
                    &quot;activation,&quot; it means Paid Signup, as explained here.
                </p>
                <p className="mb-4">
                    The Program follows the rules for a &quot;direct selling network&quot; under India&apos;s Consumer
                    Protection (Direct Selling) Rules, 2021. This means you only get paid because of real product sales
                    — never just for signing people up. The Program is not, and will never be, a pyramid scheme or money
                    circulation scheme under that law or under the Prize Chits and Money Circulation Schemes (Banning)
                    Act, 1978.
                </p>
                <p className="mb-6">
                    Bonus amounts and other Program details are in the Sparkonomy Trusted Partner Program Guide (Exhibit
                    A). Sparkonomy can update the Program Guide, including bonus amounts, but must tell you at least 14
                    days before a change starts. If you keep taking part after that, it means you agree to the update.
                    Any commission you already earned before the update stays the same — it will not go down.
                </p>

                <h2 className="text-xl font-semibold mt-8 mb-4">
                    3. Brand &amp; IP Usage
                </h2>
                <p className="mb-6">
                    Sparkonomy lets you use our official logos, screenshots, and marketing materials to promote the
                    Program. This permission only lets you use the materials as they&apos;re given to you — please
                    don&apos;t change them. We can take this permission away at any time, and we can give the same
                    permission to other Partners too. Please don&apos;t suggest you have a bigger or different
                    relationship with Sparkonomy than being an independent Trusted Partner. This permission ends
                    automatically when this Agreement ends.
                </p>

                <h2 className="text-xl font-semibold mt-8 mb-4">
                    4. Content Format
                </h2>
                <p className="mb-4">
                    If you create content — a video, post, or story — about Sparkonomy, here&apos;s how it works. You
                    choose the format: a single video, or a series, whatever shows Sparkonomy naturally to your
                    audience. Post it on whichever platform (Instagram, Facebook, WhatsApp, or YouTube) works best for
                    you. Your content should help people understand Sparkonomy, and show them how it solves real
                    invoicing and business-tracking problems.
                </p>
                <p className="mb-6">
                    Once you post content featuring Sparkonomy, please keep it public and live on your profile for as
                    long as you&apos;re part of the Program — please don&apos;t delete, hide, or archive it, so people
                    can still find and click your link. This applies while you&apos;re an active Trusted Partner; once
                    you leave the Program, this specific duty ends.
                </p>

                <h2 className="text-xl font-semibold mt-8 mb-4">
                    5. Content &amp; Brand Safety Standards
                </h2>
                <p className="mb-4">
                    You never need to send us your content for approval before you post it — you&apos;re free to publish
                    whenever you feel ready. When you do make content about Sparkonomy, please follow these rules:
                </p>
                <ul className="list-disc list-inside space-y-2 mb-6">
                    <li>
                        <strong>Show Sparkonomy accurately:</strong> Don&apos;t use fake screens, edited screenshots, or
                        made-up versions of our app. Use our real materials (Section 3), or record the real Sparkonomy
                        app yourself.
                    </li>
                    <li>
                        <strong>No put-downs:</strong> Don&apos;t say false or hurtful things about Sparkonomy, other
                        creators, or competitor companies while promoting the Program.
                    </li>
                    <li>
                        <strong>Keep it clean:</strong> Your content must not include hate speech, discrimination,
                        explicit content, or anything illegal.
                    </li>
                    <li>
                        <strong>Fixing mistakes:</strong> If your content breaks any of these rules, or says something
                        wrong about Sparkonomy, we can ask you to fix it or take it down. You agree to do this within 24
                        hours.
                    </li>
                </ul>

                <h2 className="text-xl font-semibold mt-8 mb-4">
                    6. Music &amp; Audio
                </h2>
                <p className="mb-6">
                    If your content uses music or sound, please only use audio that&apos;s safe for business use —
                    royalty-free music, talking-only audio, or tracks from your platform&apos;s official
                    &quot;commercial audio library&quot; (the tracks marked safe for business use). Please don&apos;t
                    use popular commercial songs, copyrighted tracks, or movie audio. If a music company ever issues a
                    copyright claim or fine because unapproved music was used in your content, you&apos;re responsible
                    for resolving it.
                </p>

                <h2 className="text-xl font-semibold mt-8 mb-4">
                    7. Advertising Disclosures
                </h2>
                <p className="mb-4">
                    Advertising laws say people need to know right away when content is part of a paid partnership.
                    Whenever you post about Sparkonomy, please:
                </p>
                <ul className="list-disc list-inside space-y-2 mb-6">
                    <li>
                        Put your disclosure in the very first line of your caption, so people see it without clicking
                        &quot;See More.&quot;
                    </li>
                    <li>
                        Use only these tags: <strong>#Ad</strong> or <strong>#PaidPartnership</strong> (or{" "}
                        <strong>#विज्ञापन</strong> if your content is entirely in Hindi). Please don&apos;t use #collab,
                        #sp, #spon, #partnership, or #thanks — regulators don&apos;t accept these as real disclosures.
                    </li>
                    <li>
                        If your video is under 15 seconds, keep the disclosure on screen for at least 3 seconds. If
                        it&apos;s longer, keep it on screen for the whole time you&apos;re talking about or showing
                        Sparkonomy.
                    </li>
                    <li>
                        Turn on your platform&apos;s official paid partnership label too (like YouTube&apos;s
                        &quot;Includes paid promotion&quot; or Instagram&apos;s &quot;Paid Partnership&quot; label).
                    </li>
                </ul>

                <h2 className="text-xl font-semibold mt-8 mb-4">
                    8. Exclusivity
                </h2>
                <p className="mb-6">
                    Because you&apos;re introducing Sparkonomy to your audience, we ask that you don&apos;t promote a
                    competing invoicing tool at the same time. This means no paid posts, sponsored content, or affiliate
                    promotions for any other app that helps creators create, manage, track, or send invoices, for 7 days
                    before and 7 days after each time you promote Sparkonomy — whether that&apos;s a video, a post, or
                    sharing your Partner link under this program.
                </p>

                <h2 className="text-xl font-semibold mt-8 mb-4">
                    9. IP License &amp; Paid Ads
                </h2>
                <p className="mb-4">
                    You own any content you create — the copyright is yours. By posting content featuring Sparkonomy,
                    you also give us permission (a license) to reuse and repost it on our official social pages,
                    website, and emails, for up to 6 months after you post it. This license is free and worldwide.
                    Whenever we reuse your content, we&apos;ll tag your account or credit your name.
                </p>
                <p className="mb-6">
                    If your content performs well and we want to run paid ads with it (like Whitelisting or Spark Ads)
                    to drive traffic to your link, we&apos;ll pay you a flat honorarium of ₹5,000 (or $65 USD
                    equivalent) for a 30-day ad run. We&apos;ll always ask for your clear yes first, inside the app,
                    before turning your content into a paid ad.
                </p>

                <h2 className="text-xl font-semibold mt-8 mb-4">
                    10. Payment Terms
                </h2>
                <ul className="list-disc list-inside space-y-2 mb-6">
                    <li>
                        We count your commissions once a month, and pay you within the first 10 working days of the next
                        month, straight to your bank account.
                    </li>
                    <li>
                        You need at least ₹500 in confirmed commission before we pay you. If you have less than ₹500, it
                        carries over to the next month until you reach ₹500.
                    </li>
                    <li>
                        If we use your content for paid ads, you&apos;ll also get the separate ₹5,000 honorarium
                        described in Section 9.
                    </li>
                    <li>
                        If the law requires it, we&apos;ll deduct tax (like TDS under Indian tax law) before we pay you,
                        and give you a tax certificate for it.
                    </li>
                    <li>
                        You&apos;re responsible for your own taxes, including registering for GST if your total earnings
                        require it. Please talk to a tax advisor (CA) about this — we can&apos;t advise you ourselves.
                    </li>
                    <li>
                        If someone you referred gets a refund, we may take that commission back from your next payment,
                        or ask you to pay it back directly if you have no future payments coming.
                    </li>
                    <li>
                        Sparkonomy can review your account and referrals for fraud or other rule-breaking, like fake
                        signups or manipulated referrals. If we reasonably determine a paid signup was fraudulent, we
                        can deduct that commission from your payout, and we&apos;ll let you know when we do. If you
                        disagree with a decision, you can raise it through the process in Section 12.
                    </li>
                </ul>

                <h2 className="text-xl font-semibold mt-8 mb-4">
                    11. Your Commitments
                </h2>
                <p className="mb-6">
                    When you promote Sparkonomy, please be honest. Don&apos;t make false or misleading claims about the
                    product, the price, or how much people can earn. Don&apos;t spam people or create fake signups. Only
                    use your own Partner link — never someone else&apos;s. If Sparkonomy gives you earnings examples,
                    remember they&apos;re just examples, not promises, so please share them that way too.
                </p>

                <h2 className="text-xl font-semibold mt-8 mb-4">
                    12. Confidentiality &amp; Grievances
                </h2>
                <p className="mb-6">
                    If either of us shares private business information with the other, both sides agree to keep it
                    private and only use it for the Program. This doesn&apos;t apply to information that&apos;s already
                    public, that you already knew, or that the law requires us to share. If you ever have a complaint
                    about the Program — including about your commission — email us at{" "}
                    <a
                        href="mailto:hello@sparkonomy.com"
                        className="text-primary font-bold hover:underline"
                    >
                        hello@sparkonomy.com
                    </a>
                    . We&apos;ll respond and follow our normal complaint process.
                </p>

                <h2 className="text-xl font-semibold mt-8 mb-4">
                    13. Term &amp; Termination
                </h2>
                <ul className="list-disc list-inside space-y-2 mb-6">
                    <li>
                        This Agreement starts the day you accept it online, and continues until either of us ends it.
                    </li>
                    <li>
                        You can leave the Program any time — just turn off your participation in your account settings.
                    </li>
                    <li>
                        Sparkonomy can end this Agreement right away if you break any part of it, including committing
                        fraud or breaking the Terms of Service. If we end it for any other reason, we&apos;ll give you
                        14 days&apos; notice first.
                    </li>
                    <li>
                        If this Agreement ends, you still get paid any commission you already earned and confirmed
                        before that date. You won&apos;t earn new commissions for sales made after the Agreement ends,
                        even if you introduced that person a long time ago.
                    </li>
                    <li>
                        Some parts of this Agreement continue even after it ends — including the content license in
                        Section 9, confidentiality in Section 12, and the liability terms in Section 14.
                    </li>
                </ul>

                <h2 className="text-xl font-semibold mt-8 mb-4">
                    14. Limitation of Liability &amp; Indemnification
                </h2>
                <p className="mb-6">
                    If something goes wrong, Sparkonomy&apos;s responsibility is limited the same way it&apos;s limited
                    in our Terms of Service. Also, if a third party makes a claim against Sparkonomy, or Sparkonomy
                    suffers a loss or damages, because of something you did — like breaking this Agreement, something in
                    your promotions, or breaking the law — you agree to cover those costs and won&apos;t hold Sparkonomy
                    responsible for them. This is called &quot;indemnifying and holding harmless&quot; Sparkonomy.
                </p>

                <h2 className="text-xl font-semibold mt-8 mb-4">
                    15. Governing Law &amp; Dispute Resolution
                </h2>
                <p className="mb-6">
                    This Agreement follows Singapore law. If we ever disagree about anything here, we&apos;ll first try
                    to sort it out by talking directly for 30 days. If that doesn&apos;t work, the disagreement goes to
                    binding arbitration in Singapore (a private legal process instead of court), following Section 12 of
                    our{" "}
                    <Link
                        href="/legal/terms"
                        className="font-bold hover:underline text-primary"
                    >
                        Terms of Service
                    </Link>
                    . Neither of us can join a class action or group lawsuit about this Agreement.
                </p>

                <h2 className="text-xl font-semibold mt-8 mb-4">
                    16. General Provisions
                </h2>
                <p className="mb-6">
                    This Agreement, the Program Guide, and our Terms of Service together are the complete agreement
                    between us about the Program. You can&apos;t transfer this Agreement to someone else without our
                    written permission. We can transfer this Agreement if we merge with another company, get bought, or
                    sell our assets. If any part of this Agreement turns out to be legally invalid, the rest still
                    applies. We&apos;ll send important notices to the email on your account. You can always reach us at{" "}
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
