import LegalFooter from "@/components/LegalFooter";
import Link from "next/link";
import {Home} from "lucide-react";

export default function TermsOfServicePage() {
    return (
        <>
            <div className="max-w-4xl mx-auto px-4 py-10 text-gray-800">
                <div className="flex justify-between items-start mb-2">
                    <h1 className="text-3xl font-bold text-primary">
                        The Sparkonomy Terms of Service
                    </h1>
                    <Link href="/" className="text-primary hover:text-primary/80 transition-colors mr-8 mt-2">
                        <Home className="w-6 h-6" />
                    </Link>
                </div>
                <p className="text-sm text-gray-500 mb-8">
                    Effective Date: August 10, 2025
                </p>
                <p className="mb-4">
                    Welcome to Sparkonomy! We’re thrilled to have you. We’re building an
                    ecosystem where creators and brands can forge powerful, successful
                    partnerships. Think of us as your thinking partner, here to help you
                    thrive.
                </p>
                <p className="mb-4">
                    These Terms of Service (&quot;Terms&quot;) are our promise to you. They explain
                    how our platform works and the roles we all play in keeping our
                    community professional, authentic, and trustworthy. By creating an
                    account or using our services (&quot;Services&quot;), you agree to these Terms.
                </p>
                <p className="mb-6">
                    Our{" "}
                    <Link
                        href="/legal/privacy-policy"
                        className="font-bold hover:underline text-primary"
                    >
                        Privacy Policy
                    </Link>{" "}
                    is a separate, equally important document. It explains what data we
                    collect and how we use it. Your trust is everything to us, so we
                    encourage you to read that, too.
                </p>

                <h2 className="text-xl font-semibold mt-8 mb-4">
                    1. Our Services: The Sparkonomy Operating System
                </h2>
                <p className="mb-4">
                    <strong>Disclaimer on Service Availability and Evolution:</strong> The following descriptions outline the vision for our comprehensive platform. These services are illustrative of our goals and are not an exhaustive list or a binding commitment. Many of these services may not be currently available and will be released over time, including in &quot;Beta&quot; versions (as defined below). We reserve the right, in our sole discretion, for the nature of any service to vary from its description, evolve, merge with other services, or not be introduced at all.
                </p>
                <p className="mb-4">
                    Sparkonomy provides a comprehensive, AI-powered Operating System
                    (&quot;Services&quot;) designed to empower creators, brands, and agencies. Our
                    goal is to be your thinking partner, helping you manage and scale your
                    business. The services we offer are constantly evolving and may
                    include, but are not limited to, the features described below.
                </p>
                <ul className="list-inside space-y-2 mb-1 ml-4">
                    <li>
                        <strong>(a) For Creators - Content & Strategy OS:</strong>{" "}
                        Intelligent tools to help you create better content and grow your
                        audience, including AI-driven insights on trends, content strategy
                        recommendations, and creative workflow tools for planning and
                        scheduling.
                    </li>
                    <li>
                        <strong>(b) For Creators - Business & Monetization OS:</strong> A
                        suite of tools to run your creator-as-a-business venture, including
                        AI-powered agents for brand engagement, invoice generation, payment
                        tracking, simplified contract templates, and resources to assist
                        with tax compliance.
                    </li>
                    <li>
                        <strong>
                            (c) For All Users - Professional Network & Marketplace:
                        </strong>{" "}
                        A platform to discover, connect, and engage with other creators,
                        brands, and specialized suppliers (like editors and designers), and
                        a dedicated marketplace to find and manage brand partnerships.
                    </li>
                    <li>
                        <strong>
                            (d) For Brands & Agencies - Campaign & Partnership OS:
                        </strong>{" "}
                        A comprehensive platform with AI-driven tools to assist you in
                        discovering creators, managing campaigns, and simplifying
                        professional collaborations. Our features are designed to streamline
                        your workflow and maximize your marketing impact.
                    </li>
                </ul>
                <ul className="list-disc list-inside space-y-2 mb-6 ml-8">
                    <li>
                        <strong>Creator Intelligence & Discovery:</strong> AI-powered search
                        and matching tools to identify creators that best fit your campaign
                        objectives, audience demographics, and brand values. We provide
                        real-time, data-driven insights into a creator&apos;s audience and
                        historical performance to inform your decisions.
                    </li>
                    <li>
                        <strong>Campaign & Performance Management:</strong> An integrated
                        dashboard to plan, launch, and monitor your influencer marketing
                        campaigns. We provide tools for content approval, deliverable
                        tracking, and objective-based impact measurement and reporting,
                        giving you a clear view of your campaign&apos;s ROI.
                    </li>
                    <li>
                        <strong>Partnership & Legal Automation:</strong> AI-powered agents
                        to simplify the entire partnership lifecycle. This includes tools
                        for creating and managing legal contracts, generating invoices, and
                        tracking payments, ensuring professional and legally sound
                        collaborations.
                    </li>
                </ul>

                <h2 className="text-xl font-semibold mt-8 mb-4">
                    2. Beta Services
                </h2>
                <p className="mb-4">
                    From time to time, we may offer you the opportunity to participate in &quot;Private Beta&quot; or &quot;Public Beta&quot; programs for new and pre-release services (&quot;Beta Services&quot;). By accessing or using any Beta Services, you agree to the following terms.
                </p>
                <ul className="list-disc list-inside space-y-2 mb-6">
                    <li>
                        <strong>Nature of Beta Services:</strong> You acknowledge and agree that Beta Services are provided for testing and evaluation purposes only. They are offered &quot;AS-IS&quot; and &quot;AS-AVAILABLE&quot; and may contain bugs, errors, and other defects. They may be unstable, become unavailable, undergo frequent changes, and result in data loss. We are under no obligation to provide technical support for Beta Services. Your participation is voluntary and at your own sole risk.
                    </li>
                    <li>
                        <strong>No Liability:</strong> To the maximum extent permitted by applicable law, Sparkonomy and its affiliates will have no liability whatsoever for any direct, indirect, special, incidental, or consequential damages arising out of or in connection with your use of, or inability to use, any Beta Services, under any theory of liability.
                    </li>
                    <li>
                        <strong>Your Feedback:</strong> As part of the beta process, you may be asked to provide feedback. You agree that Sparkonomy has the unrestricted right to use any feedback you provide for any purpose, without any obligation or compensation to you.
                    </li>
                    <li>
                        <strong>Discontinuation:</strong> We reserve the right to modify or discontinue any Beta Service at any time, in our sole discretion, without liability to you. In the event we decide to discontinue a Beta Service, we will provide at least fourteen (14) days&apos; notice for you to export any of your data associated with that service. There is no guarantee that any Beta Service will ever be made generally available.
                    </li>
                </ul>

                <h2 className="text-xl font-semibold mt-8 mb-4">
                    3. Your Sparkonomy Account
                </h2>
                <ul className="list-disc list-inside space-y-2 mb-6">
                    <li>
                        <strong>Eligibility:</strong> You must be at least 18 years old and
                        have the legal capacity to enter into a binding contract to use our
                        Services.
                    </li>
                    <li>
                        <strong>Be Yourself:</strong> You agree to provide information that
                        is authentic and accurate. You may not impersonate another person or
                        entity.
                    </li>
                    <li>
                        <strong>Account Security:</strong> You are responsible for all
                        activity that happens on your account. Keep your password safe and
                        let us know immediately if you suspect any unauthorized use.
                    </li>
                </ul>

                <h2 className="text-xl font-semibold mt-8 mb-4">4. User Conduct</h2>
                <p className={"mb-2"}>You agree that you will not:</p>
                <ul className="list-disc list-inside space-y-2 mb-6">
                    <li>Use the Services for any illegal or unauthorized purpose.</li>
                    <li>
                        Post or transmit any content that is abusive, harassing, defamatory,
                        obscene, fraudulent, or that infringes on any third party’s
                        intellectual property rights.
                    </li>
                    <li>
                        Attempt to disrupt or interfere with the Services, our servers, or
                        networks.
                    </li>
                    <li>
                        Use any automated system, such as a &quot;bot&quot; or &quot;scraper,&quot; to access
                        the Services for any purpose without our express written permission.
                    </li>
                </ul>

                <h2 className="text-xl font-semibold mt-8 mb-4">
                    5. Terms for Partnerships
                </h2>
                <p className="mb-4">
                    Sparkonomy is a platform to facilitate connections. When a Creator and
                    a Brand/Agency (each a &#34;User&#34;) agree to a partnership, they enter into
                    a direct contract with each other. Sparkonomy is not a party to that
                    contract.
                </p>
                <ul className="list-disc list-inside space-y-2 mb-6">
                    <li>
                        <strong>User Responsibility:</strong> You are solely responsible for
                        the partnerships you make. We do not vet, endorse, or guarantee any
                        User, and we are not responsible for the quality of their work or
                        their conduct.
                    </li>
                    <li>
                        <strong>Disputes:</strong> Any disputes arising from a partnership
                        are between the Users involved. Sparkonomy has no obligation to
                        mediate or resolve such disputes, but we reserve the right to do so
                        at our sole discretion.
                    </li>
                </ul>

                <h2 className="text-xl font-semibold mt-8 mb-4">
                    6. Subscriptions, Fees, and Payments
                </h2>
                <ul className="list-disc list-inside space-y-2 mb-6">
                    <li>
                        <strong>Freemium Model:</strong> Some of our Services are free,
                        while others require a paid subscription (&#34;Subscription&#34;). We may
                        offer a free tier that has usage or feature limitations.
                    </li>
                    <li>
                        <strong>Automatic Renewal:</strong> To ensure uninterrupted service,
                        your Subscription will automatically renew for the same subscription
                        period. You may cancel your Subscription at any time, but you must
                        do so before the renewal date to avoid being charged for the next
                        period.
                    </li>
                    <li>
                        <strong>Fees & No-Refund Policy:</strong> You agree to pay all fees
                        for Subscriptions you purchase. All fees are non-refundable, except
                        where explicitly stated or required by applicable law.
                    </li>
                    <li>
                        <strong>Taxes:</strong> All fees are exclusive of applicable taxes.
                        You are responsible for paying any taxes associated with your
                        purchases.
                    </li>
                    <li>
                        <strong>Third-Party Payment Processing:</strong> We use trusted
                        third-party payment providers to process payments and hold funds. By
                        making or receiving payments on Sparkonomy, you agree to be bound by
                        our payment provider&#39;s terms. Sparkonomy is not liable for any
                        payment disputes, transaction failures, or issues arising from the
                        services of these third-party providers.
                    </li>
                    <li>
                        <strong>Referral Program:</strong> From time to time, we may offer a
                        Referral Program. By participating, you agree to these simple rules:
                        <ul className="list-disc list-inside ml-6 mt-2 space-y-1">
                            <li>We will provide you with a unique referral link to share.</li>
                            <li>
                                When a new user signs up and meets the criteria of the program
                                through your link, you may earn a reward.
                            </li>
                            <li>
                                Rewards are given at our discretion and may include prizes,
                                financial incentives, or unlocking access to premium Sparkonomy
                                services.
                            </li>
                            <li>
                                You agree to share your link honestly and not engage in spam or
                                misleading behavior. We reserve the right to suspend or
                                terminate the program or your participation at any time.
                            </li>
                        </ul>
                    </li>
                </ul>

                <h2 className="text-xl font-semibold mt-8 mb-4">
                    7. Your Content & Our Intellectual Property
                </h2>
                <ul className="list-disc list-inside space-y-2 mb-6">
                    <li>
                        <strong>You Own Your Content:</strong> You own all the text, photos,
                        videos, data, and other materials you upload or create on Sparkonomy
                        (&#34;Your Content&#34;).
                    </li>
                    <li>
                        <strong>The License You Grant Us:</strong> To operate our platform,
                        you grant us a worldwide, non-exclusive, royalty-free license to
                        use, copy, display, and distribute Your Content for the limited
                        purpose of operating, improving, and protecting our Services. This
                        license ends when you delete your content or account.
                    </li>
                    <li>
                        <strong>How We Use Data for AI:</strong> We are committed to
                        protecting your work. To improve our services, our AI models learn
                        from public data and anonymized user data. We will not use your
                        private, identifiable content to train our general AI models without
                        your explicit consent.
                    </li>
                    <li>
                        <strong>Sparkonomy&#39;s Intellectual Property:</strong> We retain all
                        rights to our Services, including our software, AI models, logos,
                        and brand name (&#34;Our IP&#34;). You may not use Our IP without our prior
                        written permission.
                    </li>
                </ul>

                <h2 className="text-xl font-semibold mt-8 mb-4">
                    8. Copyright Infringement Policy (DMCA)
                </h2>
                <p className="mb-6">
                    We respect the intellectual property of others and expect our users to
                    do the same. We will respond to notices of alleged copyright
                    infringement that comply with the Digital Millennium Copyright Act
                    (&#34;DMCA&#34;). If you believe your copyrighted work has been infringed
                    upon, please send a compliant notice to{" "}
                    <a
                        href="mailto:legal@sparkonomy.com"
                        className={"text-primary font-bold hover:underline"}
                    >
                        legal@sparkonomy.com
                    </a>
                    .
                </p>

                <h2 className="text-xl font-semibold mt-8 mb-4">
                    9. Disclaimers and Limitation of Liability
                </h2>
                <ul className="list-disc list-inside space-y-2 mb-6">
                    <li>
                        <strong>Services Provided &#34;As-Is&#34;:</strong> The Services are
                        provided on an &#34;as-is&#34; and &#34;as-available&#34; basis, without any
                        warranties.
                    </li>
                    <li>
                        <strong>Disclaimer for Business Tools:</strong> Our legal and
                        tax-related tools are for informational purposes only. Sparkonomy is
                        not a law firm or an accounting firm and does not provide legal or
                        tax advice. You use them at your own sole risk and should consult a
                        qualified professional.
                    </li>
                    <li>
                        <strong>Liability Cap:</strong> To the fullest extent permitted by
                        law, the total liability of Sparkonomy for any claims under these
                        terms will be no more than the greater of (a) the amount of fees you
                        paid us in the 12 months before the claim, or (b) SGD $100.
                    </li>
                </ul>

                <h2 className="text-xl font-semibold mt-8 mb-4">
                    10. Account Termination
                </h2>
                <p className="mb-2">
                    You are free to stop using our Services at any time by deleting your
                    account.
                </p>
                <p className="mb-4">
                    We believe in partnership. Before we suspend or terminate your
                    account, we will provide you with advance notice when reasonably
                    possible, state the reason, and provide an opportunity to address the
                    issue. However, we may suspend or terminate your account and access to
                    the Services immediately and without prior notice if we reasonably
                    believe you have violated these Terms, engaged in fraud or illegal
                    activity, or created risk or harm to Sparkonomy or others. Upon
                    termination, your right to use the Services will end immediately, but
                    any obligations owed (e.g., outstanding payments) will survive.
                </p>

                <h2 className="text-xl font-semibold mt-8 mb-4">11. Indemnification</h2>
                <p className="mb-2">
                    You agree to indemnify and hold harmless Sparkonomy and its employees
                    from any claims, damages, or expenses (including attorneys&#39; fees)
                    arising from your use of the Services, your violation of these Terms,
                    or your infringement of any third party&#39;s rights.
                </p>
                <ul className="list-disc list-inside space-y-2 mb-6">
                    <li>
                        <strong>Indemnification (For Brand & Agency Users):</strong> If you
                        are using our Services on behalf of a business, that business agrees
                        to indemnify Sparkonomy from any claims or costs arising from your
                        use of the Services in violation of these terms.
                    </li>
                </ul>

                <h2 className="text-xl font-semibold mt-8 mb-4">
                    12. Dispute Resolution
                </h2>
                <p className="mb-4">
                    These Terms are governed by the laws of the Republic of Singapore.
                </p>
                <ul className="list-disc list-inside space-y-2 mb-6">
                    <li>
                        <strong>Informal Resolution:</strong> Before filing a formal claim,
                        you agree to first contact us at{" "}
                        <a
                            href="mailto:hello@sparkonomy.com"
                            className={"text-primary font-bold hover:underline"}
                        >
                            hello@sparkonomy.com
                        </a>{" "}
                        and attempt to resolve the dispute informally. We will do the same.
                    </li>
                    <li>
                        <strong>Mandatory Arbitration:</strong> If we cannot resolve the
                        dispute within 30 days, we both agree to resolve any claim through{" "}
                        <strong>mandatory binding arbitration</strong> in Singapore, not in
                        a court of law. You also{" "}
                        <strong>
                            waive your right to participate in any class action lawsuit
                        </strong>{" "}
                        against Sparkonomy.
                    </li>
                </ul>

                <h2 className="text-xl font-semibold mt-8 mb-4">
                    13. General Provisions
                </h2>
                <ul className="list-disc list-inside space-y-2 mb-6">
                    <li>
                        <strong>Policy Changes:</strong> We may update these Terms from time
                        to time. If we make a material change, we will provide at least 14
                        days&#39; notice before the changes take effect.
                    </li>
                    <li>
                        <strong>Severability:</strong> If any part of these Terms is found
                        to be unenforceable, the remaining parts will continue to be in full
                        force and effect.
                    </li>
                    <li>
                        <strong>Entire Agreement:</strong> These Terms and our Privacy
                        Policy constitute the entire agreement between you and Sparkonomy.
                    </li>
                    <li>
                        <strong>Contact:</strong> If you have any questions, please contact
                        us at{" "}
                        <a
                            href="mailto:hello@sparkonomy.com"
                            className={"text-primary font-bold hover:underline"}
                        >
                            hello@sparkonomy.com
                        </a>{" "}
                        for questions.
                    </li>
                </ul>

                <LegalFooter />
            </div>
        </>
    );
}
