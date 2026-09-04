import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { StaticImageData } from "next/image";
import { cn } from "@/src/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 [&_img]:pointer-events-none [&_img]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow-xs hover:bg-primary/90 ",
        login:"mt-6 mb-2 flex h-[50px] w-[365px] items-center justify-center gap-2.5 rounded-[10px] bg-[#3EA200] py-[11px] pl-[52px] pr-[52px] cursor-pointer font-poppins text-base font-bold tracking-wide text-white hover:bg-[#22C55E]/90 disabled:opacity-60",
        destructive:
          "bg-destructive text-white py-[7px] px-[30px] rounded-lg font-medium text-base min-w-[100px] hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
        outline:
          "border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50",
        secondary:
          "bg-[#E4E4E4] hover:bg-[#D4D4D4] text-black px-10 h-11 rounded-lg font-medium text-base min-w-[100px]",
        ghost:
          "hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50",
        link: "text-primary underline-offset-4 hover:underline",
        cancel:
          " border-gray-300 text-gray-700 hover:bg-gray-50 px-5 h-11 rounded-lg font-medium text-base min-w-[100px] border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50 cursor-pointer",

        create:
          "bg-primary hover:bg-primary/50 text-white px-10 h-11 rounded-lg font-medium text-base min-w-[100px] cursor-pointer",
        deletecancel:
          "w-[138px] h-[42px]  py-8 opacity-100 rounded-[5px] p-[10px] gap-[8px] border border-[#3D3E46] text-base bg-white",
        delete:
          "w-[138px] h-[42px] opacity-100 rounded-[5px] p-[10px] gap-[8px] border bg-red-600 text-white text-base",
        deleteicon:
          "h-4 p-1 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 cursor-pointer flex-shrink-0 text-red-600 hover:bg-red-100 hover:text-red-600 transition-colors",
        editicon:
          "h-4 p-1 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 cursor-pointer flex-shrink-0 hover:bg-primary-100 transition-colors text-primary",
        viewicon:
          "h-4 p-1 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 cursor-pointer hover:bg-gray-200",
        addcustomer:
          "w-[200px] h-[50px] gap-[10px] rounded-[12px] border border-[#D4CCD4] bg-[#450042] pt-[15px] pr-[17px] pb-[14px] pl-[18px] text-[18px] font-medium text-white opacity-100 hover:bg-[#FFFFFF3D]",
        add:
          "w-[157px] h-[50px] gap-[10px] rounded-[12px] border border-secondary bg-[#450042] pt-[15px] pr-[58px] pb-[14px] pl-[58px] text-[18px] font-semibold tracking-wide text-white transition-colors duration-200 hover:bg-[#5C0D5C] hover:text-white",
      },
      size: {
        default: " px-4 py-2 has-[>svg]:px-3",
        sm: "h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5",
        lg: "h-10 rounded-md px-6 has-[>svg]:px-4",
        icon: "size-9",
        none: "",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

interface ButtonProps
  extends React.ComponentProps<"button">,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  iconSrc?: string | StaticImageData;
  icon?: React.ElementType;
  iconAlt?: string;
  iconSize?: number;
}

function Button({
  className,
  variant,
  size,
  asChild = false,
  type = "button",
  iconSrc,
  icon: Icon,
  iconAlt = "",
  iconSize = 18,
  children,
  ...props
}: ButtonProps) {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      data-slot="button"
      type={type}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    >
      {Icon && <Icon size={iconSize} />}
      {iconSrc && (
        <img
          src={typeof iconSrc === "string" ? iconSrc : iconSrc.src}
          alt={iconAlt}
          width={iconSize}
          height={iconSize}
          style={{ width: iconSize, height: iconSize }}
        />
      )}
      {children}
    </Comp>
  );
}

export { Button, buttonVariants };