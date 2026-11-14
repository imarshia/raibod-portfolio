// src/components/panel/ActivityLogClient.tsx: the activity log page
// (client). Rows, the user filter, the date filter modal, the active
// filter chips, and the page-size footer. The data comes from the
// server (page.tsx); this component only owns the interactive state
// and writes the state back into the URL (size, user, from, to), so
// a filtered view is shareable and survives a refresh.
// Page size is the count per page (10, 20, 30, 40, 50, 100, all),
// not page navigation: the page always shows the newest N entries
// (owner confirmation 2026-11-14; the approved preview has no page
// number). The footer box shows the current range ("1-10", "1-20",
// "همه") and opens the size menu upward.

"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Calendar, ChevronDown, X } from "lucide-react";
import { DateFilterModal, type JalaliDate } from "./DateFilterModal";
import { formatJalaliLong } from "@/lib/jalali";
import "./activity-log.css";

export type LogEntry = {
  id: string;
  title: string;
  details: string | null;
  dateTime: string;
};

const PAGE_SIZES = ["10", "20", "30", "40", "50", "100", "all"] as const;

function jalaliParam(d: JalaliDate): string {
  return `${d.jy}-${String(d.jm).padStart(2, "0")}-${String(d.jd).padStart(2, "0")}`;
}

export function ActivityLogClient({
  entries,
  total,
  pageSize,
  users,
  selectedUserId,
  selectedUserName,
  dateFrom,
  dateTo,
}: {
  entries: LogEntry[];
  total: number;
  pageSize: string;
  users: Array<{ id: string; fullName: string }>;
  selectedUserId: string | null;
  selectedUserName: string | null;
  dateFrom: JalaliDate | null;
  dateTo: JalaliDate | null;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [sizeMenuOpen, setSizeMenuOpen] = useState(false);
  const [dateModalOpen, setDateModalOpen] = useState(false);
  const userWrapRef = useRef<HTMLDivElement | null>(null);
  const sizeWrapRef = useRef<HTMLDivElement | null>(null);

  // Clicking outside a popover, or pressing Escape, closes it.
  useEffect(() => {
    const onPointerDown = (event: MouseEvent) => {
      const target = event.target as Node;
      if (userWrapRef.current && !userWrapRef.current.contains(target)) {
        setUserMenuOpen(false);
      }
      if (sizeWrapRef.current && !sizeWrapRef.current.contains(target)) {
        setSizeMenuOpen(false);
      }
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setUserMenuOpen(false);
        setSizeMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, []);

  function updateParams(patch: {
    size?: string;
    user?: string | null;
    from?: string | null;
    to?: string | null;
  }) {
    const params = new URLSearchParams();
    const nextSize = patch.size !== undefined ? patch.size : pageSize;
    const nextUser = patch.user !== undefined ? patch.user : selectedUserId;
    const nextFrom =
      patch.from !== undefined
        ? patch.from
        : dateFrom
          ? jalaliParam(dateFrom)
          : null;
    const nextTo =
      patch.to !== undefined ? patch.to : dateTo ? jalaliParam(dateTo) : null;
    if (nextSize !== "10") params.set("size", nextSize);
    if (nextUser) params.set("user", nextUser);
    if (nextFrom) params.set("from", nextFrom);
    if (nextTo) params.set("to", nextTo);
    const query = params.toString();
    router.replace(query ? `${pathname}?${query}` : pathname);
  }

  const hasFilters = selectedUserId !== null || dateFrom !== null;
  const shownCount = pageSize === "all" ? total : Math.min(total, Number(pageSize));
  const rangeLabel =
    pageSize === "all" ? "همه" : total === 0 ? "0-0" : `1-${shownCount}`;
  const dateChipLabel =
    dateFrom && dateTo
      ? keyOf(dateFrom) === keyOf(dateTo)
        ? formatJalaliLong(dateFrom.jy, dateFrom.jm, dateFrom.jd)
        : `از ${formatJalaliLong(dateFrom.jy, dateFrom.jm, dateFrom.jd)} تا ${formatJalaliLong(dateTo.jy, dateTo.jm, dateTo.jd)}`
      : null;

  function keyOf(d: JalaliDate): string {
    return `${d.jy}-${d.jm}-${d.jd}`;
  }

  return (
    <>
      <div className="logs-head">
        <h1 className="logs-title">لاگ فعالیت‌ها</h1>
        <div className="logs-controls">
          <div className="filter-wrap" ref={userWrapRef}>
            <button
              type="button"
              className="user-filter"
              aria-haspopup="true"
              aria-expanded={userMenuOpen}
              onClick={() => {
                setUserMenuOpen((v) => !v);
                setSizeMenuOpen(false);
              }}
            >
              <span>{selectedUserName ?? "فیلتر براساس کاربر"}</span>
              <ChevronDown />
            </button>
            {userMenuOpen && (
              <div className="popover popover-below" role="menu">
                {users.map((u) => (
                  <button
                    key={u.id}
                    type="button"
                    className={`pop-item${u.id === selectedUserId ? " active" : ""}`}
                    role="menuitem"
                    onClick={() => {
                      updateParams({ user: u.id });
                      setUserMenuOpen(false);
                    }}
                  >
                    {u.fullName}
                  </button>
                ))}
                <button
                  type="button"
                  className={`pop-item${selectedUserId === null ? " active" : ""}`}
                  role="menuitem"
                  onClick={() => {
                    updateParams({ user: null });
                    setUserMenuOpen(false);
                  }}
                >
                  همه کاربران
                </button>
              </div>
            )}
          </div>
          <button
            type="button"
            className="cal-btn"
            aria-label="فیلتر زمانی"
            aria-haspopup="dialog"
            onClick={() => setDateModalOpen(true)}
          >
            <Calendar />
            {dateFrom !== null && <span className="cal-dot" />}
          </button>
        </div>
      </div>

      {hasFilters && (
        <div className="chips">
          {selectedUserName && (
            <button
              type="button"
              className="chip"
              aria-label={`حذف فیلتر کاربر: ${selectedUserName}`}
              onClick={() => updateParams({ user: null })}
            >
              <X />
              <span>کاربر: {selectedUserName}</span>
            </button>
          )}
          {dateChipLabel && (
            <button
              type="button"
              className="chip"
              aria-label={`حذف فیلتر زمانی: ${dateChipLabel}`}
              onClick={() => updateParams({ from: null, to: null })}
            >
              <X />
              <span>{dateChipLabel}</span>
            </button>
          )}
        </div>
      )}

      {entries.length === 0 ? (
        <p className="logs-empty">
          {hasFilters ? "با این فیلترها فعالیتی ثبت نشده است." : "هنوز فعالیتی ثبت نشده است."}
        </p>
      ) : (
        <ul className={`rows${hasFilters ? "" : " no-filters"}`}>
          {entries.map((entry) => (
            <li key={entry.id} className="row">
              <div className="row-text">
                <p className="row-title">{entry.title}</p>
                {entry.details && <p className="row-details">{entry.details}</p>}
              </div>
              <span dir="ltr" className="row-date tnum">
                {entry.dateTime}
              </span>
            </li>
          ))}
        </ul>
      )}

      <footer className="logs-foot">
        <span>نمایش</span>
        <div className="size-wrap" ref={sizeWrapRef}>
          <button
            type="button"
            className="pagesize"
            aria-haspopup="true"
            aria-expanded={sizeMenuOpen}
            onClick={() => {
              setSizeMenuOpen((v) => !v);
              setUserMenuOpen(false);
            }}
          >
            <span>{rangeLabel}</span>
            <ChevronDown />
          </button>
          {sizeMenuOpen && (
            <div className="popover popover-above" role="menu">
              {PAGE_SIZES.map((size) => (
                <button
                  key={size}
                  type="button"
                  className={`pop-item${size === pageSize ? " active" : ""}`}
                  role="menuitem"
                  onClick={() => {
                    updateParams({ size });
                    setSizeMenuOpen(false);
                  }}
                >
                  {size === "all" ? "همه" : `${size} در صفحه`}
                </button>
              ))}
            </div>
          )}
        </div>
        <span>از {total} نتیجه</span>
      </footer>

      <DateFilterModal
        open={dateModalOpen}
        appliedFrom={dateFrom}
        appliedTo={dateTo}
        onApply={(from, to) => {
          updateParams({ from: jalaliParam(from), to: jalaliParam(to) });
          setDateModalOpen(false);
        }}
        onClear={() => {
          updateParams({ from: null, to: null });
          setDateModalOpen(false);
        }}
        onClose={() => setDateModalOpen(false)}
      />
    </>
  );
}
