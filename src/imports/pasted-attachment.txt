Create an Inventory Close-Out screen. This appears when closing out an Inventory-type project from Cow Work. It reconciles which animals in the selected group were physically scanned versus the group's expected roster.
Use the standard app header: back arrow, title "Inventory Close-Out", subtitle "2026 Spring Calving - Feb 28, 2026".
Content area (20px padding, #F5F5F0 background):

SUMMARY CARD (top):
Gradient card: background linear-gradient(135deg, #0E2646 0%, #153566 100%), border-radius 16px, padding 20px.
Title row: "Inventory Results" Inter 17px font-weight 800 color white + checkmark-circle icon (20px, #55BAAA) on right.
Below title: "2026 Spring Calving" Inter 13px font-weight 500 color white at 50%.
Stats row (16px below): 4 stat blocks in a row, flex, equal width.
Each stat: value Inter 24px font-weight 800 + label Inter 10px font-weight 600 uppercase letter-spacing 0.06em.

"87" / "EXPECTED" / color white at 50%
"83" / "ACCOUNTED" / color #55BAAA
"4" / "MISSING" / color #E74C3C
"2" / "UNEXPECTED" / color #F3D12A

Progress bar below stats (12px gap): full width, 6px height, rounded-full, background white at 10%. Fill: left-to-right gradient #55BAAA, width 95.4% (83/87). Text below bar right-aligned: "95.4% accounted" Inter 11px font-weight 600 color white at 40%.

3 EXPANDABLE SECTIONS (below card, 16px gap):
Each section: white card, rounded-xl, border 1px #D4D4D0, overflow hidden. Section header is tappable to expand/collapse.
SECTION 1 — ACCOUNTED (83)
Header: padding 14px 16px, flex row between. Left: green circle (8px, #55BAAA) + "Accounted" Inter 14px font-weight 700 color #1A1A1A + count badge "83" (rounded-full, min-width 28px, height 20px, background #55BAAA at 10%, Inter 11px font-weight 700 color #55BAAA, centered). Right: expand chevron.
Collapsed by default — these animals are fine, no action needed.
When expanded: compact animal rows, divide-y #D4D4D0 at 30%. Each row: padding 10px 16px, flex row between. Left: tag Inter 13px font-weight 600 + tag color dot (6px) + breed Inter 12px color #1A1A1A at 35%. Right: green checkmark icon (16px, #55BAAA).
Show 4 sample rows when expanded:

"3309" pink dot / "Angus - Cow"
"4782" yellow dot / "Angus - Cow"
"5520" green dot / "Charolais - Cow"
"2218" orange dot / "Simmental - Cow"

"+ 79 more" link, Inter 12px font-weight 600 color #55BAAA.

SECTION 2 — MISSING (4)
Header: same layout. Red circle (8px, #E74C3C) + "Missing" Inter 14px font-weight 700 + count badge "4" (background #FFEBEE, color #C62828). Right: expand chevron.
Expanded by default — these need attention.
Each row: padding 14px 16px, border-bottom 1px #D4D4D0 at 30%.
Top line: tag + tag color dot + breed + type, same style as accounted rows but with a red X icon (16px, #E74C3C) instead of green check.
Below the animal info (8px gap): Action dropdown. Label "Resolution" Inter 11px font-weight 600 color #1A1A1A at 40%. Dropdown: full width, 36px height, rounded-lg, border 1px #D4D4D0, Inter 13px. Placeholder "Select action...".
Dropdown options: "Still Here (Missed Scan)", "Sold", "Died", "Moved to Another Group", "Flag for Follow-Up".
When an option is selected, the dropdown border changes color to match the resolution type:

Still Here: border #55BAAA, checkmark appears
Sold: border #1565C0
Died: border #C62828
Moved: border #E65100, secondary dropdown appears below: "Move to Group" with group name dropdown
Flag: border #F3D12A, flag icon appears

Show 4 missing animals:

"7201" white dot / "Red Angus - Cow - 2019" / dropdown set to "Sold"
"3340" yellow dot / "Angus - Cow - 2017" / dropdown set to "Died"
"6615" green dot / "Hereford - Heifer - 2023" / dropdown set to "Flag for Follow-Up"
"4410" pink dot / "Angus x Hereford - Cow - 2018" / dropdown showing placeholder "Select action..."

Unresolved count warning: if any missing animals have no action selected, show amber warning bar below the section: alert-triangle icon (14px, #E67E22) + "1 animal still unresolved" Inter 12px font-weight 600 color #E67E22. Background #FFF8E1, rounded-lg, padding 8px 12px.

SECTION 3 — UNEXPECTED (2)
Header: same layout. Yellow circle (8px, #F3D12A) + "Unexpected" Inter 14px font-weight 700 + count badge "2" (background #FFF8E1, color #B8860B). Right: expand chevron.
Expanded by default.
Same row structure as Missing but with a yellow question-mark icon (16px, #F3D12A) instead of the red X.
Action dropdown options for unexpected: "Add to Group", "Wrong Group (Ignore)", "Flag for Follow-Up".
When "Add to Group" is selected: border turns #55BAAA, shows confirmation text below "Will be added to 2026 Spring Calving" Inter 11px color #55BAAA.
Show 2 unexpected animals:

"8812" blue dot / "Brahman Cross - Cow - 2020" / "Currently in: North Pasture Pairs" Inter 11px color #1A1A1A at 30% below breed line / dropdown set to "Add to Group"
"9044" red dot / "Limousin - Heifer - 2023" / "Currently in: Replacement Heifers" / dropdown showing "Wrong Group (Ignore)"


ACTION BUTTONS (bottom, 24px below sections):
Two buttons, full width, stacked:

"Finalize Inventory" — 48px, rounded-full, background #F3D12A, Inter 15px font-weight 700 color #1A1A1A. Disabled state (opacity 50%, not tappable) if any missing animals are unresolved.
"Save Draft" — 40px, rounded-full, background white, border 1.5px #D4D4D0, Inter 13px font-weight 600 color #0E2646. Allows saving progress without resolving everything.

Below buttons: "Finalizing will update animal records and group membership." Inter 11px color #1A1A1A at 25%, centered.
Screen size: 375px wide. Missing and Unexpected sections expanded by default, Accounted collapsed.