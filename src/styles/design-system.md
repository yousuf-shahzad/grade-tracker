# Design System

## Color Palette

### Light Mode
- Primary: `#9F7AEA` (Warm purple)
- Primary Dark: `#805AD5` (Deeper warm purple)
- Background: `#FDF6F3` (Warm off-white)
- Card Background: `#FFFFFF`
- Text Primary: `#2D3748` (Warm dark gray)
- Text Secondary: `#718096` (Warm medium gray)
- Border: `#E2E8F0` (Warm light gray)
- Success: `#48BB78` (Warm green)
- Warning: `#ED8936` (Warm orange)
- Error: `#E53E3E` (Warm red)
- Accent: `#F6AD55` (Warm amber)

### Dark Mode
- Primary: `#B794F4` (Lighter warm purple)
- Primary Dark: `#9F7AEA` (Warm purple)
- Background: `#1A202C` (Deep warm gray)
- Card Background: `#2D3748` (Warm dark gray)
- Text Primary: `#F7FAFC` (Warm white)
- Text Secondary: `#A0AEC0` (Warm light gray)
- Border: `#4A5568` (Warm medium gray)
- Success: `#68D391` (Lighter warm green)
- Warning: `#F6AD55` (Warm amber)
- Error: `#FC8181` (Lighter warm red)
- Accent: `#F6E05E` (Warm yellow)

## Typography

### Font Family
- Primary: 'Plus Jakarta Sans', system-ui, -apple-system, sans-serif
- Weights:
  - Regular: 400
  - Medium: 500
  - Semibold: 600
  - Bold: 700

### Font Sizes
- xs: 0.75rem (12px)
- sm: 0.875rem (14px)
- base: 1rem (16px)
- lg: 1.125rem (18px)
- xl: 1.25rem (20px)
- 2xl: 1.5rem (24px)
- 3xl: 1.875rem (30px)

### Line Heights
- tight: 1.25
- normal: 1.5
- relaxed: 1.75

## Spacing
- xs: 0.25rem (4px)
- sm: 0.5rem (8px)
- md: 1rem (16px)
- lg: 1.5rem (24px)
- xl: 2rem (32px)
- 2xl: 3rem (48px)

## Components

### Cards
- Background: Card Background color
- Border: 1px solid Border color
- Border Radius: 1rem (16px)
- Shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1)
- Padding: 1.5rem (24px)

### Buttons
- Primary:
  - Background: Primary color
  - Text: White
  - Hover: Primary Dark color
  - Border Radius: 0.5rem (8px)
  - Padding: 0.5rem 1rem (8px 16px)
- Secondary:
  - Background: Transparent
  - Text: Primary color
  - Border: 1px solid Border color
  - Hover: Background color with 10% opacity

### Form Elements
- Input/Select:
  - Background: Card Background color
  - Border: 1px solid Border color
  - Border Radius: 0.5rem (8px)
  - Focus: 2px solid Primary color
  - Padding: 0.5rem 0.75rem (8px 12px)

## Layout
- Container Max Width: 80rem (1280px)
- Grid Gap: 1.5rem (24px)
- Section Padding: 2rem (32px)

## Animations
- Transition Duration: 200ms
- Transition Timing: ease-in-out
- Hover Scale: 1.02
- Focus Ring: 2px solid Primary color with 20% opacity

## Accessibility
- Focus States: Visible focus rings
- Color Contrast: WCAG 2.1 AA compliant
- Interactive Elements: Minimum touch target size of 44x44px
- Reduced Motion: Respects user preferences 