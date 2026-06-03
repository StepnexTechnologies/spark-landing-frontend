import Image from "next/image";
import Link from "next/link";
import { AuthorEntry, FeaturedArticle, RecentArticle } from "@/data/authors";
import Breadcrumb from "@/components/blog/Breadcrumb";
import RelatedPosts from "@/components/blog/RelatedPosts";
import ImageWithFallback from "@/components/blog/ImageWithFallback";

// Trust icon image paths
const TrustIconPaths: Record<string, string> = {
  experience: "/authors/Logos/calendar.png",
  expertise: "/authors/Logos/expertise.png",
  verified: "/authors/Logos/verified.png",
  awards: "/authors/Logos/Awards.png",
  following: "/authors/Logos/following.png",
  featured: "/authors/Logos/Featured.png",
};

// Social Icons (decorative — the wrapping <a> carries the accessible label)
const SocialIcons = {
  twitter: (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  ),
  linkedin: (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  ),
  instagram: (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
    </svg>
  ),
  youtube: (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path fillRule="evenodd" d="M19.812 5.418c.861.23 1.538.907 1.768 1.768C21.998 8.746 22 12 22 12s0 3.255-.418 4.814a2.504 2.504 0 0 1-1.768 1.768c-1.56.419-7.814.419-7.814.419s-6.255 0-7.814-.419a2.505 2.505 0 0 1-1.768-1.768C2 15.255 2 12 2 12s0-3.255.417-4.814a2.507 2.507 0 0 1 1.768-1.768C5.744 5 11.998 5 11.998 5s6.255 0 7.814.418ZM15.194 12 10 15V9l5.194 3Z" clipRule="evenodd" />
    </svg>
  ),
  facebook: (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
    </svg>
  ),
  website: (
    <svg
      className="w-5 h-5"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      strokeWidth="2"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3.6 9h16.8M3.6 15h16.8M12 3a15 15 0 010 18M12 3a15 15 0 000 18"
      />
    </svg>
  ),
  email: (
    <svg
      className="w-5 h-5"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      strokeWidth="2"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
      />
    </svg>
  ),
};

// Convert a human "Month DD, YYYY" date into an ISO 8601 date (YYYY-MM-DD) for
// the <time> dateTime attribute. " UTC" forces UTC parsing (no day shift).
function toIsoDate(human?: string): string | undefined {
  if (!human) return undefined;
  const d = new Date(`${human} UTC`);
  return Number.isNaN(d.getTime()) ? undefined : d.toISOString().slice(0, 10);
}

interface AuthorPageTemplateProps {
  author: AuthorEntry;
  // Articles can be passed in (fetched from WordPress) or use author's hardcoded articles
  featuredArticles?: FeaturedArticle[];
  recentArticles?: RecentArticle[];
}

export default function AuthorPageTemplate({
  author,
  featuredArticles,
  recentArticles,
}: AuthorPageTemplateProps) {
  // Use passed articles or fall back to author's hardcoded articles
  const displayFeaturedArticles =
    featuredArticles ?? author.featuredArticles ?? [];
  const displayRecentArticles = recentArticles ?? author.recentArticles ?? [];

  return (
    // <article> (not <main>) — the blog layout already provides the <main> landmark.
    <article className="min-h-screen bg-white">
      {/* Breadcrumb — mirrors the BreadcrumbList JSON-LD (Blog › Name) */}
      <div className="max-w-4xl mx-auto px-4 pt-[16px]">
        <Breadcrumb
          items={[
            { label: "Blog", href: "/blogs" },
            { label: author.name },
          ]}
        />
      </div>

      {/* Hero Section - Author Profile */}
      <section className="max-w-4xl mx-auto px-4 py-[16px] text-center">
        {/* Avatar */}
        <div className="relative w-[200px] h-[200px] mx-auto mb-[16px] md:mb-[20px]">
          <Image
            src={author.avatarUrl}
            alt={author.name}
            fill
            sizes="200px"
            className="object-cover rounded-full"
            priority
          />
        </div>

        {/* Author Info Card */}
        <div className="px-[22px] md:px-0">
          {/* Author Label, Name, Role */}
          <div className="flex flex-col gap-1 mb-3 md:mb-4">
            <p className="text-xs md:text-sm font-bold text-[#6B7280] uppercase tracking-wider">
              ABOUT THE AUTHOR
            </p>
            <h1 className="text-[24px] md:text-[26px] lg:text-[28px] font-semibold text-primary">
              {author.name.toUpperCase()}
            </h1>
            <p className="text-sm md:text-base font-normal text-gray-600">
              {author.role}
            </p>
          </div>

          {/* Short Bio Quote */}
          <blockquote className="text-base md:text-[18px] font-semibold text-[#6B7280] leading-relaxed max-w-2xl mx-auto mb-3 md:mb-4">
            &ldquo; {author.shortBio}&rdquo;
          </blockquote>

          {/* Social Links */}
          <div className="flex items-center justify-center gap-4 mb-8">
            {author.socialLinks.twitter && (
              <a
                href={author.socialLinks.twitter}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#999999] hover:text-[#9747FF] transition-colors"
                aria-label="Twitter"
              >
                {SocialIcons.twitter}
              </a>
            )}
            {author.socialLinks.linkedin && (
              <a
                href={author.socialLinks.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#999999] hover:text-[#9747FF] transition-colors"
                aria-label="LinkedIn"
              >
                {SocialIcons.linkedin}
              </a>
            )}
            {author.socialLinks.instagram && (
              <a
                href={author.socialLinks.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#999999] hover:text-[#9747FF] transition-colors"
                aria-label="Instagram"
              >
                {SocialIcons.instagram}
              </a>
            )}
            {author.socialLinks.youtube && (
              <a
                href={author.socialLinks.youtube}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#999999] hover:text-[#9747FF] transition-colors"
                aria-label="YouTube"
              >
                {SocialIcons.youtube}
              </a>
            )}
            {author.socialLinks.facebook && (
              <a
                href={author.socialLinks.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#999999] hover:text-[#9747FF] transition-colors"
                aria-label="Facebook"
              >
                {SocialIcons.facebook}
              </a>
            )}
            {author.socialLinks.website && (
              <a
                href={author.socialLinks.website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#999999] hover:text-[#9747FF] transition-colors"
                aria-label="Website"
              >
                {SocialIcons.website}
              </a>
            )}
            {author.socialLinks.email && (
              <a
                href={`https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(author.socialLinks.email)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#999999] hover:text-[#9747FF] transition-colors"
                aria-label="Email"
              >
                {SocialIcons.email}
              </a>
            )}
          </div>
        </div>

        {/* Previous Companies */}
        {author.previousCompanies.length > 0 && (
          <div className="bg-[#F8F8F8] rounded-[12px] p-4">
            <p className="text-base md:text-lg text-gray-500 mb-4 text-center">
              {author.previousCompaniesLabel || "Previously at"}
            </p>
            <div className="flex flex-wrap gap-4 md:gap-6 justify-center items-center">
              {author.previousCompanies.map((company) => (
                <div
                  key={company.name}
                  className="flex items-center justify-center"
                >
                  {company.logo ? (
                    <Image
                      src={company.logo}
                      alt={company.name}
                      width={120}
                      height={36}
                      className={`h-[16px] md:h-7 w-auto object-contain ${company.noFilter ? '' : 'opacity-60'}`}
                      style={{
                        filter: company.noFilter
                          ? 'none'
                          : company.darkBg
                            ? 'grayscale(100%) invert(1) brightness(0.7)'
                            : company.darkFg
                              ? 'grayscale(100%) opacity(0.4)'
                              : 'grayscale(100%)'
                      }}
                    />
                  ) : (
                    <span className="text-gray-500 font-semibold text-sm md:text-lg">
                      {company.name}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* Story Section */}
      <section className="max-w-4xl mx-auto px-[38px] md:px-4 py-[16px]">
        <div className="bg-white">
          <h2 className="text-[24px] md:text-[26px] lg:text-[28px] font-semibold text-[#8134AF] mb-6 text-center px-[2px]">
            {author.storyTitle}
          </h2>

          {author.storyContent.map((paragraph, index) => (
            <p
              key={index}
              className="text-sm md:text-base font-normal text-[#999999] leading-relaxed mb-4"
            >
              {paragraph}
            </p>
          ))}

          {/* Highlight Quote */}
          <blockquote className="text-[20px] md:text-[22px] lg:text-[24px] font-semibold text-[#8134AF] text-center my-8 px-4">
            &ldquo;{author.highlightQuote}&rdquo;
          </blockquote>

          {author.storyConclusion.map((paragraph, index) => (
            <p
              key={index}
              className="text-sm md:text-base font-normal text-[#999999] leading-relaxed mb-4"
            >
              {paragraph.includes("Sparkonomy") ? (
                <>
                  {paragraph.split("Sparkonomy")[0]}
                  <Link href="/" className="text-primary underline font-medium">
                    Sparkonomy
                  </Link>
                  {paragraph.split("Sparkonomy")[1]}
                </>
              ) : (
                paragraph
              )}
            </p>
          ))}

          {/* Signature */}
          {author.signatureImage && (
            <div className="mt-8">
              <Image
                src={author.signatureImage}
                alt={`${author.name} signature`}
                width={200}
                height={60}
                className="h-14 w-auto"
              />
              <p className="text-gray-600 mt-2">{author.name}</p>
            </div>
          )}
        </div>
      </section>

      {/* About Section */}
      <section className="max-w-4xl mx-auto px-[38px] md:px-4 py-[16px]">
        <h2 className="text-[24px] md:text-[26px] lg:text-[28px] font-semibold text-[#6B7280] mb-4">
          {author.aboutTitle}
        </h2>

        {author.aboutContent.map((paragraph, index) => {
          // Highlight specific phrases in the about content
          let content: React.ReactNode = paragraph;

          if (paragraph.includes("Founder and CEO of Sparkonomy")) {
            const parts = paragraph.split("Founder and CEO of Sparkonomy");
            content = (
              <>
                {parts[0]}
                <span className="text-primary">
                  Founder and CEO of Sparkonomy
                </span>
                {parts[1]}
              </>
            );
          } else if (
            paragraph.includes('"democratization of entrepreneurship,"')
          ) {
            const parts = paragraph.split(
              '"democratization of entrepreneurship,"',
            );
            content = (
              <>
                {parts[0]}
                <span className="text-primary">
                  &quot;democratization of entrepreneurship,&quot;
                </span>
                {parts[1]}
              </>
            );
          }

          return (
            <p
              key={index}
              className="text-[14px] md:text-base font-normal text-[#999999] leading-relaxed mb-4"
            >
              {content}
            </p>
          );
        })}
      </section>

      {/* Career Highlights */}
      {author.careerHighlights.length > 0 && (
        <section className="max-w-4xl mx-auto px-[38px] md:px-4 pb-[12px]">
          <h2 className="text-[20px] md:text-[22px] lg:text-[24px] font-semibold text-[#999999]">
            Career & Recognition Highlights:
          </h2>

          <ul className="space-y-3">
            {author.careerHighlights.map((highlight, index) => (
              <li
                key={index}
                className="flex items-start gap-2 text-[14px] md:text-[16px] font-normal text-[#999999]"
              >
                <span className="text-[#999999] mt-1" aria-hidden="true">✓</span>
                <span>{highlight}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Trust & Authority */}
      {author.trustItems.length > 0 && (
        <section className="max-w-4xl mx-auto px-[29px] md:px-4 pt-[12px]">
          <h2 className="text-[20px] md:text-[22px] lg:text-[24px] font-semibold text-[#999999] mb-4">
            Trust & Authority
          </h2>

          <div className="flex flex-wrap gap-[12px] md:gap-[14px] justify-center">
            {author.trustItems.map((item, index) => (
              <div
                key={index}
                className="flex flex-col items-center text-center p-4 rounded-[12px] border border-[#F2F2F2] w-[calc(33.333%-8px)] md:w-[calc(33.333%-10px)]"
              >
                <div className="mb-2">
                  <Image
                    src={TrustIconPaths[item.icon]}
                    alt={item.label}
                    width={32}
                    height={32}
                    className="w-[30px] h-[30px] md:w-[32px] md:h-[32px]"
                  />
                </div>
                <p className="text-[12px] md:text-[14px] font-normal text-primary">
                  {item.label}
                </p>
                <p className="text-base md:text-lg font-medium text-[#999999]">
                  {item.value}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* As Seen In - Only show if there are media mentions */}
      {author.mediaMentions.length > 0 && (
        <section className="bg-[#F8F8F8] py-[16px] my-[16px]">
          <div className="max-w-4xl mx-auto px-[29px]">
            <h2 className="text-[24px] md:text-[26px] font-semibold text-[#6B7280] mb-4">
              As Seen In
            </h2>

            <div className="flex flex-col">
              {author.mediaMentions.map((mention, index) => (
                <a
                  key={index}
                  href={mention.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex items-center justify-between py-[12px] hover:opacity-80 transition-opacity ${
                    index > 0 && index < author.mediaMentions.length - 1
                      ? "border-y border-white"
                      : ""
                  }`}
                >
                  <div className="flex items-center gap-3 mr-4">
                    <div className="w-[40px] h-[40px] min-w-[40px] min-h-[40px] rounded-full bg-white flex items-center justify-center overflow-hidden flex-shrink-0">
                      <ImageWithFallback
                        src={mention.logo}
                        alt={mention.publication}
                        width={24}
                        height={24}
                        className="w-6 h-6 object-contain"
                      />
                    </div>
                    <div>
                      <p className="text-[14px] md:text-base font-medium text-[#6B7280]">
                        {mention.title}
                      </p>
                      <p className="text-[12px] md:text-sm font-normal text-[#999999]">
                        {mention.author} • {mention.date}
                      </p>
                    </div>
                  </div>
                  <svg
                    className="w-5 h-5 min-w-[20px] min-h-[20px] flex-shrink-0 text-[#6B7280]"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 17L17 7M17 7H7M17 7V17"
                    />
                  </svg>
                </a>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Featured Articles - Only show if there are articles from WordPress */}
      {displayFeaturedArticles.length > 0 && (
        <section className="max-w-6xl mx-auto px-0 py-[16px]">
          <h2 className="text-[24px] md:text-[26px] font-semibold text-[#6B7280] mb-4 text-left px-[29px] md:px-4">
            Featured Articles
          </h2>
          <RelatedPosts
            posts={displayFeaturedArticles.map((article) => ({
              slug: article.href.replace("/blogs/", ""),
              title: article.title,
              excerpt: article.description,
              featuredImage: article.imageSrc,
              date: article.date,
            }))}
          />
        </section>
      )}

      {/* Recent Articles */}
      {displayRecentArticles.length > 0 && (
        <section className="max-w-4xl mx-auto px-[29px] py-[16px]">
          <h2 className="text-[24px] md:text-[26px] font-semibold text-[#6B7280] mb-4">
            Recent Articles
          </h2>

          <div className="flex flex-col gap-[12px]">
            {displayRecentArticles.map((article) => (
              <div
                key={article.id}
                className="flex items-center gap-4 max-h-[96px] pb-[12px] border-b border-[#F2F2F2]"
              >
                <div className="relative w-[80px] h-[80px] overflow-hidden flex-shrink-0">
                  <Image
                    src={article.imageSrc}
                    alt={article.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex-1 flex flex-col gap-[12px]">
                  <Link href={article.href}>
                    <h3 className="text-base md:text-lg text-[#6B7280] underline line-clamp-2">
                      {article.title}
                    </h3>
                  </Link>
                  <p className="text-[12px] md:text-sm font-normal text-[#999999]">
                    {article.date}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <Link
            href="/blogs"
            className="inline-flex items-center gap-2 text-primary text-[16px] font-medium mt-6 hover:underline"
          >
            View All Articles
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 8l4 4m0 0l-4 4m4-4H3"
              />
            </svg>
          </Link>
        </section>
      )}

      {/* Areas of Expertise */}
      {author.areasOfExpertise.length > 0 && (
        <section className="max-w-4xl mx-auto px-[29px] py-[16px]">
          <h2 className="text-[24px] md:text-[26px] font-semibold text-[#6B7280] mb-4">
            Areas of Expertise
          </h2>

          <div className="flex flex-wrap gap-3">
            {author.areasOfExpertise.map((expertise, index) => (
              <span
                key={index}
                className="px-4 py-2 rounded-full bg-[#F2F2F2] text-[12px] md:text-sm font-medium text-[#999999]"
              >
                {expertise}
              </span>
            ))}
          </div>
        </section>
      )}

      {/* Let's Connect CTA */}
      <section className="max-w-4xl mx-auto px-[14px] py-[16px]">
        <div className="bg-gray-50 rounded-3xl p-8 text-center">
          <h2 className="text-[24px] md:text-[26px] font-semibold text-primary mb-4">
            Let&apos;s Connect!
          </h2>
          <p className="text-[20px] md:text-[22px] font-semibold text-[#999999] mb-6 max-w-md mx-auto">
            Have questions about the creator economy or collaboration
            opportunities? I&apos;d love to hear from you.
          </p>

          <div className="flex flex-col gap-1 max-w-xs mx-auto">
            <a
              href={`https://mail.google.com/mail/?to=${encodeURIComponent(author.contactEmail)}&cc=hello%40sparkonomy.com&su=${encodeURIComponent(`Loved your piece on Sparkonomy`)}&body=${encodeURIComponent(`Hi ${author.name},\n\nI came across your article on the Sparkonomy blog and wanted to reach out. Would love to connect!`)}&view=cm&fs=1`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 text-[14px] md:text-base font-medium text-white px-6 py-3 rounded-full hover:opacity-90 transition-opacity"
              style={{
                background:
                  "linear-gradient(180.27deg, #DD2A7B -46.92%, #9747FF 80.1%)",
              }}
            >
              {SocialIcons.email}
              Email Me
            </a>
            {author.linkedinSubscribe && (
              <div
                className="rounded-full p-[2px] hover:opacity-90 transition-opacity"
                style={{
                  background:
                    "linear-gradient(180.27deg, #DD2A7B -46.92%, #9747FF 80.1%)",
                }}
              >
                <a
                  href={author.linkedinSubscribe}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 text-[14px] md:text-base font-medium text-primary px-6 py-3 rounded-full bg-white"
                >
                  {SocialIcons.linkedin}
                  Subscribe Now
                </a>
              </div>
            )}
          </div>


          {author.responseTime && (
            <p className="text-[14px] md:text-base font-normal text-[#999999] italic mt-4">
              {author.responseTime}
            </p>
          )}
        </div>
      </section>

      {/* Profile freshness signal */}
      {author.lastUpdated && (
        <p className="text-center text-[12px] md:text-sm font-normal text-[#999999] pb-[16px]">
          Profile last updated on{" "}
          <time dateTime={toIsoDate(author.lastUpdated)}>{author.lastUpdated}</time>
        </p>
      )}
    </article>
  );
}
