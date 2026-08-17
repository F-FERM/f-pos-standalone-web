"use client";

import { useEffect, useState } from "react";
import { Delete, RotateCcw, ArrowRight } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import FposLogo from "../components/login/LoginLogo";
import FormCombobox from "../components/form/LoginFormCombobox";

import LoginFormInput from "../components/form/LoginFormInput";
import LoginFormCombobox from "../components/form/LoginFormCombobox";
import FormInput from "../components/form/FormInput";


const MAX_PIN_LENGTH = 6;
const KEYPAD_DIGITS = ["1", "2", "3", "4", "5", "6", "7", "8", "9"] as const;

const ROLES = [
  { value: "admin", label: "Admin" },
  { value: "manager", label: "Manager" },
  { value: "cashier", label: "Cashier" },
];

// The whole login screen is a fixed 1024×768 "stage" that scales uniformly
// to fit any viewport (like a kiosk display), rather than a fluid page that
// reflows per breakpoint. This keeps every measurement below pixel-exact to
// the design at any screen size, and centers it on black like the reference.
const STAGE_WIDTH = 1024;
const STAGE_HEIGHT = 768;

const KEYPAD_BUTTON_CLASS =
  "w-[115px] h-[50px] rounded-[10px] ";

const KEYPAD_NUMBER_TEXT_CLASS =
  "font-[Inter,sans-serif] font-semibold text-[22px] leading-none tracking-[0%]";

const loginSchema = z.object({
  role: z.string().min(1, "Role is required"),
  pin: z
    .string()
    .min(4, "PIN must be at least 4 digits")
    .max(MAX_PIN_LENGTH, `PIN can't exceed ${MAX_PIN_LENGTH} digits`),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const [now, setNow] = useState<Date | null>(null);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { role: "admin", pin: "" },
  });

  const pin = form.watch("pin");

  // Live clock — mounted client-side only to avoid hydration mismatches.
  useEffect(() => {
    setNow(new Date());
    const timer = setInterval(() => setNow(new Date()), 1000 * 30);
    return () => clearInterval(timer);
  }, []);

  const handleDigit = (digit: string) => {
    const current = form.getValues("pin");
    if (current.length >= MAX_PIN_LENGTH) return;
    form.setValue("pin", current + digit, { shouldValidate: true });
  };

  const handleBackspace = () => {
    form.setValue("pin", form.getValues("pin").slice(0, -1), {
      shouldValidate: true,
    });
  };

  const handleClear = () =>
    form.setValue("pin", "", { shouldValidate: true });

  const onSubmit = (values: LoginFormValues) => {
    // Wire this up to your auth call.
    console.log("Logging in", values);
  };

  const timeLabel = now
    ? now.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })
    : "--:--";
  const [timeValue, meridiem] = timeLabel.split(" ");
  const dayLabel = now
    ? now.toLocaleDateString("en-US", { weekday: "long" })
    : "";
  const dateLabel = now
    ? now.toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    : "";

  return (
    <div className="fixed inset-0 flex items-center justify-center overflow-hidden bg-black">
      {/* Fixed-size stage, uniformly scaled to fit the viewport and centered.
          `min(1, ...)` caps it at native size — on big monitors you get more
          black margin, never an upscaled/blurry canvas.
          Kept as inline style: the scale factor depends on runtime viewport
          units (vw/dvh) combined via calc(), which Tailwind's static
          arbitrary-value classes can't express. */}
      <div
        className="relative shrink-0 origin-center w-[1024px] h-[768px]"
        style={{
          transform: `scale(min(1, min(calc(100vw / ${STAGE_WIDTH}px), calc(100dvh / ${STAGE_HEIGHT}px))))`,
        }}
      >
        {/* Background photo */}
        <div className="absolute inset-0 bg-[#141018] bg-cover bg-center bg-[url('/images/login/login-fpos.jpg')]" />
        {/* Darken + tint so the UI stays legible over the photo */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/20" />

        {/* Left: brand + live clock — top-aligned with the card at y=84 */}
        <section className="absolute left-16 top-[140px] flex w-[420px] flex-col">
          {/* Logo → tagline below it */}
          <div className="flex flex-col items-start">
            <FposLogo />
            <p className="font-[GROCHES] text-[26px] font-normal leading-none tracking-[0%] text-white">
              SERVE FAST SELL SMART
            </p>
          </div>

          {/* Gap to clock block — adjust this value to match Figma exactly */}
          <div className="mt-[80px] flex flex-col gap-1 text-white">
            <div className="flex items-baseline gap-2 pl-3">
              <span className="font-[Inter,sans-serif] text-[82px] font-semibold leading-none tracking-[0%]">
                {timeValue}
              </span>
              <span className="font-[Inter,sans-serif] text-[28px] font-semibold leading-none tracking-[0%] text-white">
                {meridiem}
              </span>
            </div>
            <p className="font-[Poppins,sans-serif] text-[22px] font-normal leading-none tracking-[0%]">
              {dayLabel}
            </p>
            <p className="font-[Poppins,sans-serif] text-[22px] font-normal leading-none tracking-[0%]">
              {dateLabel}
            </p>
          </div>
        </section>

        {/* Login card — 427×539, radius 20, at top:84 left:517 */}
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="absolute top-[84px] left-[517px] flex w-[427px] h-[570px] flex-col rounded-[20px]
              border border-white/40 bg-white/8 pt-6 pr-[31px] pb-[27px] pl-[31px] shadow-2xl backdrop-blur-[2px]"
          >
            <h1 className="mb-[18px] text-center font-[Poppins,sans-serif] text-[32px] font-semibold leading-none tracking-[0%] text-white">
              Login
            </h1>

            {/* Role select — shared FormCombobox, kiosk variant (365×50 spec) */}
            <LoginFormCombobox
              name="role"
              placeholder="Select role"
              options={ROLES}
              variant="kiosk"
              className="mb-[10px]"
            />
            

            {/* PIN field — shared FormInput, kiosk variant. type="password" gives
                us the built-in show/hide eye toggle for free. readOnly since
                entry is keypad-driven, not typed. */}
            <LoginFormInput
              name="pin"
              type="password"
              value={pin}
              readOnly
              placeholder="Enter PIN"
              variant="kiosk"
              className="mb-[10px]"
            />

            {/* Keypad — buttons 115×50, gap 10px, radius 10 */}
            <div className="mt-[25px] grid grid-cols-3 gap-[10px]">
              {KEYPAD_DIGITS.map((digit) => (
                <button
                  key={digit}
                  type="button"
                  onClick={() => handleDigit(digit)}
                  className={cn(
                    KEYPAD_BUTTON_CLASS,
                    "flex items-center justify-center bg-white text-[#1a1a1a] shadow-sm transition hover:bg-white/90 active:scale-[0.98]"
                  )}
                >
                  <span className={KEYPAD_NUMBER_TEXT_CLASS}>{digit}</span>
                </button>
              ))}

              <button
                type="button"
                onClick={() => handleDigit("0")}
                className={cn(
                  KEYPAD_BUTTON_CLASS,
                  "flex items-center justify-center bg-white text-[#1a1a1a] shadow-sm transition hover:bg-white/90 active:scale-[0.98]"
                )}
              >
                <span className={KEYPAD_NUMBER_TEXT_CLASS}>0</span>
              </button>
              <button
                type="button"
                onClick={handleClear}
                aria-label="Clear PIN"
                className={cn(
                  KEYPAD_BUTTON_CLASS,
                  "flex items-center justify-center bg-[#3B82F6] text-white shadow-sm transition hover:bg-[#3B82F6]/90 active:scale-[0.98]"
                )}
              >
               <RotateCcw  />
              </button>
              <button
                type="button"
                onClick={handleBackspace}
                aria-label="Backspace"
                className={cn(
                  KEYPAD_BUTTON_CLASS,
                  "flex items-center justify-center bg-[#EF4444] text-white shadow-sm transition hover:bg-[#EF4444]/90 active:scale-[0.98]"
                )}
              >
                <Delete />
              </button>
            </div>

            {/* Submit — 365×50, radius 10, at top:546 left:548 (36px below keypad) */}
            <Button
              type="submit"
              disabled={pin.length === 0}
              className="mt-[29px] flex h-[50px] w-full items-center justify-center gap-1.5 rounded-[10px] bg-[#22C55E] font-poppins text-base font-bold tracking-wide text-white
                hover:bg-[#22C55E]/90 disabled:opacity-60"
            >
              LOGIN
              <ArrowRight className="h-4 w-4" />
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}