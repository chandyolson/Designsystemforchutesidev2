Create a Quick Notes management screen for the Reference section. Quick notes are pre-defined shorthand notes used during calving and cow work data entry. Each note can be mapped to a flag tier — when selected during data entry, it automatically applies that flag to the animal. Pill color matches the flag designation.Use the standard app header: back arrow, title "Quick Notes", subtitle "Reference - 17 Notes".Content area (20px padding, #F5F5F0 background):TOOLBAR: Right-aligned yellow + button (38x38, rounded-lg, #F3D12A).INFO CARD (below toolbar, 12px gap): Rounded-lg, background #E3F2FD, padding 12px 16px. Info icon (16px, #2196F3) + "Colored notes automatically flag animals when selected during data entry." Inter 12px color #0D47A1.NOTES LIST:16px gap below info card. White card, rounded-xl, border 1px #D4D4D0, padding 16px.Notes displayed as horizontal wrap of pill buttons, gap 8px both directions. Each pill: rounded-full, padding 6px 14px, Inter 13px font-weight 600, tappable. Pill has a small X button on right (10px, same color at 50%) for delete.Pill colors by flag mapping:

Cull flag: background #9B2335 at 12%, border 1px #9B2335 at 25%, color #9B2335
Production flag: background #F3D12A at 12%, border 1px #F3D12A at 30%, color #B8860B
Management flag: background #55BAAA at 12%, border 1px #55BAAA at 25%, color #55BAAA
No flag: background #F5F5F0, border 1px #D4D4D0, color #1A1A1A at 55%
Show all 17 notes as pills in this order:Cull-flagged (red pills):

"Cull"
Production-flagged (yellow pills):

"Bad Bag"
"Bad Feet"
"Lame"
"Lump Jaw"
"Bad Disposition"
"Bad Mother"
"Old"
"Poor Calf"
"Poor Condition"
Management-flagged (teal pills):

"Needs Tag"
"DNA"
"Needs Treated"
No flag (neutral pills):

"Sorted"
"Treated"
"Twin" — small label "(Calving)" Inter 9px font-weight 600 appended inside the pill after the note text, separated by a thin vertical divider
"Freemartin"
LEGEND (below notes, 16px gap):Section label "FLAG MAPPING" Inter 11px font-weight 700 letter-spacing 0.1em color #0E2646 at 35%.Horizontal row, gap 16px. Each legend item: FlagIcon (14px) + flag name Inter 11px font-weight 500 color #1A1A1A at 50%.

Red flag + "Cull"
Yellow flag + "Production"
Teal flag + "Management"
Gray dash + "No flag"
ADD NOTE FORM (below legend, 20px gap):Section label "ADD QUICK NOTE" Inter 11px font-weight 700 letter-spacing 0.1em color #0E2646 at 35%.White card, rounded-xl, border 1px #D4D4D0, padding 16px. Horizontal label-left layout, 105px label:
Note Text — text input, required, placeholder "e.g. Bad Eyes"
Available In — dropdown: All, Calving Only. Default "All".
Flag — 4 tappable options in a row (same style as Red Book flag selector). Each: circle (32px) containing either a FlagIcon or empty state.

"None" — circle border 1.5px #D4D4D0, empty
Management — teal FlagIcon, selected: background #55BAAA at 10%, border #55BAAA
Production — yellow FlagIcon, selected: background #F3D12A at 10%, border #F3D12A
Cull — red FlagIcon, selected: background #9B2335 at 10%, border #9B2335


Cancel/Save buttons.Screen size: 375px wide.