import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { getPostBySlug, getFeaturedImageUrl, getAuthorName, formatDate, stripHtml, getReadingTime, getPosts } from "@/lib/wordpress-improved";
import { extractHeadings, addHeadingIds, extractFAQs, extractVideos, removeWordPressTOC } from "@/lib/content-processor";
import ShareButtons from "@/components/blog/ShareButtons";
import Breadcrumb from "@/components/blog/Breadcrumb";
import TOCEnhancer from "@/components/blog/TOCEnhancer";
import AuthorCard from "@/components/blog/AuthorCard";
import RelatedPosts from "@/components/blog/RelatedPosts";
import QuoteAuthorInjector from "@/components/blog/QuoteAuthorInjector";
import FAQAccordionEnhancer from "@/components/blog/FAQAccordionEnhancer";
import ProTipEnhancer from "@/components/blog/ProTipEnhancer";
import QuoteCleanerEnhancer from "@/components/blog/QuoteCleanerEnhancer";
import ListMergerEnhancer from "@/components/blog/ListMergerEnhancer";
import PromoBannerInjector from "@/components/blog/PromoBannerInjector";
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
  const author = getAuthorName(post);
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
    authors: [{ name: author, url: post._embedded?.author?.[0]?.link }],
    creator: author,
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
      authors: [author],
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
      "article:author": author,
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
  const author = getAuthorName(post);
  const publishDate = formatDate(post.date);
  const readingTime = getReadingTime(post);

  // Get WordPress author slug and find matching local author
  const wpAuthorSlug = post._embedded?.author?.[0]?.slug || "";
  const authorPageSlug = getAuthorPageSlug(wpAuthorSlug);
  const localAuthor = getAuthorByWordPressSlug(wpAuthorSlug);

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
    author: {
      "@type": "Person",
      name: author,
      url: post._embedded?.author?.[0]?.link || "https://sparkonomy.com",
      jobTitle: "Technical Writer",
      worksFor: {
        "@type": "Organization",
        name: "Sparkonomy",
      },
    },
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

  // Author/Person structured data
  const authorJsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: author,
    url: post._embedded?.author?.[0]?.link || "https://sparkonomy.com",
    image: post._embedded?.author?.[0]?.avatar_urls?.["96"] || "",
    jobTitle: "Technical Writer",
    worksFor: {
      "@type": "Organization",
      name: "Sparkonomy",
      url: "https://sparkonomy.com",
    },
    sameAs: [
      "https://www.linkedin.com",
      "https://www.instagram.com",
      "https://www.youtube.com",
      "https://twitter.com",
    ],
  };

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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(authorJsonLd) }}
      />

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
            <div className="flex items-center gap-2 text-lg md:text-xl lg:text-2xl text-[#6B7280] mb-4">
              <span>{publishDate}</span>
              <span>·</span>
              <span>{readingTime} min read</span>
            </div>

            {/* Author Section - Matching bottom AuthorCard style */}
            <div className="bg-[#F2F2F2] rounded-lg p-4 md:p-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 md:gap-6">
                {/* Author Info */}
                <div className="flex items-center gap-4">
                  {(localAuthor?.avatarUrl || post._embedded?.author?.[0]?.avatar_urls?.["96"]) && (
                    <div className="relative w-14 h-14 md:w-16 md:h-16 rounded-full overflow-hidden flex-shrink-0">
                      <Image
                        src={localAuthor?.avatarUrl || post._embedded?.author?.[0]?.avatar_urls?.["96"] || ""}
                        alt={author}
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                  <div>
                    <Link
                      href={`/blogs/author/${authorPageSlug}`}
                      className="text-base font-medium text-[#6B7280] hover:text-purple-600 transition-colors"
                    >
                      {localAuthor?.name || author}
                    </Link>
                    <p className="text-xs text-[#999999]">
                      {localAuthor?.role || "Technical Writer | Sparkonomy"}
                    </p>
                    {/* Social Links */}
                    <div className="flex items-center gap-3 mt-2">
                      {(localAuthor?.socialLinks?.linkedin) && (
                        <a
                          href={localAuthor.socialLinks.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-gray-400 hover:text-gray-600 transition-colors"
                          aria-label="LinkedIn"
                        >
                          <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                          </svg>
                        </a>
                      )}
                      {(localAuthor?.socialLinks?.twitter) && (
                        <a
                          href={localAuthor.socialLinks.twitter}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-gray-400 hover:text-gray-600 transition-colors"
                          aria-label="Twitter"
                        >
                          <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                          </svg>
                        </a>
                      )}
                    </div>
                  </div>
                </div>

                {/* Previous Companies - Large Desktop */}
                {localAuthor?.previousCompanies && localAuthor.previousCompanies.length > 0 && (
                  <div className="hidden lg:flex flex-col items-end">
                    <p className="text-sm text-[#6B7280] mb-2">{localAuthor.previousCompaniesLabel || "Previously at"}</p>
                    <div className="flex items-center gap-4">
                      {localAuthor.previousCompanies.slice(0, 3).map((company, index) => (
                        company.logo ? (
                          <Image
                            key={index}
                            src={company.logo}
                            alt={company.name}
                            width={100}
                            height={32}
                            className="h-6 w-auto object-contain"
                          />
                        ) : (
                          <span key={index} className="text-lg md:text-xl font-bold text-gray-900">
                            {company.name}
                          </span>
                        )
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Previous Companies - Mobile & Tablet */}
              {localAuthor?.previousCompanies && localAuthor.previousCompanies.length > 0 && (
                <div className="lg:hidden flex flex-col items-end mt-4 w-full">
                  <p className="text-sm text-[#6B7280] mb-2">{localAuthor.previousCompaniesLabel || "Previously at"}</p>
                  <div className="grid grid-cols-3 gap-3 w-full">
                    {localAuthor.previousCompanies.slice(0, 3).map((company, index) => (
                      <div key={index} className="flex items-center justify-center">
                        {company.logo ? (
                          <Image
                            src={company.logo}
                            alt={company.name}
                            width={80}
                            height={24}
                            className="h-4 w-auto object-contain"
                          />
                        ) : (
                          <span className="text-sm font-bold text-gray-900">
                            {company.name}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
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
            <div
              className="wordpress-content"
              dangerouslySetInnerHTML={{ __html: processedContent }}
            />
            <QuoteAuthorInjector
              authorName={author}
              authorRole="Technical Writer | Sparkonomy"
              authorAvatar={post._embedded?.author?.[0]?.avatar_urls?.["96"] || ""}
            />
          </div>

          {/* Author Bio */}
          <div className="px-4 md:px-[50px] lg:px-[130px] relative z-10">
            <AuthorCard
              name={author}
              role={localAuthor?.role || "Technical Writer | Sparkonomy"}
              bio={localAuthor?.shortBio || "We are building AI agents for the agentic web, and our main goal is to build trust in AI agents for handling business operations. Being able to define precise schemas and trust the output is key to our production systems."}
              avatarUrl={localAuthor?.avatarUrl || post._embedded?.author?.[0]?.avatar_urls?.["96"] || ""}
              authorSlug={authorPageSlug}
              previousCompanies={localAuthor?.previousCompanies?.map(c => c.name) || []}
              socialLinks={localAuthor?.socialLinks || {
                linkedin: "https://linkedin.com",
                instagram: "https://instagram.com",
                youtube: "https://youtube.com",
              }}
            />
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
