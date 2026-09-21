# Workflow preferences

- Before writing code: inspect the repository, determine the existing architecture, preserve useful existing code, and check which dependencies are already installed rather than reinstalling packages. Confidence: 0.8
- Expects verification via lint/typecheck/build (e.g. `tsc --noEmit`, `eslint`, `vite build`), with all errors fixed before finishing. Confidence: 0.85
- Does not want TODO placeholders for major functionality or fake buttons that do nothing; if a backend isn't ready, wants a realistic local/mock interaction so the demo still works. Confidence: 0.8
- Wants the whole product built, not just a landing page — every navigation item should lead somewhere meaningful. Confidence: 0.8
- Expects a final quality pass inspecting the UI at both desktop and mobile sizes/breakpoints. Confidence: 0.75
- Prefers work carried through to completion (pick up from where left off and finish) rather than stopping partway. Confidence: 0.7
- Writes detailed, prescriptive briefs with explicit "do not" constraints (e.g. no gradients, don't change the design), and expects the change confined to the named scope rather than an unrelated redesign. Confidence: 0.8
- When a section's UI reads as poor or "completely off", asks for it to be recreated rather than incrementally patched, while keeping the rest of the page untouched. Confidence: 0.6
