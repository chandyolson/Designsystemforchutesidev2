# Calving Dashboard — Figma Make Design Prompt

## Product Context

HerdWork is a mobile-first livestock management app for cattle ranchers. This screen is the Calving Dashboard — the new landing page when a rancher taps "Calving" in the navigation drawer. It replaces a simple record list with a full analytics dashboard for monitoring calving season in real time.

The user is a rancher checking this screen daily during calving season (January–April), often outdoors on a phone, sometimes with gloves on. Everything must be readable in sunlight, tappable with one thumb, and information-dense without feeling cluttered.

---

## Design System (Locked — Do Not Override)

**Font:** Inter — all weights, all text. No other fonts anywhere.

**Page background:** #F5F5F0 (warm cream)

**Card backgrounds:** #FFFFFF with 1px #D4D4D0 border, 12px border-radius, 12px padding

**Header gradient:** linear-gradient(180deg, #153566 0%, #081020 100%)

**Stat card gradient:** linear-gradient(varied angles, #0E2646 0%, #163A5E 55%, #55BAAA 100%) — use different gradient angles (130°–170°) across cards for visual variety

**KPI stat card typography:**
- Label: 10px, weight 600, rgba(255,255,255,0.35), uppercase, 0.08em letter-spacing
- Value: 24px, weight 600, #FFFFFF, -0.02em letter-spacing
- Subtitle: 11px, weight 500, #A8E6DA (teal-green)

**Section headings:** 13px, weight 700, #0E2646, with trailing horizontal divider line (1px, rgba(212,212,208,0.50))

**Navigation:** Hamburger side drawer only. No bottom tab bar. Brand text "HERD WORK" in header right, 11px weight 700, #F3D12A gold with glow text-shadow.

**Content width:** max 576px centered (mobile-first). Minimum viewport: 375px.

**Tab bar:** White background, gold #F3D12A underline on active tab, 13px weight 600.

**Tap targets:** 44px minimum. Active feedback: scale(0.97) on buttons, scale(0.98) on cards.

**No emoji anywhere.** All icons are inline SVG or lucide-react style line icons.

---

## Chart Color Palette — Classic Royal

Charts and data visualizations use a regal, authoritative palette that pairs well with the cream/navy design system:

- **Navy:** #0E2646 — primary chart color (calving curve line, bar chart peaks, doughnut dominant segment)
- **Deep Purple:** #3B2072 — secondary chart color (low-end bars, gradient accents, season progress bar)
- **Crimson:** #7B2D3B — negative indicators (death counts, hard pulls, mortality gauge fill end)
- **Antique Gold:** #C4A24E — comparison lines, secondary segments, overlay data, prior year reference
- **Burgundy:** #8B3A4A — moderate-negative (moderate assist, warning-level data)
- **Lavender:** #9590A8 — neutral/unknown segments

**Flag pill colors (on white card backgrounds):**
- Cull tier (red flags): background rgba(123,45,59,0.12), text #7B2D3B
- Production tier (gold flags): background rgba(196,162,78,0.12), text #8B6914
- Management tier (teal flags): background rgba(85,186,170,0.12), text #2A7A6C

---

## Screen Structure

The screen has three tabs: **This Season** (default, shown below), **Compare**, and **Records**.

### Layout (top to bottom, This Season tab):

**1. Header**
- Gradient header with hamburger menu left, "Calving" title (17px/700 white), "Frederickson Ranch" subtitle (12px/500 #55BAAA), and "HERD WORK" brand right

**2. Tab bar**
- Three tabs: This Season (active, gold underline), Compare, Records

**3. Search bar**
- Full-width rounded pill input (44px height, 22px border-radius), magnifying glass icon left, placeholder: "Search by dam tag, calf tag, or notes…"
- Gold focus ring on tap: border #F3D12A, box-shadow 0 0 0 2px rgba(243,209,42,0.25)

**4. Year picker pill**
- Small rounded pill showing "2026" with chevron-down icon. Tap to expand year selection.

**5. Calving Season Progress Card** ⭐ NEW
- White card with:
  - Top row: "CALVING SEASON PROGRESS" label (uppercase, muted) + large "53.7%" percentage right-aligned
  - Horizontal progress bar (10px tall, rounded): gradient fill from navy → deep purple → teal showing 53.7% filled against a light gray track
  - Below bar: three columns — "Expected first calf: Jan 8" / "Actual first calf: Jan 8" (purple text) / "Expected last calf: Mar 24"
  - Below divider line: four equal-width metric boxes in a row:
    - Born: "453 / 843" (big number / muted total)
    - Days In: "67"
    - Avg Calf Age: "29 days"
    - Days Left: "8"
  - These metrics use 9px uppercase muted labels above and 15px weight 700 navy values below

**6. Calf Mortality Rate Card** ⭐ NEW
- White card with:
  - Top row: "CALF MORTALITY RATE" label + large "7.7%" in crimson #7B2D3B
  - Horizontal gauge bar (10px tall): gradient fill gold-to-crimson, filled to 38.5% of a 0–20% scale
  - Two thin vertical benchmark markers on the bar:
    - 2025 marker at 6.8% position with tiny label above
    - 2024 marker at 3.1% position with tiny label above (more muted)
  - Below bar: "35 dead of 453 born" left, "+0.9% vs 2025" right in crimson

**7. KPI Stat Cards**
- 2×2 grid of gradient stat cards:
  - Total Born: 453, subtitle "Jan 8 – Mar 14"
  - Alive: 418, subtitle "35 dead · 7.7% loss" (coral/red subtitle)
  - Bulls: 247, subtitle "54.5%"
  - Heifers: 194, subtitle "42.8%"

**8. Calving Curve Section**
- Section heading: "Calving curve" with divider
- White card containing:
  - Toggle row: Daily (active, navy pill) / Weekly (inactive, bordered pill) + "2025 overlay" checkbox with antique gold accent
  - Line chart: navy line (#0E2646) with very light navy fill beneath, smooth tension. When overlay is active, dashed antique gold line shows prior year pattern. X-axis = dates, Y-axis = births per day/week.

**9. Sex Split & Birth Weight Section**
- Section heading: "Sex split & birth weight" with divider
- Two-column grid:
  - Left card: Doughnut chart — navy (bulls), antique gold (heifers), lavender (unknown). 62% cutout. Custom legend below with small square dots + labels + counts.
  - Right card: Bar chart — birth weight distribution in 10-lb buckets (<60, 60s, 70s, 80s, 90s, 100+). Colors: purple for low, navy for peak, gold for high-normal, crimson for outlier high. 4px border-radius on bars.
- Below both cards: three small metric cards in a row — Avg Weight (82.1 lb), Bulls Avg (84.3 lb), Heifers Avg (79.4 lb). Light navy-tinted background, centered text.

**10. Problems Section**
- Section heading: "Problems" with divider
- Two-column grid:
  - Left card: Four rows — Deaths (35, 7.7% in crimson), Hard Pulls (7, 1.5% in burgundy), Easy Pull (18, 4.0% in gold), No Assist (428, 94.5% in navy). Rows separated by faint dividers.
  - Right card: Doughnut chart matching the four categories. Navy dominant, gold, burgundy, crimson.

**11. Flagged Cows Section**
- Section heading: "Flagged cows" with divider
- White card with rows, each showing:
  - Tag number (14px/600, navy) — tappable, navigates to animal record
  - Colored flag pills (9px uppercase, rounded-full) using the flag pill colors above
  - Chevron right icon (#D4D4D0)
- Example rows:
  - 2142: "BAD BAG" (red pill) + "BAD MOTHER" (red pill)
  - 1876: "BAD BAG" (red pill) + "BAD FEET" (teal pill)
  - 903: "BAD DISPOSITION" (gold pill)
  - 1504: "REPEAT DEATH LOSS" (red pill) + "POOR CONDITION" (teal pill)
- "+ 4 more flagged cows" text at bottom, muted

**12. Records Link Card**
- White card, full width: "View all calving records" (14px/600 navy), subtitle "453 records · 2026" (12px muted), chevron right

---

## Design Exploration Requests

Please generate 3 layout variations for this screen:

**Variation A — Compact Dashboard**
Pack the season progress, mortality gauge, and KPI cards as tightly as possible. Minimize vertical scrolling. The rancher wants to see the big picture without scrolling past the fold.

**Variation B — Card-Heavy Editorial**
Give each section generous white space and clear visual separation. Larger chart areas. Let the data breathe. The rancher is reviewing end-of-day, not rushing at the chute.

**Variation C — Data-Dense with Inline Metrics**
Merge the mortality gauge INTO the KPI card grid (make it a 5th card or overlay it on the Alive card). Merge "Days In" and "Avg Calf Age" as small inline metrics on the season progress bar itself rather than separate boxes. Maximum information density.

All three variations must use the same color palette, typography, and component styles described above. The differences should be in layout density, spacing, card sizing, and how metrics are grouped.

---

## Data for Mockup Content

- Operation: Frederickson Ranch
- Year: 2026 (season in progress)
- Total born: 453
- Expected head count: 843 (active cows end of 2025)
- Alive: 418 / Dead: 35 / Death loss: 7.7%
- Bulls: 247 (54.5%) / Heifers: 194 (42.8%) / Unknown: 12
- Avg birth weight: 82.1 lb / Bulls avg: 84.3 / Heifers avg: 79.4
- First calf: Jan 8, 2026
- Last calf so far: Mar 14, 2026
- Expected last calf: Mar 24, 2026
- Days into season: 67
- Days remaining: 8
- Average calf age: 29 days
- Hard pulls: 7 / Easy pulls: 18 / No assist: 428
- Prior year (2025) death loss: 6.8%
- Prior year (2024) death loss: 3.1%
- Bulls in: Apr 3, 2025 / Bulls out: Jun 17, 2025 (280-day gestation calc)
