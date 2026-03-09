Redesign the Animal Record screen (animal-detail-screen.tsx). This screen shows a single cow's full record with two tabs: Details and History. The screen is a complete layout change — not a styling tweak.

Use the standard app header: back arrow, title "Tag 3309", subtitle "Pink · Cow · 2020".
Content area: 20px horizontal padding, #F5F5F0 background.

GRADIENT HEADER CARD (top of content area, always visible):
Background linear-gradient(145deg, #0E2646 0%, #163A5E 55%, #55BAAA 100%), border-radius 16px, padding 20px. This card is read-only — no edit controls inside it.

Left column (flex-1, min-width 0):
Tag number "3309" — Inter 36px font-weight 800 color white letter-spacing -0.02em, line-height 1.
Tag color row below (4px gap): 8×8px circle filled #E8A0BF (pink) + "Pink · Cow · 2020" — Inter 13px font-weight 400 color rgba(240,240,240,0.45).
Status + weight row below (2px gap): "Active · 1,187 lbs" — Inter 11px font-weight 500 color #A8E6DA.
Quick notes pills row below (4px gap): Show 2 pills side by side — "Hard keeper" and "Good mother". Each pill: background rgba(255,255,255,0.1), color rgba(240,240,240,0.8), Inter 10px font-weight 600, rounded-full, padding 2px 8px. If more than 3 notes, show "+N more" in same pill style.

Right column (shrink-0, padding-top 4px):
FlagIcon teal (use existing FlagIcon component, size="md", color="teal" = #55BAAA).
Below icon: "Management" — Inter 10px font-weight 600 color #55BAAA, centered.

MEMO FIELD (directly below header card, 12px gap, always visible — not inside any collapsible):
White card, rounded-xl, border 1px rgba(212,212,208,0.6), padding 14px 16px.
Label row: "MEMO" — Inter 9px font-weight 700 letter-spacing 0.08em color rgba(26,26,26,0.4) uppercase.
Below label (6px gap): textarea, width 100%, min-height 64px, resize none.
Pre-filled value: "Good disposition, easy handler. Spring calving group."
Styling: background #F5F5F0, border 1px #D4D4D0, border-radius 8px, padding 10px 12px, Inter 14px font-weight 400 color #1A1A1A line-height 1.5. Focus state: border #F3D12A, ring-2 rgba(243,209,42,0.25). font-size 16px (required — prevents iOS auto-zoom).

TAB BAR (below memo card, 16px gap):
Two tabs: "Details" and "History". Full width flex row, border-bottom 1px rgba(212,212,208,0.5).
Active tab: Inter 14px font-weight 700 color #0E2646. Yellow underline indicator: 3px tall, 48px wide, #F3D12A, centered, position absolute bottom-0.
Inactive tab: Inter 14px font-weight 500 color rgba(26,26,26,0.35).
Show Details tab as active in the mockup.

TAB CONTENT — DETAILS TAB:
Section spacing: space-y-3 (12px between collapsibles).

EDIT DETAILS (CollapsibleSection, collapsed by default):
Section title "Edit Details", defaultOpen false.
Collapsed preview text below header: "3309 · Pink · Active · Management" — Inter 12px font-weight 500 color rgba(26,26,26,0.4), padding 0 16px 12px.
When expanded — two sub-groups inside the card body, padding 16px:

Sub-group 1 — Identity. Sub-label "IDENTITY" — Inter 9px font-weight 700 letter-spacing 0.08em color rgba(26,26,26,0.35) uppercase, margin-bottom 8px.
Fields in horizontal label-left layout, 105px label width, 40px input height:
Tag — text input, value "3309"
Tag Color — select dropdown, value "Pink", options: Pink, Yellow, Orange, Green, Blue, White, Red, Purple, No Tag
EID — text input, value "982 000364507221"
Sex — select dropdown, value "Cow", options: Bull, Cow, Steer, Spayed Heifer, Heifer
Type — select dropdown, value "Cow", options: Calf, Yearling, Feeder, Cow, Bull, Replacement Heifer
Year Born — select dropdown, value "2020", options: 2026 down to 2015

Thin divider: border-top 1px rgba(26,26,26,0.06), margin 12px 0.

Sub-group 2 — Status & Flag. Sub-label "STATUS & FLAG" — same Inter 9px style as above.
Status — select dropdown, value "Active", options: Active, Sold, Dead, Culled, Missing
Flag — select dropdown, value "Management", options: None, Management, Production, Cull
Flag Reason — text input, value "Spring calving group — monitor BCS", placeholder "Reason for flag"

Save button at bottom of expanded area: "Save Changes" — PillButton, navy background #0E2646, white text, full width, 44px height, rounded-full.

QUICK NOTES (CollapsibleSection, unchanged from current — keep existing implementation exactly):
Title "Quick Notes". Collapsed state shows selected pills. Expanded state shows all pill options as a wrapping grid. Currently selected: "Hard keeper" and "Good mother" shown as navy pills.

PEDIGREE (CollapsibleSection, unchanged from current — keep existing implementation exactly):
Title "Pedigree". Sire and Dam animal picker rows, registration name and number fields.

No Save/Cancel row at the bottom of the details tab — save is inside the Edit Details collapsible only.

TAB CONTENT — HISTORY TAB:
Section spacing: space-y-3 (12px between collapsibles).

CALVING RECORDS (CollapsibleSection, keep existing implementation exactly):
Title "Calving Records (3)". Collapsed preview: gold pills showing "8841 · Bull · Mar", "7503 · Heifer · Apr", "6218 · Bull · Mar". Expanded: navy cards for each calving record — calf tag, sex pill (teal for Bull, pink for Heifer), date, birth weight pill, assistance pill, notes. Same as current.

WORK RECORDS (CollapsibleSection, keep existing implementation exactly):
Title "Work Records (4)". Collapsed preview: muted navy pills showing project name + date. Expanded: navy cards for each work record — project name, flag icon, date, weight pill, preg pill, notes truncated, treatments row with teal pills. Same as current.

WEIGHT HISTORY (CollapsibleSection, collapsed by default):
Title "Weight History".
Collapsed preview: single muted pill — "1,187 lbs · Feb 24, 2026" — Inter 10px font-weight 600, background rgba(14,38,70,0.08), color #0E2646, rounded-full, padding 2px 8px.
Expanded content: vertical list of weight entries. NOT navy cards — use light rows.
Each row: border-bottom 1px rgba(26,26,26,0.06), padding 10px 0.
Top line: flex between — left "1,187 lbs" Inter 15px font-weight 700 color #1A1A1A / right date Inter 11px font-weight 500 color rgba(26,26,26,0.4).
Below: project name Inter 12px color rgba(26,26,26,0.5).
If note exists: Inter 12px color rgba(26,26,26,0.4) italic.
Show 5 entries:
"1,187 lbs" / "Feb 24, 2026" / "Spring Preg Check" / note "Good condition"
"1,165 lbs" / "Jan 14, 2026" / "Winter Vaccination" / no note
"1,152 lbs" / "Oct 15, 2025" / "Fall Processing" / no note
"1,120 lbs" / "May 22, 2025" / "Spring Preg Check 2025" / no note
"1,098 lbs" / "Nov 3, 2024" / "Fall Processing 2024" / no note
Trend line below list (8px gap): "+89 lbs over last 12 months" — Inter 11px font-weight 600 color #55BAAA.

ID HISTORY (CollapsibleSection, collapsed by default):
Title "ID History".
Collapsed preview: "3 changes recorded" — Inter 12px font-weight 500 color rgba(26,26,26,0.4).
Expanded content: vertical timeline list. NOT navy cards — use light rows.
Each row: border-bottom 1px rgba(26,26,26,0.06), padding 10px 0.
Flex between, items-start, gap 8px.
Left side: field name "Tag changed" — Inter 13px font-weight 600 color #1A1A1A. Below (2px gap): old→new value "3108 → 3309" — Inter 12px color rgba(26,26,26,0.5). If no old value, show "Set to [value]".
Right side (shrink-0, text-right): date Inter 11px color rgba(26,26,26,0.4). Below: changedBy name Inter 11px color rgba(26,26,26,0.4).
Show 3 entries:
"Tag changed" / "3108 → 3309" / "Feb 24, 2026" / "J. Olson"
"Tag Color changed" / "Yellow → Pink" / "Oct 12, 2023" / "J. Olson"
"EID changed" / "Set to 982 000364507221" / "Mar 15, 2022" / "Admin"
Disclaimer below list (8px gap): "ID history is read-only and cannot be deleted." — Inter 11px color rgba(26,26,26,0.3) italic. No edit or delete buttons anywhere in this section.

BACK BUTTON (bottom of history tab, 16px gap):
"Back to Animals" — PillButton variant outline, full width, 40px height, rounded-full, border 1.5px #D4D4D0, Inter 13px font-weight 600 color #0E2646.

STYLE RULES (non-negotiable throughout):
Font: Inter only. No Geist Mono. All numbers in Inter.
All text inputs and textareas: font-size 16px (prevents iOS Safari auto-zoom).
Form label width: 105px fixed on all rows.
CollapsibleSection component: white card, rounded-xl, border 1px rgba(212,212,208,0.6), overflow hidden. Header 15px font-weight 600 color #1A1A1A, padding 14px 16px. Expand/collapse chevron right-aligned, rotates 180° when open. Collapsed content shows in padding area below header before the fold. Expanded content in padding 16px border-top 1px rgba(212,212,208,0.4).
Color palette: Navy #0E2646, Teal #55BAAA, Gold #F3D12A, Coral #E87461. Flag colors: Management teal #55BAAA, Production gold #F0C05A, Cull red #9B2335.
Screen width: 375px. No bottom tab bar.