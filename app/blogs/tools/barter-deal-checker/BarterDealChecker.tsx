"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import Link from "next/link";
import { AlertTriangle, ArrowLeft, Check, HelpCircle } from "lucide-react";

// ──────────────────────────────────────────
//  HELPERS
// ──────────────────────────────────────────
// Absolute-value formatter — the minus sign is rendered separately so negative
// amounts read as "−₹1,200" rather than the locale's "-₹1,200".
const inr = (amount: number | null | undefined): string => {
  if (amount === null || amount === undefined || isNaN(amount)) return "—";
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Math.abs(Math.round(amount)));
};

const signedInr = (amount: number): string =>
  (amount >= 0 ? "" : "−") + inr(amount);

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

// Flat planning estimates. Actual rates depend on registration status, SAC code
// and contract terms — the tool says so in the disclaimer.
const GST_RATE = 0.18;
const TDS_194R_RATE = 0.1;

// ──────────────────────────────────────────
//  QUESTIONS
// ──────────────────────────────────────────
type MoneyKey = "market" | "mrp" | "mailVal" | "cash" | "fee" | "exp";
type ChoiceKey = "keep" | "gstin" | "over20k";
type FormKey = MoneyKey | ChoiceKey;

type Form = Record<FormKey, string>;

type Question =
  | {
      key: MoneyKey;
      type: "money";
      q: string;
      help: string;
      skip?: boolean;
    }
  | {
      key: ChoiceKey;
      type: "choice";
      q: string;
      help: string;
      options: { value: string; label: string; sub?: string }[];
    };

const QUESTIONS: Question[] = [
  {
    key: "market",
    type: "money",
    q: "What is the market price of the product today?",
    help: "The normal retail price on the day you received it. Check the brand site, invoice, app or product page. Enter 0 if you have no cash-free perk.",
    skip: true,
  },
  {
    key: "mrp",
    type: "money",
    q: "What MRP does the brand show?",
    help: "The price the brand quotes. Brands often quote high, so we use this only as a backup.",
    skip: true,
  },
  {
    key: "mailVal",
    type: "money",
    q: "What value did the brand write in their email?",
    help: "Skip this if the brand did not mention a value.",
    skip: true,
  },
  {
    key: "keep",
    type: "choice",
    q: "Will you keep the product or perk?",
    help: "Choose No if you have to send it back after making the content.",
    options: [
      { value: "Yes", label: "Yes, I keep it" },
      {
        value: "No",
        label: "No, I return it",
        sub: "Review units, loaner products, event passes",
      },
    ],
  },
  {
    key: "cash",
    type: "money",
    q: "How much cash is the brand paying you?",
    help: "Enter 0 if this is a pure barter deal with no money at all.",
  },
  {
    key: "fee",
    type: "money",
    q: "What do you normally charge for this work?",
    help: "Your usual cash rate for the same deliverables. This is how we judge whether the deal is worth it.",
  },
  {
    key: "exp",
    type: "money",
    q: "What will this deal cost you?",
    help: "Editing, travel, shipping, props, a co-pay, or anything else you pay for. Enter 0 if nothing.",
  },
  {
    key: "gstin",
    type: "choice",
    q: "Do you have a GSTIN?",
    help: "Choose Yes only if you are registered for GST.",
    options: [
      { value: "Yes", label: "Yes, I am GST registered" },
      { value: "No", label: "No / not registered" },
    ],
  },
  {
    key: "over20k",
    type: "choice",
    q: "Will cash and barter from this brand cross ₹20,000 this financial year?",
    help: "Count everything from this one brand, including this deal.",
    options: [
      { value: "Yes", label: "Yes, it crosses ₹20,000" },
      { value: "No", label: "No, it stays below" },
      {
        value: "Not sure",
        label: "I'm not sure",
        sub: "We'll show you both scenarios",
      },
    ],
  },
];

const initialForm: Form = {
  market: "",
  mrp: "",
  mailVal: "",
  keep: "",
  cash: "",
  fee: "",
  exp: "",
  gstin: "",
  over20k: "",
};

// ──────────────────────────────────────────
//  CALCULATION  (mirrors the Sparkonomy Barter Deal Checker sheet)
// ──────────────────────────────────────────
type Verdict = "YES" | "MAYBE" | "NO" | "NEED_FEE" | "NEED_VALUE";

type Result = {
  fmv: number;
  counted: number;
  beforeExp: number;
  gst: number;
  tds: number;
  tdsIfYes: number;
  finalVal: number;
  cashLeft: number;
  outOfPocket: number;
  benchmark: number;
  gap: number;
  band: number;
  verdict: Verdict;
};

function compute(form: Form): Result {
  const mrp = numOr0(form.mrp);
  const market = numOr0(form.market);
  const mailVal = numOr0(form.mailVal);
  const cash = numOr0(form.cash);
  const fee = numOr0(form.fee);
  const exp = numOr0(form.exp);

  // FMV: market price first; else lower of MRP and brand-email value;
  // else whichever single value exists.
  let fmv: number;
  if (market > 0) fmv = market;
  else if (mrp > 0 && mailVal > 0) fmv = Math.min(mrp, mailVal);
  else fmv = Math.max(mrp, mailVal);

  const counted = form.keep === "Yes" ? fmv : 0; // returned product counts as 0
  const beforeExp = counted + cash;
  const gst = form.gstin === "Yes" ? beforeExp * GST_RATE : 0;
  const tds = form.over20k === "Yes" ? counted * TDS_194R_RATE : 0;
  const tdsIfYes = counted * TDS_194R_RATE; // shadow figure for the "Not sure" answer

  const finalVal = beforeExp - exp - gst - tds;
  const cashLeft = cash - exp - gst - tds;
  const outOfPocket = Math.max(-cashLeft, 0);
  const benchmark = fee + outOfPocket;
  const gap = finalVal - benchmark;

  // MAYBE means "clears, but only just" — a band of 2% of the benchmark
  // (minimum ₹100) ABOVE zero. Anything below the benchmark stays NO.
  const band = Math.max(benchmark * 0.02, 100);

  let verdict: Verdict;
  if (fee <= 0) verdict = "NEED_FEE"; // no rate = no honest verdict
  else if (fmv <= 0 && cash <= 0) verdict = "NEED_VALUE";
  else if (gap < 0) verdict = "NO";
  else if (gap <= band) verdict = "MAYBE";
  else verdict = "YES";

  return {
    fmv,
    counted,
    beforeExp,
    gst,
    tds,
    tdsIfYes,
    finalVal,
    cashLeft,
    outOfPocket,
    benchmark,
    gap,
    band,
    verdict,
  };
}

// ──────────────────────────────────────────
//  SHARED STYLE TOKENS (blog theme)
// ──────────────────────────────────────────
/* Panel gradient — sits behind white body copy, so every stop is deepened
   enough for white to clear WCAG AA (4.5:1). The undeepened brand stops
   (#DD2A7B / #9747FF) only reach ~4.48:1 against white, which left the
   smaller sentences on these panels hard to read. */
const BRAND_GRADIENT =
  "linear-gradient(135deg, #C42169 0%, #7B2FD9 50%, #2A3FA8 100%)";
const CREATOR_GRADIENT = "linear-gradient(135deg, #DD2A7B 0%, #9747FF 100%)";

const VERDICT_STYLES: Record<
  Verdict,
  { background: string; color: string }
> = {
  /* Light-hued verdicts (green, amber) carry dark ink; deep-hued ones (red,
     brand purple) carry white. White on the bright green was only 2.2:1 —
     the worst contrast in the tool — so it keeps its colour and flips to
     dark ink, the same treatment MAYBE already used. */
  YES: {
    background: "linear-gradient(135deg, #2BB44E 0%, #34C759 100%)",
    color: "#06280F",
  },
  MAYBE: {
    background: "linear-gradient(135deg, #F5A623 0%, #FFCC00 100%)",
    color: "#33270A",
  },
  NO: {
    background: "linear-gradient(135deg, #B81C13 0%, #D9291F 100%)",
    color: "#FFFFFF",
  },
  NEED_FEE: { background: BRAND_GRADIENT, color: "#FFFFFF" },
  NEED_VALUE: { background: BRAND_GRADIENT, color: "#FFFFFF" },
};

const SOFT_GRADIENT = "linear-gradient(135deg, #F8D4E5 0%, #D6DBF4 100%)";

const blockCls =
  "mb-3 rounded-2xl border border-[#F2F2F2] bg-white px-4 py-4 sm:px-5";
const blockHeadCls =
  "mb-3 text-[11px] font-bold uppercase tracking-widest text-[#9747FF]";

// ──────────────────────────────────────────
//  RESULT PRIMITIVES
//  Declared at module scope so React reconciles them instead of remounting
//  the whole result block on every render.
// ──────────────────────────────────────────
const Row = ({
  label,
  value,
  note,
  total = false,
}: {
  label: string;
  value: string;
  note?: string;
  total?: boolean;
}) => (
  <div
    className={
      total
        ? "mt-1.5 flex items-baseline justify-between gap-3.5 border-t-2 border-[#212529] pt-3 text-base"
        : "flex items-baseline justify-between gap-3.5 border-b border-dashed border-[#F2F2F2] py-2.5 text-sm last:border-b-0"
    }
  >
    <span className={total ? "font-bold text-[#212529]" : "text-[#6B7280]"}>
      {label}
      {note && (
        <small className="mt-0.5 block text-xs font-normal text-[#999999]">
          {note}
        </small>
      )}
    </span>
    <span className="whitespace-nowrap font-bold tabular-nums text-[#212529]">
      {value}
    </span>
  </div>
);

const FLAG_TONES = {
  warn: { cls: "bg-[#FFF4CC] text-[#8A6A00]", Icon: AlertTriangle },
  ok: { cls: "bg-[#E3F7E8] text-[#1E7A34]", Icon: Check },
  info: { cls: "bg-[#EEE9FF] text-[#9747FF]", Icon: HelpCircle },
} as const;

const Flag = ({
  tone,
  children,
}: {
  tone: keyof typeof FLAG_TONES;
  children: ReactNode;
}) => {
  const { cls, Icon } = FLAG_TONES[tone];
  return (
    <div className="flex items-start gap-3 border-b border-dashed border-[#F2F2F2] py-2.5 text-sm text-[#6B7280] last:border-b-0">
      <span
        className={`mt-0.5 grid h-[22px] w-[22px] flex-none place-items-center rounded-md ${cls}`}
      >
        <Icon className="h-3 w-3" strokeWidth={3} />
      </span>
      <span>{children}</span>
    </div>
  );
};

const Tile = ({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone?: "pos" | "neg";
}) => (
  <div className="rounded-2xl bg-[#FAFAFA] px-4 py-3.5">
    <p className="mb-1 text-xs font-semibold text-[#999999]">{label}</p>
    <p
      className={`text-lg font-bold tabular-nums tracking-tight ${
        tone === "neg"
          ? "text-[#FF3B30]"
          : tone === "pos"
            ? "text-[#26A745]"
            : "text-[#212529]"
      }`}
    >
      {value}
    </p>
  </div>
);

// ──────────────────────────────────────────
//  COMPONENT
// ──────────────────────────────────────────
type Screen = "intro" | "question" | "review" | "result";

const BarterDealChecker = ({ embed = false }: { embed?: boolean } = {}) => {
  const [screen, setScreen] = useState<Screen>("intro");
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<Form>(initialForm);
  const [result, setResult] = useState<Result | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const topRef = useRef<HTMLDivElement>(null);
  const mounted = useRef(false);

  const question = QUESTIONS[step];
  const isLast = step === QUESTIONS.length - 1;

  const update = (key: FormKey, value: string) =>
    setForm((f) => ({ ...f, [key]: value }));

  const scrollToTop = () => {
    if (embed) {
      topRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Jump back to the top on the screens that swap in a full page of new
  // content. Runs after commit — scrolling inside the click handler races the
  // re-render and the browser's scroll anchoring cancels it.
  useEffect(() => {
    if (!mounted.current) {
      mounted.current = true;
      return;
    }
    if (screen === "question") return;
    scrollToTop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [screen]);

  // Focus the amount field whenever a money question comes up.
  useEffect(() => {
    if (screen !== "question" || question.type !== "money") return;
    const t = setTimeout(() => inputRef.current?.focus(), 60);
    return () => clearTimeout(t);
  }, [screen, step, question.type]);

  const start = () => {
    setStep(0);
    setScreen("question");
  };

  const goNext = () => {
    if (!isLast) {
      setStep((s) => s + 1);
      return;
    }
    setScreen("review");
  };

  const goBack = () => {
    if (screen === "review") {
      setStep(QUESTIONS.length - 1);
      setScreen("question");
      return;
    }
    if (step > 0) setStep((s) => s - 1);
  };

  const skip = () => {
    update(question.key, "0");
    goNext();
  };

  const chooseOption = (key: ChoiceKey, value: string) => {
    update(key, value);
    setTimeout(goNext, 180);
  };

  const goToQuestion = (index: number) => {
    setStep(index);
    setScreen("question");
  };

  const calculate = () => {
    setResult(compute(form));
    setScreen("result");
  };

  const reset = () => {
    setForm(initialForm);
    setResult(null);
    setStep(0);
    setScreen("intro");
  };

  const editAnswers = () => {
    setScreen("review");
  };

  // Next is blocked only on choice questions until something is picked.
  const nextDisabled = question.type === "choice" && !form[question.key];

  const showProgress = screen === "question" || screen === "review";
  const progress =
    screen === "review" ? 100 : (step / QUESTIONS.length) * 100;

  // ──────────────────────────────────────────
  //  STYLES (blog theme — white, #212529 / #999999 / #F2F2F2 / #9747FF)
  // ──────────────────────────────────────────
  const cardCls = `border border-[#F2F2F2] bg-white shadow-[0_2px_8px_rgba(17,17,20,.06),0_12px_32px_rgba(129,52,175,.08)] ${
    embed ? "p-5" : "p-6 sm:p-8"
  }`;
  const cardRadius = { borderRadius: embed ? "24px" : "34px" };
  const primaryBtnCls =
    "flex items-center justify-center gap-2 rounded-full px-6 py-3.5 text-base font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:bg-none disabled:bg-[#F2F2F2] disabled:text-[#B0B0BC] disabled:shadow-none";

  // ──────────────────────────────────────────
  //  RESULT COPY
  // ──────────────────────────────────────────
  const verdictCopy = (r: Result) => {
    switch (r.verdict) {
      case "NEED_FEE":
        return {
          label: "One thing missing",
          big: "We need your usual rate",
          sub: "Without the fee you normally charge, we cannot tell you whether this deal is fair. Add it and run this again.",
        };
      case "NEED_VALUE":
        return {
          label: "One thing missing",
          big: "We need a product value",
          sub: "Add the market price, the MRP, or the value the brand wrote in their email.",
        };
      case "YES":
        return {
          label: "Our verdict",
          big: "Yes — worth accepting",
          sub: `This deal clears your minimum by ${inr(r.gap)}.`,
        };
      case "MAYBE":
        return {
          label: "Our verdict",
          big: "Maybe — it only just works",
          sub: "This deal sits right on your minimum. A small ask could tip it your way.",
        };
      default:
        return {
          label: "Our verdict",
          big: "No — negotiate or skip",
          sub: `This deal falls ${inr(r.gap)} short of your minimum.`,
        };
    }
  };

  const nextStepCopy = (r: Result) => {
    if (r.verdict === "YES")
      return "Before you say yes, get the usage rights, number of revisions and the deadline in writing. A good number can still turn bad on unlimited revisions.";
    if (r.verdict === "MAYBE")
      return `It just about works. Ask for a small cash component to cover your ${inr(
        numOr0(form.exp),
      )} in expenses, or reduce one deliverable. Either way, tip it in your favour.`;
    return `Ask for at least ${inr(
      r.gap,
    )} more in cash or product value, cut the deliverables down, or pass on this one. You are currently subsidising the brand.`;
  };

  const howWeDecided = (r: Result) => {
    let how: string;
    if (numOr0(form.market) > 0)
      how =
        "We used the market price on the date you received it as the fair market value. ";
    else if (numOr0(form.mrp) > 0 && numOr0(form.mailVal) > 0)
      how =
        "You did not add a market price, so we used the lower of the MRP and the brand email value. ";
    else if (r.fmv > 0) how = "We used the only product value you gave us. ";
    else how = "No product value was added, so this is based on cash alone. ";

    how +=
      form.keep === "Yes"
        ? `You keep the product, so we counted ${inr(r.counted)} of product value. `
        : "You return the product, so we counted zero product value. ";

    how += `Your benchmark of ${inr(r.benchmark)} is your usual fee of ${inr(
      numOr0(form.fee),
    )}${
      r.outOfPocket > 0
        ? ` plus the ${inr(r.outOfPocket)} you would pay from your own pocket.`
        : "."
    }`;

    return how;
  };

  return (
    <div className="w-full max-w-full bg-white text-[#212529]">
      <div
        ref={topRef}
        className={`mx-auto max-w-[560px] ${
          embed ? "px-3 pb-6 pt-4" : "px-4 pb-16 pt-8 sm:px-6 sm:pb-20 sm:pt-10"
        }`}
      >
        {/* HEADER */}
        <span className="mb-3.5 inline-flex items-center gap-2 rounded-full bg-[#F2F2F2] px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-[#9747FF]">
          <span
            className="h-[7px] w-[7px] rounded-full"
            style={{ background: CREATOR_GRADIENT }}
          />
          Free Creator Tool
        </span>
        <h1
          className={`mb-2 font-bold leading-tight tracking-tight ${
            embed ? "text-xl" : "text-2xl sm:text-[34px]"
          }`}
        >
          Should I accept this barter deal?
        </h1>
        {/* Stays in the source for SEO; the progress bar takes over the
            orienting job once the flow starts. */}
        {screen === "intro" && (
          <p className="text-[15px] text-[#6B7280]">
            Answer 9 simple questions. We&apos;ll estimate what the deal is
            really worth to you — after your expenses and tax.
          </p>
        )}

        {/* PROGRESS */}
        {showProgress && (
          <div className="mb-3.5 mt-5 flex items-center gap-3">
            <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-[#F2F2F2]">
              <div
                className="h-full rounded-full transition-[width] duration-300 ease-out"
                style={{ width: `${progress}%`, background: CREATOR_GRADIENT }}
              />
            </div>
            <span className="whitespace-nowrap text-xs font-semibold tabular-nums text-[#999999]">
              {screen === "review" ? QUESTIONS.length : step + 1} of{" "}
              {QUESTIONS.length}
            </span>
          </div>
        )}

        {/* INTRO */}
        {screen === "intro" && (
          <div className={`mt-5 ${cardCls}`} style={cardRadius}>
            <ul className="mb-5 list-none p-0">
              {[
                <>
                  Find the{" "}
                  <b className="font-semibold text-[#212529]">
                    fair market value
                  </b>{" "}
                  of the product or perk
                </>,
                <>
                  See if you&apos;ll{" "}
                  <b className="font-semibold text-[#212529]">
                    make money or go out of pocket
                  </b>
                </>,
                <>
                  Check if{" "}
                  <b className="font-semibold text-[#212529]">
                    GST or Section 194R TDS
                  </b>{" "}
                  may apply
                </>,
                <>
                  Get a clear{" "}
                  <b className="font-semibold text-[#212529]">Yes, Maybe or No</b>{" "}
                  — and what to ask for
                </>,
              ].map((item, i) => (
                <li
                  key={i}
                  className="flex items-start gap-3 border-b border-[#F2F2F2] py-2.5 text-[15px] text-[#6B7280] last:border-b-0"
                >
                  <span
                    className="mt-0.5 grid h-5 w-5 flex-none place-items-center rounded-full"
                    style={{ background: SOFT_GRADIENT }}
                  >
                    <Check className="h-3 w-3 text-[#8134AF]" strokeWidth={3} />
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <button
              type="button"
              onClick={start}
              className={`w-full ${primaryBtnCls}`}
              style={{ background: CREATOR_GRADIENT }}
            >
              Start — it takes 60 seconds
            </button>
            <p className="mt-3.5 text-center text-[13px] text-[#999999]">
              Free. No signup. Nothing is saved or sent anywhere.
            </p>
          </div>
        )}

        {/* QUESTION */}
        {screen === "question" && (
          <div
            key={step}
            className={`animate-[spFade_.3s_cubic-bezier(.4,0,.2,1)] ${cardCls}`}
            style={cardRadius}
          >
            <p className="mb-2 text-[11px] font-bold uppercase tracking-widest text-[#DD2A7B]">
              Question {step + 1}
            </p>
            <h2 className="mb-2 text-xl font-bold leading-snug tracking-tight sm:text-[22px]">
              {question.q}
            </h2>
            <p className="mb-5 text-sm text-[#6B7280]">{question.help}</p>

            {question.type === "money" ? (
              <div>
                <div className="relative flex items-center">
                  <span className="pointer-events-none absolute left-4 text-xl font-semibold text-[#999999]">
                    ₹
                  </span>
                  <input
                    ref={inputRef}
                    type="text"
                    inputMode="numeric"
                    aria-label={question.q}
                    placeholder="0"
                    className="w-full rounded-2xl border-[1.5px] border-[#F2F2F2] bg-white py-4 pl-10 pr-4 text-xl font-semibold text-[#212529] outline-none transition placeholder:font-medium placeholder:text-[#C4C4CE] focus:border-[#9747FF] focus:ring-4 focus:ring-[#9747FF]/10"
                    value={formatWithCommas(form[question.key])}
                    onChange={(e) =>
                      update(question.key, parseDigits(e.target.value))
                    }
                    onKeyDown={(e) => {
                      if (e.key === "Enter") goNext();
                    }}
                  />
                </div>
                <p className="mt-2 min-h-[18px] text-[13px] text-[#999999]">
                  {numOr0(form[question.key]) > 0
                    ? inr(numOr0(form[question.key]))
                    : ""}
                </p>
              </div>
            ) : (
              <div className="flex flex-col gap-2.5">
                {question.options.map((o) => {
                  const selected = form[question.key] === o.value;
                  return (
                    <button
                      key={o.value}
                      type="button"
                      aria-pressed={selected}
                      onClick={() => chooseOption(question.key, o.value)}
                      className={`flex w-full items-center gap-3 rounded-2xl border-[1.5px] px-4 py-3.5 text-left text-base font-semibold transition ${
                        selected
                          ? "border-[#8134AF] bg-[#FAF5FF] text-[#212529] ring-[3px] ring-[#8134AF]/10"
                          : "border-[#F2F2F2] bg-white text-[#212529] hover:border-[#9747FF] hover:bg-[#FCFAFF]"
                      }`}
                    >
                      <span
                        className={`grid h-5 w-5 flex-none place-items-center rounded-full border-2 transition ${
                          selected ? "border-[#8134AF]" : "border-[#CFCFD8]"
                        }`}
                      >
                        {selected && (
                          <span
                            className="h-2.5 w-2.5 rounded-full"
                            style={{ background: CREATOR_GRADIENT }}
                          />
                        )}
                      </span>
                      <span>
                        {o.label}
                        {o.sub && (
                          <small className="mt-0.5 block text-[13px] font-normal text-[#999999]">
                            {o.sub}
                          </small>
                        )}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}

            <div className="mt-6 flex items-center gap-3">
              <button
                type="button"
                onClick={goBack}
                className={`flex items-center gap-2 rounded-full px-2 py-3.5 text-base font-semibold text-[#6B7280] transition hover:text-[#9747FF] ${
                  step === 0 ? "invisible" : ""
                }`}
              >
                <ArrowLeft className="h-4 w-4" />
                Back
              </button>
              <button
                type="button"
                onClick={goNext}
                disabled={nextDisabled}
                className={`flex-1 ${primaryBtnCls}`}
                style={
                  nextDisabled ? undefined : { background: CREATOR_GRADIENT }
                }
              >
                {isLast ? "See my answers" : "Next"}
              </button>
            </div>

            {question.type === "money" && question.skip && (
              <button
                type="button"
                onClick={skip}
                className="mx-auto mt-3.5 block text-sm font-medium text-[#999999] underline underline-offset-[3px] transition hover:text-[#9747FF]"
              >
                I don&apos;t know this — skip
              </button>
            )}
          </div>
        )}

        {/* REVIEW */}
        {screen === "review" && (
          <div
            className={`animate-[spFade_.3s_cubic-bezier(.4,0,.2,1)] ${cardCls}`}
            style={cardRadius}
          >
            <p className="mb-2 text-[11px] font-bold uppercase tracking-widest text-[#DD2A7B]">
              Last step
            </p>
            <h2 className="mb-2 text-xl font-bold leading-snug tracking-tight sm:text-[22px]">
              That&apos;s everything.
            </h2>
            <p className="mb-5 text-sm text-[#6B7280]">
              Here&apos;s what you told us. Change anything before we run the
              numbers.
            </p>

            <div>
              {QUESTIONS.map((q, idx) => {
                const raw = form[q.key];
                const display =
                  q.type === "money"
                    ? numOr0(raw) > 0
                      ? inr(numOr0(raw))
                      : "—"
                    : raw || "—";
                return (
                  <div
                    key={q.key}
                    className="flex items-baseline justify-between gap-3.5 border-b border-dashed border-[#F2F2F2] py-2.5 text-sm last:border-b-0"
                  >
                    <span className="text-[#6B7280]">
                      {q.q.replace(/\?$/, "")}
                    </span>
                    <button
                      type="button"
                      onClick={() => goToQuestion(idx)}
                      className="whitespace-nowrap font-bold tabular-nums text-[#9747FF] underline underline-offset-[3px]"
                    >
                      {display}
                    </button>
                  </div>
                );
              })}
            </div>

            <div className="mt-6 flex items-center gap-3">
              <button
                type="button"
                onClick={goBack}
                className="flex items-center gap-2 rounded-full px-2 py-3.5 text-base font-semibold text-[#6B7280] transition hover:text-[#9747FF]"
              >
                <ArrowLeft className="h-4 w-4" />
                Back
              </button>
              <button
                type="button"
                onClick={calculate}
                className={`flex-1 ${primaryBtnCls}`}
                style={{ background: CREATOR_GRADIENT }}
              >
                Tell me if it&apos;s worth it
              </button>
            </div>
          </div>
        )}

        {/* RESULT */}
        {screen === "result" && result && (
          <div className="mt-5 animate-[spFade_.3s_cubic-bezier(.4,0,.2,1)]">
            {(() => {
              const r = result;
              const copy = verdictCopy(r);
              const style = VERDICT_STYLES[r.verdict];
              const needsMoreInput =
                r.verdict === "NEED_FEE" || r.verdict === "NEED_VALUE";

              return (
                <>
                  {/* Verdict */}
                  <div
                    className="mb-4 px-5 py-7 text-center"
                    style={{ ...cardRadius, ...style }}
                  >
                    {/* No opacity on the small copy — dimming 11px and 15px
                        text over a saturated gradient was what pushed these
                        sentences below a readable contrast ratio. */}
                    <p className="mb-2 text-[11px] font-bold uppercase tracking-[.1em]">
                      {copy.label}
                    </p>
                    <p className="mb-2 text-[30px] font-bold leading-tight tracking-tight sm:text-[38px]">
                      {copy.big}
                    </p>
                    <p className="text-[15px]">{copy.sub}</p>
                  </div>

                  {!needsMoreInput && (
                    <>
                      {/* Headline tiles */}
                      <div className="mb-4 grid grid-cols-2 gap-2.5">
                        <Tile
                          label="What this deal is really worth"
                          value={signedInr(r.finalVal)}
                          tone={r.finalVal >= 0 ? "pos" : "neg"}
                        />
                        <Tile
                          label="Your minimum benchmark"
                          value={inr(r.benchmark)}
                        />
                        <Tile
                          label="Estimated fair market value"
                          value={inr(r.fmv)}
                        />
                        <Tile
                          label={
                            r.cashLeft >= 0
                              ? "Cash left in your pocket"
                              : "Cash out of your pocket"
                          }
                          value={signedInr(r.cashLeft)}
                          tone={r.cashLeft >= 0 ? "pos" : "neg"}
                        />
                      </div>

                      {/* Out-of-pocket alert */}
                      {r.cashLeft < 0 && (
                        <div className="mb-3 rounded-2xl border border-[#FFD9D6] bg-[#FFF6F5] px-4 py-4 sm:px-5">
                          <div className="flex items-start gap-3 text-sm text-[#6B7280]">
                            <span className="mt-0.5 grid h-[22px] w-[22px] flex-none place-items-center rounded-md bg-[#FFF4CC] text-[#8A6A00]">
                              <AlertTriangle
                                className="h-3 w-3"
                                strokeWidth={3}
                              />
                            </span>
                            <span>
                              <b className="font-semibold text-[#212529]">
                                You would spend {inr(r.cashLeft)} of your own
                                money on this deal.
                              </b>{" "}
                              There is no cash coming in to cover your costs and
                              tax. Ask the brand for a cash component of at
                              least this amount.
                            </span>
                          </div>
                        </div>
                      )}

                      {/* Breakdown */}
                      <div className={blockCls}>
                        <p className={blockHeadCls}>The full breakdown</p>
                        <Row
                          label="Product value counted"
                          value={inr(r.counted)}
                          note={
                            form.keep === "Yes"
                              ? "You keep it, so the full FMV counts"
                              : "You return it, so this counts as zero"
                          }
                        />
                        <Row
                          label="Cash from the brand"
                          value={`+ ${inr(numOr0(form.cash))}`}
                        />
                        <Row
                          label="Your expenses"
                          value={`− ${inr(numOr0(form.exp))}`}
                          note="Editing, shipping, travel, props"
                        />
                        {r.gst > 0 && (
                          <Row
                            label="Estimated GST at 18%"
                            value={`− ${inr(r.gst)}`}
                            note={`On ${inr(r.beforeExp)} deal value`}
                          />
                        )}
                        {r.tds > 0 && (
                          <Row
                            label="Estimated 194R TDS at 10%"
                            value={`− ${inr(r.tds)}`}
                            note="Recoverable when you file your ITR"
                          />
                        )}
                        <Row
                          label="What this deal is really worth"
                          value={signedInr(r.finalVal)}
                          total
                        />
                      </div>

                      {/* Tax flags */}
                      <div className={blockCls}>
                        <p className={blockHeadCls}>Tax flags to check</p>
                        {form.keep === "Yes" || numOr0(form.cash) > 0 ? (
                          <Flag tone="warn">
                            <b className="font-semibold text-[#212529]">
                              Income tax may apply.
                            </b>{" "}
                            A product you keep for professional work can form
                            part of your business income.
                          </Flag>
                        ) : (
                          <Flag tone="ok">
                            <b className="font-semibold text-[#212529]">
                              You return the product
                            </b>
                            , so we counted zero product value. Returned review
                            units are treated differently.
                          </Flag>
                        )}

                        {form.gstin === "Yes" ? (
                          <Flag tone="warn">
                            <b className="font-semibold text-[#212529]">
                              GST may apply — around {inr(r.gst)}.
                            </b>{" "}
                            Barter brings in no cash to fund this. Ask the brand
                            to pay GST on top, in cash.
                          </Flag>
                        ) : (
                          <Flag tone="ok">
                            <b className="font-semibold text-[#212529]">
                              No GST estimate added
                            </b>
                            , based on your answer that you are not GST
                            registered.
                          </Flag>
                        )}

                        {form.over20k === "Yes" ? (
                          <Flag tone="warn">
                            <b className="font-semibold text-[#212529]">
                              Section 194R TDS may apply — around {inr(r.tds)}.
                            </b>{" "}
                            This is not money lost. It is credited against your
                            income tax when you file, so treat it as cash
                            blocked rather than cash gone.
                          </Flag>
                        ) : form.over20k === "Not sure" ? (
                          <Flag tone="info">
                            <b className="font-semibold text-[#212529]">
                              Check your total from this brand this financial
                              year.
                            </b>{" "}
                            If it crosses ₹20,000, expect around{" "}
                            {inr(r.tdsIfYes)} in 194R TDS. That would change
                            your result.
                          </Flag>
                        ) : (
                          <Flag tone="ok">
                            <b className="font-semibold text-[#212529]">
                              194R TDS not triggered
                            </b>
                            , based on your answer that this brand stays under
                            ₹20,000 this year.
                          </Flag>
                        )}
                      </div>

                      {/* Next step */}
                      <div
                        className="mb-3 rounded-2xl px-4 py-4 sm:px-5"
                        style={{ background: SOFT_GRADIENT }}
                      >
                        <h3 className="mb-1.5 text-[15px] font-bold text-[#212529]">
                          What to do next
                        </h3>
                        <p className="text-sm text-[#4A4A55]">
                          {nextStepCopy(r)}
                        </p>
                      </div>

                      {/* Method */}
                      <div className={blockCls}>
                        <p className={blockHeadCls}>How we decided</p>
                        <p className="text-sm text-[#6B7280]">
                          {howWeDecided(r)}
                        </p>
                      </div>
                    </>
                  )}

                  {/* Disclaimer */}
                  <div className="mb-4 rounded-2xl bg-[#F2F2F2] p-4 text-xs leading-relaxed text-[#999999]">
                    <b className="font-semibold text-[#212529]">
                      This is an educational tool, not tax or legal advice.
                    </b>{" "}
                    GST is estimated at a flat 18% and 194R TDS at 10%. Your
                    actual registration status, SAC code, place of supply and
                    contract terms may change the numbers. Usage rights,
                    exclusivity, revisions and deadlines are not covered here —
                    check those separately. Please confirm important decisions
                    with a qualified CA.
                  </div>

                  {/* CTA */}
                  <div
                    className="my-5 px-5 py-7 text-center text-white"
                    style={{ ...cardRadius, background: BRAND_GRADIENT }}
                  >
                    <h3 className="mb-2 text-xl font-bold tracking-tight">
                      Stop guessing on every deal
                    </h3>
                    <p className="mb-4 text-sm">
                      Sparkonomy tracks your deals, deliverables and payments in
                      one place — so you know your worth before the brand tells
                      you.
                    </p>
                    <Link
                      href="/creator/earn?utm_source=blog&utm_medium=tool&utm_campaign=barter_checker"
                      className="inline-block rounded-full bg-white px-7 py-3 text-[15px] font-bold text-[#7B2FD9]"
                    >
                      Join Sparkonomy free
                    </Link>
                  </div>

                  {/* Restart */}
                  <div className="flex gap-2.5">
                    <button
                      type="button"
                      onClick={reset}
                      className="flex-1 rounded-full border-[1.5px] border-[#F2F2F2] bg-white px-4 py-3 text-sm font-semibold text-[#6B7280] transition hover:border-[#9747FF] hover:text-[#9747FF]"
                    >
                      Check another deal
                    </button>
                    <button
                      type="button"
                      onClick={editAnswers}
                      className="flex-1 rounded-full border-[1.5px] border-[#F2F2F2] bg-white px-4 py-3 text-sm font-semibold text-[#6B7280] transition hover:border-[#9747FF] hover:text-[#9747FF]"
                    >
                      Edit my answers
                    </button>
                  </div>
                </>
              );
            })()}
          </div>
        )}

        {/* SEO / GEO CONTENT — always in the DOM, crawlable */}
        {!embed && (
          <div className="mt-11 border-t border-[#F2F2F2] pt-8">
            <h2 className="mb-3 text-xl font-bold tracking-tight">
              How this barter deal calculator works
            </h2>
            <p className="mb-2.5 text-[15px] text-[#6B7280]">
              Barter deals — also called gifting or product collaborations — are
              how most Indian creators start out. A brand sends a product, you
              make content, and no cash changes hands. The problem is that
              &ldquo;free product&rdquo; is rarely free. You still pay for
              editing, shipping, props and travel. And in India, a retained
              product received for professional work can carry real tax
              consequences.
            </p>
            <p className="mb-2.5 text-[15px] text-[#6B7280]">
              This tool takes nine simple inputs and returns a plain-language
              verdict, so you know whether a deal clears your own minimum bar
              before you say yes.
            </p>

            <h3 className="mb-1.5 mt-6 text-base font-bold">
              How we estimate fair market value (FMV)
            </h3>
            <p className="mb-2.5 text-[15px] text-[#6B7280]">
              We use the{" "}
              <b className="font-semibold text-[#212529]">
                market price on the date you received the product
              </b>{" "}
              as the first choice, because that reflects what the item is
              actually worth. If you don&apos;t have that, we use the{" "}
              <b className="font-semibold text-[#212529]">lower</b> of the
              brand&apos;s MRP and the value written in the brand&apos;s email.
              Brands often quote an inflated MRP, so the lower figure is the
              safer number to plan around.
            </p>

            <h3 className="mb-1.5 mt-6 text-base font-bold">
              What counts as your minimum benchmark
            </h3>
            <p className="mb-2.5 text-[15px] text-[#6B7280]">
              Your benchmark is your{" "}
              <b className="font-semibold text-[#212529]">usual cash fee</b> for
              the same work, plus any cash you&apos;d have to spend from your own
              pocket to complete the deal. If the deal&apos;s final value clears
              that benchmark, it&apos;s worth accepting. If it doesn&apos;t,
              you&apos;re subsidising the brand.
            </p>

            <h3 className="mb-1.5 mt-6 text-base font-bold">
              GST on barter deals
            </h3>
            <p className="mb-2.5 text-[15px] text-[#6B7280]">
              If you have a GSTIN, your content service is a taxable supply even
              when you&apos;re paid in product rather than cash. This tool
              applies a flat 18% estimate on the value of the deal as a planning
              figure. In a pure barter arrangement there&apos;s no cash coming in
              to fund that liability — which is why you should ask the brand to
              pay GST on top, in cash.
            </p>

            <h3 className="mb-1.5 mt-6 text-base font-bold">
              Section 194R TDS
            </h3>
            <p className="mb-2.5 text-[15px] text-[#6B7280]">
              Section 194R requires the brand to deduct 10% TDS when the value of
              benefits or perquisites given to you crosses ₹20,000 in a financial
              year. In a barter deal there&apos;s no cash for the brand to deduct
              from, so brands often ask the creator to deposit it. Note that 194R
              TDS is not money lost — it&apos;s credited against your final
              income tax when you file your return. It&apos;s a cash-flow
              problem, not a permanent cost.
            </p>

            <h3 className="mb-1.5 mt-6 text-base font-bold">
              Frequently asked questions
            </h3>
            <p className="mb-2.5 text-[15px] text-[#6B7280]">
              <b className="font-semibold text-[#212529]">
                Is a barter deal taxable in India?
              </b>{" "}
              A product or perk you keep in exchange for professional work may
              form part of your business or professional income. Returned review
              units are treated differently. Speak to a CA about your specific
              facts.
            </p>
            <p className="mb-2.5 text-[15px] text-[#6B7280]">
              <b className="font-semibold text-[#212529]">
                Should I ever accept a zero-cash barter deal?
              </b>{" "}
              Yes — when the product value comfortably clears your usual fee plus
              your costs, or when the brand relationship has strategic value
              you&apos;re choosing to invest in with eyes open. The point is to
              decide knowingly, not by default.
            </p>
            <p className="mb-2.5 text-[15px] text-[#6B7280]">
              <b className="font-semibold text-[#212529]">
                What should I ask a brand for if the answer is No?
              </b>{" "}
              Ask for a cash component that covers your expenses and tax, reduce
              the number of deliverables, shorten the usage-rights period, or
              walk away. The calculator tells you the exact gap to close.
            </p>

            <h3 className="mb-1.5 mt-6 text-base font-bold">Sources</h3>
            <ul className="list-disc pl-5 text-[13px] text-[#999999]">
              {[
                {
                  label: "GST valuation rules",
                  host: "cbic-gst.gov.in",
                  href: "https://cbic-gst.gov.in/valuation-rules.html",
                },
                {
                  label: "Section 15, CGST Act 2017",
                  host: "taxinformation.cbic.gov.in",
                  href: "https://taxinformation.cbic.gov.in/content/html/tax_repository/gst/acts/2017_CGST_act/active/chapter4/section15_v1.00.html",
                },
                {
                  label: "Section 28(iv), Income Tax Act",
                  host: "incometaxindia.gov.in",
                  href: "https://www.incometaxindia.gov.in/w/section-28-4",
                },
                {
                  label: "Section 194R, Income Tax Act",
                  host: "incometaxindia.gov.in",
                  href: "https://www.incometaxindia.gov.in/w/section-194r-4",
                },
              ].map((s) => (
                <li key={s.href} className="mb-2.5 break-words">
                  {s.label} —{" "}
                  <a
                    href={s.href}
                    rel="nofollow noopener noreferrer"
                    target="_blank"
                    className="text-[#9747FF] hover:underline"
                  >
                    {s.host}
                  </a>
                </li>
              ))}
            </ul>

            <p className="mt-5 text-[13px] text-[#999999]">
              <b className="font-semibold text-[#212529]">Important:</b> This is
              a free educational decision tool for Indian creators. It gives a
              practical FMV estimate, not a final tax, legal or contract opinion.
              Check important decisions with a qualified CA or legal
              professional.
            </p>

            <p className="mt-6 border-t border-[#F2F2F2] pt-5 text-center text-xs text-[#999999]">
              Built by{" "}
              <Link href="/" className="text-[#9747FF] hover:underline">
                Sparkonomy
              </Link>{" "}
              · For Indian content creators · Barter &amp; gifting deals
            </p>
          </div>
        )}
      </div>

      {/* global: styled-jsx would otherwise scope-rename the keyframes, and the
          animation is applied through a Tailwind arbitrary-value class. */}
      <style jsx global>{`
        @keyframes spFade {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: none;
          }
        }
      `}</style>
    </div>
  );
};

export default BarterDealChecker;
