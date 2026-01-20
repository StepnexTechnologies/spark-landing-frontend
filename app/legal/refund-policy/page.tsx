import LegalFooter from "@/components/LegalFooter";
import Link from "next/link";
import {Home} from "lucide-react";

export default function RefundPolicyPage() {
    return (
        <>
            <div className="max-w-4xl mx-auto px-4 py-10 text-gray-800">
                <div className="flex justify-between items-start mb-2">
                    <h1 className="text-3xl font-bold text-primary">
                        <div>Sparkonomy Refund</div><div> & Cancellation Policy</div>
                    </h1>
                    <Link href="/" className="text-primary hover:text-primary/80 transition-colors mr-4 mt-1">
                        <Home className="w-6 h-6" />
                    </Link>
                </div>
                <p className="text-sm text-gray-500 mb-8">
                    Last Updated: November 10, 2025
                </p>

                <p className="mb-6">
                    At Sparkonomy, we strive to be your trusted thinking partner. We want your experience with our platform & Operating System to be seamless, including how we handle payments.
                </p>

                <h2 className="text-xl font-semibold mt-8 mb-4">
                    1. Subscription Cancellations
                </h2>
                <p className="mb-4">
                    You are in full control of your subscription. You may cancel your Sparkonomy subscription at any time directly from your account settings.
                </p>
                <ul className="list-disc list-inside space-y-2 mb-6">
                    <li>
                        <strong>Effect of Cancellation:</strong> If you cancel, your subscription will stop renewing automatically. You will retain access to paid features until the end of your current billing cycle.
                    </li>
                    <li>
                        <strong>Renewal Prevention:</strong> To avoid being charged for the next period, please ensure you cancel at least 24 hours before your renewal date.
                    </li>
                </ul>

                <h2 className="text-xl font-semibold mt-8 mb-4">
                    2. Refund Policy
                </h2>
                <p className="mb-4">
                    Sparkonomy operates on a digital subscription model. As such, <strong>all fees for Subscriptions are non-refundable</strong>, except where explicitly required by applicable law.
                </p>
                <ul className="list-disc list-inside space-y-2 mb-6">
                    <li>
                        <strong>Statutory Withdrawal Rights (EU/UK):</strong> If you are a consumer residing in a jurisdiction that provides a statutory right of withdrawal, you agree that by accessing and using the Service immediately upon purchase, you <strong>waive your right to a 14-day cooling-off period</strong> for that purchase, to the extent permitted by law.
                    </li>
                    <li>
                        <strong>Service Guarantee:</strong> A refund may be required if the Service is fundamentally unfit for purpose or fails to function as described in the agreement, and we are unable to remedy the failure within a reasonable timeframe.
                    </li>
                    <li>
                        <strong>No Partial Refunds:</strong> We do not offer pro-rated refunds for unused time if you cancel in the middle of a billing cycle. Your service will remain active until the end of your current paid term.
                    </li>
                </ul>

                <h2 className="text-xl font-semibold mt-8 mb-4">
                    3. Contact Us & Full Terms
                </h2>
                <p className="mb-4">
                    If you have any questions about your subscription or a specific charge, please reach out to us. We are here to help.
                </p>
                <ul className="list-disc list-inside space-y-2 mb-6">
                    <li>
                        <strong>Email:</strong>{" "}
                        <a
                            href="mailto:hello@sparkonomy.com"
                            className="text-primary font-bold hover:underline"
                        >
                            hello@sparkonomy.com
                        </a>
                    </li>
                    <li>
                        <strong>Full Agreement:</strong> This policy is part of our comprehensive{" "}
                        <Link
                            href="/legal/terms"
                            className="font-bold hover:underline text-primary"
                        >
                            Terms of Service
                        </Link>{" "}
                        and should be read in conjunction with our{" "}
                        <Link
                            href="/legal/privacy-policy"
                            className="font-bold hover:underline text-primary"
                        >
                            Privacy Policy
                        </Link>
                        .
                    </li>
                </ul>

                <LegalFooter />
            </div>
        </>
    );
}
