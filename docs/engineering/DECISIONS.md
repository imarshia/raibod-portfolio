# Architecture Decisions

## What an ADR is

An architecture decision record (ADR) records one engineering decision: the context, the decision, the consequences, the status, and the source. An ADR is engineering only. It never records a product decision. Product decisions (scope, pricing, booking rules, shop rules, SMS texts, insurance, and similar) live in `raibod-decisions.md` and are cited here by section when an engineering decision depends on them, without being copied.

## Status values

- **Accepted:** the decision is locked and in force.
- **Provisional:** the decision is in force but marked as not final, and the condition that makes it final is named.
- **Superseded:** replaced by a newer ADR. The old text stays, with the reason.
- **Retired:** no longer applies. The record stays, with the reason.

## How to add an ADR

A new ADR needs: context (what problem it solves), the decision, the consequences (what it enables and what it costs), the status, and the source. The owner approves it. A product decision is never recorded as an ADR.

---

## ADR-001: Stack (pinned versions)

- **Context:** The project needs a stack that the team can run, test, and deploy, with a version that does not drift.
- **Decision:** TypeScript 5.9.3, React 19.3.1, Next.js 15.5.29 (App Router), Tailwind 4.3.5, HeroUI 3.2.7, Prisma 6.19.3, PostgreSQL 16.15, Argon2id, Playwright 1.55.0. Versions are pinned in `package.json`. The font is Vazirmatn (`@fontsource/vazirmatn` 5.3.0). Jalali conversion uses `jalaali-js` 2.0.1.
- **Consequences:** The stack is fixed; an upgrade is a decision, not a silent change. The PoC stack was approved (GO) on 2026-11-07 with these versions.
- **Status:** Accepted.
- **Source:** `raibod-decisions.md` section 12 (PoC stack GO, locked); `package.json` (pinned versions, verified).

## ADR-002: Modular monolith. One unified system, one CRM, one customer profile.

- **Context:** The shop needs one system, not several separate panels, with one customer record shared across all parts.
- **Decision:** The system is a modular monolith. It is one unified system, not several separate panels. One CRM and one customer profile are shared across all panels. Data is entered once and the same data is seen in all parts.
- **Consequences:** Modules are separated by contract (see ADR-011), but they run in one application. There is no separate service per module.
- **Status:** Accepted.
- **Source:** `raibod-decisions.md` section 1 (locked).

## ADR-003: Platform is web on a server.

- **Context:** The shop needs access from any place. An offline desktop version was considered.
- **Decision:** The system is web on a server. The offline desktop version was discarded.
- **Consequences:** Deployment is a server deployment. There is no offline desktop build.
- **Status:** Accepted.
- **Source:** `raibod-decisions.md` section 1 (locked).

## ADR-004: Money is stored as integer Toman.

- **Context:** Money must be stored without rounding errors from fractions.
- **Decision:** The unit of stored money is Toman. All amounts are stored in Toman as an integer. Discount and insurance are computed on the Toman amount, and the computed amount is rounded to the nearest Toman.
- **Consequences:** No decimal money values. The column width (BIGINT versus INT) is an open ERD v4 item and is not decided here.
- **Status:** Accepted.
- **Source:** `raibod-decisions.md` section 1 (locked).

## ADR-005: Dates stored as Gregorian UTC. Jalali is display only.

- **Context:** The shop works in Jalali, but the database and the booking logic need one standard time.
- **Decision:** Dates are stored in the database as Gregorian UTC. Jalali is display only, and conversion always uses the Asia/Tehran timezone. In the UI, dates are Jalali with Latin digits, in the format YYYY/MM/DD. Booking and conflict logic run on standard time with a single timezone.
- **Consequences:** No Jalali values in the database. All display conversion goes through one path. See also STD-008.
- **Status:** Accepted.
- **Source:** `ARCHITECTURE.md` (architecture decisions); `raibod-decisions.md` section 12 (time and money, locked).

## ADR-006: Panel on a subdomain. Login by username or mobile plus password. Users are deactivated, never deleted.

- **Context:** The panel and the public site must be separated, and access must be role-based.
- **Decision:** The panel is on the subdomain `panel.raibod.com`, and the public site stays on `raibod.com` (landing and online booking). The domain is assumed. Login is by username or mobile plus password. After login, each user goes to their own page (manager to dashboard, doctor to today's calendar, seller to orders, reception to calendar). Password recovery is by the manager only. A user's password is changed only by the manager. A user is never deleted: a user is deactivated and can no longer log in, but their work history stays in the log.
- **Consequences:** The middleware routes by host (panel subdomain root to `/dashboard`). `/dashboard` is the panel entry point: it shows the login form inline when there is no session and the panel when there is one. The panel is not indexed by Google.
- **Status:** Accepted.
- **Source:** `raibod-decisions.md` section 11 (locked). Limitation: the middleware is only tested locally, with no real DNS (`ARCHITECTURE.md`).

## ADR-007: Customer identity. One internal ID is the primary key.

- **Context:** A customer is identified by mobile or national ID in daily use, but those values change, and one mobile can be shared in a family.
- **Decision:** Each customer has one independent internal ID, and it is the primary key of the profile. Mobile and national ID are changeable, verifiable identifiers, not the primary key. One mobile can be shared between members of a family, so mobile alone does not make a profile unique. When a customer's mobile changes, the profile does not change; the new mobile replaces the old one, and the old mobile stays in the history. If two profiles are made by mistake, one is connected to the other, and the sessions and orders of both are gathered in the correct profile; the wrong profile is not deleted.
- **Consequences:** No profile is keyed by mobile or national ID. Merging is a defined operation, not a delete.
- **Status:** Accepted.
- **Source:** `raibod-decisions.md` section 12 (locked).

## ADR-008: Prescription versioning is immutable.

- **Context:** A prescription is edited by the doctor, but the old values must stay recoverable.
- **Decision:** Each prescription has a version number, a time, a recorder, and a status, and it is connected to the previous version. When the doctor corrects a prescription, a new version is made and the previous version is kept; the previous version is fully reconstructible, and the old value does not live only in the general log. One session can have several prescriptions, but only one active final prescription.
- **Consequences:** Editing a prescription never overwrites history. An order keeps a copy of the prescription it was built from, so a later prescription change does not change the order.
- **Status:** Accepted.
- **Source:** `raibod-decisions.md` section 12 (locked).

## ADR-009: Financial entities are separated.

- **Context:** One "transaction" table cannot be the accounting system.
- **Decision:** The financial entities are separate, each with its own responsibility and relations: invoice (the record of a sale and the invoice amount), payment (the record of a real receipt or payment), financial transaction (the record of the financial effect of an event), refund (the record of a return of money to a customer), receivable (claims from a customer or an insurer), payable (debt to a supplier or a lens cutter).
- **Consequences:** The invoice is the source of truth: invoice lines exist, the invoice amount is locked after issuance, and the balance is computed from payments and refunds. A recorded financial transaction is never deleted or rewritten without a trace; a correction is made with a reverse or correction transaction.
- **Status:** Accepted.
- **Source:** `raibod-decisions.md` section 12 (locked).

## ADR-010: Inventory reservation is atomic.

- **Context:** Two orders at the same time must not consume the same single unit.
- **Decision:** Reserving an item is done with an atomic database operation. If two users select the same frame at the same time, only one reserves it, and the other sees an out-of-stock error.
- **Consequences:** Inventory cannot be oversold by a race. The inventory ledger (`stock_moves`) records the moves, and the physical balance is updated in the same transaction.
- **Status:** Accepted.
- **Source:** `raibod-decisions.md` section 12 (locked).

## ADR-011: Module contracts. Each module owns its own data.

- **Context:** The system is one monolith, but modules must not change each other's data directly.
- **Decision:** Each module owns its own data. Modules talk to each other only through a defined contract, and they do not directly change another module's data. A multi-part operation (for example, registering an order, which touches customer, prescription, frame, lens, inventory, invoice, and payment) runs atomically: if one part fails, all of it rolls back, and no half effect stays.
- **Consequences:** No direct cross-module writes. Multi-module work is transactional.
- **Status:** Accepted.
- **Source:** `raibod-decisions.md` section 12 (locked). The module boundaries are in `ARCHITECTURE.md`.

## ADR-012: Security baseline.

- **Context:** The system holds customer data, money, and prescriptions. Security is not only a password and a role check.
- **Decision:** The baseline is: HTTPS is mandatory; passwords are hashed with Argon2id; session and cookie are managed securely; login and OTP attempts are limited; SMS sending is limited; the private booking-link token is random, unguessable, and revocable; access control is at the API level and at the record level; customer information is not exposed in a URL, a log, or an error message; the backup is encrypted and its restore is tested; the policy for keeping, deleting, or anonymizing information is defined.
- **Consequences:** The skeleton acceptance criteria (in `raibod-decisions.md` section 12) define how this is verified: an API access test per role, a test that unauthorized access to customer information is blocked, a session and cookie security review, and a check that no password, OTP, or sensitive information appears in error output.
- **Status:** Accepted (as a decision). Implementation is verified per item by the skeleton acceptance criteria.
- **Source:** `raibod-decisions.md` section 12 (locked).

## ADR-013: Theme is managed only by next-themes.

- **Context:** The theme must work in light and dark, and it must not fight the component library.
- **Decision:** The theme is managed only with next-themes (`attribute="class"`, `defaultTheme="system"`). There is no HeroUIProvider.
- **Consequences:** The theme key in local storage is `raibod-theme` (set in `src/app/providers.tsx`, verified in the code).
- **Status:** Accepted.
- **Source:** `ARCHITECTURE.md` (architecture decisions).

## ADR-014: HeroUI v3 compound API. Flat pieces imported directly.

- **Context:** HeroUI v3 changed its API. The dot notation (`Card.Header`) does not work from a server component, because a client component on the server is only a reference and its property becomes `undefined`.
- **Decision:** Use the flat pieces and import them directly (`CardHeader`, `CardTitle`, `CardContent`, `CardFooter`). Do not use the dot notation from a server component.
- **Consequences:** Component imports are explicit. The exact APIs are in `DESIGN_SYSTEM.md`, from heroui.com for the pinned version.
- **Status:** Accepted.
- **Source:** `ARCHITECTURE.md` (architecture decisions); `DESIGN_SYSTEM.md` (line 271).

## ADR-015: Server pages render dates on the server. Client components only for interaction.

- **Context:** Dates must render consistently, and the client bundle must stay small.
- **Decision:** Server pages render dates on the server. Client components are only for interaction.
- **Consequences:** Public pages read no data from the database, except the panel and the login API.
- **Status:** Accepted.
- **Source:** `ARCHITECTURE.md` (architecture decisions).

## ADR-016: Enums in the database are English codes. Persian labels only in the display layer.

- **Context:** The database must stay stable when a label changes.
- **Decision:** Enums in the database are English codes. The Persian label lives only in the display layer.
- **Consequences:** A label change does not touch the database.
- **Status:** Accepted.
- **Source:** `ARCHITECTURE.md` (architecture decisions).

## ADR-017: Constraints Prisma cannot build are raw SQL in migrations.

- **Context:** Prisma cannot build some constraints (Exclusion, Partial Unique).
- **Decision:** Constraints that Prisma cannot build, such as Exclusion and Partial Unique, are written as raw SQL in the migration.
- **Consequences:** The migration, not the Prisma schema alone, is the source of truth for those constraints.
- **Status:** Accepted.
- **Source:** `ARCHITECTURE.md` (architecture decisions).

## ADR-018: Dark accent is #13847F (same as light).

- **Context:** The Design System had two different accents for light and dark, and the dark accent (#5AA9A5) had a weak contrast with white text (2.74:1).
- **Decision:** The dark accent is #13847F, the same as the light accent. Dark accent foreground is #FFFFFF, and dark accent hover is #10706C.
- **Consequences:** White on #13847F is 4.53:1 (AA). Accent text on the dark surface (#1E1E1C) is 3.69:1, which is AA for large text and UI, and below AA for small text. The old #5AA9A5 (6.09:1 on the dark surface) is gone as the dark accent, and it stays only in the accent scale ramp in the Design System.
- **Status:** Accepted.
- **Source:** Owner decision, 2026-11-09; `DESIGN_SYSTEM.md` section 1 and the tokens (updated in the code and the document).

## ADR-019: Icons only from Lucide.

- **Context:** The project needs one icon source, with one grid and one stroke, so icons look consistent.
- **Decision:** The icon library is only Lucide (`lucide-react`). No emoji as an icon, and no custom SVG is built. The rule for using icons is STD-003.
- **Consequences:** The choice is recorded here (the ADR). The enforceable rule is STD-003.
- **Status:** Accepted.
- **Source:** `raibod-decisions.md` section 14 (locked, 2026-11-07); `DESIGN_SYSTEM.md` section 4.

## ADR-020: Session is 30 days, with no refresh token.

- **Context:** The Phase 1 skeleton needs a session, and the simplest session is a fixed lifetime.
- **Decision:** The session is 30 days, with no refresh token. The session token is random, its hash is stored in the `sessions` table, and the token itself is in an httpOnly cookie. After 5 failed login attempts, the account is locked for 15 minutes (error 429).
- **Consequences:** A user is logged out after 30 days and must log in again. There is no silent refresh.
- **Status:** Accepted. The owner locked the session lifetime at 30 days on 2026-11-12 (was 8 hours, PoC behavior, provisional).
- **Source:** `ARCHITECTURE.md` (request flow and limitations).

---

## Not in this file

The following are product decisions, and they are not recorded here as architecture decisions. They live in `raibod-decisions.md`.

- Scope of version 1 (which sections are in, which are out), price and installments, timeline.
- Booking rules (exam length, SMS code, slot hold, resend cooldown, private manage link, reminder by phone call, attendance authority).
- Exam fields, doctor weekly hours, and the "did they come?" logic.
- Sales rules (deposit, discount, payment methods, insurance formula and settlement scenario, cancellation and refund rules).
- Inventory rules (frame unit model, ready-lens stock specs, lens purchase for a specific order versus general stock, cost calculation).
- Accounting scope ("complete accounting" definition, monthly Excel statement, ledger).
- Panel dashboard content, user roles and their access ticks, SMS texts.
- The 11 open items that need the shop's answers (voice-call OTP fallback, insurance settlement scenario, deposit refund rule on cancel, returns after delivery, frame unit model, ready-lens stock specs, lens purchase mode, the real Excel monthly-statement file, the definition of "complete accounting", the cutting fee as an invoice line or internal, and whether the 5-day review is inside or outside the 45 days).

Where an ADR above depends on a product decision, the ADR cites the product decision by its section in `raibod-decisions.md`, without copying it.
