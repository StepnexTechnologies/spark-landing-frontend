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
    wordpressSlug: "guneet",
    wordpressAuthorId: 5,

    name: "Guneet Singh",
    role: "Global Tech Leader | Startup Mentor | Venture Builder",
    avatarUrl: "https://www.sparkonomy.com/authors/ProfilePicture_gunnet.png",
    shortBio: "I am a tech leader and strategist based in Singapore. After 20 years working across Google, Microsoft, Samsung, and ABN AMRO, I now build and mentor at the edge of technology and new work. At Sparkonomy, I write about how smart systems and AI can complement creators by handling the friction so you can spend more time creating and still build a sustainable career.",

    socialLinks: {
      twitter: "https://twitter.com/guneetsingh",
      linkedin: "https://www.linkedin.com/in/guneets",
      email: "guneet@sparkonomy.com",
    },

    previousCompanies: [
      { name: "Google", logo: "/authors/logos/Google.png" },
      { name: "Microsoft", logo: "/authors/logos/Microsoft.png" },
      { name: "Samsung", logo: "/authors/logos/Samsung.png" },
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
      "That is why I built Sparkonomy.",
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
      "Served as Global Head of Marketing & Creative Solutions at Google, and held leadership roles at Microsoft and ABN AMRO Bank.",
      "Serves as a Startup Mentor & Venture Architect for Singapore's NUS GRIP program, actively working to commercialize deep tech.",
      "Pioneered the intersection of creative strategy and AI-driven execution years before GPT, by founding Google's Ignition Labs.",
      "Co-founded and scaled the social e-commerce startup DealsAndYou, growing the team from 0 to 40 employees in just 5 months.",
      "Recognized with 30+ international awards, including Cannes and Spikes, and named APAC Digital Marketer of the Year.",
    ],

    trustItems: [
      { icon: "experience", label: "Experience", value: "20+ Years" },
      { icon: "expertise", label: "Expertise", value: "Tech Platform Growth" },
      { icon: "awards", label: "Awards", value: "Hall of Fame" },
      { icon: "verified", label: "Verified", value: "Sparkonomy" },
      { icon: "featured", label: "Focus", value: "Creator Systems" },
      { icon: "following", label: "Impact", value: "Work Smarter" },
    ],

    mediaMentions: [
      {
        publication: "AI Marketers Guild",
        logo: "/logos/aimg.svg",
        title: "Using Google's NotebookLM",
        author: "Guneet Singh",
        date: "October 2024",
        url: "#",
      },
      {
        publication: "ACV Academy & Google",
        logo: "/logos/acv-academy.svg",
        title: "New Playbook on OKRs",
        author: "Guneet Singh",
        date: "2024",
        url: "#",
      },
      {
        publication: "HR Talk with Non HR Folk",
        logo: "/logos/hr-talk.svg",
        title: "Marketing & Creative Services at Google APAC",
        author: "Guneet Singh",
        date: "November 2021",
        url: "#",
      },
      {
        publication: "India International Brand Summit",
        logo: "/logos/iibs.svg",
        title: "Panel Speaker",
        author: "Guneet Singh",
        date: "2020",
        url: "#",
      },
      {
        publication: "CIO Tech Outlook",
        logo: "/logos/cio-tech-outlook.svg",
        title: "3 Essentials of Digital Video",
        author: "Guneet Singh",
        date: "2019",
        url: "#",
      },
      {
        publication: "Zee MELT",
        logo: "/logos/zee-melt.svg",
        title: "India's Biggest Conference for Disruptive Marketing Practices",
        author: "Guneet Singh",
        date: "2019",
        url: "#",
      },
      {
        publication: "Melt",
        logo: "/logos/melt.svg",
        title: "Do's and Don'ts of Digital Marketing",
        author: "Guneet Singh",
        date: "2018",
        url: "#",
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

    contactEmail: "guneet@sparkonomy.com",
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
    avatarUrl: "https://www.sparkonomy.com/authors/BinnyProfilePictue.jpg",
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
      { name: "Emitrr", logo: "/authors/Logos/Emitrr1.png" },
      { name: "SkinVision", logo: "/authors/Logos/SkinVision1.png" },
      { name: "Masalabox", logo: "/authors/Logos/MasalaBox1.png" },
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
      { name: "NatWest Group", logo: "/authors/Logos/NatWest.png" },
      { name: "HSBC", logo: "/authors/Logos/HSBC.png" },
      { name: "Max Life Insurance", logo: "/authors/Logos/MaxLife.png" },
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
