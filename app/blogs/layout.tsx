import BlogHeader from "@/components/blog/BlogHeader";

export default function BlogsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-white">
      <BlogHeader />
      {children}
    </div>
  );
}
