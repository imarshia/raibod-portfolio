// src/app/(public)/booking/page.tsx: Booking shell page (Phase 1).
// Online booking opens in the next phase. This page only states that and
// shows the shop phone number. No booking flow, no form, no SMS.

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

export default function BookingShellPage() {
  return (
    <main className="mx-auto max-w-2xl px-4 py-16">
      <Card variant="default">
        <CardHeader>
          <CardTitle>رزرو نوبت معاینه</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-body text-muted">
            رزرو آنلاین نوبت در مرحله بعد فعال می شود. برای رزرو نوبت، با فروشگاه
            تماس بگیرید.
          </p>
          <p className="mt-4 text-body">
            تلفن فروشگاه: <span dir="ltr">09120987790</span>
          </p>
        </CardContent>
        <CardFooter>
          <Link href="/">
            <Button variant="secondary">بازگشت به صفحه اصلی</Button>
          </Link>
        </CardFooter>
      </Card>
    </main>
  );
}
