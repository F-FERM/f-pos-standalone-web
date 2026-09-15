"use client";
import { useEffect, useState } from "react";

export function useLiveClock(intervalMs = 30_000) {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    setNow(new Date());
    const timer = setInterval(() => setNow(new Date()), intervalMs);
    return () => clearInterval(timer);
  }, [intervalMs]);

  const timeLabel = now
    ? now.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })
    : "--:--";
  const [timeValue, meridiem = ""] = timeLabel.split(" ");

  return {
    timeValue,
    meridiem,
    dayLabel: now ? now.toLocaleDateString("en-US", { weekday: "long" }) : "",
    dateLabel: now
      ? now.toLocaleDateString("en-US", {
          month: "long",
          day: "numeric",
          year: "numeric",
        })
      : "",
  };
}
