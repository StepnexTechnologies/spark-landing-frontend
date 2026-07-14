import LegalFooter from "@/components/LegalFooter";
import LegalHeader from "@/components/LegalHeader";
import type { Metadata } from "next";
import Link from "next/link";

// Exhibit A to the Trusted Partner Program T&C. Deliberately kept out of search
// engines, AI answer engines, the sitemap and llms.txt — it is shared directly
// with invited partners, not discovered. See next.config.ts for the matching
// X-Robots-Tag / Content-Signal headers and robots.ts for the crawler rules.
export const metadata: Metadata = {
    title: "Sparkonomy Trusted Partner Program — Program Guide",
    description:
        "Program Guide for Sparkonomy Trusted Partners. Shared privately with invited partners.",
    robots: {
        index: false,
        follow: false,
        nocache: true,
        googleBot: {
            index: false,
            follow: false,
            noimageindex: true,
            "max-snippet": 0,
        },
    },
    other: {
        // Honoured by a growing set of AI crawlers/answer engines that ignore
        // the robots meta tag but read these.
        robots: "noai, noimageai",
    },
};

type EarningsRow = {
    creators: string;
    l1: string;
    network: string;
    total: string;
};

const NETWORK_EARNINGS: EarningsRow[] = [
    { creators: "3", l1: "1,890", network: "691 – 2,700", total: "2,581 – 4,590" },
    { creators: "5", l1: "3,300", network: "1,152 – 4,500", total: "4,452 – 7,800" },
    { creators: "8", l1: "5,520", network: "1,843 – 7,200", total: "7,363 – 12,720" },
    { creators: "12", l1: "8,640", network: "2,765 – 10,800", total: "11,405 – 19,440" },
    { creators: "20", l1: "15,000", network: "4,608 – 18,000", total: "19,608 – 33,000" },
    { creators: "45", l1: "36,450", network: "10,368 – 40,500", total: "46,818 – 76,950" },
    { creators: "70", l1: "58,800", network: "16,128 – 63,000", total: "74,928 – 121,800" },
    { creators: "100", l1: "90,000", network: "23,040 – 90,000", total: "113,040 – 180,000" },
];

const MILESTONE_BONUSES: { creators: string; bonus: string }[] = [
    { creators: "3", bonus: "+5%" },
    { creators: "5", bonus: "+10%" },
    { creators: "8", bonus: "+15%" },
    { creators: "12", bonus: "+20%" },
    { creators: "20", bonus: "+25%" },
    { creators: "30", bonus: "+30%" },
    { creators: "45", bonus: "+35%" },
    { creators: "70", bonus: "+40%" },
    { creators: "100", bonus: "+50%" },
];

const DIRECT_EARNINGS: { creators: string; base: string; bonus: string; total: string }[] = [
    { creators: "3", base: "1,800", bonus: "90", total: "1,890" },
    { creators: "5", base: "3,000", bonus: "300", total: "3,300" },
    { creators: "8", base: "4,800", bonus: "720", total: "5,520" },
    { creators: "12", base: "7,200", bonus: "1,440", total: "8,640" },
    { creators: "20", base: "12,000", bonus: "3,000", total: "15,000" },
    { creators: "45", base: "27,000", bonus: "9,450", total: "36,450" },
    { creators: "70", base: "42,000", bonus: "16,800", total: "58,800" },
    { creators: "100", base: "60,000", bonus: "30,000", total: "90,000" },
];

const CHAT_LINES: { worried: string; reply: string }[] = [
    { worried: "😰 “Bhai invoice bhej de jaldi...”", reply: "😅 “Haan haan... template dhundh raha hoon yaar”" },
    { worried: "😤 “TDS kitna katega??”", reply: "😶 “Pata nahi... CA ko call kar lo?”" },
    { worried: "💸 “Payment aaya kya?”", reply: "😑 “Bhai teen baar ping kar chuka hoon...”" },
];

const th = "border border-[#E3E3E3] px-3 py-2 text-left font-semibold align-bottom";
const td = "border border-[#E3E3E3] px-3 py-2 align-top";

export default function TrustedPartnerProgramGuidePage() {
    return (
        <div className="max-w-4xl mx-auto px-4 py-10 text-gray-800">
            <LegalHeader
                title="Sparkonomy Trusted Partner Program — Program Guide for Creators"
                effectiveDate="July 14, 2026"
                lastUpdated="July 14, 2026"
                homeHref="/"
                homeClassName="mr-4 mt-1"
                dateClassName="mb-4"
            />

            <p className="text-sm text-gray-500 mb-8">
                This Program Guide is Exhibit A to the{" "}
                <Link
                    href="/legal/trusted-partner-terms"
                    className="text-primary font-bold hover:underline"
                >
                    Trusted Partner Program Terms &amp; Conditions
                </Link>
                . If a number here is ever different from the Terms, the Terms win.
            </p>

            <div className="rounded-lg border border-[#E3E3E3] bg-white/60 p-4 mb-4 space-y-2">
                {CHAT_LINES.map((line) => (
                    <p key={line.worried} className="text-sm md:text-base">
                        <span className="block">{line.worried}</span>
                        <span className="block text-gray-600">{line.reply}</span>
                    </p>
                ))}
            </div>
            <p className="mb-4">Yeh sab bahut familiar lagta hai na? 😂</p>
            <p className="mb-6">
                Hum jaante hain. Yeh har Creator ke saath hota hai. Har. Single. Day.
            </p>

            <h2 className="text-xl font-semibold mt-8 mb-4">
                We See You. And We Built This For You.
            </h2>
            <p className="mb-4">
                Making content is real work. But no one made the right tools for Creators.
            </p>
            <p className="mb-4">
                Creators use billing apps made for shops. They use tax tools made for companies. They use invoice
                formats made for IT professionals. Nothing was made for them.
            </p>
            <p className="mb-4">
                Sparkonomy is different. We built our technology 100% for Creators. Not for shops. Not for companies.
                Not for CAs. Only for Creators — people like you.
            </p>
            <p className="mb-4">
                Our team has spent 20+ years working inside YouTube, Meta, and Google. We are part of Google for
                Startups. We use Google Gemini&apos;s latest AI. We have official technology access from YouTube and
                Meta.
            </p>
            <p className="mb-4">
                We built Sparkonomy because we believe Creators deserve tools that were made just for them — tools
                that speak their language, understand how they work, and make their life easier.
            </p>
            <p className="mb-4">
                And we mean that literally. Sparkonomy launched in Hinglish. Not in English. Not in Hindi script. In
                the language Creators actually use every day — on WhatsApp, in DMs, in voice notes, in real life. Most
                tools make you adjust to them. Sparkonomy adjusted to you.
            </p>
            <p className="mb-6">
                <strong>Our mission:</strong> help every Creator in India run their work like a real business — get
                paid on time, look professional, and spend more time doing what they do best: creating 💫
            </p>

            <h2 className="text-xl font-semibold mt-8 mb-4">
                What Is the Spark Partner Program?
            </h2>
            <p className="mb-4">
                <strong>Quick version:</strong> When someone in your community buys Sparkonomy, you earn money. And
                Sparkonomy costs them as little as ₹100 per month — so it is an easy yes for them. 💰
            </p>
            <p className="mb-4">This is our affiliate program. Here is how it works in simple words:</p>
            <p className="mb-4">
                You use Sparkonomy. You love it. You share it with your community. When your community buys — you earn
                money. That is it.
            </p>
            <p className="mb-4">But there is something more important here.</p>
            <p className="mb-4">
                When you share Sparkonomy with your followers, you are not sharing just another app. You are sharing
                something that was built 100% for Creators — by people who understand Creators. Your community will
                respect you for that. They will thank you for finding a tool that is finally built for them — not a
                tool they have to struggle to fit into their life.
            </p>
            <p className="mb-4">
                And here is something to think about: if you show your community a real moment — how you made an
                invoice in under 5 minutes, or how a payment reminder went out automatically, or how TDS got
                calculated without you doing anything — they will see it themselves. You will not need to convince
                them. Every Creator watching you has the same problem. When they see a solution that actually works for
                them, they will want it. And they will remember that you were the one who showed them. 🙏
            </p>
            <p className="mb-6">
                That is what makes you a Sparkonomy Trusted Partner (Spark Partner) — not just someone sharing a link,
                but someone who cares about making the Creator community stronger.
            </p>

            <h2 className="text-xl font-semibold mt-8 mb-4">What We Ask From You</h2>
            <p className="mb-4">Three simple things:</p>
            <ol className="list-decimal list-inside space-y-3 mb-4">
                <li>
                    <strong>Use the product first.</strong> Try it yourself before you talk about it. Make a real
                    invoice. See how fast it works. When you share your own real experience, your community will trust
                    it. ✅ Reach out if you need any help.
                </li>
                <li>
                    <strong>Share it your way.</strong> Tell your community about it — in your own words, your own
                    style. A reel, a YouTube video, a weekly episode, a story or WhatsApp message — whatever feels most
                    natural to you. 🎥
                </li>
                <li>
                    <strong>Invite other Creators to join the program too.</strong> When you invite another Creator
                    through your special referral link to also become a Spark Partner, you also earn from the sales
                    they bring in. And from the sales their friends bring in. We explain this below. 👇
                </li>
            </ol>
            <p className="mb-2">We will give you:</p>
            <ul className="list-disc list-inside space-y-2 mb-4">
                <li>Sparkonomy logos and product screenshots 📸</li>
                <li>Short product videos and clips 🎬</li>
                <li>Sample scripts and ideas 📝</li>
            </ul>
            <p className="mb-6">
                But how you share it is totally up to you. You know your community best. Your real story will always
                work better than any brand script.
            </p>

            <h2 className="text-xl font-semibold mt-8 mb-4">How Does the Commission Work?</h2>
            <p className="mb-4">You earn in three ways.</p>
            <ul className="list-disc list-inside space-y-2 mb-4">
                <li>
                    <strong>Your own sales — Level 1.</strong> When someone buys a Sparkonomy paid plan using your link
                    → you earn 50% of the sale. 💰
                </li>
                <li>
                    <strong>Your partner friends&apos; sales — Level 2.</strong> When a Creator you invited to this
                    program brings in a sale → you also earn 10% of that sale. 💰
                </li>
                <li>
                    <strong>Their friends&apos; sales — Level 3.</strong> When the Creator your friend invited brings in
                    a sale → you earn 5% of that sale too. 💰
                </li>
            </ul>

            <div className="overflow-x-auto mb-4">
                <table className="w-full text-sm border-collapse">
                    <thead className="bg-black/5">
                        <tr>
                            <th className={th}>Level</th>
                            <th className={th}>Who</th>
                            <th className={th}>Your earning</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td className={td}>Level 1</td>
                            <td className={td}>Creators you invite</td>
                            <td className={td}>50%</td>
                        </tr>
                        <tr>
                            <td className={td}>Level 2</td>
                            <td className={td}>Their friends who sign up</td>
                            <td className={td}>10%</td>
                        </tr>
                        <tr>
                            <td className={td}>Level 3</td>
                            <td className={td}>Their friends&apos; friends</td>
                            <td className={td}>5%</td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <p className="mb-6">
                You earn once per sale — at the time of purchase. So the more your network grows, the more you earn —
                even while you sleep. 😴
            </p>

            <h2 className="text-xl font-semibold mt-8 mb-4">See How Much You Could Earn</h2>
            <p className="mb-4 text-sm text-gray-600">
                (Assumes all purchases are annual subscriptions worth ₹1,200.)
            </p>
            <div className="overflow-x-auto mb-4">
                <table className="w-full text-sm border-collapse">
                    <thead className="bg-black/5">
                        <tr>
                            <th className={th}>Paying Creators you bring (#)</th>
                            <th className={th}>Your direct L1 earnings (₹)</th>
                            <th className={th}>Your L2 + L3 network earnings (₹)</th>
                            <th className={th}>Your total L1 + L2 + L3 earnings (₹)</th>
                        </tr>
                    </thead>
                    <tbody>
                        {NETWORK_EARNINGS.map((row) => (
                            <tr key={row.creators}>
                                <td className={td}>{row.creators}</td>
                                <td className={td}>{row.l1}</td>
                                <td className={td}>{row.network}</td>
                                <td className={td}>{row.total}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <p className="mb-6 text-sm text-gray-600">
                Numbers are examples only. Your actual earnings will depend on your network and the plans they choose.
            </p>

            <h2 className="text-xl font-semibold mt-8 mb-4">
                Your Special Link Gives Your Community the Lowest Price
            </h2>
            <p className="mb-4">
                When someone signs up using your special link, they get a huge discount — they pay just ₹1,200/year
                instead of ₹3,600/year. That is just ₹100 per month for a full Pro plan.
            </p>
            <p className="mb-6">
                This is the lowest price anyone can get for Sparkonomy Pro. Your link adds real value for your
                community — not just a promotion. 🎁
            </p>

            <h2 className="text-xl font-semibold mt-8 mb-4">You Earn More as Your Network Grows</h2>
            <p className="mb-4">
                On top of your commissions, you unlock extra bonuses when you hit milestones. These bonuses add 5% to
                50% more to your earnings.
            </p>
            <p className="mb-4">
                The milestones are designed to be easy to reach. You do not need a huge audience — you need a community
                that trusts you.
            </p>
            <div className="overflow-x-auto mb-6">
                <table className="w-full text-sm border-collapse">
                    <thead className="bg-black/5">
                        <tr>
                            <th className={th}>Paying Creators you bring</th>
                            <th className={th}>Bonus you unlock on top</th>
                        </tr>
                    </thead>
                    <tbody>
                        {MILESTONE_BONUSES.map((row) => (
                            <tr key={row.creators}>
                                <td className={td}>{row.creators}</td>
                                <td className={td}>{row.bonus}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <h2 className="text-xl font-semibold mt-8 mb-4">How Much Can You Earn?</h2>
            <p className="mb-4">
                Here is an example of what you can earn from your own effort plus your milestone bonus — even without
                any network earnings.
            </p>
            <p className="mb-4 text-sm text-gray-600">
                (Assumes all purchases are annual subscriptions worth ₹1,200.)
            </p>
            <div className="overflow-x-auto mb-4">
                <table className="w-full text-sm border-collapse">
                    <thead className="bg-black/5">
                        <tr>
                            <th className={th}>Paying Creators you bring (#)</th>
                            <th className={th}>Your direct L1 earnings (₹)</th>
                            <th className={th}>Your L1 milestone bonus (₹)</th>
                            <th className={th}>Your total direct L1 earnings (₹)</th>
                        </tr>
                    </thead>
                    <tbody>
                        {DIRECT_EARNINGS.map((row) => (
                            <tr key={row.creators}>
                                <td className={td}>{row.creators}</td>
                                <td className={td}>{row.base}</td>
                                <td className={td}>{row.bonus}</td>
                                <td className={td}>{row.total}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <p className="mb-6 text-sm text-gray-600">
                Numbers are examples only. Your actual earnings will depend on the plans chosen by your referees.
            </p>

            <h2 className="text-xl font-semibold mt-8 mb-4">
                Two Things We Promise — That Most Programs Do Not
            </h2>
            <p className="mb-4">
                <strong>Promise 1 — You earn even if they take 1 year to buy.</strong> Most programs only pay you if
                someone buys immediately. We think that is not fair. If a Creator signs up for free and takes a few
                months before buying — that is okay. As long as they buy within 1 full year, you still get your full
                commission. 🙌 We give credit for the relationships you build — not just quick clicks.
            </p>
            <p className="mb-6">
                <strong>Promise 2 — Your earnings do not break even if someone leaves.</strong> Let us say you invited
                Creator A. Creator A invited Creator B. But Creator A stopped being a partner. You still earn from
                Creator B&apos;s sales. ✅ Your earnings will not stop because of someone else&apos;s choice. What you
                built is yours.
            </p>

            <h2 className="text-xl font-semibold mt-8 mb-4">How and When Do You Get Paid?</h2>
            <ul className="list-disc list-inside space-y-2 mb-6">
                <li>We count all your commissions at the end of every month 📅</li>
                <li>
                    Money goes directly to your bank account in the first 10 working days of the next month 🏦
                </li>
                <li>A sale is confirmed after the Creator stays on a paid plan for 30 days</li>
                <li>No minimum balance — every confirmed commission gets paid to you</li>
            </ul>

            <h2 className="text-xl font-semibold mt-8 mb-4">How to Make Your Sparkonomy Content 🎬</h2>
            <p className="mb-4">
                The best content comes from your real story. Show your followers how Sparkonomy made your life easier.
                That is your superpower. No script needed.
            </p>
            <p className="mb-2">
                <strong>What to make.</strong>
            </p>
            <ul className="list-disc list-inside space-y-2 mb-4">
                <li>Make a video about Sparkonomy. You can make one video. Or a short series. You choose.</li>
                <li>
                    Post it where your biggest audience is — Instagram, Facebook, YouTube, or WhatsApp, or all of them.
                </li>
                <li>
                    Keep your video up always. ♾️ Do not delete it. Do not hide it. Your link needs to stay live to
                    earn.
                </li>
            </ul>

            <h3 className="text-lg font-semibold mt-6 mb-3">Your Content Cheat Sheet</h3>

            <h4 className="font-semibold mt-4 mb-2">What to show 📱</h4>
            <ul className="list-disc list-inside space-y-2 mb-4">
                <li>✅ Record your real phone screen inside the Sparkonomy app.</li>
                <li>✅ Use photos and videos from your Spark Pack.</li>
                <li>✅ Show a real invoice you made in under 5 minutes.</li>
                <li>✅ Show how automatic reminders and TDS work.</li>
                <li>✅ Be natural. Be real. Your honest reaction is enough.</li>
                <li>❌ Do not design or draw a fake version of the app.</li>
                <li>❌ Do not show features that do not exist yet.</li>
                <li>❌ Do not use old screenshots. Use the latest version of the app.</li>
            </ul>

            <h4 className="font-semibold mt-4 mb-2">What to say 🗣️</h4>
            <ul className="list-disc list-inside space-y-2 mb-4">
                <li>✅ Share your own story. How you used it. How it helped you.</li>
                <li>✅ Tell them it costs just ₹100 per month with your link — a 50% discount.</li>
                <li>✅ Tell them it is built just for Creators — in Hinglish.</li>
                <li>✅ Show the problem (the invoicing headache). Then show the solution.</li>
                <li>❌ Do not say things about Sparkonomy that are not true.</li>
                <li>❌ Do not name other apps and say bad things about them.</li>
                <li>❌ Do not say mean or negative things about other creators.</li>
            </ul>

            <h4 className="font-semibold mt-4 mb-2">What music to use 🎵</h4>
            <ul className="list-disc list-inside space-y-2 mb-4">
                <li>
                    ✅ Use sounds from your platform&apos;s free music library (marked as safe for business).
                </li>
                <li>✅ Use royalty-free background music.</li>
                <li>✅ Just your voice works great too — no music needed!</li>
                <li>❌ Do not use popular songs or film music.</li>
                <li>❌ Do not use music that says &quot;personal use only.&quot;</li>
                <li>❌ Do not use music from another brand&apos;s paid library.</li>
            </ul>
            <p className="mb-4">
                ⚠️ This is important: if a music company sends a fine because of a song you used, you will need to fix
                it. We do not want that for you. Free music keeps you safe.
            </p>

            <h4 className="font-semibold mt-4 mb-2">What to write in your caption ✍️</h4>
            <ul className="list-disc list-inside space-y-2 mb-4">
                <li>
                    ✅ Put <strong>#Ad</strong> or <strong>#PaidPartnership</strong> at the very top of your caption —
                    before &quot;See More.&quot;
                </li>
                <li>
                    ✅ If your video is in Hindi — you can also add <strong>#विज्ञापन</strong>.
                </li>
                <li>
                    ✅ Turn on the &quot;Paid Partnership&quot; or &quot;Includes paid promotion&quot; label inside the
                    app too.
                </li>
                <li>✅ Put your special Sparkonomy link in the caption or your bio.</li>
                <li>❌ Do not use #collab, #sp, #spon, or #thanks instead of #Ad.</li>
                <li>❌ Do not put the #Ad tag at the bottom. It must be at the very top.</li>
                <li>❌ Do not hide it in the comments.</li>
            </ul>

            <h4 className="font-semibold mt-4 mb-2">How long to show the #Ad text on screen ⏱️</h4>
            <ul className="list-disc list-inside space-y-2 mb-6">
                <li>Video under 15 seconds → show the #Ad text for at least 3 seconds.</li>
                <li>
                    Video longer than 15 seconds → show the #Ad text for the full section where you talk about
                    Sparkonomy.
                </li>
            </ul>

            <h2 className="text-xl font-semibold mt-8 mb-4">We Are Here to Help You 👋</h2>
            <p className="mb-4">
                If you are confused about anything, just reach out to us. If you need help making your content, we are
                here. If you want to check something before you post, just ask. Write to us at{" "}
                <a
                    href="mailto:hello@sparkonomy.com"
                    className="text-primary font-bold hover:underline"
                >
                    hello@sparkonomy.com
                </a>
                .
            </p>
            <p className="mb-6">
                We want you to make great content and do well as a Spark Partner. Your success is our success.
            </p>

            <p className="mb-6 text-sm text-gray-600">
                ⚡ Sparkonomy — Made for Creators. By people who get it. Singapore · India · sparkonomy.com
            </p>

            <LegalFooter />
        </div>
    );
}
