Update the existing Red Book list screen to surface action items with visual priority indicators and filtering.
Use the standard app header: hamburger menu, title "Red Book", subtitle "Ranch Notes & Records".
Content area (20px padding, #F5F5F0 background):
TOOLBAR: yellow + button on right.
ACTION ITEMS SUMMARY BAR (new, above filters):
Full-width card, rounded-xl, background linear-gradient(135deg, #0E2646 0%, #153566 100%), padding 14px 16px. Flex between.
Left side: flag icon (16px, #E74C3C) + "Open Actions" Inter 13px font-weight 700 color white. Right side: 3 count badges in a row, gap 8px.

Urgent count: "1" rounded-full, min-width 22px, height 22px, background #E74C3C, Inter 11px font-weight 700 color white.
High count: "2" same shape, background #E65100.
Medium count: "3" same shape, background #B8860B.

Tapping the bar filters the list to action items only (same as selecting "Actions" filter chip).
FILTER CHIPS (below summary bar, 12px gap):
Horizontal row: "All" (selected), "Actions", "General", "Animal", "Maintenance", "Expense". Same chip styling as other screens. When "Actions" is selected: chip background #E74C3C, color white.
SEARCH BAR: placeholder "Search notes..."
NOTE LIST:
White card container, rounded-xl, border 1px #D4D4D0, divide-y #D4D4D0 at 40%.
Each row: padding 14px 16px, tappable.
Regular note row (no action): Left side: title Inter 14px font-weight 500 color #1A1A1A. Below: note preview truncated to 1 line, Inter 12px color #1A1A1A at 40%. Below that: category pill + date, Inter 11px. Right side: chevron.
Action note row (has action flag): Same structure but with visual additions:

Left edge: 3px solid border on left side of row, color matches priority (Low=#1565C0, Medium=#B8860B, High=#E65100, Urgent=#E74C3C).
After title: priority pill inline, right of title text. Pill uses same colors as entry form pills.
Below note preview: assigned-to text "→ Mike Torres" Inter 11px font-weight 600 color #55BAAA, only if assigned to someone other than self.
Status indicator on right: Open = small open circle (12px, border 2px, color matches priority). Complete = filled green circle with checkmark (#55BAAA). Won't Do = filled gray circle with X line (#9E9E9E).

Show 8 notes, mix of regular and action:

ACTION — "Fence down section 3" / "Found 3 posts down on the north fence line near the creek..." / Maintenance / High priority / → Mike Torres / Open / Feb 28, 2026
ACTION — "Tag 3309 feet need trimming" / "Noticed limping in south pasture, left rear hoof..." / Animal / Urgent priority / → Me / Open / Feb 27, 2026
REGULAR — "Hay delivery confirmed" / "40 round bales arriving Thursday from Johnson's..." / Expense / Feb 26, 2026
ACTION — "Order Draxxin restock" / "Down to 2 bottles, need at least 6 for spring processing..." / General / Medium priority / → Me / Open / Feb 25, 2026
ACTION — "Water tank float broken — East Section" / "Tank overflowing, float valve stuck open..." / Maintenance / Medium priority / → Mike Torres / Complete / Feb 24, 2026
REGULAR — "Coyote activity near calving pasture" / "Spotted 3 coyotes along the tree line at dusk..." / General / Feb 23, 2026
ACTION — "Move salt blocks to south pasture" / "Current blocks nearly gone, need to relocate before..." / Maintenance / Low priority / → Emily Olson / Open / Feb 22, 2026
ACTION — "Check on Tag 7801 — calving soon" / "Bagged up heavy, probably within 48 hours..." / Animal / Medium priority / → Me / Won't Do / Feb 21, 2026

Screen size: 375px wide.