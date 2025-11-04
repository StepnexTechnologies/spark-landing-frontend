"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import type { WordPressPost } from "@/types/wordpress";
import { getFeaturedImageUrl, formatDate, getExcerpt, stripHtml } from "@/lib/wordpress-improved";

interface BlogCardProps {
  post: WordPressPost;
  index?: number;
}

export default function BlogCard({ post, index = 0 }: BlogCardProps) {
  const featuredImage = getFeaturedImageUrl(post, "medium");
  const publishDate = formatDate(post.date);
  const excerpt = getExcerpt(post, 150);
  const cleanTitle = stripHtml(post.title.rendered);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      className="group"
    >
      <Link href={`/blogs/${post.slug}`} className="block">
        <article className="relative rounded-lg overflow-hidden bg-white border border-gray-200 hover:border-purple-500/50 transition-all duration-300 hover:shadow-lg">
          {/* Featured Image */}
          {featuredImage && (
            <div className="relative w-full h-[280px] overflow-hidden">
              <Image
                src={featuredImage}
                alt={cleanTitle}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            </div>
          )}

          {/* Content */}
          <div className="p-6 space-y-3">
            {/* Title */}
            <h2
              className="text-2xl font-bold text-gray-900 line-clamp-2 group-hover:text-purple-600 transition-colors"
              dangerouslySetInnerHTML={{ __html: post.title.rendered }}
            />

            {/* Date */}
            <p className="text-sm text-gray-500">
              {publishDate}
            </p>

            {/* Excerpt */}
            <p className="text-base text-gray-700 line-clamp-3 leading-relaxed">
              {excerpt}
            </p>

            {/* Read More Indicator */}
            <div className="flex items-center gap-2 text-purple-600 group-hover:text-purple-700 transition-colors pt-2">
              <span className="text-sm font-medium">Read more</span>
              <svg
                className="w-4 h-4 transition-transform group-hover:translate-x-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </div>
          </div>
        </article>
      </Link>
    </motion.div>
  );
}
