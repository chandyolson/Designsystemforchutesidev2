Redesign the Calving Record screen (calving-detail-screen.tsx). This screen records a single calving event and shows the dam's history. The goal is maximum entry speed — most fields should be reachable without any tapping. Two tabs: Calf Info (default) and Dam History.

Use the standard app header: back arrow, title "CALVING RECORD", subtitle "Calf 8841".
Content area: 20px horizontal padding, #F5F5F0 background.

GRADIENT HEADER CARD (top, always visible on both tabs):
Background linear-gradient(145deg, #0E2646 0%, #163A5E 55%, #55BAAA 100%), border-radius 16px, padding 20px.
Left column (flex-1):
Calf tag "8841" — Inter 36px fontWeight 800 color white letterSpacing -0.02em.
Row below tag (6px gap): sex badge pill — "Heifer" — rounded-full, background rgba(232,160,191,0.25), color #E8A0BF, Inter 10px fontWeight 700 uppercase letterSpacing 0.06em, padding 2px 10px. Then birth date "Born Feb 26, 2026" — Inter 11px fontWeight 400 color rgba(240,240,240,0.4). (Birth date is small here — it does NOT appear again as an editable field below.)
Row below (4px gap): "Dam 7801" Inter 11px fontWeight 500 color #A8E6DA. Dot separator. "Basin Payweight" Inter 11px fontWeight 500 color rgba(168,230,218,0.7).
Right column (shrink-0, pt-1): birth weight "78" Inter 28px fontWeight 800 color white lineHeight 1. Below: "LBS" Inter 9px fontWeight 600 color rgba(240,240,240,0.4) letterSpacing 0.06em uppercase.
Flag row (if flag set): border-top 1px rgba(255,255,255,0.08), paddingTop 10px, marginTop 12px. FlagIcon gold (size sm) + "Production Flag" Inter 11px fontWeight 700 color #F3D12A.

TAB BAR (below header card, 12px gap):
Two tabs: "Calf Info" and "Dam History". Full width flex row, border-bottom 1px rgba(212,212,208,0.5).
Active: Inter 14px fontWeight 700 color #0E2646. Gold underline 3px × 48px centered at bottom.
Inactive: Inter 14px fontWeight 500 color rgba(26,26,26,0.35).
Show Calf Info as active in the mockup.

────────────────────────────────────────────────────────
TAB CONTENT — CALF INFO TAB
────────────────────────────────────────────────────────
Layout is a series of visually segmented sections with tight spacing (gap-y 8px within groups). No form labels wrap — all labels at 105px fit on one line.

SECTION 1 — ENTRY FIELDS (white card, rounded-xl, border 1px rgba(212,212,208,0.6), padding 14px 16px):
This is the primary data entry area, always fully visible. No collapsible.

Section label above card: "BIRTH ENTRY" — Inter 9px fontWeight 700 letterSpacing 0.08em color rgba(14,38,70,0.35) uppercase, marginBottom 6px.

Row 1 — STATUS TOGGLE (full-width, not label-left):
Three-segment toggle bar: "Alive" | "Dead" | "Grafted". Each segment: flex-1, height 36px, rounded-lg inside a rounded-xl container. Active = "Alive": background #0E2646, text white Inter 13px fontWeight 700. Inactive: background transparent, text rgba(26,26,26,0.4) Inter 13px fontWeight 500. Outer container: background rgba(14,38,70,0.06), border 1px rgba(212,212,208,0.4), border-radius 10px, padding 3px. No label beside it — the toggle is self-describing.

Divider: border-top 1px rgba(26,26,26,0.06), margin 10px 0.

Row 2 — SIZE + BIRTH WT on same line:
Two fields side by side using a 2-column grid, gap 10px. No label-left layout for this row — each field has its label above it (stacked, not inline).
Left field: label "SIZE" Inter 9px fontWeight 700 uppercase letterSpacing 0.06em color rgba(26,26,26,0.4), marginBottom 4px. Select dropdown showing "Average", options: Small, Average, Large. Height 40px, rounded-lg, border 1px #D4D4D0, Inter 16px.
Right field: label "BIRTH WT" same style. Number input, value "78", placeholder "lbs". Height 40px.

Divider: border-top 1px rgba(26,26,26,0.06), margin 10px 0.

Row 3 — ASSISTANCE (label-left, 105px label):
Label "Assistance". Select dropdown options (text only — no integer prefix): None, Easy Pull, Moderate, Hard Pull, Surgical. Value "None". Height 40px.
Note: If value is anything other than "None", show a small coral alert row below: coral triangle icon + "Review dam and calf at next check" Inter 12px fontWeight 500 color #9B2335, background rgba(155,35,53,0.06), border 1px rgba(155,35,53,0.15), rounded-lg, padding 8px 12px, marginTop 6px.

Row 4 — NOTES (label-left, 105px label):
Label "Notes". Textarea, 2 rows, placeholder "Calving notes…", minHeight 52px, fontSize 16px, resize none. Inline mic icon (teal, 16px) in top-right corner, padding-right 36px. Border 1px #D4D4D0, rounded-lg, bg white.

SECTION 2 — LOCATION & GROUP (white card, rounded-xl, border 1px rgba(212,212,208,0.6), padding 14px 16px, marginTop 10px):
Section label above card: "LOCATION" — same 9px uppercase label style.
Two fields, label-left layout, 105px label, gap-y 8px:
Location — select dropdown, value "Calving Pasture A" (last-used default). Placeholder "Select location…". Height 40px.
Group — select dropdown, value "2026 Season" (last-used default). Placeholder "Select group…". Height 40px.
Small muted note below both fields: "Defaults to last used values" — Inter 10px color rgba(26,26,26,0.3) italic.

SECTION 3 — QUICK NOTES (CollapsibleSection, collapsed by default, marginTop 10px):
Title "Quick Notes". When collapsed: show selected notes as color-coded pills inline below the header. Show "Bad Bag" (yellow/production pill) and "Needs Tag" (no-flag pill) as mock selected. When expanded: full pill grid of all calving quick notes — same pill styling as current implementation (cull = coral, production = yellow, management = teal, none = light gray). Multiple select. Selected pills have thicker border (2px) and checkmark prefix.
Collapsed state: pills appear in padding area between header and card fold.

SECTION 4 — COW TRAITS (CollapsibleSection, collapsed by default, marginTop 10px):
Title "Cow Traits". Collapsed preview: show 3 selected values as small muted pills — "No Assist", "Average udder", "Good mother".
When expanded — 7 fields, label-left layout, 105px label, gap-y 8px. Dropdowns show TEXT ONLY (no integer prefix in options or displayed value):
Assistance — options: None, Easy Pull, Moderate, Hard Pull, Surgical. Value "None".
Disposition — options: Docile, Restless, Nervous, Flighty, Aggressive, Very Aggressive. Value "Restless".
Udder Score — options: Very Pendulous, Pendulous, Moderate Low, Moderate, Average, Above Average, Good, Very Good, Ideal. Value "Above Average".
Teat Score — options: Very Large, Large, Moderate Large, Moderate, Average, Above Average, Good, Very Good, Ideal Small. Value "Average".
Claw Score — options: Very Poor, Poor, Below Average, Moderate, Average, Above Average, Good, Very Good, Ideal. Value "Average".
Foot Score — same options as Claw. Value "Above Average".
Mothering — options: Abandons Calf, Poor, Average, Good, Excellent. Value "Good".

SECTION 5 — CALF TRAITS (CollapsibleSection, collapsed by default, marginTop 10px):
Title "Calf Traits". Collapsed preview: show selected values as muted pills — "Vigorous", "Average size".
When expanded — 2 fields, label-left layout, 105px label:
Calf Vigor — options (text only): Dead, Weak, Average, Alert, Vigorous. Value "Vigorous".
Calf Size — options (text only): Very Small, Small, Average, Large, Very Large. Value "Average".

ACTION BUTTONS (marginTop 16px):
Two buttons flex row gap 12px:
"Cancel" — flex-1, 44px, rounded-full, outline: bg white, border 1.5px #D4D4D0, Inter 14px fontWeight 700 color #0E2646.
"Save Changes" — flex-1, 44px, rounded-full, background #F3D12A, Inter 14px fontWeight 700 color #1A1A1A.

────────────────────────────────────────────────────────
TAB CONTENT — DAM HISTORY TAB
────────────────────────────────────────────────────────

DAM CARD (collapsible — collapsed by default, same expand behavior as CowHistoryPanel in project-detail-screen.tsx):
Collapsed state — navy card, rounded-xl, background #0E2646, padding 12px 14px. Flex between items-center.
Left: 10px colored dot (green = #55BAAA for tag color) + "7801" Inter 18px fontWeight 800 color #F0F0F0 + gap + "Green · Cow · 2019" Inter 11px color rgba(240,240,240,0.4).
Right: FlagIcon teal (size sm) + "Management" Inter 10px fontWeight 600 color #55BAAA + chevron (14px, rgba(240,240,240,0.3)), pointing down.
Tapping the card expands it.

Expanded state (when tapped): card grows to show three sub-tabs inline: Info, Calving, History. Same navy background, same styling as the CowHistoryPanel component on the project detail screen. Sub-tab bar: teal underline indicator, white active tab text, muted inactive. Show Info sub-tab active. Info content: 2-column grid of dam stats — Type: Cow, Year: 2019, Color: Green, Flag: Management, EID: 982 000364507221. All in compact label/value pairs inside the card.

LATEST NOTES (always visible, below dam card, 10px gap):
Section label "LATEST NOTES" — Inter 9px fontWeight 700 uppercase letterSpacing 0.08em color rgba(26,26,26,0.4).
Note text: "Calved Feb 26 — heifer calf 8841, no issues" — Inter 13px color rgba(26,26,26,0.7) lineHeight 1.5.

CALVING RECORDS (CollapsibleSection, expanded by default):
Title "Calving Records (4)". Collapsed preview: gold pills showing calf tag + sex + month abbreviation — "8841 · Heifer · Feb", "7620 · Bull · Mar", "6401 · Heifer · Mar", "5210 · Bull · Feb".
Expanded: navy cards for each record — calf tag bold + sex badge pill (teal for Bull, pink for Heifer) + date muted below + birth weight pill + assistance pill (coral if any assistance) + notes.

WORK RECORDS (CollapsibleSection, expanded by default):
Title "Work Records (3)". Collapsed preview: muted navy pills — "Winter Vaccination · Jan 14", "Fall Processing · Oct 15", "Spring Preg Check 2025 · May 22".
Expanded: navy cards same as current — project name, flag icon, date, weight pill, preg pill, notes truncated.

DAM ID (CollapsibleSection, collapsed by default):
Title "Dam ID". Collapsed: "7801 · Green · Cow" muted pill.
Expanded: read-only fields — Tag, EID, Other ID, Lifetime ID, Sex, Type, Year Born, Tag Color. Same label-left 105px layout, read-only appearance (no border, background transparent, value in Inter 14px fontWeight 500).

BACK BUTTON (marginTop 16px):
"Back to Calving" — PillButton outline, full width, 40px, rounded-full, border 1.5px #D4D4D0, Inter 13px fontWeight 600 color #0E2646.

────────────────────────────────────────────────────────
STYLE RULES (non-negotiable)
────────────────────────────────────────────────────────
Font: Inter only. No Geist Mono.
All inputs, selects, textareas: fontSize 16px minimum (prevents iOS auto-zoom).
Form label width: 105px fixed. Labels must fit on one line — no wrapping.
Section labels above cards: Inter 9px fontWeight 700 uppercase letterSpacing 0.08em color rgba(14,38,70,0.35).
Card inner spacing: paddingY 14px, paddingX 16px.
Gap between sections: 10px (tighter than default — maximizes visible fields).
Flag colors: Management #55BAAA, Production #F0C05A, Cull #9B2335.
Palette: Navy #0E2646, Teal #55BAAA, Gold #F3D12A, Background #F5F5F0.
Screen width: 375px. No bottom tab bar.