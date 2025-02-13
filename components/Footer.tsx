import { Lock } from "lucide-react";

export default function Footer() {
  return (
    <footer className="w-full flex justify-center items-center py-6 mt-auto">
      <div className="flex items-center space-x-2 text-xs sm:text-sm text-gray-400">
        <Lock className="w-3 h-3 sm:w-4 sm:h-4" />
        <span>Your data is secure with us</span>
      </div>
    </footer>
  );
}
