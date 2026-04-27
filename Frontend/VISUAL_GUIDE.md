# 🎨 Visual Design Guide

## Color System

### Primary Colors
```css
--primary: #2563EB      /* Strong Blue - Main actions */
--secondary: #4F46E5    /* Indigo Modern - Secondary actions */
--accent: #F59E0B       /* Warm Orange - Highlights */
```

### Neutral Colors
```css
--bg: #F8FAFC          /* Soft White - Page background */
--card: #FFFFFF        /* Pure White - Card background */
--hover: #F1F5F9       /* Light Gray - Hover states */
--border: #E2E8F0      /* Border Gray - Dividers */
```

### Text Colors
```css
--text-primary: #0F172A    /* Almost Black - Headings */
--text-secondary: #64748B  /* Medium Gray - Body text */
```

### Status Colors
```css
--success: #22C55E     /* Green - Success states */
--error: #EF4444       /* Red - Error states */
```

### Gradients
```css
--gradient-primary: linear-gradient(135deg, #2563EB 0%, #4F46E5 100%)
--gradient-hero: linear-gradient(135deg, #1E40AF 0%, #4F46E5 50%, #7C3AED 100%)
```

---

## Typography

### Font Family
```css
font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
```

### Font Sizes
```css
/* Headings */
h1: 2rem - 4rem (32px - 64px)
h2: 1.5rem - 2rem (24px - 32px)
h3: 1.125rem - 1.5rem (18px - 24px)

/* Body */
body: 0.9375rem - 1rem (15px - 16px)
small: 0.8125rem - 0.875rem (13px - 14px)
```

### Font Weights
```css
Regular: 400
Medium: 500
Semibold: 600
Bold: 700
Extrabold: 800
Black: 900
```

---

## Spacing System (8px Grid)

```css
0.25rem = 4px
0.5rem = 8px
0.75rem = 12px
1rem = 16px
1.25rem = 20px
1.5rem = 24px
2rem = 32px
2.5rem = 40px
3rem = 48px
4rem = 64px
```

---

## Border Radius

```css
Small: 0.5rem (8px)
Medium: 0.75rem (12px)
Large: 1rem (16px)
XLarge: 1.5rem (24px)
Pill: 3rem (48px) or 50%
Circle: 50%
```

---

## Shadows

### Shadow Levels
```css
--shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05)
--shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)
--shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)
--shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)
```

### Usage
- **sm:** Subtle elevation (cards at rest)
- **md:** Standard elevation (buttons, cards on hover)
- **lg:** High elevation (dropdowns, modals)
- **xl:** Maximum elevation (important modals)

---

## Animation Timing

### Durations
```css
Fast: 0.2s
Normal: 0.3s
Slow: 0.4s - 0.6s
Very Slow: 0.8s - 1s
```

### Easing Functions
```css
/* Standard */
ease-out: cubic-bezier(0.4, 0, 0.2, 1)

/* Smooth */
ease-in-out: cubic-bezier(0.4, 0, 0.2, 1)

/* Bouncy */
spring: cubic-bezier(0.68, -0.55, 0.265, 1.55)
```

---

## Component Patterns

### Button States
```
Default → Hover → Active → Disabled
```

**Visual Changes:**
- Hover: Lift up 2px, increase shadow
- Active: Press down, reduce shadow
- Disabled: 40% opacity, no pointer

### Card States
```
Rest → Hover → Active
```

**Visual Changes:**
- Hover: Lift up 4-8px, increase shadow, border color change
- Active: Scale down slightly

### Input States
```
Default → Focus → Error → Disabled
```

**Visual Changes:**
- Focus: Border color change, glow effect
- Error: Red border, error message
- Disabled: Gray background, no interaction

---

## Layout Patterns

### Grid Systems

**Books Grid:**
```css
grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
gap: 2rem;
```

**Authors Grid:**
```css
grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
gap: 1.5rem;
```

**Stats Grid:**
```css
grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
gap: 1.5rem;
```

### Container Widths
```css
max-width: 1280px;  /* Main container */
padding: 0 1.5rem;  /* Horizontal padding */
```

---

## Icon Guidelines

### Icon Sizes
```css
Small: 16px
Medium: 20px
Large: 24px
XLarge: 32px
```

### Icon Usage
- Navigation: 20px
- Buttons: 20px
- Cards: 24px
- Hero: 48px+

### Icon Style
- Stroke width: 2px
- Line cap: round
- Line join: round

---

## Image Guidelines

### Aspect Ratios

**Book Covers:**
```
3:4 (portrait)
Example: 300px × 400px
```

**Thumbnails:**
```
1:1 (square)
Example: 64px × 64px
```

**Hero Images:**
```
16:9 (landscape)
Example: 1920px × 1080px
```

### Image Optimization
- Format: WebP (fallback to JPG)
- Max size: 10MB for uploads
- Lazy loading: `loading="lazy"`
- Alt text: Always required

---

## Responsive Breakpoints

```css
/* Mobile First */
Mobile: 0px - 767px
Tablet: 768px - 1023px
Desktop: 1024px - 1279px
Large Desktop: 1280px+
```

### Media Queries
```css
@media (max-width: 768px) {
  /* Mobile styles */
}

@media (max-width: 1024px) {
  /* Tablet styles */
}
```

---

## Accessibility

### Minimum Touch Targets
```css
min-width: 44px;
min-height: 44px;
```

### Color Contrast
- Text on background: 4.5:1 minimum
- Large text: 3:1 minimum
- Interactive elements: 3:1 minimum

### Focus States
```css
outline: 2px solid var(--primary);
outline-offset: 2px;
```

---

## Animation Examples

### Fade In
```css
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
```

### Slide Up
```css
@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
```

### Scale In
```css
@keyframes scaleIn {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}
```

### Float
```css
@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-30px); }
}
```

### Pulse
```css
@keyframes pulse {
  0%, 100% { opacity: 0.2; transform: scale(1); }
  50% { opacity: 0.4; transform: scale(1.1); }
}
```

---

## Component Specifications

### Navbar
- Height: 72px
- Background: rgba(255, 255, 255, 0.8)
- Backdrop filter: blur(12px)
- Sticky position
- Z-index: 100

### Book Card
- Border radius: 1rem
- Shadow: md (hover: lg)
- Transition: 0.4s cubic-bezier
- Hover lift: 8px

### Modal
- Max width: 500px (standard), 800px (large)
- Border radius: 1.5rem
- Backdrop: rgba(0, 0, 0, 0.6) + blur(4px)
- Z-index: 1000

### Button
- Padding: 0.75rem 1.5rem
- Border radius: 0.75rem
- Font weight: 600
- Transition: 0.3s

### Input
- Padding: 0.875rem 1rem
- Border: 2px solid
- Border radius: 0.75rem
- Focus glow: 3px rgba(37, 99, 235, 0.1)

---

## Best Practices

### DO ✅
- Use consistent spacing (8px grid)
- Apply smooth transitions
- Provide visual feedback
- Use semantic HTML
- Add loading states
- Handle empty states
- Show error messages
- Support keyboard navigation

### DON'T ❌
- Use random spacing values
- Skip loading states
- Ignore empty states
- Use inline styles
- Forget hover states
- Skip error handling
- Use tiny touch targets
- Ignore accessibility

---

## Quick Reference

### Common Patterns

**Card Hover Effect:**
```css
.card:hover {
  transform: translateY(-8px);
  box-shadow: var(--shadow-xl);
  border-color: var(--primary);
}
```

**Button Hover Effect:**
```css
.btn:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-lg);
}
```

**Input Focus Effect:**
```css
.input:focus {
  border-color: var(--primary);
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
}
```

**Glass Morphism:**
```css
.glass {
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}
```

---

**Last Updated:** April 27, 2026
