export interface FAQ {
  question: string;
  answer: string;
  category: string;
}

export const faqCategories = [
  "All",
  "Getting Started",
  "Invoice",
  "Payment Reminders",
  "Pocket CFO",
  "Pricing",
  "Taxation",
];

export const allFAQs: FAQ[] = [
  {
    question: "How do I sign up?",
    answer:
      "Give your phone number - that is it! After that, share your social handles, answer a couple of easy questions on your billing info, and you'll be sending invoices using Sparkonomy's AI quicker than a collab DM reply! (Psst! We are giving unlimited monthly invoices to our first users. Sign up quickly!)",
    category: "Getting Started",
  },
  {
    question: "How is this AI for creators and its smart payment useful for me?",
    answer:
      "Sparkonomy's AI was designed exclusively to help creators manage their businesses like a pro. The smart payments feature helps you send invoices fast and easy. Just share your chat or brand collab details, and we'll make a GST-ready invoice with no math, no stress, no chasing brands. Our Pocket CFO AI tracks your payments and cash flow, sending 5-minute weekly updates to keep you informed. And the best of all, Sparkonomy automatically tracks & sends friendly reminders for your payments on WhatsApp/email. You are always in control of who gets what, with quick 1-tap actions like - STOP, DELAY, or PAYMENT DONE. Earn More. Stress Less.",
    category: "Getting Started",
  },
  {
    question: "What information do I need to add to my profile to start invoicing?",
    answer:
      "Just share your name, address, PAN and payment details (UPI/Bank account). If you have a separate billing organization, add its PAN and registration like CIN or GSTIN. And, we know you are busy, so no typing is needed, just snap or upload a pic of the document. It takes less than 5 minutes and you have to do it only once!",
    category: "Invoice",
  },
  {
    question: "How do I create my first invoice?",
    answer:
      "Sparkonomy's creator AI helps you make an invoice in under 3-minutes with a few taps - and all from your phone! Our smart payments feature helps you get started fast. Duplicate an old invoice, upload a WhatsApp or email screenshot with billing instructions, or just type \"I need an invoice for...\" and watch one get built in for you. It's that easy to spark your invoice. Send a chat - get an invoice. Now, you will never be delayed in sending one!",
    category: "Invoice",
  },
  {
    question: "How will Sparkonomy make payment reminders on my behalf?",
    answer:
      "We know how frustrating it is to keep following up for the money you deserve! When you make your invoice, Sparkonomy asks how many reminders to send and how often. We'll send them to your client on WhatsApp and email. On the day of the reminder we ping you at 10AM and ask if you still want to send it and if you say yes, it goes at 3 PM. We only send four friendly nudges: a check-in, a soft poke, a late fee alert, and a final notice. You stay in control with quick replies like STOP, DELAY, or PAYMENT DONE. We chase, you create.",
    category: "Payment Reminders",
  },
  {
    question: "What is a pocket CFO and what will it do?",
    answer:
      "We know you don't want to be your creator business accountant, and yet you end up being one! Invoices made in Excel, Canva, or Word are impossible to manage and track. Sparkonomy's Pocket CFO AI agent analyses your payments & cash flows every week. Then it sends you quick weekly 5-minute updates on cash flow, overdue payments, and income growth. It keeps your records tidy and your business tax-ready. You go Pro, we get you there!",
    category: "Pocket CFO",
  },
  {
    question: "How much do I have to pay?",
    answer:
      "You can make up to 4 new invoices every month, send unlimited reminders, and get your own Pocket CFO - perfect for most creators. As your needs grow, you can switch to Pro by referring a few friends or for less than the price of a cup of coffee. (Psst! We are giving unlimited monthly invoices to our first users, Sign up quickly!)",
    category: "Pricing",
  },
  {
    question: "How will I calculate taxes on the invoice?",
    answer:
      "You don't want to keep doing back & forth with the brand on tax errors or worse meet the tax-man! If you are GST registered, Sparkonomy's AI takes care of it by picking the right GST code, splitting CGST/SGST/IGST, and making your invoice GST-ready automatically. We do the tax calculations & keep you compliance-ready, you do creation!",
    category: "Taxation",
  },
  {
    question: "Does the AI help calculate GST in India?",
    answer:
      "Yes! Sparkonomy's AI knows the Indian GST system inside out. It automatically picks the right service codes, calculates CGST/SGST/IGST splits and best of all - our invoice template follows the GST requirements to the tee! Let Sparkonomy do the hard work while you sparkle!",
    category: "Taxation",
  },
  {
    question: "What is the GST rate I must charge on my brand services?",
    answer:
      "You don't have to worry—Sparkonomy's AI takes care of GST for you! It automatically matches your service to the right HSN code, splits GST into IGST, SGST, or CGST, and makes sure every invoice is correct. If you're not GST-registered, Sparkonomy won't let you add GST, so there are no mistakes. Every invoice you make and send is error-free and compliant, saving you time and stress.",
    category: "Taxation",
  },
  {
    question: "How do I send an invoice to a brand?",
    answer:
      "The way you like it! After you finish your invoice, send it to the brand within Sparkonomy or download it and send a PDF personally over email/Whatsapp. No chasing, no hassle, just fast cash!",
    category: "Invoice",
  },
  {
    question: "Can I add my own logo to my invoices?",
    answer:
      "Yes! We know your invoices should reflect your unique brand. Upload a business logo, profile picture or just share your social accounts and we'll pull your profile photo to personalize your invoices—so they look just like yours! 1-tap to give every invoice that shiny, pro look.",
    category: "Invoice",
  },
  {
    question: "Can I use a Purchase Order (PO) to quickly create an invoice?",
    answer:
      "Absolutely. We know speed is everything. Instead of manually entering all the project details, you can upload the brand's Purchase Order (PO) when you tap \"Create Invoice.\" Our smart system will instantly break down the document and pre-fill all the basic details like the brand name, contact info, and sometimes even the rate - so you can verify the details and send the invoice even faster.",
    category: "Invoice",
  },
  {
    question: "I often delay sending my invoices because it feels like a chore, or I worry I'll make a mistake. Is this a big deal?",
    answer:
      "Yes! Delayed invoices mean brands start processing your payment later, which can push your payment cycle anywhere from 45 to 180 days—that's up to 6 months of waiting. We hate that delay too, so we made invoicing with Sparkonomy super simple and fast. Our 'Tap-to-Invoice' design and AI create 100% accurate, professional invoices in seconds. This means no errors or missing info that can hold up payments. By removing invoice mistakes and delays, we help you get paid faster, so you can focus fully on creating!",
    category: "Invoice",
  },
  {
    question: "Do your invoices support HSN or SAC codes?",
    answer:
      "Yes, absolutely! Sparkonomy's AI automatically fills in all the mandatory details, including the correct HSN/SAC codes (Services Accounting Code), for your service. This ensures every invoice is fully compliant, correctly classified, and meets all legal requirements for both your filing and your client's Input Tax Credit. With Sparkonomy, you don't have to worry about errors—our AI handles it all seamlessly!",
    category: "Invoice",
  },
  {
    question: "I believe there is an error on my invoice. What should I do?",
    answer:
      "If your invoice hasn't been sent yet, no worries—just go to your dashboard and use the edit option to make changes. If the invoice has been sent and you are not GST-registered, you can edit the invoice, but it's better practice to cancel the old one and send a new invoice to keep things clean. If you are GST-registered, you should cancel the existing invoice and create a fresh one. This helps keep your invoice serial numbers and dates correct. You can speed things up by duplicating the old invoice and making the necessary changes before sending. This approach helps with compliance and keeps your records tidy!",
    category: "Invoice",
  },
  {
    question: "I just changed my Payment Method. Will this affect my current invoice?",
    answer:
      "All invoices sent before your payment change will reflect the old payment details. Your updated payout information is saved and will be used for all future invoices and payouts, but make sure your new bank details are fully verified before the next payment date. If the old payment system no longer accepts money, you'll need to send a quick update to the brands where payment is still pending to avoid delays.",
    category: "Invoice",
  },
  {
    question: "What are the Sparkonomy steps for final collection and public disclosure of non-paying brands?",
    answer:
      "A brand ghosting your payment is not cool. We don't provide legal support for collections yet, but we've got some smart hacks to help you get paid. We'll suggest ways to draft strong follow-up messages and professional steps to encourage payment—without any drama. You stay in control, and we help you keep it smooth and professional.",
    category: "Payment Reminders",
  },
];

// Get a subset of FAQs for the homepage
export const getHomepageFAQs = (count: number = 6): FAQ[] => {
  return allFAQs.slice(0, count);
};
