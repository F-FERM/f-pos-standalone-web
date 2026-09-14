// src/components/settings/restaurant/TableHelpers.tsx
"use client";

import { Tooltip, TooltipContent, TooltipTrigger } from "@/src/components/ui/tooltip";

export function ColGroup({ widths }: { widths: string[] }) {
  return (
    <colgroup>
      {widths.map((width, i) => (
        <col key={i} style={{ width }} />
      ))}
    </colgroup>
  );
}

export function TruncatedCell({ value }: { value: string }) {
  if (!value) return <div className="truncate">{value}</div>;

  return (
    <Tooltip>
      <TooltipTrigger render={<div className="truncate" title={value} />}>
        {value}
      </TooltipTrigger>
      <TooltipContent>
        <p className="max-w-[260px] break-words">{value}</p>
      </TooltipContent>
    </Tooltip>
  );
}

export function formatDisplayDate(value: string) {
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? "-"
    : date.toLocaleString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      });
}