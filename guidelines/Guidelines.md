# ChuteSide Solutions — Design & Development Guidelines

> These rules are non-negotiable. They apply to every screen, every component, every generation.
> When in doubt, refer back here before making a design decision.

---

## 1. General Principles

- This app is used **outdoors, at a livestock chute, in bright sunlight, often with gloved hands**.
- Every design decision must support **speed**. Ranchers process 50–300 animals per hour (12–72 seconds per animal). Nothing should slow that down.
- **Mobile-first always.** Primary target is 375px wide viewport. Desktop at lg+ is a secondary layout.
- **Taps only.** No swipe gestures. Swipe conflicts with physical glove use and chute-side movement.
- **High contrast always.** Navy on white, white on navy. Muted or low-contrast text fails outdoors.
- Keep every screen focused. One primary action per screen. Do not crowd the UI.

---

## 2. Fonts — LOCKED

- **Inter is the only font.** No Open Sans, no Geist Mono, no Google Fonts, no system fonts.
- Reference: `font-['Inter']` in Tailwind class or `fontFamily: 'Inter'` in inline style.
- The legacy CSS class `font-['Open_Sans']` must never be used. If you see it, remove it.
- Minimum font size for any **input field** is **16px**. This is a hard requirement — iOS auto-zooms on anything below 16px and that breaks the chuteside workflow.
- Labels and supporting text may be 12–14px. Input values, scan fields, and action buttons must be 16px or larger.

---

## 3. Colors — LOCKED

Never invent colors. Use only the values below.

### Brand Palette

| Name | Hex | Used For |
|---|---|---|
| Navy | `#0E2646` | Card backgrounds, headers, drawer background, primary button base |
| Mid-Navy | `#153566` | Gradient endpoint, header gradient |
| Teal | `#55BAAA` | Links, active states, Management flag, teal CTA accents |
| Gold / Yellow | `#F3D12A` | Primary CTA buttons, Save & Work Cows, Production flag, outline border |
| Cull Red | `#9B2335` | Cull flag only |
| Page Background | `#F5F5F0` | App background behind all cards |
| Body Text | `#1A1A1A` | All body text on light backgrounds |
| Border / Divider | `#D4D4D0` | Card borders, list dividers |
| Destructive | `#d4183d` | Delete buttons, error actions (shadcn token) |
| White | `#FFFFFF` | Text on dark backgrounds, card interiors |

### Flag Colors — LOCKED, DO NOT CHANGE

| Flag Tier | Color | Hex |
|---|---|---|
| Management | Teal | `#55BAAA` |
| Production | Gold | `#F3D12A` |
| Cull | Deep Red | `#9B2335` |

- Flag color = the color of the **tag text** on every animal card, everywhere the tag appears.
- Priority when multiple flags exist: **Cull > Production > Management**.
- Default tag color (no active flags) = `#55BAAA` (teal).

### Gradients

- **Stat cards / dashboard cards:** `linear-gradient(145deg, #0E2646 0%, #163A5E 55%, #55BAAA 100%)`
- **Nav drawer / header:** `linear-gradient(180deg, #153566 0%, #081020 100%)`
- **Red Book entry cards:** dark gradient — ALL Red Book cards use the gradient, not flat navy.

### Do Not Use

- Do not use `#1B2A4A` for navy (old value, replaced by `#0E2646`).
- Do not use `#D4A017` for gold (old value, use `#F3D12A`).
- Do not use `#F0C05A` for gold (old value, use `#F3D12A`).
- Do not use `#E87461` for coral (not in active use in UI).
- Do not introduce any color not in this list without explicit instruction.

---

## 4. Navigation — LOCKED

- **Hamburger side drawer only** on mobile (< lg breakpoint). Width: 280px. Slides in from left.
- **Desktop sidebar** (`hidden lg:flex`) is permitted at lg+ breakpoints alongside the drawer.
- **No bottom tab bar. Ever.** This is a hard rule. Bottom tabs conflict with glove use and are not part of this design system.
- Nav items: Operation Dashboard, Animals, Cow Work, Calving, Red Book, Reference.
- Active nav item: teal `#55BAAA` highlight. Inactive: white at reduced opacity.

---

## 5. Layout & Spacing

- **Page background:** `#F5F5F0`
- **Content padding (mobile):** `px-5` (20px) for main content, `px-4` (16px) for headers.
- **Content padding (desktop):** `px-8` md, `px-10` lg.
- **Card padding:** `px-4 py-3.5` (16px horizontal, 14px vertical).
- **Form field gap:** `gap-3` between rows.
- **Section spacing:** `space-y-8` between major page sections.
- **Maximum content width (mobile):** `max-w-[420px]` centered.
- **Border radius system:**
  - Cards: `rounded-xl` (12px)
  - Buttons: `rounded-full` (pill)
  - Badges / pills: `rounded-full`
  - Sheets / modals: `rounded-2xl` top corners

---

## 6. Components

### App Header
- Sticky top, `z-30`.
- Background: navy-to-dark gradient `linear-gradient(180deg, #153566 0%, #081020 100%)`.
- Left: hamburger icon (mobile) or back arrow (detail screens).
- Center: screen title (white, Inter, 17–18px, weight 700) with optional subtitle (teal, 12px).
- Right: screen-specific action icon(s).
- Height: `pt-3 pb-4` (approx 56px).

### Cards — List Items
- Background: `#0E2646` (navy).
- Border radius: `rounded-xl`.
- Padding: `px-4 py-3.5`.
- Full card is tappable (no tap zone smaller than the card).
- Tag number: Inter, weight 700, color = flag-tier color (`#55BAAA` default, `#F3D12A` production, `#9B2335` cull).
- Type pill: small rounded-full badge, teal or navy variant.
- 3-dot ActionsDropdown on every list card.

### Stat Cards (Dashboard)
- Background: `linear-gradient(145deg, #0E2646 0%, #163A5E 55%, #55BAAA 100%)`.
- White text only. Number large (28–32px, weight 800). Label small (11px, weight 600, uppercase, letter-spacing).

### Form Layout
- **Always horizontal: label left, input right.**
- Label column: `w-[105px]` (140px at lg+). Text: 14px, weight 600, `#1A1A1A`.
- Input column: `flex-1`. Font size: **minimum 16px**. Weight 400.
- Required field indicator: red asterisk `#E74C3C` next to label.
- Error state: red border `#E74C3C` on input + error message below in red 12px.
- Use `FormFieldRow` and `FormSelectRow` components — do not rebuild form rows from scratch.
- Collapsible sections: use `CollapsibleSection` component. Shows preview text when collapsed.

### Buttons
- **Primary (default):** `PillButton` — yellow `#F3D12A` background, `#1A1A1A` text, `rounded-full`, shadow `0 2px 10px rgba(243,209,42,0.35)`.
- **Outline:** `PillButton variant="outline"` — transparent background, yellow `#F3D12A` border, `#1A1A1A` text.
- **Save & Work Cows / primary CTA:** Yellow background, navy text — same as primary.
- **Destructive:** Red background `#d4183d`, white text.
- Button sizes: sm (12px, 6/16px padding), md (14px, 10/24px), lg (16px, 13/32px).
- Active press: `active:scale-[0.97]`.
- Minimum tap target: **44px height** for all tappable elements. Primary actions: **56px+**.

### Tag / EID Scan Field (Chuteside Screen)
- Prominent, yellow border `#F3D12A`, 2–3px border width.
- Font size: 18–20px, weight 700.
- Full width at top of input tab.
- Auto-focus on screen load and after each Save & Next.

### Flag Icons
- SVG pennant shape. Colors: teal `#55BAAA`, gold `#F3D12A`, red `#9B2335`.
- Use `FlagIcon` component with `color="teal"|"gold"|"red"` and `size="sm"|"md"|"lg"`.
- Max 3 flag icons displayed in any single view (one per tier).

### Collapsible Sections
- Use `CollapsibleSection` component.
- Header shows section title + preview text when collapsed.
- Chevron rotates on expand.
- Used for: Cow Trait Scores, Calf Trait Scores, Products Given, Configure Fields, Notes.

### Quick Notes (Calving & Work Entry)
- Rendered as color-coded pills. **Never a dropdown.**
- Multi-select. Selected = filled background. Unselected = outlined.
- Colors: Cull note = red `#9B2335` at 12% opacity. Production note = gold `#F3D12A` at 12%. Management note = teal `#55BAAA` at 12%. Neutral = gray `#F5F5F0`.
- Selecting a flagged note auto-applies the corresponding flag with a toast notification.

### Bottom Sheets
- Used for retag, quick actions, confirmation.
- Slides in from **below the triggering element** (not from screen bottom).
- `rounded-2xl` top corners.
- Dark overlay behind.
- Always includes a clear Cancel / close affordance.

### Toasts / Notifications
- Slide in from top, `animate-[toastSlideIn_0.25s_ease-out]`.
- `rounded-xl`, left border 3px colored by type.
- Success: bg `#E8F5E9`, border `#27AE60`. Error: bg `#FFEBEE`, border `#E74C3C`. Info: bg `#E3F2FD`, border `#2196F3`.
- Auto-dismiss. Use `ToastProvider` and `useToast()` hook — do not build custom toast logic.

### Empty States
- Every list screen must have an empty state.
- Pattern: centered icon (navy, 48px), heading (navy, 16px, weight 700), subtext (muted, 14px), optional CTA button.
- Use `EmptyState` component — do not inline empty state UI into list components.

### Skeleton Loading
- Every list and detail screen must show skeletons while loading.
- Use `SkeletonCard` and `SkeletonList` from `skeleton-screens.tsx`.
- Shimmer animation: `animate-[shimmerSweep_1.4s_infinite]`.

### Mass Select
- Activate via long-press or select mode toggle.
- Checkbox appears on each card when in select mode.
- `SelectAllBar` component at top of list. `BulkActionBar` fixed at bottom.
- Exit mode clears all selections and hides the bars.

---

## 7. Cow Work — Chuteside Input Screen

This screen has the strictest UX requirements of any screen in the app.

- Four tabs: **Input, Animals Worked, Stats, Project Details**.
- Input tab always starts focused on the tag/EID scan field.
- After **Save & Next**: save record → clear form (keep project-level fields) → return focus to scan field → fire haptic. Must complete in under 1 second.
- **Reset** button: clears form without saving. Label is "Reset" — never "Skip".
- **Save & Done**: saves and navigates back to project list.
- Cow History Panel: expands below scan field on match. Collapsible. Three sub-tabs: Info, Calving, History. Read-only. Never interrupts entry flow.
- Duplicate warning (animal already in project): yellow banner with link to existing record.
- No-match warning: "Not found" — user can still save the record.

### Field Rendering Rules
1. Work-type-specific fields (PREG, BSE, BREEDING) render first under a teal sub-header.
2. Optional project fields render second under "PROJECT FIELDS" sub-header.
3. Fields toggled OFF in project setup are completely absent — not hidden, not greyed out.
4. Quick Notes = color pills always. Notes/Memo = textarea with inline mic icon.

---

## 8. Calving Entry Screen

- **2 tabs only: Entry and Dam.** Never 3 tabs. This is locked.
- Entry tab: Calving Info section, Calf Info section, Cow Trait Scores (collapsible), Calf Trait Scores (collapsible), Notes.
- **Birth Weight and Calf Size appear on the same entry line** as a paired input.
- Dam tab: editable — user can update dam flags and notes without leaving the screen. Changes save with the calving record.
- Dam tab activates after a dam tag is entered.
- Save button label: "Save Record".

---

## 9. Animal Cards & Tag Display

- Tag number font: Inter (not monospace, not Geist Mono).
- Tag color in the UI = the active flag tier color. Default (no flags): `#55BAAA`.
- Lifetime ID is hidden by default. It surfaces inline next to the tag only when two animals share the same tag number (disambiguation context).
- Tag color dot may optionally display the physical ear tag color beside the tag number, but it is not required and varies by operation.

---

## 10. Animal Edit Screen

- Single route: `/animals/:id`. View and edit are toggle states on the same screen.
- **View mode:** 5 tabs — Details, Calving, Breeding, Treatments, Work. Edit button top right (yellow, rounded-full).
- **Edit mode:** 3 tabs — Identity, Details, History. Gold indicator bar below header. Cancel left, Save right.
- Identity tab changes (tag, EID, tag color, year born) auto-archive old identity as tag history snapshot.
- All fields are manually editable by Admin and Operator. No workflow trigger required.
- Tag history on History tab: admin-deletable entries in a timeline.

---

## 11. Project Setup

- User selects display fields AND display order during project setup.
- Drag-to-reorder interface with per-field toggles.
- Drag handle: 6-dot grip icon. Shadow lifts on drag. 2px yellow insertion line.
- Toggled-OFF fields: 50% opacity, strikethrough in configure UI. Absent from chuteside screen.
- Configuration saves per-project and can be saved to a Work Template.
- Work Templates store: Processing Type, Cattle Type, and field configuration. NOT group, location, or date.

---

## 12. Search

- Context-specific search bars on every list screen (animals, calving, projects, etc.).
- Universal search: accessible from main navigation, searches all field types and all record types simultaneously. Returns unified results list with record type labeled.
- Animal search ranking: exact tag → starts-with tag → contains tag → exact EID → ends-with EID → name → Lifetime ID → historical tag (annotated "formerly").

---

## 13. Project Summary & Close-Out

- Project Summary card shows: name, status, date, head count, processing type, cattle type, location, group, **and all products used** (name, dosage, route, aggregated across all animals worked).
- Reconciliation is optional. Three source options: Group, CSV Upload, Past Project.
- Result buckets: Matched (green), Missing (yellow — expanded by default), Extra (red).
- Post-close: reconciliation results visible but no edits allowed.
- Report builder toggle includes: Summary, Metrics Breakdown, Animal Detail List, Reconciliation Results, Products Used.

---

## 14. Haptic Feedback

Implement haptics on every save and key interaction. Use `navigator.vibrate()` with a short audio cue as universal fallback.

| Event | Pattern |
|---|---|
| Save & Next | `[40]` — single short pulse |
| Voice mic start | `[30]` — brief tap |
| Voice mic stop | `[20]` — lighter tap |
| Flag toggle | `[25]` — quick tap |
| Error on save | `[80, 40, 80]` — double bump |
| Delete confirm | `[60, 30, 60]` — double bump |

---

## 15. Things That Must Never Happen

- Never use a bottom tab bar.
- Never use Open Sans, Geist Mono, or any font other than Inter.
- Never use `#D4A017` for gold flags — use `#F3D12A`.
- Never use `#1B2A4A` for navy — use `#0E2646`.
- Never put an input with font-size below 16px.
- Never make calving a 3-tab form. It is always Entry + Dam only.
- Never label the work entry clear button "Skip" — it is "Reset".
- Never use swipe gestures.
- Never build a form row layout from scratch — use `FormFieldRow` / `FormSelectRow`.
- Never build toast notification logic from scratch — use `ToastProvider` / `useToast()`.
- Never build an empty state inline in a list — use the `EmptyState` component.
- Never build skeleton UI inline — use `SkeletonCard` / `SkeletonList`.
- Never display the Lifetime ID in a list view unless two animals share the same tag number.
- Never store group, location, or date in a Work Template.
