Update the Project Detail screen's Input tab to dynamically render data entry fields based on the field configuration set during project creation. Instead of hardcoded conditional field blocks per work type, the form renders only the fields the user selected, in the order they arranged them.
Use the existing Project Detail screen structure — gradient summary card at top, 4-tab bar (Input, Animals, Stats, Details). Only the Input tab content is changing. All other tabs remain the same.
INPUT TAB — revised layout:

ANIMAL LOOKUP (unchanged):
Tag / EID input with yellow accent border (46px height, border-2 #F3D12A), match status pill below when tag found, duplicate warning if already processed. Cow History Panel expands below matched animal. All of this stays exactly as-is.

DATA ENTRY FIELDS (new dynamic rendering):
Below the Cow History Panel, a thin divider: border-top 1px #D4D4D0 at 40%, padding-top 12px.
Sub-header: "PREGNANCY CHECK FIELDS" Inter 10px font-weight 700 letter-spacing 0.08em color #55BAAA. This label matches the work type and uses teal color to visually separate the locked/required fields from the optional ones.
Work-type-specific fields render first (locked fields from project config):
For this mock (Pregnancy Check), show 3 fields in horizontal label-left layout, 105px label:

Preg Stage — dropdown: Open, AI, Bred, Late, Short, Medium, Long. Pre-filled "Bred". Small lock icon (10px, #55BAAA at 30%) after the label text to indicate this is a locked project field.
Days of Gestation — number input, pre-filled "142", placeholder "days". Lock icon.
Fetal Sex — dropdown: Bull, Heifer, Twin - BB, Twin - HH, Twin - BH, Unknown. Pre-filled "Bull". Lock icon.

Second divider below locked fields: border-top 1px #D4D4D0 at 40%, padding-top 12px.
Sub-header: "PROJECT FIELDS" Inter 10px font-weight 700 letter-spacing 0.08em color #0E2646 at 35%.
Optional fields render next, in the order configured during project creation:
These are the "All" fields that were toggled ON and drag-ordered in the Configure Fields section of the New Project screen.
For this mock (5 optional fields enabled), show in order:

Weight — number input, pre-filled "1,247", placeholder "lbs"
Quick Notes — NOT a dropdown. Horizontal wrap of color-coded tappable pills (same implementation as the calving/cow work quick notes prompts). Pills use flag colors: "Cull" red, "Bad Bag" yellow, "Bad Feet" yellow, "Lame" yellow, etc. Multiple select allowed. When a flagged pill is selected, toast fires and animal flag updates.
Notes — textarea, 2 rows, placeholder "Notes…", inline mic button
DNA — text input, placeholder "Sample ID"
Tag Color — dropdown: Pink, Yellow, Green, Orange, Blue, White, Red, Purple

Fields that were toggled OFF during project creation do NOT appear at all. No Lot, no Sample, no Pen, no Data 1, no Data 2, no Traits in this mock — they weren't enabled.

QUICK NOTES PILLS (within the form):
The Quick Notes field renders as a label "Quick Notes" at 105px width, with the pills wrapping to the right and below.
Pill styling (same as calving prompt):

Cull flag: background #9B2335 at 12%, border 1px #9B2335 at 25%, color #9B2335
Production flag: background #F3D12A at 12%, border 1px #F3D12A at 30%, color #B8860B
Management flag: background #55BAAA at 12%, border 1px #55BAAA at 25%, color #55BAAA
No flag: background #F5F5F0, border 1px #D4D4D0, color #1A1A1A at 55%

Selected state: border width 2px, background opacity increases, small checkmark (10px) before text.
Show all 16 "All" type quick note pills (Twin excluded since this isn't calving):
"Cull", "Bad Bag", "Bad Feet", "Lame", "Lump Jaw", "Bad Disposition", "Bad Mother", "Old", "Poor Calf", "Poor Condition", "Needs Tag", "DNA", "Needs Treated", "Sorted", "Treated", "Freemartin"
In the mock, show "Lame" selected — toast visible at top: yellow accent bar + flag icon + "Production flag applied to Tag 4782".

ACTION BUTTONS (unchanged):
Two buttons side by side:

"Skip" — outline style, flex 1
"Save & Next" — yellow #F3D12A, flex 1

"Save & Done →" text link below, teal color.
Floating mic button in bottom-right corner.

FIELD RENDERING RULES (for developer reference):
The Input tab reads the project's field configuration (stored when the project was created) and renders fields dynamically:

Work-type locked fields render first under the work type sub-header
Optional "All" fields render next under "PROJECT FIELDS" sub-header, in the drag-ordered sequence
Fields toggled OFF are completely absent — no hidden fields, no disabled states
Quick Notes always renders as color-coded pills, never as a dropdown
Notes always renders as a textarea with mic button
All other fields use standard FormFieldRow or FormSelectRow components

If the work type has no locked fields (e.g. Inventory, Processing, Working), the work-type sub-header and divider are omitted — optional fields render directly below the Cow History Panel.

SECOND MOCK VARIANT — BSE Work Type:
To show the system works across work types, include a second variant or scrollable state showing a BSE project:
Work type sub-header: "BREEDING SOUNDNESS EXAM FIELDS"
Locked fields (6):

Scrotal — number input, placeholder "cm"
Pass/Fail — dropdown: Pass, Fail, Defer. Pre-filled "Pass", color #55BAAA when Pass, #E74C3C when Fail, #F3D12A when Defer.
Motility — number input, placeholder "%"
Morphology — number input, placeholder "%"
Semen Defects — text input, placeholder "Describe defects if any"
Physical Defects — text input, placeholder "Describe defects if any"

Optional fields (3 enabled for this project):

Weight — number input
Quick Notes — pills
Notes — textarea

Screen size: 375px wide. Primary mock shows Pregnancy Check with "Lame" quick note selected.