import { motion } from 'framer-motion';
import { TickCircle } from 'iconsax-react';
import type { FaithId } from '@/types';
import { SELECTABLE_FAITHS, TRADITION_FAITHS } from '@/data/faiths';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input, Field } from '@/components/ui/input';

export interface FaithSelection {
  faith: FaithId | null;
  secondaryFaiths: FaithId[];
  customFaithLabel: string;
}

interface FaithChooserProps {
  value: FaithSelection;
  onChange: (next: FaithSelection) => void;
  /** Called when the user confirms with "Continue" */
  onConfirm?: () => void;
  confirmLabel?: string;
  /** Header use is more compact than the onboarding experience */
  compact?: boolean;
  showConfirm?: boolean;
}

/**
 * Editorial tiles rather than illustrated cards. The tile is mostly typography:
 * the faith name in the display serif, a factual one-liner, and a restrained
 * swatch — never a cartoon icon standing in for a religion.
 */
export function FaithChooser({
  value,
  onChange,
  onConfirm,
  confirmLabel = 'Continue',
  compact = false,
  showConfirm = true,
}: FaithChooserProps) {
  const isInterfaith = value.faith === 'INTERFAITH';
  const isCustom = value.faith === 'CUSTOM';

  function select(faith: FaithId) {
    if (faith === 'INTERFAITH' || faith === 'CUSTOM') {
      onChange({ ...value, faith, secondaryFaiths: faith === 'INTERFAITH' ? value.secondaryFaiths : [] });
      return;
    }
    /* Selecting a tradition while already multi-faith adds to the set */
    if (value.faith === 'INTERFAITH') {
      const secondary = value.secondaryFaiths.includes(faith)
        ? value.secondaryFaiths.filter((f) => f !== faith)
        : [...value.secondaryFaiths, faith];
      onChange({ ...value, secondaryFaiths: secondary });
      return;
    }
    onChange({ ...value, faith, secondaryFaiths: [] });
  }

  const canConfirm =
    value.faith !== null &&
    (value.faith !== 'CUSTOM' || value.customFaithLabel.trim().length > 0) &&
    (value.faith !== 'INTERFAITH' || value.secondaryFaiths.length >= 2);

  return (
    <div className="space-y-7">
      <ul
        className={cn(
          'grid list-none gap-px overflow-hidden border border-border bg-border',
          compact ? 'sm:grid-cols-2' : 'sm:grid-cols-2 lg:grid-cols-3',
        )}
      >
        {SELECTABLE_FAITHS.map((faith, index) => {
          const selected = value.faith === faith.id;
          const isSecondary = value.secondaryFaiths.includes(faith.id);
          const active = selected || isSecondary;

          return (
            <motion.li
              key={faith.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.28, delay: Math.min(index * 0.025, 0.2), ease: [0.22, 0.61, 0.36, 1] }}
            >
              <button
                type="button"
                onClick={() => select(faith.id)}
                aria-pressed={active}
                style={
                  active
                    ? { backgroundColor: `${faith.accent.hex}1A`, boxShadow: `inset 2px 0 0 0 ${faith.accent.hex}` }
                    : undefined
                }
                className={cn(
                  'group relative flex h-full w-full flex-col items-start gap-2 p-5 text-left transition-colors duration-200',
                  active ? 'bg-background' : 'bg-background hover:bg-muted/70',
                )}
              >
                <span className="flex w-full items-start justify-between gap-3">
                  <span className="font-display text-xl leading-tight text-ink sm:text-2xl">{faith.name}</span>
                  {active ? (
                    <TickCircle
                      size={18}
                      variant="Linear"
                      className="mt-1 shrink-0"
                      style={{ color: faith.accent.hex }}
                      aria-hidden="true"
                    />
                  ) : (
                    <span
                      aria-hidden="true"
                      className="mt-1.5 h-3 w-3 shrink-0 rounded-full"
                      style={{ backgroundColor: faith.accent.hex }}
                    />
                  )}
                </span>
                <span className="text-[0.8125rem] leading-relaxed text-ink-soft">{faith.summary}</span>
                <span className="mt-auto pt-2 text-2xs uppercase tracking-eyebrow text-ink-muted">
                  {faith.regions.slice(0, 2).join(' · ')}
                </span>
              </button>
            </motion.li>
          );
        })}
      </ul>

      {isInterfaith ? (
        <div className="border border-border bg-muted/40 p-5">
          <h3 className="font-display text-xl text-ink">Which traditions are you combining?</h3>
          <p className="mt-1.5 text-sm text-ink-soft">
            Pick two or more. Events, tasks and vendor filters will be drawn from all of them.
          </p>
          <ul className="mt-4 flex flex-wrap gap-2">
            {TRADITION_FAITHS.map((faith) => {
              const chosen = value.secondaryFaiths.includes(faith.id);
              return (
                <li key={faith.id}>
                  <button
                    type="button"
                    onClick={() => select(faith.id)}
                    aria-pressed={chosen}
                    className={cn(
                      'border px-3.5 py-2 text-[0.8125rem] transition-colors',
                      chosen
                        ? 'border-ink bg-ink text-ivory'
                        : 'border-border bg-background text-ink-soft hover:border-ink/50 hover:text-ink',
                    )}
                  >
                    {faith.shortName}
                  </button>
                </li>
              );
            })}
          </ul>
          {value.secondaryFaiths.length < 2 ? (
            <p className="mt-3 text-xs text-ink-muted">Choose at least two traditions to continue.</p>
          ) : null}
        </div>
      ) : null}

      {isCustom ? (
        <Field
          label="What do you call your wedding?"
          htmlFor="custom-faith-label"
          hint="For example: a regional ceremony, a secular wedding, or a name your family uses."
          required
        >
          <Input
            id="custom-faith-label"
            value={value.customFaithLabel}
            onChange={(e) => onChange({ ...value, customFaithLabel: e.target.value })}
            placeholder="Our wedding"
            maxLength={80}
          />
        </Field>
      ) : null}

      <div className="flex flex-wrap items-center gap-3">
        {showConfirm ? (
          <Button size="lg" onClick={onConfirm} disabled={!canConfirm}>
            {confirmLabel}
          </Button>
        ) : null}
        <button
          type="button"
          onClick={() => onChange({ faith: null, secondaryFaiths: [], customFaithLabel: '' })}
          className="link-quiet text-sm text-ink-muted hover:text-ink"
        >
          I&rsquo;ll decide later
        </button>
      </div>

      <p className="max-w-editorial text-xs leading-relaxed text-ink-muted">
        Nothing you choose here is fixed. You can change your wedding context at any time from the header, and remove
        or rename any ceremony once your plan is created. We do not assume anything about how you practise.
      </p>
    </div>
  );
}
