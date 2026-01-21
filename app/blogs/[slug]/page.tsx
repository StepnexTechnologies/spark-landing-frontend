import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { getPostBySlug, getFeaturedImageUrl, getAuthorName, getAuthorNames, getPostAuthors, formatDate, stripHtml, getReadingTime, getPosts } from "@/lib/wordpress-improved";
import { extractHeadings, addHeadingIds, extractFAQs, extractVideos, removeWordPressTOC } from "@/lib/content-processor";
import ShareButtons from "@/components/blog/ShareButtons";
import Breadcrumb from "@/components/blog/Breadcrumb";
import BlogLanguageSwitcher from "@/components/blog/BlogLanguageSwitcher";
import TOCEnhancer from "@/components/blog/TOCEnhancer";
import AuthorCard from "@/components/blog/AuthorCard";
import RelatedPosts from "@/components/blog/RelatedPosts";
import QuoteAuthorInjector from "@/components/blog/QuoteAuthorInjector";
import FAQAccordionEnhancer from "@/components/blog/FAQAccordionEnhancer";
import ProTipEnhancer from "@/components/blog/ProTipEnhancer";
import QuoteCleanerEnhancer from "@/components/blog/QuoteCleanerEnhancer";
import ListMergerEnhancer from "@/components/blog/ListMergerEnhancer";
import PromoBannerInjector from "@/components/blog/PromoBannerInjector";
import SourcesListEnhancer from "@/components/blog/SourcesListEnhancer";
import KeyTakeawaysEnhancer from "@/components/blog/KeyTakeawaysEnhancer";
import NewsletterSection from "@/components/blog/NewsletterSection";
import { getAuthorPageSlug, getAuthorByWordPressSlug } from "@/data/authors";
import "../wordpress-content.css";

interface BlogPostPageProps {
  params: Promise<{
    slug: string;
  }>;
}

// Generate dynamic metadata for SEO
export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    return {
      title: "Post Not Found",
      description: "The requested blog post could not be found.",
    };
  }

  const title = stripHtml(post.title.rendered);
  const description = stripHtml(post.excerpt.rendered).substring(0, 160);
  const featuredImage = getFeaturedImageUrl(post, "large");
  const authors = getPostAuthors(post);
  const authorNames = getAuthorNames(post);
  const publishedTime = post.date;
  const modifiedTime = post.modified;
  const url = `https://sparkonomy.com/blogs/${post.slug}`;

  // Use Yoast SEO data if available, otherwise fall back to defaults
  const seoTitle = post.yoast_head_json?.title || title;
  const seoDescription = post.yoast_head_json?.description || description;
  const canonical = post.yoast_head_json?.canonical || url;
  const ogImage = post.yoast_head_json?.og_image?.[0]?.url || featuredImage || "https://sparkonomy.com/sparkonomy.png";

  // Extract categories and tags for better SEO
  const categories = post._embedded?.["wp:term"]?.[0]?.map((cat) => cat.name) || [];
  const tags = post._embedded?.["wp:term"]?.[1]?.map((tag) => tag.name) || [];

  return {
    metadataBase: new URL("https://www.sparkonomy.com/"),
    title: seoTitle,
    description: seoDescription,
    keywords: [...tags, ...categories, "Sparkonomy", "creator economy", "content monetization"],
    authors: authors.map(a => ({ name: a.name, url: a.link })),
    creator: authorNames,
    publisher: "Sparkonomy",
    category: categories[0] || "Blog",
    alternates: {
      canonical: canonical,
    },
    robots: {
      index: false,
      follow: false,
      googleBot: {
        index: false,
        follow: false,
      },
    },
    openGraph: {
      siteName: "Sparkonomy",
      url: url,
      title: post.yoast_head_json?.og_title || seoTitle,
      description: post.yoast_head_json?.og_description || seoDescription,
      type: "article",
      publishedTime: publishedTime,
      modifiedTime: modifiedTime,
      authors: authors.map(a => a.name),
      tags: tags,
      section: categories[0] || "Blog",
      images: [
        {
          url: ogImage,
          width: post.yoast_head_json?.og_image?.[0]?.width || 1200,
          height: post.yoast_head_json?.og_image?.[0]?.height || 630,
          alt: title,
        },
      ],
      locale: "en_US",
    },
    twitter: {
      card: (post.yoast_head_json?.twitter_card as "summary_large_image" | "summary") || "summary_large_image",
      title: post.yoast_head_json?.twitter_title || seoTitle,
      description: post.yoast_head_json?.twitter_description || seoDescription,
      images: [post.yoast_head_json?.twitter_image || ogImage],
      creator: post.yoast_head_json?.twitter_creator || "@sparkonomy",
      site: post.yoast_head_json?.twitter_site || "@sparkonomy",
    },
    other: {
      "article:published_time": publishedTime,
      "article:modified_time": modifiedTime,
      "article:author": authorNames,
      "article:section": categories[0] || "Blog",
      "article:tag": tags.join(", "),
    },
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const featuredImage = getFeaturedImageUrl(post, "large");
  const postAuthors = getPostAuthors(post);
  const authorNames = getAuthorNames(post);
  const publishDate = formatDate(post.date);
  const readingTime = getReadingTime(post);

  // Get local author data for each WordPress author
  const authorsWithLocalData = postAuthors.map(wpAuthor => {
    const localAuthor = getAuthorByWordPressSlug(wpAuthor.slug);
    const authorPageSlug = getAuthorPageSlug(wpAuthor.slug);
    return {
      wpAuthor,
      localAuthor,
      authorPageSlug,
      name: localAuthor?.name || wpAuthor.name,
      role: localAuthor?.role || "Technical Writer | Sparkonomy",
      avatarUrl: localAuthor?.avatarUrl || wpAuthor.avatar_urls?.["96"] || "",
      shortBio: localAuthor?.shortBio || "",
      socialLinks: localAuthor?.socialLinks || {},
      previousCompanies: localAuthor?.previousCompanies || [],
      previousCompaniesLabel: localAuthor?.previousCompaniesLabel || "Previously at",
    };
  });

  // For backward compatibility, get first author data
  const primaryAuthor = authorsWithLocalData[0];
  const author = primaryAuthor?.name || "Unknown";

  // Process content: extract headings for IDs, add toc-list class to TOC
  const headings = extractHeadings(post.content.rendered);
  const contentWithTocClass = removeWordPressTOC(post.content.rendered);
  const contentWithIds = addHeadingIds(contentWithTocClass, headings);
  const processedContent = contentWithIds;

  // Get category for breadcrumb
  const categoryName = post._embedded?.["wp:term"]?.[0]?.[0]?.name || "";
  const categorySlug = post._embedded?.["wp:term"]?.[0]?.[0]?.slug || "";

  // Fetch related posts (3 most recent posts from same category or general)
  const { data: allPosts } = await getPosts(1, 4);
  const relatedPosts = allPosts
    .filter((p) => p.slug !== slug)
    .slice(0, 3)
    .map((p) => ({
      slug: p.slug,
      title: stripHtml(p.title.rendered),
      excerpt: stripHtml(p.excerpt.rendered).substring(0, 150),
      featuredImage: getFeaturedImageUrl(p) || "/sparkonomy.png",
      date: formatDate(p.date),
    }));

  // Extract categories and tags for JSON-LD
  const categories = post._embedded?.["wp:term"]?.[0]?.map((cat) => cat.name) || [];
  const tags = post._embedded?.["wp:term"]?.[1]?.map((tag) => tag.name) || [];

  // Extract FAQs and Videos for structured data
  const faqItems = extractFAQs(post.content.rendered);
  const videoItems = extractVideos(post.content.rendered, stripHtml(post.title.rendered), post.date);

  // Generate comprehensive JSON-LD structured data for SEO
  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: stripHtml(post.title.rendered),
    description: stripHtml(post.excerpt.rendered),
    image: {
      "@type": "ImageObject",
      url: featuredImage || "https://sparkonomy.com/sparkonomy.png",
      width: 1200,
      height: 630,
    },
    datePublished: post.date,
    dateModified: post.modified,
    author: authorsWithLocalData.length === 1
      ? {
          "@type": "Person",
          name: authorsWithLocalData[0].name,
          url: authorsWithLocalData[0].wpAuthor.link || "https://sparkonomy.com",
          jobTitle: authorsWithLocalData[0].role,
          worksFor: {
            "@type": "Organization",
            name: "Sparkonomy",
          },
        }
      : authorsWithLocalData.map(authorData => ({
          "@type": "Person",
          name: authorData.name,
          url: authorData.wpAuthor.link || "https://sparkonomy.com",
          jobTitle: authorData.role,
          worksFor: {
            "@type": "Organization",
            name: "Sparkonomy",
          },
        })),
    publisher: {
      "@type": "Organization",
      name: "Sparkonomy",
      url: "https://sparkonomy.com",
      logo: {
        "@type": "ImageObject",
        url: "https://sparkonomy.com/sparkonomy.png",
        width: 600,
        height: 60,
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `https://sparkonomy.com/blogs/${post.slug}`,
    },
    articleSection: categories[0] || "Blog",
    keywords: tags.join(", "),
    wordCount: post.content.rendered.split(/\s+/).length,
    timeRequired: `PT${readingTime}M`,
    inLanguage: "en-US",
  };

  // Breadcrumb structured data
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://sparkonomy.com",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Blog",
        item: "https://sparkonomy.com/blogs",
      },
      ...(categoryName
        ? [
            {
              "@type": "ListItem",
              position: 3,
              name: categoryName,
              item: `https://sparkonomy.com/blogs/${categorySlug}`,
            },
            {
              "@type": "ListItem",
              position: 4,
              name: stripHtml(post.title.rendered),
              item: `https://sparkonomy.com/blogs/${post.slug}`,
            },
          ]
        : [
            {
              "@type": "ListItem",
              position: 3,
              name: stripHtml(post.title.rendered),
              item: `https://sparkonomy.com/blogs/${post.slug}`,
            },
          ]),
    ],
  };

  // Author/Person structured data (array for multiple authors)
  const authorJsonLd = authorsWithLocalData.map(authorData => ({
    "@context": "https://schema.org",
    "@type": "Person",
    name: authorData.name,
    url: authorData.wpAuthor.link || "https://sparkonomy.com",
    image: authorData.avatarUrl || "",
    jobTitle: authorData.role,
    worksFor: {
      "@type": "Organization",
      name: "Sparkonomy",
      url: "https://sparkonomy.com",
    },
    sameAs: [
      authorData.socialLinks?.linkedin,
      authorData.socialLinks?.instagram,
      authorData.socialLinks?.youtube,
      authorData.socialLinks?.twitter,
    ].filter(Boolean),
  }));

  // FAQ structured data (if FAQs exist)
  const faqJsonLd = faqItems.length > 0 ? {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqItems.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  } : null;

  // Video structured data (if videos exist)
  const videoJsonLd = videoItems.length > 0 ? videoItems.map((video) => ({
    "@context": "https://schema.org",
    "@type": "VideoObject",
    name: video.name,
    description: video.description,
    thumbnailUrl: video.thumbnailUrl,
    uploadDate: video.uploadDate,
    contentUrl: video.url,
    embedUrl: video.embedUrl,
  })) : null;

  return (
    <>
      {/* Article Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />

      {/* Breadcrumb Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      {/* Author/Person Structured Data */}
      {authorJsonLd.map((authorLd, index) => (
        <script
          key={`author-${index}`}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(authorLd) }}
        />
      ))}

      {/* FAQ Structured Data (if FAQs exist) */}
      {faqJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
        />
      )}

      {/* Video Structured Data (if videos exist) */}
      {videoJsonLd && videoJsonLd.map((video, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(video) }}
        />
      ))}

      <link
        rel="stylesheet"
        href="https://blog.sparkonomy.com/wp-includes/css/dist/block-library/style.min.css"
      />
      <link
        rel="stylesheet"
        href="https://blog.sparkonomy.com/wp-includes/css/dist/block-library/theme.min.css"
      />

      <main className="min-h-screen px-0 md:px-10 lg:px-[90px] py-5 lg:py-6 bg-white">
        <article className="flex flex-col gap-4 md:gap-6 lg:gap-10">
          {/* Breadcrumb Navigation */}
          <div className="px-4 md:px-0 ">
            <Breadcrumb
              items={[
                { label: "Blog", href: "/blogs" },
                ...(categoryName
                  ? [{ label: categoryName, href: `/blogs/${categorySlug}` }]
                  : []),
                { label: stripHtml(post.title.rendered).substring(0, 50) + "..." },
              ]}
            />
          </div>

          {/* Title */}
          <div className="px-4 md:px-[50px] lg:px-[130px]">
            <h1
              className="text-2xl md:text-3xl lg:text-[40px] font-bold text-[#6B7280] leading-tight"
              dangerouslySetInnerHTML={{ __html: post.title.rendered }}
            />
          </div>

          {/* Meta Information */}
          <div className="px-4 md:px-[30px] xl:px-[130px]">
            <div className="flex items-center gap-2 text-[14px] md:text-[20px] lg:text-[24px] text-[#6B7280] mb-4">
              <span>{publishDate}</span>
              <span>·</span>
              <span>{readingTime} min read</span>
              <Suspense fallback={<span className="text-sm">Loading...</span>}>
                <BlogLanguageSwitcher />
              </Suspense>
            </div>

            {/* Author Section - Multiple Authors Support */}
            <div className="border-t border-b border-gray-200 py-2 md:py-5">
              <div className="flex flex-col gap-4">
                {authorsWithLocalData.map((authorData, index) => (
                  <div key={index} className={`flex items-center justify-between ${index > 0 ? 'pt-4 border-t border-gray-100' : ''}`}>
                    {/* Author Info */}
                    <div className="flex items-center gap-4">
                      {authorData.avatarUrl && (
                        <div className="relative w-12 h-12 md:w-16 md:h-16 rounded-full overflow-hidden flex-shrink-0">
                          <Image
                            src={authorData.avatarUrl}
                            alt={authorData.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                      )}
                      <div>
                        <Link
                          href={`/blogs/author/${authorData.authorPageSlug}`}
                          className="text-base md:text-2xl font-semibold text-[#6B7280] hover:text-purple-600 transition-colors"
                        >
                          {authorData.name}
                        </Link>
                        <p className="text-xs md:text-sm font-normal text-[#999999]">
                          {authorData.role}
                        </p>
                      </div>
                    </div>

                    {/* Social Links */}
                    <div className="flex items-center gap-4">
                      {authorData.socialLinks?.facebook && (
                        <a
                          href={authorData.socialLinks.facebook}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-gray-500 hover:text-gray-700 transition-colors"
                          aria-label="Facebook"
                        >
                          <svg className="w-[18px] h-[18px] md:w-6 md:h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                            <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd"/>
                          </svg>
                        </a>
                      )}
                      {authorData.socialLinks?.instagram && (
                        <a
                          href={authorData.socialLinks.instagram}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-gray-500 hover:text-gray-700 transition-colors"
                          aria-label="Instagram"
                        >
                          <svg className="w-[18px] h-[18px] md:w-6 md:h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                            <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd"/>
                          </svg>
                        </a>
                      )}
                      {authorData.socialLinks?.linkedin && (
                        <a
                          href={authorData.socialLinks.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-gray-500 hover:text-gray-700 transition-colors"
                          aria-label="LinkedIn"
                        >
                          <svg className="w-[18px] h-[18px] md:w-6 md:h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                          </svg>
                        </a>
                      )}
                      {authorData.socialLinks?.twitter && (
                        <a
                          href={authorData.socialLinks.twitter}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-gray-500 hover:text-gray-700 transition-colors"
                          aria-label="Twitter"
                        >
                          <svg className="w-[18px] h-[18px] md:w-6 md:h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                          </svg>
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Featured Image */}
          {featuredImage && (
            <div className="px-4 md:px-0">
              <div className="relative w-full aspect-video rounded-2xl overflow-hidden">
                <Image
                  src={featuredImage}
                  alt={stripHtml(post.title.rendered)}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
              {/* Show caption from featured image only */}
              {(() => {
                const imageCaption = post._embedded?.["wp:featuredmedia"]?.[0]?.caption?.rendered;
                const hasImageCaption = imageCaption && stripHtml(imageCaption).trim() !== "";

                if (hasImageCaption) {
                  return (
                    <div
                      className="text-sm text-gray-500 italic mt-2 [&>p]:m-0"
                      dangerouslySetInnerHTML={{ __html: imageCaption }}
                    />
                  );
                }
                return null;
              })()}
            </div>
          )}

          {/* Article Content */}
          <div className="px-4 md:px-[50px] lg:px-[130px]">
            {/* TOC smooth scroll enhancement */}
            <TOCEnhancer />
            {/* FAQ accordion interactivity enhancement */}
            <FAQAccordionEnhancer />
            {/* Pro tip highlight enhancement */}
            <ProTipEnhancer />
            {/* Quote cleaner - removes broken quote marks */}
            <QuoteCleanerEnhancer />
            {/* Merge consecutive lists that WordPress split */}
            <ListMergerEnhancer />
            {/* Inject promotional banners around FAQ sections */}
            <PromoBannerInjector />
            {/* Style sources and references list */}
            <SourcesListEnhancer />
            {/* Key takeaways section styling */}
            <KeyTakeawaysEnhancer />
            <div
              className="wordpress-content"
              dangerouslySetInnerHTML={{ __html: processedContent }}
            />
            <QuoteAuthorInjector
              authorName={authorNames}
              authorRole={primaryAuthor?.role || "Technical Writer | Sparkonomy"}
              authorAvatar={primaryAuthor?.avatarUrl || ""}
            />
          </div>

          {/* Author Bio - Multiple Authors Support */}
          <div className="px-4 md:px-[50px] lg:px-[130px] relative z-10 flex flex-col gap-6">
            {authorsWithLocalData.map((authorData, index) => (
              <AuthorCard
                key={index}
                name={authorData.name}
                role={authorData.role}
                bio={authorData.shortBio || "We are building AI agents for the agentic web, and our main goal is to build trust in AI agents for handling business operations. Being able to define precise schemas and trust the output is key to our production systems."}
                avatarUrl={authorData.avatarUrl}
                authorSlug={authorData.authorPageSlug}
                previousCompanies={authorData.previousCompanies}
                previousCompaniesLabel={authorData.previousCompaniesLabel}
                socialLinks={authorData.socialLinks || {
                  linkedin: "https://linkedin.com",
                  instagram: "https://instagram.com",
                  youtube: "https://youtube.com",
                }}
              />
            ))}
          </div>

          {/* Related Posts */}
          <div className="relative z-0">
            <RelatedPosts posts={relatedPosts} />
          </div>

        </article>
      </main>

      {/* Newsletter Section */}
      <NewsletterSection />
    </>
  );
}
