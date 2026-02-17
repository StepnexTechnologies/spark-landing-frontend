# Sparkonomy Blog Writing Template

Follow this guide so your blog posts render correctly on the website. Each section below explains what tag/block to use and shows an example.

---

## Before Publishing

- [ ] Featured image uploaded (right sidebar → "Featured Image", at least 1200px wide)
- [ ] At least one category selected
- [ ] Yoast SEO filled in (SEO Title, Meta Description, Focus Keyphrase)

---

## Opening Paragraph

The very first block in your post must be a **Paragraph**. It shows as a description above the featured image.

> Managing your money doesn't have to be complicated. In this guide, we'll walk you through the basics of personal finance and give you actionable tips.

Do NOT start your post with a heading, image, or list.

---

## Headings

| Use | For |
|-----|-----|
| **H2** | Main sections |
| **H3** | Sub-sections inside an H2 |
| **H4** | Deeper sub-sections (rare) |

Never use H1 (reserved for the post title). Never use H6 (reserved for CTA-1 and CTA-2 banners). Always use the **Heading block** — don't just bold text.

---

## Table of Contents

| Block | What to Type |
|-------|-------------|
| **Heading H2** | Table of Contents |
| **List** (bullet) | Your section names, one per line |

> **H2:** Table of Contents
>
> **List:**
> - What Is Personal Finance?
> - 5 Tips for Better Budgeting
> - Key Takeaways
> - Frequently Asked Questions

List items must be in the **same order** as your H2 headings. The 1st item links to the 1st H2, 2nd to 2nd, etc.

---

## CTA-1 / CTA-2 (Promotional Banners)

You can add up to 2 banners. Place CTA-1 before Key Takeaways, CTA-2 after FAQ.

| Block | What to Type |
|-------|-------------|
| **Heading H6** | CTA-1 *(or CTA-2 for the second one)* |
| **Heading H3** | Your banner title |
| **Paragraph** | Subtitle text *(optional)* |
| **Paragraph** | Button text with → arrow *(make it a link)* |

> **H6:** CTA-1
>
> **H3:** Ready to Take Control of Your Finances?
>
> **Paragraph:** Join thousands who save smarter with Sparkonomy
>
> **Paragraph:** Get Started Free → *(make this a link to sparkonomy.com)*

The H6 is invisible on the site — it's just a marker. The button text must contain one of: **→** , **Get Started** , **Try Free** , or **Talk to**.

---

## Key Takeaways

| Block | What to Type |
|-------|-------------|
| **Heading H2** | Key Takeaways |
| **List** (bullet) | Your takeaway points |

> **H2:** Key Takeaways
>
> **List:**
> - Start tracking your spending today
> - Use the 50/30/20 rule for budgeting
> - Automate your savings

The list must come **immediately** after the heading — no paragraphs in between. Any H2 containing the word "takeaway" works.

---

## Frequently Asked Questions

| Block | What to Type |
|-------|-------------|
| **Heading H2** | Frequently Asked Questions |
| **Heading H3** | Question |
| **Paragraph** | Answer |
| *(repeat H3 + Paragraph for each Q&A)* | |

> **H2:** Frequently Asked Questions
>
> **H3:** What is Sparkonomy?
> **Paragraph:** Sparkonomy is a platform that helps you compare financial products.
>
> **H3:** Is it free to use?
> **Paragraph:** Yes, Sparkonomy is completely free for all users.

Each question **must be H3** — not a paragraph, not bold text. You can also use the **Accordion block** (AAB plugin or Gutenberg core) instead of H3 + Paragraph.

---

## Sources and References

| Block | What to Type |
|-------|-------------|
| **Heading H2** | Sources and References |
| **Numbered List** | Each source as a link |

> **H2:** Sources and References
>
> **Numbered List:**
> 1. How to Budget Your Money (nerdwallet.com) ← make this a link
> 2. The 50/30/20 Rule Explained (investopedia.com) ← make this a link

Format each source as: **Article Title (domain.com)** and make the whole text a link. The "(domain.com)" part is hidden automatically on the site.

Also accepted: **Sources** , **References** , **Sources & References**

---

## Pro Tip

| Block | What to Type |
|-------|-------------|
| **Paragraph** | Start with **Pro tip:** then your tip |

> **Paragraph:** Pro tip: Always compare at least three providers before signing up.

Automatically becomes a purple highlight box.

---

## Checkmarks

| Block | What to Type |
|-------|-------------|
| **Paragraph** | Start with **✅** then your point |

> **Paragraph:** ✅ Following these tips can save you up to 20% monthly.
>
> **Paragraph:** ✅ Most users see results within the first week.

Each point needs its own Paragraph block. The ✅ is replaced with a styled purple icon.

---

## Quotes

| Block | What to Type |
|-------|-------------|
| **Quote** or **Pullquote** | Your quote text |
| Citation field *(optional)* | Author name |

> **Quote:** A budget is telling your money where to go instead of wondering where it went.
> **Citation:** Dave Ramsey

Do NOT type quotation marks — the website adds purple quote marks automatically.

**To add an author photo:** Place a **Media & Text** block right after the quote — image on one side, author name on the other. The website converts it into a centered author display.

---

## Quick Reference — All Magic Headings

Copy-paste these exactly. **Spelling matters.**

| Type This | Heading Size | Creates |
|-----------|-------------|---------|
| Table of Contents | H2 | Clickable navigation |
| Key Takeaways | H2 | Purple-bordered summary box |
| Frequently Asked Questions | H2 | Collapsible accordion |
| Sources and References | H2 | Styled source links |
| CTA-1 | H6 | First promo banner |
| CTA-2 | H6 | Second promo banner |

---

## Common Mistakes

| Mistake | Fix |
|---------|-----|
| Post starts with a heading | First block must be a Paragraph |
| Misspelled heading (e.g. "Soruces") | Copy-paste from this guide |
| Bold text instead of Heading block | Use the Heading block from + menu |
| Typed " " marks inside Quote block | Delete them — added automatically |
| No featured image | Set it in the right sidebar |
| Empty blocks between sections | Delete empty blocks |
| Typed "CTA 1" with a space | Use CTA-1 (hyphen, no spaces) |
| FAQ questions as paragraphs | Each question must be Heading H3 |
| TOC list in wrong order | Match the order of your H2 headings |
