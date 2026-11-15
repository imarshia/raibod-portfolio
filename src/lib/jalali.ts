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

// Design System v3.3 section 2: dates in the UI are Jalali, format
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

// Today's Jalali date parts in Asia/Tehran (for the date-filter
// calendar). Uses the Tehran timezone, not the client clock.
export function todayJalaliParts(): { jy: number; jm: number; jd: number } {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Tehran",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date());
  const get = (type: string) => Number(parts.find((p) => p.type === type)?.value);
  return toJalaali(get("year"), get("month"), get("day"));
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

// Header date for the panel shell: Persian weekday and long Jalali
// date with Latin digits, e.g. weekday "پنجشنبه", date "21 آبان 1405"
// (Figma panel header). fa-IR uses the Jalali calendar; nu-latn
// forces Latin digits. Verified against the Figma values with node.
export function todayJalaliHeaderLatin(): { weekday: string; date: string } {
  const parts = new Intl.DateTimeFormat("fa-IR-u-nu-latn", {
    timeZone: "Asia/Tehran",
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).formatToParts(new Date());
  const get = (type: string) => parts.find((p) => p.type === type)?.value ?? "";
  return { weekday: get("weekday"), date: `${get("day")} ${get("month")} ${get("year")}` };
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

// Jalali month names, for the date-filter modal and the active
// filter chips ("20 آبان 1405", "از 20 آبان 1405 تا 22 آبان 1405").
export const JALALI_MONTH_NAMES = [
  "فروردین",
  "اردیبهشت",
  "خرداد",
  "تیر",
  "مرداد",
  "شهریور",
  "مهر",
  "آبان",
  "آذر",
  "دی",
  "بهمن",
  "اسفند",
];

// A Jalali date in words, day first ("20 آبان 1405"). Day first is
// the Persian reading order; year first ("1405 آبان 20") renders the
// wrong way round in the chip (owner correction 2026-11-14, with a
// screenshot). Applies to the range chip, the single-day chip and
// the modal selection line alike.
export function formatJalaliLong(jy: number, jm: number, jd: number): string {
  return `${jd} ${JALALI_MONTH_NAMES[jm - 1]} ${jy}`;
}

// The UTC range of one Jalali day in Asia/Tehran, [start, end).
// Used to filter audit rows by a Jalali date. Iran has no DST since
// 2022, so the offset is a fixed +3:30: 00:00 Tehran is 20:30 UTC
// the previous day. The range is [start, start + 24h).
export function jalaliDayRangeUTC(
  jy: number,
  jm: number,
  jd: number,
): { start: Date; end: Date } {
  const g = toGregorian(jy, jm, jd);
  const start = new Date(Date.UTC(g.gy, g.gm - 1, g.gd) - 3.5 * 60 * 60 * 1000);
  const end = new Date(start.getTime() + 24 * 60 * 60 * 1000);
  return { start, end };
}
