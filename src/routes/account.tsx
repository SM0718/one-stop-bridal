import { useState } from 'react';
import { Link, useNavigate } from '@tanstack/react-router';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { Logout } from 'iconsax-react';
import { type z } from 'zod';
import { passwordSchema, profileSchema, signInSchema, signUpSchema } from '@/lib/validations';
import { FAITH_IDS } from '@/types';
import { getFaith } from '@/data/faiths';
import { STYLE_PREFERENCES, CURRENCIES } from '@/data/planning';
import { routes } from '@/config/routes';
import { useAuthStore } from '@/stores/auth';
import { useWeddingStore } from '@/stores/wedding';
import { useWeddingContext } from '@/hooks/queries';
import { useDocumentMeta } from '@/hooks/useDocumentMeta';
import { useWishlistStore } from '@/stores/wishlist';
import { formatCount, formatDate, formatPrice } from '@/lib/format';
import { selectBudgetTotals } from '@/stores/wedding';
// The task-progress selector was only used by the checklist preview, which was
// commented out for this bridal-only build.
// import { selectTaskProgress } from '@/stores/wedding';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Switch } from '@/components/ui/switch';
import { Field, Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { EmptyState } from '@/components/ui/empty-state';
import { FaithSelectorButton } from '@/components/faith/FaithPickerDialog';
// The checklist progress bar was commented out for this bridal-only build.
// import { Progress } from '@/components/ui/progress';

/* ==========================================================================
   Sign-in gate shared by the account screens
   ========================================================================== */

function SignInPanel() {
  const signIn = useAuthStore((s) => s.signIn);
  const signUp = useAuthStore((s) => s.signUp);
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');

  if (mode === 'signup') {
    return <SignUpForm onSwitch={() => setMode('signin')} onSubmit={signUp} />;
  }

  return (
    <div className="max-w-md">
      <h2 className="font-display text-2xl text-ink">Sign in</h2>
      <p className="mt-2 text-sm leading-relaxed text-ink-soft">
        Keep your wedding profile, saved pieces and plan together. Everything works without an account too — an account
        keeps it across devices.
      </p>

      <form
        className="mt-6 space-y-5"
        onSubmit={async (e) => {
          e.preventDefault();
          const data = new FormData(e.currentTarget as HTMLFormElement);
          const parsed = signInSchema.safeParse({
            email: String(data.get('email') ?? ''),
            password: String(data.get('password') ?? ''),
          });
          if (!parsed.success) {
            toast.error(parsed.error.issues[0]?.message ?? 'Check your details');
            return;
          }
          await signIn(parsed.data.email, 'Ananya');
          toast.success('Signed in', { description: 'Demo session — nothing was verified or transmitted.' });
        }}
      >
        <Field label="Email" htmlFor="signin-email" required>
          <Input id="signin-email" name="email" type="email" autoComplete="email" placeholder="you@example.com" />
        </Field>
        <Field label="Password" htmlFor="signin-password" required>
          <Input id="signin-password" name="password" type="password" autoComplete="current-password" />
        </Field>
        <Button type="submit" size="lg" full>
          Sign in
        </Button>
      </form>

      <p className="mt-6 border-t border-border pt-5 text-sm text-ink-soft">
        New here?{' '}
        <button type="button" onClick={() => setMode('signup')} className="link-quiet text-ink">
          Create an account
        </button>
      </p>

      <p className="mt-5 text-xs leading-relaxed text-ink-muted">
        This is a demonstration build. Authentication is simulated in the browser: no credentials are transmitted or
        verified, and any valid-looking email and 8-character password will sign you in.
      </p>
    </div>
  );
}

function SignUpForm({
  onSwitch,
  onSubmit,
}: {
  onSwitch: () => void;
  onSubmit: (input: { email: string; firstName: string; lastName: string }) => Promise<unknown>;
}) {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<z.input<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
  });

  return (
    <div className="max-w-md">
      <h2 className="font-display text-2xl text-ink">Create an account</h2>
      <p className="mt-2 text-sm leading-relaxed text-ink-soft">
        We ask for the minimum: a name so we can address you properly, and an email to sign in with.
      </p>

      <form
        className="mt-6 space-y-5"
        onSubmit={handleSubmit(async (values) => {
          const parsed = signUpSchema.parse(values);
          await onSubmit({ email: parsed.email, firstName: parsed.firstName, lastName: parsed.lastName });
          toast.success('Account created', { description: 'Demo account — stored locally in your browser only.' });
        })}
        noValidate
      >
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="First name" htmlFor="su-first" required error={errors.firstName?.message}>
            <Input id="su-first" {...register('firstName')} autoComplete="given-name" />
          </Field>
          <Field label="Last name" htmlFor="su-last" required error={errors.lastName?.message}>
            <Input id="su-last" {...register('lastName')} autoComplete="family-name" />
          </Field>
        </div>

        <Field label="Email" htmlFor="su-email" required error={errors.email?.message}>
          <Input id="su-email" type="email" {...register('email')} autoComplete="email" />
        </Field>

        <Field
          label="Password"
          htmlFor="su-password"
          required
          hint="At least 8 characters, with a capital letter and a number."
          error={errors.password?.message}
        >
          <Input id="su-password" type="password" {...register('password')} autoComplete="new-password" />
        </Field>

        <Field label="Confirm password" htmlFor="su-confirm" required error={errors.confirmPassword?.message}>
          <Input id="su-confirm" type="password" {...register('confirmPassword')} autoComplete="new-password" />
        </Field>

        <Controller
          control={control}
          name="acceptTerms"
          render={({ field }) => (
            <div>
              <Checkbox
                id="su-terms"
                checked={field.value === true}
                onCheckedChange={(checked) => field.onChange(checked === true ? true : undefined)}
                label={
                  <>
                    I agree to the{' '}
                    <Link to={routes.terms} className="underline decoration-gold/50 underline-offset-2">
                      terms
                    </Link>{' '}
                    and{' '}
                    <Link to={routes.privacy} className="underline decoration-gold/50 underline-offset-2">
                      privacy notice
                    </Link>
                    .
                  </>
                }
              />
              {errors.acceptTerms ? (
                <p role="alert" className="mt-1.5 text-xs text-destructive">
                  {errors.acceptTerms.message}
                </p>
              ) : null}
            </div>
          )}
        />

        <Button type="submit" size="lg" full disabled={isSubmitting}>
          {isSubmitting ? 'Creating…' : 'Create account'}
        </Button>
      </form>

      <p className="mt-6 border-t border-border pt-5 text-sm text-ink-soft">
        Already have an account?{' '}
        <button type="button" onClick={onSwitch} className="link-quiet text-ink">
          Sign in
        </button>
      </p>
    </div>
  );
}

/* ==========================================================================
   Overview
   ========================================================================== */

export function AccountOverviewPage() {
  useDocumentMeta({ title: 'Your account', canonicalPath: routes.account });

  const user = useAuthStore((s) => s.user);
  const signOut = useAuthStore((s) => s.signOut);
  const context = useWeddingContext();
  const profile = useWeddingStore((s) => s.profile);
  const budget = useWeddingStore(selectBudgetTotals);
  const savedCount = useWishlistStore((s) => s.items.length);
  const resetWedding = useWeddingStore((s) => s.resetWedding);
  const navigate = useNavigate();

  if (!user) return <SignInPanel />;

  return (
    <div className="space-y-10">
      <section aria-labelledby="wedding-summary">
        <h2 id="wedding-summary" className="eyebrow mb-4">
          Your wedding
        </h2>
        <div className="border border-border p-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="font-display text-2xl text-ink">{context.label}</p>
              <p className="mt-2 text-sm text-ink-soft">
                {profile.weddingDate ? formatDate(profile.weddingDate, 'long') : 'No date set yet'}
                {profile.city ? ` · ${profile.city}` : ''}
                {profile.guestCount ? ` · ${profile.guestCount} guests` : ''}
              </p>
            </div>
            <FaithSelectorButton className="inline-flex items-center gap-2 border border-border px-3 py-2 text-xs text-ink transition-colors hover:border-ink" />
          </div>

          <dl className="mt-6 grid gap-6 border-t border-border pt-5 sm:grid-cols-3">
            <div>
              <dt className="eyebrow">Ceremonies</dt>
              <dd className="mt-1.5 font-display text-xl text-ink">{context.events.length}</dd>
            </div>
            {/* The checklist/tasks stat was commented out for this bridal-only build. */}
            {/* <div>
              <dt className="eyebrow">Tasks done</dt>
              <dd className="mt-1.5 font-display text-xl text-ink">
                {tasks.done}/{tasks.total}
              </dd>
            </div> */}
            <div>
              <dt className="eyebrow">Budget</dt>
              <dd className="mt-1.5 font-display text-xl text-ink">
                {budget.allocated > 0 ? formatPrice(budget.allocated) : 'Not set'}
              </dd>
            </div>
            <div>
              <dt className="eyebrow">Saved</dt>
              <dd className="mt-1.5 font-display text-xl text-ink">{savedCount}</dd>
            </div>
          </dl>

          {/* The checklist progress bar was commented out for this bridal-only build. */}
          {/* <Progress value={tasks.percent} className="mt-5" aria-label="Checklist progress" /> */}

          <div className="mt-6 flex flex-wrap gap-3">
            {/* The planner link was commented out for this bridal-only build. */}
            {/* <Button asChild variant="outline" size="sm">
              <Link to={routes.planning}>Open the planner</Link>
            </Button> */}
            <Button asChild variant="outline" size="sm">
              <Link to={routes.accountProfile}>Edit wedding profile</Link>
            </Button>
          </div>
        </div>
      </section>

      <section aria-labelledby="account-actions">
        <h2 id="account-actions" className="eyebrow mb-4">
          Account
        </h2>
        <div className="divide-y divide-border border-y border-border">
          <div className="flex flex-wrap items-center justify-between gap-4 py-4">
            <div>
              <p className="text-sm text-ink">Signed in as</p>
              <p className="mt-0.5 text-xs text-ink-muted">{user.email}</p>
            </div>
            <button
              type="button"
              onClick={() => {
                signOut();
                toast.success('Signed out');
              }}
              className="inline-flex items-center gap-2 text-sm text-ink-muted transition-colors hover:text-ink"
            >
              <Logout size={16} variant="Linear" />
              Sign out
            </button>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4 py-4">
            <div>
              <p className="text-sm text-ink">Delete this wedding plan</p>
              <p className="mt-0.5 max-w-xl text-xs leading-relaxed text-ink-muted">
                Removes your wedding profile, ceremonies, tasks, budget and guest list from this device. Saved items are
                kept. This cannot be undone.
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                if (!window.confirm('Delete your wedding plan? This cannot be undone.')) return;
                resetWedding();
                toast.success('Wedding plan deleted');
                void navigate({ href: routes.home });
              }}
            >
              Delete plan
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}

/* ==========================================================================
   Wedding profile
   ========================================================================== */

export function AccountProfilePage() {
  useDocumentMeta({ title: 'Wedding profile', canonicalPath: routes.accountProfile });

  const user = useAuthStore((s) => s.user);
  const profile = useWeddingStore((s) => s.profile);
  const updateProfile = useWeddingStore((s) => s.updateProfile);
  const setFaith = useWeddingStore((s) => s.setFaith);
  const toggleSecondary = useWeddingStore((s) => s.toggleSecondaryFaith);
  const completeOnboarding = useWeddingStore((s) => s.completeOnboarding);
  // The 'run personalisation again' action was commented out for this bridal-only build.
  // const restartOnboarding = useWeddingStore((s) => s.restartOnboarding);
  // The personalisation flow was commented out for this bridal-only build.
  // const navigate = useNavigate();

  if (!user) return <SignInPanel />;

  return (
    <div className="max-w-2xl space-y-10">
      <section>
        <h2 className="font-display text-2xl text-ink">Wedding profile</h2>
        <p className="mt-2 text-sm leading-relaxed text-ink-soft">
          Everything here can be changed at any time. We ask for the things the planner and your recommendations
          actually use, and nothing else.
        </p>
      </section>

      <section className="space-y-5 border-t border-border pt-8">
        <h3 className="eyebrow">Wedding context</h3>
        <ul className="flex flex-wrap gap-2">
          {FAITH_IDS.map((faithId) => (
            <li key={faithId}>
              <button
                type="button"
                onClick={() => setFaith(faithId, { reseedEvents: true })}
                aria-pressed={profile.faith === faithId}
                className={
                  profile.faith === faithId
                    ? 'border border-ink bg-ink px-3.5 py-2 text-[0.8125rem] text-ivory'
                    : 'border border-border px-3.5 py-2 text-[0.8125rem] text-ink-soft transition-colors hover:border-ink hover:text-ink'
                }
              >
                {getFaith(faithId).shortName}
              </button>
            </li>
          ))}
        </ul>

        <div>
          <p className="text-[0.8125rem] font-medium text-ink">Additional traditions</p>
          <p className="mt-1 text-xs text-ink-muted">
            For weddings that combine traditions. Selecting a second tradition merges its ceremonies and categories into
            your plan.
          </p>
          <ul className="mt-3 flex flex-wrap gap-2">
            {FAITH_IDS.filter((f) => f !== profile.faith && f !== 'CUSTOM' && f !== 'INTERFAITH').map((faithId) => {
              const active = profile.secondaryFaiths.includes(faithId);
              return (
                <li key={faithId}>
                  <button
                    type="button"
                    onClick={() => toggleSecondary(faithId)}
                    aria-pressed={active}
                    className={
                      active
                        ? 'border border-ink bg-ink px-3 py-1.5 text-xs text-ivory'
                        : 'border border-border px-3 py-1.5 text-xs text-ink-soft transition-colors hover:border-ink hover:text-ink'
                    }
                  >
                    {getFaith(faithId).shortName}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>

        {profile.faith === 'CUSTOM' ? (
          <Field label="What do you call your wedding?" htmlFor="profile-custom">
            <Input
              id="profile-custom"
              value={profile.customFaithLabel}
              onChange={(e) => updateProfile({ customFaithLabel: e.target.value })}
              maxLength={80}
            />
          </Field>
        ) : null}
      </section>

      <section className="grid gap-5 border-t border-border pt-8 sm:grid-cols-2">
        <h3 className="eyebrow sm:col-span-2">Practical details</h3>

        <Field label="Wedding date" htmlFor="profile-date">
          <Input
            id="profile-date"
            type="date"
            value={profile.weddingDate ?? ''}
            onChange={(e) => updateProfile({ weddingDate: e.target.value || null })}
          />
        </Field>

        <Field label="Guest count" htmlFor="profile-guests">
          <Input
            id="profile-guests"
            type="number"
            min={0}
            value={profile.guestCount ?? ''}
            onChange={(e) => updateProfile({ guestCount: e.target.value ? Number(e.target.value) : null })}
          />
        </Field>

        <Field label="City" htmlFor="profile-city">
          <Input
            id="profile-city"
            value={profile.city}
            onChange={(e) => updateProfile({ city: e.target.value })}
          />
        </Field>

        <Field label="Country" htmlFor="profile-country">
          <Input
            id="profile-country"
            value={profile.country}
            onChange={(e) => updateProfile({ country: e.target.value })}
          />
        </Field>

        <Field label="Currency" htmlFor="profile-currency" hint="Used for budgets and price display.">
          <Select
            value={profile.currency}
            onValueChange={(value) => updateProfile({ currency: value as typeof profile.currency })}
          >
            <SelectTrigger id="profile-currency">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {CURRENCIES.map((currency) => (
                <SelectItem key={currency.code} value={currency.code}>
                  {currency.label} ({currency.symbol})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>
      </section>

      <section className="border-t border-border pt-8">
        <h3 className="eyebrow mb-3">Style preferences</h3>
        <p className="text-xs text-ink-muted">
          Used to order recommendations. None of these are restrictions.
        </p>
        <ul className="mt-4 flex flex-wrap gap-2">
          {STYLE_PREFERENCES.map((style) => {
            const active = profile.stylePreferences.includes(style);
            return (
              <li key={style}>
                <button
                  type="button"
                  aria-pressed={active}
                  onClick={() =>
                    updateProfile({
                      stylePreferences: active
                        ? profile.stylePreferences.filter((s) => s !== style)
                        : [...profile.stylePreferences, style],
                    })
                  }
                  className={
                    active
                      ? 'border border-ink bg-ink px-3 py-1.5 text-xs text-ivory'
                      : 'border border-border px-3 py-1.5 text-xs text-ink-soft transition-colors hover:border-ink hover:text-ink'
                  }
                >
                  {style}
                </button>
              </li>
            );
          })}
        </ul>
      </section>

      <section className="flex flex-wrap items-center gap-4 border-t border-border pt-8">
        <Button
          onClick={() => {
            completeOnboarding();
            toast.success('Wedding profile saved');
          }}
        >
          Save changes
        </Button>
        {/* The personalisation flow was commented out for this bridal-only build. */}
        {/* <Button
          variant="ghost"
          onClick={() => {
            restoreOnboarding();
            void navigate({ href: routes.onboarding });
          }}
        >
          Run the personalisation again
        </Button> */}
      </section>
    </div>
  );
}

/* ==========================================================================
   Saved collection management
   ========================================================================== */

export function AccountWishlistPage() {
  useDocumentMeta({ title: 'Your collections', canonicalPath: routes.accountWishlist });

  const user = useAuthStore((s) => s.user);
  const collections = useWishlistStore((s) => s.collections);
  const items = useWishlistStore((s) => s.items);
  const createCollection = useWishlistStore((s) => s.createCollection);
  const renameCollection = useWishlistStore((s) => s.renameCollection);
  const removeCollection = useWishlistStore((s) => s.removeCollection);
  const [name, setName] = useState('');

  if (!user) return <SignInPanel />;

  return (
    <div className="space-y-8">
      <section>
        <h2 className="font-display text-2xl text-ink">Saved collections</h2>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-ink-soft">
          Organise saved pieces, vendors and reading into collections that mean something to you. Renaming or removing a
          collection never deletes what is inside it.
        </p>
      </section>

      <ul className="divide-y divide-border border-y border-border">
        {collections.map((collection) => {
          const count = items.filter((i) => i.collectionId === collection.id).length;
          return (
            <li key={collection.id} className="flex flex-wrap items-center justify-between gap-4 py-4">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-3">
                  <input
                    value={collection.name}
                    onChange={(e) => renameCollection(collection.id, e.target.value)}
                    aria-label={`Rename ${collection.name}`}
                    className="w-full max-w-sm border-b border-transparent bg-transparent py-0.5 text-sm text-ink outline-none transition-colors focus:border-ink"
                  />
                  {collection.system ? <Badge variant="outline">Suggested</Badge> : null}
                </div>
                <p className="mt-1 text-xs text-ink-muted">
                  {formatCount(count, 'item')} · {collection.description || 'Your own collection'}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Button asChild variant="outline" size="sm">
                  <Link to={routes.wishlist}>Open</Link>
                </Button>
                {!collection.system ? (
                  <button
                    type="button"
                    onClick={() => removeCollection(collection.id)}
                    className="text-xs text-ink-muted underline decoration-gold/50 underline-offset-2 hover:text-destructive"
                  >
                    Remove
                  </button>
                ) : null}
              </div>
            </li>
          );
        })}
      </ul>

      <form
        className="flex flex-wrap items-end gap-3"
        onSubmit={(e) => {
          e.preventDefault();
          if (!name.trim()) return;
          createCollection(name.trim());
          setName('');
          toast.success('Collection created');
        }}
      >
        <Field label="New collection" htmlFor="new-collection" className="w-full sm:w-72">
          <Input
            id="new-collection"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Reception outfits"
            maxLength={60}
          />
        </Field>
        <Button type="submit" variant="outline">
          Create
        </Button>
      </form>
    </div>
  );
}

/* ==========================================================================
   Saved items
   ========================================================================== */

export function AccountSavedPage() {
  useDocumentMeta({ title: 'Saved items', canonicalPath: routes.accountSaved });

  const user = useAuthStore((s) => s.user);
  const items = useWishlistStore((s) => s.items);
  const remove = useWishlistStore((s) => s.remove);
  const moveTo = useWishlistStore((s) => s.moveToCollection);
  const collections = useWishlistStore((s) => s.collections);

  if (!user) return <SignInPanel />;

  if (items.length === 0) {
    return (
      <EmptyState
        title="Nothing saved yet"
        description="Save pieces, vendors and guides as you browse and they will collect here, ready to organise."
        action={
          <Button asChild>
            <Link to={routes.collections}>Browse collections</Link>
          </Button>
        }
      />
    );
  }

  return (
    <div className="space-y-8">
      <section>
        <h2 className="font-display text-2xl text-ink">All saved items</h2>
        <p className="mt-2 text-sm text-ink-soft">{formatCount(items.length, 'item')} saved.</p>
      </section>

      <ul className="divide-y divide-border border-y border-border">
        {items.map((item) => (
          <li key={item.id} className="flex flex-wrap items-center justify-between gap-4 py-4">
            <div className="min-w-0">
              <p className="text-sm text-ink capitalize">
                {item.kind} · {item.refId}
              </p>
              <p className="mt-0.5 text-xs text-ink-muted">Saved {formatDate(item.savedAt, 'short')}</p>
            </div>
            <div className="flex items-center gap-3">
              <label className="sr-only" htmlFor={`move-${item.id}`}>
                Move to collection
              </label>
              <select
                id={`move-${item.id}`}
                value={item.collectionId}
                onChange={(e) => moveTo(item.kind, item.refId, e.target.value)}
                className="border border-border bg-pearl px-2.5 py-1.5 text-xs text-ink-soft focus:border-ink focus:outline-none"
              >
                {collections.map((collection) => (
                  <option key={collection.id} value={collection.id}>
                    {collection.name}
                  </option>
                ))}
              </select>
              <button
                type="button"
                onClick={() => remove(item.kind, item.refId)}
                className="text-xs text-ink-muted underline decoration-gold/50 underline-offset-2 hover:text-destructive"
              >
                Remove
              </button>
            </div>
          </li>
        ))}
      </ul>

      <Button asChild variant="outline">
        <Link to={routes.wishlist}>View as cards</Link>
      </Button>
    </div>
  );
}

/* ==========================================================================
   Preferences
   ========================================================================== */

export function AccountPreferencesPage() {
  useDocumentMeta({ title: 'Preferences', canonicalPath: routes.accountPreferences });

  const user = useAuthStore((s) => s.user);
  const updateUser = useAuthStore((s) => s.updateUser);
  const [notifications, setNotifications] = useState({ checklist: true, enquiries: true, editorial: false });
  const [analytics, setAnalytics] = useState(true);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isSubmitSuccessful },
  } = useForm<z.input<typeof profileSchema>>({
    resolver: zodResolver(profileSchema),
    values: user
      ? {
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          phone: user.phone,
          city: user.city,
          country: user.country,
          marketingOptIn: user.marketingOptIn,
        }
      : undefined,
  });

  if (!user) return <SignInPanel />;

  return (
    <div className="max-w-2xl space-y-12">
      <section>
        <h2 className="font-display text-2xl text-ink">Your details</h2>
        <form
          className="mt-6 grid gap-5 sm:grid-cols-2"
          onSubmit={handleSubmit((values) => {
            const parsed = profileSchema.parse(values);
            updateUser({
              firstName: parsed.firstName,
              lastName: parsed.lastName,
              email: parsed.email,
              phone: parsed.phone,
              city: parsed.city,
              country: parsed.country,
              marketingOptIn: parsed.marketingOptIn,
            });
            toast.success('Details saved');
          })}
          noValidate
        >
          <Field label="First name" htmlFor="pref-first" required error={errors.firstName?.message}>
            <Input id="pref-first" {...register('firstName')} />
          </Field>
          <Field label="Last name" htmlFor="pref-last" required error={errors.lastName?.message}>
            <Input id="pref-last" {...register('lastName')} />
          </Field>
          <Field label="Email" htmlFor="pref-email" required error={errors.email?.message}>
            <Input id="pref-email" type="email" {...register('email')} />
          </Field>
          <Field label="Phone" htmlFor="pref-phone" error={errors.phone?.message}>
            <Input id="pref-phone" {...register('phone')} />
          </Field>
          <Field label="City" htmlFor="pref-city">
            <Input id="pref-city" {...register('city')} />
          </Field>
          <Field label="Country" htmlFor="pref-country">
            <Input id="pref-country" {...register('country')} />
          </Field>

          <div className="sm:col-span-2">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Saving…' : isSubmitSuccessful ? 'Saved' : 'Save details'}
            </Button>
          </div>
        </form>
      </section>

      <section className="border-t border-border pt-8">
        <h2 className="font-display text-2xl text-ink">Notifications</h2>
        <p className="mt-2 text-sm text-ink-soft">
          Choose what you want to hear about. Nothing here is used for advertising.
        </p>
        <ul className="mt-6 divide-y divide-border">
          {[
            { key: 'checklist' as const, label: 'Checklist reminders', body: 'A nudge when a task is coming due.' },
            { key: 'enquiries' as const, label: 'Replies to my enquiries', body: 'When a retailer responds to you.' },
            { key: 'editorial' as const, label: 'New guides for my wedding', body: 'Occasional reading for your traditions.' },
          ].map((item) => (
            <li key={item.key} className="flex items-center justify-between gap-6 py-4">
              <div>
                <p className="text-sm text-ink">{item.label}</p>
                <p className="mt-0.5 text-xs text-ink-muted">{item.body}</p>
              </div>
              <Switch
                checked={notifications[item.key]}
                onCheckedChange={(checked) => setNotifications((prev) => ({ ...prev, [item.key]: checked }))}
                aria-label={item.label}
              />
            </li>
          ))}
        </ul>
      </section>

      <section className="border-t border-border pt-8">
        <h2 className="font-display text-2xl text-ink">Privacy</h2>
        <dl className="mt-6 space-y-5">
          <div className="flex items-start justify-between gap-6">
            <div>
              <dt className="text-sm text-ink">Anonymous usage analytics</dt>
              <dd className="mt-0.5 max-w-md text-xs leading-relaxed text-ink-muted">
                Helps us see which guides and categories are useful. We would never sell this data.
              </dd>
            </div>
            <Switch
              checked={analytics}
              onCheckedChange={setAnalytics}
              aria-label="Anonymous usage analytics"
            />
          </div>
        </dl>

        <div className="mt-8 flex flex-wrap gap-3">
          <Button asChild variant="outline" size="sm">
            <Link to={routes.privacy}>Read the privacy notice</Link>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() =>
              toast.success('Export requested', {
                description: 'In a live build this would email you a copy of your data.',
              })
            }
          >
            Request a copy of my data
          </Button>
        </div>
      </section>

      <section className="border-t border-border pt-8">
        <h2 className="font-display text-xl text-ink">Change password</h2>
        <form
          className="mt-5 grid max-w-md gap-5"
          onSubmit={async (e) => {
            e.preventDefault();
            const data = new FormData(e.currentTarget as HTMLFormElement);
            const parsed = passwordSchema.safeParse({
              currentPassword: String(data.get('current') ?? ''),
              newPassword: String(data.get('next') ?? ''),
              confirmPassword: String(data.get('confirm') ?? ''),
            });
            if (!parsed.success) {
              toast.error(parsed.error.issues[0]?.message ?? 'Check your passwords');
              return;
            }
            toast.success('Password changed', { description: 'Demonstration only — nothing was stored.' });
          }}
        >
          <Field label="Current password" htmlFor="pw-current" required>
            <Input id="pw-current" name="current" type="password" autoComplete="current-password" />
          </Field>
          <Field label="New password" htmlFor="pw-next" required>
            <Input id="pw-next" name="next" type="password" autoComplete="new-password" />
          </Field>
          <Field label="Confirm new password" htmlFor="pw-confirm" required>
            <Input id="pw-confirm" name="confirm" type="password" autoComplete="new-password" />
          </Field>
          <Button type="submit" variant="outline">
            Update password
          </Button>
        </form>
      </section>
    </div>
  );
}
