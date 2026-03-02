FIGMA MAKE PROMPT — PROJECT REPORT SCREEN
Route: /cow-work/{projectId}/report
================================================

CONTEXT:
After a project is closed out, its status changes to "Completed" and tapping it from the Cow Work project list opens this report screen. This screen is also accessible immediately after closing a project (auto-navigated from the close-out screen). It displays the project's complete results with metrics, animal list, and export options.

HEADER:
- Title: "Project Report"
- Subtitle: "Spring Preg Check · Completed"
- showBack: true (returns to /cow-work list)

SCREEN LAYOUT (top to bottom, scrollable, space-y-5):

── SECTION 1: REPORT HEADER CARD ──

Navy card (bg #0E2646, rounded-2xl, px-5 py-5):
Row 1: Project name — "Spring Preg Check" — 22px, 800 weight, #F0F0F0, letterSpacing -0.01em
Row 2: Status pill — "COMPLETED"
  Style: rounded-full, fontSize 9, fontWeight 700, letterSpacing 0.06em, padding 3px 10px
  Color: rgba(240,240,240,0.5) text, rgba(240,240,240,0.08) bg (muted, same as existing Completed pill style)
Row 3 (mt-3): Key info as dot-separated line
  "Feb 25, 2026  ·  PREG  ·  45 head  ·  Spring Calvers"
  Style: 12px, 500 weight, rgba(240,240,240,0.45)
Row 4 (mt-1): Location
  "Working Facility"
  Style: 11px, 500 weight, rgba(240,240,240,0.30)

── SECTION 2: REPORT BUILDER (toggle controls) ──

Section header: "Report Sections" — 14px, 700 weight, #0E2646

A vertical list of toggle switches that control which sections appear in the report below. Each row:
- flex items-center justify-between, py-2.5
- Left: label (14px, 500 weight, #1A1A1A)
- Right: toggle switch (use existing shadcn Switch component or a simple toggle)
  On state: bg #55BAAA, thumb white
  Off state: bg #D4D4D0, thumb white

Toggle rows:
1. "Summary" — ON by default, cannot be toggled off (switch disabled, always on, slightly dimmed)
2. "Metrics Breakdown" — ON by default
3. "Animal Detail List" — ON by default
4. "Reconciliation Results" — OFF by default (only relevant if reconciliation was done)
5. "Products Used" — ON by default

Thin divider below: border-t border-[#D4D4D0]/40

── SECTION 3: SUMMARY (always visible) ──

Section header: "Summary" — 12px, 700 weight, #0E2646, with thin divider above

Key-value display in two columns (grid grid-cols-2 gap-y-3 gap-x-4):
Each pair:
  Label: 11px, 600 weight, rgba(26,26,26,0.35), uppercase, letterSpacing 0.06em
  Value: 14px, 600 weight, #1A1A1A

Fields:
  - Date: Feb 25, 2026
  - Processing Type: Pregnancy Check
  - Group: Spring Calvers
  - Cattle Type: Cows
  - Location: Working Facility
  - Total Head: 45
  - Operator: bryntvedt1
  - Project ID: 25Feb2026-SpringCalvers-PREG

── SECTION 4: METRICS BREAKDOWN (toggleable) ──

Section header: "Metrics — Pregnancy Check" — 12px, 700 weight, #0E2646

This section adapts to the processing type, same as the close-out screen.

For PREGNANCY CHECK, show:

Row 1 — Big numbers grid (grid grid-cols-3 gap-2.5):
Each card: rounded-xl, bg white, border border-[#D4D4D0]/60, p-3, text-center
  Label: 9px uppercase, 600 weight, rgba(26,26,26,0.35)
  Value: 24px, 800 weight, #0E2646

  - "Total": 45
  - "Avg Weight": 1,166
  - "Avg Days": 127

Row 2 — Preg Stage breakdown (horizontal stacked bar + legend):

Stacked bar:
  Height 20px, rounded-full, overflow hidden, full width
  Segments proportional to count, left to right:
  - Bred: #55BAAA (32 = 71%)
  - Short: rgba(85,186,170,0.5) (3 = 7%)
  - Late: #F3D12A (2 = 4%)
  - Open: #E74C3C (8 = 18%)

Legend below (flex flex-wrap gap-x-4 gap-y-1, mt-2):
  Each: flex items-center gap-1.5
  - 8x8 rounded-full dot (matching color) + "Bred: 32 (71%)" — 12px, 500 weight, #1A1A1A

Row 3 — Calf Sex breakdown (simpler):
  "Bull: 18 · Heifer: 14 · Unknown: 13"
  Style: 13px, 500 weight, #1A1A1A, displayed as inline text with dot separator

── SECTION 5: PRODUCTS USED (toggleable) ──

Section header: "Products Used" — 12px, 700 weight, #0E2646

List of products as navy cards (same style as project-detail-screen Details tab):
Each card: bg #0E2646, rounded-xl, px-4 py-3
  Row 1: Product name (13px, 700 weight, #F0F0F0) + Route pill (teal, 9px uppercase)
  Row 2: "Dosage: 2 mL · Administered: 45 head · Total: 90 mL" — 11px, 500 weight, rgba(240,240,240,0.45)

Mock products:
  { name: "Bovi-Shield Gold 5", dosage: "2 mL", route: "IM", headCount: 45, total: "90 mL" }
  { name: "Ivermectin Pour-On", dosage: "1 mL / 22 lbs", route: "Topical", headCount: 45, total: "1.1 L" }
  { name: "Multimin 90", dosage: "1 mL / 100 lbs", route: "SQ", headCount: 38, total: "456 mL" }

── SECTION 6: ANIMAL DETAIL LIST (toggleable) ──

Section header: "Animal Records (45)" — 12px, 700 weight, #0E2646

Search bar at top (same as project list search — magnifying glass icon, 40px height, 16px font, placeholder "Search by tag…")

Below search: sortable column headers row:
  flex items-center, bg rgba(14,38,70,0.04), rounded-lg, px-3 py-2
  Columns: Tag (flex-1) · Weight · Preg · Notes (flex-1)
  Each header: 10px uppercase, 700 weight, rgba(26,26,26,0.35), letterSpacing 0.06em, cursor-pointer
  Active sort: #0E2646 color with small arrow indicator

Animal rows (space-y-1.5):
Each row: flex items-center, px-3 py-2.5, rounded-lg, bg white, border-b border-[#D4D4D0]/20
  - Tag: 14px, 700 weight, #0E2646, with flag icon if flagged (using existing FlagIcon component)
  - Weight: 13px, 400 weight, #1A1A1A, Geist Mono font
  - Preg: small pill — same preg stage pill styling
  - Notes: 12px, 400 weight, rgba(26,26,26,0.45), truncated

Mock first 5 animals:
  { tag: "4782", weight: "1,247", preg: "Bred", notes: "Normal", flag: "teal" }
  { tag: "3091", weight: "983", preg: "Open", notes: "Follow-up Thursday", flag: "gold" }
  { tag: "5520", weight: "1,102", preg: "Open", notes: "Chronic limp — cull candidate", flag: "red" }
  { tag: "2218", weight: "1,340", preg: "Bred", notes: "Normal", flag: "teal" }
  { tag: "8812", weight: "1,156", preg: "Bred", notes: "Normal", flag: "teal" }

Show these 5 then a "Load More (40 remaining)" link in teal, centered.

── SECTION 7: RECONCILIATION RESULTS (toggleable, off by default) ──

If toggled on, show a compact version of the reconciliation from close-out:
  Matched: 38, Missing: 5, Extra: 2
  Same three-bucket display but all collapsed by default (just counts visible)

── ACTION BUTTONS (bottom, pt-5) ──

Row of 2 buttons (flex gap-3):
- Left: "Export" — PillButton variant="outline", flex: 1
  On tap, shows a small dropdown above the button with options:
    "Excel (.xlsx)" / "CSV (.csv)" / "PDF"
  Dropdown style: same as existing ActionsDropdown pattern (rounded-xl, white bg, shadow, 170px min-width)

- Right: "Email Report" — PillButton primary (yellow), flex: 1
  On tap, shows a small dialog/overlay:
    Title: "Email Report" — 16px, 700 weight, #0E2646
    Input field: "Enter email addresses" — FormFieldRow style, placeholder "email@example.com"
    Below: "Separate multiple addresses with commas" — 11px, rgba(26,26,26,0.35)
    Buttons: "Cancel" (outline) + "Send" (primary yellow)

DESIGN RULES:
- Toggle switches control visibility of report sections in real-time — toggling off should hide the section with a smooth collapse
- All fonts Inter except weight values and Project ID (Geist Mono)
- The stacked bar chart for preg stage breakdown should be simple CSS (no charting library needed for the Figma mock)
- Animal list rows should feel dense but readable — this is a data table, not a card list
- Column headers should look sortable (cursor pointer, subtle hover state)
- Export dropdown and email dialog should be inline patterns, not full-screen modals
- Completed projects are read-only — no edit buttons anywhere on this screen
- The report builder toggles are cosmetic in the Figma mock — they just show/hide sections, no actual report generation