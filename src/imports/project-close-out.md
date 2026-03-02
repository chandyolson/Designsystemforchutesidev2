FIGMA MAKE PROMPT — PROJECT CLOSE-OUT & RECONCILIATION SCREEN
Route: /cow-work/{projectId}/close-out
================================================

CONTEXT:
When the user taps "Complete Project" on the Project Detail screen, they navigate here. This screen lets them review the project summary, optionally reconcile animals against a source list, and lock the project. Once locked, no new animals can be added (but existing records can still be edited).

This is NOT a modal or dialog — it's a full screen that follows the same app-layout pattern with header, scrollable content, and action buttons.

HEADER:
- Title: "Close Out Project"
- Subtitle: "Spring Preg Check" (the project name)
- showBack: true (returns to the project detail screen without closing)

SCREEN LAYOUT (top to bottom, scrollable, space-y-5):

── SECTION 1: PROJECT SUMMARY CARD ──

Gradient card (same style as the existing "Total Animals Worked" card on project-detail-screen):
- background: linear-gradient(145deg, #0E2646 0%, #163A5E 55%, #55BAAA 100%)
- rounded-2xl, px-5 py-5

Content inside the gradient card:
Row 1: "PROJECT SUMMARY" — 10px uppercase, 600 weight, letterSpacing 0.08em, rgba(255,255,255,0.35)
Row 2: Project name — "Spring Preg Check" — 24px, 800 weight, white, letterSpacing -0.02em
Row 3: Status pill — "IN PROGRESS" — same pill style as project list cards (white text, #9B2335 bg)
Row 4 (mt-4): Key-value grid, 2 columns (grid grid-cols-2 gap-3):
  Each item: label (9px uppercase, 600 weight, rgba(255,255,255,0.25)) + value (16px, 700 weight, white)
  - Date: "Feb 25, 2026"
  - Head Count: "45"
  - Processing Type: "PREG"
  - Cattle Type: "Cows"
  - Location: "Working Facility"
  - Group: "Spring Calvers"

── SECTION 2: QUICK METRICS ──

Section header: "Metrics" — 14px, 700 weight, #0E2646

Metrics grid (grid grid-cols-2 gap-3):
Each metric card: rounded-xl, bg white, border border-[#D4D4D0]/60, p-3.5
- Label: 10px uppercase, 600 weight, rgba(26,26,26,0.35), letterSpacing 0.06em
- Value: 28px, 800 weight, #0E2646

For a PREGNANCY CHECK project, show these metrics:
  - "Total Worked": 45
  - "Avg Weight": 1,166
  - "Open": 8 (with subtle red tint — value color #E74C3C)
  - "Bred": 32 (with subtle teal tint — value color #55BAAA)
  - "Short": 3
  - "Late": 2
  - "Avg Days Gest": 127

For the Figma mock, show the Pregnancy Check version since that's the most common use case.

── SECTION 3: RECONCILIATION (CollapsibleSection) ──

Use the existing CollapsibleSection component.
Title: "Reconcile Animals"
Default state: COLLAPSED.
Collapsed hint text below title: "Compare processed animals against a group or list"
Style: fontSize 12, fontWeight 400, color rgba(26,26,26,0.35), marginTop 2px

When expanded:

Step 1 — Source Picker:
Label above: "Compare against:" — 12px, 600 weight, #1A1A1A
Three option cards side by side (flex gap-2.5):
  Each card: rounded-xl, bg white, border border-[#D4D4D0], px-3 py-3, text-center, cursor-pointer
  - Icon area: 28x28 rounded-full bg with centered icon (use simple SVG or emoji placeholder)
  - Label: 12px, 600 weight, #1A1A1A
  Options:
    1. "Group" — icon: grid/people icon, bg rgba(85,186,170,0.1)
    2. "CSV Upload" — icon: document icon, bg rgba(243,209,42,0.1)  
    3. "Past Project" — icon: clock/history icon, bg rgba(14,38,70,0.1)
  Selected card: border-2 border-[#55BAAA], bg rgba(85,186,170,0.04)

Step 1b — Source detail (appears after selecting a source type):
  If "Group": FormSelectRow — options: "Spring Calvers", "Fall Calvers", "Heifers — 1st Calf", etc.
  If "CSV Upload": file upload area — dashed border, "Drop CSV or tap to upload", teal text
  If "Past Project": FormSelectRow — options: list of completed projects
  
  Below source selection: "Run Reconciliation" button
  Style: PillButton variant="outline", full width, with a small spinner icon when processing

Step 2 — Results (appears after reconciliation runs):

Three result buckets displayed as expandable sections:

BUCKET 1: MATCHED
- Header: green indicator dot + "Matched (38)" — 14px, 600 weight, #55BAAA
- Collapsed by default (just shows the count)
- Expanded: list of animal tags as small pills
  Each pill: rounded-full, bg rgba(85,186,170,0.08), fontSize 11, fontWeight 600, color #55BAAA, padding 3px 10px
  Wrap in flex flex-wrap gap-1.5

BUCKET 2: MISSING FROM PROJECT
- Header: yellow indicator dot + "Missing (5)" — 14px, 600 weight, #D4A800
- Expanded by default (these need attention)
- Each missing animal as a row card:
  bg rgba(243,209,42,0.04), border border-[#F3D12A]/20, rounded-lg, px-3 py-2.5
  Left: Tag + color + type (e.g. "3309 · Pink · Cow")
  Right: Two action buttons:
    "Add" — small teal text button (12px, 600 weight, #55BAAA)
    "Skip" — small gray text button (12px, 600 weight, rgba(26,26,26,0.35))
  
  Mock missing animals:
    { tag: "1847", color: "Yellow", type: "Cow" }
    { tag: "6203", color: "Red", type: "Cow" }
    { tag: "4415", color: "Green", type: "Cow" }
    { tag: "7789", color: "White", type: "Cow" }
    { tag: "2950", color: "Pink", type: "Cow" }

BUCKET 3: EXTRA (not in source)
- Header: red indicator dot + "Extra (2)" — 14px, 600 weight, #E74C3C
- Collapsed by default
- Expanded: same pill layout as Matched but with red styling
  Each pill: rounded-full, bg rgba(231,76,60,0.08), fontSize 11, fontWeight 600, color #E74C3C
  
  Mock extra animals:
    { tag: "9102" }
    { tag: "8841" }

Indicator dots: 8x8 rounded-full circles, inline before the header text

── SECTION 4: CONFIRM CLOSE-OUT ──

Warning banner (full width):
- bg rgba(243,209,42,0.06), border border-[#F3D12A]/30, rounded-xl, px-4 py-3
- Icon: ⚠ or warning triangle SVG, 16x16, color #8B7A00
- Text: "Closing this project will prevent adding new animals. Existing records can still be edited."
- Style: fontSize 13, fontWeight 500, color #8B7A00, lineHeight 1.4

Action buttons (flex gap-3, pt-4):
- Left: "Back to Project" — PillButton variant="outline", flex: 1
  Navigates back to the project detail screen
- Right: "Close Project" — PillButton but with CUSTOM STYLING:
  bg #9B2335 (the "In Progress" red, repurposed as a serious action color)
  color white
  fontSize 13, fontWeight 700
  flex: 1
  active:scale-[0.98] transition

DESIGN RULES:
- Reconciliation is entirely optional — the user can skip it and go straight to Close Project
- The three result buckets should have clear visual hierarchy: Missing is the most important (expanded by default, yellow/attention color)
- All fonts Inter, all inputs 16px, all cards rounded-xl
- The gradient summary card should be identical in style to the existing one in project-detail-screen.tsx
- The metrics grid should be identical in style to the existing one in the Stats tab
- Source picker cards should be equal width (flex-1) and feel tappable
- Reconciliation results load with a brief skeleton/spinner, then snap into view