import Image from "next/image";
import Link from "next/link";

interface PreviousCompany {
  name: string;
  logo?: string;
  logoHeight?: number;
}

interface AuthorCardProps {
  name: string;
  role: string;
  bio: string;
  avatarUrl: string;
  authorSlug?: string;
  previousCompanies?: PreviousCompany[];
  previousCompaniesLabel?: string;
  socialLinks?: {
    linkedin?: string;
    instagram?: string;
    youtube?: string;
    facebook?: string;
    twitter?: string;
  };
}

export default function  AuthorCard({
  name,
  role,
  bio,
  avatarUrl,
  authorSlug,
  previousCompanies = [],
  previousCompaniesLabel = "Previously at",
  socialLinks = {},
}: AuthorCardProps) {
  // Show only the last 3 companies
  const displayCompanies = previousCompanies.slice(-3);
  const hasSocialLinks = Object.values(socialLinks).some((link) => link);

  return (
    <div className="bg-[#F2F2F2] rounded-lg p-6 md:p-8">
      <h3 className="text-lg md:text-2xl font-semibold text-[#6B7280] mb-4">About the author</h3>

      <div className="border-l-4 border-purple-600 pl-4 md:pl-6">
        <p className="text-sm md:text-base font-normal text-[#6B7280] leading-relaxed mb-6">{bio}</p>

      <div className="flex flex-col gap-6">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6 md:gap-20">
          <div className="flex items-start gap-4 flex-1">
            {avatarUrl && (
              <div className="relative w-16 h-16 md:w-[72px] md:h-[72px] rounded-full overflow-hidden flex-shrink-0">
                <Image
                  src={avatarUrl}
                  alt={name}
                  fill
                  className="object-cover"
                />
              </div>
            )}

            <div className="flex-1">
              {authorSlug ? (
                <Link
                  href={`/blogs/author/${authorSlug}`}
                  className="text-base font-medium text-[#6B7280] hover:text-purple-600 transition-colors"
                >
                  {name}
                </Link>
              ) : (
                <h4 className="text-base font-medium text-[#6B7280]">{name}</h4>
              )}
              {role && <p className="text-xs text-[#999999] mb-3">{role}</p>}

              {/* Social Links */}
              {hasSocialLinks && (
                <div className="flex items-center gap-3">
                  {socialLinks.linkedin && (
                    <Link
                      href={socialLinks.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-400 hover:text-gray-600 transition-colors"
                      aria-label="LinkedIn"
                    >
                      <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                      </svg>
                    </Link>
                  )}
                  {socialLinks.instagram && (
                    <Link
                      href={socialLinks.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-400 hover:text-gray-600 transition-colors"
                      aria-label="Instagram"
                    >
                      <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd"/>
                      </svg>
                    </Link>
                  )}
                  {socialLinks.youtube && (
                    <Link
                      href={socialLinks.youtube}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-400 hover:text-gray-600 transition-colors"
                      aria-label="YouTube"
                    >
                      <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path fillRule="evenodd" d="M19.812 5.418c.861.23 1.538.907 1.768 1.768C21.998 8.746 22 12 22 12s0 3.255-.418 4.814a2.504 2.504 0 0 1-1.768 1.768c-1.56.419-7.814.419-7.814.419s-6.255 0-7.814-.419a2.505 2.505 0 0 1-1.768-1.768C2 15.255 2 12 2 12s0-3.255.417-4.814a2.507 2.507 0 0 1 1.768-1.768C5.744 5 11.998 5 11.998 5s6.255 0 7.814.418ZM15.194 12 10 15V9l5.194 3Z" clipRule="evenodd"/>
                      </svg>
                    </Link>
                  )}
                  {socialLinks.facebook && (
                    <Link
                      href={socialLinks.facebook}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-400 hover:text-gray-600 transition-colors"
                      aria-label="Facebook"
                    >
                      <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd"/>
                      </svg>
                    </Link>
                  )}
                  {socialLinks.twitter && (
                    <Link
                      href={socialLinks.twitter}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-400 hover:text-gray-600 transition-colors"
                      aria-label="Twitter"
                    >
                      <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                      </svg>
                    </Link>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Previous Companies - Right Side on Desktop */}
          {displayCompanies.length > 0 && (
            <div className="hidden md:flex flex-col items-end">
              <p className="text-sm text-[#6B7280] mb-2">{previousCompaniesLabel}</p>
              <div className="flex items-center gap-4">
                {displayCompanies.map((company, index) => (
                  company.logo ? (
                    <Image
                      key={index}
                      src={company.logo}
                      alt={company.name}
                      width={100}
                      height={company.logoHeight || 32}
                      className="h-[24px] w-auto object-contain grayscale"
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

        {/* Previous Companies - Below on Mobile */}
        {displayCompanies.length > 0 && (
          <div className="md:hidden flex flex-col items-start">
            <p className="text-sm text-[#6B7280] mb-2">{previousCompaniesLabel}</p>
            <div className="flex items-center gap-4">
              {displayCompanies.map((company, index) => (
                company.logo ? (
                  <Image
                    key={index}
                    src={company.logo}
                    alt={company.name}
                    width={80}
                    height={company.logoHeight || 24}
                    className="h-[24px] w-auto object-contain grayscale"
                  />
                ) : (
                  <span key={index} className="text-lg font-bold text-gray-900">
                    {company.name}
                  </span>
                )
              ))}
            </div>
          </div>
        )}
      </div>
      </div>
    </div>
  );
}
