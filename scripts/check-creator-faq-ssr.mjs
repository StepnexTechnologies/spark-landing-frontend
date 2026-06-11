import fs from "node:fs";
import path from "node:path";

const faqHtmlPath = path.join(
  process.cwd(),
  ".next",
  "server",
  "app",
  "creator",
  "earn",
  "faqs.html",
);

if (!fs.existsSync(faqHtmlPath)) {
  console.error(`Missing generated FAQ HTML: ${faqHtmlPath}`);
  console.error("Run `yarn build` before this check.");
  process.exit(1);
}

const html = fs.readFileSync(faqHtmlPath, "utf8");
const requiredContent = [
  "Frequently Asked Questions",
  "Q1: How do I sign up?",
  "Q8: How will I calculate taxes on the invoice?",
  "Q11: Can I add my own logo to my invoices?",
  "Give your phone number",
  "Upload a business logo",
  "Creator FAQs: Invoicing, Payments &amp; Taxes | Sparkonomy",
  "https://www.sparkonomy.com/creator/earn/faqs",
];

const missingContent = requiredContent.filter((content) => !html.includes(content));

if (missingContent.length > 0) {
  console.error("Creator FAQ content is missing from the generated HTML:");
  for (const content of missingContent) {
    console.error(`- ${content}`);
  }
  process.exit(1);
}

if (html.includes(">Loading...</")) {
  console.error("Creator FAQ route still renders the page-wide loading fallback.");
  process.exit(1);
}

console.log("Creator FAQ content is present in the generated HTML.");
