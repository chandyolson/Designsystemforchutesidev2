Redesign the Project Detail screen (project-detail-screen.tsx). This is the active cattle working screen — the goal is maximum data entry real estate on a 375px mobile screen. Two key changes drive the layout: (1) the summary card and tab bar collapse together under a single chevron so they're out of the way during data entry, and (2) the animal history panel is collapsed by default.

Use the standard app header: back arrow, title "PROJECT", subtitle "Spring Preg Check · Feb 25, 2026".
Content area: 20px horizontal padding, #F5F5F0 background.

COLLAPSIBLE HEADER BAR (top of content area, replaces the separate summary card + tab bar):
This is a single gradient row that collapses/expands to reveal both the project summary details and the tab navigation. Collapsed by default.

COLLAPSED STATE (default — always visible):
Background linear-gradient(135deg, #0E2646 0%, #153566 100%), border-radius 12px, padding 10px 14px.
Single row: flex between, items-center.
Left side: "5" — Inter 22px font-weight 800 color white, line-height 1. Space 6px. "worked" — Inter 11px font-weight 500 color rgba(255,255,255,0.5). Space 10px. Thin vertical divider 1px rgba(255,255,255,0.15) height 16px. Space 10px. "Spring Preg Check" — Inter 11px font-weight 600 color #A8E6DA.
Right side: "Input" pill showing current active tab — rounded-full, background rgba(243,209,42,0.15), color #F3D12A, Inter 10px font-weight 700, padding 3px 8px. Then chevron svg (14px, color rgba(255,255,255,0.4)), pointing down when collapsed, rotates 180° when expanded.

EXPANDED STATE (when user taps the row):
The gradient bar expands downward. All collapsed state content stays in the header row. Below the header row, inside the gradient card, show:

Project details block (padding 0 14px 12px, border-top 1px rgba(255,255,255,0.08), padding-top 10px):
"In Progress" — Inter 10px font-weight 500 color rgba(168,230,218,0.5).
Row of 3 stats (12px gap, margin-top 8px):
Each stat: label Inter 9px font-weight 700 uppercase letter-spacing 0.06em color rgba(255,255,255,0.35), value Inter 16px font-weight 800 color white.
"45" / "HEAD" — "5" / "WORKED" — "40" / "REMAINING"
"Complete Project" button — rounded-lg, padding 7px 14px, background #F3D12A, Inter 11px font-weight 700 color #1A1A1A, margin-top 10px.

Tab bar below the stats (padding 0 14px 12px):
4 tabs: Input, Animals, Stats, Details. Flex row equal width.
Active (Input): Inter 12px font-weight 700 color white, 2px yellow (#F3D12A) bottom border indicator 36px wide centered.
Inactive: Inter 12px font-weight 500 color rgba(255,255,255,0.4).
Tab bar background: rgba(0,0,0,0.15), border-radius 0 0 12px 12px.

Show the COLLAPSED state in the mockup (this is the default view during active data entry).

ANIMAL CARD (below header bar, 10px gap):
The CowHistoryPanel showing the matched animal. Collapsed by default.

COLLAPSED STATE (default):
Dark navy card, rounded-xl, background #0E2646, padding 12px 14px. Flex between items-center.
Left: "4782" Inter 15px font-weight 700 color #F0F0F0. Space 8px. Small flag icon (teal, 14px). Space 6px. Pink dot circle (6px, #E8A0BF). 
Below tag: "Pink · BG-4782" Inter 12px font-weight 400 color rgba(240,240,240,0.45).
Right: chevron (14px, rgba(240,240,240,0.3)), pointing down.

EXPANDED STATE (when user taps the card):
Expands to show full cow history panel below: 3 tabs (History, Treatments, ID), recent calving records, work history — same as current CowHistoryPanel implementation. Show the collapsed state in mockup.

TAG / EID INPUT (below animal card, 10px gap):
Flex row, items-center. Label "Tag / EID" — 105px fixed width, Inter 14px font-weight 600 color #1A1A1A, line-height 46px.
Input: flex-1, height 46px, border-2 #F3D12A, rounded-lg, background white, Inter 16px font-weight 600 color #1A1A1A, value "4782".
Match status pill below (6px gap): teal rounded-full — "✓ 4782 — Pink — Matched" Inter 12px font-weight 600 color #55BAAA, background rgba(85,186,170,0.08), border 1.5px rgba(85,186,170,0.25), padding 5px 14px.

PREGNANCY CHECK FIELDS (below tag input, 12px gap):
Thin divider: border-top 1px rgba(212,212,208,0.4), padding-top 12px.
Sub-header: "PREGNANCY CHECK FIELDS" — Inter 10px font-weight 700 letter-spacing 0.08em color #55BAAA, margin-bottom 10px.
Three fields in horizontal label-left layout, 105px label, 40px input height, gap-y 8px (tighter than default to save space):

Preg Stage 🔒 — label "Preg Stage" with 10px teal lock icon after. Select dropdown, value "Bred", options: Open, AI, Bred, Late, Short, Medium, Long. Focus: border #F3D12A.
Days Gest. 🔒 — label "Days Gest." (abbreviated — must fit on one line at 105px). Number input, value "142", placeholder "days". Lock icon.
Fetal Sex 🔒 — label "Fetal Sex". Select dropdown, value "Bull", options: Bull, Heifer, Twin - BB, Twin - HH, Twin - BH, Unknown. Lock icon.

Lock icon style: 10px SVG, color #55BAAA at 30% opacity, inline after label text. Labels must never wrap — truncate or abbreviate to fit 105px at 14px bold.

PROJECT FIELDS (below preg fields, 12px gap):
Thin divider: border-top 1px rgba(212,212,208,0.4), padding-top 12px.
Sub-header: "PROJECT FIELDS" — Inter 10px font-weight 700 letter-spacing 0.08em color rgba(14,38,70,0.35), margin-bottom 10px.
Five optional fields, same label-left layout, 40px inputs, gap-y 8px:

Weight — text/number input, placeholder "lbs", empty in mock.
Quick Notes — label "Quick Notes" with small dropdown chevron (12px, tappable). When collapsed (default): show tappable area to the right of label — "Lame" shown as a single selected yellow pill (background rgba(243,209,42,0.12), border 1px rgba(243,209,42,0.30), color #B8860B, Inter 11px font-weight 600, rounded-full, padding 3px 10px). When expanded: all 16 note pills wrap below.
Notes — textarea 2 rows, placeholder "Notes…", inline mic icon (18px teal) in top-right corner of the textarea, padding-right 36px to prevent text overlap.
DNA — text input, placeholder "Sample ID", empty.
Tag Color — select dropdown, placeholder "Select…", options: Pink, Yellow, Orange, Green, Blue, White, Red, Purple.

ACTION BUTTONS (below project fields, 16px gap):
Two buttons side by side, flex gap 12px, full width:
"Reset" — flex-1, 44px, rounded-full, outline style: background white, border 1.5px #D4D4D0, Inter 14px font-weight 700 color #0E2646. Tapping clears all field values and refocuses the Tag/EID input.
"Save & Next" — flex-1, 44px, rounded-full, background #F3D12A, Inter 14px font-weight 700 color #1A1A1A.
"Save & Done →" text link below buttons, centered, Inter 12px font-weight 600 color #55BAAA, margin-top 8px.

FLOATING MIC BUTTON (bottom-right, position fixed, 80px from bottom, 20px from right):
Circle 56px, background #0E2646, shadow 0 4px 16px rgba(14,38,70,0.35). Mic icon white 22px centered. Idle state shown in mockup.

STYLE RULES (non-negotiable):
Font: Inter only. No Geist Mono. All numbers in Inter.
All inputs and textareas: font-size 16px minimum (prevents iOS auto-zoom).
Label width: 105px fixed. Labels must never wrap to two lines — abbreviate if needed ("Days of Gestation" → "Days Gest.", "Physical Defects" → "Phys. Defects", "Semen Defects" → "Semen Defects" is fine at 105px).
Row gap within field groups: 8px (tighter than standard 10px — saves vertical space).
Flag colors: Management #55BAAA, Production #F0C05A, Cull #9B2335.
Design system palette: Navy #0E2646, Teal #55BAAA, Gold #F3D12A, Background #F5F5F0.
Screen width: 375px. No bottom tab bar. Floating mic always visible.