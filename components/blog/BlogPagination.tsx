import Link from "next/link";

interface BlogPaginationProps {
  currentPage: number;
  totalPages: number;
  /** Route the pagination links point at. Defaults to the blog listing. */
  basePath?: string;
}


function pageHref(basePath: string, page: number): string {
  return page <= 1 ? `${basePath}#posts` : `${basePath}?page=${page}#posts`;
}


function buildPageItems(currentPage: number, totalPages: number): (number | "…")[] {
  const items: (number | "…")[] = [];
  const pushRange = (start: number, end: number) => {
    for (let p = start; p <= end; p++) items.push(p);
  };

  if (totalPages <= 7) {
    pushRange(1, totalPages);
    return items;
  }

  const windowStart = Math.max(2, currentPage - 1);
  const windowEnd = Math.min(totalPages - 1, currentPage + 1);

  items.push(1);
  if (windowStart > 2) items.push("…");
  pushRange(windowStart, windowEnd);
  if (windowEnd < totalPages - 1) items.push("…");
  items.push(totalPages);
  return items;
}

export default function BlogPagination({
  currentPage,
  totalPages,
  basePath = "/blogs",
}: BlogPaginationProps) {
  if (totalPages <= 1) return null;

  const items = buildPageItems(currentPage, totalPages);
  const hasPrev = currentPage > 1;
  const hasNext = currentPage < totalPages;

  const baseLink =
    "inline-flex items-center justify-center min-w-[40px] h-10 px-3 rounded-lg text-sm font-medium transition-colors";

  return (
    <nav
      aria-label="Blog pagination"
      className="flex items-center justify-center gap-2 flex-wrap"
    >
      {/* Previous */}
      {hasPrev ? (
        <Link
          href={pageHref(basePath, currentPage - 1)}
          rel="prev"
          aria-label="Previous page"
          className={`${baseLink} text-gray-700 border border-gray-200 hover:border-purple-400 hover:text-purple-600`}
        >
          ←
        </Link>
      ) : (
        <span
          aria-disabled="true"
          className={`${baseLink} text-gray-300 border border-gray-100 cursor-not-allowed`}
        >
          ←
        </span>
      )}

      {/* Page numbers */}
      {items.map((item, i) =>
        item === "…" ? (
          <span
            key={`gap-${i}`}
            className="inline-flex items-center justify-center min-w-[40px] h-10 text-gray-400"
          >
            …
          </span>
        ) : item === currentPage ? (
          <span
            key={item}
            aria-current="page"
            className={`${baseLink} bg-purple-600 text-white`}
          >
            {item}
          </span>
        ) : (
          <Link
            key={item}
            href={pageHref(basePath, item)}
            aria-label={`Page ${item}`}
            className={`${baseLink} text-gray-700 border border-gray-200 hover:border-purple-400 hover:text-purple-600`}
          >
            {item}
          </Link>
        )
      )}

      {/* Next */}
      {hasNext ? (
        <Link
          href={pageHref(basePath, currentPage + 1)}
          rel="next"
          aria-label="Next page"
          className={`${baseLink} text-gray-700 border border-gray-200 hover:border-purple-400 hover:text-purple-600`}
        >
          →
        </Link>
      ) : (
        <span
          aria-disabled="true"
          className={`${baseLink} text-gray-300 border border-gray-100 cursor-not-allowed`}
        >
          →
        </span>
      )}
    </nav>
  );
}
