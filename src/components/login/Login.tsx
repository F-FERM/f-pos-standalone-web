"use client";

import LoginBackground from "./LoginBackground";
import LoginBrandPanel from "./LoginBrandPanel";
import LoginCard from "./LoginCard";

export default function Login() {
  return (
    <div className="relative min-h-dvh w-full overflow-hidden bg-[#141018] backdrop-blur-3xl">
      <LoginBackground />
      <div
        className="relative z-10 mx-auto flex min-h-dvh w-full max-w-[1400px] flex-col items-center
          justify-center gap-y-8 sm:gap-y-10 gap-x-12 lg:gap-x-16 px-4 py-6 sm:py-8
          overflow-y-auto md:flex-row"
      >
        <LoginBrandPanel />
        <LoginCard />
      </div>
    </div>
  );
}