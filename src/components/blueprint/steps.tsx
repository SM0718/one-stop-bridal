import { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Add, ArrowDown2, ArrowUp2, CloseCircle } from 'iconsax-react';
import type {
  BlueprintBudget,
  BlueprintDraft,
  BlueprintTimeline,
  BridalBlueprint,
  PartnerContextMode,
} from '@/types';
import { TRADITION_FAITHS, getFaith } from '@/data/faiths';
import { culturalContextsFor } from '@/data/blueprint/cultures';
import { eventsForBlueprint } from '@/data/blueprint/events';
import { BUDGET_TIERS, TIMELINE_OPTIONS, TIMELINE_LABEL, budgetTier } from '@/data/blueprint/config';
import { eventName } from '@/data/events';
import { formatDate } from '@/lib/format';
import { cn } from '@/lib/utils';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Input, Field } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

/* ==========================================================================
   Shared primitives
   ========================================================================== */

export const BLUEPRINT_TIMELINE_VALUES: [BlueprintTimeline, ...BlueprintTimeline[]] = [
  'under-30-days',
  '1-3-months',
  '3-6-months',
  '6-12-months',
  '12-plus-months',
  'not-decided',
];

export const BLUEPRINT_BUDGET_VALUES: [BlueprintBudget, ...BlueprintBudget[]] = [
  'intimate',
  'classic',
  'grand',
  'prefer-not-to-say',
];

export const PARTNER_MODE_LABEL: Record<PartnerContextMode, string> = {
  same: 'Same as mine',
  different: 'Different tradition',
  interfaith: 'Interfaith',
  'not-specified': 'Prefer not to specify',
};

function Chip({
  label,
  checked,
  onToggle,
  disabled = false,
  hint,
}: {
  label: string;
  checked: boolean;
  onToggle: () => void;
  disabled?: boolean;
  hint?: string;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      disabled={disabled}
      aria-pressed={checked}
      className={cn(
        'border px-4 py-2.5 text-left transition-colors disabled:opacity-40',
        checked
          ? 'border-ink bg-ink text-ivory'
          : 'border-border bg-background text-ink-soft hover:border-ink/60 hover:text-ink',
      )}
    >
      <span className="block text-[0.9375rem]">{label}</span>
      {hint ? <span className={cn('mt-0.5 block text-xs', checked ? 'text-ivory/70' : 'text-ink-muted')}>{hint}</span> : null}
    </button>
  );
}

function StepHeading({ eyebrow, title, supporting }: { eyebrow: string; title: string; supporting?: string }) {
  return (
    <div>
      <p className="eyebrow mb-2">{eyebrow}</p>
      <h2 className="text-display-md text-ink">{title}</h2>
      {supporting ? <p className="mt-3 text-[0.9375rem] leading-relaxed text-ink-soft">{supporting}</p> : null}
    </div>
  );
}

/** The standard multi-select chip grid used for traditions and cultures. */
function ChipGrid({
  options,
  selected,
  onToggle,
  disabled = false,
  hintKey,
}: {
  options: { value: string; label: string; hint?: string }[];
  selected: string[];
  onToggle: (value: string) => void;
  disabled?: boolean;
  hintKey?: (value: string) => string | undefined;
}) {
  return (
    <div className="grid gap-2 sm:grid-cols-2">
      {options.map((option) => (
        <Chip
          key={option.value}
          label={option.label}
          hint={option.hint ?? (hintKey ? hintKey(option.value) : undefined)}
          checked={selected.includes(option.value)}
          onToggle={() => onToggle(option.value)}
          disabled={disabled}
        />
      ))}
    </div>
  );
}

/* ==========================================================================
   Draft <-> completed blueprint
   ========================================================================== */

/** Seeds an in-progress draft from a saved blueprint (used by Edit). */
export function seedDraftFromBlueprint(blueprint: BridalBlueprint): BlueprintDraft {
  return {
    started: false,
    step: 0,
    bride: { ...blueprint.bride },
    partner: { ...blueprint.partner },
    timeline: { timeframe: blueprint.timeline.timeframe, weddingDate: blueprint.timeline.weddingDate },
    eventIds: [...blueprint.events.eventIds],
    customEventNames: [...blueprint.events.customEventNames],
    budget: blueprint.budget,
  };
}

/** A short line describing what the couple selected, for the summary screen. */
export function draftSummary(draft: BlueprintDraft): { cultural: string; partner: string; timeline: string } {
  const brideFaith = draft.bride.faithIds.map((id) => getFaith(id).shortName).join(' + ');
  const brideCulture = draft.bride.culturalContexts.join(', ');
  const cultural = [brideCulture, brideFaith].filter(Boolean).join(' ') || (draft.bride.preferNotToSpecify ? 'Your wedding' : 'Not decided');
  const partner =
    draft.partner.mode === 'same'
      ? 'Same as yours'
      : draft.partner.mode === 'not-specified'
        ? 'Not specified'
        : [draft.partner.culturalContexts.join(', '), draft.partner.faithIds.map((id) => getFaith(id).shortName).join(' + ')]
            .filter(Boolean)
            .join(' ') || 'Not specified';
  const timeline = draft.timeline.timeframe
    ? TIMELINE_LABEL[draft.timeline.timeframe]
    : draft.timeline.weddingDate
      ? `Wedding on ${formatDate(draft.timeline.weddingDate, 'short')}`
      : 'Not decided';
  return { cultural, partner, timeline };
}

/* ==========================================================================
   Step 1 — Cultural Roots (includes the partner's side)
   ========================================================================== */

const culturesSchema = z
  .object({
    bride: z.object({
      faithIds: z.array(z.enum(['HINDU', 'MUSLIM', 'CHRISTIAN', 'SIKH', 'PARSI', 'JAIN', 'BUDDHIST', 'JEWISH', 'INTERFAITH', 'CUSTOM'])).default([]),
      culturalContexts: z.array(z.string()).default([]),
      preferNotToSpecify: z.boolean(),
      customActive: z.boolean(),
      customLabel: z.string().max(80, 'Keep this under 80 characters'),
    }),
    partner: z.object({
      mode: z.enum(['same', 'different', 'interfaith', 'not-specified']),
      faithIds: z.array(z.enum(['HINDU', 'MUSLIM', 'CHRISTIAN', 'SIKH', 'PARSI', 'JAIN', 'BUDDHIST', 'JEWISH', 'INTERFAITH', 'CUSTOM'])).default([]),
      culturalContexts: z.array(z.string()).default([]),
      preferNotToSpecify: z.boolean(),
      customActive: z.boolean(),
      customLabel: z.string().max(80, 'Keep this under 80 characters'),
    }),
  })
  .refine((d) => d.bride.preferNotToSpecify || d.bride.faithIds.length >= 1 || d.bride.customActive, {
    message: 'Choose at least one tradition, or prefer not to specify.',
    path: ['bride', 'faithIds'],
  })
  .refine(
    (d) =>
      (d.partner.mode !== 'different' && d.partner.mode !== 'interfaith') ||
      d.partner.preferNotToSpecify ||
      d.partner.faithIds.length >= 1 ||
      d.partner.customActive,
    { message: 'Choose a tradition, or prefer not to specify.', path: ['partner', 'faithIds'] },
  );

type CulturesValues = z.infer<typeof culturesSchema>;

const TRADITION_OPTIONS = TRADITION_FAITHS.map((f) => ({ value: f.id, label: f.name }));

function CulturesStep({
  draft,
  onComplete,
}: {
  draft: BlueprintDraft;
  onComplete: (patch: Partial<BlueprintDraft>) => void;
}) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    trigger,
    formState: { errors },
  } = useForm<CulturesValues>({
    resolver: zodResolver(culturesSchema),
    mode: 'onSubmit',
    defaultValues: {
      bride: {
        faithIds: draft.bride.faithIds,
        culturalContexts: draft.bride.culturalContexts,
        preferNotToSpecify: draft.bride.preferNotToSpecify,
        customActive: Boolean(draft.bride.customLabel),
        customLabel: draft.bride.customLabel,
      },
      partner: {
        mode: draft.partner.mode,
        faithIds: draft.partner.mode === 'same' ? draft.bride.faithIds : draft.partner.faithIds,
        culturalContexts: draft.partner.culturalContexts,
        preferNotToSpecify: draft.partner.preferNotToSpecify,
        customActive: Boolean(draft.partner.customLabel),
        customLabel: draft.partner.customLabel,
      },
    },
  });

  const bride = watch('bride');
  const partner = watch('partner');
  const brideFaithIds = useMemo(
    () => (bride.preferNotToSpecify ? [] : bride.faithIds),
    [bride.preferNotToSpecify, bride.faithIds],
  );
  const partnerFaithIds = useMemo(() => {
    if (partner.mode === 'same') return brideFaithIds;
    if (partner.mode === 'different' || partner.mode === 'interfaith') {
      return partner.preferNotToSpecify ? [] : partner.faithIds;
    }
    return [];
  }, [partner.mode, partner.preferNotToSpecify, partner.faithIds, brideFaithIds]);

  const brideCultures = useMemo(() => culturalContextsFor(brideFaithIds), [brideFaithIds]);
  const partnerCultures = useMemo(
    () => (partner.mode === 'same' ? [] : culturalContextsFor(partnerFaithIds)),
    [partnerFaithIds, partner.mode],
  );

  function toggleValue<T extends string>(ids: readonly T[], value: T): T[] {
    return ids.includes(value) ? ids.filter((v) => v !== value) : [...ids, value];
  }

  function submit(values: CulturesValues) {
    const same = values.partner.mode === 'same';
    onComplete({
      step: 1,
      bride: {
        faithIds: values.bride.preferNotToSpecify ? [] : values.bride.faithIds,
        culturalContexts: values.bride.preferNotToSpecify ? [] : values.bride.culturalContexts,
        preferNotToSpecify: values.bride.preferNotToSpecify,
        customLabel: values.bride.customActive ? values.bride.customLabel.trim() : '',
      },
      partner: {
        mode: values.partner.mode,
        faithIds: same ? [] : values.partner.preferNotToSpecify ? [] : values.partner.faithIds,
        culturalContexts: same ? [] : values.partner.preferNotToSpecify ? [] : values.partner.culturalContexts,
        preferNotToSpecify: values.partner.preferNotToSpecify,
        customLabel: values.partner.customActive ? values.partner.customLabel.trim() : '',
      },
      /* The celebrations depend on the cultural context, so they are re-chosen
         on the next step after any culture change. */
      eventIds: [],
      customEventNames: [],
    });
  }

  return (
    <form
      id="bp-step-0"
      onSubmit={(e) => {
        void handleSubmit(submit)(e);
      }}
      noValidate
      className="space-y-10"
    >
      <StepHeading
        eyebrow="01 — Cultural Roots"
        title="Which traditions are part of your wedding?"
        supporting="Choose one or more. Many couples bring two traditions together — the platform plans around all of them rather than making you pick a single label."
      />

      <div className="space-y-4">
        <ChipGrid
          options={TRADITION_OPTIONS}
          selected={bride.preferNotToSpecify ? [] : bride.faithIds}
          onToggle={(value) =>
            setValue('bride.faithIds', toggleValue(bride.faithIds, value as (typeof bride.faithIds)[number]), { shouldDirty: true })
          }
          disabled={bride.preferNotToSpecify}
        />
        <div className="grid gap-2 sm:grid-cols-2">
          <Chip
            label="Custom / regional tradition"
            checked={bride.customActive}
            onToggle={() => setValue('bride.customActive', !bride.customActive)}
            disabled={bride.preferNotToSpecify}
          />
          <Chip
            label="Prefer not to specify"
            checked={bride.preferNotToSpecify}
            onToggle={() =>
              setValue('bride.preferNotToSpecify', !bride.preferNotToSpecify, { shouldDirty: true })
            }
          />
        </div>
        {errors.bride?.faithIds ? (
          <p role="alert" className="text-xs text-destructive">
            {errors.bride.faithIds.message}
          </p>
        ) : null}
        {bride.customActive && !bride.preferNotToSpecify ? (
          <Field label="What do you call your tradition?" htmlFor="bp-bride-custom" hint="For example: a regional ceremony or a name your family uses.">
            <Input id="bp-bride-custom" placeholder="Our wedding" maxLength={80} {...register('bride.customLabel')} />
            {errors.bride?.customLabel ? (
              <p role="alert" className="text-xs text-destructive">
                {errors.bride.customLabel.message}
              </p>
            ) : null}
          </Field>
        ) : null}
      </div>

      {!bride.preferNotToSpecify && brideCultures.length > 0 && bride.faithIds.length > 0 ? (
        <div className="space-y-3 border-t border-border pt-8">
          <StepHeading
            eyebrow="Regional context"
            title="Which regional or cultural traditions are part of your wedding?"
            supporting="Pick whatever applies — nothing here is assumed because of the traditions above."
          />
          <ChipGrid
            options={brideCultures.map((c) => ({ value: c, label: c }))}
            selected={bride.culturalContexts}
            onToggle={(value) =>
              setValue(
                'bride.culturalContexts',
                toggleValue(bride.culturalContexts, value),
              )
            }
          />
        </div>
      ) : null}

      <div className="space-y-5 border-t border-border pt-8">
        <StepHeading
          eyebrow="Your partner's side"
          title="What traditions are part of your partner's side?"
        />
        <RadioGroup
          value={partner.mode}
          onValueChange={(value) => {
            setValue('partner.mode', value as PartnerContextMode, { shouldDirty: true });
            if (value === 'same' || value === 'not-specified') {
              setValue('partner.faithIds', []);
              setValue('partner.culturalContexts', []);
            }
            void trigger('partner.faithIds');
          }}
          className="grid gap-3 sm:grid-cols-2"
        >
          <RadioGroupItem
            value="same"
            label="Same as mine"
            hint="Both sides share the same traditions"
            className="col-span-1"
          />
          <RadioGroupItem
            value="different"
            label="Different tradition"
            hint="One tradition has been chosen above"
            className="col-span-1"
          />
          <RadioGroupItem
            value="interfaith"
            label="Interfaith"
            hint="Two traditions, one wedding"
            className="col-span-1"
          />
          <RadioGroupItem
            value="not-specified"
            label="Prefer not to specify"
            className="col-span-1"
          />
        </RadioGroup>

        {partner.mode === 'different' || partner.mode === 'interfaith' ? (
          <div className="space-y-4">
            <ChipGrid
              options={TRADITION_OPTIONS}
              selected={partner.preferNotToSpecify ? [] : partner.faithIds}
              onToggle={(value) =>
                setValue('partner.faithIds', toggleValue(partner.faithIds, value as (typeof partner.faithIds)[number]))
              }
              disabled={partner.preferNotToSpecify}
            />
            <Chip
              label="Prefer not to specify"
              checked={partner.preferNotToSpecify}
              onToggle={() => setValue('partner.preferNotToSpecify', !partner.preferNotToSpecify)}
            />
            <Chip
              label="Custom / regional tradition"
              checked={partner.customActive}
              onToggle={() => setValue('partner.customActive', !partner.customActive)}
              disabled={partner.preferNotToSpecify}
            />
            {errors.partner?.faithIds ? (
              <p role="alert" className="text-xs text-destructive">
                {errors.partner.faithIds.message}
              </p>
            ) : null}
            {partner.customActive && !partner.preferNotToSpecify ? (
              <Field label="What do you call your partner's tradition?" htmlFor="bp-partner-custom">
                <Input id="bp-partner-custom" placeholder="Their tradition" maxLength={80} {...register('partner.customLabel')} />
              </Field>
            ) : null}
            {partnerCultures.length > 0 && partner.faithIds.length > 0 ? (
              <ChipGrid
                options={partnerCultures.map((c) => ({ value: c, label: c }))}
                selected={partner.culturalContexts}
                onToggle={(value) =>
                  setValue(
                    'partner.culturalContexts',
                    toggleValue(partner.culturalContexts, value),
                  )
                }
              />
            ) : null}
          </div>
        ) : null}
      </div>
    </form>
  );
}

/* ==========================================================================
   Step 2 — The Timeline
   ========================================================================== */

const timelineSchema = z.object({
  timeframe: z.enum(BLUEPRINT_TIMELINE_VALUES, { errorMap: () => ({ message: 'Choose a timeframe' }) }),
  weddingDate: z.string().nullable(),
});

type TimelineValues = z.infer<typeof timelineSchema>;

function TimelineStep({
  draft,
  onComplete,
}: {
  draft: BlueprintDraft;
  onComplete: (patch: Partial<BlueprintDraft>) => void;
}) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<TimelineValues>({
    resolver: zodResolver(timelineSchema),
    mode: 'onSubmit',
    defaultValues: { timeframe: draft.timeline.timeframe ?? undefined, weddingDate: draft.timeline.weddingDate },
  });

  const chosen = watch('timeframe');

  function submit(values: TimelineValues) {
    onComplete({
      step: 2,
      timeline: { timeframe: values.timeframe, weddingDate: values.weddingDate || null },
    });
  }

  return (
    <form
      id="bp-step-1"
      onSubmit={(e) => {
        void handleSubmit(submit)(e);
      }}
      noValidate
      className="space-y-9"
    >
      <StepHeading
        eyebrow="02 — The Timeline"
        title="When is your big day?"
        supporting="We use the lead time to prioritise pieces you can actually have in hand — ready-to-ship when the date is close, couture when there is time."
      />

      <RadioGroup
        value={chosen}
        onValueChange={(value) => setValue('timeframe', value as BlueprintTimeline, { shouldDirty: true })}
        className="grid gap-3 sm:grid-cols-2"
      >
        {TIMELINE_OPTIONS.map((option) => (
          <RadioGroupItem
            key={option.value}
            id={`bp-time-${option.value}`}
            value={option.value}
            label={option.label}
          />
        ))}
      </RadioGroup>
      {errors.timeframe ? (
        <p role="alert" className="text-xs text-destructive">
          {errors.timeframe.message}
        </p>
      ) : null}

      <div className="border-t border-border pt-8">
        <Field
          label="Or a specific date (optional)"
          htmlFor="bp-wedding-date"
          hint="Only if you have one. You can leave this blank and add it later."
        >
          <Input id="bp-wedding-date" type="date" min={new Date().toISOString().slice(0, 10)} {...register('weddingDate')} />
        </Field>
      </div>
    </form>
  );
}

/* ==========================================================================
   Step 3 — Your Wedding Events
   ========================================================================== */

const eventsSchema = z.object({
  eventIds: z.array(z.string()).default([]),
  customEventNames: z.array(z.string()).default([]),
});

type EventsValues = z.infer<typeof eventsSchema>;

function EventsStep({
  draft,
  onComplete,
}: {
  draft: BlueprintDraft;
  onComplete: (patch: Partial<BlueprintDraft>) => void;
}) {
  const candidates = useMemo(
    () => eventsForBlueprint(draft.bride, draft.partner, draft.partner.mode),
    // These are compared by value so culture changes yield fresh candidates
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [draft.bride.faithIds.join(','), draft.partner.faithIds.join(','), draft.partner.mode, draft.bride.customLabel, draft.partner.customLabel],
  );
  const [customDraftName, setCustomDraftName] = useState('');

  const {
    handleSubmit,
    setValue,
    watch,
    register,
  } = useForm<EventsValues>({
    resolver: zodResolver(eventsSchema),
    mode: 'onSubmit',
    defaultValues: { eventIds: draft.eventIds, customEventNames: draft.customEventNames },
  });

  const eventIds = watch('eventIds') ?? [];
  const customNames = watch('customEventNames') ?? [];
  const available = candidates.filter((c) => !eventIds.includes(c.id));

  function toggleEvent(id: string) {
    const has = eventIds.includes(id);
    setValue('eventIds', has ? eventIds.filter((v) => v !== id) : [...eventIds, id], { shouldDirty: true });
  }

  function addCustom() {
    const name = customDraftName.trim();
    if (!name || customNames.includes(name)) return;
    setValue('customEventNames', [...customNames, name]);
    setCustomDraftName('');
  }

  function submit(values: EventsValues) {
    onComplete({ step: 3, eventIds: values.eventIds, customEventNames: values.customEventNames });
  }

  interface OrderedEntry {
    key: string;
    index: number;
    label: string;
    kind: 'event' | 'custom';
  }

  const ordered: OrderedEntry[] = [
    ...eventIds.map((id, i) => ({ key: `e:${i}`, index: i, label: eventName(id), kind: 'event' as const })),
    ...customNames.map((name, i) => ({ key: `c:${i}`, index: i, label: name, kind: 'custom' as const })),
  ];

  function move(index: number, direction: -1 | 1) {
    const next = [...ordered];
    const target = index + direction;
    if (target < 0 || target >= next.length) return;
    const [moved] = next.splice(index, 1);
    next.splice(target, 0, moved);
    setValue(
      'eventIds',
      next.filter((e) => e.kind === 'event').map((e) => eventIds[e.index]),
    );
    setValue(
      'customEventNames',
      next.filter((e) => e.kind === 'custom').map((e) => customNames[e.index]),
    );
  }

  function removeEntry(entry: OrderedEntry) {
    if (entry.kind === 'event') {
      setValue(
        'eventIds',
        eventIds.filter((_, i) => i !== entry.index),
      );
    } else {
      setValue(
        'customEventNames',
        customNames.filter((_, i) => i !== entry.index),
      );
    }
  }

  return (
    <form
      id="bp-step-2"
      onSubmit={(e) => {
        void handleSubmit(submit)(e);
      }}
      noValidate
      className="space-y-9"
    >
      <StepHeading
        eyebrow="03 — Your Wedding Events"
        title="Which celebrations are you styling?"
        supporting="These are drawn from the traditions you chose. Reorder them in the way your wedding will actually run — the order powers your wardrobe, checklist and timeline."
      />

      {ordered.length > 0 ? (
        <ol className="space-y-0 border border-border">
          {ordered.map((entry, index) => (
            <li key={entry.key} className="flex items-center justify-between gap-3 border-b border-border px-4 py-3 last:border-b-0">
              <span className="flex items-center gap-3">
                <span className="font-display text-lg text-ink-muted">{index + 1}</span>
                <span className="text-[0.9375rem] text-ink">{entry.label}</span>
              </span>
              <span className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => move(index, -1)}
                  disabled={index === 0}
                  aria-label={`Move ${entry.label} earlier`}
                  className="flex h-8 w-8 items-center justify-center text-ink-muted transition-colors hover:text-ink disabled:opacity-30"
                >
                  <ArrowUp2 size={16} variant="Linear" />
                </button>
                <button
                  type="button"
                  onClick={() => move(index, 1)}
                  disabled={index === ordered.length - 1}
                  aria-label={`Move ${entry.label} later`}
                  className="flex h-8 w-8 items-center justify-center text-ink-muted transition-colors hover:text-ink disabled:opacity-30"
                >
                  <ArrowDown2 size={16} variant="Linear" />
                </button>
                <button
                  type="button"
                  onClick={() => removeEntry(entry)}
                  aria-label={`Remove ${entry.label}`}
                  className="flex h-8 w-8 items-center justify-center text-ink-muted transition-colors hover:text-destructive"
                >
                  <CloseCircle size={16} variant="Linear" />
                </button>
              </span>
            </li>
          ))}
        </ol>
      ) : (
        <p className="border border-dashed border-border px-4 py-6 text-sm text-ink-muted">
          Nothing selected yet — choose from the list below, or add an event of your own.
        </p>
      )}

      {available.length > 0 ? (
        <div className="space-y-3">
          <p className="eyebrow">Add celebrations</p>
          <div className="grid gap-2 sm:grid-cols-2">
            {available.map((option) => (
              <button
                key={option.id}
                type="button"
                onClick={() => toggleEvent(option.id)}
                className="group border border-border bg-background px-4 py-3 text-left transition-colors hover:border-ink/50"
              >
                <span className="block text-[0.9375rem] text-ink">{option.name}</span>
                <span className="mt-0.5 block text-xs leading-relaxed text-ink-muted">{option.summary}</span>
              </button>
            ))}
          </div>
        </div>
      ) : null}

      <div className="flex items-end gap-2">
        <Field label="Add a custom event" htmlFor="bp-custom-event" className="flex-1">
          <Input
            id="bp-custom-event"
            value={customDraftName}
            onChange={(e) => setCustomDraftName(e.target.value)}
            placeholder="Rehearsal dinner, mehndi night…"
            maxLength={60}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                addCustom();
              }
            }}
          />
        </Field>
        <Button type="button" variant="outline" onClick={addCustom} aria-label="Add custom event">
          <Add size={16} variant="Linear" />
          Add
        </Button>
      </div>

      <input type="hidden" {...register('customEventNames')} />
    </form>
  );
}

/* ==========================================================================
   Step 4 — Wardrobe & Accessory Budget
   ========================================================================== */

const budgetSchema = z.object({
  budget: z.enum(BLUEPRINT_BUDGET_VALUES),
});

type BudgetValues = z.infer<typeof budgetSchema>;

function BudgetStep({
  draft,
  onComplete,
}: {
  draft: BlueprintDraft;
  onComplete: (patch: Partial<BlueprintDraft>) => void;
}) {
  const {
    handleSubmit,
    setValue,
    watch,
  } = useForm<BudgetValues>({
    resolver: zodResolver(budgetSchema),
    mode: 'onSubmit',
    defaultValues: { budget: draft.budget },
  });

  const chosen = watch('budget');

  function submit(values: BudgetValues) {
    onComplete({ budget: values.budget });
  }

  return (
    <form
      id="bp-step-3"
      onSubmit={(e) => {
        void handleSubmit(submit)(e);
      }}
      noValidate
      className="space-y-9"
    >
      <StepHeading
        eyebrow="04 — Wardrobe & Accessory Budget"
        title="What's your total budget across your chosen events?"
        supporting="These are recommendation bands, not judgements — we use them to steer which pieces and designers appear first. You can keep the whole catalogue in view either way."
      />

      <RadioGroup
        value={chosen}
        onValueChange={(value) => setValue('budget', value as BlueprintBudget, { shouldDirty: true })}
        className="space-y-3"
      >
        {BUDGET_TIERS.map((tier) => (
          <RadioGroupItem
            key={tier.value}
            id={`bp-budget-${tier.value}`}
            value={tier.value}
            label={
              <span className="flex w-full flex-wrap items-center justify-between gap-2">
                <span>{tier.name}</span>
                {tier.range ? <span className="text-xs font-normal text-ink-muted">{tier.range}</span> : null}
              </span>
            }
          />
        ))}
      </RadioGroup>

      <p className="max-w-editorial text-xs leading-relaxed text-ink-muted">
        Everything you choose here stays editable, and your budget band never hides a piece — enquiry-only couture appears in every band.
      </p>
    </form>
  );
}

/* ==========================================================================
   Step registry
   ========================================================================== */

export const BLUEPRINT_STEP_TITLES = ['Cultural Roots', 'The Timeline', 'Your Wedding Events', 'Wardrobe & Budget'] as const;

export const BLUEPRINT_STEPS = [
  { id: 0, title: 'Cultural Roots', component: CulturesStep },
  { id: 1, title: 'The Timeline', component: TimelineStep },
  { id: 2, title: 'Your Wedding Events', component: EventsStep },
  { id: 3, title: 'Wardrobe & Budget', component: BudgetStep },
] as const;

export type { BlueprintBudget };
export { budgetTier };