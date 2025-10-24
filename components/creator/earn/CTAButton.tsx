import React from "react";

interface CTAButtonProps {
    buttonText?: string;
    className?: string;
    navigateTo?: string;
}

const CTAButton = ({buttonText = "Send Invoices For Free", className, navigateTo = "https://dev.creator.sparkonomy.com/auth?service=invoice"}: CTAButtonProps) => {
    return (
        <button
            className={`all-[unset] box-border inline-flex items-start p-0.5 [-webkit-backdrop-filter:blur(16px)_brightness(100%)] relative flex-col rounded-[32px] backdrop-blur-[2px] backdrop-brightness-[100%] gap-2.5 bg-[#ffffff1a] border-[none] before:content-[''] before:[mask-composite:exclude] before:pointer-events-none before:inset-0 before:[background:linear-gradient(162deg,rgba(221,42,123,1)_0%,rgba(151,71,255,1)_64%)] before:absolute before:[-webkit-mask:linear-gradient(#fff_0_0)_content-box,linear-gradient(#fff_0_0)] before:rounded-[32px] before:p-px before:z-[1] before:[-webkit-mask-composite:xor] ${className}`}
            onClick={() => window.open(navigateTo, "_blank")}
        >
            <div
                className={`all-[unset] box-border items-center gap-2.5 flex-[0_0_auto] px-4 py-2.5 rounded-[32px] justify-center relative bg-[linear-gradient(162deg,rgba(221,42,123,0.4)_0%,rgba(151,71,255,0.4)_64%)] inline-flex shadow-[inset_0_1px_0_rgba(255,255,255,0.40),inset_1px_0_0_rgba(255,255,255,0.32),inset_0_-1px_1px_rgba(0,0,0,0.13),inset_-1px_0_1px_rgba(0,0,0,0.11)] [-webkit-backdrop-filter:blur(2.0px)_brightness(100.0%)_saturate(100.0%)] backdrop-blur-[2.0px] backdrop-brightness-[100.0%] backdrop-saturate-[100.0%]`}
            >
                <div className="font-title w-fit mt-[-1.00px] tracking-[var(--title-letter-spacing)] text-[length:var(--title-font-size)] [font-style:var(--title-font-style)] text-white font-[number:var(--title-font-weight)] leading-[var(--title-line-height)] whitespace-nowrap relative">
                    {buttonText}
                </div>
            </div>
        </button>
    );
};

export default CTAButton;