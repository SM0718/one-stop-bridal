# Coding preferences

- Requires strict, modern TypeScript throughout; no JavaScript where TypeScript is appropriate and avoid `any`. Confidence: 0.85
- Prefers centralized, realistic TypeScript interfaces over types scattered through components. Confidence: 0.75
- Wants a data-driven / configuration-driven architecture: new capabilities should be addable via data/config without rewriting the application. Confidence: 0.8
- Does not want data hardcoded inside UI components; data/model logic belongs in data and service layers. Confidence: 0.8
- Keeps client state (Zustand) and server state (TanStack Query) clearly separated, with URL/search params representing filter/sort/search state where appropriate. Confidence: 0.8
- Prefers small, reusable components organized by domain folders; avoids gigantic components and multi-thousand-line page files. Confidence: 0.75
- Values semantic HTML and accessible components (ARIA labels, keyboard navigation, visible focus states, contrast, alt text, screen-reader support) and won't sacrifice accessibility for aesthetics. Confidence: 0.8
- Treats performance as a first-class requirement: route-level code splitting, lazy loading, responsive images, TanStack Query caching, minimal JavaScript. Confidence: 0.85
- Explicitly avoids canvas/WebGL/Three.js, autoplay video backgrounds, and huge SVG illustrations. Confidence: 0.8
- Uses CSS transforms for animation, avoids layout-triggering animations and layout shifts. Confidence: 0.75
- Respects `prefers-reduced-motion` and substantially reduces animation when it is enabled. Confidence: 0.8
- Does not want blind memoization — use React.memo only where it actually helps. Confidence: 0.65
- Prefers user-customizable defaults over hardcoded assumptions, especially for culturally sensitive configuration. Confidence: 0.7
