# Next Steps: High-Fidelity Design Specifications

## Moving from Low-Fidelity to High-Fidelity

This document provides guidance for designers who will create the high-fidelity mockups based on these wireframes.

---

## Color Palette Recommendations

### Primary Colors (Calming, Non-Clinical)

**Primary Background:**
- `#FAFAFA` - Soft white (not pure white - easier on eyes)
- `#F5F5F5` - Light gray (sections, cards)

**Text Colors:**
- `#1A1A1A` - Near black (primary text)
- `#4A4A4A` - Dark gray (secondary text)
- `#6B6B6B` - Medium gray (tertiary text, labels)

**Accent Colors (Use Sparingly):**
- `#2C5F5D` - Muted teal (primary actions, trust)
- `#5D7C7A` - Lighter teal (hover states)
- `#E8F4F3` - Very light teal (backgrounds, highlights)

**Alert Colors:**
- `#D32F2F` - Red (errors, urgent crisis)
- `#F5F5F5` - Light red background `#FFF5F5` (crisis boxes)
- `#2E7D32` - Green (success states - use rarely)

### Color Usage Guidelines

**DO:**
- Use muted, desaturated colors (avoid bright, neon)
- Maintain high contrast ratios (WCAG AA minimum)
- Use color + icon + text (never color alone)

**DON'T:**
- Use bright, saturated colors (too stimulating)
- Use colors that resemble social networks (blue, orange)
- Rely on color alone to convey meaning

---

## Typography

### Font Families

**Recommended Primary:**
- **System fonts:** `-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif`
- **Why:** Fast loading, accessible, familiar

**Alternative (If Custom Font):**
- **IBM Plex Sans** (open source, excellent accessibility)
- **Inter** (designed for UI, high legibility)

### Font Sizes & Hierarchy

```
Headline (H1): 28px / 34px line-height / 700 weight
Subheadline (H2): 20px / 28px line-height / 600 weight
Body Large: 18px / 28px line-height / 400 weight
Body Regular: 16px / 24px line-height / 400 weight
Body Small: 14px / 22px line-height / 400 weight
Caption/Label: 12px / 18px line-height / 600 weight (uppercase)
```

### Font Guidelines

**DO:**
- Use system font stacks for performance
- Maintain 1.5 line-height minimum
- Use 16px minimum for body text
- Bold for emphasis (not color alone)

**DON'T:**
- Use decorative or script fonts
- Use all-caps for long text (only labels)
- Use italics (hard to read for some users)
- Use font size below 12px

---

## Spacing & Layout

### Spacing Scale (8px Base)

```
xs: 4px    (tight spacing, icon padding)
sm: 8px    (component internal spacing)
md: 16px   (default spacing)
lg: 24px   (section spacing)
xl: 32px   (major section breaks)
xxl: 48px  (screen regions)
```

### Layout Specs (Mobile-First)

**Mobile (375px - 767px):**
- Container padding: 20px
- Max content width: 100%
- Single column layout

**Tablet (768px - 1023px):**
- Container padding: 40px
- Max content width: 600px (centered)
- Single column layout

**Desktop (1024px+):**
- Container padding: 60px
- Max content width: 720px (centered)
- Single column layout (no sidebar)

### Why Single Column?
Focus and simplicity. Users should not be distracted by multiple content areas.

---

## Components

### Buttons

**Primary Button:**
```css
Background: #2C5F5D (teal)
Text: #FFFFFF (white)
Padding: 16px 24px
Border-radius: 4px (subtle)
Font-size: 16px
Font-weight: 600
Min-height: 48px (touch target)

Hover: #5D7C7A (lighter)
Active: #1E4644 (darker)
Disabled: #E0E0E0 (gray, cursor: not-allowed)
```

**Secondary Button:**
```css
Background: transparent
Text: #2C5F5D (teal)
Border: 2px solid #2C5F5D
Padding: 16px 24px
Border-radius: 4px
Font-size: 16px
Font-weight: 600
Min-height: 48px

Hover: Background #F5F5F5
```

**Text Button (Tertiary):**
```css
Background: transparent
Text: #4A4A4A (dark gray)
Text-decoration: underline
Font-size: 14px
Padding: 8px 12px
Min-height: 44px

Hover: Text #1A1A1A
```

### Input Fields

```css
Background: #FFFFFF
Border: 2px solid #D0D0D0
Border-radius: 4px
Padding: 12px 16px
Font-size: 16px
Min-height: 48px

Focus: Border #2C5F5D, Box-shadow subtle
Error: Border #D32F2F
Disabled: Background #F5F5F5, cursor: not-allowed
```

### Cards / Containers

```css
Background: #FFFFFF
Border: 1px solid #E0E0E0
Border-radius: 8px
Padding: 20px
Box-shadow: 0 2px 4px rgba(0, 0, 0, 0.08) (subtle)
```

### Disclaimer Boxes

```css
Background: #F5F5F5
Border: 1px solid #C0C0C0
Border-radius: 4px
Padding: 16px
Font-size: 14px
Color: #4A4A4A

Icon: ⚠️ or 🛈 (before text)
```

---

## Iconography

### Icon Style
- **Outlined, not filled** (less aggressive)
- **Rounded corners** (softer)
- **24px × 24px** (standard size)
- **Monochrome** (use text color)

### Recommended Icon Set
- **Material Icons (Outlined variant)**
- **Feather Icons** (minimal, clean)

### Icons to Use

```
🔒 Lock: Anonymity, privacy
👥 People: Community, peer support
⚕️ Medical Cross: Medical disclaimer
🚩 Flag: Report
❌ X: Close, exit
✓ Checkmark: Success, confirmation
⚠️ Warning: Caution, important
🛈 Info: Information, help
← Arrow Left: Back navigation
```

### Icons to AVOID
- ❌ Social media icons (unless linking externally)
- ❌ Gamification icons (trophies, stars, badges)
- ❌ Overly medical icons (needles, pills)

---

## Animation & Transitions

### Principles
- **Subtle, not flashy**
- **Functional, not decorative**
- **Respects prefers-reduced-motion**

### Recommended Transitions

```css
/* Standard transition */
transition: all 200ms ease-in-out;

/* Button hover */
transition: background-color 150ms ease;

/* Page transitions */
transition: opacity 300ms ease, transform 300ms ease;

/* Modal/overlay */
transition: opacity 250ms ease;
```

### Animations to AVOID
- ❌ Auto-playing animations
- ❌ Parallax scrolling
- ❌ Continuous animations (spinners only when loading)
- ❌ Bouncing, shaking, or attention-grabbing effects

---

## Imagery & Photography

### Guidelines

**DO:**
- Use illustrations sparingly (empty states only)
- Keep illustrations abstract, not representational
- Avoid stock photos of people (privacy concern)
- Use simple geometric patterns for backgrounds (if any)

**DON'T:**
- Show faces (even in illustrations)
- Use medical imagery
- Use overly cheerful or optimistic imagery
- Use photos that imply identity

### Empty State Illustrations
- Simple geometric shapes
- Muted colors matching palette
- Non-literal (abstract representation)

---

## Microinteractions

### Loading States

**When connecting to peer:**
```
Loading indicator: Simple spinner (teal)
Text: "Conectando..." (not "Please wait")
Duration indicator: None (creates pressure)
```

**When submitting form:**
```
Button text changes: "Enviar" → "Enviando..."
Button disabled during submission
Success state: Checkmark + "Enviado"
```

### Success Feedback

**Use:**
- Subtle checkmark animation
- Brief color change (green tint)
- Text confirmation

**DON'T:**
- Confetti or celebration animations
- Sound effects
- Persistent success banners

### Error Feedback

**Use:**
- Clear error message (what happened + how to fix)
- Red border on problematic field
- Inline validation (after first submission attempt)

**DON'T:**
- Shake animation (can be triggering)
- Blocking error modals
- Blame language ("You did X wrong")

---

## Responsive Behavior

### Breakpoints

```
Mobile: 320px - 767px (default)
Tablet: 768px - 1023px
Desktop: 1024px+
```

### Key Responsive Changes

**Navigation:**
- Mobile: Bottom fixed navigation (if multi-section)
- Desktop: Top navigation or sidebar

**Chat:**
- Mobile: Full screen
- Desktop: Centered card (max 720px)

**Buttons:**
- Mobile: Full width
- Desktop: Auto width (min 200px)

---

## Accessibility Checklist for High-Fidelity

### Color Contrast
- [ ] All text meets WCAG AA (4.5:1 for normal, 3:1 for large)
- [ ] Interactive elements distinguishable by more than color
- [ ] Focus indicators have 3:1 contrast with background

### Typography
- [ ] Minimum 16px body text
- [ ] Line-height minimum 1.5
- [ ] No text in images (unless decorative)

### Interaction
- [ ] All interactive elements minimum 44×44px touch target
- [ ] Keyboard navigation works for all interactions
- [ ] Focus order is logical
- [ ] No keyboard traps

### Structure
- [ ] Semantic HTML used throughout
- [ ] Alt text for all images
- [ ] Form labels associated with inputs
- [ ] Error messages are descriptive

### Motion
- [ ] Respects prefers-reduced-motion
- [ ] No auto-playing video or audio
- [ ] Animations can be paused

---

## Design System Tools

### Recommended Tools

**Design:**
- Figma (collaborative, accessible)
- Adobe XD (alternative)

**Prototyping:**
- Figma prototyping
- Principle (for complex animations)

**Handoff:**
- Figma Dev Mode
- Zeplin (alternative)

### Component Library Structure

```
Design System/
├── Colors
├── Typography
├── Spacing
├── Components/
│   ├── Buttons
│   ├── Input Fields
│   ├── Cards
│   ├── Modals
│   ├── Chat Components
│   └── Disclaimers
├── Patterns/
│   ├── Navigation
│   ├── Forms
│   ├── Empty States
│   └── Error States
└── Templates/
    ├── Landing
    ├── Onboarding
    ├── Chat
    └── FAQ
```

---

## User Testing Recommendations

### Prototype Testing

**Test with:**
1. People living with HIV (safely, ethically)
2. Mental health professionals
3. Accessibility specialists
4. Spanish and English speakers

**Test for:**
- Clarity of language
- Ease of finding support
- Trust signals effectiveness
- Emotional response to design

### A/B Testing (Production)

**Test:**
- Landing page headline variations
- CTA button text
- Onboarding flow length

**DON'T Test:**
- Removing safety features
- Minimizing disclaimers
- Adding pressure tactics

---

## Handoff Checklist

### Design Files
- [ ] All screens at 1x, 2x, 3x resolution
- [ ] Component library documented
- [ ] Design tokens exported
- [ ] Prototype with key flows

### Documentation
- [ ] Component specifications
- [ ] Interaction states documented
- [ ] Copy deck with all text
- [ ] Accessibility annotations

### Assets
- [ ] Icons exported (SVG)
- [ ] Images optimized
- [ ] Custom fonts licensed (if used)

---

## Production Recommendations

### Performance
- Optimize images (WebP with JPEG fallback)
- Lazy load below-fold content
- Minimize CSS/JS bundle size
- Use system fonts when possible

### Analytics (With Privacy)
- Track only what's necessary
- Anonymize all data
- No third-party tracking pixels
- Clear privacy policy

### Security
- HTTPS only
- End-to-end encryption for chat
- Regular security audits
- GDPR compliance

---

## Resources for Next Steps

### Design Inspiration (Similar Products)
- **Crisis Text Line** (crisis support UX)
- **7 Cups** (peer support patterns)
- **BetterHelp** (mental health onboarding)
- **NHS Digital** (healthcare accessibility)

### Research & Guidelines
- **SAMHSA Trauma-Informed Approach**
- **WCAG 2.1 Guidelines**
- **UNAIDS Terminology Guidelines**
- **Costa Rica Digital Accessibility Standards**

### Tools & Libraries
- **Material Design** (component patterns)
- **Inclusive Components** (accessible patterns)
- **A11y Project** (accessibility checklist)

---

**Document Version:** 1.0  
**Purpose:** Bridge document from low-fi wireframes to high-fi design  
**Next Review:** After first round of user testing
