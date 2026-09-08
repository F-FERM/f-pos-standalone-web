import Image from "next/image";
import logo from "../../../public/images/login/fposlogo.png"
import { cn } from "@/src/lib/utils";

export function FposLogo({ className }: { className?: string }) {
  return (
    <div className={cn("relative h-[150px] w-[400px]", className)}>
      <Image
        src={logo}
        alt="FPOS"
        fill
        priority
        sizes="800px"
        className="object-contain object-left"
      />
    </div>
  );
}

export default FposLogo;