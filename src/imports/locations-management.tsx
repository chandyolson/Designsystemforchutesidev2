Create a Locations management screen for the Reference section. Locations are hierarchical — a Pen can be inside a Pasture, which is inside a larger area like a Ranch section. Users can also capture GPS coordinates for each location.
Use the standard app header: back arrow, title "Locations", subtitle "Reference - 8 Locations".
Content area (20px padding, #F5F5F0 background):
TOOLBAR: Right side row: yellow + button (38x38, rounded-lg, #F3D12A) and a view toggle — two small icon buttons side by side: list icon (active, #0E2646) and map-pin icon (inactive, #D4D4D0). These switch between List View and Map View.

LIST VIEW (default):
SEARCH BAR: magnifying glass icon, placeholder "Search locations...", clear X.
HIERARCHICAL LIST: White card, rounded-xl, border 1px #D4D4D0. Top-level locations show as parent rows. Sub-locations are indented beneath their parent.
Parent row: padding 14px 16px, flex row between. Left side: location type icon circle (28px, background #55BAAA at 10%, icon 14px #55BAAA) + name + details. Name: Inter 14px font-weight 600 color #1A1A1A. Below name: type pill + description in Inter 12px color #1A1A1A at 40%. Right side: expand/collapse chevron (rotates 90° when open) + 3-dot menu.
Type pills: rounded-full, padding 1px 8px, Inter 10px font-weight 700. Pasture (background #E8F5E9, color #2E7D32), Pen (background #FFF3E0, color #E65100), Facility (background #E3F2FD, color #1565C0), Other (background #F5F5F0, color #1A1A1A at 50%).
Sub-location row: same style but indented 32px from left. Thin left border 2px #D4D4D0 connecting to parent. Type icon circle is 24px. Name Inter 13px font-weight 500.
GPS indicator: if location has coordinates, show a small map-pin icon (12px, #55BAAA) next to the type pill. If no coordinates, no icon.
Show this hierarchy:
North Pasture / Pasture - "320 acres, native grass" / has GPS / expanded, 0 sub-locations
South Pasture / Pasture - "280 acres, improved grass" / has GPS / collapsed, 0 sub-locations
Working Facility / Facility - "Main corrals and chute" / has GPS / expanded, showing 3 sub-locations:
→ Pen 1A / Pen - "Sorting pen, holds 40 head"
→ Pen 1B / Pen - "Hospital pen, holds 15 head"
→ Pen 1C / Pen - "Loading pen"
East Section / Pasture - "160 acres, creek bottom" / has GPS / collapsed, showing 2 sub-locations:
→ Pen 2B / Pen - "Weaning pen, holds 60 head"
→ Feed Lot / Facility - "Concrete bunks, 200 head capacity" / has GPS

MAP VIEW (toggled):
Replace the list with a map container: rounded-xl, border 1px #D4D4D0, height 400px, overflow hidden. Show a placeholder satellite-style map image with a light green/tan terrain background. Plot 5 location pins on the map at scattered positions:

North Pasture (teal pin, top-left area)
South Pasture (teal pin, bottom-left)
Working Facility (blue pin, center)
East Section (teal pin, right side)
Feed Lot (blue pin, bottom-right)

Each pin: circle 28px, white border 2px, colored fill matching type (Pasture=#55BAAA, Facility=#2196F3, Pen=#E65100). Pin has a small downward triangle pointer.
Below map: horizontally scrollable row of location chips. Each chip: rounded-full, padding 6px 12px, background white, border 1px #D4D4D0, Inter 12px font-weight 500. Selected chip: border 1.5px #0E2646, font-weight 600. Tapping a chip centers the map on that pin.
Below chips: small note "Pinch to zoom - Tap pin for details" Inter 11px color #1A1A1A at 25%, centered.

INLINE ADD/EDIT FORM (below both views):
Section label "ADD LOCATION" Inter 11px font-weight 700 letter-spacing 0.1em color #0E2646 at 35%.
White card, rounded-xl, border 1px #D4D4D0, padding 16px. Fields use horizontal label-left layout, 105px label width:

Name — text input, required, placeholder "e.g. North Pasture"
Type — dropdown: Pasture, Pen, Facility, Other
Parent — dropdown: "None (Top Level)" as default, then list all existing top-level locations (North Pasture, South Pasture, Working Facility, East Section). Selecting a parent makes this a sub-location.
Description — text input, placeholder "Brief description"
Status — dropdown: Active, Inactive

GPS COORDINATES section: 12px gap below Status field. Sub-label "GPS COORDINATES" Inter 10px font-weight 700 letter-spacing 0.08em color #0E2646 at 30%.
Two fields side by side (flex row, gap 8px):

Latitude — text input, placeholder "43.5460", half width
Longitude — text input, placeholder "-103.4820", half width

Below the lat/long fields: "Use Current Location" tappable button — flex row, gap 6px: crosshair/target icon (16px, #55BAAA) + text Inter 13px font-weight 600 color #55BAAA. This would grab the phone's GPS on tap.
Below GPS button: if coordinates are entered, show a mini map preview — rounded-lg, height 120px, border 1px #D4D4D0, with a single pin plotted. Placeholder image with terrain background and centered pin. If no coordinates, show dashed border empty state: "No coordinates set" Inter 12px color #1A1A1A at 25%, centered.
Action buttons: "Cancel" outline + "Save Location" yellow, right-aligned.
Screen size: 375px wide. Default to List View with Working Facility expanded showing its 3 sub-locations.