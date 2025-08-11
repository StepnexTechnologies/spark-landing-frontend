import Image from "next/image";
import Link from "next/link";

const LegalFooter = () => {
    return (
        <div className="mt-auto mb-4 w-full flex flex-col items-center z-10">
            <div className="w-full px-8">
                <div className="border-t pt-4 border-[#C8C8C8] w-full" />
            </div>
            <Image
                src={"/logo.png"}
                alt="sparkonomy logo"
                className="h-5 md:h-8 w-auto"
                width={100}
                height={32}
            />
            <div className="text-[#999999] text-[10px] lg:text-[14px]">
                sparking the creator economy
            </div>
            <div className={"text-primary"}>
                <Link className={"text-xs underline"} href={"/legal/privacy-policy"}>Privacy Policy</Link>
                {" | "}
                <Link className={"text-xs underline"} href={"/legal/terms"}>Terms of Service</Link>
            </div>
        </div>
    );
};

export default LegalFooter;
