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

// Social Icons
const SocialIcons = {
  twitter: (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
    </svg>
  ),
  linkedin: (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
    </svg>
  ),
  email: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
    </svg>
  ),
};

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
  const displayFeaturedArticles = featuredArticles ?? author.featuredArticles ?? [];
  const displayRecentArticles = recentArticles ?? author.recentArticles ?? [];

  return (
    <main className="min-h-screen bg-white">
      {/* Breadcrumb */}
      <div className="max-w-4xl mx-auto px-4 pt-[16px]">
        <Breadcrumb
          items={[
            { label: "Blog", href: "/blogs" },
            { label: "Author", href: "/blogs" },
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
            <p className="text-sm md:text-base font-normal text-gray-600">{author.role}</p>
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
            {author.socialLinks.email && (
              <a
                href={`mailto:${author.socialLinks.email}`}
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
            <p className="text-base md:text-lg text-gray-500 mb-4 text-center">Previously scaling billion-dollar businesses at</p>
            <div className="grid grid-cols-3 gap-4 md:gap-6 justify-items-center">
              {author.previousCompanies.map((company) => (
                <div key={company.name} className="flex items-center justify-center">
                  {company.logo ? (
                    <Image
                      src={company.logo}
                      alt={company.name}
                      width={120}
                      height={36}
                      className="h-[16px] md:h-7 w-auto object-contain grayscale opacity-60"
                    />
                  ) : (
                    <span className="text-gray-500 font-semibold text-sm md:text-lg">{company.name}</span>
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
            <p key={index} className="text-sm md:text-base font-normal text-[#999999] leading-relaxed mb-4">
              {paragraph}
            </p>
          ))}

          {/* Highlight Quote */}
          <blockquote className="text-[20px] md:text-[22px] lg:text-[24px] font-semibold text-[#8134AF] text-center my-8 px-4">
            &ldquo;{author.highlightQuote}&rdquo;
          </blockquote>

          {author.storyConclusion.map((paragraph, index) => (
            <p key={index} className="text-sm md:text-base font-normal text-[#999999] leading-relaxed mb-4">
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
                className="h-12 w-auto"
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
                <span className="text-primary">Founder and CEO of Sparkonomy</span>
                {parts[1]}
              </>
            );
          } else if (paragraph.includes("\"democratization of entrepreneurship,\"")) {
            const parts = paragraph.split("\"democratization of entrepreneurship,\"");
            content = (
              <>
                {parts[0]}
                <span className="text-primary">&quot;democratization of entrepreneurship,&quot;</span>
                {parts[1]}
              </>
            );
          }

          return (
            <p key={index} className="text-[14px] md:text-base font-normal text-[#999999] leading-relaxed mb-4">
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
              <li key={index} className="flex items-start gap-2 text-[14px] md:text-[16px] font-normal text-[#999999]">
                <span className="text-[#999999] mt-1">✓</span>
                <span>{highlight}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Trust & Authority */}
      {author.trustItems.length > 0 && (
        <section className="max-w-4xl mx-auto px-[29px] md:px-4 pt-[12px]">
          <h2 className="text-[20px] md:text-[22px] lg:text-[24px] font-semibold text-[#999999] mb-4">Trust & Authority</h2>

          <div className="grid grid-cols-3 gap-[12px] md:gap-[14px]">
            {author.trustItems.map((item, index) => (
              <div
                key={index}
                className="flex flex-col items-center text-center p-4 rounded-[12px] border border-[#F2F2F2]"
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
                <p className="text-[12px] md:text-[14px] font-normal text-primary">{item.label}</p>
                <p className="text-base md:text-lg font-medium text-[#999999]">{item.value}</p>
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
                    index > 0 && index < author.mediaMentions.length - 1 ? 'border-y border-white' : ''
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-[40px] h-[40px] rounded-full bg-white flex items-center justify-center overflow-hidden">
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
                  <svg className="w-5 h-5 text-[#6B7280]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 17L17 7M17 7H7M17 7V17" />
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
                  <p className="text-[12px] md:text-sm font-normal text-[#999999]">{article.date}</p>
                </div>
              </div>
            ))}
          </div>

          <Link
            href="/blogs"
            className="inline-flex items-center gap-2 text-primary text-[16px] font-medium mt-6 hover:underline"
          >
            View All Articles
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
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
            Have questions about the creator economy or collaboration opportunities?
            I&apos;d love to hear from you.
          </p>

          <div className="flex flex-col gap-1 max-w-xs mx-auto">
            <a
              href={`mailto:${author.contactEmail}`}
              className="flex items-center justify-center gap-2 text-[14px] md:text-base font-medium text-white px-6 py-3 rounded-full hover:opacity-90 transition-opacity"
              style={{ background: 'linear-gradient(180.27deg, #DD2A7B -46.92%, #9747FF 80.1%)' }}
            >
              {SocialIcons.email}
              Email Me
            </a>
            {author.linkedinSubscribe && (
              <div
                className="rounded-full p-[2px] hover:opacity-90 transition-opacity"
                style={{ background: 'linear-gradient(180.27deg, #DD2A7B -46.92%, #9747FF 80.1%)' }}
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

          {(author.mediaEmail || author.speakingEmail) && (
            <div className="mt-6 space-y-1">
              {author.mediaEmail && (
                <p className="text-[14px] md:text-base font-normal">
                  <span className="text-[#6B7280]">Media Enquiry:</span>{" "}
                  <span className="text-[#999999]">{author.mediaEmail}</span>
                </p>
              )}
              {author.speakingEmail && (
                <p className="text-[14px] md:text-base font-normal">
                  <span className="text-[#6B7280]">Speaking Requests:</span>{" "}
                  <span className="text-[#999999]">{author.speakingEmail}</span>
                </p>
              )}
            </div>
          )}

          {author.responseTime && (
            <p className="text-[14px] md:text-base font-normal text-[#999999] italic mt-4">
              {author.responseTime}
            </p>
          )}
        </div>
      </section>

      {/* Footer Info */}
      <section className="max-w-4xl mx-auto px-4 py-[16px] text-center text-sm text-gray-500">
        <p>Last Update: {author.lastUpdated}</p>
        <p>Profile ID: {author.profileId}</p>
      </section>
    </main>
  );
}
