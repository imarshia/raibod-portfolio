// src/lib/jalali owns Gregorian to Jalali conversion and back.
// Dates are stored in the database as Gregorian UTC. Jalali is display only.
// A Jalali date input on the demo form is converted here to a Gregorian Date.

import { toJalaali, toGregorian } from "jalaali-js";

const FA_DIGITS = "۰۱۲۳۴۵۶۷۸۹";

export function toFaDigits(value: string | number): string {
  return String(value).replace(/[0-9]/g, (d) => FA_DIGITS[Number(d)]);
}

export function formatJalali(date: Date): string {
  // The server may run in UTC. Always read the date in Asia/Tehran,
  // otherwise the Jalali day is wrong by one around midnight.
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Tehran",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(date);
  const get = (type: string) => Number(parts.find((p) => p.type === type)?.value);
  const j = toJalaali(get("year"), get("month"), get("day"));
  return `${toFaDigits(j.jy)}/${toFaDigits(String(j.jm).padStart(2, "0"))}/${toFaDigits(
    String(j.jd).padStart(2, "0"),
  )}`;
}

export function todayJalali(): string {
  return formatJalali(new Date());
}

// Design System v3.2 section 2: dates in the UI are Jalali, format
// YYYY/MM/DD, Latin digits, dir="ltr". formatJalali above predates the
// Design System and returns Persian digits; it is kept for reference only.
// UI display uses this Latin-digit formatter.
export function formatJalaliLatin(date: Date): string {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Tehran",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(date);
  const get = (type: string) => Number(parts.find((p) => p.type === type)?.value);
  const j = toJalaali(get("year"), get("month"), get("day"));
  return `${j.jy}/${String(j.jm).padStart(2, "0")}/${String(j.jd).padStart(2, "0")}`;
}

export function todayJalaliLatin(): string {
  return formatJalaliLatin(new Date());
}

// Date and time for the activity log: Jalali YYYY/MM/DD plus the
// Asia/Tehran time HH:MM, Latin digits, dir="ltr" in the UI.
export function formatJalaliDateTimeLatin(date: Date): string {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Tehran",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).formatToParts(date);
  const get = (type: string) => Number(parts.find((p) => p.type === type)?.value);
  const j = toJalaali(get("year"), get("month"), get("day"));
  const hh = String(get("hour")).padStart(2, "0");
  const mm = String(get("minute")).padStart(2, "0");
  return `${j.jy}/${String(j.jm).padStart(2, "0")}/${String(j.jd).padStart(2, "0")} ${hh}:${mm}`;
}

export function jalaliToGregorian(jy: number, jm: number, jd: number): Date {
  const g = toGregorian(jy, jm, jd);
  return new Date(Date.UTC(g.gy, g.gm - 1, g.gd));
}

export function parseJalaliInput(value: string): Date | null {
  const parts = value.trim().split(/[/\-]/).map(Number);
  if (parts.length !== 3 || parts.some((n) => !Number.isFinite(n))) return null;
  const [jy, jm, jd] = parts;
  if (jy < 1300 || jy > 1500 || jm < 1 || jm > 12 || jd < 1 || jd > 31) return null;
  return jalaliToGregorian(jy, jm, jd);
}
