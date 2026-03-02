Create a Disease Detail screen. This is the drill-in view when tapping a disease from the read-only global Diseases list. It shows veterinary reference information about a cattle disease — symptoms, common treatments, and prevention. This is read-only reference material for use in the field.
Use the standard app header: back arrow, title "Bovine Respiratory Disease", subtitle "Disease Reference".
Content area (20px padding, #F5F5F0 background):

DISEASE HEADER CARD:
White card, rounded-xl, border 1px #D4D4D0, padding 20px.
Top row: Disease name "Bovine Respiratory Disease (BRD)" Inter 17px font-weight 700 color #0E2646.
Below name (8px gap): row of category pills.

Severity pill: "High" rounded-full, padding 2px 10px, Inter 10px font-weight 700, background #FFEBEE, color #C62828.
Type pill: "Respiratory" rounded-full, padding 2px 10px, Inter 10px font-weight 700, background #E3F2FD, color #1565C0.
Reportable pill (only if applicable): "Reportable" rounded-full, padding 2px 10px, Inter 10px font-weight 700, background #FFF3E0, color #E65100.

Below pills (12px gap): Description text. "The most common and costly disease in beef cattle. A complex respiratory infection caused by a combination of viral and bacterial pathogens, often triggered by stress, weather changes, or commingling." Inter 13px font-weight 400 color #1A1A1A at 65%, line-height 1.5.

SECTION 1 — SYMPTOMS:
16px gap below header card. Section label "SYMPTOMS" Inter 11px font-weight 700 letter-spacing 0.1em color #0E2646 at 35%.
White card, rounded-xl, border 1px #D4D4D0, padding 16px.
Vertical list of symptom rows, 10px gaps. Each row: flex row, gap 10px. Left: circle (6px, #E74C3C) as bullet. Right: symptom text Inter 13px font-weight 400 color #1A1A1A at 70%.
Show 7 symptoms:

"Fever above 104°F (40°C)"
"Nasal discharge — clear progressing to thick yellow/green"
"Cough — dry initially, becoming moist and productive"
"Rapid or labored breathing"
"Depression and lethargy — off feed, head down, ears drooped"
"Watery or crusty eyes"
"Isolation from herd — standing alone, reluctant to move"


SECTION 2 — COMMON TREATMENTS:
16px gap. Section label "COMMON TREATMENTS".
White card, rounded-xl, border 1px #D4D4D0, divide-y #D4D4D0 at 40%.
Each treatment row: padding 12px 16px. Left side: Product name Inter 13px font-weight 600 color #1A1A1A. Below: route + dosage + withdrawal in Inter 12px color #1A1A1A at 40%. Right side: category pill matching the Products screen style (Antibiotic pill: background #FFF3E0, color #E65100).
If the product has a withdrawal period, show "WD: Xd" pill (background #FFF8E1, border 1px #F3D12A at 30%, Inter 10px font-weight 700 color #B8860B) below the category pill.
Show 4 common treatments:

"Draxxin" / "SQ - 1.1 mL/100 lbs" / Antibiotic / WD: 64d
"Excede" / "SQ - 1.5 mL/100 lbs" / Antibiotic / WD: 13d
"Nuflor" / "SQ or IM - 3 mL/100 lbs" / Antibiotic / WD: 28d
"Banamine" / "IV - 1 mL/100 lbs" / Anti-inflammatory / WD: 4d

Note below treatments: "Always consult your veterinarian for diagnosis and treatment protocols." Inter 11px font-weight 500 color #1A1A1A at 30%, italic, padding 8px 0.

SECTION 3 — PREVENTION:
16px gap. Section label "PREVENTION".
White card, rounded-xl, border 1px #D4D4D0, padding 16px.
Vertical list, 10px gaps. Each row: flex row, gap 10px. Left: shield-check icon (14px, #55BAAA). Right: prevention measure Inter 13px font-weight 400 color #1A1A1A at 70%.
Show 5 prevention measures:

"Vaccination — Bovi-Shield Gold, Vista Once, or equivalent modified-live respiratory vaccine"
"Pre-conditioning — vaccinate and wean calves 30-45 days before shipping or commingling"
"Low-stress handling — minimize transport time, reduce commingling of unfamiliar cattle"
"Nutritional support — adequate energy and trace minerals during high-stress periods"
"Monitoring — pull and treat early, check new arrivals twice daily for 14 days"


SECTION 4 — AFFECTED ANIMALS:
16px gap. Section label "COMMONLY AFFECTED".
White card, rounded-xl, border 1px #D4D4D0, padding 16px.
Horizontal wrap of pills. Each pill: rounded-full, padding 4px 12px, background #F5F5F0, border 1px #D4D4D0, Inter 12px font-weight 500 color #1A1A1A at 55%.
Show 5 pills: "Calves (weaning)", "Yearlings", "Feedlot cattle", "Shipped cattle", "Stressed/commingled"

SECTION 5 — YOUR HERD (operation-specific):
16px gap. Section label "IN YOUR HERD".
White card, rounded-xl, border 1.5px #55BAAA at 20%, padding 16px. Subtle teal tint to distinguish from global reference data.
Stats row: 3 stats inline, flex.

"3" / "Active Cases" — value Inter 18px font-weight 800 color #E74C3C, label Inter 10px font-weight 600 color #1A1A1A at 35%
"12" / "Treated (12 mo)" — value Inter 18px font-weight 800 color #0E2646, label same
"2.1%" / "Incidence Rate" — value Inter 18px font-weight 800 color #0E2646, label same

Below stats (12px gap): "View affected animals" tappable link, Inter 13px font-weight 600 color #55BAAA + right arrow icon.

INFO CARD (bottom):
16px gap. Rounded-lg, background #E3F2FD, padding 12px 16px. Info icon (16px, #2196F3) + "This is a global reference. Disease information is maintained by ChuteSide and updated periodically." Inter 12px color #0D47A1.
Screen size: 375px wide.