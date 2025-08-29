import LegalFooter from "@/components/LegalFooter";

export default function PrivacyPolicyPage() {
    return (
        <>
            <div className="max-w-4xl mx-auto px-4 py-10 text-gray-800">
                <h1 className="text-3xl font-bold mb-2 text-primary">
                    Sparkonomy Privacy Policy
                </h1>
                <p className="text-sm text-gray-500 mb-8">
                    Effective Date: 19 August 2025
                </p>

                <h2 className="text-xl font-semibold mt-8 mb-4">
                    Our Commitment to Your Privacy & Success
                </h2>

                <p className="mb-6">
                    Welcome to Sparkonomy! We&apos;re here to provide you—creators, brand
                    marketers, and your teams—with the tools to build thriving businesses
                    in the creator economy. Your trust is the foundation of our
                    partnership, and this Privacy Policy is our commitment to protecting
                    your data and putting you in control. It&apos;s designed to be clear and
                    straightforward, meeting global privacy standards like GDPR,
                    CCPA/CPRA, and India&apos;s Digital Personal Data Protection Act, 2023
                    (DPDP Act), as well as the requirements of our platform partners.
                </p>

                <h2 className="text-xl font-semibold mt-8 mb-4">
                    1. The Information We Collect to Power Your Business
                </h2>
                <p className="mb-4">
                    To build your powerful profile and business tools, we operate on a
                    principle of data minimization. We only collect what we need to
                    deliver and improve your experience. We think about your data in two
                    distinct buckets:
                </p>
                <ul className="list-disc list-inside space-y-2 mb-6">
                    <li>
                        <strong>Public Data:</strong> This is information you have already
                        willingly shared on social platforms and across the internet. We use
                        this to build the foundation of your Sparkonomy profile, making
                        onboarding effortless and ensuring your public brand is accurately
                        represented.
                    </li>
                    <li>
                        <strong>Private Data:</strong> This is information you share
                        directly with us or grant us permission to view. This data powers
                        our creator business tools and is only used for specific purposes to
                        which you agree.
                    </li>
                </ul>
                <div className="overflow-auto mb-6">
                    <table className="min-w-full table-auto border border-gray-300 text-sm">
                        <thead>
                        <tr className="bg-gray-100">
                            <th className="border border-gray-300 px-3 py-2 text-left">
                                Category
                            </th>
                            <th className="border border-gray-300 px-3 py-2 text-left">
                                Examples
                            </th>
                            <th className="border border-gray-300 px-3 py-2 text-left">
                                Source
                            </th>
                            <th className="border border-gray-300 px-3 py-2 text-left">
                                Legal Basis (GDPR)
                            </th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr>
                            <td className="border border-gray-300 px-3 py-2">
                                Your Account & Profile Data
                            </td>
                            <td className="border border-gray-300 px-3 py-2">
                                Name, email, password, mobile phone, government ID, tax ID,
                                banking and payment details.
                            </td>
                            <td className="border border-gray-300 px-3 py-2">
                                Directly from you
                            </td>
                            <td className="border border-gray-300 px-3 py-2 gap-1 flex flex-col">
                                <p>
                                    <strong>Purpose:</strong> To create/secure your account,
                                    enable transactions, and comply with regulations.
                                </p>
                                <p>
                                    <strong>Basis:</strong> Contract Performance; Legal
                                    Obligation
                                </p>
                            </td>
                        </tr>
                        <tr>
                            <td className="border border-gray-300 px-3 py-2">
                                Your Public Footprint
                            </td>
                            <td className="border border-gray-300 px-3 py-2">
                                Your public posts, media, follower counts, bios, and mentions
                                in news or on community sites.
                            </td>
                            <td className="border border-gray-300 px-3 py-2">
                                Publicly available sources & social platforms.
                            </td>
                            <td className="border border-gray-300 px-3 py-2 gap-1 flex flex-col">
                                <p>
                                    <strong>Purpose:</strong> To build the foundation of your
                                    profile and provide market insights.
                                </p>
                                <p>
                                    <strong>Basis:</strong> Legitimate Interest
                                </p>
                            </td>
                        </tr>
                        <tr>
                            <td className="border border-gray-300 px-3 py-2">
                                Authenticated Analytics Data
                            </td>
                            <td className="border border-gray-300 px-3 py-2">
                                Private audience and post metrics from your connected social
                                accounts (e.g., Instagram, YouTube).
                            </td>
                            <td className="border border-gray-300 px-3 py-2">
                                Via each platform&apos;s API access tokens you provide.
                            </td>
                            <td className="border border-gray-300 px-3 py-2 gap-1 flex flex-col">
                                <p>
                                    <strong>Purpose:</strong> To showcase the authentic impact
                                    of your work to brands.
                                </p>
                                <p>
                                    <strong>Basis:</strong> Consent; Contract Performance
                                </p>
                            </td>
                        </tr>
                        {/*<tr>*/}
                        {/*  <td className="border border-gray-300 px-3 py-2">*/}
                        {/*    User‑Generated Content*/}
                        {/*  </td>*/}
                        {/*  <td className="border border-gray-300 px-3 py-2">*/}
                        {/*    Posts, comments, messages you create within the Service*/}
                        {/*  </td>*/}
                        {/*  <td className="border border-gray-300 px-3 py-2">*/}
                        {/*    Directly from you*/}
                        {/*  </td>*/}
                        {/*  <td className="border border-gray-300 px-3 py-2 gap-1 flex flex-col">*/}
                        {/*    <p>*/}
                        {/*      <strong>Purpose:</strong> To create/secure your account,*/}
                        {/*      enable transactions, and comply with regulations.*/}
                        {/*    </p>*/}
                        {/*    <p>*/}
                        {/*      <strong>Basis:</strong> Contract Performance; Legal*/}
                        {/*      Obligation*/}
                        {/*    </p>*/}
                        {/*  </td>*/}
                        {/*</tr>*/}
                        <tr>
                            <td className="border border-gray-300 px-3 py-2">
                                Content You Create on Sparkonomy
                            </td>
                            <td className="border border-gray-300 px-3 py-2">
                                Portfolio items, media kits, messages sent through our
                                platform, and conversations with our AI.
                            </td>
                            <td className="border border-gray-300 px-3 py-2">
                                Directly from you.
                            </td>
                            <td className="border border-gray-300 px-3 py-2 gap-1 flex flex-col">
                                <p>
                                    <strong>Purpose:</strong> To enable you to use our creative
                                    and communication tools.
                                </p>
                                <p>
                                    <strong>Basis:</strong> Contract Performance
                                </p>
                            </td>
                        </tr>
                        <tr>
                            <td className="border border-gray-300 px-3 py-2">
                                Brand & Partnership Data
                            </td>
                            <td className="border border-gray-300 px-3 py-2">
                                Briefs, commercial terms, campaign performance data, and
                                creator lists provided by marketers.
                            </td>
                            <td className="border border-gray-300 px-3 py-2">
                                From our brand and agency users.
                            </td>
                            <td className="border border-gray-300 px-3 py-2 gap-1 flex flex-col">
                                <p>
                                    <strong>Purpose:</strong> To facilitate effective and
                                    efficient creator partnerships.
                                </p>
                                <p>
                                    <strong>Basis:</strong> Contract Performance
                                </p>
                            </td>
                        </tr>
                        <tr>
                            <td className="border border-gray-300 px-3 py-2">
                                Technical & Usage Data
                            </td>
                            <td className="border border-gray-300 px-3 py-2">
                                Your IP address, browser type, and cookies.
                            </td>
                            <td className="border border-gray-300 px-3 py-2">
                                Automated technologies.
                            </td>
                            <td className="border border-gray-300 px-3 py-2 gap-1 flex flex-col">
                                <p>
                                    <strong>Purpose:</strong> To ensure security and improve the
                                    Service.
                                </p>
                                <p>
                                    <strong>Basis:</strong> Legitimate Interest
                                </p>
                            </td>
                        </tr>
                        </tbody>
                    </table>
                </div>

                <h2 className="text-xl font-semibold mt-8 mb-4">
                    2. Your Data from Connected Social Platforms
                </h2>
                <ul className="list-disc list-inside space-y-2 mb-6">
                    <li>
                        <strong>Our Purpose is Your Success:</strong> We request view-only
                        access to analytics to help you showcase the authentic impact of
                        your work, increase your opportunities, and save you time. Our AI
                        uses this data for recommendations; it does not make fully automated
                        decisions that would prevent you from accessing opportunities.
                    </li>
                    <li>
                        <strong>For Users Connecting Meta Accounts:</strong> Our use of data
                        from Facebook and Instagram is governed by{" "}
                        <a
                            className={"text-blue-700 hover:underline"}
                            href={"https://developers.facebook.com/terms/"}
                        >
                            Meta&apos;s Platform Terms
                        </a>
                        . We encourage you to review{" "}
                        <a
                            className={"text-blue-700 hover:underline"}
                            href={"https://www.facebook.com/privacy/policy/"}
                        >
                            Meta&apos;s Privacy Policy
                        </a>
                        .
                    </li>
                    <li>
                        <strong>For Users Connecting YouTube Accounts:</strong> By using
                        Sparkonomy, you acknowledge that we use the{" "}<a
                        className={"text-blue-700 hover:underline"}
                        href={"https://developers.google.com/youtube/terms/developer-policies#definition-youtube-api-services"}
                    >
                        YouTube API Services
                    </a>, for which you agree to be bound by the{" "}
                        <a
                            className={"text-blue-700 hover:underline"}
                            href={"https://www.youtube.com/t/terms"}
                        >
                            YouTube Terms of Service
                        </a>
                        . Our data handling is also subject to the{" "}
                        <a
                            className={"text-blue-700 hover:underline"}
                            href={"http://www.google.com/policies/privacy"}
                        >
                            Google Privacy Policy
                        </a>
                        .
                    </li>
                </ul>

                <h2 className="text-xl font-semibold mt-8 mb-4">
                    3. You Are Always in Control of How You Share
                </h2>
                <p className="mb-4">
                    We will never sell your personal data. You are the sole
                    decision-maker.
                </p>
                <ul className="list-disc list-inside space-y-2 mb-6">
                    <li>
                        <strong>Control Your Visibility:</strong> In your profile account
                        settings, you can choose who sees your Private Data. Your options
                        are to make it visible to everyone, visible{" "}
                        <strong>only to registered Sparkonomy users (default)</strong>, or
                        share it only for
                        <strong>
                            a specific purpose after you give your express consent
                        </strong>
                        .
                    </li>
                    <li>
                        <strong>Your Express Consent is Key:</strong> Your Private Data is
                        <strong>
                            only shared for a specific purpose when you give your express
                            consent
                        </strong>
                        , such as to a brand & agency user for campaign tracking or by clicking <strong>&quot;Apply to this Opportunity&quot;</strong>{" "}
                        or <strong>&quot;Share My Portfolio&quot;</strong>.
                    </li>
                </ul>

                <h2 className="text-xl font-semibold mt-8 mb-4">
                    4. Your Data, On Your Terms: Deletion & Revocation
                </h2>
                <ul className="list-disc list-inside space-y-2 mb-6">
                    <li>
                        <strong>Platform-Specific Data Deletion:</strong> Upon your verified
                        request, we will permanently delete all data from a specific
                        connected platform from our systems{" "}
                        <strong>within five (5) working days</strong>.
                    </li>
                    <li>
                        <strong>Revoking Access for YouTube:</strong> You can revoke our
                        access to your YouTube data at any time via the{" "}
                        <a
                            className={"text-blue-700 hover:underline"}
                            href={"https://security.google.com/settings/security/permissions"}
                        >
                            Google security settings page
                        </a>{" "}through your profile account settings or unlink options.
                    </li>
                    <li>
                        <strong>Revoking Access for Meta:</strong> You can revoke our access to your Meta data at any time via the{" "}
                        <a
                            className={"text-blue-700 hover:underline"}
                            href={"https://accountscenter.meta.com/"}
                        >
                            Meta Accounts Center page
                        </a>{" "}through your profile account settings or unlink options.
                    </li>
                    <li>
                        <strong>Full Account Deletion:</strong> When you close your account,
                        we keep your data for 60 days for recovery, after which it is
                        permanently deleted.
                    </li>
                </ul>

                <section className="mb-12">
                    <h2 className="text-xl font-semibold mb-4">
                        5. Your Responsibilities as a User
                    </h2>
                    <p className="mb-4">
                        To maintain a professional and trustworthy community, you agree to:
                    </p>
                    <ul className="list-disc list-inside space-y-2 mb-4">
                        <li>Provide information that is verifiably authentic.</li>
                        <li>Not impersonate another person.</li>
                        <li>Not register a false or frivolous grievance or complaint.</li>
                    </ul>
                </section>

                <section className="mb-12">
                    <h2 className="text-xl font-semibold mb-4">
                        6. Our Core Commitments & Trusted Partners
                    </h2>
                    <ul className="list-disc list-inside space-y-2 mb-4">
                        <li>
                            <strong>Financial Privacy:</strong> We want to be unequivocally
                            clear:{" "}
                            <strong>
                                we will not seek access to your bank account logins or any means
                                of performing a financial transaction on your behalf.
                            </strong>{" "}
                            We only collect the financial details necessary to power your
                            business tools and process payouts.
                        </li>
                        <li>
                            <strong>Content and IP Protection:</strong> We hold your creative
                            output in the highest esteem. We{" "}
                            <strong>
                                will not knowingly support any impersonation, infringement, or
                                AI-led duplication of your work.
                            </strong>
                            If you notice any such activity, please contact us immediately at{" "}
                            <a
                                className={"text-blue-700 hover:underline"}
                                href={"mailto:hello@sparkonomy.com"}
                            >
                                hello@sparkonomy.com
                            </a>
                            .
                        </li>
                        <li>
                            <strong>Trusted Technology Partners:</strong> We rely on industry
                            leaders to run our platform, including{" "}
                            <strong>Amazon Web Services (AWS)</strong>
                            and{" "}
                            <strong>
                                Google Cloud Platform (including Google&apos;s Gemini AI models,
                                OpenAIs &amp; other similar AI models)
                            </strong>{" "}
                            for our cloud hosting and AI services.
                        </li>
                    </ul>
                </section>

                <h2 className="text-xl font-semibold mt-8 mb-4">
                    7. A Note on Legal Formalities
                </h2>
                <ul className="list-disc list-inside space-y-1 mb-4">
                    <li>
                        <strong>Dispute Resolution & Governing Law:</strong> This policy is
                        governed by the laws of the Republic of Singapore. You agree to use
                        mandatory binding arbitration and waive your right to participate in
                        any class action lawsuit.
                    </li>
                    <li>
                        <strong>Disclaimers and Limitation of Liability:</strong> The
                        Sparkonomy Service is provided &quot;as-is.&quot; We are not liable for
                        user-generated content, the accuracy of AI-generated insights, or
                        the outcomes of partnerships.
                    </li>
                </ul>

                <h2 className="text-xl font-semibold mt-8 mb-4">
                    8. Platform Operations & Your Global Rights
                </h2>
                <ul className="list-disc list-inside space-y-1 mb-4">
                    <li>
                        <strong>Your Global Rights:</strong> We recognize your rights under
                        global privacy laws like GDPR and CCPA/CPRA, including your right to
                        access, correct, and delete your data.
                    </li>
                    <li>
                        <strong>Security:</strong> We use robust security measures to
                        protect your data.
                    </li>
                    <li>
                        <strong>International Transfers:</strong> Your data may be processed
                        outside your country, and we use legal safeguards like Standard
                        Contractual Clauses to protect it.
                    </li>
                    <li>
                        <strong>Children&apos;s Privacy:</strong> Our Service is not intended for
                        anyone under 16.
                    </li>
                    <li>
                        <strong>Policy Changes:</strong> We will provide notice on our
                        website 14 days before any material changes take effect.
                    </li>
                </ul>

                <section className="mb-12" id="contact-us">
                    <h2 className="text-xl font-semibold mb-4">9. Contact Us</h2>
                    <p className="mb-4">
                        If you have questions or grievances, please contact our{" "}
                        <strong>Data Protection Officer</strong>. We will{" "}
                        <strong>acknowledge all grievances within 24 hours</strong> and aim
                        to <strong>resolve them within 15 days</strong>.
                    </p>
                    <ul className="list-disc list-inside space-y-1 mb-4">
                        <li>
                            <strong>Name:</strong> Rachit Jain
                        </li>
                        <li>
                            <strong>Email:</strong>{" "}
                            <a
                                href="mailto:hello@sparkonomy.com"
                                className="text-blue-600 underline"
                            >
                                hello@sparkonomy.com
                            </a>
                        </li>
                        <li>
                            <strong>Company Name:</strong> Sparkonomy Pte. Ltd.
                        </li>
                        <li>
                            <strong>Company UEN:</strong> 202523662W
                        </li>
                        <li>
                            <strong>Registered Address:</strong> 100D PASIR PANJANG #05-03
                            MEISSA SINGAPORE 118520
                        </li>
                    </ul>
                </section>

                <section className="mb-12">
                    <h2 className="text-xl font-semibold mb-4">
                        Appendix: Notice to California Residents (CCPA/CPRA)
                    </h2>
                    <p className="mb-4">
                        This section provides additional details for California residents.
                    </p>
                    <ul className="list-disc list-inside space-y-1 mb-4">
                        <li>
                            <strong>Your Rights:</strong> You have the right to know, access,
                            correct, delete, and opt-out of the &quot;sale&quot; or &quot;sharing&quot; of your
                            personal information. We do not &quot;sell&quot; your data for monetary
                            value.
                        </li>
                        <li>
                            <strong>Data Disclosures:</strong> The chart below details the
                            categories of personal information we collect and disclose for a
                            business purpose.
                        </li>
                    </ul>
                    <div className="overflow-auto mb-6">
                        <table className="min-w-full table-auto border border-gray-300 text-sm">
                            <thead>
                            <tr className="bg-gray-100">
                                <th className="border border-gray-300 px-3 py-2 text-left">
                                    CCPA Legal Category
                                </th>
                                <th className="border border-gray-300 px-3 py-2 text-left">
                                    Examples from Our Data Categories
                                </th>
                                <th className="border border-gray-300 px-3 py-2 text-left">
                                    Categories of Third Parties We Disclose To
                                </th>
                            </tr>
                            </thead>
                            <tbody>
                            <tr>
                                <td className="border border-gray-300 px-3 py-2">
                                    Identifiers
                                </td>
                                <td className="border border-gray-300 px-3 py-2">
                                    Your Account &amp; Profile Data
                                </td>
                                <td className="border border-gray-300 px-3 py-2">
                                    Service Providers (Cloud/AI, Support); Brand Partners (with
                                    your consent).
                                </td>
                            </tr>
                            <tr>
                                <td className="border border-gray-300 px-3 py-2">
                                    Personal Info. (Cal. Civ. Code § 1798.80(e))
                                </td>
                                <td className="border border-gray-300 px-3 py-2">
                                    Your Account &amp; Profile Data
                                </td>
                                <td className="border border-gray-300 px-3 py-2">
                                    Service Providers; Brand Partners (with your consent).
                                </td>
                            </tr>
                            <tr>
                                <td className="border border-gray-300 px-3 py-2">
                                    Commercial Information
                                </td>
                                <td className="border border-gray-300 px-3 py-2">
                                    Brand &amp; Partnership Data
                                </td>
                                <td className="border border-gray-300 px-3 py-2">
                                    Service Providers; Brand Partners (with your consent).
                                </td>
                            </tr>
                            <tr>
                                <td className="border border-gray-300 px-3 py-2">
                                    Internet or Network Activity
                                </td>
                                <td className="border border-gray-300 px-3 py-2">
                                    Technical &amp; Usage Data
                                </td>
                                <td className="border border-gray-300 px-3 py-2">
                                    Service Providers; Advertising Partners; Fraud Detection
                                    &amp; Analytics Services.
                                </td>
                            </tr>
                            <tr>
                                <td className="border border-gray-300 px-3 py-2">
                                    Professional or Employment-Related Info.
                                </td>
                                <td className="border border-gray-300 px-3 py-2">
                                    Your Account &amp; Profile Data; Brand &amp; Partnership
                                    Data
                                </td>
                                <td className="border border-gray-300 px-3 py-2">
                                    Service Providers; Brand Partners (with your consent).
                                </td>
                            </tr>
                            <tr>
                                <td className="border border-gray-300 px-3 py-2">
                                    Inferences Drawn from Personal Info.
                                </td>
                                <td className="border border-gray-300 px-3 py-2">
                                    Inferences drawn from Authenticated Analytics Data and Your
                                    Public Footprint.
                                </td>
                                <td className="border border-gray-300 px-3 py-2">
                                    Service Providers (AI); Brand Partners and other Creators
                                    (with your consent).
                                </td>
                            </tr>
                            </tbody>
                        </table>
                    </div>
                </section>
                <LegalFooter />
            </div>
        </>
    );
}
