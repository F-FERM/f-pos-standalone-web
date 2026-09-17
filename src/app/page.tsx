"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { LocalStorage } from "../utility/localStorage";
import { Loader } from "lucide-react";

function Page() {
   const router = useRouter();

  useEffect(() => {
    const token = LocalStorage.getItem("access_token");
    if (token) {
      router.replace("/home");
    }else{
      router.replace("/login");
    }
  }, [router]);
  return (
     <div className="flex h-[90vh] w-[100%] items-center justify-center">
      <Loader type="dots" size={30} className="animate-spin" />
    </div>
  );
}

export default Page;
