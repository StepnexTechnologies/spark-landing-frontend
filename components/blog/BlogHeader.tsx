"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useState } from "react";
import Button from "../common/button";

export default function  BlogHeader() {
    const pathname = usePathname();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const navItems = [
        { name: "Creators", href: "/blogs/creators" },
        { name: "Brand", href: "/blogs/brand" },
        { name: "Company", href: "/blogs/company" },
    ];

    const socialLinks = [
        { name: "Instagram", href: "https://www.instagram.com/sparkonomy.official/", icon: "instagram" },
        { name: "LinkedIn", href: "https://www.linkedin.com/company/sparkonomy/", icon: "linkedin" },
        { name: "YouTube", href: "https://www.youtube.com/@Sparkonomy.official", icon: "youtube" },
        { name: "Reddit", href: "https://www.reddit.com/r/CreatorsThatSpark/?feed=home&captcha=1", icon: "reddit" },
    ];

    const scrollToNewsletter = () => {
        const newsletterSection = document.getElementById('newsletter');
        if (newsletterSection) {
            newsletterSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    return (
        <header className="sticky top-0 z-50 w-full bg-white px-6 md:px-10 lg:px-20 py-[14px]">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                {/* Top row: Logo and Button */}
                <div className="flex items-center justify-between">
                    <Link href="/" className="flex items-center">
                        <Image
                            src="/logo.png"
                            alt="Sparkonomy"
                            width={180}
                            height={40}
                            className="h-auto w-[130px] md:w-[180px]"
                            priority
                        />
                    </Link>
                    <Button variant="gradient" className="md:hidden !px-7 !py-[14px]" onClick={scrollToNewsletter}>Subscribe Now</Button>
                </div>

                {/* Bottom row on mobile, right side on desktop: Nav + Button */}
                <div className="flex items-center justify-center md:justify-end gap-5 lg:gap-12 w-full md:w-auto border-t md:border-t-0 pt-4 md:pt-0">
                    {/* Navigation - visible on mobile and desktop */}
                    <nav className="flex items-center gap-6 md:gap-12 list-none">
                        {navItems.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    "relative py-2 font-medium transition-colors text-sm md:text-base",
                                    "after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5",
                                    "after:transition-all after:duration-300",
                                    "after:bg-gradient-to-r after:from-[#DD2A7B] after:to-[#9747FF] after:opacity-0 hover:after:opacity-100",
                                    pathname === item.href
                                        ? "bg-gradient-to-r from-[#DD2A7B] to-[#9747FF] text-transparent bg-clip-text"
                                        : "text-gray-900 hover:bg-gradient-to-r hover:from-[#DD2A7B] hover:to-[#9747FF] hover:text-transparent hover:bg-clip-text"
                                )}
                            >
                                {item.name}
                            </Link>
                        ))}
                    </nav>
                    {/* Social Media Icons */}
                    <div className="flex items-center gap-3 md:gap-4">
                        {socialLinks.map((social) => (
                            <Link
                                key={social.name}
                                href={social.href}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-gray-600 hover:text-purple-600 transition-colors"
                                aria-label={social.name}
                            >
                                {social.icon === "instagram" && (
                                    <svg className="w-5 h-5 md:w-6 md:h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                        <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd"/>
                                    </svg>
                                )}
                                {social.icon === "linkedin" && (
                                    <svg className="w-5 h-5 md:w-6 md:h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                                    </svg>
                                )}
                                {social.icon === "youtube" && (
                                    <svg className="w-5 h-5 md:w-6 md:h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                        <path fillRule="evenodd" d="M19.812 5.418c.861.23 1.538.907 1.768 1.768C21.998 8.746 22 12 22 12s0 3.255-.418 4.814a2.504 2.504 0 0 1-1.768 1.768c-1.56.419-7.814.419-7.814.419s-6.255 0-7.814-.419a2.505 2.505 0 0 1-1.768-1.768C2 15.255 2 12 2 12s0-3.255.417-4.814a2.507 2.507 0 0 1 1.768-1.768C5.744 5 11.998 5 11.998 5s6.255 0 7.814.418ZM15.194 12 10 15V9l5.194 3Z" clipRule="evenodd"/>
                                    </svg>
                                )}
                                {social.icon === "reddit" && (
                                    <svg className="w-5 h-5 md:w-6 md:h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                        <path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.701zM9.25 12C8.561 12 8 12.562 8 13.25c0 .687.561 1.248 1.25 1.248.687 0 1.248-.561 1.248-1.249 0-.688-.561-1.249-1.249-1.249zm5.5 0c-.687 0-1.248.561-1.248 1.25 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.687-.562-1.249-1.25-1.249zm-5.466 3.99a.327.327 0 0 0-.231.094.33.33 0 0 0 0 .463c.842.842 2.484.913 2.961.913.477 0 2.105-.056 2.961-.913a.361.361 0 0 0 .029-.463.33.33 0 0 0-.464 0c-.547.533-1.684.73-2.512.73-.828 0-1.979-.196-2.512-.73a.326.326 0 0 0-.232-.095z"/>
                                    </svg>
                                )}
                            </Link>
                        ))}
                    </div>
                    {/* Button - hidden on mobile, visible on desktop */}
                    <div className="hidden md:block">
                        <Button variant="gradient" className="!px-8 !py-4" onClick={scrollToNewsletter}>Subscribe Now</Button>
                    </div>
                </div>
            </div>
        </header>
    );
}
