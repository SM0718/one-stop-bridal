import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useWeddingStore } from '@/stores/wedding';
import { useUIStore } from '@/stores/ui';
import { FaithChooser, type FaithSelection } from '@/components/faith/FaithChooser';
import { Button } from '@/components/ui/button';
import { Field, Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Wordmark } from '@/components/navigation/Wordmark';
import { useDocumentMeta } from '@/hooks/useDocumentMeta';
import { getFaith } from '@/data/faiths';
import { routes } from '@/config/routes';
import { cn } from '@/lib/utils';

const STEPS = ['Your wedding', 'The practical details', 'Done'] as const;

/**
 * Onboarding.
 *
 * Two short steps, both skippable. The faith step is the one that matters —
 * everything after it is optional, because asking a couple for their budget
 * before showing them anything is how you lose them.
 */
export function OnboardingPage() {
  useDocumentMeta({
    title: 'Personalise your wedding',
    description:
      'Choose the faith or cultural context of your wedding and the platform adapts its collections, vendors and planning tools.',
    canonicalPath: routes.onboarding,
  });

  const [step, setStep] = useState(0);
  const [selection, setSelection] = useState<FaithSelection>({
    faith: null,
    secondaryFaiths: [],
    customFaithLabel: '',
  });
  const [date, setDate] = useState('');
  const [city, setCity] = useState('');
  const [guestCount, setGuestCount] = useState('');

  const updateProfile = useWeddingStore((s) => s.updateProfile);
  const setFaith = useWeddingStore((s) => s.setFaith);
  const completeOnboarding = useWeddingStore((s) => s.completeOnboarding);
  const syncTasks = useWeddingStore((s) => s.syncTasks);
  const openFaithPicker = useUIStore((s) => s.openFaithPicker);
  const navigate = useNavigate();

  const chosen = selection.faith ? getFaith(selection.faith) : null;

  function applyFaithAndContinue() {
    updateProfile({
      secondaryFaiths: selection.secondaryFaiths,
      customFaithLabel: selection.customFaithLabel,
    });
    setFaith(selection.faith, { reseedEvents: true });
    setStep(1);
  }

  function finish(destination: string) {
    updateProfile({
      weddingDate: date || null,
      city,
      guestCount: guestCount ? Number(guestCount) : null,
      onboarded: true,
    });
    syncTasks();
    completeOnboarding();
    void navigate({ href: destination });
  }

  function skipAll() {
    completeOnboarding();
    void navigate({ href: routes.home });
  }

  return (
    <div className="min-h-[calc(100dvh-4rem)]">
      <div className="container py-10 lg:py-16">
        <div className="mb-10 flex flex-wrap items-center justify-between gap-4">
          <Wordmark />
          <button type="button" onClick={skipAll} className="link-quiet text-sm text-ink-muted hover:text-ink">
            Skip for now
          </button>
        </div>

        <div className="mb-10 max-w-3xl">
          <nav aria-label="Progress">
            <ol className="flex flex-wrap items-center gap-x-5 gap-y-2 sm:gap-x-6">
              {STEPS.map((label, index) => (
                <li key={label} className="flex items-center gap-2.5">
                  <span
                    className={cn(
                      'text-2xs uppercase tracking-eyebrow',
                      index === step ? 'text-ink' : 'text-ink-muted',
                    )}
                  >
                    {index + 1}. {label}
                  </span>
                  {index < STEPS.length - 1 ? (
                    <span className="hidden h-px w-8 bg-border sm:block" aria-hidden="true" />
                  ) : null}
                </li>
              ))}
            </ol>
          </nav>
          <Progress
            value={((step + 1) / STEPS.length) * 100}
            className="mt-4 max-w-xs"
            aria-label={`Step ${step + 1} of ${STEPS.length}`}
          />
        </div>

        {step === 0 ? (
          <div className="max-w-4xl">
            <p className="eyebrow mb-3">Your wedding, your way</p>
            <h1 className="text-display-sm text-ink sm:text-display-md">What kind of wedding are you planning?</h1>
            <p className="mt-5 max-w-editorial text-[0.9375rem] leading-relaxed text-ink-soft">
              Pick the tradition closest to your wedding. This shapes the ceremonies we suggest, the collections and
              vendors you see first, and the tasks in your planner. You can change it at any time, and nothing is
              assumed about how you practise.
            </p>

            <div className="mt-10">
              <FaithChooser
                value={selection}
                onChange={setSelection}
                onConfirm={applyFaithAndContinue}
                confirmLabel="Continue"
              />
            </div>
          </div>
        ) : null}

        {step === 1 ? (
          <div className="max-w-2xl">
            <p className="eyebrow mb-3">Optional</p>
            <h1 className="text-display-sm text-ink sm:text-display-md">
              {chosen ? `A ${chosen.shortName.toLowerCase()} wedding` : 'Your wedding'} — a few practical details
            </h1>
            <p className="mt-5 text-[0.9375rem] leading-relaxed text-ink-soft">
              A date lets us build your timeline and fill in deadlines automatically. Skip anything you have not decided
              yet — you can add it later from your wedding profile.
            </p>

            <div className="mt-9 grid gap-5 sm:grid-cols-2">
              <Field label="Wedding date" htmlFor="wedding-date" hint="Approximate is fine.">
                <Input
                  id="wedding-date"
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  min={new Date().toISOString().slice(0, 10)}
                />
              </Field>

              <Field label="City" htmlFor="wedding-city" hint="Where the main ceremony will be held.">
                <Input
                  id="wedding-city"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="Mumbai"
                  maxLength={60}
                />
              </Field>

              <Field label="Approximate guest count" htmlFor="guest-count" hint="This affects budgets and venues.">
                <Input
                  id="guest-count"
                  type="number"
                  inputMode="numeric"
                  min={0}
                  value={guestCount}
                  onChange={(e) => setGuestCount(e.target.value)}
                  placeholder="250"
                />
              </Field>
            </div>

            <div className="mt-9 flex flex-wrap items-center gap-3">
              <Button size="lg" onClick={() => finish(routes.planning)}>
                Open my wedding plan
              </Button>
              <Button variant="outline" size="lg" onClick={() => setStep(2)}>
                Add these later
              </Button>
              <button
                type="button"
                onClick={() => {
                  openFaithPicker('onboarding');
                }}
                className="link-quiet text-sm text-ink-muted hover:text-ink"
              >
                Change my wedding context
              </button>
            </div>

            <p className="mt-8 max-w-editorial text-xs leading-relaxed text-ink-muted">
              We only ask for what the planner actually uses. Your wedding profile is stored on this device in this
              demonstration build and is never sent anywhere. See our privacy notice for what a live account would
              store.
            </p>
          </div>
        ) : null}

        {step === 2 ? (
          <div className="max-w-2xl">
            <p className="eyebrow mb-3">Ready</p>
            <h1 className="text-display-sm text-ink sm:text-display-md">
              Your wedding experience has been personalised
            </h1>
            <p className="mt-5 text-[0.9375rem] leading-relaxed text-ink-soft">
              {chosen
                ? `Collections, vendors and your checklist now lead with ${chosen.name} ceremonies and categories. Everything stays editable.`
                : 'You can choose your wedding context whenever you are ready.'}
            </p>

            <div className="mt-9 flex flex-wrap gap-3">
              <Button size="lg" onClick={() => finish(routes.collections)}>
                Explore your collections
              </Button>
              <Button variant="outline" size="lg" onClick={() => finish(routes.planning)}>
                Open your wedding plan
              </Button>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
