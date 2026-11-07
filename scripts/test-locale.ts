// scripts/test-locale.ts checks the approved I18nProvider locale
// "fa-u-nu-latn": Jalali calendar, Latin digits.
// Run: npm run test:locale
import {
  CalendarDate,
  createCalendar,
  DateFormatter,
} from "@internationalized/date";

let failed = false;

function check(name: string, ok: boolean) {
  console.log((ok ? "PASS" : "FAIL") + " - " + name);
  if (!ok) {
    failed = true;
  }
}

const fmt = new DateFormatter("fa-u-nu-latn", {
  calendar: "persian",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});
const resolved = fmt.resolvedOptions();
check("locale resolves to fa-u-nu-latn", resolved.locale === "fa-u-nu-latn");
check("calendar resolves to persian", resolved.calendar === "persian");
check("numberingSystem resolves to latn", resolved.numberingSystem === "latn");
check(
  "2026-11-07 formats as 1405/08/16",
  fmt.format(new Date(2026, 10, 7)) === "1405/08/16"
);
const jalali = new CalendarDate(createCalendar("persian"), 1405, 8, 16);
check(
  "Jalali 1405/08/16 is a valid CalendarDate",
  jalali.year === 1405 && jalali.month === 8 && jalali.day === 16
);

if (failed) {
  console.log("LOCALE TEST FAILED");
  process.exit(1);
}
console.log("LOCALE TEST PASSED");
