"use client";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home } from "lucide-react";

const NotFound: React.FC = () => {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);
  const last = segments.at(-1) ?? "";
  const section =
    segments.length >= 2
      ? segments[0][0].toUpperCase() + segments[0].slice(1)
      : "Page";

  return (
    <section className="relative min-h-screen w-full overflow-hidden bg-black">
      <video
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 h-full w-full object-cover"
      >
        <source src="/404/NotFounf.mp4" type="video/mp4" />
      </video>
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-[70%]"
        style={{
          background: "#9747FF",
          WebkitMaskImage:
            "radial-gradient(ellipse 70% 100% at 50% 0%, #000 0%, rgba(0,0,0,0) 80%)",
          maskImage:
            "radial-gradient(ellipse 70% 100% at 50% 0%, #000 0%, rgba(0,0,0,0) 80%)",
          mixBlendMode: "screen",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-[70%]"
        style={{
          background: "#DD2A7B",
          WebkitMaskImage:
            "radial-gradient(ellipse 70% 100% at 50% 0%, #000 0%, rgba(0,0,0,0) 80%)",
          maskImage:
            "radial-gradient(ellipse 70% 100% at 50% 0%, #000 0%, rgba(0,0,0,0) 80%)",
          mixBlendMode: "overlay",
          opacity: 0.6,
        }}
      />

      <span
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 grid select-none justify-items-center text-[28vw] font-black leading-[0.85] text-white/10"
      >
        404
      </span>

      <div className="relative z-10 mx-auto grid min-h-screen max-w-6xl grid-cols-1 items-center gap-8 px-6 py-16 md:grid-cols-2">
        <div className="flex flex-col gap-3 text-white">
          <h1 className="text-[52px] font-bold leading-tight">Hey Buddy</h1>
          <p className="max-w-sm text-[20px] font-normal">
            We can&apos;t seem to find the page
            <br />
            you are looking for
          </p>
          {last && (
            <p className="text-[20px] font-normal">
              {section} &quot;
              <span className="font-semibold">{last}</span>
              &quot; does not exist
            </p>
          )}
          <Link
            href="/creator/earn"
            style={{
              background:
                "linear-gradient(162.34deg, #DD2A7B 4.78%, #9747FF 89.95%)",
            }}
            className="mt-3 inline-flex w-fit items-center gap-2 rounded-full px-6 py-3 font-medium text-white shadow-lg transition hover:opacity-90"
          >
            <Home size={18} /> Go Home
          </Link>
        </div>

        <div className="flex justify-center md:justify-end">
          <Image
            src="/404/Masscot.png"
            alt="Sparkonomy mascot"
            width={400}
            height={378}
            priority
          />
        </div>
      </div>
    </section>
  );
};

export default NotFound;
