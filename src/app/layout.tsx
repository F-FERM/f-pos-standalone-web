import { cn } from "@/lib/utils";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";
import Providers from "./providers";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "F-POS",
  description: "F-POS Standalone Application",
};
const STAGE_WIDTH = 1024;
const STAGE_HEIGHT = 768;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={cn("font-sans", inter.variable)}>
      <body className="antialiased font-sans bg-black">
        <Providers>
          <div className="fixed inset-0 flex items-center justify-center overflow-hidden">
            <div
              className="relative shrink-0 origin-center w-[1024px] h-[768px] bg-black"
              style={{
                transform: `scale(min(1, min(calc(100vw / ${STAGE_WIDTH}px), calc(100dvh / ${STAGE_HEIGHT}px))))`,
              }}
            >
              {children}
            </div>
          </div>
          <Toaster richColors />
        </Providers>
      </body>
    </html>
  );
}
