import { useEffect } from 'react';
import { ArrowRight } from 'iconsax-react';
import { useWeddingStore } from '@/stores/wedding';
import { useBridalBlueprint, useSaveBridalBlueprint } from '@/hooks/queries';
import { BridalBlueprintDialog, type BlueprintView } from './BridalBlueprintDialog';
import { Button } from '@/components/ui/button';

/**
 * Gate for the Bridal section.
 *
 * Mounted only on `/collections/bridal`. Until a Wedding Blueprint is either
 * completed or explicitly skipped it auto-opens the onboarding dialog. The
 * skip decision and any partial progress are persisted, so nothing is re-forced
 * and a reload resumes wherever the user left off.
 */
export function BridalBlueprintGate() {
  const blueprint = useWeddingStore((s) => s.blueprint);
  const draft = useWeddingStore((s) => s.draft);
  const blueprintSkipped = useWeddingStore((s) => s.blueprintSkipped);
  const blueprintOpen = useWeddingStore((s) => s.blueprintOpen);
  const openBridalBlueprint = useWeddingStore((s) => s.openBridalBlueprint);
  const closeBridalBlueprint = useWeddingStore((s) => s.closeBridalBlueprint);
  const setBlueprintDraft = useWeddingStore((s) => s.setBlueprintDraft);
  const completeBlueprint = useWeddingStore((s) => s.completeBlueprint);
  const restoreBlueprint = useWeddingStore((s) => s.restoreBlueprint);

  const { data: saved, isLoading } = useBridalBlueprint();
  const save = useSaveBridalBlueprint();

  /* Once the mock service has returned, merge its saved blueprint into the
     store when this device's store has nothing yet (hydration). */
  useEffect(() => {
    if (!isLoading && saved && !blueprint) restoreBlueprint(saved);
  }, [isLoading, saved, blueprint, restoreBlueprint]);

  const completed = Boolean(blueprint?.completed) || Boolean(saved?.completed);

  /* Auto-open the dialog on first entry, unless the blueprint is done or the
     user has explicitly skipped it. */
  useEffect(() => {
    if (!isLoading && !completed && !blueprintSkipped && !blueprintOpen) openBridalBlueprint();
  }, [isLoading, completed, blueprintSkipped, blueprintOpen, openBridalBlueprint]);

  /* Persist to the mock service whenever a blueprint is completed (or edited
     and re-completed) — the store stays the source of truth for the session. */
  useEffect(() => {
    if (blueprint?.completed && blueprint.completedAt) {
      save.mutate(blueprint);
    }
  }, [blueprint, save]);

  const step = draft.step;
  const startView: BlueprintView = draft.started && step >= 0 && step <= 3 ? (step as 0 | 1 | 2 | 3) : 'intro';

  return (
    <>
      {/* Skip prompt — only shown when the user explicitly declined, never forced. */}
      {!completed && blueprintSkipped ? (
        <div className="mt-6 flex flex-col gap-4 border border-border bg-background p-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="eyebrow">Personalise the Bridal Collection</p>
            <p className="mt-1.5 max-w-prose text-[0.9375rem] leading-relaxed text-ink-soft">
              Tell us which traditions, how soon, which events and a budget — the collection
              re-orders itself around your wedding. It takes about thirty seconds.
            </p>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <Button variant="outline" onClick={() => openBridalBlueprint()}>
              Build my Wedding Blueprint
              <ArrowRight size={16} variant="Linear" aria-hidden="true" />
            </Button>
          </div>
        </div>
      ) : null}

      <BridalBlueprintDialog
        open={blueprintOpen}
        draft={draft}
        startView={startView}
        onDraft={setBlueprintDraft}
        onSkip={() => closeBridalBlueprint({ skip: true })}
        onFinish={completeBlueprint}
      />
    </>
  );
}