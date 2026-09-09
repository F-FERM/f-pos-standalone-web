"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { LocalStorage } from "../utility/localStorage";

function Page() {
   const router = useRouter();

  useEffect(() => {
    const token = LocalStorage.getItem("access_token");
    if (token) {
      router.replace("/login");
    }else{
      router.replace("/login");
    }
  }, [router]);
  return (
    <div>
      <h1>Page</h1>
    </div>
  );
}

export default Page;