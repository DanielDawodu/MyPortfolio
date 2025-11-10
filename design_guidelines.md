# Design Guidelines: Personal Portfolio Website

## Design Approach
**Reference-Based**: Drawing inspiration from modern portfolio leaders like Linear, Awwwards-winning sites, and contemporary design studios. Focus on clean, confident presentation with strategic visual impact.

## Layout System
**Spacing Framework**: Use Tailwind units of 4, 8, 12, and 16 for consistent rhythm (p-4, p-8, p-12, p-16, etc.)
- Section padding: py-16 md:py-24 lg:py-32 for main sections
- Component spacing: gap-8 or gap-12 between elements
- Container: max-w-6xl mx-auto px-6 for content sections

## Typography Hierarchy
**Font Stack**: 
- Primary (Headings): Inter or Plus Jakarta Sans (500, 600, 700 weights)
- Secondary (Body): Same as primary or DM Sans (400, 500)

**Scale**:
- Hero heading: text-5xl md:text-6xl lg:text-7xl, font-bold
- Section headings: text-3xl md:text-4xl lg:text-5xl, font-semibold
- Subsection headings: text-xl md:text-2xl, font-medium
- Body text: text-base md:text-lg
- Small text: text-sm

## Component Specifications

### Navbar
- Fixed positioning (sticky top-0 z-50)
- Two-column layout: Logo left, navigation right
- Desktop: Horizontal menu with smooth hover underline effects
- Mobile: Hamburger menu with full-screen overlay (backdrop-blur-md)
- Height: h-16 md:h-20
- Include: Logo/Name, Navigation links (About, Projects, Contact), CTA button ("Get in Touch" or "Resume")

### Hero Section
- Full viewport height (min-h-screen) with centered content
- **Large background image** showing creative workspace, coding setup, or abstract gradient
- Content overlay with backdrop-blur-md background on text container
- Two-column desktop layout: Left (60% - headline, subheadline, CTAs), Right (40% - supporting visual or stats)
- Headline + subheadline + two CTAs (primary: "View Projects", secondary: "Contact Me")
- Scroll indicator at bottom
- Buttons: Blurred background (backdrop-blur-md bg-white/10 or bg-black/20)

### About Section
- Two-column layout: Left (image/photo), Right (bio content)
- Image: Professional headshot or workspace photo (rounded-2xl)
- Content: Headline, 2-3 paragraph bio, skill tags/badges grid
- Skills displayed as pills or cards with icons (3-4 columns on desktop)

### Projects Section
- Grid layout: grid-cols-1 md:grid-cols-2 gap-8
- Minimum 3-4 project cards
- Each card: Large preview image, project title, brief description, tech stack tags, link button
- Card design: Subtle border, rounded-xl, hover lift effect (hover:-translate-y-1 transition)
- Include filters/tabs for project categories

### Contact Section
- Two-column layout: Left (contact form), Right (contact info + social links)
- Form fields: Name, Email, Message (all with proper labels)
- Contact info: Email, location, social media links with icons
- Include availability status ("Open to opportunities")
- Form submit button with loading state indication

### Footer
- Three-column layout: Left (name/tagline), Center (quick links), Right (social icons)
- Include: Copyright, "Back to top" link, social media icons
- Minimal padding (py-8)

## Icons
**Library**: Heroicons (via CDN)
- Use outline style for navigation
- Use solid style for CTAs and emphasis

## Images
**Hero Section**: 
- Large, high-quality background image (1920x1080 minimum)
- Options: Desk setup with laptop and code, creative workspace, abstract tech/gradient background
- Apply subtle overlay (bg-gradient-to-b from-black/50 to-black/30)

**About Section**:
- Professional headshot or casual workspace photo (800x800)
- Optional: Additional smaller images showing work environment

**Projects Section**:
- Project preview screenshots or mockups for each project (1200x800)
- Ensure consistent aspect ratios across all project images

## Interactions & Animations
**Minimal approach**:
- Navbar: Smooth background transition on scroll
- Links: Underline slide-in effect on hover
- Cards: Subtle lift (translate-y) on hover
- Buttons: Scale effect (hover:scale-105)
- NO scroll-triggered animations or complex motion

## Responsive Breakpoints
- Mobile: Base styles, single column layouts
- Tablet (md:768px): Two-column layouts where appropriate
- Desktop (lg:1024px): Full multi-column layouts, expanded spacing

This portfolio prioritizes clean presentation, strong visual hierarchy, and professional polish while maintaining personality through strategic use of images and refined typography.