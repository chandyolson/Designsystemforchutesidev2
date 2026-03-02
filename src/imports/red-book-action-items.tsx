Update the existing Red Book Entry screen to support action items. Any note can be flagged as needing action via a toggle, which reveals additional fields inline.Use the standard app header: back arrow, title "New Entry", subtitle "Red Book", Save button top-right.Content area (20px padding, #F5F5F0 background):The existing note form stays the same at top:FORM FIELDS (horizontal label-left, 105px label):

Title — text input, placeholder "Brief title"
Category — dropdown: General, Animal, Maintenance, Expense, Weather, Other
Note — textarea, 4 rows minimum, placeholder "What happened...", inline mic button on right
ACTION REQUIRED TOGGLE (below the note field, 16px gap):Full-width row, flex between, padding 14px 0. Left: flag icon (18px, #1A1A1A at 30%) + "Action Required" Inter 14px font-weight 600 color #1A1A1A. Right: toggle switch (44x24, off state: background #D4D4D0, thumb white 20px circle).When toggled ON: switch background becomes #E74C3C. The flag icon turns #E74C3C. A section of action fields animates open below with a smooth expand (200ms ease).ACTION FIELDS (revealed when toggle is ON):White card, rounded-xl, border 1.5px #E74C3C at 20%, padding 16px, background white. Subtle red-tinted left border: 3px solid #E74C3C on the left edge of the card.Fields inside, horizontal label-left layout, 85px label (slightly narrower since these are secondary fields), 12px vertical gaps:
Priority — 4 tappable pill buttons in a row, only one selected at a time.

"Low" — unselected: background white, border 1px #D4D4D0, Inter 12px font-weight 500 color #1A1A1A at 50%. Selected: background #E3F2FD, border 1px #1565C0, color #1565C0, font-weight 700.
"Medium" — selected state: background #FFF8E1, border #B8860B, color #B8860B.
"High" — selected state: background #FFF3E0, border #E65100, color #E65100.
"Urgent" — selected state: background #FFEBEE, border #C62828, color #C62828.
Default to "Medium" when toggle is first turned on.



Assign To — dropdown, default "Me (John O.)" with your own avatar circle (20px, #0E2646, white initials "JO") inline in the dropdown display. Options: all team members from the operation (Me, Dr. James Miller, Sarah Chen, Mike Torres, Emily Olson).

Link To (optional section) — sub-label "LINK TO" Inter 10px font-weight 700 letter-spacing 0.08em color #0E2646 at 30%, 8px below Assign To.
Three tappable link chips in a horizontal row, gap 8px. Each chip: rounded-full, padding 6px 14px, background white, border 1px #D4D4D0, Inter 12px font-weight 500 color #1A1A1A at 50%. Icon (14px) + text.
Cow icon + "Animal"
Map-pin icon + "Location"
Folder icon + "Group / Project"
When a chip is tapped, it becomes selected (border #0E2646, font-weight 600, background #F5F5F0) and a search/select field appears below it:
Animal link: tag search input, placeholder "Search by tag or EID...", shows matched animal as a removable chip below (e.g. "Tag 3309 - Pink - Angus Cow" with X to remove).
Location link: dropdown of operation locations (North Pasture, South Pasture, Working Facility, etc.)
Group/Project link: dropdown with two option groups — "Groups" header (2026 Spring Calving, North Pasture Pairs, etc.) then "Projects" header (Spring Preg Check, Pre-Calving Processing, etc.)
Multiple links allowed — you can link to an animal AND a location AND a group.EXAMPLE: filled-out action note:Title: "Fence down section 3"
Category: Maintenance
Note: "Found 3 posts down on the north fence line near the creek crossing. Cattle could push through. Need to repair before moving pairs."
Action Required: ON
Priority: High (orange pill selected)
Assign To: Mike Torres
Linked to: Location "North Pasture" (chip shown below location dropdown)BOTTOM BUTTONS:"Save" — full width, 48px, rounded-full, #F3D12A, Inter 15px font-weight 700 color #1A1A1A.
"Delete Entry" — text link, centered, Inter 13px font-weight 500 color #E74C3C at 60%. Only shows when editing existing entry.Screen size: 375px wide.