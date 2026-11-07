// src/components/demo-form owns the demo form and table.
// It proves HeroUI v3 form controls, Persian inline validation, Jalali input
// conversion, and a searchable, sortable table. No data is saved to the server.

"use client";

import { useMemo, useState } from "react";
import {
  Button,
  Card,
  CardContent,
  FieldError,
  Input,
  Label,
  ListBox,
  ListBoxItem,
  Select,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableContent,
  TableHeader,
  TableRow,
  TextArea,
  TextField,
} from "@heroui/react";
import { parseJalaliInput, todayJalali } from "@/lib/jalali";
import { validateDemoForm, type DemoFormData } from "@/lib/validation";

const ROWS = [
  { id: 1, name: "علی رضایی", service: "معاینه", date: "۱۴۰۵/۰۸/۱۶", amount: 450000, status: "ثبت شده" },
  { id: 2, name: "سارا محمدی", service: "سفارش عینک", date: "۱۴۰۵/۰۸/۱۵", amount: 23800000, status: "در حال آماده سازی" },
  { id: 3, name: "مریم کریمی", service: "معاینه", date: "۱۴۰۵/۰۸/۱۴", amount: 450000, status: "انجام شده" },
  { id: 4, name: "حسین احمدی", service: "تعمیر", date: "۱۴۰۵/۰۸/۱۳", amount: 800000, status: "انجام شده" },
  { id: 5, name: "زهرا حسینی", service: "سفارش عینک", date: "۱۴۰۵/۰۸/۱۲", amount: 18500000, status: "آماده تحویل" },
  { id: 6, name: "رضا موسوی", service: "معاینه", date: "۱۴۰۵/۰۸/۱۱", amount: 450000, status: "عدم مراجعه" },
];

export function DemoForm() {
  const [form, setForm] = useState<DemoFormData>({
    fullName: "",
    mobile: "",
    nationalId: "",
    jalaliDate: "",
    service: "",
    note: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [result, setResult] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [sortAsc, setSortAsc] = useState(true);

  const filtered = useMemo(() => {
    const list = ROWS.filter(
      (r) => r.name.includes(query) || r.service.includes(query) || r.status.includes(query),
    );
    return [...list].sort((a, b) => (sortAsc ? a.amount - b.amount : b.amount - a.amount));
  }, [query, sortAsc]);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const errs = validateDemoForm(form);
    const greg = parseJalaliInput(form.jalaliDate);
    if (form.jalaliDate.trim() !== "" && !greg) {
      errs.jalaliDate = "تاریخ جلالی معتبر نیست. نمونه: 1405/08/16";
    }
    setErrors(errs);
    if (Object.keys(errs).length > 0) {
      setResult(null);
      return;
    }
    setResult(
      `فرم معتبر است. تاریخ جلالی ${form.jalaliDate} برابر ${greg?.toISOString().slice(0, 10)} میلادی است و فقط برای نمایش تبدیل شد. داده ای ذخیره نشد.`,
    );
  }

  const set = (key: keyof DemoFormData, value: string) =>
    setForm((f) => ({ ...f, [key]: value }));

  return (
    <div className="grid gap-6">
      <Card>
        <CardContent>
          <h2 className="mb-1 text-lg font-bold">فرم نمایشی</h2>
          <p className="mb-4 text-sm text-default-500">
            امروز به جلالی: {todayJalali()} - تاریخ را به شکل 1405/08/16 وارد کنید.
          </p>
          <form onSubmit={submit} className="grid gap-4" noValidate>
            <TextField value={form.fullName} onChange={(v) => set("fullName", v)} isInvalid={!!errors.fullName}>
              <Label>نام کامل</Label>
              <Input />
              <FieldError>{errors.fullName}</FieldError>
            </TextField>
            <TextField value={form.mobile} onChange={(v) => set("mobile", v)} isInvalid={!!errors.mobile}>
              <Label>موبایل</Label>
              <Input dir="ltr" placeholder="09120000000" />
              <FieldError>{errors.mobile}</FieldError>
            </TextField>
            <TextField value={form.nationalId} onChange={(v) => set("nationalId", v)} isInvalid={!!errors.nationalId}>
              <Label>کد ملی (اختیاری)</Label>
              <Input dir="ltr" />
              <FieldError>{errors.nationalId}</FieldError>
            </TextField>
            <TextField value={form.jalaliDate} onChange={(v) => set("jalaliDate", v)} isInvalid={!!errors.jalaliDate}>
              <Label>تاریخ جلالی</Label>
              <Input dir="ltr" placeholder="1405/08/16" />
              <FieldError>{errors.jalaliDate}</FieldError>
            </TextField>
            <Select
              aria-label="خدمت"
              selectedKey={form.service || null}
              onSelectionChange={(k) => set("service", String(k))}
              isInvalid={!!errors.service}
            >
              <Label>خدمت</Label>
              <Select.Trigger>
                <Select.Value>یک مورد انتخاب کنید</Select.Value>
              </Select.Trigger>
              <Select.Popover>
                <ListBox>
                  <ListBoxItem id="معاینه">معاینه</ListBoxItem>
                  <ListBoxItem id="سفارش عینک">سفارش عینک</ListBoxItem>
                  <ListBoxItem id="تعمیر">تعمیر</ListBoxItem>
                </ListBox>
              </Select.Popover>
              <FieldError>{errors.service}</FieldError>
            </Select>
            <TextField value={form.note} onChange={(v) => set("note", v)} isInvalid={!!errors.note}>
              <Label>توضیح (اختیاری)</Label>
              <TextArea />
              <FieldError>{errors.note}</FieldError>
            </TextField>
            <Button type="submit" variant="primary">
              بررسی فرم
            </Button>
            {result && <p className="text-sm text-success">{result}</p>}
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <h2 className="mb-4 text-lg font-bold">جدول نمایشی</h2>
          <div className="mb-4 flex gap-2">
            <TextField value={query} onChange={setQuery} className="grow">
              <Label>جستجو در جدول</Label>
              <Input placeholder="نام، خدمت یا وضعیت" />
            </TextField>
            <Button variant="secondary" onPress={() => setSortAsc(!sortAsc)}>
              مرتب سازی مبلغ: {sortAsc ? "صعودی" : "نزولی"}
            </Button>
          </div>
          <Table aria-label="جدول نمایشی">
            <TableContent>
              <TableHeader>
                <TableColumn isRowHeader>نام</TableColumn>
                <TableColumn>خدمت</TableColumn>
                <TableColumn>تاریخ جلالی</TableColumn>
                <TableColumn>مبلغ (تومان)</TableColumn>
                <TableColumn>وضعیت</TableColumn>
              </TableHeader>
              <TableBody>
                {filtered.map((r) => (
                  <TableRow key={r.id}>
                    <TableCell>{r.name}</TableCell>
                    <TableCell>{r.service}</TableCell>
                    <TableCell>{r.date}</TableCell>
                    <TableCell>{r.amount.toLocaleString("fa-IR")}</TableCell>
                    <TableCell>{r.status}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </TableContent>
          </Table>
          {filtered.length === 0 && <p className="mt-2 text-sm">ردیفی پیدا نشد.</p>}
        </CardContent>
      </Card>
    </div>
  );
}
