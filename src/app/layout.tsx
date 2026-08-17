import type { Metadata } from "next";
import { Toaster } from "sonner";
import "./globals.css";
import Providers from "./providers";
import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

export const metadata: Metadata = {
  title: "F-POS",
  description: "F-POS Standalone Application",
};
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={cn("font-sans", geist.variable)}>
      <body className="antialiased font-sans">
        <Providers>
          {children} <Toaster richColors />
        </Providers>
      </body>
    </html>
  );
}
