# Project Rules & Design System Guidelines

## Core Product Vision

Enterprise AI-powered Construction Intelligence Platform built for construction professionals (General Contractors, Subcontractors, Project Managers, Superintendents, BIM Managers).

---

## 🚫 Strictly Forbidden (Never Use)

- **NO** flashy AI demo websites
- **NO** glassmorphism / backdrop blur effects
- **NO** neon colors or bright saturated futuristic fills
- **NO** purple/pink gradients
- **NO** glowing borders or neon box-shadows
- **NO** oversized rounded cards (keep border-radius crisp: 2px–6px max)
- **NO** generic AI illustrations, decorative vectors, or hero mascot graphics
- **NO** floating widgets, popovers over critical workflows, or disruptive overlays
- **NO** excessive whitespace (UI must be information-dense and grid-aligned)

---

## 🎨 Aesthetic & Design Inspiration

Design inspiration and UI density reference standard enterprise platforms:

- **Autodesk Construction Cloud (ACC)**
- **Procore**
- **Jira**
- **Linear**
- **GitHub**
- **Stripe Dashboard**
- **Azure Portal**
- **AWS Management Console**

---

## 📐 Design Principles

- **Professional**: Clean, enterprise-ready data presentation.
- **Industrial**: Rugged, reliable, built for field and office use.
- **Minimal**: Zero decorative fluff. Every pixel serves a data purpose.
- **Information Dense**: Compact tables, structured sidebars, high data throughput.
- **Fast**: Optimized DOM, crisp rendering, zero lag.
- **Accessible**: High contrast ratios, full keyboard navigation, WCAG AA compliance.
- **Reusable**: Modular design tokens and component primitives.
- **Responsive**: Dynamic layouts supporting multi-monitor desktop setups down to field tablets.

---

## 🎨 Color Palette & Design Tokens

- **Primary Colors**: White (`#FFFFFF`), Slate (`#0F172A` / `#1E293B` / `#334155`), Navy (`#0A192F` / `#1E3A8A`)
- **Accent Color**: Construction Safety Orange (`#F97316` / `#EA580C` / `#C2410C`)
- **Neutrals**: Crisp cool grays for borders (`#E2E8F0`), table striping (`#F8FAFC`), and subtle hover states (`#F1F5F9`).

---

## 📏 Spacing & Typography

- **Grid Standard**: Strict 8-point grid system (`8px`, `16px`, `24px`, `32px`).
- **Typography**: Inter (System fallback: `system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`).
- **Animations**: Disabled by default. Zero micro-interactions or motion effects unless strictly meaningful (e.g. status transition indicators, loading state skeletons).

---

## 🛠️ Stack & Architectural Constraints

- **Frontend**: Next.js (App Router, Server/Client components, Vanilla/Custom CSS).
- **Backend API**: FastAPI (Python 3.11+, Pydantic v2, SQLAlchemy 2.0).
- **Database**: PostgreSQL (with PostGIS & pgvector extensions).
- **Module Building Strategy**: Build one module at a time with clean domain boundaries.

Every screen must look like software construction professionals use for real work every single day.
