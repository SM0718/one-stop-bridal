import { useState, useEffect } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useUIStore } from '@/stores/ui';
import { useWeddingStore } from '@/stores/wedding';
import { selectContext } from '@/stores/wedding';
import { getFaith } from '@/data/faiths';
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { FaithChooser, type FaithSelection } from './FaithChooser';

/**
 * The faith selector reached from the header. Changing context here reseeds the
 * event list when the couple has not yet customised it, and always re-syncs
 * planning tasks — but it never deletes tasks they have already written.
 */
export function FaithPickerDialog() {
  const open = useUIStore((s) => s.faithPickerOpen);
  const setOpen = useUIStore((s) => s.setFaithPickerOpen);
  const intent = useUIStore((s) => s.faithPickerIntent);

  const profile = useWeddingStore((s) => s.profile);
  const setFaith = useWeddingStore((s) => s.setFaith);
  const updateProfile = useWeddingStore((s) => s.updateProfile);
  const events = useWeddingStore((s) => s.events);
  const context = useWeddingStore(selectContext);
  const navigate = useNavigate();

  const [selection, setSelection] = useState<FaithSelection>({
    faith: profile.faith,
    secondaryFaiths: profile.secondaryFaiths,
    customFaithLabel: profile.customFaithLabel,
  });

  /* Keep the dialog in step when it is reopened after a change elsewhere */
  useEffect(() => {
    if (open) {
      setSelection({
        faith: profile.faith,
        secondaryFaiths: profile.secondaryFaiths,
        customFaithLabel: profile.customFaithLabel,
      });
    }
  }, [open, profile.faith, profile.secondaryFaiths, profile.customFaithLabel]);

  const hasCustomisedEvents = events.some((e) => e.custom) || events.length > 0;

  function apply() {
    updateProfile({
      secondaryFaiths: selection.secondaryFaiths,
      customFaithLabel: selection.customFaithLabel,
    });
    setFaith(selection.faith, { reseedEvents: !hasCustomisedEvents });
    setOpen(false);
    if (intent === 'planning') void navigate({ to: '/planning' });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <p className="eyebrow mb-2">Your wedding context</p>
          <DialogTitle>Which wedding are you planning?</DialogTitle>
          <DialogDescription>
            {context.primary.id !== 'CUSTOM'
              ? `Currently showing ${context.label}. Changing this updates your collections, vendors and checklist.`
              : 'Choose the traditions that shape your wedding.'}
          </DialogDescription>
        </DialogHeader>

        <DialogBody>
          <FaithChooser
            value={selection}
            onChange={setSelection}
            onConfirm={apply}
            confirmLabel={profile.faith ? 'Update my wedding' : 'Continue'}
            showConfirm
          />
        </DialogBody>
      </DialogContent>
    </Dialog>
  );
}

/**
 * The header control. Reads as a wedding context rather than a preference
 * setting, so it is legible the first time someone sees it.
 */
export function FaithSelectorButton({ className }: { className?: string }) {
  const openFaithPicker = useUIStore((s) => s.openFaithPicker);
  const faith = useWeddingStore((s) => s.profile.faith);
  const context = useWeddingStore(selectContext);

  const label = faith
    ? faith === 'CUSTOM'
      ? context.label
      : `${getFaith(faith).shortName} wedding`
    : 'Choose your wedding';

  return (
    <button
      type="button"
      onClick={() => openFaithPicker('header')}
      className={className}
      aria-label={faith ? `Wedding context: ${context.label}. Change it` : 'Choose your wedding faith or culture'}
    >
      <span
        aria-hidden="true"
        className="h-2 w-2 shrink-0 rounded-full"
        style={{ backgroundColor: context.primary.accent.hex }}
      />
      <span className="truncate">{label}</span>
    </button>
  );
}
