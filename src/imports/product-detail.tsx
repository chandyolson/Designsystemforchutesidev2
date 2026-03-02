Create a Product Detail screen. This is the drill-in view when tapping a product from the Products list. It shows complete product information — dosage instructions, administration details, withdrawal periods, storage, and usage history within the operation. This is the field reference a rancher or vet checks while standing at the chute.
Use the standard app header: back arrow, title "Draxxin", subtitle "Antibiotic - Tulathromycin".
Content area (20px padding, #F5F5F0 background):

PRODUCT HEADER CARD:
White card, rounded-xl, border 1px #D4D4D0, padding 20px.
Top row: flex between. Left: product name "Draxxin" Inter 17px font-weight 700 color #0E2646. Right: 3-dot menu icon (#1A1A1A at 25%).
Below name (4px gap): generic/scientific name "Tulathromycin Injectable Solution" Inter 13px font-weight 400 color #1A1A1A at 45%.
Below generic name (10px gap): row of pills.

Category pill: "Antibiotic" rounded-full, padding 2px 10px, Inter 10px font-weight 700, background #FFF3E0, color #E65100.
Route pill: "SQ" rounded-full, padding 2px 10px, Inter 10px font-weight 700, background #E3F2FD, color #1565C0.
Rx pill: "Rx Required" rounded-full, padding 2px 10px, Inter 10px font-weight 700, background #F3E5F5, color #6A1B9A.


WITHDRAWAL ALERT CARD (immediately below header, 12px gap):
Only shows if product has withdrawal periods. Rounded-xl, background #FFF8E1, border 1.5px #F3D12A at 40%, padding 16px.
Top row: clock icon (18px, #B8860B) + "Withdrawal Periods" Inter 14px font-weight 700 color #B8860B.
Two withdrawal rows below (10px gap, flex column):
Row 1: flex between. Left: "Meat / Slaughter" Inter 13px font-weight 500 color #1A1A1A at 65%. Right: "64 days" Inter 15px font-weight 800 color #C62828.
Row 2: flex between. Left: "Milk" Inter 13px font-weight 500 color #1A1A1A at 65%. Right: "Not approved for lactating dairy" Inter 12px font-weight 600 color #E65100.
Note below: "Do not treat cattle within 64 days of slaughter. Not for use in female dairy cattle 20 months of age or older." Inter 11px font-weight 400 color #B8860B at 70%, line-height 1.5, 8px above.

SECTION 1 — DOSAGE & ADMINISTRATION:
16px gap. Section label "DOSAGE & ADMINISTRATION" Inter 11px font-weight 700 letter-spacing 0.1em color #0E2646 at 35%.
White card, rounded-xl, border 1px #D4D4D0, padding 16px.
Detail rows, vertical list, 14px gaps. Each row: label on top Inter 11px font-weight 600 color #1A1A1A at 35% uppercase letter-spacing 0.06em, value below Inter 14px font-weight 500 color #1A1A1A.
Show 6 detail rows:

"DOSAGE RATE" / "1.1 mL per 100 lbs body weight (2.5 mg/kg)"
"ROUTE" / "Subcutaneous (SQ) — in the neck only"
"INJECTION SITE" / "Subcutaneous in the neck. Do not inject in other locations."
"VOLUME LIMIT" / "Do not exceed 10 mL per injection site"
"FREQUENCY" / "Single dose. Do not repeat."
"NEEDLE GAUGE" / "16 or 18 gauge, ¾ to 1 inch needle"


SECTION 2 — DOSAGE TABLE:
16px gap. Section label "DOSAGE BY WEIGHT".
White card, rounded-xl, border 1px #D4D4D0, overflow hidden.
Table header row: background #F5F5F0, padding 10px 16px. Three columns, flex.

"Weight (lbs)" Inter 11px font-weight 700 color #0E2646 at 50%, left-aligned
"Weight (kg)" Inter 11px font-weight 700 color #0E2646 at 50%, center-aligned
"Dose (mL)" Inter 11px font-weight 700 color #0E2646 at 50%, right-aligned

Table rows, divide-y #D4D4D0 at 30%. Each row: padding 10px 16px. Values: Inter 13px font-weight 500 color #1A1A1A. Dose column: font-weight 700.
Show 8 weight rows:

"200" / "91" / "2.2"
"400" / "182" / "4.4"
"600" / "272" / "6.6"
"800" / "363" / "8.8"
"1,000" / "454" / "11.0"
"1,200" / "544" / "13.2"
"1,400" / "635" / "15.4"
"1,600" / "726" / "17.6"

Note below table inside card: "Tip: For 1,000+ lb animals, split into two injection sites of equal volume." Inter 11px font-weight 500 color #55BAAA, padding 10px 16px, background #55BAAA at 5%, border-top 1px #D4D4D0 at 30%.

SECTION 3 — INDICATIONS:
16px gap. Section label "LABELED INDICATIONS".
White card, rounded-xl, border 1px #D4D4D0, padding 16px.
Vertical list, 8px gaps. Each row: flex row, gap 10px. Left: green circle bullet (6px, #55BAAA). Right: indication text Inter 13px font-weight 400 color #1A1A1A at 70%.
Show 4 indications:

"Treatment of bovine respiratory disease (BRD) associated with Mannheimia haemolytica, Pasteurella multocida, Histophilus somni, and Mycoplasma bovis"
"Control of respiratory disease in cattle at high risk of developing BRD"
"Treatment of infectious bovine keratoconjunctivitis (IBK / Pinkeye) caused by Moraxella bovis"
"Treatment of foot rot (interdigital necrobacillosis) caused by Fusobacterium necrophorum and Porphyromonas levii"


SECTION 4 — STORAGE & HANDLING:
16px gap. Section label "STORAGE & HANDLING".
White card, rounded-xl, border 1px #D4D4D0, padding 16px.
Vertical list, 10px gaps. Each row: flex row, gap 10px. Left: icon (14px). Right: text Inter 13px font-weight 400 color #1A1A1A at 65%.
Show 4 rows:

Thermometer icon (#2196F3) / "Store at controlled room temperature 68°F–77°F (20°C–25°C)"
Sun icon (#E67E22) / "Protect from light. Do not freeze."
Droplet icon (#2196F3) / "Use entire contents within 60 days of first puncture"
Trash icon (#E74C3C) / "Dispose of empty containers per local regulations"


SECTION 5 — YOUR USAGE (operation-specific):
16px gap. Section label "YOUR USAGE".
White card, rounded-xl, border 1.5px #55BAAA at 20%, padding 16px. Subtle teal tint to distinguish from global reference data.
Stats row: 3 stats inline, flex.

"47" / "DOSES GIVEN" — value Inter 18px font-weight 800 color #0E2646, label Inter 10px font-weight 600 color #1A1A1A at 35%
"18" / "ANIMALS TREATED" — value Inter 18px font-weight 800 color #0E2646, label same
"2" / "ACTIVE WITHDRAWAL" — value Inter 18px font-weight 800 color #E74C3C, label same

Active withdrawal detail (only shows if count > 0, 12px gap): White inset card, rounded-lg, border 1px #FFEBEE, padding 12px. Divide-y.
Each row: padding 8px 0, flex between.

Left: tag + tag color dot + breed, Inter 13px font-weight 500
Right: "Clears Mar 21" Inter 12px font-weight 600 color #C62828

Show 2 active withdrawal animals:

"5520" green dot / "Charolais - Cow" / "Clears Mar 21"
"3091" yellow dot / "Hereford - Cow" / "Clears Apr 2"

Below: "View all treatment history" tappable link, Inter 13px font-weight 600 color #55BAAA + right arrow.

SECTION 6 — LOT TRACKING:
16px gap. Section label "CURRENT LOT".
White card, rounded-xl, border 1px #D4D4D0, padding 16px.
Detail rows, 10px gaps:

"LOT NUMBER" / "DX-2025-4471" — label Inter 11px font-weight 600 color #1A1A1A at 35%, value Inter 14px font-weight 600 color #1A1A1A
"EXPIRATION" / "Sep 2026" — value color #1A1A1A
"SERIAL / NDC" / "0069-0189-10" — value Inter 13px font-weight 400 color #1A1A1A at 55%


INFO CARD (bottom):
16px gap. Rounded-lg, background #E3F2FD, padding 12px 16px. Info icon (16px, #2196F3) + "Product information is from the manufacturer label. Always read the full label before administering." Inter 12px color #0D47A1.
Screen size: 375px wide.