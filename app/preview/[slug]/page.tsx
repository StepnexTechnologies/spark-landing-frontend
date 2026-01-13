import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { getDraftPostById, getFeaturedImageUrl, getAuthorName, formatDate, stripHtml, getReadingTime, getDraftPosts } from "@/lib/wordpress-improved";
import { extractHeadings, addHeadingIds, removeWordPressTOC } from "@/lib/content-processor";
import Breadcrumb from "@/components/blog/Breadcrumb";
import TOCEnhancer from "@/components/blog/TOCEnhancer";
import AuthorCard from "@/components/blog/AuthorCard";
import RelatedPosts from "@/components/blog/RelatedPosts";
import QuoteAuthorInjector from "@/components/blog/QuoteAuthorInjector";
import FAQAccordionEnhancer from "@/components/blog/FAQAccordionEnhancer";
import ProTipEnhancer from "@/components/blog/ProTipEnhancer";
import QuoteCleanerEnhancer from "@/components/blog/QuoteCleanerEnhancer";
import ListMergerEnhancer from "@/components/blog/ListMergerEnhancer";
import { getAuthorPageSlug, getAuthorByWordPressSlug } from "@/data/authors";
import "../../blogs/wordpress-content.css";

interface PreviewPostPageProps {
  params: Promise<{
    slug: string;
  }>;
}

// No indexing for preview pages
export async function generateMetadata({ params }: PreviewPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const postId = parseInt(slug, 10);
  const post = await getDraftPostById(postId);

  if (!post) {
    return {
      title: "Draft Not Found",
      description: "The requested draft post could not be found.",
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const title = `[DRAFT] ${stripHtml(post.title.rendered)}`;

  return {
    title: title,
    description: "Draft preview - not for public viewing",
    robots: {
      index: false,
      follow: false,
      googleBot: {
        index: false,
        follow: false,
      },
    },
  };
}

export default async function PreviewPostPage({ params }: PreviewPostPageProps) {
  const { slug } = await params;
  const postId = parseInt(slug, 10);
  const post = await getDraftPostById(postId);

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

  // Fetch related draft posts
  const { data: allPosts } = await getDraftPosts(1, 4);
  const relatedPosts = allPosts
    .filter((p) => p.id !== postId)
    .slice(0, 3)
    .map((p) => ({
      slug: `/preview/${p.id}`,
      title: stripHtml(p.title.rendered),
      excerpt: stripHtml(p.excerpt.rendered).substring(0, 150),
      featuredImage: getFeaturedImageUrl(p) || "/sparkonomy.png",
      date: formatDate(p.date),
    }));

  return (
    <div className="min-h-screen bg-white">
      <link
        rel="stylesheet"
        href="https://blog.sparkonomy.com/wp-includes/css/dist/block-library/style.min.css"
      />
      <link
        rel="stylesheet"
        href="https://blog.sparkonomy.com/wp-includes/css/dist/block-library/theme.min.css"
      />

      <main className="px-0 md:px-10 lg:px-[90px] py-5 lg:py-6">
        <article className="flex flex-col gap-4 md:gap-6 lg:gap-10">
          {/* Breadcrumb Navigation */}
          <div className="px-4 md:px-0 ">
            <Breadcrumb
              items={[
                { label: "Preview", href: "/preview" },
                ...(categoryName
                  ? [{ label: categoryName }]
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
          {relatedPosts.length > 0 && (
            <div className="relative z-0">
              <RelatedPosts posts={relatedPosts} />
            </div>
          )}

        </article>
      </main>
    </div>
  );
}
