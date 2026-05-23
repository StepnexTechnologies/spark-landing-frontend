import Link from "next/link";
import { Home } from "lucide-react";
import type { ReactNode } from "react";

type LegalHeaderProps = {
    title: ReactNode;
    effectiveDate?: string;
    lastUpdated?: string;
    homeHref?: string;
    homeClassName?: string;
    dateClassName?: string;
};

const LegalHeader = ({
    title,
    effectiveDate,
    lastUpdated,
    homeHref = "/?skipIntro=true",
    homeClassName = "mr-8 mt-2",
    dateClassName = "mb-8",
}: LegalHeaderProps) => {
    const dateParts: string[] = [];
    if (effectiveDate) dateParts.push(`Effective Date: ${effectiveDate}`);
    if (lastUpdated) dateParts.push(`Last Updated: ${lastUpdated}`);

    return (
        <>
            <div className="flex justify-between items-start mb-2">
                <h1 className="text-3xl font-bold text-primary">{title}</h1>
                <Link
                    href={homeHref}
                    className={`text-primary hover:text-primary/80 transition-colors ${homeClassName}`}
                >
                    <Home className="w-6 h-6" />
                </Link>
            </div>
            {dateParts.length > 0 && (
                <p className={`text-sm text-gray-500 ${dateClassName}`}>
                    {dateParts.join(" | ")}
                </p>
            )}
        </>
    );
};

export default LegalHeader;
