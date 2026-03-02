FIGMA MAKE PROMPT — NEW PROJECT CREATION SCREEN
Route: /cow-work/new
================================================

CONTEXT:
This is the "New Project" form in the ChuteSide cattle management app. The user taps the yellow "+" button on the Cow Work project list screen and lands here. This form creates a new work project (like a pregnancy check day or BSE testing session) that animals will be processed through.

This screen must match the existing design system exactly. Reference components already in the file:
- FormFieldRow (label-left/input-right, label width 105px, input height 40px, 16px font)
- FormSelectRow (same layout, native select with custom chevron)
- CollapsibleSection (expandable panel with title + chevron)
- PillButton (primary yellow #F3D12A, outline variant)
- All fonts: Inter. All cards: bg #0E2646 with #F0F0F0 text.

HEADER:
The app-layout header should show:
- Title: "New Project"
- Subtitle: "Create a new work project"
- showBack: true (back arrow returns to /cow-work)

SCREEN LAYOUT (top to bottom, all inside a scrollable container with space-y-5):

── SECTION 1: PROJECT DETAILS ──

All fields use the horizontal label-left / input-right pattern (FormFieldRow or FormSelectRow).
Label width: 105px. Input height: 40px. Font: 16px. Gap: 12px (gap-3).

Fields in order:

1. Date (required *)
   - Type: date picker input
   - Default: today's date
   - Use type="date" with the standard FormFieldRow pattern

2. Processing Type (required *)
   - Type: dropdown (FormSelectRow)
   - Options: "Pregnancy Check", "Breeding / Bull Turnout", "Cull / Sale", "Bull Testing (BSE)", "Movement", "Brucellosis Vaccination", "Processing", "Working", "Other"
   - Placeholder: "Select type…"

3. Group (required *)
   - Type: dropdown (FormSelectRow)
   - Options (mock): "Spring Calvers", "Fall Calvers", "Heifers — 1st Calf", "Bulls", "Replacement Heifers", "2026 Cows", "Old Cows"
   - Placeholder: "Select group…"

4. Cattle Type
   - Type: dropdown (FormSelectRow)
   - Options: "Cow", "Bull", "Replacement", "Calf", "Steer", "Mixed"
   - Placeholder: "Select…"

5. Location
   - Type: dropdown (FormSelectRow)
   - Options (mock): "Working Facility", "North Pasture", "South Pasture", "Hoffman's", "Oelrichs", "Home Place"
   - Placeholder: "Select location…"

6. Memo
   - Type: textarea (NOT FormFieldRow — use the same label-left layout but with a textarea instead of input)
   - Placeholder: "Notes about this project…"
   - Height: 80px (3 rows)
   - Same border/focus styling as inputs: border-[#D4D4D0], focus:border-[#F3D12A], focus:ring-2 focus:ring-[#F3D12A]/25

── SECTION 2: PRODUCTS GIVEN (CollapsibleSection) ──

Use the existing CollapsibleSection component.
Title: "Products Given (0)" — the count updates as products are added.
Default state: collapsed.

When expanded, show:

- An "+ Add Product" button at the top of the section
  Style: text button, fontSize 13, fontWeight 600, color #55BAAA, with a small "+" prefix
  
- Each added product appears as a row inside a navy card (bg #0E2646, rounded-xl, px-4 py-3):
  Row 1: Product name (left, #F0F0F0, 13px, bold) + Route pill (right, teal bg rgba(85,186,170,0.15), color #55BAAA, 9px uppercase)
  Row 2: Dosage text (11px, rgba(240,240,240,0.45))
  Row 3: Small red "Remove" text button at bottom-right (12px, #E74C3C)

- The "+ Add Product" button opens an inline form within the section (not a modal):
  - Product Name: searchable text input with placeholder "Search products…"
  - Dosage: text input, placeholder "e.g. 2 mL"
  - Route: dropdown with options "IM", "SQ", "IV", "Topical", "Oral", "Intravaginal", "Pour-On"
  - "Add" pill button (small, primary) and "Cancel" text button
  - These three fields should stack vertically (not horizontal label-left) since they're inside the collapsible

Mock data: Pre-add 2 products for the visual:
  { name: "Bovi-Shield Gold 5", dosage: "2 mL", route: "IM" }
  { name: "Ivermectin Pour-On", dosage: "1 mL / 22 lbs", route: "Topical" }

── SECTION 3: TEMPLATE PICKER (CollapsibleSection) ──

Title: "Load from Template"
Default state: collapsed.

When expanded, show a vertical list of template cards. Each card:
- bg white, border border-[#D4D4D0], rounded-xl, px-4 py-3, cursor-pointer
- Row 1: Template name (14px, 600 weight, #1A1A1A) + Processing type pill (right, same style as project list)
- Row 2: "Cattle Type: Cows · 3 fields configured" (12px, rgba(26,26,26,0.45))
- Tap a template card to auto-fill the form fields above. Show a brief teal flash/highlight on the card when tapped.

Mock templates:
  { name: "Spring Preg Check", type: "PREG", cattleType: "Cow", fields: 4 }
  { name: "Fall Processing", type: "PROCESS", cattleType: "Mixed", fields: 6 }
  { name: "Bull BSE", type: "BSE", cattleType: "Bull", fields: 5 }

── PROJECT RECORD ID (read-only, below sections) ──

After all sections, show a small read-only display:
- Label: "Project ID" (10px uppercase, 700 weight, letterSpacing 0.08em, color rgba(26,26,26,0.35))
- Value: auto-generated pattern "{date}-{group abbreviation}-{type abbreviation}"
- Example: "02Mar2026-SpringCalvers-PREG"
- Style: 13px, Geist Mono font, color #0E2646, bg rgba(14,38,70,0.04), rounded-lg, px-3 py-2

── ACTION BUTTONS (fixed at bottom or at end of scroll) ──

Two buttons side by side (flex gap-3):
- Left: "Save" — PillButton variant="outline", flex: 1
  Saves project and returns to /cow-work list
- Right: "Save & Work Cows" — PillButton primary (yellow), flex: 1
  Saves project and navigates to /cow-work/{projectId} (the project detail/workspace screen)

Below the buttons: "Cancel" text link, centered, fontSize 13, fontWeight 600, color rgba(26,26,26,0.35), navigates back to /cow-work

STATES TO SHOW:
1. Empty form (default state on load — date pre-filled, everything else blank)
2. Validation errors: if user taps Save without filling required fields, show red error text below Date, Processing Type, and Group fields using the existing FormFieldRow error prop
3. Template loaded state: form fields populated from template selection, template card highlighted in teal

DESIGN RULES:
- All inputs MUST be 16px font (prevents iOS auto-zoom)
- Label width exactly 105px on all FormFieldRow/FormSelectRow instances
- Input height 40px
- Rounded corners: inputs rounded-lg, cards rounded-xl, sections rounded-xl
- Focus state: yellow border (#F3D12A) with yellow ring
- Error state: red border (#E74C3C) with red ring
- Font: Inter everywhere except Project ID value (Geist Mono)
- No emojis, no icons in labels, no decorative elements
- Background: white (#FFFFFF) page background, consistent with all other screens