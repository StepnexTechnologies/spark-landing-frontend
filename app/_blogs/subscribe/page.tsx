"use client";

import { useForm } from "@tanstack/react-form";
import Image from "next/image";

export default function SubscribePage() {
  const form = useForm({
    defaultValues: {
      email: "",
      whatsapp: "",
    },
    onSubmit: async ({ value }) => {
      // Handle newsletter subscription
      console.log("Subscribe:", value);
    },
  });

  return (
    <main className="min-h-screen flex flex-col">

      {/* Main Content */}
      <div className="flex-1 relative flex items-center justify-center px-4 md:px-8 lg:px-[148px] pt-[69px] pb-[100px]">
        {/* Gradient Background with Blur */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'linear-gradient(169.7deg, #DD2A7B 1.49%, #9747FF 42.07%, #334CCA 99.84%)',
            opacity: 0.15,
            filter: 'blur(100px)',
          }}
        />

        {/* Card Container */}
        <div className="relative z-10 bg-white rounded-3xl shadow-xl overflow-hidden w-full flex flex-col md:flex-row">
          {/* Left Side - Image */}
          <div className="w-full md:w-[60%] relative min-h-[250px] md:min-h-[400px]">
            <Image
              src="/NewsLetterSub.png"
              alt="Subscribe illustration"
              fill
              className="object-cover"
              style={{ objectPosition: '70% center' }}
            />
          </div>

          {/* Right Side - Form */}
          <div className="w-full md:w-[40%] p-6 md:p-8 lg:p-12 flex flex-col justify-center">
            {/* Logo */}
            <div className="mb-4 md:mb-6 flex justify-center">
              <Image
                src="/logo.png"
                alt="Sparkonomy"
                width={200}
                height={50}
                className="h-auto w-[140px] md:w-[180px]"
              />
            </div>

            {/* Heading */}
            <h1 className="text-lg md:text-xl lg:text-[24px] font-semibold text-[#6B7280] mb-6 md:mb-8 text-center">
              Sign up to receive news, updates and stories from Sparkonomy
            </h1>

            {/* Form */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                e.stopPropagation();
                form.handleSubmit();
              }}
              className="space-y-4"
            >
              {/* Email Input */}
              <form.Field name="email">
                {(field) => (
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                      <svg width="20" height="16" viewBox="0 0 20 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M18 0H2C0.9 0 0.00999999 0.9 0.00999999 2L0 14C0 15.1 0.9 16 2 16H18C19.1 16 20 15.1 20 14V2C20 0.9 19.1 0 18 0ZM18 4L10 9L2 4V2L10 7L18 2V4Z" fill="#9CA3AF"/>
                      </svg>
                    </div>
                    <input
                      type="email"
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      placeholder="Enter your email"
                      className="w-full pl-12 pr-4 py-3 md:py-4 border border-primary rounded-[12px] focus:outline-none focus:border-purple-500 text-gray-600 placeholder:text-gray-400 text-sm md:text-base"
                    />
                  </div>
                )}
              </form.Field>

              {/* WhatsApp Input */}
              <form.Field name="whatsapp">
                {(field) => (
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M10 0C4.48 0 0 4.48 0 10C0 11.85 0.5 13.55 1.36 15L0 20L5.15 18.68C6.55 19.5 8.21 20 10 20C15.52 20 20 15.52 20 10C20 4.48 15.52 0 10 0ZM14.88 13.75C14.65 14.38 13.57 14.93 13.08 14.97C12.59 15.01 12.13 15.18 10.24 14.44C7.96 13.55 6.52 11.22 6.41 11.08C6.3 10.94 5.47 9.83 5.47 8.68C5.47 7.53 6.05 6.97 6.27 6.72C6.49 6.47 6.75 6.41 6.91 6.41C7.07 6.41 7.23 6.41 7.37 6.42C7.52 6.43 7.72 6.36 7.91 6.81C8.11 7.27 8.58 8.42 8.63 8.52C8.68 8.62 8.71 8.74 8.64 8.88C8.57 9.02 8.53 9.1 8.42 9.23C8.31 9.36 8.19 9.52 8.09 9.62C7.98 9.73 7.87 9.85 7.99 10.07C8.11 10.29 8.57 11.07 9.26 11.68C10.14 12.46 10.88 12.7 11.1 12.81C11.32 12.92 11.44 12.9 11.57 12.75C11.7 12.6 12.14 12.08 12.28 11.86C12.42 11.64 12.56 11.68 12.75 11.75C12.94 11.82 14.09 12.38 14.3 12.49C14.51 12.6 14.65 12.65 14.7 12.74C14.75 12.83 14.75 13.22 14.88 13.75Z" fill="#9CA3AF"/>
                      </svg>
                    </div>
                    <input
                      type="tel"
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      placeholder="Enter your WhatsApp no"
                      className="w-full pl-12 pr-4 py-3 md:py-4 border border-primary rounded-[12px] focus:outline-none focus:border-purple-500 text-gray-600 placeholder:text-gray-400 text-sm md:text-base"
                    />
                  </div>
                )}
              </form.Field>

              {/* Privacy Notice */}
              <p className="text-[14px] font-normal text-[#6B7280] text-center">
                Your information will be used in accordance with Sparkonomy Privacy policy. You may opt at any time.
              </p>

              {/* Submit Button */}
              <div className="flex justify-center pt-2">
                <button
                  type="submit"
                  style={{
                    background: 'linear-gradient(309.99deg, #DD2A7B 3.31%, #9747FF 39.79%, #334CCA 91.72%)',
                  }}
                  className="px-8 md:px-10 py-3 rounded-full text-white font-medium hover:opacity-90 transition-opacity text-sm md:text-base"
                >
                  Subscribe Now
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
}
