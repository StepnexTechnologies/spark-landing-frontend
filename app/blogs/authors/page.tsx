import type { Metadata } from "next";
import AuthorCard from "@/components/blog/AuthorCard";
import { authors } from "@/data/authors";
import { SITE_URL, authorUrl } from "@/lib/urls";

// Internal/placeholder profiles to keep off the public hub.
const HIDDEN_SLUGS = new Set(["dev-sparkonomy"]);

const visibleAuthors = authors.filter((a) => !HIDDEN_SLUGS.has(a.slug));

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Authors & Contributors | Sparkonomy",
  description:
    "Meet the Sparkonomy team and contributors writing on the creator economy, content monetization, and brand–creator partnerships.",
  alternates: { canonical: "/blogs/authors" },
  openGraph: {
    type: "website",
    siteName: "Sparkonomy",
    url: `${SITE_URL}/blogs/authors`,
    title: "Authors & Contributors | Sparkonomy",
    description: "Meet the Sparkonomy team and contributors.",
  },
};

export default function AuthorsIndexPage() {
  // CollectionPage + ItemList ties every author profile into one indexable hub,
  // reinforcing the author entities and giving crawlers a single page that links
  // to all of them (previously they were reachable only via post bylines).
  const collectionJsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Authors & Contributors",
    description: "The people behind Sparkonomy's writing on the creator economy.",
    url: `${SITE_URL}/blogs/authors`,
    isPartOf: { "@id": "https://www.sparkonomy.com/#website" },
    mainEntity: {
      "@type": "ItemList",
      itemListElement: visibleAuthors.map((a, i) => ({
        "@type": "ListItem",
        position: i + 1,
        url: authorUrl(a.slug),
        name: a.name,
      })),
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionJsonLd) }}
      />
      <section className="mx-auto max-w-5xl px-6 md:px-10 py-12 md:py-16">
        <header className="mb-8 md:mb-10">
          <h1 className="text-3xl md:text-4xl font-semibold text-gray-900">
            Authors &amp; Contributors
          </h1>
          <p className="mt-3 max-w-2xl text-base md:text-lg text-gray-600">
            The people behind Sparkonomy — founders and experts writing on the
            creator economy, monetization, and brand–creator partnerships.
          </p>
        </header>

        <div className="grid gap-6 md:grid-cols-2">
          {visibleAuthors.map((a) => (
            <AuthorCard
              key={a.slug}
              name={a.name}
              role={a.role}
              bio={a.shortBio}
              avatarUrl={a.avatarUrl}
              authorSlug={a.slug}
              previousCompanies={a.previousCompanies}
              previousCompaniesLabel={a.previousCompaniesLabel}
              socialLinks={a.socialLinks}
            />
          ))}
        </div>
      </section>
    </>
  );
}
