import { Outlet } from '@tanstack/react-router';

/**
 * Wraps the catalogue and vendor routes. Keeps their shared vertical rhythm in
 * one place; individual pages own their own headers and grids.
 */
export function MarketplaceLayout() {
  return (
    <div className="pb-section">
      <Outlet />
    </div>
  );
}
