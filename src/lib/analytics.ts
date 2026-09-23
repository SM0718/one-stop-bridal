/**
 * Analytics abstraction.
 *
 * This demo connects to no provider. Every call hits a swappable sink that is a
 * no-op by default, so the event vocabulary and call sites are ready for a real
 * backend or analytics SDK. No sensitive personal data is tracked.
 */

export const ANALYTICS_EVENTS = {
  bridal_onboarding_started: 'bridal_onboarding_started',
  bridal_onboarding_step_completed: 'bridal_onboarding_step_completed',
  bridal_onboarding_skipped: 'bridal_onboarding_skipped',
  bridal_onboarding_completed: 'bridal_onboarding_completed',
  bridal_blueprint_updated: 'bridal_blueprint_updated',
  bridal_product_viewed: 'bridal_product_viewed',
} as const;

export type AnalyticEvent = keyof typeof ANALYTICS_EVENTS | (string & {});

type Sink = (event: string, props: Record<string, unknown>) => void;

/** No-op default. Wire a real provider here in production. */
let sink: Sink = () => {};

export function configureAnalytics(next: Sink): void {
  sink = next;
}

export function track(event: string, props: Record<string, unknown> = {}): void {
  sink(event, props);
}