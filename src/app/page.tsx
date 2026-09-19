"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { LoaderCircle } from "lucide-react";
import { LocalStorage } from "../utility/localStorage";

export default function Page() {
  const router = useRouter();

  useEffect(() => {
    const token = LocalStorage.getItem("access_token");

    if (token) {
      router.replace("/home");
    } else {
      router.replace("/login");
    }
  }, [router]);

  return (
    <main className="flex min-h-screen w-full items-center justify-center bg-white">
      <LoaderCircle className="h-8 w-8 animate-spin" />
    </main>
  );
}