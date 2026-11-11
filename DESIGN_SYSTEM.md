# Raibod - Design System

**Version:** 3.2 - 5 November 2026
**Status:** Final for UI implementation. Supersedes v3.1. Approved for use by Claude Code, Daniel, and Alex.
**Scope:** Design system only. Color, typography, spacing, icons, components, tokens, light and dark, print, accessibility, responsive, setup.
**Not in scope:** Product flows, roles, data model, API contract. Those are in v2.1 product specification. Send both files together. This file alone is not the whole project spec.
**Stack:** TypeScript, React 19+, Next.js App Router, HeroUI v3.2 (pinned, see section 0), Tailwind CSS v4, PostgreSQL
**Font:** Vazirmatn (Google Fonts, variable 100-900, arabic + latin subsets)
**Icons:** Lucide only (lucide-react, 24x24 grid, stroke 2, sizes 16 / 20 / 24)
**Modes:** Light + Dark (both required)
**Site language:** Persian (fa)
**Direction:** RTL (lang="fa" dir="rtl")
**Dates in UI:** Jalali only, format YYYY/MM/DD, Latin digits, dir="ltr" on the date element

## 0. How to use this file

Place this file as `DESIGN_SYSTEM.md` in the repo root. Use only the tokens in section 9. Do not invent a color, font, size, field, or module outside this file.

For Claude Code: read this file first, then build. Use only semantic tokens. Do not add a raw hex in JSX. Do not add an off-scale font size. If something is not in this file, record it as an open item and ask Arshia. Do not invent it. Before building, install the HeroUI MCP server and agent skill (section 0.3) and use heroui.com as the API reference, not model memory.

For Daniel: build landing and online booking with this system. Use sections 1, 2, 3, 6, 7, 9.

For Alex: use sections 0, 9, and 10 for setup, tokens, and file structure. Review UI against section 11 before merge.

Any change to this file needs a new version number. No silent edits.

### 0.1 Setup, install, provider

HeroUI v3 is stable since March 2026. Pin the exact installed version in `package.json`. Do not use a floating range. Before install, confirm the latest patch from npm or the releases page, because the exact latest patch was not confirmed in the docs review. The version line in this file is v3.2. The pinned version must be recorded in the repo, and the Switch, Checkbox, RadioGroup, and calendar week/day composition must be checked against that pinned version, because v3.2 changed them.

Install commands, from the official HeroUI skill file:

```bash
npm i @heroui/styles @heroui/react tailwind-variants
```

For Next.js App Router:

```bash
npm i @heroui/styles @heroui/react tailwind-variants tailwindcss @tailwindcss/postcss postcss
```

In v3.2.6, `@internationalized/date` moved to peerDependencies and must be installed explicitly. Confirm the exact install line from the release notes for the pinned version before running it.

`postcss.config.mjs`:

```js
export default { plugins: { "@tailwindcss/postcss": {} } };
```

Prerequisites, explicit: React 19 or higher, Tailwind CSS v4. Tailwind CSS v4 is mandatory. HeroUI v3 does not work with Tailwind CSS v3. All components are imported from a single package, `@heroui/react`. Do not install single packages such as `@heroui/button`. Framer Motion is not required as a dependency. Animation in v3 is CSS.

Import order in `app/globals.css`, Tailwind first, then HeroUI:

```css
@import "tailwindcss";
@import "@heroui/styles";
```

### 0.2 No HeroUIProvider, I18nProvider instead

HeroUI v3 does not need a provider. Do not add `HeroUIProvider`. Components work directly after install and style import. The v2 pattern with `HeroUIProvider` is forbidden.

For Persian and RTL, create `app/provider.tsx` with `I18nProvider` from `@heroui/react` and a fixed locale `fa`. Do not copy the docs Accept-Language logic, because Raibod is single language Persian. In the root layout, set `lang="fa"` and `dir="rtl"` on the `html` tag, fixed, not from Accept-Language.

The Jalali calendar mechanism is in section 5, Calendar. The calendar system comes from locale only through `I18nProvider` with the Persian calendar locale extension. Values must also be built as Jalali `CalendarDate` values, otherwise `onChange` returns Gregorian.

### 0.3 Dark Mode with next-themes

Manage theme only with `next-themes`. Do not set the `.dark` class on `html` by hand.

Create a client `app/providers.tsx` with `ThemeProvider as NextThemesProvider` from `next-themes` and these props: `attribute="class"`, `defaultTheme="system"`, `enableSystem`, `disableTransitionOnChange`. In the root layout, put `suppressHydrationWarning` on the `html` tag and give `body` the classes `bg-background text-foreground`.

The theme switch uses `useTheme` from `next-themes` in a client component, and rendering is deferred until after mount, because the active theme is not known in SSR. `useTheme` in this setup comes from `next-themes`, not from HeroUI. For a plain React app, HeroUI docs use `useTheme` from `@heroui/react`. For Raibod Next.js, use `next-themes` only, one theme controller per app.

The next-themes install command was not seen in the HeroUI Dark Mode or Theming pages. Confirm it from the next-themes docs before adding it.

If class and `data-theme` are both set by hand, keep their values in sync. With `next-themes`, only `attribute="class"` is managed.

### 0.4 AI setup for Claude Code

Before building, install the official MCP server and agent skill, so Claude Code reads current HeroUI docs instead of model memory:

```bash
claude mcp add heroui-react -- npx -y @heroui/react-mcp@latest
```

Requires Node.js 22 or higher. Install the agent skill with:

```bash
npx skills add heroui-inc/heroui
```

LLM docs are at `https://heroui.com/llms.txt` and `https://heroui.com/react/llms.txt`. The migration MCP server is only for v2 to v3 migration. After migration, return to the React MCP server. Raibod is a new project with no v2 code, so the migration MCP server is not needed.

### 0.5 Forbidden in v3, for Claude Code

| Forbidden | Use instead |
|---|---|
| `HeroUIProvider` | No provider, see section 0.2 |
| `color` prop on Button | `variant` only, see section 5 |
| `isLoading` | `isPending` |
| `useDisclosure` | `useOverlayState` |
| `useToast` | `toast()` function, see Toast in section 5 |
| `useInput`, `useSwitch`, `useDraggable`, `useClipboard`, `usePagination` | Compound components |
| `@heroui/theme`, `@heroui/system` | `@heroui/react`, `@heroui/styles` |
| `heroui()` in tailwind config, `hero.ts` | Tailwind v4 CSS import, see section 0.1 |
| Framer Motion as a dependency | CSS animation |
| `classNames` (v2) | `className` |
| `startContent`, `endContent` on Button | Icons as children |
| Numeric accent classes such as `bg-accent-500` | `bg-accent`, `bg-accent-soft`, `bg-accent-hover`, `text-accent`, `text-accent-text` |
| `Autocomplete` as a v2 name without check | `ComboBox` is the v3 name in the migration list, verify `Autocomplete` still exists in the pinned version before use |
| `Input` as a v2 field name | `TextField` plus `Input`, see section 5 |
| `NumberInput` | `NumberField` |
| `DateInput` | `DateField` |
| `Progress` | `ProgressBar` |
| `Divider` | `Separator` |
| `Listbox` | `ListBox` |

Renames from the migration docs: `Autocomplete` to `ComboBox`, `Input` to `TextField` and `Input` and `InputGroup`, `NumberInput` to `NumberField`, `DateInput` to `DateField`, `Progress` to `ProgressBar`, `Divider` to `Separator`, `Listbox` to `ListBox`. Check whether `Autocomplete` still exists in the pinned version before use, because the release list mentions both names.

## 1. Color

### Primitives

| Token | Hex | Use |
|---|---|---|
| `ink` | `#1E1E1C` | Primary text |
| `bone` | `#F5F2EF` | Secondary surface |
| `mist` | `#E6E8E8` | Border, divider, neutral surface |
| `accent` | `#13847F` | The only accent, primary action, selection, focus |
| `white` | `#FFFFFF` | Main background, card, form field |

### Accent scale

The numeric accent scale 50 to 900 was removed in v3. Use semantic variants instead: `-soft` and `-hover`. The scale below is kept only as the Raibod source values for the accent color. Do not use classes such as `bg-accent-500` in v3. They do not exist.

| 50 | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900 | 950 |
|---|---|---|---|---|---|---|---|---|---|---|
| `#E7F3F2` | `#D0E6E5` | `#ACD4D2` | `#89C2BF` | `#5AA9A5` | `#369692` | `#13847F` | `#10706C` | `#0D5C59` | `#0A4946` | `#083533` |

### Semantic tokens, Light and Dark

Raibod token names are kept for design reference. In code, map them to the standard HeroUI names in section 9. HeroUI standard names are `--surface-secondary` for secondary surfaces, `--field-background`, `--field-hover`, `--field-focus` for fields. HeroUI controls rely on `--field-*` variables. Confirm in code that HeroUI internal components read the Raibod names, or use the standard names in the CSS mapping. Do not leave both sets unmapped.

| Token | Light | Dark | Note |
|---|---|---|---|
| `--background` | `#FFFFFF` | `#1E1E1C` | Background white was decided by Arshia |
| `--foreground` | `#1E1E1C` | `#F5F2EF` | 16.70:1 on white, AAA |
| `--surface` | `#FFFFFF` | `#262624` | Cards separated by a 1px border |
| `--surface-2` / `--surface-secondary` | `#F5F2EF` | `#2E2E2C` | Table header, sidebar, hover |
| `--muted` | `#787877` | `#A5A5A4` | `#787877` is forbidden in Dark (3.78:1) |
| `--border` | `#E6E8E8` | `#3A3A38` | |
| `--accent` | `#13847F` | `#13847F` | Same code in Light and Dark (Arshia, 2026-11-09). Accent text on dark surface is 3.69:1: AA for large text and UI, below AA for small text. |
| `--accent-foreground` | `#FFFFFF` | `#FFFFFF` | White on `#13847F` 4.53:1 (AA) |
| `--accent-hover` | `#10706C` | `#10706C` | In HeroUI, hover and soft are calculated with `color-mix()` from the base color. Keep the manual Raibod values in sync, or let the calculated values win and record the choice in code. |
| `--accent-soft` | `#E7F3F2` | `#0A4946` | Selected row, soft background |
| `--accent-text` | `#0D5C59` | `#89C2BF` | Small accent text |
| `--field` / `--field-background` | `#FFFFFF` | `#262624` | Input background |
| `--focus` | `#13847F` | `#89C2BF` | Focus ring |
| `--danger` | `#B91C1C` | `#F87171` | |
| `--success` | `#2E7D32` | `#4ADE80` | Final, status only |
| `--warning` | `#B45309` | `#FBBF24` | Final, status only |
| `--info` | `#155E75` | `#7DD3FC` | Final, status only |

### Status colors, final

Success `#2E7D32`, Warning `#B45309`, Danger `#B91C1C`, Info `#155E75`, status messages only.
Dark: Success `#4ADE80`, Warning `#FBBF24`, Danger `#F87171`, Info `#7DD3FC`.

Status colors are final. Use them only for status text and icons, always with a text label. Do not use status color alone to convey meaning. In HeroUI `Alert` and `Chip`, the status list is `default | accent | success | warning | danger`. There is no `info` variant in those components. For info, use `accent` in HeroUI components and the Raibod `--info` token only for plain text and icons outside HeroUI status components.

### Contrast, measured

Light: ink on white 16.70:1 (AAA), white on accent 4.53:1 (AA), accent on white 4.53:1 (AA), accent on bone 4.06:1. Small text on surface-2 must use `accent-800 #0D5C59`.
Dark: text on surface 13.59:1, muted `#A5A5A4` on `#1E1E1C` 6.77:1 (AA), accent `#13847F` on `#1E1E1C` 3.69:1, white on `#13847F` 4.53:1 (AA).

### Rules

- No color outside these tokens. No raw hex in JSX. Use semantic tokens only (`bg-accent`, `text-muted`).
- One accent, one primary action per view.
- Frame and product photo background is `#F5F2EF` in both modes, so the true frame color is visible.
- Do not use accent for large text blocks. Use it for actions, selection, and focus only.
- A color without a suffix is a background (for example `--accent`). A color with `-foreground` is text on that background (for example `--accent-foreground`). Follow this naming rule for any new token.
- Only base tokens are overridden by hand. Hover and soft are calculated values in HeroUI, built with `color-mix()` from the base color, unless the manual Raibod value in this file is confirmed in code to override the calculated value.
- Do not enable `data-vibrant-palette`. It makes soft colors more saturated and may fail WCAG contrast.
- Do not remove the `@heroui/styles` import to make the library headless. Headless mode is not needed for Raibod.

## 2. Typography

Scale: Major Third 1.25x, base 16px. All line-heights are multiples of 4. Off-scale sizes (15 / 17 / 18 / 22 / 26 / 30px) are forbidden.

| Style | Size | Weight | Line-height | Use |
|---|---|---|---|---|
| display-2xl | 60px | 800 | 64 | Landing hero only |
| display-xl | 48px | 800 | 56 | Landing hero only |
| display-lg | 40px | 800 | 48 | Landing hero only |
| H1 | 32px | 700 | 40 | Page title |
| H2 | 25px | 700 | 32 | Section title |
| H3 | 20px | 600 | 28 | Card / panel title |
| body-lg | 20px | 400 | 32 | Intro text |
| body | 16px | 400 | 28 | Default text |
| body-sm | 14px | 400 | 24 | Table, form field |
| caption / overline | 12px | 500-700 | 16 | Labels, metadata |
| button | 16px | 600 | 24 | Button label |
| price-lg | 32px | 700 | 40 | Invoice total |
| price | 20px | 700 | 28 | Prices |

Fluid type for display, H1, H2: `clamp()`.

### Rules

- All headings at the same level share the same size and weight.
- Max line length: 65ch.
- Numbers, prices, and model codes are Latin digits with `font-feature-settings: "tnum"`, `dir="ltr"`.
- No Persian italic. No fake bold.
- The product UI is Persian, RTL (`lang="fa" dir="rtl"`). This document is written in English for handoff only.
- Dates in UI are Jalali only. Format is YYYY/MM/DD with Latin digits, `dir="ltr"` on the date element, for example 1405/08/14. Gregorian dates are never shown in UI. Use the same date format everywhere in the system.
- Latin digits in DateField under the fa locale are unverified in the docs. Confirm in code that DateField under the fa locale shows Latin digits, or whether a numbering system setting is needed. Do not assume it.
- Font loading: Vazirmatn variable 100-900, arabic + latin subsets, `display: swap`.

## 3. Spacing, Radius, Shadow, Motion, Layout, Breakpoints

- Spacing: 4px base grid, 4 / 8 / 12 / 16 / 24 / 32 / 48 / 64.
- Layout: sidebar 264px (collapsible to 72px), topbar 64px, content max 1440px, page padding 24px (16px on mobile).
- Landing header: full-width bar, height 80px + 4px padding top and bottom (88px total), content width 1312px, theme toggle (moon/sun, circular reveal) left of the booking CTA. All landing content sits within the 1312px width. Layout: logo right, nav centered (14px, gap 40px), booking CTA left. Sticky; hides on scroll down and shows on scroll up (both desktop and mobile). When scrolled, a 1px bottom border (`--border`) plus a faint shadow (`0 1px 2px rgb(0 0 0 / 0.06)`); clean at the very top. Mobile (below 1024px): fixed bar 56px + 8px padding (72px total), hamburger menu opens a modal panel over a dark backdrop.
- Radius: `--radius: 12px`, small 8px, card 12px, field 12px, modal 16px, pill 24px. Note: the v3 default radius is larger (button and card 24px) and values are derived from `--radius`. After build, verify the rendered button radius is 12px per this file, not 24px default v3. Exception (Figma, login page only): the login button is 16px radius (Q-09); do not apply 16px to other buttons.
- Shadow: card `0 1px 2px rgb(0 0 0 / 0.06)`, modal `0 8px 24px rgb(0 0 0 / 0.12)`.
- Motion: 150ms (hover), 250ms (color / theme), 350ms (modal, drawer). Easing: `cubic-bezier(.22,.61,.36,1)`.
- Table: row height 44px, body text 14px, header in `surface-2`, row hover in `surface-2`, selected row in `accent-soft`.
- Form: label 14px / 600 above the field, field height 44px, field radius 12px, border `mist`, focus ring 2px `accent`, error text 12px in `danger`. (Field radius changed 2026-11-10 from 16px to 12px by owner decision: the Figma design shows 12px and the design takes priority.)
- Reduced motion: HeroUI animations are disabled with `data-reduce-motion="true"` on `html`. Respect `prefers-reduced-motion` with this attribute.
- Scrollbar: use tokens `--scrollbar-thumb` and `--scrollbar-track` and attribute `data-scrollbar` with values `thin`, `default`, `none` for horizontal scroll tables. Do not write custom webkit scrollbar styles.

### Breakpoints

| Breakpoint | Width | Layout change |
|---|---|---|
| Mobile | under 768px | Page padding 16px, sidebar becomes drawer, tables scroll horizontally, forms stack to one column, primary action in forms is full width |
| Tablet | 768px to 1023px | Sidebar becomes drawer, content max 100 percent, tables scroll horizontally |
| Desktop | 1024px and up | Sidebar 264px visible, content max 1440px, page padding 24px |

Do not hide table columns on mobile without a product decision. Scroll the table horizontally instead.

## 4. Icons

Lucide only. No emoji as icons, no custom SVGs.

| Use | Icon |
|---|---|
| Calendar | `Calendar` |
| Prescription | `Eye` / `FileText` |
| Order | `Package` |
| Invoice | `Receipt` |
| Cash | `Wallet` |
| Inventory | `Boxes` |
| Debt | `CreditCard` |
| SMS | `MessageSquare` |
| Reports | `BarChart3` |
| Search | `Search` |
| Print | `Printer` |
| Theme | `Sun` / `Moon` |
| Close | `X` |
| Confirm | `Check` |
| Warning | `AlertTriangle` |

Icon size: 16 in tables and forms, 20 in topbar and buttons, 24 in empty states. Icon color inherits text color, or muted, or accent for active state only. Grid 24x24, stroke 2.

## 5. Components, HeroUI v3

Exact APIs from heroui.com, for the pinned version in section 0. `Navbar` and `User` do not exist in v3, header and sidebar are custom. `useInput`, `useSwitch`, and `useDisclosure` were removed. Use `useOverlayState` for overlays. Component hooks were replaced by compound components. Global override of a component is done only with BEM classes in `@layer components`, for example `.button`, `.button--primary`, `.accordion__trigger`. Each component page lists its own BEM classes.

Accessibility in HeroUI comes from React Aria Components in `@heroui/react`. Keyboard navigation, focus management, and ARIA attributes come from React Aria. Do not replace a HeroUI component with a custom one that breaks keyboard or screen reader behavior. For custom components, keyboard, focus, and ARIA are your own responsibility.

### Button

```tsx
import { Button } from "@heroui/react";
<Button variant="primary" size="md">Save prescription</Button>
```

- `variant`: `primary | secondary | tertiary | outline | ghost | danger | danger-soft` (default `primary`)
- `size`: `sm | md | lg` (default `md`)
- Props: `fullWidth`, `isDisabled`, `isPending` (not `isLoading`), `isIconOnly`, `onPress`
- Raibod mapping: Primary = accent, Secondary = ink, Tertiary = `surface-2`, Danger = delete / cancel with confirmation. One Primary per view.
- Default width is `w-fit` with no minimum width. For a full-width button on mobile forms, pass `fullWidth` explicitly.
- `onPress` comes from React Aria. Pending state is marked with `[data-pending]` and has no pointer events.
- Loading state: `isPending` keeps the label. Whether an automatic spinner is shown was not confirmed on the Button docs page. Verify the spinner behavior with the installed version before relying on it.

### TextField, Input, TextArea, Label, Description, FieldError

```tsx
<TextField isRequired isInvalid={hasError}>
  <Label>Mobile</Label>
  <Input />
  <FieldError>Duplicate mobile</FieldError>
</TextField>
```

Composition: `TextField > Label + Input (or TextArea) + Description + FieldError`. Props: `isRequired`, `isInvalid`, `validate`, `validationBehavior` (default `native`), `validationErrors` for server errors, `isDisabled`, `isReadOnly`, `value`, `onChange` (string), `fullWidth`. Use `NumberField` for numbers, `SearchField` for search. Inside a `Surface`, use `variant="secondary"` on Input / TextArea.
Label is always visible above the field. Placeholder is not a label. Error text is 12px in `danger` with an icon, and states the problem and the fix. Description is hidden automatically when the field is invalid.
`Input` is a primitive with no validation props. Standard HTML props apply, plus `fullWidth` and `variant` (`primary` default, `secondary`). Validation lives only on `TextField`. `TextArea` is a primitive with `rows` default 3.
`Label` props: `htmlFor`, `isRequired`, `isDisabled`, `isInvalid`. `Description` has only `className` and `children` and connects with `slot="description"`. `FieldError` has only `className` and `children`. Children can be a render function with `validation.validationErrors.join(', ')`. FieldError is shown only when `data-visible` is present. Long text is shortened with ellipsis.

### NumberField

Composition: `NumberField > Label + NumberField.Group > NumberField.DecrementButton + NumberField.Input + NumberField.IncrementButton + Description + FieldError`. Props: `value` (number), `onChange` with `(value: number | undefined) => void`, `minValue`, `maxValue`, `step` (default 1), `formatOptions` (`Intl.NumberFormatOptions`, for Toman and percent), `locale`, `isRequired`, `isInvalid`, `validate`, `validationBehavior`, `isDisabled`, `isReadOnly`, `fullWidth`, `variant` (`primary` default, `secondary`).
Raibod: price, quantity, and lens power are entered with NumberField, with `minValue`, `maxValue`, and `formatOptions` for Toman. Increment and decrement buttons are optional.

### SearchField

Composition: `SearchField > Label + SearchField.Group > SearchField.SearchIcon + SearchField.Input + SearchField.ClearButton + Description + FieldError`. Extra props over TextField: `onSubmit` for Enter, `onClear` for the clear button. The clear button is hidden when the field is empty. Variant `primary` default, `secondary` for Surface.
Raibod: customer and frame search use SearchField. `onSubmit` runs the search.

### Form

`Form` is a native `<form>` with no dedicated BEM class. Container style is given with `className`. Props: `validationBehavior` (default `native`), `validationErrors` for server errors, `onSubmit`, `onReset`, `onInvalid` (new in v3, focuses the first invalid field by default), `action`, `method`, `encType`, `target`. `native` blocks submit on error. `aria` shows the error live and does not block submit. The behavior can be overridden at form level or per field.
Raibod: all Raibod forms go inside `<Form validationBehavior="native" onSubmit onInvalid>`. Server errors return to the field with `validationErrors`.

### Fieldset

Composition: `Fieldset > Fieldset.Legend + Fieldset.Group + Fieldset.Actions`. The docs API table lists only `className`, `children`, and `nativeProps`, with no `isDisabled` prop in the table, but release notes 3.1.0 and 3.2.0 say `disabled` propagates from Fieldset to child fields, RadioGroup, and Slider.
Raibod: group the fields of a patient file, prescription, and order with `Fieldset.Legend` and `Fieldset.Group`, and put buttons in `Fieldset.Actions`.

### InputGroup

Composition: `TextField > Label + InputGroup > InputGroup.Prefix + InputGroup.Input or InputGroup.TextArea + InputGroup.Suffix + Description + FieldError`. Variants: `primary` default, `secondary` for Surface. `fullWidth` is supported. Required, disabled, and invalid states come from the parent TextField.
Raibod: for a field prefix and suffix, use `InputGroup.Prefix` and `InputGroup.Suffix` inside TextField instead of building them by hand. Use cases: Toman unit prefix, search icon suffix, show password button in the mobile and amount field.

### Select, Autocomplete, ComboBox, ListBox

All three use compound composition and items are built with `ListBox.Item`. On each item, put `id` for selection state and `textValue` for accessibility, and keep the React `key`.

Select: `Select > Label + Select.Trigger > Select.Value + Select.ClearButton + Select.Indicator + Description + Select.Popover > ListBox`. Value is `Key | Key[] | null`. `selectionMode` is `single` (default) or `multiple`. Placeholder default is `Select an item`. `Select.ClearButton` is a span, not a button, and clearing with keyboard is done with Backspace or Delete. Variant `primary` default, `secondary` for Surface.
Autocomplete: Select composition with search inside the popover. `Autocomplete > Label + Autocomplete.Trigger > Autocomplete.Value + Autocomplete.ClearButton + Autocomplete.Indicator + Description + Autocomplete.Popover > Autocomplete.Filter > SearchField + ListBox`. Filtering uses the `useFilter` hook from React Aria with the `contains` function. `allowsEmptyCollection` allows work with an empty list. Virtualization with Virtualizer is supported for large lists.
ComboBox: a text input that filters the list, unlike Autocomplete which has a button trigger. `ComboBox > Label + ComboBox.InputGroup > Input + ComboBox.Trigger + ComboBox.Value + Description + ComboBox.Popover > ListBox`. Special props: `inputValue` and `onInputChange`, `selectedKey` and `onSelectionChange`, `allowsCustomValue` for a value outside the list, `menuTrigger` (default `focus`, options `input`, `manual`), `formValue` (default `key`), `defaultFilter`, `selectionMode` (multiple selection was added in 3.2.3).
Raibod: for a short list such as lens type, use Select. For search inside a long list such as frames, use Autocomplete. For direct typing with a free value allowed, use ComboBox with `allowsCustomValue`. Placeholder is in Persian. Include an "All" option for filters only. Do not add an empty option for required fields.

ListBox: `selectionMode` is `none | single | multiple` (default `single`). Composition is `ListBox.Item` and `ListBox.Section`. Item identity is `id`, and `textValue` when content is not plain text. Virtualizer is supported. `selectedKeys`, `defaultSelectedKeys`, `onSelectionChange` apply.
Raibod: build the option lists of Select, Autocomplete, and ComboBox, and any custom selection list, with `ListBox` and `ListBox.Item` and `id` and `textValue`.

### Table

```tsx
<Table variant="primary">
  <Table.ScrollContainer>
    <Table.Content aria-label="Customers" selectionMode="single">
      <Table.Header>
        <Table.Column allowsSorting>Name</Table.Column>
      </Table.Header>
      <Table.Body renderEmptyState={() => "No results"}>…</Table.Body>
    </Table.Content>
    <Table.Footer>…</Table.Footer>
  </Table.ScrollContainer>
</Table>
```

- `variant`: `primary` (card container, default) | `secondary` (flat)
- Sorting: `allowsSorting` on `Table.Column`, `sortDescriptor` and `onSortChange` on `Table.Content`, `Table.SortableColumnHeader` with `sortDirection`
- Selection: `selectionMode` on `Table.Content` with `none | single | multiple` (default `none`). The selection checkbox is not rendered automatically in v3. Put a `Checkbox` explicitly with `slot="selection"`.
- Column resize: `ResizableContainer` + `ColumnResizer`. Infinite scroll: `Table.LoadMore` with `isLoading` and `onLoadMore`. `renderEmptyState` is on `Table.Body`. Nested rows use the `treeColumn` prop, a button with `slot="chevron"`, and `expandedKeys`.
- Virtualization: `rowHeight` (default 48), `estimatedRowHeight`, `headingHeight` (default 48), `loaderHeight` (default 48) belong to the Virtualizer, not to Table itself. Table is built on the Virtualizer from React Aria. For a 44px row, pass `rowHeight={44}` to the Virtualizer.
- `bottomContent` was replaced by `Table.Footer`. `emptyContent` was replaced by `renderEmptyState` on `Table.Body`.
- Raibod: `variant="primary"`, row 44px, text 14px. Pagination goes in `Table.Footer`.
- Empty state: icon 48px, title H3, text, primary button. Use `renderEmptyState` with the `EmptyState` component from `@heroui/react`, and keep the Raibod visual spec as the Raibod rule.
- Loading state: skeleton rows with the same row height.
- Pagination is below the table: "1-20 of 128" + `Pagination`. Page size is 20.

### Calendar

```tsx
<Calendar aria-label="Appointment date" isDateUnavailable={(d) => isBooked(d)}>
  <Calendar.Header>
    <Calendar.Heading />
    <Calendar.NavButton slot="previous" />
    <Calendar.NavButton slot="next" />
  </Calendar.Header>
  <Calendar.Grid>
    <Calendar.GridBody>
      {(date) => <Calendar.Cell date={date} />}
    </Calendar.GridBody>
  </Calendar.Grid>
</Calendar>
```

- Props: `isDateUnavailable`, `visibleDuration={{ months / weeks / days }}`, `firstDayOfWeek`, `weeksInMonth`, `minValue`, `maxValue`, `pageBehavior`, `selectionMode`
- `firstDayOfWeek` accepts `sun | mon | tue | wed | thu | fri | sat`. Raibod: `firstDayOfWeek="sat"`.
- `visibleDuration` has the shape `{months?: number; weeks?: number; days?: number}`. Day and week views are supported. Use `visibleDuration={{days: 1}}` for day view and `visibleDuration={{weeks: 1}}` for week view, with `pageBehavior="single"`.
- `pageBehavior` is `visible | single`.
- `weeksInMonth` keeps the grid height fixed. The docs warn to use it with care in non-Gregorian locales. For Jalali months, do not set a fixed value for `weeksInMonth`.
- `Calendar.CellIndicator` shows a mark inside a cell, such as a dot for an event.
- `selectionMode` also supports `multiple`.
- `minValue` default is 1900-01-01. `maxValue` default is 2099-12-31.
- Cell states: `data-selected`, `data-today`, `data-unavailable`, `data-outside-month`
- Jalali mechanism: the calendar system comes by default from the user locale and can only be overridden by wrapping the Calendar in `I18nProvider` with the Unicode calendar locale extension. The exact locale string such as `fa-IR-u-ca-persian` was not seen in the docs text that was read, because the Calendar page request returned 429. Do not write that string as a docs quote. Verify it in code with `@internationalized/date`. Values must be built as Jalali `CalendarDate` values.
- Jalali rule: Calendar must use the Jalali calendar system. First day of week is Saturday. Month names are Jalali. Dates shown are Jalali only, format YYYY/MM/DD, Latin digits. Do not use a Gregorian calendar in UI. The calendar is built on the React Aria internationalized date library and has Gregorian, Buddhist, and Persian systems by default.
- Unavailable dates are greyed out and not clickable. Today is marked. Selected day is marked with accent.

### DatePicker, DateField

DatePicker exact composition: `DatePicker > Label + DateField.Group > DateField.Input > DateField.Segment + DateField.Suffix > DatePicker.Trigger > DatePicker.TriggerIndicator` and `DatePicker.Popover > Calendar`. Display props: `granularity`, `hourCycle`, `hideTimeZone`, `shouldForceLeadingZeros`. DatePicker takes all props from the React Aria DatePicker, including `value`, `defaultValue`, `onChange`, `minValue`, `maxValue`, `isInvalid`, `isDisabled`. Put `isDateUnavailable` on the inner Calendar. The `onChange` event always returns the date in the same calendar system as `value` or `defaultValue`, and if no value is given it is Gregorian, regardless of the display locale.
Note: the v3.1 DatePicker composition named `DateField.Group / Input / Segment + Calendar + Popover + Trigger` and missed `DateField.Suffix` and `DatePicker.TriggerIndicator`, and left the Trigger position unclear. Use the exact composition in this section. A second name, `DateInputGroup`, appears in a migration note and is not the same as `DateField.Group` in the docs. Choose one name based on the installed version.

DateField composition: `DateField > Label + DateField.Group > DateField.Input > (segment) => DateField.Segment + Description + FieldError`. Other parts: `DateField.InputContainer`, `DateField.Prefix`, `DateField.Suffix`. Value is a `DateValue` from `@internationalized/date`, not a string and not a JavaScript Date. Props: `value`, `defaultValue`, `onChange`, `placeholderValue`, `minValue`, `maxValue`, `isDateUnavailable`, `validate`, `validationBehavior` (default `native`), `granularity`, `hourCycle` (12 or 24), `shouldForceLeadingZeros`, `isRequired`, `isInvalid`, `isDisabled`, `isReadOnly`, `name` (sent as an ISO 8601 string), `fullWidth`. `DateField.Group` has two variants, `primary` (default) and `secondary` for inside a Surface.
Raibod: birth date and appointment date are entered with DateField and a `CalendarDate` value. The Jalali calendar is enabled with `createCalendar` and the fa locale, not with a string.

### Modal

```tsx
const s = useOverlayState({ defaultOpen: false });
<Modal isOpen={s.isOpen} onOpenChange={s.setOpen}>
  <Modal.Backdrop variant="opaque" />
  <Modal.Container placement="center" size="md" scroll="inside">
    <Modal.Dialog>
      <Modal.Header><Modal.Heading>Title</Modal.Heading></Modal.Header>
      <Modal.Body>…</Modal.Body>
      <Modal.Footer>…</Modal.Footer>
      <Modal.CloseTrigger />
    </Modal.Dialog>
  </Modal.Container>
</Modal>
```

- Backdrop `variant`: `opaque | blur | transparent` (default `opaque`), `isDismissable` (default `true`), `isKeyboardDismissDisabled` (default `false`)
- Container `placement`: `auto | center | top | bottom` (default `auto`), `size`: `xs | sm | md | lg | cover | full` (default `md`), `scroll`: `inside | outside` (default `inside`)
- Focus trap, ESC closes, scroll lock. `Modal.Icon` is a subcomponent and must be in the subcomponent list. `Modal.Dialog` can take a render function with `({close})`.
- Note, verify before build: in the Modal API table that was read, `isOpen` and `onOpenChange` appear under Backdrop, not under the Modal root, while the hooks page example puts them on `Modal.Container`. The v3.1 example puts them on `<Modal>`. The confirmed pattern in the docs is to use `useOverlayState`. Confirm the exact placement of `isOpen` with the installed version and align the example with the docs and the `useOverlayState` pattern.
- Do not use a plain Modal for cancel booking or delete. Use AlertDialog, see below.

### AlertDialog

AlertDialog is for sensitive confirmations, not a plain Modal. Use it for cancel booking and delete.

Structure: `AlertDialog` and `AlertDialog.Backdrop` and `AlertDialog.Container` and `AlertDialog.Dialog` and `AlertDialog.Header` and `AlertDialog.Heading` and `AlertDialog.Icon` and `AlertDialog.Body` and `AlertDialog.Footer` and `AlertDialog.CloseTrigger`. Backdrop default: `isDismissable` is `false` and `isKeyboardDismissDisabled` is `true`, so it does not close on outside click or ESC, and the user must choose explicitly. ARIA role is `alertdialog`. `AlertDialog.Icon` has a `status` prop with values `default | accent | success | warning | danger` and default `danger`. Container size is `xs | sm | md | lg | cover` (default `md`). There is no `full` size, unlike Modal. Backdrop has the same three variants `opaque | blur | transparent` with default `opaque`.
Raibod: for cancel booking and delete, use AlertDialog with the default danger Icon and two explicit buttons. Do not use a plain Modal for these two actions.

### Drawer

Drawer is stable in v3.0.0. It is not rc. The v3.1 label `v3-rc.1` is old and must not be used.

Structure: `Drawer` and `Drawer.Backdrop` and `Drawer.Content` and `Drawer.Dialog` and `Drawer.Header` and `Drawer.Heading` and `Drawer.Body` and `Drawer.Footer` and `Drawer.Handle` and `Drawer.CloseTrigger`. The Drawer root takes a `state` prop of type `UseOverlayStateReturn`. `Drawer.Content` has only `placement` with values `top | bottom | left | right` and default `bottom`. It has no size or width prop. The v3.1 width 480 to 640px is not an API prop and must be applied with `className` on Dialog or Content. `size` and `scroll` belong only to `Modal.Container`, not to Drawer. Backdrop has the same three variants and `isDismissable` default `true`, and with `isDismissable={false}` neither outside click nor drag closes it. `Drawer.Body` has internal scroll, and drag to close is excluded from the Body area so it does not conflict with scroll. `Drawer.Handle` is the drag handle. Focus trap, ESC, scroll lock, and dialog role are confirmed.
Raibod: for long forms such as prescription and order, use Drawer. Write the placement explicitly for desktop forms, and give the width 480 to 640px with `className`, because the default Drawer placement is bottom of the screen and it has no width prop.

### Toast

In the app root, render `<Toast.Provider />`. Calls are made with the global function `toast("text")` and `toast.success`, `toast.info`, `toast.warning`, `toast.danger`. Default `timeout` is 4000ms, which matches the 4 seconds in v3.1. `variant` values in the API are `default | accent | success | warning | danger`. There is no `info` value in the variant list, even though `toast.info` exists in the examples. For info, use the `accent` variant in HeroUI components.
Provider defaults: `placement` is `bottom`, `maxVisibleToasts` is 3, `width` is 460, `gap` is 12. Options: `description`, `actionProps`, `indicator`, `isLoading`, `timeout`, `onClose`. With `timeout: 0` the toast stays. `toast.promise()`, `toast.update()`, `toast.close(key)`, and `toast.clear()` also exist. The timer stops on hover, focus, and when the tab is in the background.
Raibod: the background `#1E1E1C` in Light and `#F5F2EF` in Dark from v3.1 was not seen as the HeroUI default in the docs API. Record it as a Raibod override, not as the library default. For "Prescription saved" use `toast.success`. For "Invoice issued" use `toast.success` with one action. One action max. Do not show a toast for every routine action. `Toast.CloseButton` is a Toast subcomponent, separate from the standalone `CloseButton`.

### Tabs

Tabs `variant` is only `primary | secondary` (default `primary`). The v3.1 phrase "Underline variant" does not exist in the docs and must not be used. `secondary` has the underline indicator. `primary` has the filled indicator. Composition is `Tabs > Tabs.ListContainer > Tabs.List > Tabs.Tab` with `Tabs.Indicator` and `Tabs.Panel`. The `id` of the tab and the panel must be the same. `Tabs.Separator` is optional and goes inside each `Tabs.Tab` except the first. `Tabs.ListContainer` shows automatic scroll buttons and a faded edge on overflow. `orientation` is `horizontal | vertical`. `align` is `start | center | end` (default `center`).
Raibod: patient file tabs are Details, Appointments, Prescriptions, Orders, Debt, Messages. Use `variant="secondary"` with the composition above and matching `id` values. No more than 6 tabs. Only tabs allowed for the current role are shown. On mobile, rely on the automatic scroll of `ListContainer`.

### Pagination

Pagination is fully compound: `Pagination.Summary` and `Pagination.Content` and `Pagination.Item` and `Pagination.Link` with `isActive` and `Pagination.Previous` and `Pagination.Next` and `Pagination.Ellipsis`. There is no prop for page count, total count, or page size. `size` is only `sm | md | lg` (default `md`). The handler is `onPress`, not `onClick`. The active page is marked with `aria-current="page"`. The root is a `nav` element with `aria-label="pagination"`.
Raibod: use Pagination below tables. Show range text and page numbers. Page size is 20. Filters are stored in the URL so the link can be shared. The range text "1-20 of 128" is a Raibod rule, not a Pagination prop.

### Switch, Checkbox, RadioGroup, v3.2 composition

In v3.2.0 a breaking change was announced: `*.Control` must be inside `*.Content`, the label is plain text inside `*.Content` and no `<Label>` component goes inside it, and `Description` and `FieldError` become siblings of `*.Content`, not children of it. The current Checkbox and RadioGroup docs pages show this new composition. Example Checkbox: `Checkbox > Checkbox.Content > Checkbox.Control > Checkbox.Indicator` plus plain label text, with `Description` and `FieldError` outside `Content`. The Switch docs page that was opened still shows the old composition and conflicts with the v3.2.0 release note. Do not copy the Switch example from the docs page without pinning the version. Write the Switch, Checkbox, and RadioGroup composition based on the pinned version.
Raibod: use Switch, Checkbox, and RadioGroup for settings, filters, and admin ticks. Label is in Persian, touch target is at least 44px. Do not use a switch for a destructive action.

### Badge, Chip

Badge and Chip are different. Do not merge them.

Badge is only a marker attached to another element, used with `Badge.Anchor` and `Badge.Label`. The docs say to use Chip for a standalone label. Badge without children becomes a dot. `color` is `default | accent | success | warning | danger`. `variant` is `primary | secondary | soft` (default `primary`). `size` is `sm | md | lg` (default `md`).
Chip is the standalone status label. `color` is the same five values. `variant` is `primary | secondary | tertiary | soft` (default `secondary`). `size` is `sm | md | lg` (default `md`). The size "12px/500" in v3.1 is a Raibod rule, not a docs value.
Raibod: write statuses only with `Chip` with `variant="soft"` and the `color` matching the status color and a text label. Use `Badge` only for a counter or dot on an avatar and icon with `Badge.Anchor`. Status color is always paired with a text label.

### Alert

Structure is compound: `Alert` and `Alert.Indicator` and `Alert.Content` and `Alert.Title` and `Alert.Description`. The `status` prop has values `default | accent | success | warning | danger` (default `default`). There is no `variant` prop. There is no built-in close button. Add a `CloseButton` manually when needed. There is no visibility control. Control it with conditional rendering. `Alert.Indicator` shows the default icon for the status, or takes a custom child.
Raibod: write a form error with Alert and status `danger` and Title and Description. For information, use status `accent`, because there is no `info` value. Include an icon and text. Do not use color alone.

### Breadcrumbs

Use HeroUI `Breadcrumbs` for patient file and order flow, max 3 levels, Persian labels. The last item without `href` automatically becomes the current page with `aria-current="page"`. The separator default is the chevron-right icon. Its direction in RTL was not specified in the docs and must be checked in implementation.

### Dropdown

Structure: `Dropdown` and `Dropdown.Trigger` and `Dropdown.Popover` and `Dropdown.Menu` and `Dropdown.Item` and `Dropdown.Section` and `Dropdown.SubmenuTrigger`. `Dropdown.Item` has `id` and `textValue`. When the item content is not plain text, `textValue` is needed for screen reader announcement and type-ahead. Item `variant` is `default | danger` (default `default`). `selectionMode` on Menu is `single | multiple | none` (default `none`). `onAction` is called with the item key. `disabledKeys` also exists. `Dropdown.Popover` default `placement` is `bottom`, with values `bottom start`, `bottom end`, `top start`, `top end`, which are better for RTL than physical left and right. `Dropdown.ItemIndicator` type is `checkmark | dot` (default `checkmark`). `Separator`, `Header`, `Label`, `Description`, and `Kbd` are also part of the structure.
Raibod: build row actions with Dropdown and Menu and `onAction` and `id` and `textValue`. The delete item takes variant `danger`.

### Popover, Tooltip, Skeleton, Spinner, ProgressBar, CloseButton

Popover: `Popover` and `Popover.Trigger` and `Popover.Content` and `Popover.Arrow` and `Popover.Dialog` and `Popover.Heading`. `Popover.Content` default `placement` is `bottom`, `offset` is 8, `shouldFlip` is `true`. Use Popover only for rich content next to a trigger. Do not build a row action menu with it.

Tooltip: `Tooltip` and `Tooltip.Trigger` and `Tooltip.Content` and `Tooltip.Arrow`. Default `delay` is 1500ms and `closeDelay` is 500ms, overridden with the global variables `--tooltip-delay` and `--tooltip-close-delay` or with the same props on the Tooltip. `trigger` default is `hover` and also has `focus`. `Tooltip.Content` has `showArrow` (default `false`), `offset` (default 3, 7 with arrow), and `placement` (default `top`). Record the 1500ms default delay explicitly in the system, because for an internal tool it is slow and must not be assumed to open at once. Do not put essential information in a hover-only tooltip.

Skeleton: only prop is `animationType` with values `shimmer | pulse | none` (default `shimmer`), also settable with the global variable `--skeleton-animation`. For coordinated shimmer, put the class `skeleton--shimmer` on the parent and `animationType="none"` on children. Size and shape are set only with `className`. Default animation is `shimmer`. Skeleton height must equal the height of the content it replaces.

Spinner: `size` is `sm | md | lg | xl` (default `md`). `color` is `current | accent | success | warning | danger` (default `accent`). The docs recommend pairing it with `motion-reduce:animate-none` for users who want less motion. Default is accent and size md. In a button, pair it with `isPending`.

ProgressBar: `ProgressBar` and `Label` and `ProgressBar.Output` and `ProgressBar.Track` and `ProgressBar.Fill`. Props: `value` (default 0), `minValue` (default 0), `maxValue` (default 100), `isIndeterminate` (default `false`), `size` (`sm | md | lg`, default `md`), `color` (`default | accent | success | warning | danger`, default `accent`), `formatOptions` (default percent). Use ProgressBar only for measurable progress or an indeterminate long operation, and record the default value as percent.

CloseButton: the standalone `CloseButton` component is for closing a dialog and modal and dismissing content. It has only `variant` `default`. Its default child is the close icon. It has `onPress` and `isDisabled`. Note: `Modal.CloseTrigger`, `Drawer.CloseTrigger`, and `AlertDialog.CloseTrigger` are separate, and `Toast.CloseButton` is a Toast subcomponent. For closing an Alert, use the standalone CloseButton. Inside Modal, Drawer, and AlertDialog, use the CloseTrigger of that component.

### Card, Surface

Card: `variant` is `transparent | default | secondary | tertiary` (default `default`). Composition is `Card.Header` and `Card.Title` (renders `h3`) and `Card.Description` and `Card.Content` and `Card.Footer`. The docs say `default` is shown with surface-secondary.
Raibod: build cards with `Card` and `variant="default"` and `Card.Header` and `Card.Title` and `Card.Content`. Specify the mapping of `default` to the Raibod surface token in the build, because the docs call `default` surface-secondary. Cards are needed for dashboard cards, patient file panels, frame and lens cards, and landing.

Surface: `variant` is `transparent | default | secondary | tertiary` (default `default`). Inside a Surface, put `variant="secondary"` on forms. `SurfaceContext` gives the variant value to children.
Raibod: build panels and surfaced containers with `Surface`. Put the form inside it with `variant="secondary"`.

### EmptyState

`EmptyState` is exported from `@heroui/react` and is used in the Autocomplete example with `ListBox renderEmptyState={() => <EmptyState>No tags found</EmptyState>}`. The fuller version with `EmptyState.Header` and `EmptyState.Media` and `EmptyState.Title` and `EmptyState.Description` is only in paid HeroUI Pro beta and is not for Raibod.
Raibod: build the empty state of a table and list with `renderEmptyState` and the `EmptyState` component from `@heroui/react`, and keep the v3.1 visual spec (icon 48px, title H3, text, primary button) as the Raibod rule.

### Link, Separator, Avatar, Meter, Disclosure, DateRangePicker, TimeField, Slider

Link exists in v3. In beta.4 the underline variants were removed. The dedicated page returned 429 in the review and its props were not confirmed. Links inside a table, Breadcrumbs, and landing need it. Read its props from the docs page before writing v3.2 code that uses it.

Separator exists in v3. Its v2 name was Divider. The dedicated page returned 429 and its props were not confirmed. Use `Separator` for visual separators in panels and forms, not a manual border.

Avatar exists in v3 and is used in the Badge example with `Badge.Anchor`. `AvatarGroup` also exists as a separate component. The dedicated page returned 429 and its props were not confirmed. Use `Avatar` for the user, doctor, and panel user, with a text fallback using the initials of the name.

Meter is in the component list and is described as showing a value in a set range or a fractional value. In the v3.0.0 introduction it paints the value in a semantic color: green for safe, yellow for caution, red for critical. The dedicated page returned 429 and its props were not confirmed. ProgressBar is in v3.1, but Meter is better for inventory level and debt ratio. Use `Meter` for inventory level and debt ratio, and keep ProgressBar only for operation progress.

Disclosure and DisclosureGroup are both in the v3 component list. Disclosure is described as collapsible sections. The dedicated pages returned 429 and their props were not confirmed. Accordion covers the filter group need. For a single collapsible section such as prescription details or landing questions, use `Disclosure` and keep Accordion for filter groups.

RangeCalendar, DateRangePicker, and TimeField are all in the v3 component list. Their dedicated pages were not read in this review. The monthly statement and reports need a date range selection. Use `DateRangePicker` for report and statement ranges and read its API from the docs before v3.2 code. TimeField is only needed if free time entry becomes necessary, because Raibod booking works with predefined slots.

Slider: `Slider > Label + Slider.Output + Slider.Track > Slider.Fill + Slider.Steps + Slider.Thumb + Slider.Marks > Slider.Mark`. Props: `value` (number or number[]), `defaultValue`, `onChange`, `onChangeEnd`, `minValue` (default 0), `maxValue` (default 100), `step` (default 1), `formatOptions` (`Intl.NumberFormatOptions`), `orientation` (default `horizontal`), `isDisabled`. A range is built with an array value and several Thumbs, and each Thumb needs an `index`. Marks are only labels and do not change the value. Horizontal direction follows the RTL locale.
Raibod: use Slider only for a numeric range such as a price range in reports. Its value is `number` or `number[]`.

## 6. Light / Dark

| | Light | Dark |
|---|---|---|
| Background | `#FFFFFF` | `#1E1E1C` |
| Surface | `#FFFFFF` | `#262624` |
| Text | `#1E1E1C` | `#F5F2EF` |
| Muted text | `#787877` | `#A5A5A4` |
| Accent | `#13847F` | `#13847F` |
| Accent text | `#FFFFFF` | `#FFFFFF` |

- Toggle: Lucide `Sun` in Dark / `Moon` in Light, size 20, in the topbar.
- Default: `prefers-color-scheme` through `next-themes` with `defaultTheme="system"` and `enableSystem`; otherwise Light. Choice persists through next-themes.
- Switch without reload, 250ms color transition, HeroUI `.dark` / `[data-theme="dark"]` on `<html>`. The internal light and dark themes react to both the `.light` and `.dark` classes and the `data-theme="light"` and `data-theme="dark"` attributes. If both are set by hand, keep their values in sync.
- Frame photo area stays `#F5F2EF` in both modes. Print is always light (A4).
- What does not change in Dark: typography (size, weight, line-height), radius, spacing, layout, icons, and the red now-line in the calendar. Only color changes.
- Combine the two Providers in one client provider file: the `I18nProvider` from section 0.2 and the `NextThemesProvider` from section 0.3. The docs pages that were read do not show the order for combining them. Confirm the order in code.
- Body must always have `bg-background text-foreground` in the root layout, so the page canvas changes with the theme.

## 7. Print

Print is always light, A4, no sidebar, no topbar, no dark mode.

- Header: "عینک رایبد" + phone 09120987790.
- Content only: prescription or invoice, with tables and borders.
- Colors in print become black and gray, except the shop name in ink. No background colors, except light gray for table header.
- Font: Vazirmatn, numbers Latin with tnum, dates Jalali YYYY/MM/DD.
- Footer: page number and date of print.
- Print style is separate (`@media print`). Do not use screen shadows in print.

## 8. Accessibility

- Contrast AA minimum for text. Focus ring is visible, 2px accent.
- Keyboard complete: Tab, Enter, Escape. Modal focus trap is required.
- Touch target is at least 44px.
- Error is not shown by color alone. Include an icon and text.
- Status is not shown by color alone. Include a text label.
- Images have Persian alt text with name and code.
- Form labels are always visible. Placeholder is not a label.
- Loading states use skeleton or spinner with the same height as content.
- Numbers and dates always use one format across the system.
- Accessibility in HeroUI is built on React Aria Components. Do not replace a HeroUI component with a custom one that breaks keyboard, focus, or screen reader support.

## 9. Tokens, app/globals.css

```css
@import "tailwindcss";
@import "@heroui/styles";

:root {
  --background: #FFFFFF;
  --foreground: #1E1E1C;
  --surface: #FFFFFF;
  --surface-2: #F5F2EF;
  --surface-secondary: #F5F2EF;
  --muted: #787877;
  --border: #E6E8E8;
  --accent: #13847F;
  --accent-foreground: #FFFFFF;
  --accent-hover: #10706C;
  --accent-soft: #E7F3F2;
  --accent-text: #0D5C59;
  --field: #FFFFFF;
  --field-background: #FFFFFF;
  --field-hover: #F5F2EF;
  --field-focus: #FFFFFF;
  --focus: #13847F;
  --danger: #B91C1C;
  --success: #2E7D32;
  --warning: #B45309;
  --info: #155E75;
  --radius: 0.75rem;
  --font-sans: "Vazirmatn", system-ui, Tahoma, sans-serif;
}

.dark, [data-theme="dark"] {
  --background: #1E1E1C;
  --foreground: #F5F2EF;
  --surface: #262624;
  --surface-2: #2E2E2C;
  --surface-secondary: #2E2E2C;
  --muted: #A5A5A4;
  --border: #3A3A38;
  --accent: #13847F;
  --accent-foreground: #FFFFFF;
  --accent-hover: #10706C;
  --accent-soft: #0A4946;
  --accent-text: #89C2BF;
  --field: #262624;
  --field-background: #262624;
  --field-hover: #2E2E2C;
  --field-focus: #262624;
  --focus: #89C2BF;
  --danger: #F87171;
  --success: #4ADE80;
  --warning: #FBBF24;
  --info: #7DD3FC;
}

@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --color-surface: var(--surface);
  --color-surface-2: var(--surface-2);
  --color-surface-secondary: var(--surface-secondary);
  --color-muted: var(--muted);
  --color-border: var(--border);
  --color-accent: var(--accent);
  --color-accent-foreground: var(--accent-foreground);
  --color-accent-hover: var(--accent-hover);
  --color-accent-soft: var(--accent-soft);
  --color-accent-text: var(--accent-text);
  --color-field: var(--field);
  --color-field-background: var(--field-background);
  --color-field-hover: var(--field-hover);
  --color-field-focus: var(--field-focus);
  --color-focus: var(--focus);
  --color-danger: var(--danger);
  --color-success: var(--success);
  --color-warning: var(--warning);
  --color-info: var(--info);
  --radius: var(--radius);
  --font-sans: var(--font-sans);
  --text-h1: clamp(1.5625rem, 3vw + 0.75rem, 2rem);
  --text-h2: clamp(1.25rem, 2vw + 0.75rem, 1.5625rem);
  --text-h3: 1.25rem;
  --text-body: 1rem;
  --text-body-sm: 0.875rem;
  --text-caption: 0.75rem;
}
```

Rules for code: no raw hex in JSX (`bg-accent` is correct, `bg-[#13847F]` is not correct). No raw font size (`text-h2` is correct). Icons only from `lucide-react`. HeroUI first, custom component only with these tokens. Do not use `bg-accent-500` or any numeric accent class. Allowed accent classes are `bg-accent`, `bg-accent-soft`, `bg-accent-hover`, `text-accent`, `text-accent-text`.

## 10. File structure

```
DESIGN_SYSTEM.md
app/
  globals.css
  layout.tsx
  provider.tsx
  providers.tsx
  (public)/
  (panel)/
components/
  ui/
  calendar/
  crm/
  sales/
```

`layout.tsx` sets Vazirmatn, `lang="fa"`, `dir="rtl"`, `suppressHydrationWarning` on `html`, and `bg-background text-foreground` on `body`. `provider.tsx` is the `I18nProvider` with fixed locale `fa`. `providers.tsx` is the client `NextThemesProvider` from section 0.3. Combine both Providers in one client provider file and confirm their order in code. `(public)` is landing and booking. `(panel)` is the internal panel behind login. `components/ui` holds HeroUI wrappers. Do not put product logic in `components/ui`.

## 11. Acceptance checklist

Use this checklist before any UI is sent to Claude Code or merged.

- [ ] File is `DESIGN_SYSTEM.md` in the repo root, and only tokens from section 9 are used. No raw hex. No numeric accent classes.
- [ ] HeroUI version is pinned in `package.json`. Switch, Checkbox, RadioGroup, and calendar week/day composition match the pinned version.
- [ ] No `HeroUIProvider` exists. `I18nProvider` with locale `fa` is in `app/provider.tsx`. Theme is managed only with `next-themes`, `defaultTheme="system"`, `enableSystem`, `suppressHydrationWarning` on `html`.
- [ ] All text sizes are from the 1.25 scale. No off-scale sizes. Rendered button radius is 12px, not the v3 default 24px.
- [ ] UI is Persian, RTL, `lang="fa" dir="rtl"`. Dates are Jalali YYYY/MM/DD with Latin digits. Calendar uses `I18nProvider` with the Persian calendar extension and Jalali `CalendarDate` values. `firstDayOfWeek="sat"`. No fixed `weeksInMonth` for Jalali months.
- [ ] Numbers, prices, and codes are Latin digits with `tnum`, `dir="ltr"`.
- [ ] Light and Dark are checked for every page. Forbidden combinations are absent: `#787877` text in Dark.
- [ ] One Primary per view. Focus is visible. Touch target is at least 44px.
- [ ] Tabs use `variant="secondary"` with `Tabs.ListContainer`, `Tabs.List`, `Tabs.Tab`, `Tabs.Panel` and matching `id`. Status uses `Chip` with `variant="soft"`, not Badge. Cancel and delete use AlertDialog, not a plain Modal.
- [ ] Drawer width is set with `className`, not with a size prop. Drawer placement is explicit. Toast root has `<Toast.Provider />` with placement `bottom` and max 3 toasts.
- [ ] Table, form, modal, toast, calendar, and print match sections 5, 7, and 8. Form is inside `<Form validationBehavior="native">`. Pagination is in `Table.Footer`. Selection uses a `Checkbox` with `slot="selection"`.
- [ ] Print is light A4, no sidebar, no topbar.
- [ ] Status is shown with text label, not color alone. Error is shown with icon and text, not color alone.
- [ ] No online shop, public catalog, or cart was built. That rule comes from the product spec, and this design system does not change it.
- [ ] MCP server and agent skill from section 0.4 are installed before Claude Code builds, and heroui.com is the API reference.

## 12. Decisions closed in v3.2

- Background: white `#FFFFFF`. Decided by Arshia, 2026-11-05. Surface-2 is bone `#F5F2EF`.
- Status colors: final. Values in section 1. HeroUI status list has no `info` variant, use `accent` for info in HeroUI components.
- Date format: Jalali YYYY/MM/DD, Latin digits, `dir="ltr"`.
- Language: Persian, RTL, fixed locale `fa` through `I18nProvider`.
- Font: Vazirmatn.
- Icons: Lucide only.
- Modes: Light and Dark, both required, managed with `next-themes`.
- Stack: TypeScript, React 19+, Next.js App Router, HeroUI v3.2 pinned, Tailwind CSS v4, PostgreSQL.
- Tabs: `variant="secondary"`. Status: `Chip` with `variant="soft"`. Sensitive confirmations: AlertDialog. Drawer: stable, no size prop, width with `className`.
- Toast: `<Toast.Provider />` in root, placement `bottom`, max 3, timeout 4000ms.
- `data-vibrant-palette` is off. Headless mode is off. The `@heroui/styles` import is kept.

## 13. Still open and unverified, not design system

These do not block UI work with this design system, but must be confirmed before those features are built, or in code with the pinned version:

- Exact prescription fields list. Needs the shop form.
- Lens group rule. SPH or SPH plus CYL, per eye or not.
- SMS provider, hosting, previous data format, thickness data format, booking duration and type, confirmation method.
- Product flows, roles, data model, and API contract. Those are in v2.1 product specification. Send v3.2 together with v2.1.
- Exact Jalali locale string. The Calendar page request returned 429 in the review. Verify it in code with `@internationalized/date`. Do not quote an unverified locale string as docs.
- Latin digits in DateField under the fa locale. Verify in code whether a numbering system setting is needed.
- Exact placement of `isOpen` on Modal. The API table and the hooks example differ. Confirm with the installed version.
- Switch composition in the docs page. The Switch page still shows the old composition and conflicts with the v3.2.0 release note. Confirm with the pinned version.
- next-themes install command. Confirm from the next-themes docs.
- Props for Link, Separator, Avatar, Meter, Disclosure, Kbd. Their dedicated pages returned 429 in the review. Only their existence in the component list was confirmed. Read them before v3.2 code that uses them.
- Latest HeroUI patch number. Confirm from npm or the releases page before install.
- Button automatic spinner. Not confirmed on the Button docs page. Verify with the installed version.
- Order of `I18nProvider` and `NextThemesProvider` when combined. The docs do not specify it. Confirm in code.
- Breadcrumbs separator direction in RTL. Not specified in the docs. Check in implementation.

## 14. Not needed for Raibod

- `HeroUIProvider`, `useTheme` from `@heroui/react` in Next.js, Framer Motion, `RouterProvider`, CSP nonce meta tag, Theme Builder, gradual migration and v2/v3 coexistence with pnpm alias, migration MCP server, HeroUI Native, HeroUI Pro and DataGrid, removed components `Code`, `Image`, `Snippet`, `Spacer`, `Ripple`, standalone Dialog, standalone Overlay, standalone Menu (use `Dropdown.Menu`), ProgressCircle, Kbd (unless keyboard shortcuts are defined later for the CRM calendar), InputOTP, ColorField, ColorPicker, ColorSlider, TimeField (unless free time entry becomes necessary).

## Changelog

- v3.2, 5 November 2026: Based on v3.1 Final and a full HeroUI docs review. Added install commands and PostCSS, no HeroUIProvider, I18nProvider with fixed fa locale, Dark Mode with next-themes, Jalali calendar mechanism, version pin, token mapping to standard HeroUI names, forbidden v2 patterns table, AlertDialog, full Toast and Drawer and Dropdown and Alert APIs, Form, Fieldset, DateField, InputGroup, Card, Surface, ListBox, EmptyState, calendar week and day views, exact Select and Autocomplete and ComboBox compositions, Link and Separator and Avatar and Meter and Disclosure and DateRangePicker and TimeField and Slider, BEM customization, body classes, reduced motion and scrollbar tokens, MCP and agent skill setup, and an unverified items list. Fixed v3.1 errors: Tabs variant is secondary not Underline, Badge is not a standalone status label, use Chip, Drawer is stable not rc and has no size prop, Modal isOpen placement is unverified, Toast has no info variant, Button automatic spinner is unconfirmed, rowHeight belongs to the Virtualizer, Switch and Checkbox and RadioGroup follow the v3.2 composition.
- v3.1 Final, 5 November 2026: Based on v3.0. Added RTL and Jalali specification, finalized status colors, added breakpoints, print specification, accessibility section, expanded components (Select, Toast, Tabs, Pagination, Switch, Checkbox, RadioGroup, Alert, Breadcrumbs, Dropdown, Skeleton), file structure, usage rules, acceptance checklist, and closed decisions list.
- v3.0, 5 November 2026: Tokens and HeroUI v3 components. Background white. Status colors were proposal.
- v2.1, 5 November 2026: Product flows, roles, calendar, booking, CRM. Separate file. Send together with v3.2.

End of document. Raibod Design System v3.2. Any change needs a new version.
