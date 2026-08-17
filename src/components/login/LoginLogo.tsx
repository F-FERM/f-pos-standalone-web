import Image from "next/image";
import { cn } from "@/lib/utils";
import logo from "../../../public/images/login/fposlogo.png"
/**
 * FPOS wordmark, loaded via next/image.
 *
 * Drop your exported logo file at public/images/fpos-logo.png (or .svg)
 * — update `src` if you place it elsewhere. This renders inside the fixed
 * 1024×768 login stage, so a fixed size (not responsive breakpoints) is
 * correct here — the stage itself scales as a whole.
 */
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