---
name: JWT Auth Demo
description: Interactive JWT authentication demo for web security education
colors:
  warm-cream: "#faf7f2"
  surface-white: "#ffffff"
  blue-accent: "#2563eb"
  blue-accent-hover: "#1d4ed8"
  stone-text: "#1c1917"
  stone-subtle: "#57534e"
  stone-muted: "#a8a29e"
  stone-border: "#e7e5e4"
  stone-grid: "#ebe8df"
  stone-hover: "#f5f5f4"
  error-bg: "#fff1f2"
  error-border: "#fecdd3"
  error-text: "#be123c"
typography:
  display:
    fontFamily: "ui-monospace, 'SF Mono', Monaco, 'Cascadia Code', 'Source Code Pro', Menlo, Consolas, monospace"
    fontSize: "clamp(1.875rem, 5vw, 3rem)"
    fontWeight: 800
    lineHeight: 1
    letterSpacing: "-0.03em"
  body:
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif"
    fontSize: "0.8125rem"
    fontWeight: 400
    lineHeight: 1.6
  label:
    fontFamily: "ui-monospace, 'SF Mono', Monaco, 'Cascadia Code', 'Source Code Pro', Menlo, Consolas, monospace"
    fontSize: "0.625rem"
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: "0.05em"
    textTransform: "uppercase"
  code:
    fontFamily: "ui-monospace, 'SF Mono', Monaco, 'Cascadia Code', 'Source Code Pro', Menlo, Consolas, monospace"
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: 1.6
rounded:
  sm: "4px"
  md: "8px"
  lg: "12px"
  xl: "16px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "16px"
  lg: "24px"
  xl: "32px"
  2xl: "48px"
  3xl: "64px"
components:
  button-primary:
    backgroundColor: "#2563eb"
    textColor: "#ffffff"
    rounded: "8px"
    padding: "12px 20px"
    typography: "label"
  button-primary-hover:
    backgroundColor: "#1d4ed8"
    textColor: "#ffffff"
    rounded: "8px"
    padding: "12px 20px"
    typography: "label"
  button-ghost:
    backgroundColor: "#f5f5f4"
    textColor: "#44403c"
    rounded: "8px"
    padding: "12px 20px"
    typography: "label"
  input:
    backgroundColor: "#ffffff"
    textColor: "#1c1917"
    rounded: "8px"
    padding: "8px 14px"
    typography: "code"
  card:
    backgroundColor: "#ffffff"
    textColor: "#1c1917"
    rounded: "12px"
    padding: "24px"
---

# Design System: JWT Auth Demo

## 1. Overview

**Creative North Star: "The Warm Protocol"**

A warm, tactile developer workspace where cryptographic mechanics are laid bare for inspection. The beige-cream backdrop suggests a well-worn terminal or a paper notebook bench — the kind of surface where you'd sketch out a token flow before writing code. Blue acts as the single interactive signal: buttons, links, and active indicators all speak in the same calm voice. White cards float as paper against the warm desk surface, creating elevation through tonal contrast rather than heavy shadows.

This system explicitly rejects: generic SaaS blue-and-white dashboards, dark-tool neon-on-black clichés, glassmorphism, hero-metric templates, and identical card grids. The design exists to make authentication visible and tangible — every element teaches or it doesn't belong.

**Key Characteristics:**
- Warm cream foundation (#FAF7F2), white card surfaces, single blue accent
- Monospace for structure (labels, headings, code) + sans-serif for reading (body copy)
- Terminal-adjacent but warm: console-style headers, protocol-like labels, animated status indicators
- Elevation through tonal layering (white on cream) with subtle shadows
- Grid background as visual texture — not decoration, but a "blueprint" metaphor for the protocol mechanics underneath

## 2. Colors

The palette is warm-leaning neutral with a single blue accent. Every surface tone is tinted slightly warm — no pure white backgrounds (#FAF7F2 instead of #FFF), no pure black text. The blue accent is always the same hue (blue-600 #2563EB), varying only in lightness for hover and active states.

### Primary
- **Blue Accent** (#2563EB / oklch(0.55 0.22 260)): All interactive elements — primary buttons, links, active nav items, focus rings, status indicators. Used sparingly (≤10% of any screen) so its appearance is always meaningful.

### Neutral
- **Warm Cream** (#FAF7F2 / oklch(0.97 0.008 80)): Page background. The foundation colour that distinguishes this system from generic white-background tools.
- **Surface White** (#FFFFFF): Card, modal, and input backgrounds. Creates tonal elevation against the cream backdrop.
- **Stone Text** (#1C1917 / stone-900): Primary body and heading colour.
- **Stone Subtle** (#57534E / stone-600): Secondary text, metadata, subdued labels.
- **Stone Muted** (#A8A29E / stone-400): Placeholder text, disabled content, decorative dividers.
- **Stone Grid** (#EBE8DF): Background grid lines — a warm, barely-there structural texture.
- **Stone Border** (#E7E5E4 / stone-200): All borders — cards, inputs, dividers, nav bottom edge.
- **Stone Hover** (#F5F5F4 / stone-100): Ghost button backgrounds, hover state for secondary interactive elements.

### Semantic
- **Error Rose** (bg #FFF1F2, border #FECDD3, text #BE123C): Form validation errors, auth failure messages, unauthorised status indicators.

### Named Rules

**The Single Accent Rule.** Blue is the only accent colour. Never a secondary accent, never a gradient. Its rarity makes it signal.

**The Warm Foundation Rule.** No pure-white page backgrounds. No pure-black text. Every neutral is tinted warm. The page surface is always #FAF7F2 or a tone within 5% of it.

## 3. Typography

**Structure Font:** ui-monospace, SF Mono, Monaco, Cascadia Code (monospace)
**Body Font:** -apple-system, BlinkMacSystemFont, Segoe UI, Roboto (system sans-serif)

**Character:** A deliberate pairing — monospace for everything structural (labels, headings, code, buttons) keeps the terminal/protocol identity front and centre. Sans-serif body paragraphs provide readable contrast for explanatory text. The two voices never compete because they have different jobs: monospace labels label, sans-serif paragraphs explain.

### Hierarchy
- **Display** (800 weight, clamp(1.875rem, 5vw, 3rem), 1 line-height, -0.03em tracking): Hero headlines on the landing page. Monospace, bold, tight-set.
- **Title** (700 weight, 1.125rem, 1.2 line-height): Card and section headings. Uppercase with wide tracking.
- **Label** (700 weight, 0.625rem / 10px, 1.2 line-height, 0.05em tracking, uppercase): All form labels, console-style headers, badges, metadata. The signature voice of the system. Monospace.
- **Body** (400 weight, 0.8125rem / 13px, 1.6 line-height): Paragraphs and descriptions. Sans-serif. Max 65–75ch.
- **Code** (400 weight, 0.875rem / 14px, 1.6 line-height): Pre blocks, code snippets, token values. Monospace.

### Named Rules

**The Terminal Label Rule.** Every structural label (section titles, form labels, button text, status indicators) is monospace, uppercase, 10px, bold, with 0.05em letter-spacing. This is the consistent voice that says "this is a tool, not a brochure."

**The Reading Sans Rule.** Any paragraph longer than two lines must use the sans-serif body stack. Monospace is for structure, not for reading.

## 4. Elevation

The system uses tonal layering as its primary elevation mechanism. The warm cream page background (#FAF7F2) is the base layer. White card surfaces (#FFFFFF) sit one level above: the colour shift alone communicates "this is a distinct container." Shadows are secondary — a light `shadow-sm` (0 1px 2px 0 rgb(0 0 0 / 0.05)) separates cards from the background where the tone contrast alone might feel flat.

For emphasised containers (form modals, the JWT decoder panel), `shadow-xl` (0 20px 25px -5px rgb(0 0 0 / 0.1)) adds lift for interactive workflows.

### Shadow Vocabulary
- **Card shadow** (0 1px 2px 0 rgb(0 0 0 / 0.05)): Default surface elevation. Cards, info panels.
- **Emphasis shadow** (0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)): Form containers, interactive demos, the JWT decoder panel.
- **Accent glow** (0 0 15px rgba(37, 99, 235, 0.15)): Primary buttons only — a subtle blue halo that reinforces the button's interactive importance.

### Named Rules

**The Layered Paper Rule.** Elevation is achieved primarily through colour (cream → white), not shadow. Shadows are a secondary cue, never the sole differentiator.

## 5. Components

### Buttons

- **Shape:** Gently rounded corners (8px).
- **Primary:** Blue background (#2563EB), white text, bold uppercase monospace label (10px). Subtle blue outer glow (`0 0 15px rgba(37,99,235,0.15)`). 44px minimum height for touch target accessibility.
- **Hover:** Darker blue (#1D4ED8). Transition 150ms.
- **Disabled:** 50% opacity, no hover effect, not-allowed cursor.
- **Ghost/secondary:** Stone-100 background (#F5F5F4), stone-700 text (#44403C), stone-300 border. No glow. Hover: darker background (stone-200).
- **Full-width variant:** Same visual treatment, `w-full`, for forms.

### Inputs / Fields

- **Style:** White background, stone-200 border (1px), 8px radius.
- **Typography:** Monospace, 12px (code style).
- **Focus:** 2px blue-500 ring with 2px offset. Border shifts to blue-500. 150ms transition.
- **Placeholder:** Stone-400 (#A8A29E), monospace.
- **Label:** Stacked above input. 10px, bold, uppercase, monospace, stone-600.
- **Error:** Rose border + background treatment (rose-50 bg, rose-200 border, rose-700 text message).

### Cards / Containers

- **Corner Style:** 12px radius (rounded-xl).
- **Background:** White (#FFFFFF).
- **Shadow:** `shadow-sm` at rest (0 1px 2px 0 rgb(0 0 0 / 0.05)).
- **Border:** 1px solid stone-200 (#E7E5E4).
- **Internal Padding:** 24px (p-6).
- **Optional top accent bar:** 3px coloured bar (blue for primary content, stone-300 for secondary). Not structural — visual rhythm only.
- **Session manifest layout:** `grid-template-columns: auto 1fr` for label-value pairs.

### Navigation (Navbar)

- **Style:** Full-width, `h-16`, sticky top. `backdrop-blur-md` with translucent cream background (`#FAF7F2 / 80%`).
- **Bottom border:** 1px stone-200 at 80% opacity.
- **Brand:** Shield icon (blue) + "JWT Auth" text (stone-900, bold, 18px, tight tracking). Hover: blue-600.
- **Nav links:** Sans-serif 14px, stone-600, 8px rounded on hover with stone-100 bg.
- **Sign up CTA:** Same button-primary treatment — blue bg, white text, 8px radius, subtle glow.
- **User email badge:** hidden on small screens, monospace, stone-600 text, stone-100 bg, stone-200 border.

### Code / Pre Blocks

- **Background:** Stone-50 or stone-100 (#FAFAF9 / #F5F5F4).
- **Border:** Stone-200. Radius: 4px (inline) or 8px (blocks).
- **Typography:** Monospace, 12–14px depending on context.
- **Overflow:** `overflow-x: auto` for long token strings.

### Console Headers / Status Bars

- **Background:** Stone-100, bottom border stone-200.
- **Layout:** Flex row, left = status label with animated dot indicator, right = metadata.
- **Label:** 10px, bold, uppercase, monospace, stone-500–700.
- **Status dot:** 8–10px diameter circle, blue-500, `animate-pulse` for active states.
- **Character:** Prefix convention like `ACTIVE_NODE: //`, `PROBE_RESPONSE //`, `SESSION_INFO_MANIFEST`.

### Badge / Pill

- **Position:** Absolute top-right on media containers.
- **Background:** Blue-600, white text, 8px radius.
- **Typography:** 9px, bold, uppercase, wide tracking.
- **Auth badge:** Green background (#006600) for authenticated indicators.

### Error / Status Messages

- **Style:** 8px radius, vertical padding 12–14px, horizontal 14–16px.
- **Error:** Rose-50 background, rose-200 border, rose-700 text. Always paired with an icon (Shield or AlertCircle).
- **Success:** No dedicated success toast — success is indicated inline (status dot, text confirmation).
- **Loading:** Animated pulse with spinning icon + text like "CONNECTING TO TARGET PORT..."

## 6. Do's and Don'ts

### Do:

- **Do** use the Warm Cream (#FAF7F2) as the default page background. Never leave a page with a white background.
- **Do** use monospace, uppercase 10px labels for all section headers, form labels, and button text.
- **Do** use tonal layering (cream → white cards) as the primary elevation mechanism, with light shadows as secondary support.
- **Do** keep blue as the only accent colour. Use it sparingly — it should feel like a signal, not a default.
- **Do** capitalise labels in SCREAMING_SNAKE_CASE for console-style headers and protocol labels.
- **Do** include the grid background pattern (`linear-gradient` 4rem grid) on every page as a consistent texture.
- **Do** pair monospace (structure) with sans-serif (reading) — never use monospace for paragraphs longer than two lines.
- **Do** show error states with both colour and iconography (rose bg + border + icon + text).
- **Do** use the JWT decoder panel, session manifest, and 401 probe as signature components — they define the demo's identity.
- **Do** ensure focus-visible rings (2px blue-500 with 2px offset) on every interactive element.

### Don't:

- **Don't** use pure white page backgrounds. The warm cream foundation is the system's defining surface colour.
- **Don't** use pure black text (#000) or pure white text (#FFF) on coloured backgrounds. Tint all neutrals warm.
- **Don't** add a second accent colour. No green success toasts, no red "urgent" badges — use the semantic rose palette only for errors.
- **Don't** use gradient text (`background-clip: text` + gradient). Emphasis through weight or size only.
- **Don't** use glassmorphism or backdrop blurs as decorative effects. The only blur is the navbar's subtle backdrop-blur-md for sticky overlay.
- **Don't** use side-stripe borders (border-left >1px as coloured accent) on cards or callouts.
- **Don't** build hero-metric templates (big number, small label, supporting stats, gradient accent).
- **Don't** use identical card grids with icon + heading + text repeated endlessly.
- **Don't** use modals as the first solution for overlays — exhaust inline and progressive alternatives.
- **Don't** use em dashes in copy. Use commas, colons, semicolons, or periods.
- **Don't** leave any page unstyled — the token inspector page currently lacks the system's visual treatment and must match.
- **Don't** use non-standard Tailwind class names (e.g., `stone-850`, `stone-750`, `blue-650`, `stone-150`). Stick to the standard Tailwind v4 stone/blue palette or explicit hex values via `bg-[#...]`.
