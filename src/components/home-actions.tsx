// src/components/home-actions owns the navigation buttons on the home page.
// It is a client boundary so the home page itself can stay a server component
// and render the Jalali date on the server.

"use client";

import Link from "next/link";
import { Button } from "@heroui/react";

export function HomeActions() {
  return (
    <div className="flex flex-wrap gap-2">
      <Link href="/login">
        <Button variant="primary">ورود</Button>
      </Link>
      <Link href="/demo">
        <Button variant="secondary">فرم و جدول نمایشی</Button>
      </Link>
      <Link href="/print">
        <Button variant="secondary">نمونه چاپ A5</Button>
      </Link>
      <Link href="/panel">
        <Button variant="secondary">پنل</Button>
      </Link>
    </div>
  );
}
