import * as React from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { CloseCircle } from 'iconsax-react';
import type { BlueprintDraft } from '@/types';
import { track } from '@/lib/analytics';
import { BUDGET_LABEL, budgetTier, TIMELINE_LABEL } from '@/data/blueprint/config';
import { eventName } from '@/data/events';
import { formatDate } from '@/lib/format';
import {
  BLUEPRINT_STEPS,
  BLUEPRINT_STEP_TITLES,
  draftSummary,
  PARTNER_MODE_LABEL,
} from '@/components/blueprint/steps';
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';

type BlueprintView = 'intro' | 0 | 1 | 2 | 3 | 'summary';

export type { BlueprintView };

const STEP_VIEWS: (0 | 1 | 2 | 3)[] = [0, 1, 2, 3];

interface BridalBlueprintDialogProps {
  open: boolean;
  /** Current blueprint draft — kept in the store so progress survives reloads */
  draft: BlueprintDraft;
  /** Where resume/edit land before the flow starts */
  startView: BlueprintView;
  onDraft: (patch: Partial<BlueprintDraft>) => void;
  /** User closed/skipped the dialog */
  onSkip: () => void;
  /** The blueprint is complete — build + close */
  onFinish: () => void;
}

export function BridalBlueprintDialog({
  open,
  draft,
  startView,
  onDraft,
  onSkip,
  onFinish,
}: BridalBlueprintDialogProps) {
  const [view, setView] = React.useState<BlueprintView>('intro');
  const [direction, setDirection] = React.useState(1);
  const reduceMotion = useReducedMotion();
  const titleRef = React.useRef<HTMLHeadingElement>(null);
  const completedRef = React.useRef(false);

  /* Reset the flow every time the dialog opens, honouring the requested start. */
  React.useEffect(() => {
    if (open) {
      completedRef.current = false;
      setView(startView);
      setDirection(1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  /* Move focus to the step heading on every view change. preventScroll keeps the middle
     scroll container's scrollTop intact so the user's place isn't yanked back to the title
     after a click within the scrolling body. */
  React.useEffect(() => {
    titleRef.current?.focus({ preventScroll: true });
  }, [view]);

  function begin() {
    track('bridal_onboarding_started');
    /* Mark the flow as started so reloads resume at the right step instead of
       re-showing the intro. Persisted through the store's draft. */
    onDraft({ started: true });
    setDirection(1);
    setView(0);
  }

  function completeStep(patch: Partial<BlueprintDraft>) {
    onDraft(patch);
    if (typeof patch.step === 'number') {
      track('bridal_onboarding_step_completed', { step: patch.step });
      setDirection(1);
      setView(patch.step as BlueprintView);
    } else {
      setDirection(1);
      setView('summary');
    }
  }

  function goBack() {
    if (view === 'summary') {
      setDirection(-1);
      setView(0);
      return;
    }
    const idx = STEP_VIEWS.indexOf(view as 0 | 1 | 2 | 3);
    const next: BlueprintView = idx <= 0 ? 'intro' : STEP_VIEWS[idx - 1];
    setDirection(-1);
    setView(next);
  }

  function handleSkip() {
    track('bridal_onboarding_skipped');
    onSkip();
  }

  function handleFinish() {
    completedRef.current = true;
    track('bridal_onboarding_completed');
    onFinish();
  }

  const isStep = typeof view === 'number';
  const stepNumber = isStep ? (view as number) : null;
  const stepTitle = stepNumber !== null ? BLUEPRINT_STEP_TITLES[stepNumber] : null;

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        /* Programmatic closes (post-completion) must not mark the user as skipped. */
        if (!next && !completedRef.current) handleSkip();
      }}
    >
      <DialogContent
        hideClose
        className="inset-0 h-full max-h-[calc(100dvh-0px)] w-screen max-w-none translate-x-0 translate-y-0 border-0 overflow-hidden outline-none sm:inset-auto sm:left-1/2 sm:top-1/2 sm:h-auto sm:max-h-[calc(100dvh-2.5rem)] sm:w-[min(92vw,52rem)] sm:max-w-none sm:border-border sm:outline-none sm:-translate-x-1/2 sm:-translate-y-1/2"
      >
        <div className="flex h-full max-h-full min-h-0 flex-col">
          {/* Header */}
          <header className="flex items-center justify-between gap-4 border-b border-border px-6 py-5 sm:px-8">
            <div className="min-w-0">
              <p className="eyebrow mb-1.5">Bridal Blueprint</p>
              <DialogTitle ref={titleRef} tabIndex={-1} className="text-xl sm:text-2xl">
                {isStep ? stepTitle : view === 'intro' ? 'Your wedding.' : 'All set.'}
              </DialogTitle>
            </div>
            <button
              type="button"
              onClick={handleSkip}
              aria-label="Close and skip for now"
              className="flex h-9 w-9 shrink-0 items-center justify-center text-ink-muted transition-colors hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <CloseCircle size={22} variant="Linear" />
            </button>
          </header>

          {/* Body */}
          <div className="min-h-0 flex-1 overflow-y-auto px-6 py-6 sm:px-8 sm:py-7">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={String(view)}
                initial={reduceMotion ? false : { opacity: 0, x: direction * 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={reduceMotion ? undefined : { opacity: 0, x: direction * -20 }}
                transition={{ duration: 0.28, ease: 'easeOut' }}
              >
                {view === 'intro' ? (
                  <IntroScreen />
                ) : view === 'summary' ? (
                  <SummaryScreen draft={draft} />
                ) : (
                  (() => {
                    const Step = BLUEPRINT_STEPS[view as 0 | 1 | 2 | 3].component;
                    return <Step draft={draft} onComplete={completeStep} />;
                  })()
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Footer */}
          <footer className="border-t border-border bg-background px-6 py-4 sm:px-8">
            <div className="mb-3 flex items-center justify-between gap-4">
              {isStep ? (
                <>
                  <p className="text-xs text-ink-muted">
                    Step {stepNumber! + 1} of {STEP_VIEWS.length}
                  </p>
                  <p className="truncate text-xs text-ink-muted sm:hidden">{stepTitle}</p>
                </>
              ) : (
                <p className="text-xs text-ink-muted">{view === 'intro' ? 'About 30 seconds' : 'Your blueprint is saved'}</p>
              )}
            </div>
            <Progress
              value={
                view === 'intro'
                  ? 0
                  : view === 'summary'
                    ? 100
                    : ((STEP_VIEWS.indexOf(view as 0 | 1 | 2 | 3) + 1) / STEP_VIEWS.length) * 100
              }
              aria-hidden="true"
            />
            <div className="mt-4 flex items-center gap-3">
              {view === 'intro' ? (
                <>
                  <Button variant="ghost" onClick={handleSkip}>
                    Skip for now
                  </Button>
                  <Button onClick={begin}>Build my Wedding Blueprint</Button>
                </>
              ) : view === 'summary' ? (
                <>
                  <Button variant="ghost" onClick={goBack}>
                    Edit answers
                  </Button>
                  <Button onClick={handleFinish}>Show me the Bridal Collection</Button>
                </>
              ) : (
                <>
                  <Button variant="ghost" onClick={goBack}>
                    Back
                  </Button>
                  <Button type="submit" form={`bp-step-${view}`}>
                    Continue
                  </Button>
                </>
              )}
            </div>
          </footer>
        </div>
      </DialogContent>
    </Dialog>
  );
}

/* --------------------------------------------------------------------------
   Intro
   -------------------------------------------------------------------------- */

function IntroScreen() {
  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <p className="eyebrow">A personal blueprint</p>
        <h2 className="font-display text-3xl leading-tight text-ink sm:text-4xl">
          Tell us about your wedding.
        </h2>
        <p className="max-w-editorial text-[0.9375rem] leading-relaxed text-ink-soft">
          The Bridal Collection is better when it knows the shape of your celebration — which
          traditions, how soon, which events are yours, and a comfortable budget. It takes about
          thirty seconds and you can change everything later.
        </p>
      </div>

      <ol className="space-y-3 border-y border-border py-6">
        {[
          ['Cultural Roots', 'Choose the traditions that belong to your two sides'],
          ['The Timeline', 'Share a lead time or an exact date'],
          ['Your Wedding Events', 'Pick and order the celebrations you will actually host'],
          ['Wardrobe & Budget', 'Set the band for your wardrobe and accessories'],
        ].map(([label, copy], index) => (
          <li key={label} className="flex items-start gap-4">
            <span className="font-display text-lg text-gold">0{index + 1}</span>
            <div>
              <p className="text-[0.9375rem] font-medium text-ink">{label}</p>
              <p className="mt-0.5 text-sm text-ink-muted">{copy}</p>
            </div>
          </li>
        ))}
      </ol>

      <p className="max-w-editorial text-xs leading-relaxed text-ink-muted">
        Nothing here hides a thing. Your selections simply reorder and label the collection — every
        piece stays reachable, and you can refine or skip this whenever you like.
      </p>
    </div>
  );
}

/* --------------------------------------------------------------------------
   Summary
   -------------------------------------------------------------------------- */

function SummaryScreen({ draft }: { draft: BlueprintDraft }) {
  const summary = draftSummary(draft);
  const allNames = [...draft.eventIds.map(eventName), ...draft.customEventNames];
  const eventLabel =
    (allNames.slice(0, 4).join(' · ') +
      (allNames.length > 4 ? ` · +${allNames.length - 4} more` : '')) ||
    'Still to choose';

  const rows: { label: string; value: string }[] = [
    { label: 'Cultural roots', value: summary.cultural },
    { label: "Partner's side", value: summary.partner },
    {
      label: 'Timeline',
      value:
        draft.timeline.timeframe
          ? TIMELINE_LABEL[draft.timeline.timeframe]
          : draft.timeline.weddingDate
            ? formatDate(draft.timeline.weddingDate, 'short')
            : 'Not decided',
    },
    { label: 'Wedding events', value: eventLabel },
    {
      label: 'Wardrobe budget',
      value: draft.budget !== 'prefer-not-to-say' ? BUDGET_LABEL[draft.budget] : 'Prefer not to say',
    },
  ];

  return (
    <div className="space-y-7">
      <div className="space-y-3">
        <p className="eyebrow">Blueprint complete</p>
        <h2 className="font-display text-3xl leading-tight text-ink sm:text-4xl">
          Your wedding blueprint is ready.
        </h2>
        <p className="max-w-editorial text-[0.9375rem] leading-relaxed text-ink-soft">
          We are shaping the collection around your celebration. Change any answer later, and the
          page adjusts with it.
        </p>
      </div>

      <dl className="divide-y divide-border border-y border-border">
        {rows.map((row) => (
          <div
            key={row.label}
            className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 py-3"
          >
            <dt className="text-xs uppercase tracking-[0.12em] text-ink-muted">{row.label}</dt>
            <dd className="text-[0.9375rem] text-ink">{row.value}</dd>
          </div>
        ))}
      </dl>

      <p className="text-xs leading-relaxed text-ink-muted">
        Budget used to steer: <span className="text-ink">{budgetTier(draft.budget).range || 'your taste.'}</span>{' '}
        {draft.partner.mode === 'same'
          ? 'Same traditions on both sides.'
          : `Partner's side: ${PARTNER_MODE_LABEL[draft.partner.mode].toLowerCase()}.`}
      </p>
    </div>
  );
}