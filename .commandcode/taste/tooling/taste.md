# Tooling preferences

- Prefers a React + TypeScript + Vite frontend stack. Confidence: 0.85
- Wants Tailwind CSS with shadcn/ui, but components heavily customized through a design system rather than left looking like a stock shadcn template. Confidence: 0.8
- Prefers Iconsax React icons over generic icon sets (e.g. Lucide). Confidence: 0.8
- Uses Framer Motion for animation (with restraint), and does not want heavy animation libraries beyond it. Confidence: 0.8
- Uses TanStack Router for routing and TanStack Query for server state. Confidence: 0.85
- Uses Zustand for client-side global state, explicitly keeping server state out of it. Confidence: 0.85
- Uses React Hook Form + Zod for all important forms and validation. Confidence: 0.85
- Uses date-fns where date logic is required. Confidence: 0.7
- Avoids unnecessary dependencies; treats bundle/package weight as something to minimize. Confidence: 0.8
- Wants fonts self-hosted (e.g. via @fontsource) with `font-display: swap` rather than relying on a render-blocking CDN font fetch. Confidence: 0.75
- Wants font-family kept as centralized Tailwind/theme tokens (`font-sans`, `font-display`) instead of arbitrary per-component font-family declarations. Confidence: 0.75
- Wants a service/API abstraction layer (e.g. productService, vendorService) with mock implementations that can later be swapped for a real REST/GraphQL/Supabase backend without rewriting UI. Confidence: 0.8
