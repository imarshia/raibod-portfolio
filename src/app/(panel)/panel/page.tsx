import { redirect } from "next/navigation";
import Link from "next/link";
import { getSessionUser, ROLE_LABELS } from "@/lib/auth";
import { todayJalali } from "@/lib/jalali";

export default async function PanelPage() {
  const user = await getSessionUser();
  if (!user) {
    redirect("/login");
  }
  const isAdmin = user.role === "ADMIN";
  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <div className="rounded-xl border border-default-200 bg-content1 p-6 shadow-sm">
        <h1 className="text-2xl font-bold">پنل رایبد</h1>
        <p>
          خوش آمدید {user.fullName} - نقش: {ROLE_LABELS[user.role]}
        </p>
        <p className="text-sm text-default-500">امروز به جلالی: {todayJalali()}</p>
        <div className="mt-4 flex gap-2">
          <Link href="/demo" className="rounded-lg border px-4 py-2">
            فرم نمایشی
          </Link>
          <Link href="/print" className="rounded-lg border px-4 py-2">
            چاپ A5
          </Link>
          <form action="/api/auth/logout" method="POST">
            <button type="submit" className="rounded-lg border border-danger px-4 py-2 text-danger">
              خروج
            </button>
          </form>
        </div>
      </div>

      {isAdmin ? (
        <div
          className="mt-4 rounded-xl border border-default-200 bg-content1 p-6 shadow-sm"
          data-testid="admin-section"
        >
          <h2 className="font-bold">بخش مدیر</h2>
          <p className="text-sm">این بخش فقط برای نقش ADMIN دیده می شود.</p>
        </div>
      ) : (
        <div
          className="mt-4 rounded-xl border border-default-200 bg-content1 p-6 shadow-sm"
          data-testid="non-admin-note"
        >
          <h2 className="font-bold">دسترسی محدود</h2>
          <p className="text-sm">شما مدیر نیستید، پس بخش مدیر برای شما نشان داده نمی شود.</p>
        </div>
      )}
    </main>
  );
}
