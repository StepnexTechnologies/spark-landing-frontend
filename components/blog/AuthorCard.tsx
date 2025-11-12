import Image from "next/image";
import Link from "next/link";
import { Facebook, Instagram, Linkedin, Youtube, Twitter } from "lucide-react";

interface AuthorCardProps {
  name: string;
  role: string;
  bio: string;
  avatarUrl: string;
  previousCompanies?: string[];
  socialLinks?: {
    linkedin?: string;
    instagram?: string;
    youtube?: string;
    facebook?: string;
    twitter?: string;
  };
}

export default function AuthorCard({
  name,
  role,
  bio,
  avatarUrl,
  previousCompanies = [],
  socialLinks = {},
}: AuthorCardProps) {
  return (
    <div className="bg-gray-50 rounded-2xl p-8 my-12">
      <h3 className="text-2xl font-bold text-gray-900 mb-6">About the author</h3>
      <div className="border-l-4 border-purple-600 pl-6">
        <p className="text-gray-700 leading-relaxed mb-6">{bio}</p>

        <div className="flex items-start gap-4">
          <div className="relative w-16 h-16 rounded-full overflow-hidden flex-shrink-0">
            <Image
              src={avatarUrl}
              alt={name}
              fill
              className="object-cover"
            />
          </div>

          <div className="flex-1">
            <h4 className="text-lg font-bold text-gray-900">{name}</h4>
            <p className="text-sm text-gray-600 mb-3">{role}</p>

            {/* Social Links */}
            <div className="flex items-center gap-3 mb-4">
              {socialLinks.linkedin && (
                <Link
                  href={socialLinks.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-600 hover:text-purple-600 transition-colors"
                  aria-label="LinkedIn"
                >
                  <Linkedin className="w-5 h-5" />
                </Link>
              )}
              {socialLinks.instagram && (
                <Link
                  href={socialLinks.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-600 hover:text-purple-600 transition-colors"
                  aria-label="Instagram"
                >
                  <Instagram className="w-5 h-5" />
                </Link>
              )}
              {socialLinks.youtube && (
                <Link
                  href={socialLinks.youtube}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-600 hover:text-purple-600 transition-colors"
                  aria-label="YouTube"
                >
                  <Youtube className="w-5 h-5" />
                </Link>
              )}
              {socialLinks.facebook && (
                <Link
                  href={socialLinks.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-600 hover:text-purple-600 transition-colors"
                  aria-label="Facebook"
                >
                  <Facebook className="w-5 h-5" />
                </Link>
              )}
              {socialLinks.twitter && (
                <Link
                  href={socialLinks.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-600 hover:text-purple-600 transition-colors"
                  aria-label="Twitter"
                >
                  <Twitter className="w-5 h-5" />
                </Link>
              )}
            </div>

            {/* Previous Companies */}
            {previousCompanies.length > 0 && (
              <div>
                <p className="text-sm text-gray-600 mb-2">Previously at</p>
                <div className="flex items-center gap-4 flex-wrap">
                  {previousCompanies.map((company, index) => (
                    <div key={index} className="flex items-center gap-2">
                      {/* You can add company logos here if available */}
                      <span className="text-sm font-medium text-gray-900">
                        {company}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
