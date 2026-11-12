// src/lib/audit owns the activity log (AuditLog).
// One row per user action the manager may need to review: login,
// logout, and later business operations (create/update/delete of
// customers, prescriptions, sales, and so on), added as those
// features are built. The action is an English code; the Persian
// label lives here (ACTION_LABELS) and the log page uses it.
// The log is append-only: no update or delete path exists.
// logActivity never throws: a logging failure must never break the
// user action it records. It never logs secrets or passwords.

import { prisma } from "./db";

export const ACTION_LABELS: Record<string, string> = {
  login: "ورود",
  logout: "خروج",
  // User management actions (owner decision 2026-11-12). No user
  // management page exists yet; these labels are ready so the
  // page can log its actions when it is built.
  "user.create": "افزودن کاربر",
  "user.delete": "حذف کاربر",
  "user.update": "ویرایش کاربر",
  "user.deactivate": "غیرفعال کردن کاربر",
};

export function actionLabel(action: string): string {
  return ACTION_LABELS[action] ?? action;
}

export async function logActivity(input: {
  userId: string;
  action: string;
  entityType?: string;
  entityId?: string;
  details?: string;
  ip?: string;
}): Promise<void> {
  try {
    await prisma.auditLog.create({
      data: {
        userId: input.userId,
        action: input.action,
        entityType: input.entityType,
        entityId: input.entityId,
        details: input.details,
        ip: input.ip,
      },
    });
  } catch {
    // A logging failure must never break the user action it records.
    // Swallowed silently: there is no reporting channel here that
    // could not risk secrets in a log (STD-016).
  }
}
