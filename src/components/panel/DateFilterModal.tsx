// src/components/panel/DateFilterModal.tsx: the Jalali date-filter
// modal for the activity log. Single day ("تک روز") or a date range
// ("بازه زمانی"), Jalali calendar, first day of week Saturday.
// Exact behavior from the approved logs preview (Alex, 2026-11-14):
// - The mode defaults to range. Switching to single keeps the start
//   day; switching to range keeps the start and sets the end to it.
// - Clicking a day in range mode starts a new range if a range is
//   already complete, or swaps the start when the day is before it.
// - Apply is disabled until a day (single) or both ends (range) are
//   picked. The remove-filter button shows only while a filter is
//   applied. Opening with an applied filter restores it (single mode
//   when start == end); opening with no filter starts empty.
// - Days from the adjacent months are shown but disabled. Today is
//   outlined in the accent color.

"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { jalaaliMonthLength, toGregorian } from "jalaali-js";
import {
  JALALI_MONTH_NAMES,
  formatJalaliLong,
  todayJalaliParts,
} from "@/lib/jalali";
import { X, ChevronRight, ChevronLeft } from "lucide-react";

export type JalaliDate = { jy: number; jm: number; jd: number };

const WEEKDAYS = ["ش", "ی", "د", "س", "چ", "پ", "ج"];

function keyOf(d: JalaliDate): string {
  return `${d.jy}-${d.jm}-${d.jd}`;
}

function cmp(a: JalaliDate, b: JalaliDate): number {
  if (a.jy !== b.jy) return a.jy - b.jy;
  if (a.jm !== b.jm) return a.jm - b.jm;
  return a.jd - b.jd;
}

function toJalaliDate(p: { jy: number; jm: number; jd: number }): JalaliDate {
  return { jy: p.jy, jm: p.jm, jd: p.jd };
}

export function DateFilterModal({
  open,
  appliedFrom,
  appliedTo,
  onApply,
  onClear,
  onClose,
}: {
  open: boolean;
  appliedFrom: JalaliDate | null;
  appliedTo: JalaliDate | null;
  onApply: (from: JalaliDate, to: JalaliDate) => void;
  onClear: () => void;
  onClose: () => void;
}) {
  const today = useMemo(() => toJalaliDate(todayJalaliParts()), []);
  const [mode, setMode] = useState<"single" | "range">("range");
  const [viewY, setViewY] = useState(today.jy);
  const [viewM, setViewM] = useState(today.jm);
  const [selStart, setSelStart] = useState<JalaliDate | null>(null);
  const [selEnd, setSelEnd] = useState<JalaliDate | null>(null);
  const closeBtnRef = useRef<HTMLButtonElement | null>(null);
  const previousFocusRef = useRef<Element | null>(null);

  // Reset the modal state every time it opens: restore the applied
  // filter, or start empty (no pre-selected range).
  useEffect(() => {
    if (!open) return;
    previousFocusRef.current = document.activeElement;
    if (appliedFrom) {
      const from = appliedFrom;
      const to = appliedTo ?? appliedFrom;
      setSelStart(from);
      setSelEnd(to);
      if (keyOf(from) === keyOf(to)) {
        setMode("single");
        setSelEnd(null);
      } else {
        setMode("range");
      }
      setViewY(from.jy);
      setViewM(from.jm);
    } else {
      setMode("range");
      setSelStart(null);
      setSelEnd(null);
      setViewY(today.jy);
      setViewM(today.jm);
    }
    closeBtnRef.current?.focus();
  }, [open, appliedFrom, appliedTo, today]);

  // Escape closes the modal; focus returns to the trigger.
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      const prev = previousFocusRef.current;
      if (prev instanceof HTMLElement) prev.focus();
    };
  }, [open, onClose]);

  const applied = appliedFrom !== null;

  const cells = useMemo(() => {
    // The weekday (UTC) of the 1st of the viewed month. getUTCDay is
    // 0 Sunday .. 6 Saturday; the calendar starts on Saturday, so
    // lead = (day + 1) % 7 (Saturday -> 0, Sunday -> 1).
    const g = toGregorian(viewY, viewM, 1);
    const first = new Date(Date.UTC(g.gy, g.gm - 1, g.gd));
    const lead = (first.getUTCDay() + 1) % 7;
    const dim = jalaaliMonthLength(viewY, viewM);
    const prevM = viewM === 1 ? 12 : viewM - 1;
    const prevY = viewM === 1 ? viewY - 1 : viewY;
    const prevDim = jalaaliMonthLength(prevY, prevM);
    const nextM = viewM === 12 ? 1 : viewM + 1;
    const nextY = viewM === 12 ? viewY + 1 : viewY;
    const list: Array<{ d: JalaliDate; other: boolean }> = [];
    for (let i = 0; i < lead; i++) {
      list.push({ d: { jy: prevY, jm: prevM, jd: prevDim - lead + 1 + i }, other: true });
    }
    for (let d = 1; d <= dim; d++) {
      list.push({ d: { jy: viewY, jm: viewM, jd: d }, other: false });
    }
    const total = Math.ceil(list.length / 7) * 7;
    const startLen = list.length;
    for (let d = startLen; d < total; d++) {
      list.push({ d: { jy: nextY, jm: nextM, jd: d - startLen + 1 }, other: true });
    }
    return list;
  }, [viewY, viewM]);

  function onDay(c: JalaliDate) {
    if (mode === "single") {
      setSelStart(c);
      setSelEnd(null);
    } else if (!selStart || (selStart && selEnd)) {
      setSelStart(c);
      setSelEnd(null);
    } else if (cmp(c, selStart) < 0) {
      setSelEnd(selStart);
      setSelStart(c);
    } else {
      setSelEnd(c);
    }
  }

  function setModeAndDefault(next: "single" | "range") {
    setMode(next);
    if (next === "single") {
      setSelStart(selStart ?? today);
      setSelEnd(null);
    } else {
      const start = selStart ?? today;
      setSelStart(start);
      setSelEnd(selEnd ?? start);
    }
  }

  function prevMonth() {
    if (viewM === 1) {
      setViewM(12);
      setViewY(viewY - 1);
    } else {
      setViewM(viewM - 1);
    }
  }

  function nextMonth() {
    if (viewM === 12) {
      setViewM(1);
      setViewY(viewY + 1);
    } else {
      setViewM(viewM + 1);
    }
  }

  const applyDisabled = mode === "single" ? !selStart : !(selStart && selEnd);

  let line: React.ReactNode = null;
  if (mode === "single") {
    line = selStart ? (
      <>
        روز انتخاب‌شده: <strong>{formatJalaliLong(selStart.jy, selStart.jm, selStart.jd)}</strong>
      </>
    ) : null;
  } else if (selStart && selEnd) {
    line =
      keyOf(selStart) === keyOf(selEnd) ? (
        <>
          روز انتخاب‌شده: <strong>{formatJalaliLong(selStart.jy, selStart.jm, selStart.jd)}</strong>
        </>
      ) : (
        <>
          از <strong>{formatJalaliLong(selStart.jy, selStart.jm, selStart.jd)}</strong> تا{" "}
          <strong>{formatJalaliLong(selEnd.jy, selEnd.jm, selEnd.jd)}</strong>
        </>
      );
  } else if (selStart) {
    line = (
      <>
        شروع: <strong>{formatJalaliLong(selStart.jy, selStart.jm, selStart.jd)}</strong>، روز
        پایان را انتخاب کنید
      </>
    );
  }

  if (!open) return null;

  function dayClass(c: JalaliDate, other: boolean): string {
    if (other) return "cal-day";
    const classes = ["cal-day"];
    if (c.jy === today.jy && c.jm === today.jm && c.jd === today.jd) classes.push("today");
    if (mode === "single") {
      if (selStart && keyOf(c) === keyOf(selStart)) classes.push("selected");
    } else if (selStart && selEnd) {
      if (keyOf(c) === keyOf(selStart)) classes.push("range-start");
      if (keyOf(c) === keyOf(selEnd)) classes.push("range-end");
      if (cmp(c, selStart) > 0 && cmp(c, selEnd) < 0) classes.push("in-range");
      if (keyOf(c) === keyOf(selStart) && keyOf(c) === keyOf(selEnd)) {
        classes.push("range-start", "range-end");
      }
    } else if (selStart && keyOf(c) === keyOf(selStart)) {
      classes.push("range-start");
    }
    return classes.join(" ");
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="date-filter-title"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="modal-head">
          <h2 className="modal-title" id="date-filter-title">
            فیلتر زمانی
          </h2>
          <button
            type="button"
            className="modal-close"
            aria-label="بستن"
            ref={closeBtnRef}
            onClick={onClose}
          >
            <X />
          </button>
        </div>
        <div className="mode-toggle" role="tablist" aria-label="نوع انتخاب">
          <button
            type="button"
            className={`mode-btn${mode === "single" ? " active" : ""}`}
            role="tab"
            aria-selected={mode === "single"}
            onClick={() => setModeAndDefault("single")}
          >
            تک روز
          </button>
          <button
            type="button"
            className={`mode-btn${mode === "range" ? " active" : ""}`}
            role="tab"
            aria-selected={mode === "range"}
            onClick={() => setModeAndDefault("range")}
          >
            بازه زمانی
          </button>
        </div>
        <div className="cal-nav">
          <p className="cal-month">
            {JALALI_MONTH_NAMES[viewM - 1]} {viewY}
          </p>
          <div className="cal-nav-btns">
            <button type="button" className="cal-nav-btn" aria-label="ماه قبل" onClick={prevMonth}>
              <ChevronRight />
            </button>
            <button type="button" className="cal-nav-btn" aria-label="ماه بعد" onClick={nextMonth}>
              <ChevronLeft />
            </button>
          </div>
        </div>
        <div className="cal-weekdays" aria-hidden="true">
          {WEEKDAYS.map((w) => (
            <span key={w}>{w}</span>
          ))}
        </div>
        <div className="cal-grid">
          {cells.map((c) => (
            <button
              key={keyOf(c.d) + (c.other ? "-o" : "")}
              type="button"
              className={dayClass(c.d, c.other)}
              disabled={c.other}
              onClick={() => onDay(c.d)}
            >
              {c.d.jd}
            </button>
          ))}
        </div>
        <div className="cal-today-row">
          <button
            type="button"
            className="cal-today-btn"
            onClick={() => {
              setViewY(today.jy);
              setViewM(today.jm);
            }}
          >
            امروز
          </button>
        </div>
        <p className="selection-line">{line}</p>
        <div className="modal-foot">
          {applied ? (
            <button type="button" className="act-btn btn-danger-ghost" onClick={onClear}>
              حذف فیلتر
            </button>
          ) : (
            <span />
          )}
          <div className="foot-actions">
            <button type="button" className="act-btn btn-ghost" onClick={onClose}>
              انصراف
            </button>
            <button
              type="button"
              className="act-btn btn-primary"
              disabled={applyDisabled}
              onClick={() => {
                if (mode === "single" && selStart) onApply(selStart, selStart);
                else if (selStart && selEnd) onApply(selStart, selEnd);
              }}
            >
              اعمال
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
