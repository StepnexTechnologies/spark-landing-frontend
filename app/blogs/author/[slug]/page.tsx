import type { Metadata } from "next";
import { notFound } from "next/navigation";
import AuthorPageTemplate from "@/components/blog/AuthorPageTemplate";
import {
  getAuthorBySlug,
  getAllAuthorSlugs,
  FeaturedArticle,
  RecentArticle,
} from "@/data/authors";
import {
  getPosts,
  getPostsByAuthor,
  getPostsByAuthorSlug,
  getFeaturedImageUrl,
  formatDate,
  decodeHtmlEntities,
  getReadingTime,
} from "@/lib/wordpress-improved";
import { SITE_URL, authorPath, authorUrl, twitterHandle } from "@/lib/urls";

interface AuthorPageProps {
  params: Promise<{
    slug: string;
  }>;
}

// Build an absolute URL from a possibly-relative asset path. JSON-LD is NOT
// resolved against metadataBase, so Person/Organization images embedded in
// structured data must be absolute or they are invalid.
function absoluteUrl(path?: string): string | undefined {
  if (!path) return undefined;
  return path.startsWith("http") ? path : `${SITE_URL}${path}`;
}

// Convert a human "Month DD, YYYY" date into an ISO 8601 date (YYYY-MM-DD).
// Appending " UTC" forces UTC parsing so the value never shifts by a day.
function toIsoDate(human?: string): string | undefined {
  if (!human) return undefined;
  const d = new Date(`${human} UTC`);
  return Number.isNaN(d.getTime()) ? undefined : d.toISOString().slice(0, 10);
}

// Generate static params for all authors
export function generateStaticParams() {
  const slugs = getAllAuthorSlugs();
  return slugs.map((slug) => ({ slug }));
}

// Generate dynamic metadata for SEO
export async function generateMetadata({ params }: AuthorPageProps): Promise<Metadata> {
  const { slug } = await params;
  const author = getAuthorBySlug(slug);

  if (!author) {
    return {
      metadataBase: new URL(SITE_URL),
      title: "Author Not Found",
      description: "The requested author could not be found.",
    };
  }

  const title = author.metaTitle || `${author.name} - Author at Sparkonomy`;
  // Build description with expertise keywords for better SEO keyword consistency
  const expertiseText =
    author.areasOfExpertise?.slice(0, 3).join(", ") || "creator economy, content monetization";
  const description =
    author.metaDescription ||
    author.shortBio ||
    `Read articles by ${author.name} on Sparkonomy. Expert insights on ${expertiseText}, and digital marketing.`;

  const canonicalUrl = authorUrl(author.slug);
  const ogImage =
    absoluteUrl(author.avatarUrl) || "https://www.sparkonomy.com/sparkonomy.png";

  return {
    metadataBase: new URL("https://www.sparkonomy.com/"),
    title,
    description,
    keywords: [
      author.name,
      "Sparkonomy author",
      "creator economy",
      "content monetization",
      "digital marketing",
      "influencer marketing",
      ...author.areasOfExpertise,
    ],
    authors: [{ name: author.name }],
    creator: author.name,
    publisher: "Sparkonomy",
    alternates: {
      canonical: authorPath(author.slug),
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
      },
    },
    openGraph: {
      siteName: "Sparkonomy",
      url: canonicalUrl,
      title,
      description,
      type: "profile",
      images: [
        {
          url: ogImage,
          width: 400,
          height: 400,
          alt: author.name,
        },
      ],
      locale: "en_IN",
    },
    twitter: {
      card: "summary",
      title,
      description,
      images: [ogImage],
      // Attribute the card to the author's own handle (parsed from their X/
      // Twitter profile URL); fall back to the brand handle when absent.
      creator: twitterHandle(author.socialLinks?.twitter) ?? "@sparkonomy",
      site: "@sparkonomy",
    },
  };
}

export default async function AuthorPage({ params }: AuthorPageProps) {
  const { slug } = await params;
  const author = getAuthorBySlug(slug);

  if (!author) {
    notFound();
  }

  // Fetch articles from WordPress. Prefer wordpressAuthorId for regular WP
  // users; fall back to wordpressSlug (handles Co-Authors Plus guest authors
  // whose slugs are not resolvable via /users?slug=). The two fetches run in
  // parallel so the per-author call and the site-wide latest call overlap.
  let featuredArticles: FeaturedArticle[] | undefined;
  let recentArticles: RecentArticle[] | undefined;

  type AuthorPostsData = Awaited<ReturnType<typeof getPostsByAuthor>>["data"];
  const authorPostsPromise: Promise<AuthorPostsData> = author.wordpressAuthorId
    ? getPostsByAuthor(author.wordpressAuthorId, 1, 10).then((r) => r.data)
    : author.wordpressSlug
      ? getPostsByAuthorSlug(author.wordpressSlug, 10)
      : Promise.resolve([] as AuthorPostsData);

  const [authorResult, latestResult] = await Promise.allSettled([
    authorPostsPromise,
    getPosts(1, 3),
  ]);

  // Hoisted so the author's own posts are available both for display and for
  // the authored-articles ItemList structured data built further below.
  const authorPosts: AuthorPostsData =
    authorResult.status === "fulfilled" ? authorResult.value : [];
  if (authorResult.status === "rejected") {
    console.error("Error fetching WordPress posts for author:", authorResult.reason);
  }

  if (authorPosts.length > 0) {
    // First 2-3 posts as featured articles
    featuredArticles = authorPosts.slice(0, 3).map((post) => ({
      id: String(post.id),
      title: decodeHtmlEntities(post.title.rendered),
      description: decodeHtmlEntities(post.excerpt.rendered).slice(0, 100) + "...",
      imageSrc: getFeaturedImageUrl(post, "full") || "/blog/default-thumbnail.jpg",
      date: formatDate(post.date),
      readingTime: `${getReadingTime(post)} min read`,
      href: `/blogs/${post.slug}`,
    }));

    // Remaining posts as recent articles (fallback if the latest-posts
    // fetch below fails — otherwise it gets overwritten).
    recentArticles = authorPosts.slice(3).map((post) => ({
      id: String(post.id),
      title: decodeHtmlEntities(post.title.rendered),
      date: formatDate(post.date),
      imageSrc: getFeaturedImageUrl(post, "full") || "/blog/default-thumbnail.jpg",
      href: `/blogs/${post.slug}`,
    }));
  }

  if (latestResult.status === "fulfilled") {
    const { data: latestPosts } = latestResult.value;
    if (latestPosts.length > 0) {
      recentArticles = latestPosts.map((post) => ({
        id: String(post.id),
        title: decodeHtmlEntities(post.title.rendered),
        date: formatDate(post.date),
        imageSrc: getFeaturedImageUrl(post, "full") || "/blog/default-thumbnail.jpg",
        href: `/blogs/${post.slug}`,
      }));
    }
  } else {
    console.error("Error fetching latest WordPress posts:", latestResult.reason);
  }

  // Build social links array for structured data. sameAs is the dominant
  // person-entity signal — include every known profile (not email).
  const sameAsLinks: string[] = [
    author.socialLinks?.linkedin,
    author.socialLinks?.twitter,
    author.socialLinks?.instagram,
    author.socialLinks?.youtube,
    author.socialLinks?.facebook,
    author.socialLinks?.website,
    author.socialLinks?.github,
  ].filter((u): u is string => Boolean(u));

  const canonicalUrl = authorUrl(author.slug);
  const blogUrl = `${SITE_URL}/blogs`;

  // Organization structured data (standalone for Identity Schema)
  const organizationJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": "https://www.sparkonomy.com/#organization",
    name: "Sparkonomy",
    url: "https://www.sparkonomy.com",
    logo: {
      "@type": "ImageObject",
      url: "https://www.sparkonomy.com/sparkonomy.png",
      width: 512,
      height: 512,
    },
    sameAs: [
      "https://twitter.com/sparkonomy",
      "https://www.linkedin.com/company/sparkonomy",
      "https://www.instagram.com/sparkonomy",
    ],
  };

  // Freshness + richer entity facts mapped from data we already hold.
  const isoLastUpdated = toIsoDate(author.lastUpdated);
  const alumniOf = author.previousCompanies.map((c) => ({
    "@type": "Organization",
    name: c.name,
  }));
  const awards = author.trustItems
    .filter((t) => t.icon === "awards")
    .map((t) => t.value);

  // Certifications → EducationalOccupationalCredential nodes. hasCredential is a
  // strong E-E-A-T signal tying verifiable credentials to the Person entity.
  const credentials = (author.certifications ?? []).map((c) => ({
    "@type": "EducationalOccupationalCredential",
    name: c.name,
    credentialCategory: "certification",
    ...(c.issuer
      ? { recognizedBy: { "@type": "Organization", name: c.issuer } }
      : {}),
  }));

  // knowsAbout merges the expertise tags with the more granular specializations
  // (deduped, order-preserving) for a richer topical signal.
  const knowsAbout = Array.from(
    new Set([...author.areasOfExpertise, ...(author.specializations ?? [])]),
  );

  // Person entity — nested as the ProfilePage's mainEntity, so it carries no
  // own @context.
  const personEntity = {
    "@type": "Person",
    "@id": `${canonicalUrl}#person`,
    name: author.name,
    url: canonicalUrl,
    mainEntityOfPage: canonicalUrl,
    image: absoluteUrl(author.avatarUrl) || "https://www.sparkonomy.com/sparkonomy.png",
    description: author.metaDescription || author.shortBio || `${author.name} is a writer at Sparkonomy`,
    jobTitle: author.role,
    hasOccupation: {
      "@type": "Occupation",
      name: author.role,
    },
    worksFor: {
      "@id": "https://www.sparkonomy.com/#organization",
    },
    ...(alumniOf.length ? { alumniOf } : {}),
    ...(awards.length ? { award: awards } : {}),
    ...(author.contactEmail ? { email: author.contactEmail } : {}),
    sameAs: sameAsLinks,
    knowsAbout,
    ...(credentials.length ? { hasCredential: credentials } : {}),
  };

  // ProfilePage wrapping the Person — Google's recommended shape for author
  // pages; helps establish the author as an entity in the Knowledge Graph.
  const profilePageJsonLd = {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    "@id": canonicalUrl,
    url: canonicalUrl,
    name: author.metaTitle || `${author.name} — ${author.role}`,
    ...(isoLastUpdated ? { dateModified: isoLastUpdated } : {}),
    mainEntity: personEntity,
  };

  // Breadcrumb structured data (Home › Blog › Author)
  const breadcrumbItems = [
    { name: "Home", item: SITE_URL },
    { name: "Blog", item: blogUrl },
    { name: author.name, item: canonicalUrl },
  ];

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: breadcrumbItems.map((b, idx) => ({
      "@type": "ListItem",
      position: idx + 1,
      name: b.name,
      item: b.item,
    })),
  };

  // Authored-works ItemList — an explicit machine link from this author entity
  // to the articles they wrote (each item references the Person @id), so search
  // engines and LLMs can answer "what has this author written".
  const authoredArticlesJsonLd =
    authorPosts.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "ItemList",
          name: `Articles by ${author.name}`,
          numberOfItems: authorPosts.length,
          itemListElement: authorPosts.slice(0, 10).map((post, idx) => ({
            "@type": "ListItem",
            position: idx + 1,
            item: {
              "@type": "BlogPosting",
              "@id": `${SITE_URL}/blogs/${post.slug}`,
              url: `${SITE_URL}/blogs/${post.slug}`,
              headline: decodeHtmlEntities(post.title.rendered),
              author: { "@id": `${canonicalUrl}#person` },
            },
          })),
        }
      : null;

  return (
    <>
      {/* Organization Structured Data (Identity Schema) */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
      />

      {/* Author Structured Data (ProfilePage → Person) */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(profilePageJsonLd) }}
      />

      {/* Breadcrumb Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      {/* Authored Articles ItemList (entity → works machine link) */}
      {authoredArticlesJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(authoredArticlesJsonLd) }}
        />
      )}

      <AuthorPageTemplate
        author={author}
        featuredArticles={featuredArticles}
        recentArticles={recentArticles}
      />
    </>
  );
}
