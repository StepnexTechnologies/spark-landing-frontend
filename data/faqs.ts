export interface FAQ {
  question: string;
  answer: string;
  category: string;
}

export const faqCategories = [
  "All",
  "Payment Related",
  "Invoice related",
  "Security",
  "Features",
  "Pricing",
];

export const allFAQs: FAQ[] = [
  {
    question: "Q1: How much will RTCT cost after the private beta?",
    answer:
      "We are still finalizing the pricing structure. As a thank you for being a beta partner, you will receive an exclusive, significant discount when we launch publicly. For now, access is completely free with no commitment required.",
    category: "Pricing",
  },
  {
    question: "Q2: Is this difficult to set up? Do I need a developer?",
    answer:
      "Absolutely not. RTCT is designed for marketers, by marketers. You can set up a complete campaign tracker in under 100 seconds without writing a single line of code. If you can write an email, you can launch a tracker.",
    category: "Features",
  },
  {
    question: "Q3: What social media platforms does the tracker support?",
    answer:
      "During this private beta, RTCT will actively track Instagram (Reels, Stories, Feed Posts) and YouTube. We're already working to expand support for other platforms based on feedback from partners like you. For the richest insights, we securely request view access to your creators' accounts, always respecting privacy and platform guidelines. We encourage you to give your creators a heads-up; it ensures the most accurate data and truly empowers your campaigns.",
    category: "Features",
  },
  {
    question: "Q4: How often is the data refreshed, and how do Smart Alerts work?",
    answer:
      "Data is refreshed in real-time. Smart Alerts notify you instantly when important events occur, such as when a payment is received or an invoice is overdue.",
    category: "Features",
  },
  {
    question: "Q5: How is my campaign data kept secure and confidential?",
    answer:
      "We use industry-standard encryption and security measures to protect your data. All information is stored securely and never shared with third parties.",
    category: "Security",
  },
  {
    question: "Q6: What happens after the private beta? Do I lose my data or access?",
    answer:
      "Your data and access remain intact after the beta. As a beta partner, you'll receive an exclusive discount when we launch publicly.",
    category: "Pricing",
  },
  {
    question: "Q7: Can I customize my invoices?",
    answer:
      "Yes! You can fully customize your invoices with your branding, colors, and logo to maintain a professional image.",
    category: "Invoice related",
  },
  {
    question: "Q8: What payment methods do you support?",
    answer:
      "We support all major payment methods including bank transfers, UPI, credit cards, and digital wallets.",
    category: "Payment Related",
  },
  {
    question: "Q9: How do I track payment status?",
    answer:
      "You can track all payment statuses in real-time through your dashboard. You'll receive notifications for pending, paid, and overdue invoices.",
    category: "Payment Related",
  },
  {
    question: "Q10: Is there a mobile app available?",
    answer:
      "We're currently working on mobile apps for both iOS and Android. In the meantime, our web platform is fully mobile-responsive.",
    category: "Features",
  },
  {
    question: "Q11: Can I send automated payment reminders?",
    answer:
      "Yes! You can set up automated payment reminders that will be sent to your clients before and after the due date.",
    category: "Payment Related",
  },
  {
    question: "Q12: Do you provide GST-compliant invoices?",
    answer:
      "Absolutely! All invoices are GST-compliant and include all necessary tax details as per Indian regulations.",
    category: "Invoice related",
  },
  {
    question: "Q13: Can I export my invoice data?",
    answer:
      "Yes, you can export all your invoice data in multiple formats including PDF, Excel, and CSV for your records and accounting.",
    category: "Invoice related",
  },
];

// Get a subset of FAQs for the homepage
export const getHomepageFAQs = (count: number = 6): FAQ[] => {
  return allFAQs.slice(0, count);
};
