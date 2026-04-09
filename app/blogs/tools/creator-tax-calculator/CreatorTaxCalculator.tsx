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

const numOr0 = (s: string): number => {
  const v = parseFloat(s);
  return isNaN(v) || v < 0 ? 0 : v;
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

// ──────────────────────────────────────────
//  TAX CALCULATIONS  (FY 2025-26)
// ──────────────────────────────────────────
function taxNew(income: number): number {
  if (income <= 0) return 0;
  // 87A full rebate: income ≤ ₹12,00,000
  if (income <= 1200000) return 0;

  const slabs: [number, number][] = [
    [400000, 0.0],
    [800000, 0.05],
    [1200000, 0.1],
    [1600000, 0.15],
    [2000000, 0.2],
    [2400000, 0.25],
    [Infinity, 0.3],
  ];
  let tax = 0;
  let prev = 0;
  for (const [lim, rate] of slabs) {
    if (income <= prev) break;
    tax += (Math.min(income, lim) - prev) * rate;
    prev = lim;
  }
  const withCess = Math.round(tax * 1.04);
  // Marginal relief: tax can't exceed income - 12,00,000
  return Math.min(withCess, income - 1200000);
}

function taxOld(income: number, age: string): number {
  if (income <= 0) return 0;
  let tax = 0;

  if (age === "above80") {
    if (income > 500000) tax += Math.min(income - 500000, 500000) * 0.2;
    if (income > 1000000) tax += (income - 1000000) * 0.3;
  } else if (age === "60to80") {
    if (income > 300000) tax += Math.min(income - 300000, 200000) * 0.05;
    if (income > 500000) tax += Math.min(income - 500000, 500000) * 0.2;
    if (income > 1000000) tax += (income - 1000000) * 0.3;
  } else {
    // below60
    if (income > 250000) tax += Math.min(income - 250000, 250000) * 0.05;
    if (income > 500000) tax += Math.min(income - 500000, 500000) * 0.2;
    if (income > 1000000) tax += (income - 1000000) * 0.3;
  }
  // 87A rebate: income ≤ ₹5,00,000 → rebate up to ₹12,500 (effectively tax = 0)
  if (income <= 500000) tax = Math.max(0, tax - 12500);
  if (tax <= 0) return 0;
  return Math.round(tax * 1.04);
}

// ──────────────────────────────────────────
//  ELIGIBILITY
// ──────────────────────────────────────────
type Elig = { ok: boolean; msg: string };

function checkElig(
  route: string,
  receipts: number,
  digital: number,
  cash: number,
  affiliate: string,
  profession: string,
): Elig {
  const cashPct = receipts > 0 ? cash / receipts : 0;

  if (route === "44AD") {
    if (affiliate === "yes")
      return {
        ok: false,
        msg: "Heads up: affiliate/commission income usually can't use 44AD. Double-check with a CA.",
      };
    const limit = cashPct <= 0.05 ? 30000000 : 20000000; // 3Cr or 2Cr
    if (receipts > limit)
      return {
        ok: false,
        msg: `Turnover exceeds the ₹${cashPct <= 0.05 ? "3 crore" : "2 crore"} limit for 44AD.`,
      };
    return { ok: true, msg: "Looks eligible for 44AD based on these inputs." };
  }

  if (route === "44ADA") {
    if (profession === "no")
      return {
        ok: false,
        msg: "44ADA is only for specified professions (tech consultant, doctor, lawyer, architect, etc.).",
      };
    const digitalPct = receipts > 0 ? digital / receipts : 0;
    const limit = digitalPct >= 0.95 ? 15000000 : 7500000; // 1.5Cr or 75L
    if (receipts > limit)
      return {
        ok: false,
        msg: `Gross receipts exceed the ₹${digitalPct >= 0.95 ? "1.5 crore" : "75 lakh"} 44ADA limit.`,
      };
    if (affiliate === "yes")
      return {
        ok: true,
        msg: "Eligible for 44ADA — but commission income may need separate treatment.",
      };
    return { ok: true, msg: "Looks eligible for 44ADA based on these inputs." };
  }

  return { ok: true, msg: "" };
}

type Row = {
  label: string;
  regime: "new" | "old";
  profit: number;
  taxable: number;
  tax: number;
  eligible: boolean;
  isBest?: boolean;
};

function explain(
  best: Row,
  presMinTax: number,
  normalMinTax: number,
  eligible: boolean,
): string {
  if (!eligible)
    return "Presumptive route may not apply here. Normal books is likely your main option — double check eligibility with a CA.";
  if (best.label.startsWith("Presumptive")) {
    const save = normalMinTax - best.tax;
    if (save > 0)
      return `Presumptive looks cheaper here, saving roughly ${inr(save)} vs the best normal-books option. Works best when your actual costs are low relative to receipts.`;
    return "Both routes come out similarly — consider which one is easier to comply with.";
  } else {
    const save = presMinTax - best.tax;
    return `Normal books wins here${save > 0 ? `, saving roughly ${inr(save)} vs the best presumptive option` : ""}. Makes sense when your real work costs are high.`;
  }
}

// ──────────────────────────────────────────
//  COMPONENT
// ──────────────────────────────────────────
type Form = {
  route: string;
  age: string;
  receipts: string;
  digital: string;
  cash: string;
  costs: string;
  otherincome: string;
  deductions: string;
  override: string;
  affiliate: string;
  profession: string;
};

const initialForm: Form = {
  route: "44AD",
  age: "below60",
  receipts: "",
  digital: "",
  cash: "",
  costs: "",
  otherincome: "",
  deductions: "",
  override: "",
  affiliate: "no",
  profession: "yes",
};

type Result = {
  rows: Row[];
  bestRow: Row | null;
  bestTax: number;
  worstTax: number;
  savings: number;
  presProfit: number;
  normalProfit: number;
  presMinTax: number;
  normalMinTax: number;
  elig: Elig;
};

const CreatorTaxCalculator = ({ embed = false }: { embed?: boolean } = {}) => {
  const [form, setForm] = useState<Form>(initialForm);
  const [result, setResult] = useState<Result | null>(null);
  const [splitWarn, setSplitWarn] = useState<string>("");
  const [receiptsError, setReceiptsError] = useState(false);
  const [copyState, setCopyState] = useState<"idle" | "ok">("idle");
  const [shareState, setShareState] = useState<"idle" | "ok">("idle");
  const everCalced = useRef(false);
  const resultsRef = useRef<HTMLDivElement>(null);

  const update = <K extends keyof Form>(key: K, value: Form[K]) => {
    setForm((f) => ({ ...f, [key]: value }));
  };

  // Live split hint
  useEffect(() => {
    const r = numOr0(form.receipts);
    const d = numOr0(form.digital);
    const c = numOr0(form.cash);
    if ((d > 0 || c > 0) && r > 0 && Math.abs(d + c - r) > 1) {
      setSplitWarn(
        `Digital + cash = ${inr(d + c)} (should match total receipts)`,
      );
    } else {
      setSplitWarn("");
    }
  }, [form.receipts, form.digital, form.cash]);

  const calculate = () => {
    const receipts = numOr0(form.receipts);
    const digital = numOr0(form.digital);
    const cash = numOr0(form.cash);
    const costs = numOr0(form.costs);
    const other = numOr0(form.otherincome);
    const deductions = numOr0(form.deductions);
    const override = numOr0(form.override);
    const { route, age, affiliate, profession } = form;

    if (receipts === 0) {
      setReceiptsError(true);
      setTimeout(() => setReceiptsError(false), 2000);
      return;
    }

    const effDigital = digital === 0 && cash === 0 ? receipts : digital;
    const effCash = digital === 0 && cash === 0 ? 0 : cash;

    // Eligibility
    const elig = checkElig(
      route,
      receipts,
      effDigital,
      effCash,
      affiliate,
      profession,
    );

    // Presumptive profit
    let presProfit: number;
    if (route === "44AD") {
      const min = effDigital * 0.06 + effCash * 0.08;
      presProfit = override > min ? override : min;
    } else {
      const min = receipts * 0.5;
      presProfit = override > min ? override : min;
    }

    // Normal profit
    const normalProfit = Math.max(0, receipts - costs);

    const t_pn = presProfit + other;
    const t_po = Math.max(0, presProfit + other - deductions);
    const t_nn = normalProfit + other;
    const t_no = Math.max(0, normalProfit + other - deductions);

    const tax_pn = taxNew(t_pn);
    const tax_po = taxOld(t_po, age);
    const tax_nn = taxNew(t_nn);
    const tax_no = taxOld(t_no, age);

    const rows: Row[] = [
      {
        label: `Presumptive (${route})`,
        regime: "new",
        profit: presProfit,
        taxable: t_pn,
        tax: tax_pn,
        eligible: elig.ok,
      },
      {
        label: `Presumptive (${route})`,
        regime: "old",
        profit: presProfit,
        taxable: t_po,
        tax: tax_po,
        eligible: elig.ok,
      },
      {
        label: "Normal books",
        regime: "new",
        profit: normalProfit,
        taxable: t_nn,
        tax: tax_nn,
        eligible: true,
      },
      {
        label: "Normal books",
        regime: "old",
        profit: normalProfit,
        taxable: t_no,
        tax: tax_no,
        eligible: true,
      },
    ];

    let bestIdx = -1;
    let bestTax = Infinity;
    rows.forEach((r, i) => {
      if (r.eligible && r.tax < bestTax) {
        bestTax = r.tax;
        bestIdx = i;
      }
    });
    rows.forEach((r, i) => (r.isBest = i === bestIdx));

    const bestRow = bestIdx >= 0 ? rows[bestIdx] : null;

    const presEligTaxes = rows
      .filter((r) => r.eligible && r.label.startsWith("Presumptive"))
      .map((r) => r.tax);
    const normalEligTaxes = rows
      .filter((r) => r.eligible && r.label === "Normal books")
      .map((r) => r.tax);
    const presMinTax = presEligTaxes.length ? Math.min(...presEligTaxes) : Infinity;
    const normalMinTax = normalEligTaxes.length ? Math.min(...normalEligTaxes) : Infinity;

    const allEligTaxes = rows.filter((r) => r.eligible).map((r) => r.tax);
    const worstTax =
      allEligTaxes.length > 1 ? Math.max(...allEligTaxes) : bestTax;
    const savings = worstTax - bestTax;

    setResult({
      rows,
      bestRow,
      bestTax,
      worstTax,
      savings,
      presProfit,
      normalProfit,
      presMinTax,
      normalMinTax,
      elig,
    });

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
    if (everCalced.current) calculate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form]);

  // Read URL params on mount
  useEffect(() => {
    if (typeof window === "undefined") return;
    const p = new URLSearchParams(window.location.search);
    if (!p.has("receipts")) return;

    const next: Partial<Form> = {};
    const map: Record<string, keyof Form> = {
      route: "route",
      age: "age",
      receipts: "receipts",
      digital: "digital",
      cash: "cash",
      costs: "costs",
      other: "otherincome",
      deductions: "deductions",
      override: "override",
      aff: "affiliate",
      prof: "profession",
    };
    Object.entries(map).forEach(([urlKey, formKey]) => {
      if (p.has(urlKey)) {
        const v = p.get(urlKey) ?? "";
        (next as Record<string, string>)[formKey] = v;
      }
    });
    setForm((f) => ({ ...f, ...next }));
    // Auto-run after state settles
    setTimeout(() => {
      everCalced.current = true;
    }, 120);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const buildShareURL = (): string => {
    if (typeof window === "undefined") return "";
    const base = window.location.origin + window.location.pathname;
    const p = new URLSearchParams();
    p.set("route", form.route);
    p.set("age", form.age);
    p.set("receipts", form.receipts || "");
    p.set("digital", form.digital || "");
    p.set("cash", form.cash || "");
    p.set("costs", form.costs || "");
    p.set("other", form.otherincome || "");
    p.set("deductions", form.deductions || "");
    p.set("override", form.override || "");
    p.set("aff", form.affiliate || "no");
    p.set("prof", form.profession || "yes");
    return base + "?" + p.toString();
  };

  const copyResults = () => {
    if (!result) return;
    const winnerTxt = result.bestRow
      ? `${result.bestRow.label} + ${result.bestRow.regime === "new" ? "New Regime" : "Old Regime"}`
      : "";

    let table = "";
    result.rows.forEach((r) => {
      const route = r.label;
      const regime = r.regime === "new" ? "New" : "Old";
      const tax = !r.eligible ? "Not eligible" : r.tax === 0 ? "₹0" : inr(r.tax);
      const best = r.isBest ? " ✓ Lowest" : "";
      table += `  ${route} | ${regime} | Tax: ${tax}${best}\n`;
    });

    const shareURL = buildShareURL();
    const text = [
      "🧮 My Creator Tax Estimate (FY 2025–26)",
      "━━━━━━━━━━━━━━━━━━━━━━━━━━━",
      winnerTxt ? `Best route: ${winnerTxt}` : "",
      "",
      "All 4 routes compared:",
      table.trimEnd(),
      "",
      "📌 See your own numbers:",
      shareURL,
      "",
      "— Free tool by Sparkonomy (sparkonomy.com)",
      "  Built for Indian content creators · Not financial advice",
    ]
      .filter((l) => l !== null)
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
          title: "Creator Tax Calculator — Sparkonomy",
          text: "Check out my creator tax estimate for FY 2025-26. Free tool by Sparkonomy:",
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
  //  STYLES (blog theme — white, Roboto, #212529 / #999999 / #F2F2F2)
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
                FY 2025–26 · AY 2026–27
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
                Which tax route <em className="not-italic">actually</em>
                <br /> saves you money?
              </h1>
              <p className="mt-4 text-[#999999] max-w-xl mx-auto">
                Presumptive (44AD / 44ADA) or normal books — put in your numbers
                and find out in 30 seconds. No CA required.
              </p>
            </div>

            {/* INTRO */}
            <div className="mb-8 border border-[#F2F2F2] bg-white p-5 text-sm leading-relaxed text-[#999999]" style={{ borderRadius: "34px" }}>
              <p>
                Indian content creators can file taxes in two broad ways:{" "}
                <strong className="text-[#212529] font-semibold">presumptive taxation</strong>{" "}
                (Sections 44AD or 44ADA), which taxes a fixed percentage of your
                receipts without requiring detailed expense records, or{" "}
                <strong className="text-[#212529] font-semibold">normal books</strong>, which taxes
                your actual net profit after deducting real business expenses. This
                free calculator runs both options — across both the old and new tax
                regimes — and tells you which one gives you the lowest tax bill for
                FY 2025–26.
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
           Calculate your Tax Now
          </h2>

          <div className={`grid ${embed ? "gap-3.5" : "gap-5"}`}>
            {/* Route + Age */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className={labelCls} htmlFor="route">
                  Tax route to test
                  <Tip text="44AD is for creators running a content business. 44ADA is for specified professionals (tech consultant, designer, architect, etc.). Pick 44AD if you're not sure — it's the most common for creators." />
                </label>
                <select
                  id="route"
                  className={inputCls}
                  value={form.route}
                  onChange={(e) => update("route", e.target.value)}
                >
                  <option value="44AD">44AD – Business</option>
                  <option value="44ADA">44ADA – Professional</option>
                </select>
              </div>

              <div>
                <label className={labelCls} htmlFor="age">
                  Your age bracket
                  <Tip text="Only affects your old-regime tax. Under 60? That's almost everyone here — pick 'Below 60'." />
                </label>
                <select
                  id="age"
                  className={inputCls}
                  value={form.age}
                  onChange={(e) => update("age", e.target.value)}
                >
                  <option value="below60">Below 60</option>
                  <option value="60to80">60 – 80 (Senior)</option>
                  <option value="above80">Above 80 (Super Senior)</option>
                </select>
              </div>
            </div>

            {/* Total receipts */}
            <div>
              <label className={labelCls} htmlFor="receipts">
                Total creator receipts / turnover
                <Tip text="Everything you earned from creator work this year — brand deals, AdSense, YouTube payouts, platform fees, consulting. Your total gross income before any deductions." />
              </label>
              <div className="relative">
                <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm font-semibold text-[#999999]">
                  ₹
                </span>
                <input
                  id="receipts"
                  type="text"
                  inputMode="numeric"
                  placeholder="e.g. 24,00,000"
                  className={
                    inputWithPrefixCls +
                    (receiptsError ? " border-red-500 ring-2 ring-red-500/30" : "")
                  }
                  value={formatWithCommas(form.receipts)}
                  onChange={(e) => update("receipts", parseDigits(e.target.value))}
                />
              </div>
            </div>

            {/* Digital + Cash */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className={labelCls} htmlFor="digital">
                  Received digitally
                  <Tip text="Payments via bank transfer, UPI, NEFT, cheque. Most creator income is digital. This + cash should add up to your total receipts above." />
                </label>
                <div className="relative">
                  <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm font-semibold text-[#999999]">
                    ₹
                  </span>
                  <input
                    id="digital"
                    type="text"
                    inputMode="numeric"
                    placeholder="e.g. 22,00,000"
                    className={inputWithPrefixCls}
                    value={formatWithCommas(form.digital)}
                    onChange={(e) => update("digital", parseDigits(e.target.value))}
                  />
                </div>
                {splitWarn && (
                  <div className="mt-1 text-[11px] text-amber-600">
                    {splitWarn}
                  </div>
                )}
              </div>

              <div>
                <label className={labelCls} htmlFor="cash">
                  Received in cash
                  <Tip text="Physical cash payments. Most creators: ₹0. Cash receipts are taxed at a slightly higher presumptive rate under 44AD (8% vs 6% for digital)." />
                </label>
                <div className="relative">
                  <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm font-semibold text-[#999999]">
                    ₹
                  </span>
                  <input
                    id="cash"
                    type="text"
                    inputMode="numeric"
                    placeholder="0"
                    className={inputWithPrefixCls}
                    value={formatWithCommas(form.cash)}
                    onChange={(e) => update("cash", parseDigits(e.target.value))}
                  />
                </div>
              </div>
            </div>

            {/* Costs */}
            <div>
              <label className={labelCls} htmlFor="costs">
                Real work costs / expenses
                <Tip text="Camera gear, editing software, studio rent, travel for shoots, freelancer payments — money you actually spent to do your work. Only used in the 'normal books' comparison." />
              </label>
              <div className="relative">
                <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm font-semibold text-[#999999]">
                  ₹
                </span>
                <input
                  id="costs"
                  type="text"
                  inputMode="numeric"
                  placeholder="e.g. 9,00,000"
                  className={inputWithPrefixCls}
                  value={formatWithCommas(form.costs)}
                  onChange={(e) => update("costs", parseDigits(e.target.value))}
                />
              </div>
            </div>

            {/* Other income + Deductions */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className={labelCls} htmlFor="otherincome">
                  Other taxable income
                  <Tip text="Salary, rent, FD interest — income outside your creator work. Put ₹0 if creator income is your only income source." />
                </label>
                <div className="relative">
                  <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm font-semibold text-[#999999]">
                    ₹
                  </span>
                  <input
                    id="otherincome"
                    type="text"
                    inputMode="numeric"
                    placeholder="0"
                    className={inputWithPrefixCls}
                    value={formatWithCommas(form.otherincome)}
                    onChange={(e) => update("otherincome", parseDigits(e.target.value))}
                  />
                </div>
              </div>

              <div>
                <label className={labelCls} htmlFor="deductions">
                  Old-regime deductions
                  <Tip text="PPF, ELSS, LIC (80C), health insurance (80D), home loan interest — these only reduce your tax under the old regime. Leave ₹0 if you don't use the old regime." />
                </label>
                <div className="relative">
                  <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm font-semibold text-[#999999]">
                    ₹
                  </span>
                  <input
                    id="deductions"
                    type="text"
                    inputMode="numeric"
                    placeholder="0"
                    className={inputWithPrefixCls}
                    value={formatWithCommas(form.deductions)}
                    onChange={(e) => update("deductions", parseDigits(e.target.value))}
                  />
                </div>
              </div>
            </div>

            {/* Affiliate + Profession toggles */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <div className={labelCls}>
                  Affiliate / commission income?
                  <Tip text="If a chunk of your earnings comes from affiliate links or acting as a brand agent, say Yes. That type of income usually can't use 44AD/44ADA, and it changes your eligibility." />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {(["no", "yes"] as const).map((v) => (
                    <button
                      key={v}
                      type="button"
                      onClick={() => update("affiliate", v)}
                      className={`rounded-xl border px-3 py-2.5 text-sm font-semibold capitalize transition ${
                        form.affiliate === v
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
                <div className={labelCls}>
                  Fits a specified profession?
                  <Tip text="Only matters for 44ADA. Specified professions include tech consultants, doctors, lawyers, architects, engineers, accountants, interior designers, film artists. A content creator alone may not qualify." />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {(["yes", "no"] as const).map((v) => (
                    <button
                      key={v}
                      type="button"
                      onClick={() => update("profession", v)}
                      className={`rounded-xl border px-3 py-2.5 text-sm font-semibold capitalize transition ${
                        form.profession === v
                          ? "border-[#9747FF] bg-white text-[#9747FF]"
                          : "border-[#F2F2F2] bg-white text-[#999999] hover:text-[#212529]"
                      }`}
                    >
                      {v}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Optional override */}
            <div>
              <div className="my-2 flex items-center gap-3 text-[11px] font-bold uppercase tracking-wider text-[#999999]">
                <span className="h-px flex-1 bg-[#F2F2F2]" />
                Optional
                <span className="h-px flex-1 bg-[#F2F2F2]" />
              </div>
              <label className={labelCls} htmlFor="override">
                Declare a higher presumptive profit
                <Tip text="By default we use the legal minimum (6%/8% for 44AD, 50% for 44ADA). If you want to test a custom declared profit amount, enter it here. Must be ≥ the minimum." />
              </label>
              <div className="relative">
                <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm font-semibold text-[#999999]">
                  ₹
                </span>
                <input
                  id="override"
                  type="text"
                  inputMode="numeric"
                  placeholder="Leave blank to use minimum"
                  className={inputWithPrefixCls}
                  value={formatWithCommas(form.override)}
                  onChange={(e) => update("override", parseDigits(e.target.value))}
                />
              </div>
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
            Calculate My Tax
          </button>
        </div>

        {/* RESULTS */}
        {result && (
          <div ref={resultsRef} className="mt-6 animate-[fadeIn_.4s_ease]">
            {/* Quick Answer */}
            <div
              className={`border border-[#F2F2F2] bg-white text-[#212529] sm:p-8 ${embed ? "p-4" : "p-6"}`}
              style={{
                borderRadius: embed ? "24px" : "34px",
              }}
            >
              <div>
                {result.bestRow ? (
                  <>
                    <div className="mb-3 inline-flex items-center gap-1.5 rounded-full border border-[#F2F2F2] bg-[#FAFAFA] px-3 py-1 text-xs font-semibold text-[#9747FF]">
                      {result.elig.ok ? "✓" : "⚠"} {result.elig.msg}
                    </div>
                    <div className="text-[11px] font-semibold uppercase tracking-wider text-[#9747FF]">
                      Your best option
                    </div>
                    <div className="mt-1 text-2xl sm:text-3xl font-bold tracking-tight text-[#212529]">
                      {result.bestRow.label} +{" "}
                      {result.bestRow.regime === "new"
                        ? "New Regime"
                        : "Old Regime"}
                    </div>
                    <div className="mt-2 text-sm text-[#999999]">
                      {explain(
                        result.bestRow,
                        result.presMinTax,
                        result.normalMinTax,
                        result.elig.ok,
                      )}
                    </div>
                    <div className="mt-5 flex flex-wrap items-stretch gap-2.5">
                      <div className="flex min-w-[120px] flex-1 flex-col justify-between rounded-xl border border-[#F2F2F2] bg-[#FAFAFA] px-4 py-3">
                        <div className="text-[11px] font-medium leading-snug text-[#999999]">
                          Presumptive profit
                        </div>
                        <div className="mt-1 text-base font-bold text-[#212529]">
                          {inr(result.presProfit)}
                        </div>
                      </div>
                      <div className="flex min-w-[120px] flex-1 flex-col justify-between rounded-xl border border-[#F2F2F2] bg-[#FAFAFA] px-4 py-3">
                        <div className="text-[11px] font-medium leading-snug text-[#999999]">
                          Normal profit
                        </div>
                        <div className="mt-1 text-base font-bold text-[#212529]">
                          {inr(result.normalProfit)}
                        </div>
                      </div>
                      <div className="flex min-w-[120px] flex-1 flex-col justify-between rounded-xl border border-[#F2F2F2] bg-[#FAFAFA] px-4 py-3">
                        <div className="text-[11px] font-medium leading-snug text-[#999999]">
                          Estimated tax
                        </div>
                        <div className="mt-1 text-base font-bold text-[#212529]">
                          {result.bestTax === 0 ? "₹0 🎉" : inr(result.bestTax)}
                        </div>
                      </div>
                      <div className="flex min-w-[140px] flex-1 flex-col justify-between rounded-xl border border-[#F2F2F2] bg-[#FAFAFA] px-4 py-3">
                        <div className="text-[11px] font-medium leading-snug text-[#999999]">
                          You save vs<br />worst option
                        </div>
                        <div className="mt-1 text-base font-bold text-[#212529]">
                          {result.savings > 0 ? inr(result.savings) : "₹0"}
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="mb-3 inline-flex items-center gap-1.5 rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700">
                      ⚠ {result.elig.msg}
                    </div>
                    <div className="text-[11px] font-semibold uppercase tracking-wider text-[#9747FF]">
                      Review needed
                    </div>
                    <div className="mt-1 text-2xl sm:text-3xl font-bold tracking-tight text-[#212529]">
                      Check your eligibility
                    </div>
                    <div className="mt-2 text-sm text-[#999999]">
                      Based on these inputs, the presumptive route may not
                      apply. Normal books results are shown below for reference.
                    </div>
                  </>
                )}
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
                    <Copy className="h-4 w-4" /> Copy Results
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

            {/* Comparison table */}
            <div className="mt-4 overflow-hidden border border-[#F2F2F2] bg-white" style={{ borderRadius: "34px" }}>
              <div className="border-b border-[#F2F2F2] px-5 py-4">
                <h3 className="text-[11px] font-bold uppercase tracking-widest text-[#9747FF]">
                  All 4 Routes Compared
                </h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-left">
                  <thead className="bg-[#FAFAFA]">
                    <tr>
                      {[
                        "Route",
                        "Profit used",
                        "Taxable income",
                        "Tax incl. cess",
                        "Winner?",
                      ].map((h) => (
                        <th
                          key={h}
                          className="whitespace-nowrap px-4 py-3 text-[10.5px] font-bold uppercase tracking-wider text-[#9747FF]"
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {result.rows.map((r, i) => (
                      <tr
                        key={i}
                        className={`border-b border-[#F2F2F2] last:border-b-0 ${
                          r.isBest
                            ? "bg-[#FAFAFA]"
                            : !r.eligible
                              ? "opacity-50"
                              : ""
                        }`}
                      >
                        <td className="px-4 py-4 text-sm">
                          <div className="flex flex-col items-start gap-1">
                            <span className="font-semibold text-[#212529]">
                              {r.label}
                            </span>
                            <span
                              className={`inline-block rounded-md border px-2 py-0.5 text-[11px] font-bold ${
                                r.regime === "new"
                                  ? "border-[#F2F2F2] text-[#9747FF]"
                                  : "border-[#F2F2F2] text-[#999999]"
                              }`}
                            >
                              {r.regime === "new" ? "New" : "Old"}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-4 text-sm font-normal text-[#999999] tabular-nums">
                          {inr(r.profit)}
                        </td>
                        <td className="px-4 py-4 text-sm font-normal text-[#999999] tabular-nums">
                          {inr(r.taxable)}
                        </td>
                        <td className="px-4 py-4 text-sm">
                          {!r.eligible ? (
                            <span className="text-[#999999]">Not eligible</span>
                          ) : r.tax === 0 ? (
                            <span className="font-semibold text-[#9747FF]">
                              ₹0
                            </span>
                          ) : (
                            <span className="font-semibold text-[#212529] tabular-nums">
                              {inr(r.tax)}
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-4 text-sm">
                          {r.isBest && (
                            <span
                              className="inline-flex items-center gap-1 whitespace-nowrap rounded-full px-2.5 py-1 text-[11px] font-bold text-white"
                              style={{
                                background:
                                  "linear-gradient(135deg, #DD2A7B 0%, #9747FF 50%, #334CCA 100%)",
                              }}
                            >
                              ✓ Lowest tax
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Notes */}
            <div className="mt-4 border border-[#F2F2F2] bg-white p-5 text-sm text-[#999999]" style={{ borderRadius: "34px" }}>
              <strong className="mb-2 block text-[#212529] font-semibold">
                A few things to keep in mind
              </strong>
              <ul className="space-y-1.5">
                {[
                  "Lower tax doesn't automatically mean presumptive is the right route — eligibility matters first.",
                  "44ADA is only for specified professions (doctors, lawyers, architects, tech consultants, film artists, etc.).",
                  "44AD doesn't cover pure commission, brokerage, or agency income — only direct creator earnings.",
                  "Under presumptive taxation, you generally can't claim work expenses separately on top.",
                  "This calculator excludes surcharge, GST, TDS, capital gains, and special-rate income.",
                  "Take the numbers to a CA before you file — this tool helps you walk in informed.",
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
            · For Indian content creators · FY 2025–26
          </p>
          <p className="mt-1.5">
            Estimate only. Tax laws are complex. Consult a qualified CA before
            filing.
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
        input[type="number"]::-webkit-inner-spin-button,
        input[type="number"]::-webkit-outer-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }
        input[type="number"] {
          -moz-appearance: textfield;
        }
      `}</style>
    </div>
  );
};

export default CreatorTaxCalculator;
