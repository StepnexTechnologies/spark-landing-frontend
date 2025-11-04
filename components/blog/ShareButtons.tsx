"use client";

interface ShareButtonsProps {
  title: string;
  url: string;
}

export default function ShareButtons({ title, url }: ShareButtonsProps) {
  const handleCopyLink = () => {
    if (typeof window !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(url);
      alert("Link copied to clipboard!");
    }
  };

  return (
    <div className="mt-16 pt-8 border-t border-gray-200">
      <h3 className="text-black text-lg font-semibold mb-4">Share this article</h3>
      <div className="flex gap-4">
        <a
          href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="px-6 py-2 bg-black hover:bg-gray-800 text-white rounded-lg transition-all"
        >
          Twitter
        </a>
        <a
          href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="px-6 py-2 bg-black hover:bg-gray-800 text-white rounded-lg transition-all"
        >
          LinkedIn
        </a>
        <button
          onClick={handleCopyLink}
          className="px-6 py-2 bg-gray-100 hover:bg-gray-200 text-black rounded-lg transition-all"
        >
          Copy Link
        </button>
      </div>
    </div>
  );
}
