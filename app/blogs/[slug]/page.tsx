import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import { getPostBySlug, getFeaturedImageUrl, getAuthorName, formatDate, stripHtml, getReadingTime, getPosts } from "@/lib/wordpress-improved";
import { removeWordPressTOC, extractHeadings, addHeadingIds, removeFAQSection } from "@/lib/content-processor";
import ShareButtons from "@/components/blog/ShareButtons";
import Breadcrumb from "@/components/blog/Breadcrumb";
import CustomTableOfContents from "@/components/blog/CustomTableOfContents";
import AuthorCard from "@/components/blog/AuthorCard";
import RelatedPosts from "@/components/blog/RelatedPosts";
import QuoteAuthorInjector from "@/components/blog/QuoteAuthorInjector";
import FAQSection from "@/components/blog/FAQSection";
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

  return {
    metadataBase: new URL("https://www.sparkonomy.com/"),
    title: seoTitle,
    description: seoDescription,
    keywords: post._embedded?.["wp:term"]?.[1]?.map((tag) => tag.name) || [],
    authors: [{ name: author }],
    creator: author,
    publisher: "Sparkonomy",
    alternates: {
      canonical: canonical,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
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

  // Process content: extract headings FIRST, then remove WordPress TOC and FAQ
  const headings = extractHeadings(post.content.rendered);
  let cleanedContent = removeWordPressTOC(post.content.rendered);
  cleanedContent = removeFAQSection(cleanedContent);
  const processedContent = addHeadingIds(cleanedContent, headings);

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

  // Generate JSON-LD structured data for SEO
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: stripHtml(post.title.rendered),
    description: stripHtml(post.excerpt.rendered),
    image: featuredImage || "https://sparkonomy.com/sparkonomy.png",
    datePublished: post.date,
    dateModified: post.modified,
    author: {
      "@type": "Person",
      name: author,
      url: post._embedded?.author?.[0]?.link,
    },
    publisher: {
      "@type": "Organization",
      name: "Sparkonomy",
      logo: {
        "@type": "ImageObject",
        url: "https://sparkonomy.com/sparkonomy.png",
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `https://sparkonomy.com/blogs/${post.slug}`,
    },
  };

  return (
    <>
     
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />


      <link
        rel="stylesheet"
        href="https://blog.sparkonomy.com/wp-includes/css/dist/block-library/style.min.css"
      />
      <link
        rel="stylesheet"
        href="https://blog.sparkonomy.com/wp-includes/css/dist/block-library/theme.min.css"
      />

      <main className="min-h-screen px-4 md:px-10 lg:px-[90px] py-5 lg:py-6 bg-white">
        <article className="flex flex-col gap-4 md:gap-6 lg:gap-10">
          {/* Breadcrumb Navigation */}
          <div className=" ">
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
          <div className="px-0 md:px-[50px] lg:px-[130px]">
            <h1
              className="text-2xl md:text-3xl lg:text-[40px] font-bold text-[#6B7280] leading-tight"
              dangerouslySetInnerHTML={{ __html: post.title.rendered }}
            />
          </div>

          {/* Meta Information */}
          <div className="px-0 md:px-[50px] lg:px-[130px]">
            <div className="flex items-center gap-2 text-lg md:text-xl lg:text-2xl text-[#6B7280]">
              <span>{publishDate}</span>
              <span>·</span>
              <span>{readingTime} min read</span>
            </div>

            {/* Author Section with Social Links */}
            <div className="flex items-center gap-1  md:gap-6 lg:gap-10 py-3 border-b border-t border-[#F2F2F2]">
              {post._embedded?.author?.[0]?.avatar_urls?.["96"] && (
                <div className="relative w-12 h-12  md:w-16 md:h-16 rounded-full overflow-hidden flex-shrink-0">
                  <Image
                    src={post._embedded.author[0].avatar_urls["96"]}
                    alt={author}
                    fill
                    className="object-cover"
                  /> 
                </div>
              )}
              <div className="flex-1">
                <p className="text-base md:text-xl lg:text-2xl font-semibold text-[#6B7280]">{author}</p>
                <p className="text-xs md:text-sm text-[#415CE7] font-normal italic">
                  Technical Writer | Sparkonomy
                </p>
              </div>
              {/* Social Links */}
              <div className="flex items-center gap-3">
                <a
                  href="https://www.linkedin.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#6B7280] hover:text-purple-600 transition-colors"
                  aria-label="LinkedIn"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </a>
                <a
                  href="https://www.instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#6B7280] hover:text-purple-600 transition-colors"
                  aria-label="Instagram"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd"/>
                  </svg>
                </a>
                <a
                  href="https://www.youtube.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#6B7280] hover:text-purple-600 transition-colors"
                  aria-label="YouTube"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M19.812 5.418c.861.23 1.538.907 1.768 1.768C21.998 8.746 22 12 22 12s0 3.255-.418 4.814a2.504 2.504 0 0 1-1.768 1.768c-1.56.419-7.814.419-7.814.419s-6.255 0-7.814-.419a2.505 2.505 0 0 1-1.768-1.768C2 15.255 2 12 2 12s0-3.255.417-4.814a2.507 2.507 0 0 1 1.768-1.768C5.744 5 11.998 5 11.998 5s6.255 0 7.814.418ZM15.194 12 10 15V9l5.194 3Z" clipRule="evenodd"/>
                  </svg>
                </a>
                <a
                  href="https://twitter.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#6B7280] hover:text-purple-600 transition-colors"
                  aria-label="Twitter"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>

          {/* Featured Image */}
          {featuredImage && (
            <div className="">
              <div className="relative w-full aspect-video rounded-2xl overflow-hidden">
                <Image
                  src={featuredImage}
                  alt={stripHtml(post.title.rendered)}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
              <p className="text-sm text-gray-500 italic">
                Fig: {stripHtml(post.excerpt.rendered).substring(0, 100)}...
              </p>
            </div>
          )}

          {/* Table of Contents */}
          {headings.length > 0 && (
            <div className="px-0 md:px-[50px] lg:px-[130px]">
              <CustomTableOfContents headings={headings} />
            </div>
          )}

          {/* Article Content */}
          <div className="px-0 md:px-[50px] lg:px-[130px]">
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

          {/* FAQ Section */}
          <FAQSection />

          {/* Author Bio */}
          <div className="px-0 md:px-[50px] lg:px-[130px]">
            <AuthorCard
              name={author}
              role="Technical Writer | Sparkonomy"
              bio="We are building AI agents for the agentic web, and our main goal is to build trust in AI agents for handling business operations. Being able to define precise schemas and trust the output is key to our production systems. Structured Outputs have reduced API calls by up to 6x in some workflows and completely eliminated the broken JSON responses that used to require extra validation checks."
              avatarUrl={post._embedded?.author?.[0]?.avatar_urls?.["96"] || ""}
              previousCompanies={["Google", "Netflix", "Spotify"]}
              socialLinks={{
                linkedin: "https://linkedin.com",
                instagram: "https://instagram.com",
                youtube: "https://youtube.com",
              }}
            />
          </div>

          {/* Related Posts */}
          <div className="">
            <RelatedPosts posts={relatedPosts} />
          </div>
          
        </article>
      </main>
    </>
  );
}
