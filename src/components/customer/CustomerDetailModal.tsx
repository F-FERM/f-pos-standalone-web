// src/components/customer/CustomerDetailModal.tsx
"use client";

import { useQuery } from "@tanstack/react-query";
import {
  AlertCircle,
  Calendar,
  Clock,
  CreditCard,
  MapPin,
  Phone,
  User,
  X,
  type LucideIcon,
} from "lucide-react";
import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "../ui/dialog";
import { ListCustomerByIdApi } from "@/src/api/customer/api/GetById";

type Props = {
  customerId: string | null;
  onClose: () => void;
};

/* ---------- Helpers ---------- */

function formatDateTime(date?: string) {
  if (!date) return "—";
  const d = new Date(date);
  return Number.isNaN(d.getTime()) ? date : d.toLocaleString("en-GB");
}

function formatCredit(credit?: number | string | null) {
  if (credit === null || credit === undefined || credit === "") return "—";
  const n = Number(credit);
  return Number.isNaN(n)
    ? String(credit)
    : n.toLocaleString("en-GB", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function getInitials(name?: string) {
  if (!name) return "?";
  const parts = name.trim().split(/\s+/);
  return ((parts[0]?.[0] ?? "") + (parts.length > 1 ? parts[parts.length - 1][0] : "")).toUpperCase();
}

/* ---------- Small building blocks ---------- */

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="mb-3 text-base font-medium text-foreground sm:mb-4 sm:text-lg">{children}</h3>
  );
}

function InfoItem({
  icon: Icon,
  label,
  value,
}: {
  icon: LucideIcon;
  label: string;
  value?: React.ReactNode;
}) {
  return (
    <div className="flex min-w-0 items-start gap-3">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-black/5 text-[#5D5D5D] sm:h-9 sm:w-9">
        <Icon className="h-4 w-4" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-xs text-[#5D5D5D]">{label}</p>
        <div className="mt-0.5 break-words text-sm font-medium text-black">
          {value ?? "—"}
        </div>
      </div>
    </div>
  );
}

function StatusBadge({ active }: { active?: boolean }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ${
        active ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
      }`}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${active ? "bg-green-600" : "bg-red-600"}`}
      />
      {active ? "Active" : "Inactive"}
    </span>
  );
}

function LoadingSkeleton() {
  return (
    <>
      <div className="flex items-center gap-3 border-b border-black/10 px-4 py-4 pr-14 sm:gap-4 sm:px-6 sm:py-5 sm:pr-6">
        <div className="h-12 w-12 shrink-0 animate-pulse rounded-full bg-black/10 sm:h-14 sm:w-14" />
        <div className="space-y-2">
          <div className="h-5 w-32 animate-pulse rounded bg-black/10 sm:w-40" />
          <div className="h-4 w-20 animate-pulse rounded bg-black/10" />
        </div>
      </div>
      <div className="space-y-6 px-4 py-5 sm:px-6 sm:py-6">
        {Array.from({ length: 2 }).map((_, s) => (
          <div key={s} className="space-y-4">
            <div className="h-5 w-32 animate-pulse rounded bg-black/10" />
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5">
              {Array.from({ length: 2 }).map((_, i) => (
                <div key={i} className="flex gap-3">
                  <div className="h-8 w-8 shrink-0 animate-pulse rounded-lg bg-black/10 sm:h-9 sm:w-9" />
                  <div className="flex-1 space-y-2">
                    <div className="h-3 w-16 animate-pulse rounded bg-black/10" />
                    <div className="h-4 w-28 animate-pulse rounded bg-black/10" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

/* ---------- Modal ---------- */

export function CustomerDetailModal({ customerId, onClose }: Props) {
  // Keep the last opened id so the content doesn't flip to the error state
  // while the dialog is playing its close animation.
  const [activeId, setActiveId] = useState<string | null>(customerId);
  if (customerId && customerId !== activeId) setActiveId(customerId);

  const { data: customer, isLoading, isError } = useQuery({
    queryKey: ["getCustomerById", activeId],
    queryFn: () => ListCustomerByIdApi(String(activeId)),
    enabled: !!activeId,
  });

  const c = customer?.data;

  return (
    <Dialog open={!!customerId} onOpenChange={(open) => !open && onClose()}>
      {/* DialogContent is only a transparent shell so the close button can sit
          outside the card. [&>button]:hidden hides the built-in Dialog close button. */}
      <DialogContent
        className="w-[calc(100%-2.5rem)] max-w-2xl gap-0 overflow-visible border-0 bg-transparent p-0 shadow-none sm:rounded-none [&>button]:hidden"
      >
        <DialogTitle className="sr-only">Customer Details</DialogTitle>
        <DialogDescription className="sr-only">
          Information about the selected customer.
        </DialogDescription>

        <div className="relative w-full">
          {/* Close button: inside the card on mobile, floating at the corner on sm+ */}
          <button
            type="button"
            onClick={onClose}
            className="absolute right-2 top-2 z-10 flex h-9 w-9 items-center justify-center rounded-full border border-[#E0E0E0] bg-[#EFEFEF] text-[#FF3B3B] shadow-lg transition-colors hover:bg-white sm:right-[-18px] sm:top-[-18px] sm:h-[42px] sm:w-[42px]"
            aria-label="Close customer details"
          >
            <X className="h-[18px] w-[18px] sm:h-5 sm:w-5" strokeWidth={2.5} />
          </button>

          {/* Card: capped to the viewport height so it never overflows on short screens */}
          <div className="flex max-h-[calc(100dvh-2.5rem)] w-full flex-col overflow-hidden rounded-lg bg-white shadow-[0_0_30px_rgba(0,0,0,0.35)] sm:rounded-xl">
            {isLoading ? (
              <LoadingSkeleton />
            ) : isError || !c ? (
              <div className="flex flex-col items-center gap-3 px-6 py-12 text-center sm:py-14">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-red-600">
                  <AlertCircle className="h-6 w-6" />
                </div>
                <p className="text-sm font-medium text-black">Failed to load customer details</p>
                <p className="text-xs text-[#5D5D5D]">Please close this window and try again.</p>
              </div>
            ) : (
              <>
                {/* Header (fixed) */}
                <div className="flex shrink-0 items-center gap-3 border-b border-black/10 px-4 py-4 pr-14 sm:gap-4 sm:px-6 sm:py-5 sm:pr-6">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#450042] text-base font-semibold text-white sm:h-14 sm:w-14 sm:text-lg">
                    {getInitials(c.name)}
                  </div>
                  <div className="min-w-0">
                    <h2 className="truncate text-base font-semibold text-black sm:text-xl">
                      {c.name || "—"}
                    </h2>
                    <div className="mt-1">
                      <StatusBadge active={c.isActive} />
                    </div>
                  </div>
                </div>

                {/* Body (scrolls) */}
                <div className="min-h-0 flex-1 space-y-6 overflow-y-auto px-4 py-4 sm:space-y-8 sm:px-6 sm:py-6">
                  <section>
                    <SectionTitle>Contact Information</SectionTitle>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5">
                      <InfoItem icon={User} label="Name" value={c.name} />
                      <InfoItem icon={Phone} label="Phone" value={c.phone} />
                      <div className="sm:col-span-2">
                        <InfoItem icon={MapPin} label="Address" value={c.address} />
                      </div>
                    </div>
                  </section>

                  <section>
                    <SectionTitle>Account Information</SectionTitle>

                    {/* Highlighted credit card */}
                    <div className="mb-4 flex items-center justify-between gap-3 rounded-xl border border-black/10 bg-gradient-to-br from-black/[0.03] to-transparent p-3 sm:mb-5 sm:p-4">
                      <div className="flex min-w-0 items-center gap-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#450042] text-white sm:h-10 sm:w-10">
                          <CreditCard className="h-4 w-4 sm:h-5 sm:w-5" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs text-[#5D5D5D]">Available Credit</p>
                          <p className="break-all text-lg font-semibold text-black sm:text-xl">
                            {formatCredit(c.credit)}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5">
                      <InfoItem icon={Calendar} label="Created" value={formatDateTime(c.createdAt)} />
                      <InfoItem icon={Clock} label="Last Updated" value={formatDateTime(c.updatedAt)} />
                    </div>
                  </section>
                </div>
              </>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}