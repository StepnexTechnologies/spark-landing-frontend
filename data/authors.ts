// Types for comprehensive author data
export interface AuthorSocialLinks {
  twitter?: string;
  linkedin?: string;
  email?: string;
  instagram?: string;
  youtube?: string;
  facebook?: string;
  website?: string;
}

export interface PreviousCompany {
  name: string;
  logo?: string;
  logoHeight?: number; // custom height in pixels (default: 32)
  darkBg?: boolean; // icon has dark background — needs inverted greyscale
  darkFg?: boolean; // icon has very dark foreground — needs lighter greyscale
  noFilter?: boolean; // skip grayscale/opacity — show original logo
}

export interface TrustItem {
  icon: "experience" | "expertise" | "verified" | "awards" | "following" | "featured";
  label: string;
  value: string;
}

export interface MediaMention {
  publication: string;
  logo: string;
  title: string;
  author: string;
  date: string;
  url: string;
}

export interface FeaturedArticle {
  id: string;
  title: string;
  description: string;
  imageSrc: string;
  date: string;
  readingTime: string;
  href: string;
}

export interface RecentArticle {
  id: string;
  title: string;
  date: string;
  imageSrc: string;
  href: string;
}

export interface AuthorEntry {
  id: string;
  slug: string; // URL slug for our author page (e.g., "guneet-singh")

  // SEO metadata
  metaTitle?: string;
  metaDescription?: string;
  canonicalPath?: string;

  // WordPress matching - use ONE of these to match WordPress author to our data
  wordpressSlug?: string; // WordPress author slug (e.g., "dev-sparkonomy") - PREFERRED
  wordpressAuthorId?: number; // WordPress author ID (e.g., 1) - Alternative

  name: string;
  role: string;
  avatarUrl: string;
  shortBio: string; // Quote/tagline shown at top
  socialLinks: AuthorSocialLinks;
  previousCompanies: PreviousCompany[];
  previousCompaniesLabel?: string; // Label for previous companies section (e.g., "Previously scaling billion-dollar businesses at")

  // Story section
  storyTitle: string;
  storyContent: string[]; // Array of paragraphs
  highlightQuote: string;
  storyConclusion: string[];
  signatureImage?: string;

  // About section
  aboutTitle: string;
  aboutContent: string[]; // Array of paragraphs

  // Career highlights
  careerHighlights: string[];

  // Trust & Authority
  trustItems: TrustItem[];

  // Media mentions
  mediaMentions: MediaMention[];

  // Articles - fetched from WordPress automatically if wordpressSlug/wordpressAuthorId is set
  featuredArticles?: FeaturedArticle[]; // Optional hardcoded fallback
  recentArticles?: RecentArticle[]; // Optional hardcoded fallback

  // Expertise tags
  areasOfExpertise: string[];

  // Contact section
  contactEmail: string;
  mediaEmail?: string;
  speakingEmail?: string;
  responseTime?: string;
  linkedinSubscribe?: string;

  // Footer info
  lastUpdated: string;
  profileId: string;
}

// Centralized authors data
export const authors: AuthorEntry[] = [
  {
    id: "guneet_singh",
    slug: "guneet-singh",

    // SEO metadata
    metaTitle: "Guneet Singh: Product, Tech Leader and Mentor at Sparkonomy",
    metaDescription: "Guneet Singh worked at Google and Microsoft. Now, he helps creators use technology to build real businesses. Read his guides on growth and AI.",
    canonicalPath: "/authors/guneet-singh",

    // WordPress matching
    wordpressSlug: "cap-guneet",
    wordpressAuthorId: 5,

    name: "Guneet Singh",
    role: "Igniting Sparkonomy | Global Tech Leader | Startup Mentor & Venture Builder",
    avatarUrl: "https://www.sparkonomy.com/authors/ProfilePicture_gunnet.png",
    shortBio: "I am a tech leader and strategist based in Singapore. After 20 years working across Google, Microsoft, Samsung, and ABN AMRO, I now build and mentor at the edge of technology and new work. At Sparkonomy, I write about how smart systems and AI can complement creators by handling the friction so you can spend more time creating and still build a sustainable career.",

    socialLinks: {
      twitter: "https://twitter.com/guneetsingh",
      linkedin: "https://www.linkedin.com/in/guneets",
      email: "guneets@sparkonomy.com",
    },

    previousCompanies: [
      { name: "Google", logo: "/authors/Logos/Google.png" },
      { name: "Microsoft", logo: "/authors/Logos/Microsoft.png" },
      { name: "Samsung", logo: "/authors/Logos/Samsung.png" },
    ],
    previousCompaniesLabel: "Previously scaling billion-dollar businesses at:",

    storyTitle: "From Big Tech to the Creator Economy",
    storyContent: [
      "I spent the last two decades in corporate corridors, but the most exciting shift I ever witnessed didn't happen in a meeting—it happened on a screen.",
      "Over 15 years ago, working with YouTube, I had a front-row seat to a quiet revolution. I saw the platform open doors for people the traditional economy had overlooked. I watched housewives, farmers, truck drivers, and people in low-development geographies pick up a camera and build businesses from nothing. They weren't just making videos; they were democratizing entrepreneurship. Conventional literacy didn't matter—human connection did.",
    ],
    highlightQuote: "I realized the future of work isn't just in corporate contracts, but in human expression.",
    storyConclusion: [
      "Today, we are at another turning point. As AI begins to automate conventional white-collar jobs, human authenticity is becoming the most valuable asset in the world. The \"Creator\" isn't just a hobbyist anymore; they are the future workforce.",
      "But there is a problem. While we cheer for their entrepreneurship, the industry is saddled with exploitation. Creators are building empires on shaky foundations, often without the tools or protections traditional businesses take for granted.",
      "That is why I am building Sparkonomy.",
      "I wanted to tilt my knowledge of the platform ecosystems and the \"big business\" playbook to help the little guy. We are using AI not to replace the creator, but to handle the friction—the contracts, the payments, the operations—so this profession can thrive without the burnout.",
    ],
    signatureImage: "/authors/Gunnet_singh_signature.png",

    aboutTitle: "About Guneet",
    aboutContent: [
      "Sparkonomy is building the \"AI infrastructure\" (the roads and bridges) for the creator economy, and Guneet is helping design the map.",
      "A global tech leader and venture builder based in Singapore, he founded Sparkonomy to help the fastest growing GenZ profession - independent creators, build sustainable careers in the AI-era. He wants to help independent creators become resilient \"Creator Founders.\"",
      "Today, his standout achievement is leveraging his deep insider knowledge of how major platforms operate to connect the dots between complex, tedious business operations and exciting creative freedom. By utilizing AI as a thinking partner, he ensures creators are protected from opaque pricing and delayed payments while scaling their influence.",
      "Before Sparkonomy, Guneet's journey began in the corporate corridors of Google, Microsoft, and Samsung, where he led billion-dollar portfolios. In 2011, he had a front-row seat to the first wave of creators while driving YouTube's growth across APAC.",
      "He famously launched YouTube Live in India by fusing early creator content with the country's cricket obsession through the #IPLHangover campaign. He also founded Google's Ignition Labs, where his team used multi-modal analysis to pioneer AI-driven creative solutions years before it became an industry buzzword.",
      "Now, he is taking that exact \"big business\" playbook and putting it directly into the hands of independent creators.",
      "Guneet believes technology should empower the many and simplify daily life. He approaches AI not as a replacement for human ingenuity, but as a supportive teammate. By bridging enterprise-grade rigor with creator-first empathy, he helps independent creators achieve sustainable growth and build calm, profitable businesses doing exactly what they love.",
    ],

    careerHighlights: [
      "Driven growth for Google products across a mobile-first market of 300+ million Indians, pushing Chrome to the #1 market share starting in 2011.",
      "Served as Global Head of Marketing & Creative Solutions at Google, and held leadership roles at Microsoft and Samsung.",
      "Serves as a Startup Mentor & Venture Architect for Singapore NGRIP program, actively working to commercialize deep tech.",
      "Pioneered the intersection of creative strategy and computer-vision driven intelligent workflows before multi-modal AI, by founding Google's Ignition Labs.",
      "Co-founded and scaled the social e-commerce startup DealsAndYou, growing the team from 0 to 40 employees in just 5 months.",
      "Recognized with 30+ international awards, including Cannes and Spikes, and named APAC Digital Marketer of the Year.",
    ],

    trustItems: [
      { icon: "experience", label: "Experience", value: "20+ Years" },
      { icon: "expertise", label: "Expertise", value: "Tech Platform" },
      { icon: "awards", label: "Awards", value: "Hall of Fame" },
      { icon: "verified", label: "Verified", value: "Sparkonomy" },
      { icon: "featured", label: "Focus", value: "Creator Systems" },
      { icon: "following", label: "Impact", value: "Work Smarter" },
    ],

    mediaMentions: [
      {
        publication: "AI Marketers Guild",
        logo: "/logos/aimg.svg",
        title: "AIMG APAC Webinar — Using Google's NotebookLM",
        author: "Guneet Singh",
        date: "October 2024",
        url: "https://www.youtube.com/watch?v=f0DgFjIp4rM",
      },
      {
        publication: "ACV Academy & Google",
        logo: "/logos/acv-academy.svg",
        title: "ACV Academy and Google launch new playbook on OKRs",
        author: "Guneet Singh",
        date: "2024",
        url: "https://acv.vc/insights/acv-portfolio-news/acv-academy-google-okrs/",
      },
      {
        publication: "HR Talk with Non HR Folk",
        logo: "/logos/hr-talk.svg",
        title: "HR Talk with Non HR Folk — Marketing & Creative Services at Google APAC",
        author: "Guneet Singh",
        date: "November 2021",
        url: "https://www.youtube.com/watch?v=U9v3VoDM2RI",
      },
      {
        publication: "India International Brand Summit",
        logo: "/logos/iibs.svg",
        title: "India International Brand Summit 2020 — Panel Speaker",
        author: "Guneet Singh",
        date: "2020",
        url: "https://brandequity.economictimes.indiatimes.com/news/industry/india-international-brand-summit-2020-confluence-of-the-best-marketing-minds-in-india/80247314",
      },
      {
        publication: "CIO Tech Outlook",
        logo: "/logos/cio-tech-outlook.svg",
        title: "3 Essentials of Digital Video",
        author: "Guneet Singh",
        date: "2019",
        url: "https://www.ciotechoutlook.com/cxoinsight/3-essentials-of-digital-video-or-the-long-short-and-silent-off-it-nid-1933-cid-78.html",
      },
      {
        publication: "Zee MELT",
        logo: "/logos/zee-melt.svg",
        title: "Zee MELT 2019 — India's Biggest Conference for Disruptive Marketing Practices",
        author: "Guneet Singh",
        date: "2019",
        url: "https://youtu.be/WVoNG7hX8lM?si=TCPXORtoRkVM1seW",
      },
      {
        publication: "Melt",
        logo: "/logos/melt.svg",
        title: "Do's and Don'ts of Digital Marketing",
        author: "Guneet Singh",
        date: "2018",
        url: "https://youtu.be/JyHRiMZ_LmA?si=MBAoWUZaIUqFmdvG",
      },
    ],

    // Articles fetched from WordPress - no hardcoded articles
    featuredArticles: [],
    recentArticles: [],

    areasOfExpertise: [
      "Creator Economy",
      "AI Productivity",
      "Future of Work",
      "Platform Ecosystems",
      "Business Growth",
      "Leadership",
      "Building Systems",
      "Brand Strategy",
      "Startup Mentoring",
      "Creator Operations",
    ],

    contactEmail: "guneets@sparkonomy.com",
    mediaEmail: "press@sparkonomy.com",
    speakingEmail: "events@sparkonomy.com",
    responseTime: "I typically respond within 24 hours",
    linkedinSubscribe: "https://www.linkedin.com/in/guneets",

    lastUpdated: "December 23, 2025",
    profileId: "authors/Guneet",
  },
  {
    id: "dev_sparkonomy",
    slug: "dev-sparkonomy", // Our URL: /blogs/author/dev-sparkonomy

    // WordPress matching - this matches the WordPress author's slug
    wordpressSlug: "devsparkonomy-com", // Must match WordPress author slug exactly
    wordpressAuthorId: 1, // WordPress author ID (backup matching)

    name: "Dev Sparkonomy",
    role: "Content Team, Sparkonomy",
    avatarUrl: "https://www.sparkonomy.com/authors/dev-sparkonomy.jpg",
    shortBio: "The Sparkonomy content team is dedicated to empowering creators with insights, guides, and resources to help them thrive in the creator economy. We cover everything from payment solutions to growth strategies.",

    socialLinks: {
      twitter: "https://twitter.com/sparkonomy",
      linkedin: "https://www.linkedin.com/company/sparkonomy",
      email: "content@sparkonomy.com",
    },

    previousCompanies: [],

    storyTitle: "Empowering the Creator Economy",
    storyContent: [
      "At Sparkonomy, we believe that creators are the future workforce. Our content team is dedicated to providing valuable insights, practical guides, and up-to-date resources to help creators navigate the evolving landscape of content monetization.",
      "From understanding payment terms to mastering brand collaborations, we cover the topics that matter most to creators at every stage of their journey.",
    ],
    highlightQuote: "Every creator deserves the tools and knowledge to turn their passion into a sustainable business.",
    storyConclusion: [
      "Our mission is to democratize access to information that was once reserved for traditional businesses. We want every creator—whether you have 100 followers or 1 million—to have the resources they need to succeed.",
      "Through our blog, we share insights from industry experts, practical tips from successful creators, and the latest trends shaping the creator economy.",
    ],

    aboutTitle: "About Sparkonomy Content",
    aboutContent: [
      "The Sparkonomy content team consists of writers, researchers, and creator economy enthusiasts who are passionate about helping creators succeed. We work closely with industry experts and successful creators to bring you the most relevant and actionable content.",
      "Our articles cover a wide range of topics including creator payments, tax guidance, brand partnerships, content strategy, and platform-specific tips for YouTube, Instagram, TikTok, and more.",
    ],

    careerHighlights: [
      "Published 100+ articles on creator economy topics",
      "Featured insights from top creators and industry experts",
      "Comprehensive guides on creator payments and taxation",
      "Platform-specific strategies for major social networks",
      "Regular coverage of industry trends and updates",
    ],

    trustItems: [
      { icon: "expertise", label: "Expertise", value: "Creator Economy" },
      { icon: "verified", label: "Verified", value: "Sparkonomy" },
      { icon: "featured", label: "Content", value: "100+ Articles" },
    ],

    mediaMentions: [],

    // Articles fetched from WordPress - no hardcoded articles needed
    featuredArticles: [],
    recentArticles: [],

    areasOfExpertise: [
      "Creator Payments",
      "Content Monetization",
      "Brand Partnerships",
      "Platform Strategies",
      "Creator Taxation",
      "Growth Tips",
    ],

    contactEmail: "content@sparkonomy.com",
    mediaEmail: "press@sparkonomy.com",
    responseTime: "We typically respond within 48 hours",

    lastUpdated: "December 2, 2025",
    profileId: "authors/dev-sparkonomy",
  },
  {
    id: "binny_agarwal",
    slug: "binny-agarwal",

    // SEO metadata
    metaTitle: "Binny Agarwal: CA and Business Guide at Sparkonomy",
    metaDescription: "Binny Agarwal is a Chartered Accountant and writer. She helps creators use AI and smart tools to build real businesses.",
    canonicalPath: "/authors/binny-agarwal",

    // WordPress matching (Co-Authors Plus uses "cap-" prefix)
    wordpressSlug: "cap-binny",
    wordpressAuthorId: 7,

    name: "Binny Agarwal",
    role: "Content Strategist & Chartered Accountant (CA)",
    avatarUrl: "https://www.sparkonomy.com/authors/BinnyProfilePictue.png",
    shortBio:
      "I help creators turn their hobby into a real business. I am a Chartered Accountant (CA) with 12 years of experience, and at Sparkonomy I write simple guides on money, systems, and how AI can complement your work by taking care of boring admin, so you can create more while building a career that lasts.",

    socialLinks: {
      twitter: "https://x.com/BinnyWriter",
      linkedin: "https://www.linkedin.com/in/binny-agarwal",
      email: "contentwriter3851@gmail.com",
      website: "https://binnycontentwriter.com",
    },

    previousCompanies: [
      { name: "Sprinklr", logo: "/authors/Logos/Sprinklr1.png" },
      { name: "Freshworks", logo: "/authors/Logos/FreshWorks1.png" },
      { name: "SocialPilot", logo: "/authors/Logos/SocialPilot1.png" },
      { name: "Emitrr", logo: "/authors/Logos/Emitrr1.png", darkFg: true },
      { name: "SkinVision", logo: "/authors/Logos/SkinVision1.png" },
      { name: "Masalabox", logo: "/authors/Logos/MasalaBox1.png", noFilter: true },
    ],
    previousCompaniesLabel: "Trusted by teams at:",

    storyTitle: "From CA Work to Creator Work",
    storyContent: [
      "I love creators because you build something from nothing. But I also know what happens behind the scenes. You end up doing the boring business work too. Pricing, invoices, taxes, contracts, and planning. That stuff is not hard because you are not smart. It is hard because nobody teaches it in a creator journey.",
      "I came from finance and I have spent 12 years working with money, systems, and business rules. Over time, I realised creators were doing real business, but without the same support that other businesses get. That is why I started writing for creators.",
    ],
    highlightQuote:
      "You should not have to choose between creativity and stability.",
    storyConclusion: [
      "That is why I work with Sparkonomy. We are building tools and AI agents that handle the admin and reduce the back-and-forth. I see AI as a teammate for creators. It does the repeat work, so you can keep your energy for the work only you can do: create, connect, and build a brand that lasts.",
    ],

    aboutTitle: "About Binny",
    aboutContent: [
      "Binny is a Chartered Accountant (CA) and content strategist with 12 years of experience in money, systems, and business thinking. At Sparkonomy, she writes simple, creator-friendly guides that help creators work less and earn better. Her focus is practical: getting paid on time, pricing with confidence, keeping more of what you earn, and building a business that does not burn you out. She also writes about how technology and AI can support creators, not replace them. In her work, AI is most useful when it takes care of repeatable admin tasks like drafting, checks, reminders, and workflows. When the business side becomes lighter, creators get more time and headspace to create.",
      "Binny has worked with teams across SaaS and content-led brands, including Sprinklr, Freshworks, SocialPilot, Emitrr, SkinVision, and Masalabox. Her work sits at the intersection of finance and communication. She takes complex topics like taxes, documentation, compliance, and business planning, then translates them into simple steps creators can follow without stress. Across projects, she has seen one pattern clearly: creators grow faster when they build small systems early, like clean invoicing, clear pricing, and routines that protect cash flow. At Sparkonomy, she connects the dots between smart tools and real outcomes, so creators can use AI with confidence and build a creator business that lasts.",
      "Binny writes the way she would want a finance partner to speak to her: simple, direct, and useful. She avoids jargon and focuses on clarity that helps creators act fast and stay in control. Her goal is to make money and systems feel manageable, not intimidating. She believes AI should work like a teammate, handling repeatable admin so creators can protect their energy and creativity. More clarity, more confidence, and more time back for the work that matters.",
    ],

    careerHighlights: [
      "Chartered Accountant (CA)",
      "12 years in finance and business systems",
      "Trusted by teams at Sprinklr and Freshworks",
      "Creator-first guides on pricing and getting paid",
      "Clear, simple writing style for fast learning",
      "AI-for-creators workflows and use cases",
      "Focus on sustainable creator careers",
      "Strategy that prevents burnout",
    ],

    trustItems: [
      { icon: "experience", label: "Experience", value: "12 Years" },
      { icon: "expertise", label: "Expertise", value: "CA Finance" },
      { icon: "verified", label: "Verified", value: "Sparkonomy" },
      { icon: "featured", label: "Focus", value: "Creator Systems" },
      { icon: "awards", label: "Approach", value: "Clear Steps" },
      { icon: "following", label: "Impact", value: "Save Time" },
    ],

    mediaMentions: [],

    featuredArticles: [],
    recentArticles: [],

    areasOfExpertise: [
      "Business for Creators",
      "AI Tools",
      "Money Tips",
      "Pricing Strategy",
      "Getting Paid",
      "Building Systems",
      "Building Trust",
      "Saving Time",
      "Future of Work",
      "Creator Workflows",
      "Founder Mindset",
    ],

    contactEmail: "contentwriter3851@gmail.com",
    linkedinSubscribe: "https://www.linkedin.com/in/binny-agarwal",
    responseTime: "Do you want to build a business, not just a social media page? The fastest way is to email me or connect on LinkedIn.",

    lastUpdated: "January 8, 2026",
    profileId: "authors/binny-agarwal",
  },
  {
    id: "saurabh_mongia",
    slug: "saurabh-mongia",

    // SEO metadata
    metaTitle: "Saurabh Mongia, CA | VP Finance & Creator Payment Expert at Sparkonomy",
    metaDescription: "Saurabh Mongia bridges institutional finance and creator payouts. CA, VP at Morgan Stanley. Read invoicing & payment workflow guides.",
    canonicalPath: "/authors/saurabh-mongia",

    // WordPress matching (Co-Authors Plus uses "cap-" prefix)
    wordpressSlug: "cap-saurabh",
    wordpressAuthorId: 8,

    name: "Saurabh Mongia",
    role: "VP (Legal Entity Control) | Chartered Accountant | Finance Controls & Compliance",
    avatarUrl: "https://www.sparkonomy.com/authors/ProfilePictureSaurabh.jpg",
    shortBio:
      "I am a Chartered Accountant and finance leader with 16+ years of experience in reporting, regulatory compliance, and control frameworks. I currently work as Vice President (Legal Entity Control) at Morgan Stanley, and at Sparkonomy I share practical, creator-friendly guidance to help you manage money better, from raising the perfect invoice to navigating complex cross-border taxation.",

    socialLinks: {
      linkedin: "https://www.linkedin.com/in/CompliFinixSolutions/",
    },

    previousCompanies: [
      { name: "Morgan Stanley", logo: "/authors/Logos/MorganStanley.png" },
      { name: "NatWest Group", logo: "/authors/Logos/NatWest.png", darkFg: true },
      { name: "HSBC", logo: "/authors/Logos/HSBC.png", darkFg: true },
      { name: "Max Life Insurance", logo: "/authors/Logos/MaxLife.png", darkFg: true },
    ],
    previousCompaniesLabel: "Previously scaling businesses at:",

    storyTitle: "From Institutional Finance to Creator Payouts",
    storyContent: [
      "I have spent most of my career in finance teams where details matter. If one field is missing, a payment can pause. If a tax detail is wrong, the invoice can be rejected. If the documentation is unclear, it can go back and forth for days. That is not because someone enjoys delays. It is because the process is designed to protect the business and stay compliant.",
      "The reason I care about the creator economy is simple. Creator work is real work, but creators are often forced to run a business without the systems of a business. You deliver the work, then you chase payments, explain terms, fix invoices, figure out GST or TDS, and worry about cross-border payouts. Many times, the issue is not the creator or the brand. It is the lack of a simple CFO-like setup.",
    ],
    highlightQuote:
      "Most money stress is not personal. It is a process.",
    storyConclusion: [
      "That is why I write for Sparkonomy. I enjoy translating big-company finance rules into creator-friendly steps. My aim is to help you send invoices and proof that get approved in one go. Less resubmission. Less chasing. More time back for your real work.",
    ],

    aboutTitle: "About Saurabh",
    aboutContent: [
      "Saurabh Mongia is a Chartered Accountant with 16+ years of experience across financial reporting, regulatory compliance, and control frameworks. Today, he works as Vice President (Legal Entity Control) at Morgan Stanley, supporting entities across EMEA and Asia with financial control, audit readiness, and process improvement. On Sparkonomy, he focuses on one practical goal: helping creators run money like a business, not a guessing game. He writes guidance that covers everything from getting invoices and documentation right to pricing, taxes, and cross-border basics, so creators can get paid smoothly and stay compliant. If an invoice has ever been sent back for one missing detail, or if GST, TDS, or audit worries have felt confusing, his writing is built to prevent problems before they start.",
      "Before Morgan Stanley, Saurabh spent over a decade at NatWest Group, progressing from Associate to Vice President and working across reporting, controls, and finance transformation. Earlier in his career, he worked in finance operations roles at HSBC and Max Life Insurance, and trained as an article trainee at a chartered accountancy firm. This mix gives him a clear view of what finance teams check, what slows processing down, and what helps an invoice move faster. In his writing, he stays practical: what to include, why it matters, and how to avoid the common \"please resend\" loop. The standard is simple: make it easy to approve.",
      
    ],

    careerHighlights: [
      "16+ years in finance, reporting, and compliance",
      "VP (Legal Entity Control), Morgan Stanley (Apr 2024–Present)",
      "10+ years at NatWest Group across finance leadership roles",
      "Focus: financial controls, audit readiness, process improvement",
      "Chartered Accountant (ICAI)",
      "Internal audits, corporate tax, income tax returns",
      "Strong lens on AP requirements and approvals",
      "Process automation and documentation clarity",
    ],

    trustItems: [
      { icon: "experience", label: "Experience", value: "16+ Years" },
      { icon: "expertise", label: "Expertise", value: "Controls & Reporting" },
      { icon: "verified", label: "Verified", value: "Sparkonomy" },
      { icon: "featured", label: "Focus", value: "Clean Invoicing" },
    ],

    mediaMentions: [],

    featuredArticles: [],
    recentArticles: [],

    areasOfExpertise: [
      "Creator Invoicing",
      "Payment Workflows",
      "Accounts Payable Basics",
      "Audit Readiness",
      "Financial Controls",
      "Regulatory Compliance",
      "Financial Reporting",
      "Process Automation",
      "TDS/GST Basics (India)",
      "Section 194J Compliance",
      "Professional Fee Invoicing",
      "Cross-Border Payment Documentation",
    ],

    contactEmail: "contact@sparkonomy.com",
    linkedinSubscribe: "https://www.linkedin.com/in/saurabh-mongia",
    responseTime: "If you want to collaborate or suggest a topic, the fastest way is to connect with me on LinkedIn.",

    lastUpdated: "December 23, 2025",
    profileId: "authors/saurabh-mongia",
  },
  {
    id: "megha_thareja_tyagi",
    slug: "megha-thareja-tyagi",

    // SEO metadata
    metaTitle: "Megha Thareja Tyagi: AI Strategy and Creator Economy Leader at Sparkonomy",
    metaDescription:
      "Meet Megha Thareja Tyagi, Co-Founder at Sparkonomy. Expert in AI strategy, creator economy infrastructure, growth, and commercialization. Explore her background across Google, PayPal, and American Express, and read her Sparkonomy insights.",
    canonicalPath: "/authors/megha-thareja-tyagi",

    // WordPress matching (Co-Authors Plus uses "cap-" prefix)
    wordpressSlug: "cap-megha",

    name: "Megha Thareja Tyagi",
    role: "Co-Founder, Sparkonomy",
    avatarUrl: "https://www.sparkonomy.com/authors/ProfilePictureMegha.png",
    shortBio:
      "I build AI infrastructure for the creator economy, drawing on more than two decades of experience across growth, strategy, payments, and partnerships. After leadership roles at Google, PayPal, and American Express, I am now focused on helping Sparkonomy create the operating layer creators need to grow like real businesses.",

    socialLinks: {
      linkedin: "https://www.linkedin.com/in/meghatyagi",
      twitter: "https://x.com/meghattyagi?s=11",
      email: "meghat@sparkonomy.com",
    },

    previousCompanies: [
      { name: "Google", logo: "/authors/Logos/Google.png" },
      { name: "PayPal", logo: "/authors/Logos/PayPal.png" },
      { name: "American Express", logo: "/authors/Logos/AmericanExpress.png" },
    ],
    previousCompaniesLabel: "Previously driving growth, payments, and commercial leadership at:",

    storyTitle: "From Enterprise Growth to the Creator Economy",
    storyContent: [
      "I've spent more than 20 years working at the intersection of growth, partnerships, payments, and technology. Across roles at Google, PayPal, American Express, and now as a founder and advisor, I have seen what happens when ambitious businesses get the right systems, the right strategy, and the right execution behind them.",
      "Over time, one thing became hard to ignore. Large companies had teams, processes, tools, and commercial discipline built into the way they operated. Creators with talent, audience, and influence, but too often they were still stuck doing the hardest parts of business manually. That gap is what pulled me toward the creator economy. The future was clearly moving toward individuals building real businesses, but the infrastructure around them had not caught up yet. This direction aligns closely with Sparkonomy's mission to give creators an AI-powered operating layer and help move them from \"creators with followers\" to \"creator founders.\"",
    ],
    highlightQuote:
      "The next wave of growth will come from creators who finally have the systems, support, and infrastructure to build like real businesses.",
    storyConclusion: [
      "That is why I am building Sparkonomy. We are creating AI infrastructure for the creator economy so creators can spend less time wrestling with fragmented operations and more time building durable, scalable businesses. For brands, that same infrastructure creates a smarter way to discover, evaluate, and work with the right creator partners.",
    ],

    aboutTitle: "About Megha",
    aboutContent: [
      "Megha Thareja Tyagi is Co-Founder at Sparkonomy, where she is helping build AI infrastructure for the creator economy. With more than two decades of experience spanning growth leadership, payments, partnerships, commercialization, and market expansion, she brings a rare operator's lens to a category that is still defining its next chapter. Her work sits at the intersection of AI strategy, business model design, creator monetization, and go-to-market execution.",
      "At Sparkonomy, she is focused on helping shape the operating layer creators need to run stronger businesses, while also helping brands build more intelligent, data-backed creator partnerships. That work fits directly into Sparkonomy's broader mission to equip creators and brands with AI tools for seamless, scalable collaboration.",
      "Before co-founding this new venture, Megha held leadership roles across some of the world's most influential commerce and technology organizations. She spent nearly seven years at Google in senior roles across India and Southeast Asia, including Director of Mid Market Sales for Southeast Asia and Director of Large Customer Sales in India. Earlier, she led a large merchant business at PayPal India and spent a decade at American Express across payments consulting, merchant services, channel management, and strategic partnerships.",
      "She is also Co-Founder and Director at MetaValue, a strategy and growth consultancy, and serves as a Mentor and Investor at India Accelerator. Together, these roles reflect deep experience across enterprise growth, merchant ecosystems, digital monetization, and startup scaling.",
      "Megha believes the creator economy needs more than attention. It needs real operating infrastructure, sharper strategy, and systems that help talented people build sustainable businesses. Her approach combines commercial rigor, founder empathy, and a strong bias for action. Through her work and writing, she helps creators and brands move from fragmented effort to clearer strategy, stronger execution, and long-term growth.",
    ],

    careerHighlights: [
      "20+ years across growth, partnerships, payments, and commercialization",
      "Nearly 7 years at Google across India and Southeast Asia leadership roles",
      "Led large merchant business at PayPal India",
      "10 years at American Express across merchant services, partnerships, and consulting",
      "Co-Founder and Director at MetaValue Consulting, focused on launch-to-scale growth strategy",
      "Mentor and Investor at India Accelerator",
      "Honors include Chairman's Award for Innovation, The Next Idea Award, and Winner of Chairman Selecté",
      "PGDM in Marketing and Finance from Symbiosis Institute of Management Studies",
    ],

    trustItems: [
      { icon: "experience", label: "Experience", value: "20+ Years" },
      { icon: "expertise", label: "Expertise", value: "AI Strategy" },
      { icon: "awards", label: "Awards", value: "5 Honors" },
      { icon: "verified", label: "Verified", value: "Sparkonomy" },
      { icon: "following", label: "Mentorship", value: "India Accelerator" },
      { icon: "featured", label: "Leadership", value: "Google, PayPal, AmEx" },
    ],

    mediaMentions: [
      {
        publication: "Impact India Virtual Conference",
        logo: "/logos/impact-india.svg",
        title: "Privacy-First Future and Digital Transformation",
        author: "Megha Thareja Tyagi",
        date: "",
        url: "https://mmaglobal.com/impactindia2021/agenda",
      },
      {
        publication: "Women Economic Forum",
        logo: "/logos/women-economic-forum.svg",
        title: "India's Digital Retail Revolution",
        author: "Megha Thareja Tyagi",
        date: "",
        url: "https://www.wef.org.in/annual-wef-India-decembe-2021-bangalore-india/speaker.php?registrationid=137",
      },
    ],

    featuredArticles: [],
    recentArticles: [],

    areasOfExpertise: [
      "AI Strategy",
      "Creator Economy",
      "Creator Infrastructure",
      "Go-to-Market Strategy",
      "Commercialization",
      "Revenue Growth",
      "Platform Ecosystems",
      "Merchant Partnerships",
      "Digital Advertising",
      "Payments",
      "Start-up Leadership",
      "Brand-Creator Fit",
    ],

    contactEmail: "meghat@sparkonomy.com",
    linkedinSubscribe: "https://www.linkedin.com/in/meghatyagi",
    responseTime:
      "Have a question about creator infrastructure, AI strategy, or building stronger creator-brand systems? Connect with Megha on LinkedIn to continue the conversation.",

    lastUpdated: "March 9, 2026",
    profileId: "authors/megha-thareja-tyagi",
  },
  {
    id: "rachit_jain",
    slug: "rachit-jain",

    // SEO metadata
    metaTitle: "Rachit Jain: Growth, partnerships, and GTM leader at Sparkonomy",
    metaDescription:
      "Meet Rachit Jain, growth and partnerships leader at Sparkonomy. He brings 20+ years across Meta, Google, SAP, and IBM to write about growth, GTM, and creator businesses.",
    canonicalPath: "/authors/rachit-jain",

    // WordPress matching (Co-Authors Plus uses "cap-" prefix)
    wordpressSlug: "cap-rachit",

    name: "Rachit Jain",
    role: "Growth, Partnerships, and GTM leader",
    avatarUrl: "/authors/rachit-jain-sparkonomy-author.png",
    shortBio:
      "I am a growth and partnerships leader based in Gurugram, with 20+ years of experience across Meta, Google, SAP, and IBM. At Sparkonomy, I write about growth strategy, monetization, partnerships, and how smart systems can help creators build stronger, more durable revenue streams. I am also an adjunct faculty at Manipal Academy of Higher Education.",

    socialLinks: {
      linkedin: "https://www.linkedin.com/in/jainrachit",
      email: "rachitj@sparkonomy.com",
    },

    previousCompanies: [
      { name: "Meta", logo: "/authors/Logos/META.png" },
      { name: "Google", logo: "/authors/Logos/Google.png" },
      { name: "SAP", logo: "/authors/Logos/SAP.png" },
      { name: "IBM", logo: "/authors/Logos/IBM.png" },
    ],
    previousCompaniesLabel: "Previously driving growth at:",

    storyTitle: "From enterprise growth to the next wave of business building",
    storyContent: [
      "I have spent more than two decades helping businesses grow at the intersection of marketing, technology, and commercial strategy. Across large platforms and enterprise teams, my work has centered on one core question: how do you turn technology into real business outcomes?",
      "At Google and Meta, that meant leading consultative growth conversations, building category strategies, and helping teams and clients navigate digital transformation at scale.",
      "Over time, I saw the same pattern repeat itself. Big businesses had access to systems, specialists, and strategic support. Independent builders often did not. Yet they were expected to move just as fast, sell just as well, and grow with far less structure around them. That gap is what makes the creator economy so exciting, and so fragile at the same time. Sparkonomy's mission to give creators smarter operating support sits right at the center of that shift.",
    ],
    highlightQuote:
      "The future belongs to people who can pair human judgment with smarter systems.",
    storyConclusion: [
      "That is why I am drawn to the next generation of business building. I care about growth that is not just fast, but durable. I care about partnerships that create value on both sides. And I care about giving founders, operators, and creators the clarity they need to scale without drowning in complexity. That is the lens I bring to what I write at Sparkonomy.",
    ],

    aboutTitle: "About Rachit",
    aboutContent: [
      "Rachit Jain is a business and growth leader with 20+ years of experience across digital strategy, consultative sales, partnerships, product-led growth, and market development.",
      "He currently runs a stealth-mode AI startup and writes for Sparkonomy on growth strategy, monetization, partnerships, and the systems that help modern businesses scale with more clarity. His career has focused on helping organizations use technology and marketing solutions to drive business outcomes, whether through enterprise transformation, revenue planning, category leadership, or new business building.",
      "His standout strength is connecting commercial strategy with execution, turning broad opportunities into structured, scalable growth paths.",
      "Before this chapter, Rachit spent 10+ years at Google in senior roles across India and the US, including Google Cloud EdTech Lead, Head of Video, CRM Tools, and Data Authors for gPS MediaOps, and Head of Industry for Retail, Education, EdTech, and Government. Earlier, he led mid-market and growth businesses at Meta.",
      "His broader career also includes SAP, where he contributed to closing software revenue worth over $4.5 million in FY2008, IMA India, where he helped grow the CMO Forum to 65+ members in under a year, and IBM, where he supported product marketing and demand generation efforts.",
      "Rachit believes strong growth is never just about selling harder. It comes from better judgment, better systems, and better alignment between product, market, and execution. His approach combines commercial sharpness with structured thinking, helping teams focus on what actually moves the business forward. That is the perspective he brings to Sparkonomy's readers as creators increasingly become businesses of their own.",
    ],

    careerHighlights: [
      "20+ years across Meta, Google, SAP, and IBM, spanning growth, partnerships, sales, and digital strategy.",
      "Led Google category strategy across Retail, Education, EdTech, and Government in India.",
      "Built and coached high-performing teams while owning CXO relationships and multi-year revenue plans.",
      "Helped drive cloud adoption for EdTech organizations through Google Cloud.",
      "Contributed to closing software revenue worth over $4.5 million at SAP Value Engineering.",
      "Grew IMA India's CMO Forum to 65+ members in Delhi and Mumbai in under 12 months, including 25 net new accounts.",
      "Recognized in Paul Writer's Digi100 list of top digital marketing leaders in India.",
      "Represented Google and Meta at multiple industry events, podcasts, and business conversations.",
    ],

    trustItems: [
      { icon: "experience", label: "Experience", value: "20+ Years" },
      { icon: "expertise", label: "Expertise", value: "GTM Growth" },
      { icon: "awards", label: "Awards", value: "Digi100 Leader" },
      { icon: "verified", label: "Verified", value: "Sparkonomy" },
      { icon: "following", label: "Following", value: "LinkedIn Audience" },
      { icon: "featured", label: "Featured", value: "Speaker Profile" },
    ],

    mediaMentions: [
      {
        publication: "Paul Writer",
        logo: "/logos/paul-writer.svg",
        title: "Paul Writer unveils Adobe Digi100 — India's Top 100 digital marketers",
        author: "Rachit Jain",
        date: "",
        url: "https://paulwriter.com/paul-writer-unveils-adobe-digi100-indias-top-100-digital-marketers",
      },
    ],

    featuredArticles: [],
    recentArticles: [],

    areasOfExpertise: [
      "Growth Strategy",
      "Strategic Partnerships",
      "GTM Planning",
      "Digital Transformation",
      "MarTech",
      "Business Development",
      "Monetization",
      "CXO Sales",
      "Revenue Planning",
      "Category Strategy",
      "EdTech Growth",
      "Enterprise Marketing",
    ],

    contactEmail: "rachitj@sparkonomy.com",
    linkedinSubscribe: "https://www.linkedin.com/in/jainrachit",
    responseTime:
      "Want to talk about growth, partnerships, monetization, or how technology can unlock better business outcomes? Connect with me on LinkedIn.",

    lastUpdated: "March 25, 2026",
    profileId: "authors/rachit-jain",
  },
];

// Helper functions
export function getAuthorById(id: string): AuthorEntry | undefined {
  return authors.find((author) => author.id === id);
}

export function getAuthorBySlug(slug: string): AuthorEntry | undefined {
  return authors.find((author) => author.slug === slug);
}

/**
 * Find an author by their WordPress slug.
 * This is used to match WordPress authors to our local author data.
 * Returns the author's local slug (for our author page URL) if found.
 */
export function getAuthorByWordPressSlug(wpSlug: string): AuthorEntry | undefined {
  return authors.find((author) => author.wordpressSlug === wpSlug);
}

/**
 * Get our local author page slug from a WordPress author slug.
 * Falls back to the WordPress slug if no matching author is found.
 */
export function getAuthorPageSlug(wpSlug: string): string {
  const author = getAuthorByWordPressSlug(wpSlug);
  return author ? author.slug : wpSlug;
}

export function getAllAuthorSlugs(): string[] {
  return authors.map((author) => author.slug);
}
