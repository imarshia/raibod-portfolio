// src/lib/validation owns the shared validation rules for the demo form.
// Rules are pure functions so the same rules can be reused by server actions later.

export interface DemoFormData {
  fullName: string;
  mobile: string;
  nationalId: string;
  jalaliDate: string;
  service: string;
  note: string;
}

export type DemoFormErrors = Partial<Record<keyof DemoFormData, string>>;

const MOBILE_RE = /^09\d{9}$/;
const NATIONAL_ID_RE = /^\d{10}$/;

export function validateDemoForm(data: DemoFormData): DemoFormErrors {
  const errors: DemoFormErrors = {};
  if (data.fullName.trim().length < 3) {
    errors.fullName = "نام کامل باید حداقل ۳ حرف باشد.";
  }
  if (!MOBILE_RE.test(data.mobile.trim())) {
    errors.mobile = "شماره موبایل باید ۱۱ رقم و با 09 شروع شود.";
  }
  if (data.nationalId.trim() !== "" && !NATIONAL_ID_RE.test(data.nationalId.trim())) {
    errors.nationalId = "کد ملی باید ۱۰ رقم باشد.";
  }
  if (data.jalaliDate.trim() === "") {
    errors.jalaliDate = "تاریخ جلالی را وارد کنید.";
  }
  if (!data.service) {
    errors.service = "خدمت را انتخاب کنید.";
  }
  if (data.note.trim().length > 200) {
    errors.note = "توضیح حداکثر ۲۰۰ حرف است.";
  }
  return errors;
}

export function isValidIranianMobile(mobile: string): boolean {
  return MOBILE_RE.test(mobile.trim());
}
