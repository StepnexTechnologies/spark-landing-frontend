"use client";

import BlogHeader from "@/components/blog/BlogHeader";
import BlogFooter from "@/components/blog/BlogFooter";
import { Roboto } from "next/font/google";
import { usePathname } from "next/navigation";

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
});

export default function BlogsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isEmbed = pathname?.startsWith("/blogs/tools/embed");

  if (isEmbed) {
    return <div className={roboto.className}>{children}</div>;
  }

  return (
    <div className={`min-h-screen bg-white flex flex-col ${roboto.className}`}>
      <BlogHeader />
      <main className="flex-1">{children}</main>
      <BlogFooter />
    </div>
  );
}
