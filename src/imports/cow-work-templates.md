FIGMA MAKE PROMPT — WORK TEMPLATE CRUD SCREENS
Routes: /cow-work/templates, /cow-work/templates/new, /cow-work/templates/{id}
================================================

CONTEXT:
Work templates let ranchers save preset configurations for common project types so they don't have to re-select the same processing type, cattle type, and field visibility every time they create a new project. Templates are accessed from the Cow Work tab or from the "Load from Template" section on the project creation form.

This is a simple CRUD flow: list templates → create/edit template → save.

═══════════════════════════════════
SCREEN A: TEMPLATE LIST
Route: /cow-work/templates
═══════════════════════════════════

HEADER:
- Title: "Work Templates"
- Subtitle: "Saved project configurations"
- showBack: true (returns to /cow-work)

ACCESS POINT:
Add a "Templates" icon button to the Cow Work screen toolbar (cow-work-screen.tsx), positioned to the left of the filter/sort dropdown. Use a simple document/template icon (16x16 SVG). Same 32x32 button style as the existing filter and actions buttons. Navigates to /cow-work/templates.

SCREEN LAYOUT:

── TOOLBAR ──
Right-aligned: "+ New Template" button
Style: same yellow "+" button pattern as the project list (width 38, height 38, bg #F3D12A, fontSize 22, rounded-lg)

── TEMPLATE CARDS ──

Vertical list (space-y-3):
Each template card: bg white, border border-[#D4D4D0], rounded-xl, px-4 py-3.5, cursor-pointer
Tap card → navigates to /cow-work/templates/{id} for editing

Card content:
Row 1: flex items-center justify-between
  Left: Template name — 15px, 600 weight, #1A1A1A
  Right: Processing type pill
    Style: rounded-full, fontSize 9, fontWeight 700, letterSpacing 0.06em, padding 3px 10px
    Color: white text, bg based on type:
      PREG → #55BAAA
      BSE → #0E2646
      PROCESS → #F3D12A (with dark text #1A1A1A)
      AI → #9B2335
      SALE → #E74C3C
      Other types → rgba(26,26,26,0.15) with #1A1A1A text

Row 2: Details line
  "Cattle Type: Cows · 4 visible fields"
  Style: 12px, 400 weight, rgba(26,26,26,0.45), mt-1

Row 3: Field tags (flex flex-wrap gap-1.5, mt-2):
  Show the visible fields as small pills:
  Each pill: rounded-full, bg rgba(14,38,70,0.06), fontSize 10, fontWeight 600, color #0E2646, padding 2px 8px
  Example pills: "Weight", "Preg Stage", "Days Gest", "Quick Notes"

Swipe/long-press context: For the Figma mock, add a small overflow menu (3 dots) at top-right of each card with options "Edit" and "Delete". Same dropdown pattern as existing ActionsDropdown.

Mock templates:
1. { name: "Spring Preg Check", type: "PREG", cattleType: "Cow", fields: ["Weight", "Preg Stage", "Days Gest", "Calf Sex", "Quick Notes"] }
2. { name: "Fall Processing", type: "PROCESS", cattleType: "Mixed", fields: ["Weight", "Data 1", "Data 2", "Quick Notes", "DNA / Sample"] }
3. { name: "Annual BSE", type: "BSE", cattleType: "Bull", fields: ["Weight", "BSE Result", "Scrotal Circ", "Motility %", "Morphology %"] }
4. { name: "Cull Sort", type: "SALE", cattleType: "Cow", fields: ["Weight", "Cull Reason", "Disposition"] }

── EMPTY STATE ──
If no templates exist:
  Centered, py-12
  Illustration: simple line-drawing placeholder (or just an icon)
  "No templates yet" — 15px, 600 weight, rgba(26,26,26,0.3)
  "Create a template to speed up project setup" — 13px, 400 weight, rgba(26,26,26,0.25)
  "Create Template" button — PillButton primary (yellow), centered, width auto (not full width)


═══════════════════════════════════
SCREEN B: CREATE / EDIT TEMPLATE
Route: /cow-work/templates/new OR /cow-work/templates/{id}
═══════════════════════════════════

HEADER:
- Title: "New Template" (or "Edit Template" if editing existing)
- Subtitle: "Configure project defaults"
- showBack: true

SCREEN LAYOUT (scrollable, space-y-5):

── SECTION 1: BASIC INFO ──

All fields use horizontal label-left / input-right (FormFieldRow / FormSelectRow):

1. Template Name (required *)
   - FormFieldRow, placeholder "e.g. Spring Preg Check"

2. Processing Type (required *)
   - FormSelectRow
   - Options: same list as project creation — "Pregnancy Check", "Breeding / Bull Turnout", "Cull / Sale", "Bull Testing (BSE)", "Movement", "Brucellosis Vaccination", "Processing", "Working", "Other"
   - IMPORTANT: When this value changes, the field visibility section below must update to show the correct fields for that processing type

3. Cattle Type
   - FormSelectRow
   - Options: "Cow", "Bull", "Replacement", "Calf", "Steer", "Mixed"

── SECTION 2: VISIBLE FIELDS ──

Section header: "Field Visibility" — 14px, 700 weight, #0E2646
Subtext: "Choose which fields appear on the work entry screen" — 12px, 400 weight, rgba(26,26,26,0.45)

A list of toggle rows. Each row:
  flex items-center justify-between, py-3
  Left side:
    Field name — 14px, 500 weight, #1A1A1A
    Below: short description — 11px, 400 weight, rgba(26,26,26,0.35)
  Right side: Toggle switch
    On: bg #55BAAA, thumb white
    Off: bg #D4D4D0, thumb white

COMMON FIELDS (always listed, regardless of processing type):
  1. Weight — "Animal weight in lbs" — default ON
  2. Quick Notes — "Predefined note shortcuts" — default ON
  3. DNA / Sample — "Sample ID or DNA number" — default OFF
  4. Memo — "Free-text notes field" — default ON
  5. Data 1 — "Custom flexible field" — default OFF
  6. Data 2 — "Custom flexible field" — default OFF

CONDITIONAL FIELDS (shown only when matching processing type is selected):

If "Pregnancy Check":
  7. Preg Stage — "Open, Bred, AI, etc." — default ON
  8. Days of Gestation — "Estimated days" — default ON
  9. Calf Sex — "Bull, Heifer, Unknown" — default ON

If "Breeding / Bull Turnout":
  7. Sire / Bull — "Bull tag or name" — default ON
  8. Breeding Date — "Date of breeding" — default ON
  9. Breeding Method — "Natural, AI, ET" — default ON

If "Cull / Sale":
  7. Cull Reason — "Why animal is culled" — default ON
  8. Disposition — "Sold, Kept, Dead, Shipped" — default ON
  9. Sale Weight — "Sale weight in lbs" — default OFF

If "Bull Testing (BSE)":
  7. BSE Result — "Pass, Fail, Defer" — default ON
  8. Scrotal Circumference — "Measurement in cm" — default ON
  9. Motility % — "Sperm motility percentage" — default ON
  10. Morphology % — "Sperm morphology percentage" — default ON

If any other type (Movement, Processing, Working, Other):
  No conditional fields — only common fields shown

Visual separator between common and conditional fields:
  Thin divider: border-t border-[#D4D4D0]/40, my-2
  Label above conditional fields: "PREGNANCY CHECK FIELDS" (matches the selected processing type)
  Style: 9px uppercase, 700 weight, letterSpacing 0.1em, rgba(26,26,26,0.35)

── ACTION BUTTONS (bottom, pt-4) ──

Row of 2 buttons (flex gap-3):
- Left: "Cancel" — PillButton variant="outline", flex: 1
  Navigates back to template list without saving
- Right: "Save Template" — PillButton primary (yellow), flex: 1
  Saves and navigates back to template list

If editing an existing template, add below the buttons:
"Delete Template" — centered text link, fontSize 13, fontWeight 600, color #E74C3C
Tap triggers the existing DeleteConfirmation dialog pattern:
  "Delete Template"
  "Are you sure you want to delete 'Spring Preg Check'? This cannot be undone."
  Buttons: "Cancel" + "Delete" (red)

DESIGN RULES:
- Toggle switches should feel chunky and tappable (44px tap target minimum)
- The field visibility section is the core of this screen — it must be clear which fields are on vs off
- When processing type changes, the conditional fields section should smoothly appear/disappear
- Template names should be unique — if a name matches an existing template, show error "Template name already exists"
- All inputs 16px, label width 105px, input height 40px — same as every other form screen
- Fonts: Inter everywhere
- The template list should feel lightweight compared to the project list — no gradients, no navy cards, just clean white cards with subtle borders