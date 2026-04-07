# Sparkonomy Landing Frontend

Marketing site and waitlist for Sparkonomy — an AI platform for the creator economy. Includes a WordPress-integrated blog, animated hero, Instagram-style stories, and multi-page creator/brand funnels.

## Tech Stack

- **Framework:** Next.js 16 (App Router, Turbopack) + React 19 + TypeScript 5
- **Styling:** Tailwind CSS 3.4, `tailwind-merge`, `tailwindcss-animate`, `clsx`
- **Animation:** Framer Motion 12, GSAP 3, `webgl-fluid-enhanced`
- **Forms:** `@tanstack/react-form`, `react-phone-number-input`, `libphonenumber-js`
- **i18n:** `i18next` + `react-i18next` (browser detector + http backend)
- **UI:** `lucide-react` icons, `embla-carousel-react`, `react-hot-toast`
- **Analytics:** `@vercel/analytics`, `@vercel/speed-insights`
- **Content:** WordPress REST API v2 (external CMS)
- **Package manager:** Yarn 1.22

## Scripts

```bash
yarn dev      # next dev --turbopack
yarn build    # next build
yarn start    # next start
yarn lint     # next lint
```

## Project Structure

```
app/                          # Next.js App Router
├── page.tsx                 # Homepage (animated WebGL hero + waitlist)
├── layout.tsx               # Root layout
├── root-layout-client.tsx   # Client-side providers
├── robots.ts                # Dynamic robots.txt
├── globals.css
├── about/                   # About page
├── contact/                 # Contact form
├── thank-you/               # Waitlist confirmation
├── welcome/                 # Welcome flow
├── preview/                 # Preview routes
├── founders-only-invite/    # Gated invite page
├── muj-exclusive-invite/    # Gated invite page
├── api/
│   └── geolocation/         # Geo API route
├── blogs/                   # WordPress-backed blog
│   ├── page.tsx            # Listing
│   ├── layout.tsx
│   ├── sitemap.ts
│   ├── wordpress-content.css
│   ├── [slug]/             # Post detail
│   ├── author/             # Author pages 
│   ├── brand/              # Category
│   ├── creators/           # Category
│   ├── company/            # Category
│   └── subscribe/          # Newsletter
├── creator/
│   ├── page.tsx
│   └── earn/               # Creator earn funnel
│       ├── CreatorEarnPage.tsx
│       ├── layout.tsx
│       ├── page.tsx
│       └── faqs/
└── legal/
    ├── layout.tsx
    ├── privacy-policy/
    ├── terms/
    └── refund-policy/

components/
├── HeroSection.tsx               # Main hero with GSAP/WebGL
├── EmailCapture.tsx              # Waitlist email/phone capture
├── Footer.tsx, LegalFooter.tsx
├── CampaignTrackerCTA.tsx
├── webgl-fluid-background.tsx    # Fluid sim background
├── LogoCarousel.tsx
├── I18nProvider.tsx              # i18next provider
├── LanguageSwitcher.tsx
├── ReferralClickTracker.tsx
├── blog/                         # Blog UI + WordPress content enhancers
│   ├── BlogCard / FeaturedBlogCard / *Skeleton
│   ├── BlogHeader / BlogFooter / BlogLanguageSwitcher
│   ├── AuthorCard / AuthorPageTemplate
│   ├── TableOfContents / CustomTableOfContents / TOCEnhancer
│   ├── *Enhancer.tsx             # Post-processors for WP HTML
│   ├── FAQAccordion / RelatedPosts / RelatedResources
│   ├── NewsletterSection / PromoBanner / ShareButtons
│   ├── WordPressEmbed / ImageWithFallback
│   └── section-registry.ts
├── creator/earn/                 # Earn funnel components
│   ├── Hero / Value / Benefits / Advantage / Testimonials
│   ├── Video / FAQ / CTA / FloatingCTA / EarnFooter
│   └── stories/                  # Instagram-style intro stories
├── form/                         # CountrySelector, PhoneInput, ToggleInput
└── common/                       # Shared primitives (button, etc.)

lib/
├── utils.ts                      # cn() Tailwind helper
├── i18n.ts                       # i18next config
├── wordpress.ts                  # WordPress REST client
├── wordpress-improved.ts
├── wordpress-html.ts             # HTML sanitization/transform
├── content-processor.ts          # Post-process WP content
├── section-parser.ts             # Parse WP sections
├── style.css
├── data/
└── hooks/                        # incl. useSubmitEmail

types/                            # TypeScript definitions (WordPress, etc.)
public/                           # Static assets, sitemap, llms.txt
```

## Key Architectural Notes

- **App Router only.** Server Components by default; mark interactive components `"use client"`. Root client providers live in `app/root-layout-client.tsx`.
- **WordPress integration.** Posts come from external WP REST API via `lib/wordpress.ts` (+ `wordpress-improved.ts`). Raw HTML is run through `content-processor.ts` / `wordpress-html.ts` and a chain of `*Enhancer.tsx` components in `components/blog/` to inject TOC, FAQs, promos, related posts, etc. When changing blog rendering, check both the parser (`lib/`) and the enhancers (`components/blog/`).
- **Animations.** Homepage uses a GSAP timeline + `webgl-fluid-background.tsx`. Most other animations use Framer Motion (scroll/hover). Don't mix the two on the same element.
- **i18n.** Configured via `lib/i18n.ts` and `components/I18nProvider.tsx`. Blog has its own `BlogLanguageSwitcher`.
- **Forms.** Built with `@tanstack/react-form`. Phone capture uses `react-phone-number-input` + `libphonenumber-js`. Email submission flows through `lib/hooks/useSubmitEmail`.
- **Geo / referrals.** `app/api/geolocation/` route + `ReferralClickTracker.tsx` on the client.
- **SEO.** Per-route `metadata` exports, `app/robots.ts`, `app/blogs/sitemap.ts`, plus static `public/sitemap.xml` and `public/llms.txt`.

## Conventions

- TypeScript strict; path alias `@/*` (see `tsconfig.json`).
- Tailwind utility-first; merge classes with `cn()` from `lib/utils.ts`.
- Components are PascalCase `.tsx`; colocate feature components under `components/<feature>/`.
- Keep blog HTML enhancers small and composable — one transform per file.
- New pages → `app/<route>/page.tsx` with `metadata` export. New funnel sections → `components/creator/earn/`.

## Environment

- See `.env.example` for required vars (WordPress API base, waitlist backend, etc.).
- Node 20+. Yarn 1.x (do not switch to npm/pnpm without coordinating — `yarn.lock` is committed).

## Reference Docs (in repo)

- `COMPLETE_PROJECT_REPORT.md` — full feature/page walkthrough
- `WORDPRESS_BLOG_GUIDE.md` — blog/WordPress integration details
