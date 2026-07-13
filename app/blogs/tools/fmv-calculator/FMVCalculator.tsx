"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Calculator, Copy, Share2, Check } from "lucide-react";

// ──────────────────────────────────────────
//  HELPERS
// ──────────────────────────────────────────
const inr = (amount: number | null | undefined): string => {
  if (amount === null || amount === undefined || isNaN(amount)) return "—";
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
};

// Format raw digit string with Indian comma grouping for display in inputs
const formatWithCommas = (s: string): string => {
  if (!s) return "";
  const n = parseFloat(s);
  if (isNaN(n)) return "";
  return new Intl.NumberFormat("en-IN").format(n);
};

// Strip everything except digits — used when reading user typed input
const parseDigits = (s: string): string => s.replace(/[^\d]/g, "");

const numOr0 = (s: string): number => {
  const v = parseFloat(s);
  return isNaN(v) || v < 0 ? 0 : v;
};

// 194R aggregate benefit threshold for a financial year (Section 194R).
const TDS_194R_THRESHOLD = 20000;

// ──────────────────────────────────────────
//  FMV CALCULATION  (mirrors the Sparkonomy FMV sheet logic)
// ──────────────────────────────────────────
type Form = {
  mrp: string;
  marketPrice: string;
  brandValue: string;
  marketplaceValue: string;
  paid: string;
  cashFee: string;
  usualFee: string;
  brandFYDeals: string;
  otherTaxes: string;
  gstRegistered: string; // "yes" | "no"
  gstRate: string; // percentage as string, e.g. "18"
  sameState: string; // "yes" | "no" | "notsure"
};

const initialForm: Form = {
  mrp: "",
  marketPrice: "",
  brandValue: "",
  marketplaceValue: "",
  paid: "",
  cashFee: "",
  usualFee: "",
  brandFYDeals: "",
  otherTaxes: "",
  gstRegistered: "no",
  gstRate: "18",
  sameState: "notsure",
};

type Result = {
  recommendedFMV: number;
  fmvSource: string;
  barterFMV: number;
  cashServiceFee: number;
  totalDealBeforeGST: number;
  gstServiceValue: number;
  gstAmount: number;
  otherTaxes: number;
  totalDocumented: number;
  thresholdCheckValue: number;
  is194R: boolean;
  tds194R: number;
  gstSplitNote: string;
  recordNote: string;
};

function compute(form: Form): Result {
  const mrp = numOr0(form.mrp);
  const marketPrice = numOr0(form.marketPrice);
  const brandValue = numOr0(form.brandValue);
  const marketplaceValue = numOr0(form.marketplaceValue);
  const paid = numOr0(form.paid);
  const cashFee = numOr0(form.cashFee);
  const usualFee = numOr0(form.usualFee);
  const brandFYDeals = numOr0(form.brandFYDeals);
  const otherTaxes = numOr0(form.otherTaxes);
  const gstRegistered = form.gstRegistered === "yes";
  const gstRate = numOr0(form.gstRate);

  // Recommended FMV — lowest non-zero of the three "current" sources.
  // MRP is a fallback used only when no current source is entered.
  const currentSources: [number, string][] = [
    [marketPrice, "market price when received"],
    [brandValue, "brand confirmed value"],
    [marketplaceValue, "marketplace value"],
  ];
  const nonZero = currentSources.filter(([v]) => v > 0);
  let recommendedFMV: number;
  let fmvSource: string;
  if (nonZero.length > 0) {
    const lowest = nonZero.reduce((a, b) => (b[0] < a[0] ? b : a));
    recommendedFMV = lowest[0];
    fmvSource = `Lowest reliable current value (${lowest[1]}).`;
  } else {
    recommendedFMV = mrp;
    fmvSource = mrp > 0 ? "MRP fallback (no current source entered)." : "No value entered yet.";
  }

  // Barter FMV to record as income = FMV minus anything the creator paid.
  const barterFMV = Math.max(0, recommendedFMV - paid);

  const cashServiceFee = cashFee;
  const totalDealBeforeGST = cashServiceFee + barterFMV;

  // GST service value = higher of usual cash fee and total deal value (only if GST registered).
  const gstServiceValue = gstRegistered
    ? Math.max(usualFee, totalDealBeforeGST)
    : 0;
  const gstAmount = gstRegistered ? Math.round((gstServiceValue * gstRate) / 100) : 0;

  const totalDocumented = totalDealBeforeGST + gstAmount + otherTaxes;

  // 194R annual, brand-side alert.
  const thresholdCheckValue = brandFYDeals + barterFMV;
  const is194R = thresholdCheckValue > TDS_194R_THRESHOLD;
  const tds194R = is194R ? Math.round(barterFMV * 0.1) : 0;

  // GST split note.
  let gstSplitNote: string;
  if (!gstRegistered) {
    gstSplitNote = "No GST added because GST registered = No";
  } else if (gstAmount <= 0) {
    gstSplitNote = "GST registered, but no GST value to split on these inputs.";
  } else if (form.sameState === "yes") {
    const half = Math.round(gstAmount / 2);
    gstSplitNote = `Same state → CGST ${inr(half)} + SGST ${inr(gstAmount - half)}.`;
  } else if (form.sameState === "no") {
    gstSplitNote = `Different state → IGST ${inr(gstAmount)}.`;
  } else {
    gstSplitNote = `Confirm place of supply with your CA — CGST+SGST if same state, IGST (${inr(gstAmount)}) if different.`;
  }

  const recordNote =
    barterFMV > 0
      ? `Record ${inr(barterFMV)} as barter FMV. Keep price proof and brand communication with your tax records.`
      : "Enter at least one value source to generate your record note.";

  return {
    recommendedFMV,
    fmvSource,
    barterFMV,
    cashServiceFee,
    totalDealBeforeGST,
    gstServiceValue,
    gstAmount,
    otherTaxes,
    totalDocumented,
    thresholdCheckValue,
    is194R,
    tds194R,
    gstSplitNote,
    recordNote,
  };
}

// ──────────────────────────────────────────
//  COMPONENT
// ──────────────────────────────────────────
const FMVCalculator = ({ embed = false }: { embed?: boolean } = {}) => {
  const [form, setForm] = useState<Form>(initialForm);
  const [result, setResult] = useState<Result | null>(null);
  const [valueError, setValueError] = useState(false);
  const [copyState, setCopyState] = useState<"idle" | "ok">("idle");
  const [shareState, setShareState] = useState<"idle" | "ok">("idle");
  const everCalced = useRef(false);
  const resultsRef = useRef<HTMLDivElement>(null);

  const update = <K extends keyof Form>(key: K, value: Form[K]) => {
    setForm((f) => ({ ...f, [key]: value }));
  };

  const hasAnyValue = (f: Form) =>
    numOr0(f.marketPrice) > 0 ||
    numOr0(f.brandValue) > 0 ||
    numOr0(f.marketplaceValue) > 0 ||
    numOr0(f.mrp) > 0;

  const calculate = () => {
    if (!hasAnyValue(form)) {
      setValueError(true);
      setTimeout(() => setValueError(false), 2000);
      return;
    }

    setResult(compute(form));

    if (!everCalced.current) {
      everCalced.current = true;
      setTimeout(
        () =>
          resultsRef.current?.scrollIntoView({
            behavior: "smooth",
            block: "start",
          }),
        80,
      );
    }
  };

  // Live recalc once user has seen results
  useEffect(() => {
    if (everCalced.current && hasAnyValue(form)) setResult(compute(form));
  }, [form]);

  // Read URL params on mount (shareable scenarios)
  useEffect(() => {
    if (typeof window === "undefined") return;
    const p = new URLSearchParams(window.location.search);
    const map: Record<string, keyof Form> = {
      mrp: "mrp",
      market: "marketPrice",
      brand: "brandValue",
      place: "marketplaceValue",
      paid: "paid",
      cash: "cashFee",
      usual: "usualFee",
      fy: "brandFYDeals",
      other: "otherTaxes",
      gst: "gstRegistered",
      rate: "gstRate",
      state: "sameState",
    };
    if (![...Object.keys(map)].some((k) => p.has(k))) return;

    const next: Partial<Form> = {};
    Object.entries(map).forEach(([urlKey, formKey]) => {
      if (p.has(urlKey)) {
        (next as Record<string, string>)[formKey] = p.get(urlKey) ?? "";
      }
    });
    setForm((f) => ({ ...f, ...next }));
    setTimeout(() => {
      everCalced.current = true;
    }, 120);
  }, []);

  const buildShareURL = (): string => {
    if (typeof window === "undefined") return "";
    const base = window.location.origin + window.location.pathname;
    const p = new URLSearchParams();
    p.set("mrp", form.mrp || "");
    p.set("market", form.marketPrice || "");
    p.set("brand", form.brandValue || "");
    p.set("place", form.marketplaceValue || "");
    p.set("paid", form.paid || "");
    p.set("cash", form.cashFee || "");
    p.set("usual", form.usualFee || "");
    p.set("fy", form.brandFYDeals || "");
    p.set("other", form.otherTaxes || "");
    p.set("gst", form.gstRegistered || "no");
    p.set("rate", form.gstRate || "18");
    p.set("state", form.sameState || "notsure");
    return base + "?" + p.toString();
  };

  const copyResults = () => {
    if (!result) return;
    const shareURL = buildShareURL();
    const text = [
      "🧾 My Barter FMV Summary (Sparkonomy)",
      "━━━━━━━━━━━━━━━━━━━━━━━━━━━",
      `Recommended FMV: ${inr(result.recommendedFMV)}`,
      `Barter FMV to record as income: ${inr(result.barterFMV)}`,
      `Total deal value before GST: ${inr(result.totalDealBeforeGST)}`,
      result.gstAmount > 0 ? `GST amount: ${inr(result.gstAmount)}` : "",
      `Total documented campaign value: ${inr(result.totalDocumented)}`,
      `194R status: ${result.is194R ? "May be triggered — confirm with the brand" : "No 194R trigger on current inputs"}`,
      result.is194R ? `Indicative 194R TDS: ${inr(result.tds194R)}` : "",
      "",
      result.recordNote,
      "",
      "📌 Run your own numbers:",
      shareURL,
      "",
      "— Free tool by Sparkonomy (sparkonomy.com)",
      "  Built for Indian content creators · Not tax advice",
    ]
      .filter((l) => l !== "")
      .join("\n");

    navigator.clipboard
      .writeText(text)
      .then(() => {
        setCopyState("ok");
        setTimeout(() => setCopyState("idle"), 2200);
      })
      .catch(() => {
        const ta = document.createElement("textarea");
        ta.value = text;
        ta.style.position = "fixed";
        ta.style.opacity = "0";
        document.body.appendChild(ta);
        ta.select();
        document.execCommand("copy");
        document.body.removeChild(ta);
        setCopyState("ok");
        setTimeout(() => setCopyState("idle"), 2200);
      });
  };

  const shareCalculator = () => {
    const url = buildShareURL();
    if (typeof navigator !== "undefined" && (navigator as Navigator).share) {
      navigator
        .share({
          title: "Creator Barter FMV Calculator — Sparkonomy",
          text: "Work out the fair market value of a barter/gifting deal. Free tool by Sparkonomy:",
          url,
        })
        .catch(() => {});
      return;
    }
    navigator.clipboard
      .writeText(url)
      .then(() => {
        setShareState("ok");
        setTimeout(() => setShareState("idle"), 2200);
      })
      .catch(() => {
        setShareState("ok");
        setTimeout(() => setShareState("idle"), 2200);
      });
  };

  // ──────────────────────────────────────────
  //  STYLES (blog theme — white, #212529 / #999999 / #F2F2F2 / #9747FF)
  // ──────────────────────────────────────────
  const inputCls =
    `w-full rounded-xl border border-[#F2F2F2] bg-white px-4 text-gray-600 placeholder:text-gray-400 outline-none transition focus:border-[#9747FF] ${
      embed ? "py-2.5 text-sm" : "py-3"
    }`;
  const inputWithPrefixCls = inputCls + " pl-8";
  const labelCls =
    `flex items-center gap-2 text-sm font-medium text-[#212529] ${
      embed ? "mb-1.5" : "mb-2"
    }`;

  const Tip = ({ text }: { text: string }) => (
    <span className="group relative inline-flex h-4 w-4 cursor-help items-center justify-center rounded-full bg-[#F2F2F2] text-[10px] font-bold text-[#9747FF]">
      i
      <span className="pointer-events-none absolute bottom-full left-1/2 z-50 mb-2 w-52 -translate-x-1/2 rounded-lg bg-[#212529] px-3 py-2 text-[11px] font-normal leading-snug text-white opacity-0 transition-opacity group-hover:opacity-100">
        {text}
      </span>
    </span>
  );

  // Reusable ₹ numeric field.
  // NOTE: called as a function — Money({...}) — NOT rendered as <Money/>. Defining
  // a component inside render and using it as JSX remounts the <input> every
  // keystroke (focus loss); a direct call reconciles by position and keeps focus.
  const MoneyField = ({
    id,
    label,
    tip,
    placeholder,
    field,
    highlightError = false,
  }: {
    id: string;
    label: string;
    tip: string;
    placeholder: string;
    field: keyof Form;
    highlightError?: boolean;
  }) => (
    <div>
      <label className={labelCls} htmlFor={id}>
        {label}
        <Tip text={tip} />
      </label>
      <div className="relative">
        <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm font-semibold text-[#999999]">
          ₹
        </span>
        <input
          id={id}
          type="text"
          inputMode="numeric"
          placeholder={placeholder}
          className={
            inputWithPrefixCls +
            (highlightError && valueError
              ? " border-red-500 ring-2 ring-red-500/30"
              : "")
          }
          value={formatWithCommas(form[field])}
          onChange={(e) => update(field, parseDigits(e.target.value))}
        />
      </div>
    </div>
  );

  // Rows for the detailed breakdown table
  const breakdownRows: { label: string; value: string; note: string; strong?: boolean }[] =
    result
      ? [
          {
            label: "Recommended FMV",
            value: inr(result.recommendedFMV),
            note: result.fmvSource,
            strong: true,
          },
          {
            label: "Barter FMV to record as income",
            value: inr(result.barterFMV),
            note: "Recommended FMV minus anything you paid.",
            strong: true,
          },
          {
            label: "Cash service fee",
            value: inr(result.cashServiceFee),
            note: "Cash paid by the brand for this deal.",
          },
          {
            label: "Total deal value before GST",
            value: inr(result.totalDealBeforeGST),
            note: "Cash fee + barter FMV.",
          },
          {
            label: "GST service value before tax",
            value: inr(result.gstServiceValue),
            note: "Higher of usual cash fee and total deal value (only if GST registered).",
          },
          {
            label: "GST amount",
            value: inr(result.gstAmount),
            note: "GST service value × GST rate (only if GST registered).",
          },
          {
            label: "Other taxes / charges",
            value: inr(result.otherTaxes),
            note: "From the optional input row.",
          },
          {
            label: "Total documented campaign value",
            value: inr(result.totalDocumented),
            note: "Total deal value + GST + other taxes/charges.",
            strong: true,
          },
          {
            label: "194R threshold check value",
            value: inr(result.thresholdCheckValue),
            note: "Earlier deals from this brand this FY + current barter FMV.",
          },
          {
            label: "Indicative 194R TDS on this deal",
            value: inr(result.tds194R),
            note: "10% × barter FMV, only when the ₹20,000 annual threshold is crossed.",
          },
        ]
      : [];

  return (
    <div className="bg-white text-[#212529] w-full max-w-full">
      <div
        className={`mx-auto max-w-3xl sm:px-6 lg:px-8 ${
          embed ? "px-3 pb-6 pt-4" : "px-4 pb-20 pt-10"
        }`}
      >
        {!embed && (
          <>
            {/* HERO */}
            <div className="text-center pb-8 ">
              <span className="inline-block rounded-full border border-[#F2F2F2] bg-white px-4 py-1 text-[11px] font-bold uppercase tracking-wider text-[#9747FF]">
                For barter · gifting · PR deals
              </span>
              <h1
                className="mt-5 pb-2 text-3xl sm:text-4xl md:text-5xl font-semibold leading-tight tracking-tight"
                style={{
                  background:
                    "linear-gradient(135deg, #DD2A7B 0%, #9747FF 50%, #334CCA 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                What&apos;s that free product
                <br /> <em className="not-italic">actually</em> worth on paper?
              </h1>
              <p className="mt-4 text-[#999999] max-w-xl mx-auto">
                Got a product, stay, voucher, or any non-cash perk for content?
                Enter what you know and get a simple FMV, GST value, and 194R
                alert in 30 seconds.
              </p>
            </div>

            {/* INTRO */}
            <div className="mb-8 border border-[#F2F2F2] bg-white p-5 text-sm leading-relaxed text-[#999999]" style={{ borderRadius: "34px" }}>
              <p>
                When a brand gives you a{" "}
                <strong className="text-[#212529] font-semibold">non-cash benefit</strong>{" "}
                — a product, hotel stay, event pass, or voucher — in exchange for
                content, its{" "}
                <strong className="text-[#212529] font-semibold">fair market value (FMV)</strong>{" "}
                usually needs to be recorded as income. This free tool suggests a
                simple, defensible FMV from the values you already have, works out
                the GST service value if you&apos;re registered, and flags whether
                Section 194R (brand-side TDS on benefits) may apply.
              </p>
              <p className="mt-2 text-xs text-[#999999]">
                Built by{" "}
                <Link href="/" className="text-[#9747FF] hover:underline">
                  Sparkonomy
                </Link>{" "}
                — free for all Indian creators. Not a substitute for a CA.
              </p>
            </div>
          </>
        )}

        {/* INPUT CARD */}
        <div
          className={`border-2 border-[#9747FF]/40 bg-white sm:p-8 ${
            embed ? "p-4" : "p-6"
          }`}
          style={{ borderRadius: embed ? "24px" : "34px" }}
        >
          <h2 className={`text-[11px] font-bold uppercase tracking-widest text-[#9747FF] ${embed ? "mb-4" : "mb-6"}`}>
            Step 1 · Enter only what you know
          </h2>

          <div className={`grid ${embed ? "gap-3.5" : "gap-5"}`}>
            {/* Value proof sources */}
            <div className="grid gap-4 sm:grid-cols-2">
              {MoneyField({
                id: "mrp",
                label: "Product MRP",
                tip: "Printed or listed MRP. Used only if you don't have a current selling price — MRP is often higher than the real price.",
                placeholder: "e.g. 20,000",
                field: "mrp",
                highlightError: true,
              })}
              {MoneyField({
                id: "marketPrice",
                label: "Market price when received",
                tip: "Retail price on the date you received it. Use the brand site, invoice, app, or product page as proof.",
                placeholder: "e.g. 18,000",
                field: "marketPrice",
                highlightError: true,
              })}
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {MoneyField({
                id: "brandValue",
                label: "Brand confirmed value",
                tip: "Value the brand/agency shared in email, WhatsApp, invoice, PO, or a product note.",
                placeholder: "0",
                field: "brandValue",
                highlightError: true,
              })}
              {MoneyField({
                id: "marketplaceValue",
                label: "Marketplace value",
                tip: "Current price of the same or a similar product on Amazon, Nykaa, Myntra, etc. Keep a screenshot or link.",
                placeholder: "e.g. 17,500",
                field: "marketplaceValue",
                highlightError: true,
              })}
            </div>

            {MoneyField({
              id: "paid",
              label: "Amount you paid for the product / perk",
              tip: "Anything you paid from your own pocket — shipping, an upgrade, event pass. It reduces the non-cash benefit value.",
              placeholder: "0",
              field: "paid",
            })}

            {/* Cash side */}
            <div className="grid gap-4 sm:grid-cols-2">
              {MoneyField({
                id: "cashFee",
                label: "Cash fee from brand for this deal",
                tip: "Cash fee received or receivable from the brand, apart from the barter product.",
                placeholder: "0",
                field: "cashFee",
              })}
              {MoneyField({
                id: "usualFee",
                label: "Your usual cash fee for this content",
                tip: "Optional. Your normal rate for the same Reel, Story, video, post, or UGC work. Used as a GST caution check.",
                placeholder: "0",
                field: "usualFee",
              })}
            </div>

            {MoneyField({
              id: "brandFYDeals",
              label: "Cash or barter from this brand this FY",
              tip: "Annual brand-side alert. Include earlier cash or barter value from the same brand in this financial year.",
              placeholder: "0",
              field: "brandFYDeals",
            })}

            {/* GST block */}
            <div>
              <div className={`my-1 flex items-center gap-3 text-[11px] font-bold uppercase tracking-wider text-[#999999] ${embed ? "mt-1" : "mt-2"}`}>
                <span className="h-px flex-1 bg-[#F2F2F2]" />
                GST (optional)
                <span className="h-px flex-1 bg-[#F2F2F2]" />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <div>
                <div className={labelCls}>
                  GST registered?
                  <Tip text="Select Yes only if you have a GSTIN and raise GST invoices." />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {(["no", "yes"] as const).map((v) => (
                    <button
                      key={v}
                      type="button"
                      onClick={() => update("gstRegistered", v)}
                      className={`rounded-xl border px-3 py-2.5 text-sm font-semibold capitalize transition ${
                        form.gstRegistered === v
                          ? "border-[#9747FF] bg-white text-[#9747FF]"
                          : "border-[#F2F2F2] bg-white text-[#999999] hover:text-[#212529]"
                      }`}
                    >
                      {v}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className={labelCls} htmlFor="gstRate">
                  GST rate
                  <Tip text="Default is 18%. Change only if your CA confirms another rate." />
                </label>
                <select
                  id="gstRate"
                  className={inputCls}
                  value={form.gstRate}
                  onChange={(e) => update("gstRate", e.target.value)}
                  disabled={form.gstRegistered !== "yes"}
                >
                  <option value="5">5%</option>
                  <option value="12">12%</option>
                  <option value="18">18%</option>
                  <option value="28">28%</option>
                </select>
              </div>

              <div>
                <label className={labelCls} htmlFor="sameState">
                  Same state as brand?
                  <Tip text="Only for the GST split: same state = CGST+SGST; different state = IGST." />
                </label>
                <select
                  id="sameState"
                  className={inputCls}
                  value={form.sameState}
                  onChange={(e) => update("sameState", e.target.value)}
                  disabled={form.gstRegistered !== "yes"}
                >
                  <option value="notsure">Not sure</option>
                  <option value="yes">Yes (same state)</option>
                  <option value="no">No (different state)</option>
                </select>
              </div>
            </div>

            {/* Other taxes */}
            <div>
              <div className="my-2 flex items-center gap-3 text-[11px] font-bold uppercase tracking-wider text-[#999999]">
                <span className="h-px flex-1 bg-[#F2F2F2]" />
                Optional
                <span className="h-px flex-1 bg-[#F2F2F2]" />
              </div>
              {MoneyField({
                id: "otherTaxes",
                label: "Other taxes / charges",
                tip: "Add only if your CA/brand asks for a separate tax, cess, or charge. Do not add GST here — it has its own row.",
                placeholder: "0",
                field: "otherTaxes",
              })}
            </div>
          </div>

          <button
            type="button"
            onClick={calculate}
            className={`flex w-full items-center justify-center gap-2 rounded-full px-6 font-semibold text-white transition hover:opacity-90 ${
              embed ? "mt-5 py-3 text-sm" : "mt-7 py-4 text-base"
            }`}
            style={{
              background:
                "linear-gradient(135deg, #DD2A7B 0%, #9747FF 50%, #334CCA 100%)",
            }}
          >
            <Calculator className="h-5 w-5" />
            Calculate FMV
          </button>
        </div>

        {/* RESULTS */}
        {result && (
          <div ref={resultsRef} className="mt-6 animate-[fadeIn_.4s_ease]">
            {/* Quick Answer */}
            <div
              className={`border border-[#F2F2F2] bg-white text-[#212529] sm:p-8 ${embed ? "p-4" : "p-6"}`}
              style={{ borderRadius: embed ? "24px" : "34px" }}
            >
              <div
                className={`mb-3 inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold ${
                  result.is194R
                    ? "border-amber-200 bg-amber-50 text-amber-700"
                    : "border-[#F2F2F2] bg-[#FAFAFA] text-[#9747FF]"
                }`}
              >
                {result.is194R
                  ? "⚠ 194R may be triggered — confirm brand-side TDS"
                  : "✓ No 194R trigger based on current inputs"}
              </div>
              <div className="text-[11px] font-semibold uppercase tracking-wider text-[#9747FF]">
                Barter FMV to record as income
              </div>
              <div className="mt-1 text-2xl sm:text-3xl font-bold tracking-tight text-[#212529]">
                {inr(result.barterFMV)}
              </div>
              <div className="mt-2 text-sm text-[#999999]">
                {result.recordNote}
              </div>

              <div className="mt-5 flex flex-wrap items-stretch gap-2.5">
                <div className="flex min-w-[120px] flex-1 flex-col justify-between rounded-xl border border-[#F2F2F2] bg-[#FAFAFA] px-4 py-3">
                  <div className="text-[11px] font-medium leading-snug text-[#999999]">
                    Recommended FMV
                  </div>
                  <div className="mt-1 text-base font-bold text-[#212529]">
                    {inr(result.recommendedFMV)}
                  </div>
                </div>
                <div className="flex min-w-[120px] flex-1 flex-col justify-between rounded-xl border border-[#F2F2F2] bg-[#FAFAFA] px-4 py-3">
                  <div className="text-[11px] font-medium leading-snug text-[#999999]">
                    Total before GST
                  </div>
                  <div className="mt-1 text-base font-bold text-[#212529]">
                    {inr(result.totalDealBeforeGST)}
                  </div>
                </div>
                {result.gstAmount > 0 && (
                  <div className="flex min-w-[120px] flex-1 flex-col justify-between rounded-xl border border-[#F2F2F2] bg-[#FAFAFA] px-4 py-3">
                    <div className="text-[11px] font-medium leading-snug text-[#999999]">
                      GST amount
                    </div>
                    <div className="mt-1 text-base font-bold text-[#212529]">
                      {inr(result.gstAmount)}
                    </div>
                  </div>
                )}
                <div className="flex min-w-[140px] flex-1 flex-col justify-between rounded-xl border border-[#F2F2F2] bg-[#FAFAFA] px-4 py-3">
                  <div className="text-[11px] font-medium leading-snug text-[#999999]">
                    Total documented<br />campaign value
                  </div>
                  <div className="mt-1 text-base font-bold text-[#212529]">
                    {inr(result.totalDocumented)}
                  </div>
                </div>
              </div>

              {/* GST split note */}
              <div className="mt-4 rounded-xl border border-[#F2F2F2] bg-[#FAFAFA] px-4 py-3 text-xs text-[#999999]">
                <strong className="font-semibold text-[#212529]">GST split:</strong>{" "}
                {result.gstSplitNote}
              </div>
            </div>

            {/* Action row */}
            <div className="mt-4 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={copyResults}
                className={`flex min-w-[140px] flex-1 items-center justify-center gap-2 rounded-full border px-4 py-3 text-sm font-semibold transition ${
                  copyState === "ok"
                    ? "border-emerald-400 bg-white text-emerald-700"
                    : "border-[#F2F2F2] bg-white text-[#9747FF] hover:border-[#9747FF]"
                }`}
              >
                {copyState === "ok" ? (
                  <>
                    <Check className="h-4 w-4" /> Copied!
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4" /> Copy Summary
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={shareCalculator}
                className={`flex min-w-[140px] flex-1 items-center justify-center gap-2 rounded-full px-4 py-3 text-sm font-semibold text-white transition hover:opacity-90 ${
                  shareState === "ok" ? "bg-emerald-500" : ""
                }`}
                style={
                  shareState === "ok"
                    ? undefined
                    : {
                        background:
                          "linear-gradient(135deg, #DD2A7B 0%, #9747FF 50%, #334CCA 100%)",
                      }
                }
              >
                {shareState === "ok" ? (
                  <>
                    <Check className="h-4 w-4" /> Link Copied!
                  </>
                ) : (
                  <>
                    <Share2 className="h-4 w-4" /> Share This Scenario
                  </>
                )}
              </button>
            </div>

            {/* Detailed breakdown */}
            <div className="mt-4 overflow-hidden border border-[#F2F2F2] bg-white" style={{ borderRadius: "34px" }}>
              <div className="border-b border-[#F2F2F2] px-5 py-4">
                <h3 className="text-[11px] font-bold uppercase tracking-widest text-[#9747FF]">
                  Step 2 · Your FMV result details
                </h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-left">
                  <thead className="bg-[#FAFAFA]">
                    <tr>
                      {["Output", "Amount", "How it's worked out"].map((h) => (
                        <th
                          key={h}
                          className="whitespace-nowrap px-4 py-3 text-sm font-bold text-[#6B7280]"
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {breakdownRows.map((r, i) => (
                      <tr
                        key={i}
                        className={`border-b border-[#F2F2F2] last:border-b-0 ${
                          r.strong ? "bg-[#FAFAFA]" : ""
                        }`}
                      >
                        <td className="px-4 py-3 text-sm">
                          <span
                            className={
                              r.strong
                                ? "font-semibold text-[#212529]"
                                : "text-[#6B7280]"
                            }
                          >
                            {r.label}
                          </span>
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-sm font-semibold text-[#212529] tabular-nums">
                          {r.value}
                        </td>
                        <td className="px-4 py-3 text-xs text-[#999999]">
                          {r.note}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Proof tip */}
            <div className="mt-4 border border-[#F2F2F2] bg-white p-5 text-sm text-[#999999]" style={{ borderRadius: "34px" }}>
              <strong className="mb-2 block text-[#212529] font-semibold">
                Keep your proof
              </strong>
              <ul className="space-y-1.5">
                {[
                  "Keep at least one screenshot, invoice, email, product page link, or marketplace link showing how you arrived at the FMV.",
                  "Use the lowest reliable current value you can genuinely prove — don't use fake or extreme discounts.",
                  "MRP is used only when no current price source is entered, because listed MRP is often higher than the real selling price.",
                  "For 194R, brands generally check benefit/perquisite value across the financial year — cash professional fees can follow normal TDS rules.",
                  "GST place of supply, invoice value, and TDS handling depend on contract terms and the brand's tax position — confirm with a CA before filing.",
                ].map((t, i) => (
                  <li key={i} className="relative pl-4">
                    {t}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* Footer note */}
        <div className={`border-t border-[#F2F2F2] text-center text-xs text-[#999999] ${
          embed ? "hidden" : "mt-10 pt-6"
        }`}>
          <p>
            Built by{" "}
            <Link href="/" className="text-[#9747FF] hover:underline">
              Sparkonomy
            </Link>{" "}
            · For Indian content creators · Barter &amp; gifting deals
          </p>
          <p className="mt-1.5">
            Educational estimate only. GST rate, place of supply, invoice value,
            and TDS handling can change with the facts. Consult a qualified CA
            before filing.
          </p>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default FMVCalculator;
