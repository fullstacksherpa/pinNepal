---
name: pinnepal-brand-guidelines
description: Applies PinNepal's official brand colors, typography, logo, and design language to any artifact — websites, package cards, blog posts, email templates, social graphics, presentations, or documents. Use whenever PinNepal's visual identity, brand tone, or design standards apply.
license: PinNepal © 2025. All rights reserved.
---

# PinNepal Brand Guidelines

## Overview

PinNepal is a locally-operated adventure travel brand specializing in Nepal, targeting international travelers. Packages span trekking, motorbike cruising, cultural immersion, and expedition. The brand is locally grounded but internationally legible — warm, expert, and specific to Nepal's world.

**Brand Positioning:** "We are Nepal" — not a middleman, but a local team with connections from Kathmandu's alleys to Everest Base Camp.

**Keywords**: PinNepal, Nepal travel, adventure brand, brand colors, brand guidelines, typography, visual identity, brand kit, design system, motorbike Nepal, trekking Nepal, teahouse sage, peak navy, road orange

---

## Brand Colors

### Primary Color

- **Teahouse Sage**: `#3D7A5A` — The dominant brand color. Used for hero section backgrounds, the navigation pill, the logo mark fill, primary section fills, and anywhere the brand needs strong visual presence. Named after the green painted doors of Himalayan teahouses.

### Secondary Color

- **Peak Navy**: `#1C2E5E` — Used for headings (H1–H3), body text on light surfaces, secondary buttons, and subtle borders. Provides depth and authority without dominating. Seen in the original logo's background shape.

### Accent Color

- **Road Orange**: `#E8501A` — Used sparingly as a highlight: the "Nepal" portion of the wordmark, category tags on package cards, elevation/distance data badges, price text, testimonial quote bars, and decorative accent marks. Sourced from the winding road in the logo. Never used as a button background.

### Supporting Colors

- **Summit Snow**: `#F6F5F1` — Page background, card surfaces, and text on dark (sage/navy) backgrounds.
- **Monsoon Mist**: `#8B9BAD` — Captions, section eyebrows, metadata, subtitle text, dividers.
- **Alert Red**: `#C0392B` — **Out-of-stock and error states exclusively.** Sold-out packages, unavailable dates, error messages, "Join Waitlist" links. Never for CTAs or branding.

### RGB Values (for python-pptx, Pillow, and non-CSS tools)

```python
TEAHOUSE_SAGE = (61,  122, 90)   # #3D7A5A — PRIMARY brand color
PEAK_NAVY     = (28,  46,  94)   # #1C2E5E — headings, text, secondary
ROAD_ORANGE   = (232, 80,  26)   # #E8501A — accent (tags, badges, prices)
SUMMIT_SNOW   = (246, 245, 241)  # #F6F5F1 — page background
MONSOON_MIST  = (139, 155, 173)  # #8B9BAD — secondary text / captions
ALERT_RED     = (192, 57,  43)   # #C0392B — OOS / error ONLY
WHITE         = (255, 255, 255)  # #FFFFFF
BODY_TEXT     = (58,  58,  58)   # #3A3A3A — paragraph text
SAGE_DARK     = (46,  92,  67)   # #2E5C43 — hover state for sage buttons
```

### CSS Custom Properties

```css
:root {
  --pn-sage: #3d7a5a; /* PRIMARY — hero, nav, dominant fills */
  --pn-sage-dark: #2e5c43; /* hover/active for sage elements */
  --pn-sage-light: #ebf4ef; /* sage tint for subtle backgrounds */
  --pn-navy: #1c2e5e; /* headings, text, secondary */
  --pn-navy-light: rgba(28, 46, 94, 0.08);
  --pn-orange: #e8501a; /* accent — tags, badges, prices */
  --pn-orange-dark: #c03a10; /* orange hover */
  --pn-snow: #f6f5f1; /* page background */
  --pn-white: #ffffff;
  --pn-mist: #8b9bad; /* secondary text / captions */
  --pn-border: #ddd9d0; /* card borders, dividers */
  --pn-body: #3a3a3a; /* body paragraph text */
  --pn-red: #c0392b; /* OOS / error ONLY */
  --pn-red-light: #fdecea; /* OOS badge background */
  --pn-red-border: #fbcac6; /* OOS badge border */

  --font-display: 'Playfair Display', Georgia, serif;
  --font-body: 'Source Sans 3', Helvetica Neue, Arial, sans-serif;
  --font-mono: 'Space Mono', 'Courier New', monospace;

  --radius-btn: 2px; /* buttons, badges — near-square */
  --radius-card: 4px; /* cards, panels */
}
```

---

## Typography

### Typefaces

- **Headings**: Playfair Display (with Georgia fallback)
  - Used for H1–H3, hero headlines, package names, section headings, pull quotes, testimonial text
  - Weights: 400 (italic/editorial) and 700 (display/headings)

- **Body Text**: Source Sans 3 (with Arial fallback)
  - Used for all UI text, navigation links, descriptions, body paragraphs, button labels, captions
  - Weights: 300 (light/subtle), 400 (regular), 600 (bold/CTA)

- **Utility / Data**: Space Mono (with Courier New fallback)
  - Used for elevation figures, distances, dates, section eyebrows, category tags, logo subtitle
  - Never for paragraph text — data and labels only

### Google Fonts Loading

```html
<link
  href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=Source+Sans+3:wght@300;400;600&family=Space+Mono:wght@400;700&display=swap"
  rel="stylesheet"
/>
```

### Type Scale

| Token            | Family           | Size    | Weight | Line-height | Tracking | Color                                                  |
| ---------------- | ---------------- | ------- | ------ | ----------- | -------- | ------------------------------------------------------ |
| H1 Display       | Playfair Display | 48px    | 700    | 1.1         | −0.5px   | Peak Navy                                              |
| H2               | Playfair Display | 32px    | 700    | 1.2         | −0.25px  | Peak Navy                                              |
| H3               | Playfair Display | 24px    | 400    | 1.3         | 0        | Peak Navy                                              |
| Lead / Intro     | Source Sans 3    | 20px    | 400    | 1.5         | 0        | Peak Navy                                              |
| Body             | Source Sans 3    | 16px    | 400    | 1.7         | 0        | `#3A3A3A`                                              |
| UI / Button      | Source Sans 3    | 14px    | 600    | 1.4         | 0.5px    | White on Sage                                          |
| Caption          | Source Sans 3    | 13px    | 400    | 1.5         | 0        | Monsoon Mist                                           |
| Section Eyebrow  | Space Mono       | 10px    | 400    | 1           | 3px      | Monsoon Mist                                           |
| Elevation / Data | Space Mono       | 13–14px | 400    | 1           | 1px      | Road Orange on dark; Monsoon Mist on light             |
| Logo Subtitle    | Space Mono       | 10px    | 400    | 1           | 3px      | Monsoon Mist (light) / `rgba(255,255,255,0.45)` (dark) |

### Font Sizes (pt) for Presentations and Documents

| Token           | pt   |
| --------------- | ---- |
| H1 Display      | 36pt |
| H2              | 24pt |
| H3              | 18pt |
| Body            | 12pt |
| Caption         | 10pt |
| Eyebrow / Label | 8pt  |

### Smart Font Application (python-pptx)

```python
# Apply Playfair Display to headings (24pt and larger)
# Apply Source Sans 3 to body text (below 24pt)
# Apply Space Mono to elevation, distance, label, or eyebrow text

from pptx.util import Pt
from pptx.dml.color import RGBColor

def apply_pinnepal_font(run, font_size_pt, text_type="body"):
    if text_type == "display" or font_size_pt >= 24:
        run.font.name = "Playfair Display"
        run.font.color.rgb = RGBColor(*PEAK_NAVY)
    elif text_type == "mono" or text_type == "data":
        run.font.name = "Space Mono"
        run.font.color.rgb = RGBColor(*MONSOON_MIST)
    else:
        run.font.name = "Source Sans 3"
        run.font.color.rgb = RGBColor(*BODY_TEXT)
```

---

## Logo

### The Mark

The PinNepal logo is a map-pin / teardrop shape containing:

- A **Teahouse Sage** `#3D7A5A` filled pin form (background) — primary brand color
- A **white mountain silhouette** (Himalayan peaks)
- A **Road Orange** `#E8501A` winding road from the mountain base to the pin's point — representing both the journey and the motorbike routes

### Full Lockup (Primary)

The mark always appears on the **left**. Text block is always to the **right**:

```
[MARK]  PinNepal
        TRAVEL & ADVENTURE
```

- **"Pin"**: Playfair Display 700, Peak Navy `#1C2E5E`
- **"Nepal"**: Playfair Display 700, Road Orange `#E8501A`
- **"TRAVEL & ADVENTURE"**: Space Mono 400, 10px, letter-spacing 3px, ALL CAPS, Monsoon Mist `#8B9BAD`, 4–5px below the brand name

### Logo on Backgrounds

| Background    | Mark pin fill                            | "Pin"               | "Nepal"               | Subtitle                 |
| ------------- | ---------------------------------------- | ------------------- | --------------------- | ------------------------ |
| White / Snow  | Teahouse Sage `#3D7A5A`                  | Peak Navy `#1C2E5E` | Road Orange `#E8501A` | Monsoon Mist `#8B9BAD`   |
| Teahouse Sage | `rgba(255,255,255,0.20)`                 | White `#FFFFFF`     | Road Orange `#E8501A` | `rgba(255,255,255,0.50)` |
| Peak Navy     | `rgba(255,255,255,0.12)`                 | White `#FFFFFF`     | Road Orange `#E8501A` | `rgba(255,255,255,0.40)` |
| Photography   | White `#FFFFFF` silhouette + orange road | White               | White                 | `rgba(255,255,255,0.60)` |

### Logo Rules

- Mark always leads on the left — never text-first
- Never recolor "Nepal" away from Road Orange (or white on photography)
- Never place logo on Alert Red backgrounds
- Never distort, rotate, or add effects to the mark
- Minimum clear space: equal to the cap-height of "P" in "PinNepal" on all four sides

---

## Navigation Bar

The PinNepal nav uses a **pill-shaped, full-width, backdrop-blur design** — inspired by Apple's Dynamic Island, spread across the screen width. It floats over the page background with a Teahouse Sage tint and blur, feeling integrated with the hero rather than boxed above it.

### CSS Implementation

```css
.nav-pill {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: rgba(61, 122, 90, 0.88); /* Teahouse Sage at 88% opacity */
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.18);
  border-radius: 9999px; /* Full pill */
  padding: 10px 10px 10px 14px;
  height: 54px;
  margin: 0 1.5rem; /* Breathing room from edges */
}

/* CTA button inside nav — white pill */
.nav-btn {
  background: #ffffff;
  color: #2e5c43; /* Sage Dark */
  border-radius: 9999px;
  font-family: 'Source Sans 3', sans-serif;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  padding: 8px 18px;
}

/* Nav links */
.nav-links a {
  font-family: 'Source Sans 3', sans-serif;
  font-size: 13px;
  color: rgba(255, 255, 255, 0.8);
}
.nav-links a:hover {
  color: #ffffff;
}
```

---

## UI Components

### Package Cards — Available

| Property           | Value                                                                                             |
| ------------------ | ------------------------------------------------------------------------------------------------- |
| Background         | White `#FFFFFF`                                                                                   |
| Border             | 1px `#DDD9D0`, border-radius 4px                                                                  |
| Image height       | 150–200px, Teahouse Sage background                                                               |
| Mountain watermark | White SVG polygon at 13% opacity                                                                  |
| Elevation badge    | Bottom-left of image · `rgba(30,60,40,0.60)` bg · Space Mono 11px · `rgba(255,255,255,0.88)` text |
| Category tag       | Space Mono 10px · UPPERCASE · letter-spacing 2px · Road Orange                                    |
| Package name       | Playfair Display 17–20px 700 · Peak Navy                                                          |
| Description        | Source Sans 3 13px · `#666666` · line-height 1.5                                                  |
| Price              | Space Mono 14px 700 · Peak Navy · format: `From $1,890`                                           |
| CTA button         | Teahouse Sage bg · white text · Source Sans 3 12px 600 · UPPERCASE · border-radius 2px            |

### Package Cards — Sold Out / Unavailable

| Property       | Value                                                                          |
| -------------- | ------------------------------------------------------------------------------ |
| Card opacity   | 0.85                                                                           |
| Image filter   | `grayscale(55%)`                                                               |
| Sold-out badge | `rgba(192,57,43,0.75)` bg inside image · text: `Sold Out — Next: [Month Year]` |
| Category tag   | Monsoon Mist (not Road Orange)                                                 |
| Package name   | Monsoon Mist (not Peak Navy)                                                   |
| Price          | Strikethrough · `#AAAAAA`                                                      |
| CTA            | Text link only · Alert Red · `Join Waitlist →`                                 |

### Buttons

| Variant       | Background              | Text                    | Border        | Hover                |
| ------------- | ----------------------- | ----------------------- | ------------- | -------------------- |
| Primary (CTA) | Teahouse Sage `#3D7A5A` | White                   | none          | `#2E5C43`            |
| Secondary     | Transparent             | Peak Navy `#1C2E5E`     | 2px Peak Navy | Navy bg, white text  |
| Ghost / Text  | Transparent             | Teahouse Sage `#3D7A5A` | none          | underline            |
| Unavailable   | Transparent             | Alert Red `#C0392B`     | 2px Alert Red | `not-allowed` cursor |

All buttons: Source Sans 3 · 13–14px · 600 weight · UPPERCASE · letter-spacing 0.5px · border-radius 2px · padding 10px/22px

### Out-of-Stock Badges

```css
.badge-oos {
  background: #fdecea;
  color: #c0392b;
  font-family: 'Space Mono', monospace;
  font-size: 10px;
  letter-spacing: 1.5px;
  text-transform: uppercase;
  padding: 4px 9px;
  border-radius: 2px;
  border: 1px solid #fbcac6;
}
```

Text: `DATES UNAVAILABLE` · `OUT OF STOCK` · `SOLD OUT`

### Section Eyebrow Pattern

```css
.eyebrow {
  font-family: 'Space Mono', monospace;
  font-size: 10px;
  letter-spacing: 3px;
  text-transform: uppercase;
  color: #8b9bad;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1rem;
}
.eyebrow::after {
  content: '';
  flex: 1;
  height: 1px;
  background: #ddd9d0;
}
```

### Elevation as Data (Signature Element)

Altitude figures appear in Space Mono as topographic markers throughout the UI. Format: `5,364m` (comma thousands, lowercase m, no space).

- **On dark (sage/navy)**: Road Orange `#E8501A`, border `rgba(232,80,26,0.5)`
- **On light**: Monsoon Mist `#8B9BAD`
- **Card badge**: `rgba(30,60,40,0.60)` bg · 11px Space Mono · white text
- **Sold-out badge**: `rgba(192,57,43,0.75)` bg
- **Motorbike packages**: Distance instead — `🏍 340 km · Kathmandu–Pokhara`

### Testimonial Block

- **Left bar**: 5px solid · Road Orange `#E8501A` · border-radius 0
- **Quote text**: Playfair Display 17px · italic · Peak Navy · line-height 1.45
- **Attribution**: Space Mono 10px · ALL CAPS · letter-spacing 1.5px · Monsoon Mist
- **Format**: `NAME · COUNTRY · PACKAGE · MONTH YEAR`

---

## Voice & Tone

### Three Pillars

1. **Grounded** — real places, real elevations, real conditions. No vague superlatives.
2. **Expert** — demonstrate knowledge: roads, tea houses, weather windows, permits.
3. **Warm without gushing** — short sentences, active verbs, genuine care.

### Copy Do's

- Use real Nepali place names: Namche Bazaar, Thorong La, Pokhara, Gorak Shep, Mustang
- Name the elevation, the distance, the duration
- Use second-person active: "You leave Kathmandu at 6am heading northwest…"
- Name guide backgrounds when possible: "Born in Solukhumbu District, six Mera Peak summits"

### Copy Don'ts

- Never: "life-changing," "magical," "bucket list," "truly unforgettable"
- Never: pressured CTAs ("Don't miss out!", "Limited spots!")
- Never: passive voice for traveler actions
- Never: descriptions that could apply to any country

### CTA Vocabulary

| Context             | Correct                     | Incorrect              |
| ------------------- | --------------------------- | ---------------------- |
| Package (available) | "View the 14-day itinerary" | "Explore Now!"         |
| Package (sold out)  | "Join waitlist"             | "Check availability"   |
| Hero                | "Browse Nepal packages"     | "Start your adventure" |
| Inquiry             | "Talk to our team"          | "Submit"               |
| Booking             | "Reserve your seat"         | "Book Now!"            |
| Blog                | "Read the full route guide" | "Learn More"           |

---

## What PinNepal Is Not

Always ask: could this design belong to a beach resort, safari brand, or ski lodge? If yes, push it back toward Nepal's specific world.

**Never:**

- Luxurious or spa-adjacent
- Wellness retreat language
- Generic earthy green-beige minimalism
- Alert Red for CTAs or decoration

**Always:**

- Specific to Nepal's geography, culture, and people
- Locally operated and proud of it
- Expert, not excitable
- Teahouse Sage as the dominant visual presence
