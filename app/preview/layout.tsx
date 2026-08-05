import BlogHeader from "@/components/blog/BlogHeader";
import BlogFooter from "@/components/blog/BlogFooter";

export default function PreviewLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // No local font instance here on purpose — preview must inherit the root
  // layout's Roboto (400/700) exactly like /blogs does, or weight-500 text
  // (pullquotes, FAQ questions, CTA buttons) renders heavier than on the blog.
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <BlogHeader />
      <main className="flex-1">{children}</main>
      <BlogFooter />
    </div>
  );
}
