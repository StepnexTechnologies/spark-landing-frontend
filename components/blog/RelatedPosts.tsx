import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface RelatedPost {
  slug: string;
  title: string;
  excerpt: string;
  featuredImage: string;
  date: string;
}

interface RelatedPostsProps {
  posts: RelatedPost[];
}

export default function RelatedPosts({ posts }: RelatedPostsProps) {
  if (posts.length === 0) return null;

  return (
    <section className="">
      <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
        Also Read
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map((post) => (
          <Link
            key={post.slug}
            href={`/blogs/${post.slug}`}
            className="group block rounded-2xl overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="relative w-full aspect-video">
              <Image
                src={post.featuredImage}
                alt={post.title}
                fill
                className="object-cover"
              />
            </div>
            <div className="p-6">
              <p className="text-sm text-gray-500 mb-2">{post.date}</p>
              <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-purple-600 transition-colors">
                {post.title}
              </h3>
              <p className="text-gray-600 text-sm line-clamp-3 mb-4">
                {post.excerpt}
              </p>
              <span className="inline-flex items-center gap-2 text-sm font-medium text-purple-600 group-hover:gap-3 transition-all">
                Read More
                <ArrowRight className="w-4 h-4" />
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
