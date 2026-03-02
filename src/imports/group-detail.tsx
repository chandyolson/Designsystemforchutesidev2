Create a Group Detail screen. This is the drill-in view when tapping a group from the Groups list. It shows a summary card at top, then 3 tabs: Timeline, Animals, Projects.
Use the standard app header: back arrow, title "2026 Spring Calving", subtitle "Season Group - 87 Head".
Content area (20px padding, #F5F5F0 background):

SUMMARY CARD (always visible at top):
Gradient card: background linear-gradient(135deg, #0E2646 0%, #153566 100%), border-radius 16px, padding 20px. No teal in the gradient — keep it dark navy so the content pops.
Top row: Group name "2026 Spring Calving" Inter 17px font-weight 800 color white + 3-dot menu icon (white at 40%) on right.
Below name: Type pill "Season" (background white at 10%, Inter 10px font-weight 700 color white at 70%) + Status pill "Active" (background #55BAAA at 20%, Inter 10px font-weight 700 color #55BAAA).
Stats row (16px below pills): 4 stat blocks in a 2x2 grid, gap 12px.
Each stat: value Inter 22px font-weight 800 color white + label Inter 10px font-weight 600 color white at 40% uppercase letter-spacing 0.06em.

"87" / "CURRENT HEAD"
"94" / "ALL TIME"
"5" / "PROJECTS"
"7" / "REMOVED"

Date range row (12px below stats): calendar icon (14px, white at 30%) + "Jan 15, 2026 – May 30, 2026" Inter 12px font-weight 500 color white at 45%.

TAB BAR (below summary card, 16px gap):
3 tabs: "Timeline", "Animals", "Projects". Same tab style as calving detail: flex row, full width, each tab flex-1. Active tab: Inter 13px font-weight 700 color #0E2646, bottom border 2px #F3D12A. Inactive: Inter 13px font-weight 500 color #1A1A1A at 35%, no border.

TIMELINE TAB (default active):
Vertical timeline with left-edge line and event nodes. The line: 2px wide, color #D4D4D0, positioned 16px from left edge, running full height of the list.
Each event: flex row starting with a node circle on the timeline line, then the event content.
Node circle: 10px diameter, centered on the line. Color varies by event type:

Group created: #55BAAA (teal)
Animals added: #2196F3 (blue)
Animals removed: #E74C3C (red)
Project linked: #F3D12A (yellow)
Status change: #9E9E9E (gray)

Event content (16px left of node): padding 8px 0.

Event title Inter 13px font-weight 600 color #1A1A1A
Event detail Inter 12px color #1A1A1A at 45%
Date Inter 11px color #1A1A1A at 25%

Show 8 timeline events (newest at top):

Blue node — "12 heifers added" / "Moved from Replacement Heifers group" / "Feb 28, 2026"
Yellow node — "Spring Preg Check linked" / "Project #SPR-2026-02 - 87 head" / "Feb 20, 2026"
Red node — "3 animals removed" / "Tag 2201 (Sold), Tag 3340 (Died), Tag 4410 (Culled)" / "Feb 15, 2026"
Blue node — "24 cows added" / "Bulk import from 2025 Fall group" / "Feb 1, 2026"
Yellow node — "Pre-Calving Processing linked" / "Project #PRE-2026-01 - 75 head" / "Jan 28, 2026"
Blue node — "51 cows added" / "Initial group population" / "Jan 18, 2026"
Gray node — "Status set to Active" / "" / "Jan 15, 2026"
Teal node — "Group created" / "Created by John Olson" / "Jan 15, 2026"

"Load More" link at bottom: Inter 13px font-weight 600 color #55BAAA, centered.

ANIMALS TAB:
TOOLBAR: Search bar + filter dropdown on same row. Filter dropdown: "All (87)", "Active (80)", "Removed (4)", "Sold (2)", "Died (1)".
ANIMAL LIST: White card, rounded-xl, divide-y. Each row: padding 12px 16px, flex row between, tappable.
Left side: Tag number Inter 14px font-weight 600 color #1A1A1A + tag color dot (8px circle, filled with tag color). Below: breed + type + year born in Inter 12px color #1A1A1A at 40%.
Right side: membership status indicator pill.

Active: no pill shown (clean)
Removed: pill "Removed" background #FFF3E0, Inter 10px font-weight 700 color #E65100
Sold: pill "Sold" background #E3F2FD, Inter 10px font-weight 700 color #1565C0
Died: pill "Died" background #FFEBEE, Inter 10px font-weight 700 color #C62828

Show 8 animals:

"3309" pink dot / "Angus - Cow - 2020" / Active
"4782" yellow dot / "Angus - Cow - 2019" / Active
"5520" green dot / "Charolais - Cow - 2021" / Active
"2218" orange dot / "Simmental - Cow - 2018" / Active
"1147" blue dot / "Hereford - Heifer - 2023" / Active
"2201" white dot / "Red Angus - Cow - 2019" / Sold
"3340" yellow dot / "Angus - Cow - 2017" / Died
"4410" pink dot / "Angus x Hereford - Cow - 2018" / Removed

Result count above list: "80 active - 7 removed" Inter 11px font-weight 600 color #1A1A1A at 30%.

PROJECTS TAB:
Simple list of projects associated with this group. White card, rounded-xl, divide-y.
Each row: padding 14px 16px, flex row between, tappable.
Left side:

Project name Inter 14px font-weight 500 color #1A1A1A
Below: work type + date + head count, Inter 12px color #1A1A1A at 40%

Right side: status pill.

Open: background #55BAAA at 10%, Inter 10px font-weight 700 color #55BAAA
Closed: background #F5F5F0, Inter 10px font-weight 700 color #1A1A1A at 35%

Show 5 projects:

"Spring Preg Check" / "Preg Check - Feb 20, 2026 - 87 head" / Open
"Pre-Calving Processing" / "Processing - Jan 28, 2026 - 75 head" / Open
"Fall Vaccination Booster" / "Processing - Nov 12, 2025 - 68 head" / Closed
"AI Breeding - Spring" / "AI - Oct 5, 2025 - 62 head" / Closed
"Weaning 2025" / "Weaning - Sep 15, 2025 - 45 head" / Closed

If no projects: empty state "No projects linked to this group yet" with link "Create a project in Cow Work to get started."

Screen size: 375px wide. Default to Timeline tab. The summary card stays pinned at the top across all tabs.