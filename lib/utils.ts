import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function splitLines(value: string) {
  return value
    .split("\n")
    .map((item) => item.trim())
    .filter(Boolean);
}

export function splitCommaList(value: string) {
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

export function formatDateRange(
  startDate: string | Date,
  endDate?: string | Date | null,
  current?: boolean,
) {
  const formatter = new Intl.DateTimeFormat("en", {
    month: "short",
    year: "numeric",
  });
  const start = formatter.format(new Date(startDate));
  const end = current ? "Present" : endDate ? formatter.format(new Date(endDate)) : "Present";

  return `${start} - ${end}`;
}
