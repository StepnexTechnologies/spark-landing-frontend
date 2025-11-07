import Link from "next/link";
import Image from "next/image";

export default function BlogFooter() {
  return (
    <footer className="w-full bg-white border-t border-slate-200 px-6 py-[16px] h-[120px] flex items-center">
      <div className="max-w-7xl mx-auto w-full">
        <div className="flex flex-col items-center text-center space-y-4">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <Image
              src="/FooterLogo.png"
              alt="Sparkonomy"
              width={180}
              height={40}
              className="h-10 w-auto"
            />
          </Link>

          {/* Links */}
          <div className="flex flex-wrap justify-center gap-4 text-xs font-normal text-slate-600">
            <Link href="/terms-conditions" className="hover:text-purple-600 transition-colors">
              Terms & Conditions
            </Link>
            <span className="text-slate-300">|</span>
            <Link href="/privacy-policy" className="hover:text-purple-600 transition-colors">
              Privacy Policy
            </Link>
            <span className="text-slate-300">|</span>
            <span className="text-slate-600">
              ©All right reserved.
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
