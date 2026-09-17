import type { Metadata } from "next";

import { Toaster } from "sonner";
import "./globals.css";
import Providers from "./providers";

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
    <html lang="en" >
      <body className="antialiased font-sans bg-black">
        <Providers>{children}<Toaster richColors /></Providers>
      </body>
    </html>
  );
}

