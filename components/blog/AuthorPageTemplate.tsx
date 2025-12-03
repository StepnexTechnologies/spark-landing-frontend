import Image from "next/image";
import Link from "next/link";
import { AuthorEntry, FeaturedArticle, RecentArticle } from "@/data/authors";
import Breadcrumb from "@/components/blog/Breadcrumb";
import RelatedPosts from "@/components/blog/RelatedPosts";

// Trust icon components
const TrustIcons = {
  experience: (
    <svg className="w-8 h-8" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="4" y="6" width="24" height="20" rx="2" stroke="#9747FF" strokeWidth="2"/>
      <path d="M4 12H28" stroke="#9747FF" strokeWidth="2"/>
      <path d="M10 6V2" stroke="#9747FF" strokeWidth="2" strokeLinecap="round"/>
      <path d="M22 6V2" stroke="#9747FF" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  ),
  expertise: (
    <svg className="w-8 h-8" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M16 2L20 10L28 11L22 17L24 26L16 22L8 26L10 17L4 11L12 10L16 2Z" stroke="#9747FF" strokeWidth="2" strokeLinejoin="round"/>
    </svg>
  ),
  verified: (
    <svg className="w-8 h-8" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M16 2L19 8L26 9L21 14L22 21L16 18L10 21L11 14L6 9L13 8L16 2Z" fill="#9747FF" fillOpacity="0.1"/>
      <path d="M12 16L15 19L21 13" stroke="#9747FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <circle cx="16" cy="16" r="12" stroke="#9747FF" strokeWidth="2"/>
    </svg>
  ),
  awards: (
    <svg className="w-8 h-8" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M16 20C20.4183 20 24 16.4183 24 12C24 7.58172 20.4183 4 16 4C11.5817 4 8 7.58172 8 12C8 16.4183 11.5817 20 16 20Z" stroke="#9747FF" strokeWidth="2"/>
      <path d="M12 19V28L16 26L20 28V19" stroke="#9747FF" strokeWidth="2"/>
    </svg>
  ),
  following: (
    <svg className="w-8 h-8" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="10" r="4" stroke="#9747FF" strokeWidth="2"/>
      <path d="M4 24C4 20 7.5 17 12 17C16.5 17 20 20 20 24" stroke="#9747FF" strokeWidth="2"/>
      <circle cx="22" cy="12" r="3" stroke="#9747FF" strokeWidth="2"/>
      <path d="M28 24C28 21 25.5 19 22 19" stroke="#9747FF" strokeWidth="2"/>
    </svg>
  ),
  featured: (
    <svg className="w-8 h-8" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="4" y="6" width="24" height="18" rx="2" stroke="#9747FF" strokeWidth="2"/>
      <circle cx="12" cy="15" r="3" stroke="#9747FF" strokeWidth="2"/>
      <path d="M18 13H24" stroke="#9747FF" strokeWidth="2" strokeLinecap="round"/>
      <path d="M18 17H22" stroke="#9747FF" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  ),
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
      <div className="max-w-4xl mx-auto px-4 pt-6">
        <Breadcrumb
          items={[
            { label: "Blog", href: "/blogs" },
            { label: "Author", href: "/blogs" },
            { label: author.name },
          ]}
        />
      </div>

      {/* Hero Section - Author Profile */}
      <section className="max-w-4xl mx-auto px-[17px] md:px-4 py-8 text-center">
        {/* Avatar */}
        <div className="relative w-[200px] h-[200px] mx-auto mb-6">
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-orange-300 via-yellow-200 to-orange-400 p-1">
            <div className="w-full h-full rounded-full overflow-hidden bg-white">
              <Image
                src={author.avatarUrl}
                alt={author.name}
                fill
                className="object-cover rounded-full"
                priority
              />
            </div>
          </div>
        </div>

        {/* Author Info Card */}
        <div className="px-[22px] md:px-0">
          {/* About the Author label */}
          <p className="text-xs md:text-sm font-bold text-[#6B7280] uppercase tracking-wider mb-2">
            ABOUT THE AUTHOR
          </p>

          {/* Name */}
          <h1 className="text-[24px] md:text-[26px] lg:text-[28px] font-semibold text-primary mb-2">
            {author.name.toUpperCase()}
          </h1>

          {/* Role */}
          <p className="text-sm md:text-base font-normal text-gray-600 mb-6">{author.role}</p>

          {/* Short Bio Quote */}
          <blockquote className="text-base md:text-[18px] font-semibold text-[#6B7280] leading-relaxed max-w-2xl mx-auto mb-6">
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
          <div className="bg-[#F8F8F8] rounded-2xl py-4 px-6">
            <p className="text-sm text-gray-500 mb-3">Previously scaling billion-dollar businesses at</p>
            <div className="flex items-center justify-center gap-6 flex-wrap">
              {author.previousCompanies.map((company) => (
                <div key={company.name} className="flex items-center gap-2">
                  {company.logo ? (
                    <Image
                      src={company.logo}
                      alt={company.name}
                      width={100}
                      height={30}
                      className="h-6 w-auto object-contain"
                    />
                  ) : (
                    <span className="text-gray-800 font-semibold">{company.name}</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* Story Section */}
      <section className="max-w-4xl mx-auto px-[38px] md:px-4 py-8">
        <div className="bg-white">
          <h2 className="text-[24px] md:text-[26px] lg:text-[28px] font-semibold text-[#8134AF] mb-6 text-center">
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
                  <Link href="/" className="text-[#9747FF] underline font-medium">
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
      <section className="max-w-4xl mx-auto px-4 py-8">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">
          {author.aboutTitle}
        </h2>

        {author.aboutContent.map((paragraph, index) => (
          <p key={index} className="text-gray-700 leading-relaxed mb-4">
            {paragraph}
          </p>
        ))}
      </section>

      {/* Career Highlights */}
      {author.careerHighlights.length > 0 && (
        <section className="max-w-4xl mx-auto px-4 py-8">
          <h2 className="text-2xl md:text-3xl font-bold text-[#9747FF] mb-6">
            Career & Recognition Highlights:
          </h2>

          <ul className="space-y-3">
            {author.careerHighlights.map((highlight, index) => (
              <li key={index} className="flex items-start gap-2 text-gray-700">
                <span className="text-[#9747FF] mt-1">✓</span>
                <span>{highlight}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Trust & Authority */}
      {author.trustItems.length > 0 && (
        <section className="max-w-4xl mx-auto px-4 py-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Trust & Authority</h2>

          <div className="grid grid-cols-3 gap-4">
            {author.trustItems.map((item, index) => (
              <div
                key={index}
                className="flex flex-col items-center text-center p-4 rounded-xl border border-gray-100"
              >
                <div className="mb-2">{TrustIcons[item.icon]}</div>
                <p className="text-[#9747FF] text-sm font-medium">{item.label}</p>
                <p className="text-gray-600 text-sm">{item.value}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* As Seen In - Only show if there are media mentions */}
      {author.mediaMentions.length > 0 && (
        <section className="max-w-4xl mx-auto px-4 py-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">As Seen In</h2>

          <div className="space-y-4">
            {author.mediaMentions.map((mention, index) => (
              <a
                key={index}
                href={mention.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-4 rounded-xl border border-gray-100 hover:border-[#9747FF] transition-colors"
              >
                <div className="flex items-center gap-4">
                  <Image
                    src={mention.logo}
                    alt={mention.publication}
                    width={40}
                    height={40}
                    className="w-10 h-10 object-contain"
                  />
                  <div>
                    <p className="font-medium text-gray-900">{mention.title}</p>
                    <p className="text-sm text-gray-500">
                      {mention.author} • {mention.date}
                    </p>
                  </div>
                </div>
                <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 17L17 7M17 7H7M17 7V17" />
                </svg>
              </a>
            ))}
          </div>
        </section>
      )}

      {/* Also Read - Carousel */}
      {displayFeaturedArticles.length > 0 && (
        <section className="max-w-6xl mx-auto px-4 py-8">
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
        <section className="max-w-4xl mx-auto px-4 py-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Recent Articles</h2>

          <div className="space-y-4">
            {displayRecentArticles.map((article) => (
              <Link
                key={article.id}
                href={article.href}
                className="flex items-center gap-4 group"
              >
                <div className="relative w-20 h-20 rounded-xl overflow-hidden flex-shrink-0">
                  <Image
                    src={article.imageSrc}
                    alt={article.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-[#9747FF] group-hover:underline">
                    {article.title}
                  </h3>
                  <p className="text-sm text-gray-500">{article.date}</p>
                </div>
              </Link>
            ))}
          </div>

          <Link
            href="/blogs"
            className="inline-flex items-center gap-2 text-[#9747FF] font-medium mt-6 hover:underline"
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
        <section className="max-w-4xl mx-auto px-4 py-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Areas of Expertise</h2>

          <div className="flex flex-wrap gap-3">
            {author.areasOfExpertise.map((expertise, index) => (
              <span
                key={index}
                className="px-4 py-2 rounded-full border border-gray-200 text-gray-700 text-sm"
              >
                {expertise}
              </span>
            ))}
          </div>
        </section>
      )}

      {/* Let's Connect CTA */}
      <section className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-gray-50 rounded-3xl p-8 text-center">
          <h2 className="text-2xl font-bold text-[#9747FF] mb-4">Let&apos;s Connect!</h2>
          <p className="text-gray-600 mb-6 max-w-md mx-auto">
            Have questions about the creator economy or collaboration opportunities?
            We&apos;d love to hear from you.
          </p>

          <div className="flex flex-col gap-3 max-w-xs mx-auto">
            <a
              href={`mailto:${author.contactEmail}`}
              className="flex items-center justify-center gap-2 bg-gradient-to-r from-[#9747FF] to-[#DD2A7B] text-white px-6 py-3 rounded-full font-medium hover:opacity-90 transition-opacity"
            >
              {SocialIcons.email}
              Email Us
            </a>
            {author.linkedinSubscribe && (
              <a
                href={author.linkedinSubscribe}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 border-2 border-[#9747FF] text-[#9747FF] px-6 py-3 rounded-full font-medium hover:bg-[#9747FF] hover:text-white transition-colors"
              >
                {SocialIcons.linkedin}
                Subscribe Now
              </a>
            )}
          </div>

          {(author.mediaEmail || author.speakingEmail) && (
            <div className="mt-6 text-sm text-gray-500 space-y-1">
              {author.mediaEmail && (
                <p>
                  <span className="font-medium text-gray-700">Media Enquiry:</span>{" "}
                  {author.mediaEmail}
                </p>
              )}
              {author.speakingEmail && (
                <p>
                  <span className="font-medium text-gray-700">Speaking Requests:</span>{" "}
                  {author.speakingEmail}
                </p>
              )}
            </div>
          )}

          {author.responseTime && (
            <p className="text-sm text-gray-400 italic mt-4">{author.responseTime}</p>
          )}
        </div>
      </section>

      {/* Footer Info */}
      <section className="max-w-4xl mx-auto px-4 py-8 text-center text-sm text-gray-500">
        <p>Last Update: {author.lastUpdated}</p>
        <p>Profile ID: {author.profileId}</p>
      </section>
    </main>
  );
}
