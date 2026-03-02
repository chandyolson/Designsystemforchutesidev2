FIGMA MAKE PROMPT — CONDITIONAL FIELDS ON PROJECT INPUT TAB
Modifies: project-detail-screen.tsx → "Input" tab content
================================================

CONTEXT:
The Project Detail screen already exists with 4 tabs (Input, Animals, Stats, Details). The Input tab currently shows generic fields: Tag Scan, Weight, Data 1, Data 2, Notes. This prompt replaces that Input tab content with the full chuteside work entry layout that changes dynamically based on the project's Processing Type.

The project's processing type is set at creation. When the user opens a project and lands on the Input tab, the fields shown should match the work type. This is the screen where a rancher stands at the chute and processes animals one at a time.

UPDATED INPUT TAB LAYOUT (top to bottom):

── ANIMAL LOOKUP SECTION ──

Tag Scan field (KEEP existing — yellow border-2, prominent):
- Label: "Tag / EID", width 105px
- Input: h-[46px], border-2 border-[#F3D12A], fontSize 16, fontWeight 600
- Placeholder: "Scan or enter tag…"
- This field gets focus on screen load and after each Save & Next

Below the Tag Scan, add a small inline status area:
- When empty: nothing shown
- When a tag is entered that matches an existing animal: show a small teal pill
  "✓ 4782 — Pink — Cow — 2020" (the matched animal's tag, color, type, year)
  Style: rounded-full, bg rgba(85,186,170,0.08), border 1.5px rgba(85,186,170,0.25), 
  fontSize 12, fontWeight 600, color #55BAAA, padding 5px 14px
- When a tag is entered that matches an animal ALREADY IN THIS PROJECT: show a yellow warning banner
  "⚠ This animal already has a record in this project"
  Style: rounded-lg, bg rgba(243,209,42,0.1), border 1px rgba(243,209,42,0.4),
  fontSize 12, fontWeight 600, color #8B7A00, padding 8px 12px, full width
  Below the banner: "View existing record →" link in teal, fontSize 12

── COW HISTORY PANEL (new component — appears when existing animal is loaded) ──

This panel appears between the Animal Lookup section and the data entry fields ONLY when an existing animal is matched by the tag scan. It is collapsed by default and shows a compact summary. When no animal is matched, this panel is hidden entirely.

Panel container: rounded-xl, bg #0E2646, overflow hidden

Panel header (always visible when panel exists):
- Left: Animal tag + flag icon + tag color dot (e.g. "4782" + teal flag + pink dot)
- Right: Expand/collapse chevron
- Style: px-4 py-3, flex items-center justify-between
- Tag: 15px, 700 weight, #F0F0F0
- Below tag: "Cow · 2020 · EID: 982 000364507221" — 11px, rgba(240,240,240,0.45)

Panel content (when expanded) — THREE SUB-TABS inside the navy panel:
Tab bar: flex inside the navy card, tabs are "Info", "Calving", "History"
Active tab: 700 weight, #F0F0F0, with yellow underline indicator (same pattern as main tabs)
Inactive tab: 500 weight, rgba(240,240,240,0.35)

Info sub-tab content:
- Simple key-value pairs in two columns (grid grid-cols-2 gap-2)
- Each pair: label (9px uppercase, 700 weight, rgba(240,240,240,0.25)) + value (13px, 500 weight, #F0F0F0)
- Fields: Type, Breed, Year Born, Tag Color, Group, Flag Status, EID, Other ID

Calving sub-tab content:
- List of past calving records as mini-cards inside the navy panel
- Each: bg rgba(240,240,240,0.04), rounded-lg, px-3 py-2.5
- Calf tag + sex pill, date, birth weight + assistance pills
- Max 3 shown, "View all →" link if more exist

History sub-tab content:
- List of past project work records as mini-cards (same styling)
- Each: project name (bold), date, weight + preg pills, treatments as small teal chips
- Max 3 shown, "View all →" link if more exist

── COMMON FIELDS (always visible regardless of processing type) ──

All use FormFieldRow (horizontal label-left/input-right, 105px label, 40px height):

1. Weight — type="number", placeholder "lbs"
2. Quick Notes — FormSelectRow, multi-value capable
   Options (mock): "Normal", "Free Martin", "Twin", "Cull - no milk", "White face", "Follow-up"
3. DNA / Sample — placeholder "Sample ID"
4. Memo — textarea variant, placeholder "Notes…", height 64px (2 rows)

── PROCESSING-TYPE CONDITIONAL FIELDS ──

These fields appear BETWEEN the common fields and the action buttons. Which set appears depends on the project's processingType value. Use a section header above them:

Section header: 
  Small uppercase text: "PREGNANCY CHECK" (or whatever the type is)
  Style: fontSize 9, fontWeight 700, letterSpacing 0.1em, color rgba(26,26,26,0.35), marginBottom 8px
  With a thin divider line above: border-t border-[#D4D4D0]/40, paddingTop 12px

FIELD SETS BY TYPE:

──── If processingType === "Pregnancy Check" ────
1. Preg Stage (required *) — FormSelectRow
   Options: "Open", "AI", "Bred", "Late", "Short", "Medium", "Long"
2. Days Gest — FormFieldRow, type="number", placeholder "days"
3. Calf Sex — FormSelectRow
   Options: "Bull", "Heifer", "Twin - BB", "Twin - HH", "Twin - BH", "Unknown"

──── If processingType === "Breeding / Bull Turnout" ────
1. Sire / Bull — FormFieldRow, placeholder "Bull tag or name"
   (This should eventually be an animal lookup filtered to bulls, but for now a text input)
2. Breeding Date — FormFieldRow, type="date"
3. Breeding Method — FormSelectRow
   Options: "Natural", "AI", "ET"

──── If processingType === "Cull / Sale" ────
1. Cull Reason — FormFieldRow, placeholder "e.g. Open, Lame, Age"
2. Disposition — FormSelectRow
   Options: "Sold", "Kept", "Dead", "Shipped"
3. Sale Weight — FormFieldRow, type="number", placeholder "lbs"

──── If processingType === "Bull Testing (BSE)" ────
1. BSE Result — FormSelectRow
   Options: "Pass", "Fail", "Defer"
   Color the selected value: Pass = #55BAAA, Fail = #E74C3C, Defer = #F3D12A
2. Scrotal Circ — FormFieldRow, type="number", placeholder "cm"
3. Motility % — FormFieldRow, type="number", placeholder "%"
4. Morphology % — FormFieldRow, type="number", placeholder "%"

──── If processingType === "Movement" / "Brucellosis Vaccination" / "Processing" / "Working" / "Other" ────
Show only the common fields (no extra conditional section). Instead show:
1. Data 1 — FormFieldRow, placeholder "Custom field"
2. Data 2 — FormFieldRow, placeholder "Custom field"

── ACTION BUTTONS (fixed bottom area) ──

Row of 2 buttons (flex gap-3):
- Left: "Skip" — PillButton variant="outline", flex: 1
  Clears form, moves to next (same as Save & Next but doesn't save this animal)
- Right: "Save & Next" — PillButton primary (yellow), flex: 1
  Saves the animal record, clears the form, returns cursor to Tag / EID scan field
  Haptic feedback: navigator.vibrate(50) on tap

Below the row: centered text "Save & Done →" 
Style: fontSize 13, fontWeight 600, color #55BAAA
Saves current animal and navigates back to project list

── FLOATING MIC BUTTON ──

Position: fixed, bottom-right, 16px from right edge, 80px from bottom (above the action buttons)
Use the existing FloatingMicButton component from the codebase.
This is the Level 2 voice button — tap to speak a full animal record, AI parses it.

MOCK DATA FOR DEFAULT VIEW:
Show this screen in "Pregnancy Check" mode with one animal loaded:
- Tag: "4782", matched to existing animal
- Cow History Panel: expanded, showing Info sub-tab
- Weight: "1,247"
- Preg Stage: "Bred"
- Days Gest: "142"
- Calf Sex: "Bull"

DESIGN RULES:
- All inputs 16px font (prevents iOS auto-zoom)
- Label width 105px on all horizontal form rows
- Input height 40px
- The Cow History Panel uses NAVY THEME inside (#0E2646 bg, #F0F0F0 text)
- Conditional fields section header uses the ALL CAPS thin style
- Processing type name in the section header must match exactly what was selected at project creation
- The matched animal pill and duplicate warning are mutually exclusive — only one shows at a time
- When form is cleared after Save & Next, the Cow History Panel also disappears until a new animal is scanned