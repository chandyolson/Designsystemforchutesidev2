Create a Red Book list screen. Red Book is the ranch journal — notes, observations, and action items. All entries use dark condensed cards. A 3-tier flag system indicates note importance: Info (teal), Action (yellow), Urgent (red). Notes without a flag are unflagged.
Use the standard app header: hamburger menu, title "Red Book", subtitle "Ranch Notes & Records".
Content area (20px padding, #F5F5F0 background):
ACTION ITEMS SUMMARY BAR (top):
Full-width card, rounded-xl, background linear-gradient(135deg, #0E2646 0%, #153566 100%), padding 14px 16px. Flex between.
Left side: flag icon (16px, #E74C3C) + "Open Actions" Inter 13px font-weight 700 color white. Right side: 2 count badges in a row, gap 8px.

Urgent count: "1" rounded-full, min-width 22px, height 22px, background #E74C3C, Inter 11px font-weight 700 color white.
Action count: "3" same shape, background #F3D12A, Inter 11px font-weight 700 color #1A1A1A.

Tapping the bar filters to action items only.
TOOLBAR (below bar, 12px gap): Right-aligned yellow + button (38x38, rounded-lg, #F3D12A).
FILTER CHIPS: horizontal row. "All" (selected, background #0E2646, color white), "Actions", "Info", "Urgent", "Maintenance", "Animal". Unselected: background white, border 1px #D4D4D0.
SEARCH BAR: placeholder "Search notes..."
NOTE CARDS: vertical stack, 10px gaps. ALL cards use dark gradient style regardless of flag status.
Each card: rounded-xl, background linear-gradient(135deg, #0E2646 0%, #153566 100%), padding 14px 16px, tappable. No border needed on dark cards.
Card layout:
Row 1: flex between. Left: title Inter 14px font-weight 600 color white. Right: flag icon (using the same FlagIcon component as animals, 18px) — teal for Info, yellow for Action, red for Urgent. If no flag, no icon shown.
Row 2 (4px below): note preview text, truncated to 2 lines max. Inter 12px font-weight 400 color white at 45%.
Row 3 (8px below): flex between. Left side: category text Inter 11px font-weight 600 color white at 25% + date Inter 11px font-weight 400 color white at 20%, separated by " · ". Right side (only on action items): status indicator + assignee.
Status indicators for action items:

Open: small open circle (10px, border 1.5px, color matches flag).
Complete: filled teal circle (10px, #55BAAA) with tiny checkmark.
Won't Do: filled gray circle (10px, #9E9E9E) with tiny dash.

Assignee (only if assigned to someone else): "→ Mike T." Inter 10px font-weight 600 color #55BAAA, after status indicator, 6px gap.
Show 8 cards:

FLAG: Urgent (red) — "Tag 3309 feet need trimming" / "Noticed limping in south pasture, left rear hoof looks overgrown. Need to get her in and trim before it gets worse." / Animal · Feb 27, 2026 / Open circle + → Me
FLAG: Action (yellow) — "Fence down section 3" / "Found 3 posts down on the north fence line near the creek crossing. Cattle could push through." / Maintenance · Feb 28, 2026 / Open circle + → Mike T.
FLAG: None — "Hay delivery confirmed" / "40 round bales arriving Thursday from Johnson's. Need to clear the south stack yard." / Expense · Feb 26, 2026
FLAG: Action (yellow) — "Order Draxxin restock" / "Down to 2 bottles, need at least 6 for spring processing. Check with Prairie Vet on pricing." / General · Feb 25, 2026 / Open circle + → Me
FLAG: Action (yellow) — "Water tank float broken — East Section" / "Tank overflowing, float valve stuck open. Shut off manual valve for now." / Maintenance · Feb 24, 2026 / Complete checkmark + → Mike T.
FLAG: Info (teal) — "Coyote activity near calving pasture" / "Spotted 3 coyotes along the tree line at dusk. May need to increase night checks." / General · Feb 23, 2026
FLAG: Action (yellow) — "Move salt blocks to south pasture" / "Current blocks nearly gone, need to relocate before we move pairs." / Maintenance · Feb 22, 2026 / Open circle + → Emily O.
FLAG: None — "Checked windmill pump" / "Running fine, greased bearings. Next service in 6 months." / Maintenance · Feb 20, 2026

Screen size: 375px wide.