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
                <div className="flex items-center justify-center md:justify-end gap-5 lg:gap-12 w-full md:w-auto">
                    {/* Navigation - visible on mobile and desktop */}
                    <nav className="flex items-center gap-6 md:gap-12">
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
                    {/* Button - hidden on mobile, visible on desktop */}
                    <Button variant="gradient" className="hidden md:inline-flex !px-8 !py-4" onClick={scrollToNewsletter}>Subscribe Now</Button>
                </div>
            </div>
        </header>
    );
}
