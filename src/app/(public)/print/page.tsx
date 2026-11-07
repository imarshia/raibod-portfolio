import { todayJalali } from "@/lib/jalali";
import { PrintButton } from "@/components/print-button";

export default function PrintPage() {
  return (
    <main className="mx-auto max-w-2xl px-4 py-10">
      <div className="no-print mb-4 flex gap-2">
        <PrintButton />
        <p className="text-sm text-default-500">
          اندازه صفحه در چاپ A5 است. در پنجره چاپ، اندازه کاغذ را A5 انتخاب کنید.
        </p>
      </div>
      <div className="rounded-xl border border-default-200 bg-content1 p-6 shadow-sm">
        <h1 className="text-xl font-bold">نسخه نمونه: عینک رایبد</h1>
        <p>تاریخ جلالی: {todayJalali()}</p>
        <p>بیمار نمونه: علی رضایی</p>
        <table className="mt-4 w-full border text-sm">
          <thead>
            <tr>
              <th className="border p-2">چشم</th>
              <th className="border p-2">SPH</th>
              <th className="border p-2">CYL</th>
              <th className="border p-2">AXE</th>
              <th className="border p-2">ADD</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border p-2">راست (OD)</td>
              <td className="border p-2">-1.50</td>
              <td className="border p-2">-0.50</td>
              <td className="border p-2">90</td>
              <td className="border p-2">-</td>
            </tr>
            <tr>
              <td className="border p-2">چپ (OS)</td>
              <td className="border p-2">-1.25</td>
              <td className="border p-2">-0.25</td>
              <td className="border p-2">85</td>
              <td className="border p-2">-</td>
            </tr>
          </tbody>
        </table>
        <p className="mt-4 text-sm">این فقط یک نمونه نمایشی برای تست چاپ A5 است و نسخه واقعی نیست.</p>
      </div>
    </main>
  );
}
