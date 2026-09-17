import Image from "next/image";
import logo from "../../../public/images/login/fposlogo.png";
import { cn } from "@/src/lib/utils";

export function FposLogo({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "relative w-[220px] sm:w-[280px] md:w-[340px] lg:w-[400px] aspect-[400/150]",
        className
      )}
    >
      <Image
        src={logo}
        alt="FPOS"
        fill
        priority
        sizes="(max-width: 640px) 220px, (max-width: 768px) 280px, (max-width: 1024px) 340px, 400px"
        className="object-contain object-left"
      />
    </div>
  );
}

export default FposLogo;