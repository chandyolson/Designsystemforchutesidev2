Create a Red Book entry screen for creating and editing notes. Uses the 3-tier flag system (Info teal, Action yellow, Urgent red) instead of priority pills. Action toggle reveals additional fields inline.
Use the standard app header: back arrow, title "New Entry", subtitle "Red Book", Save button top-right.
Content area (20px padding, #F5F5F0 background):
PREVIEW CARD (top, live preview of the note being written):
Dark gradient card matching the list view: rounded-xl, background linear-gradient(135deg, #0E2646 0%, #153566 100%), padding 14px 16px.
Shows live preview of: title (Inter 14px font-weight 600 color white, placeholder "Untitled" at white 20% if empty), note preview truncated to 2 lines (Inter 12px color white at 45%, placeholder "Start writing..." at white 15%), category + today's date (Inter 11px color white at 25%). Flag icon on top-right if a flag is selected.
This preview updates as the user types in the form below.
FLAG SELECTOR (below preview, 16px gap):
Label: "Flag" Inter 11px font-weight 600 color #1A1A1A at 40%.
Row of 4 tappable options, gap 10px:

"None" — circle (32px, border 1.5px #D4D4D0, empty center). When selected: border #0E2646, tiny dot in center.
Info flag — teal FlagIcon (24px) inside a circle (32px, border 1.5px #D4D4D0). When selected: background #55BAAA at 10%, border #55BAAA. Label below: "Info" Inter 10px color #55BAAA.
Action flag — yellow FlagIcon inside same circle. Selected: background #F3D12A at 10%, border #F3D12A. Label: "Action" Inter 10px color #B8860B.
Urgent flag — red FlagIcon inside same circle. Selected: background #E74C3C at 10%, border #E74C3C. Label: "Urgent" Inter 10px color #E74C3C.

Show "Action" as selected in the mock.
FORM FIELDS (below flag selector, 16px gap):
Horizontal label-left layout, 105px label:

Title — text input, pre-filled "Fence down section 3"
Category — dropdown: General, Animal, Maintenance, Expense, Weather, Other. Set to "Maintenance".
Note — textarea, 4 rows minimum, pre-filled "Found 3 posts down on the north fence line near the creek crossing. Cattle could push through. Need to repair before moving pairs." Inline mic button (floating-mic style, 32px, #0E2646, mic icon white) positioned at bottom-right of textarea.

ACTION REQUIRED TOGGLE (below note, 16px gap):
Full-width row, flex between, padding 14px 0. Left: flag icon (18px, #1A1A1A at 30%) + "Action Required" Inter 14px font-weight 600 color #1A1A1A. Right: toggle switch (44x24). Toggle shown ON with switch background #E74C3C, flag icon turns #E74C3C.
Note below toggle: "Adds this to your action items on the Dashboard" Inter 11px color #1A1A1A at 25%.
ACTION FIELDS (revealed, toggle is ON):
White card, rounded-xl, border 1.5px #E74C3C at 20%, padding 16px. Left edge accent: 3px solid #E74C3C.
Fields inside, horizontal label-left, 85px label:

Assign To — dropdown showing "Mike Torres" selected. Small avatar circle (20px, #0E2646, white initials) inline. Options: Me (John O.), Dr. James Miller, Sarah Chen, Mike Torres, Emily Olson.
Status — 3 tappable pills in a row. "Open" (selected: background #FFF3E0, border #E65100, Inter 12px font-weight 700 color #E65100), "Complete" (unselected: background white, border #D4D4D0, color #1A1A1A at 50%), "Won't Do" (same unselected style). Only shows when editing existing action items, not on new entries.
Link To — sub-label "LINK TO" Inter 10px font-weight 700 letter-spacing 0.08em color #0E2646 at 30%.

Three tappable link chips, horizontal row, gap 8px. Each: rounded-full, padding 6px 14px, background white, border 1px #D4D4D0, Inter 12px font-weight 500 color #1A1A1A at 50%. Icon (14px) + text.

Cow icon + "Animal"
Map-pin icon + "Location" (selected state: border #0E2646, font-weight 600, background #F5F5F0)
Folder icon + "Group / Project"

Location is selected, showing a dropdown below it with "North Pasture" chosen. Selected link shows as a removable chip: rounded-full, background #0E2646, padding 4px 12px, Inter 11px font-weight 600 color white, X dismiss button on right.
Multiple links allowed — you can link to an animal AND a location AND a group.
BOTTOM BUTTONS (24px gap):
"Save" — full width, 48px, rounded-full, #F3D12A, Inter 15px font-weight 700 color #1A1A1A.
"Delete Entry" — text link, centered, Inter 13px font-weight 500 color #E74C3C at 60%. Only on existing entries.
Screen size: 375px wide. Show with "Action" flag selected, toggle ON, form filled out as the fence example.