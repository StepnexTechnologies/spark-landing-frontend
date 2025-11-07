"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useState } from "react";
import Button from "../common/button";

export default function BlogHeader() {
    const pathname = usePathname();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const navItems = [
        { name: "Creators", href: "/blogs/creators" },
        { name: "Brand", href: "/blogs/brand" },
        { name: "Company", href: "/blogs/company" },
    ];

    return (
        <header className="sticky top-0 z-50 w-full bg-white  px-10 md:px-14 lg:px-20 py-[14px]">
            <div className="flex items-center justify-between gap-3 lg:gap-5">
                <div>
                    <Link href="/" className="flex items-center">
                        <Image
                            src="/logo.png"
                            alt="Sparkonomy"
                            width={180}
                            height={40}
                            className="h-10 w-auto"
                            priority
                        />
                    </Link>
                </div>
                <div className="flex items-center gap-5 lg:gap-12">
                    <nav className="hidden md:flex items-center gap-12">
                        {navItems.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    "relative py-2 font-medium transition-colors",
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
                    <Button variant="gradient">Get Early Access</Button>
                </div>


            </div>
        </header>
    );
}
