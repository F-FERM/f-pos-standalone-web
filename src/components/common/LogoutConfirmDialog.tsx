"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/base-alert-dialog";
import { Button } from "@/components/ui/button";
import { closeApp } from "@/src/lib/electron";
import { LocalStorage } from "@/src/utility/localStorage";
import { LogOutIcon, X, AlertCircle } from "lucide-react";
import { ReactElement, useState } from "react";

interface LogoutConfirmDialogProps {
  trigger?: ReactElement;
  redirectTo?: string;
}

export function LogoutConfirmDialog({
  trigger,
  redirectTo,
}: LogoutConfirmDialogProps) {
  const [open, setOpen] = useState(false);

  const handleConfirm = () => {
    try {
      LocalStorage.removeItem("access_token");
      LocalStorage.removeItem("refreshToken");
      LocalStorage.clear();
      sessionStorage.clear();
    } catch (err) {
      console.error("Failed to clear auth storage:", err);
    }

    setOpen(false);

    if (redirectTo) {
      window.location.href = redirectTo;
    } else {
      closeApp();
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      {/* Trigger */}
      {trigger ? (
        <AlertDialogTrigger render={trigger} />
      ) : (
        <AlertDialogTrigger
          render={
            <Button variant="destructive" className="flex items-center gap-2">
              <LogOutIcon className="h-4 w-4" />
              Logout
            </Button>
          }
        />
      )}

      {/* Modal */}
      <AlertDialogContent
        className="
          fixed
          left-1/2
          top-1/2
          z-50
          w-[calc(100%-32px)]
          max-w-[390px]
          -translate-x-1/2
          -translate-y-1/2
          overflow-visible
          rounded-[22px]
          border
          border-white/20
          bg-red-950/65
          p-0
          text-white
          shadow-[0_25px_80px_rgba(0,0,0,0.45)]
          backdrop-blur-xl
          duration-200
        "
      >
        <div
          className="
            pointer-events-none
            absolute
            right-12
            top-8
            h-5
            w-5
            rounded-full
            bg-red-400/60
          "
        />

        <div
          className="
            pointer-events-none
            absolute
            right-5
            top-12
            h-3
            w-3
            rounded-full
            bg-red-300/50
          "
        />

        {/* Close button */}
        <button
          type="button"
          onClick={() => setOpen(false)}
          aria-label="Close"
          className="
            absolute
            right-4
            top-4
            z-20
            flex
            h-8
            w-8
            items-center
            justify-center
            rounded-full
            text-white/80
            transition-all
            duration-200
            hover:bg-white/10
            hover:text-white
          "
        >
          <X className="h-5 w-5" />
        </button>

        {/* Floating warning icon */}
        <div
          className="
            absolute
            left-1/2
            top-0
            z-20
            flex
            h-[58px]
            w-[58px]
            -translate-x-1/2
            -translate-y-1/2
            items-center
            justify-center
            rounded-full
            border
            border-red-300/30
            bg-red-700
            shadow-[0_10px_30px_rgba(0,0,0,0.35)]
          "
        >
          <AlertCircle className="h-8 w-8 text-white" strokeWidth={2.5} />
        </div>

        {/* Content */}
        <div className="relative z-10 px-8 pb-7 pt-12">
          <AlertDialogHeader className="items-center text-center">
            {/* Hidden media for accessibility/component compatibility */}
            <AlertDialogMedia className="sr-only">
              <AlertCircle />
            </AlertDialogMedia>

            <AlertDialogTitle
              className="
                max-w-[270px]
                text-[20px]
                font-semibold
                leading-7
                tracking-tight
                text-white
              "
            >
              Are you sure you want to logout?
            </AlertDialogTitle>

            <AlertDialogDescription
              className="
                mt-2
                max-w-[280px]
                text-[13px]
                leading-5
                text-white/65
              "
            >
              You will be signed out of this POS session.
            </AlertDialogDescription>
          </AlertDialogHeader>

          {/* Buttons */}
          <AlertDialogFooter
            className="
              mt-7
              flex
              flex-row
              justify-center
              gap-3
              sm:justify-center
            "
          >
            <AlertDialogAction
              onClick={handleConfirm}
              closeOnClick
              variant="destructive"
              className="
                order-1
                h-[42px]
                min-w-[105px]
                rounded-[9px]
                border
                border-white/30
                bg-white
                px-6
                text-[14px]
                font-semibold
                text-red-800
                shadow-none
                transition-all
                duration-200
                hover:bg-white/90
                hover:text-red-900
                sm:order-1
              "
            >
              Yes
            </AlertDialogAction>

            <AlertDialogCancel
              className="
                order-2
                m-0
                h-[42px]
                min-w-[105px]
                rounded-[9px]
                border
                border-white/40
                bg-transparent
                px-6
                text-[14px]
                font-semibold
                text-white
                shadow-none
                transition-all
                duration-200
                hover:bg-white/10
                hover:text-white
                sm:order-2
              "
            >
              No
            </AlertDialogCancel>
          </AlertDialogFooter>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
}
