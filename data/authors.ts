// Types for comprehensive author data
export interface AuthorSocialLinks {
  twitter?: string;
  linkedin?: string;
  email?: string;
  instagram?: string;
  youtube?: string;
  facebook?: string;
}

export interface PreviousCompany {
  name: string;
  logo?: string;
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

  // WordPress matching - use ONE of these to match WordPress author to our data
  wordpressSlug?: string; // WordPress author slug (e.g., "dev-sparkonomy") - PREFERRED
  wordpressAuthorId?: number; // WordPress author ID (e.g., 1) - Alternative

  name: string;
  role: string;
  avatarUrl: string;
  shortBio: string; // Quote/tagline shown at top
  socialLinks: AuthorSocialLinks;
  previousCompanies: PreviousCompany[];

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

    // WordPress matching
    wordpressSlug: "guneet",
    wordpressAuthorId: 5,

    name: "Guneet Singh",
    role: "Founder & Chief Hustler, Sparkonomy",
    avatarUrl: "/authors/ProfilePicture_gunnet.png",
    shortBio: "I am a tech veteran and strategist based in Singapore. After 20 years leading consumer tech businesses at Google and Microsoft, I am now building the AI infrastructure to protect and empower the next generation of entrepreneurs: the creators.",

    socialLinks: {
      twitter: "https://twitter.com/guneetsingh",
      linkedin: "https://www.linkedin.com/in/guneetsingh",
      email: "guneet@sparkonomy.com",
    },

    previousCompanies: [
      { name: "Google", logo: "/authors/logos/Google.png" },
      { name: "Microsoft", logo: "/authors/logos/Microsoft.png" },
      { name: "Samsung", logo: "/authors/logos/Samsung.png" },
    ],

    storyTitle: "From Big Tech to the Creator Economy",
    storyContent: [
      "I spent the last two decades in corporate boardrooms, but the most exciting shift I ever witnessed didn't happen in a meeting—it happened on a screen.",
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
      "Guneet is the Founder and CEO of Sparkonomy, a startup dedicated to building financial and operational infrastructure for the creator economy. Based in Singapore, he combines deep industry expertise with a passion for AI productivity to solve the systemic challenges creators face—from payment friction to sustainable scaling.",
      "Prior to founding Sparkonomy, Guneet spent over 20 years leading billion-dollar portfolios in the Consumer Tech and Media sectors. He held key leadership positions at Google, Microsoft, and Samsung, driving navigating the intersection of consumer behavior and emerging technology.",
      "A firm believer in the \"democratization of entrepreneurship,\" Guneet advocates for a future where human creativity is the ultimate economic engine. He actively mentors early-stage startups and writes about the impact of AI on human productivity and the shifting landscape of work.",
    ],

    careerHighlights: [
      "Led content strategy for Google Pay across 12 APAC markets",
      "Scaled Grab's editorial operations from 3 to 8 markets in 2 years",
      "Featured expert in TechCrunch, AdWeek, and Channel NewsAsia",
      "Speaker at VidCon 2025, Social Media Week, APAC Creator Summit",
      "Specialist in APAC payment regulations and creator taxation",
      "Mentor to 30+ creator economy startups through Antler and SOSV",
      "MBA from Singapore Management University; Certified Content Strategist",
    ],

    trustItems: [
      { icon: "experience", label: "Experience", value: "18+ Years" },
      { icon: "expertise", label: "Expertise", value: "Certified" },
      { icon: "verified", label: "Verified", value: "Sparkonomy" },
      { icon: "awards", label: "Awards", value: "Winner" },
      { icon: "following", label: "Following", value: "10K LinkedIn" },
      { icon: "featured", label: "Featured", value: "Tech Crunch" },
    ],

    mediaMentions: [
      {
        publication: "TechCrunch",
        logo: "/logos/techcrunch.svg",
        title: "The Future of Creator Payments",
        author: "Guneet",
        date: "March 2025",
        url: "https://techcrunch.com/article",
      },
      {
        publication: "AdWeek",
        logo: "/logos/adweek.svg",
        title: "The Future of Creator Payments",
        author: "Guneet",
        date: "March 2025",
        url: "https://adweek.com/article",
      },
      {
        publication: "What The Finance",
        logo: "/logos/wtf.svg",
        title: "The Future of Creator Payments",
        author: "Guneet",
        date: "March 2025",
        url: "https://wtf.com/article",
      },
    ],

    // Articles fetched from WordPress - no hardcoded articles
    featuredArticles: [],
    recentArticles: [],

    areasOfExpertise: [
      "Creator Economy",
      "MarTech Strategy",
      "APAC Strategy",
      "AI Productivity",
      "Future of Work",
      "Digital Marketing",
      "Startup Leadership",
      "Consumer Technology",
    ],

    contactEmail: "guneet@sparkonomy.com",
    mediaEmail: "press@sparkonomy.com",
    speakingEmail: "events@sparkonomy.com",
    responseTime: "I typically respond within 24 hours",
    linkedinSubscribe: "https://www.linkedin.com/in/guneetsingh",

    lastUpdated: "November 18, 2025",
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
    avatarUrl: "/authors/dev-sparkonomy.jpg",
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

    // WordPress matching
    wordpressSlug: "binny",
    wordpressAuthorId: 7,

    name: "Binny Agarwal",
    role: "Content Strategist & Chartered Accountant (CA)",
    avatarUrl: "/authors/ProfilePicture_binny.png",
    shortBio:
      "Binny Agarwal helps creators turn their hobby into a real company. She is a Chartered Accountant (CA) with 12 years of experience. At Sparkonomy, she writes simple guides on how to use AI and smart tools to make more money and work less.",

    socialLinks: {
      twitter: "https://twitter.com/BinnyWriter",
      linkedin: "https://www.linkedin.com/in/binny-agarwal",
      email: "contentwriter3851@gmail.com",
    },

    previousCompanies: [
      { name: "Sprinklr" },
      { name: "Freshworks" },
      { name: "SocialPilot" },
      { name: "Emitrr" },
      { name: "SkinVision" },
      { name: "Masalabox" },
    ],

    storyTitle: "About Binny",
    storyContent: [
      "Binny Agarwal is a Chartered Accountant (CA) and a writer. She has been working for 12 years.",
      "Most creators are great at making videos or art. But they often struggle with the \"boring\" stuff—like taxes, contracts, and planning for the future. Binny fixes this.",
    ],
    highlightQuote:
      "Build Assets: Make things that pay you even when you are sleeping.",
    storyConclusion: [
      "Binny uses her experience with money and business to help you think like a \"Founder,\" not just a user. She teaches you how to build assets, work smart so you don't burn out, and understand the rules of business so you keep more of what you earn.",
      "Sparkonomy is building the future for creators. This includes AI Agents (smart digital helpers) and tools to run your entire business. Binny is the voice that explains these tools.",
      "Sparkonomy builds smart AI. Binny writes the playbook on how to use it.",
      "She connects the dots. She explains how a new AI tool can help you save time. She explains how to price your work. She is here to make sure you use Sparkonomy to build a business that lasts a long time.",
      "Binny writes simply. She does not use big, confusing words. She gets straight to the point. She wants you to read her advice, understand it fast, and go back to creating.",
    ],

    aboutTitle: "How She Helps You",
    aboutContent: [
      "Binny uses her experience with money and business to help you think like a \"Founder,\" not just a user. She teaches you how to:",
      "Build Assets: Make things that pay you even when you are sleeping.",
      "Work Smart: Use strategy so you don't burn out.",
      "Keep Your Money: Understand the rules of business so you keep more of what you earn.",
    ],

    careerHighlights: [
      "12 years of professional experience",
      "Chartered Accountant (CA) – Expert in numbers and finance",
      "Focus on turning Creators into Founders",
      "Specialist in Business Strategy and AI for Creators",
      "Trusted by teams at Sprinklr, Freshworks, SocialPilot, Emitrr, SkinVision, and Masalabox",
    ],

    trustItems: [
      { icon: "experience", label: "Experience", value: "12 Years" },
      { icon: "expertise", label: "Degree", value: "Chartered Accountant" },
      { icon: "verified", label: "Focus", value: "Creator to Founder" },
      { icon: "awards", label: "Skills", value: "Business & AI" },
    ],

    mediaMentions: [],

    featuredArticles: [],
    recentArticles: [],

    areasOfExpertise: [
      "Business for Creators",
      "AI Tools",
      "Money Tips",
      "Smart Strategy",
      "Building Trust",
      "Saving Time",
      "Future of Work",
    ],

    contactEmail: "contentwriter3851@gmail.com",
    linkedinSubscribe: "https://www.linkedin.com/in/binny-agarwal",
    responseTime: "Do you want to build a business, not just a social media page? Binny can help.",

    lastUpdated: "January 9, 2026",
    profileId: "authors/binny-agarwal",
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
