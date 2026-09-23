import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type {
  BlueprintDraft,
  BridalBlueprint,
  BudgetLine,
  FaithId,
  Guest,
  PlanningTask,
  WeddingEventPlan,
  WeddingProfile,
} from '@/types';
import { resolveWeddingContext } from '@/data/faiths';
import { DEFAULT_BUDGET_SPLIT, phaseFromMonthsBefore } from '@/data/planning';
import { suggestEventDate } from '@/lib/format';

export const EMPTY_BLUEPRINT_DRAFT: BlueprintDraft = {
  started: false,
  step: 0,
  bride: { faithIds: [], culturalContexts: [], preferNotToSpecify: false, customLabel: '' },
  partner: {
    faithIds: [],
    culturalContexts: [],
    preferNotToSpecify: false,
    customLabel: '',
    mode: 'not-specified',
  },
  timeline: { timeframe: null, weddingDate: null },
  eventIds: [],
  customEventNames: [],
  budget: 'prefer-not-to-say',
};

const EMPTY_PROFILE: WeddingProfile = {
  faith: null,
  secondaryFaiths: [],
  customFaithLabel: '',
  weddingDate: null,
  city: '',
  country: '',
  guestCount: null,
  budgetTotal: null,
  currency: 'INR',
  stylePreferences: [],
  onboarded: false,
};

interface WeddingState {
  profile: WeddingProfile;
  events: WeddingEventPlan[];
  tasks: PlanningTask[];
  budgetLines: BudgetLine[];
  guests: Guest[];

  /* Bridal blueprint (personalisation onboarding) */
  blueprint: BridalBlueprint | null;
  draft: BlueprintDraft;
  blueprintSkipped: boolean;
  /** Ephemeral UI flag — intentionally not persisted */
  blueprintOpen: boolean;
  openBridalBlueprint: () => void;
  closeBridalBlueprint: (options?: { skip?: boolean }) => void;
  setBlueprintDraft: (patch: Partial<BlueprintDraft>) => void;
  completeBlueprint: () => void;
  restoreBlueprint: (blueprint: BridalBlueprint) => void;
  resetBlueprint: () => void;

  setFaith: (faith: FaithId | null, options?: { reseedEvents?: boolean }) => void;
  toggleSecondaryFaith: (faith: FaithId) => void;
  setCustomFaithLabel: (label: string) => void;
  updateProfile: (patch: Partial<WeddingProfile>) => void;
  completeOnboarding: () => void;
  restartOnboarding: () => void;

  reseedEvents: () => void;
  addEventFromTemplateId: (templateId: string) => void;
  addCustomEvent: (name: string) => void;
  updateEvent: (id: string, patch: Partial<WeddingEventPlan>) => void;
  removeEvent: (id: string) => void;
  moveEvent: (id: string, direction: -1 | 1) => void;

  syncTasks: () => void;
  addTask: (task: Omit<PlanningTask, 'id' | 'completed' | 'custom'> & { id?: string }) => void;
  updateTask: (id: string, patch: Partial<PlanningTask>) => void;
  toggleTask: (id: string) => void;
  removeTask: (id: string) => void;
  clearCompletedTasks: () => void;

  setBudgetTotal: (total: number | null) => void;
  addBudgetLine: (line: Omit<BudgetLine, 'id'>) => void;
  updateBudgetLine: (id: string, patch: Partial<BudgetLine>) => void;
  removeBudgetLine: (id: string) => void;

  addGuest: (guest: Omit<Guest, 'id'>) => void;
  updateGuest: (id: string, patch: Partial<Guest>) => void;
  removeGuest: (id: string) => void;

  resetWedding: () => void;
}

function makeId(prefix: string): string {
  return `${prefix}-${Math.random().toString(36).slice(2, 9)}-${Date.now().toString(36)}`;
}

/** Builds the event plan for a faith context, keeping any user dates. */
function eventsFromContext(profile: WeddingProfile, existing: WeddingEventPlan[]): WeddingEventPlan[] {
  const context = resolveWeddingContext(profile.faith, profile.secondaryFaiths, profile.customFaithLabel);
  const byTemplate = new Map(existing.map((e) => [e.templateId ?? e.id, e]));

  return context.events.map((template) => {
    const previous = byTemplate.get(template.id);
    return {
      id: previous?.id ?? makeId('evt'),
      templateId: template.id,
      name: template.name,
      date: previous?.date ?? suggestEventDate(profile.weddingDate, template.typicalOffsetDays),
      time: previous?.time ?? null,
      venue: previous?.venue ?? '',
      guestCount: previous?.guestCount ?? null,
      budget: previous?.budget ?? null,
      notes: previous?.notes ?? '',
      audience: template.audience,
      custom: false,
    };
  });
}

export const useWeddingStore = create<WeddingState>()(
  persist(
    (set, get) => ({
      profile: EMPTY_PROFILE,
      events: [],
      tasks: [],
      budgetLines: [],
      guests: [],

      blueprint: null,
      draft: EMPTY_BLUEPRINT_DRAFT,
      blueprintSkipped: false,
      blueprintOpen: false,

      openBridalBlueprint: () => set({ blueprintOpen: true }),

      closeBridalBlueprint: (options) =>
        set((state) => ({
          blueprintOpen: false,
          /* Skipping (or closing) deliberately marks the blueprint as declined
             so the onboarding is not re-forced on every visit. */
          blueprintSkipped: options?.skip ? true : state.blueprintSkipped,
        })),

      setBlueprintDraft: (patch) => {
        const merged: BlueprintDraft = {
          ...get().draft,
          ...patch,
          bride: { ...get().draft.bride, ...(patch.bride ?? {}) },
          partner: { ...get().draft.partner, ...(patch.partner ?? {}) },
          timeline: { ...get().draft.timeline, ...(patch.timeline ?? {}) },
        };
        set({ draft: merged });
      },

      completeBlueprint: () => {
        const { draft, blueprint } = get();
        const brideIds = draft.bride.preferNotToSpecify ? [] : draft.bride.faithIds;
        const partnerIds =
          draft.partner.mode === 'same'
            ? brideIds
            : draft.partner.mode === 'different' || draft.partner.mode === 'interfaith'
              ? draft.partner.preferNotToSpecify
                ? []
                : draft.partner.faithIds
              : [];
        const traditionIds = [...brideIds, ...partnerIds.filter((id) => !brideIds.includes(id))];
        const customLabel = [draft.bride.customLabel, draft.partner.customLabel].filter(Boolean).join(' + ');

        const next: BridalBlueprint = {
          id: blueprint?.id ?? `bp-${Math.random().toString(36).slice(2, 9)}`,
          bride: { ...draft.bride },
          partner: { ...draft.partner, faithIds: draft.partner.mode === 'same' ? brideIds : draft.partner.faithIds },
          timeline: { timeframe: draft.timeline.timeframe, weddingDate: draft.timeline.weddingDate },
          events: { eventIds: [...draft.eventIds], customEventNames: [...draft.customEventNames] },
          budget: draft.budget,
          completed: true,
          completedAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        /* Feed the existing personalisation machinery: the primary tradition
           becomes the catalogue faith and the rest ride along as secondary, so
           every existing filter/context responds immediately. */
        const profilePatch: Partial<WeddingProfile> = {
          faith: (traditionIds[0] as FaithId | null) ?? null,
          secondaryFaiths: traditionIds.slice(1) as FaithId[],
          customFaithLabel: customLabel,
          weddingDate: draft.timeline.weddingDate,
        };
        set({
          blueprint: next,
          profile: { ...get().profile, ...profilePatch },
          blueprintSkipped: false,
          blueprintOpen: false,
          draft: EMPTY_BLUEPRINT_DRAFT,
        });
      },

      restoreBlueprint: (blueprint) =>
        set((state) => ({
          blueprint,
          blueprintSkipped: blueprint.completed ? false : state.blueprintSkipped,
        })),

      resetBlueprint: () =>
        set({ blueprint: null, blueprintSkipped: false, draft: EMPTY_BLUEPRINT_DRAFT }),

      setFaith: (faith, options) => {
        const { events, profile } = get();
        const nextProfile: WeddingProfile = { ...profile, faith };
        const shouldSeed = options?.reseedEvents ?? events.length === 0;
        set({
          profile: nextProfile,
          ...(shouldSeed ? { events: eventsFromContext(nextProfile, events) } : {}),
        });
        get().syncTasks();
      },

      toggleSecondaryFaith: (faith) => {
        const { profile } = get();
        const has = profile.secondaryFaiths.includes(faith);
        const secondaryFaiths = has
          ? profile.secondaryFaiths.filter((f) => f !== faith)
          : [...profile.secondaryFaiths, faith];
        set({ profile: { ...profile, secondaryFaiths } });
        get().syncTasks();
      },

      setCustomFaithLabel: (label) => set({ profile: { ...get().profile, customFaithLabel: label } }),

      updateProfile: (patch) => set({ profile: { ...get().profile, ...patch } }),

      completeOnboarding: () => set({ profile: { ...get().profile, onboarded: true } }),

      restartOnboarding: () => set({ profile: { ...get().profile, onboarded: false } }),

      reseedEvents: () => {
        const { profile, events } = get();
        set({ events: eventsFromContext(profile, events) });
        get().syncTasks();
      },

      addEventFromTemplateId: (templateId) => {
        const { profile, events } = get();
        const context = resolveWeddingContext(profile.faith, profile.secondaryFaiths, profile.customFaithLabel);
        const template = context.events.find((e) => e.id === templateId);
        if (!template || events.some((e) => e.templateId === templateId)) return;
        set({
          events: [
            ...events,
            {
              id: makeId('evt'),
              templateId: template.id,
              name: template.name,
              date: suggestEventDate(profile.weddingDate, template.typicalOffsetDays),
              time: null,
              venue: '',
              guestCount: null,
              budget: null,
              notes: template.summary,
              audience: template.audience,
              custom: false,
            },
          ],
        });
        get().syncTasks();
      },

      addCustomEvent: (name) => {
        const { profile, events } = get();
        set({
          events: [
            ...events,
            {
              id: makeId('evt'),
              templateId: null,
              name,
              date: profile.weddingDate,
              time: null,
              venue: '',
              guestCount: null,
              budget: null,
              notes: '',
              audience: 'couple',
              custom: true,
            },
          ],
        });
      },

      updateEvent: (id, patch) =>
        set({ events: get().events.map((e) => (e.id === id ? { ...e, ...patch } : e)) }),

      removeEvent: (id) =>
        set({
          events: get().events.filter((e) => e.id !== id),
          /* Tasks tied to a removed event become general tasks rather than
             disappearing, so nothing the couple wrote is lost. */
          tasks: get().tasks.map((t) => (t.eventId === id ? { ...t, eventId: undefined } : t)),
        }),

      moveEvent: (id, direction) => {
        const events = [...get().events];
        const index = events.findIndex((e) => e.id === id);
        const target = index + direction;
        if (index === -1 || target < 0 || target >= events.length) return;
        const [moved] = events.splice(index, 1);
        events.splice(target, 0, moved);
        set({ events });
      },

      syncTasks: () => {
        const { profile, tasks, events } = get();
        const context = resolveWeddingContext(profile.faith, profile.secondaryFaiths, profile.customFaithLabel);
        const existingIds = new Set(tasks.map((t) => t.id));
        const eventDates = new Map(events.map((e) => [e.templateId ?? e.id, e.date]));

        const additions: PlanningTask[] = [];
        for (const seed of context.checklist) {
          const taskId = `task-${seed.id}`;
          if (existingIds.has(taskId)) continue;

          const sourceEvent = seed.eventId ? events.find((e) => e.templateId === seed.eventId) : undefined;
          const eventDate = seed.eventId ? eventDates.get(seed.eventId) : undefined;

          additions.push({
            id: taskId,
            title: seed.title,
            phase: seed.phase ?? phaseFromMonthsBefore(seed.monthsBefore),
            sourceFaith: context.primary.id,
            eventId: sourceEvent?.id,
            dueDate: eventDate ?? suggestEventDate(profile.weddingDate, seed.monthsBefore * 30),
            completed: false,
            assignee: '',
            notes: '',
            custom: false,
          });
        }

        if (additions.length) set({ tasks: [...tasks, ...additions] });
      },

      addTask: (task) =>
        set({
          tasks: [
            ...get().tasks,
            { ...task, id: task.id ?? makeId('task'), completed: false, custom: true },
          ],
        }),

      updateTask: (id, patch) => set({ tasks: get().tasks.map((t) => (t.id === id ? { ...t, ...patch } : t)) }),

      toggleTask: (id) =>
        set({ tasks: get().tasks.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)) }),

      removeTask: (id) => set({ tasks: get().tasks.filter((t) => t.id !== id) }),

      clearCompletedTasks: () => set({ tasks: get().tasks.filter((t) => !t.completed) }),

      setBudgetTotal: (total) => {
        const { budgetLines, profile } = get();
        if (total === null) {
          set({ profile: { ...profile, budgetTotal: null }, budgetLines: [] });
          return;
        }
        /* Rebuilding from the indicative split keeps allocations honest when
           the total changes, while preserving anything already spent. */
        const spentByCategory = new Map(budgetLines.map((l) => [l.categoryId, l.spent]));
        const next: BudgetLine[] = DEFAULT_BUDGET_SPLIT.map(({ categoryId, weight }) => ({
          id: `${categoryId}-allocation`,
          categoryId,
          label: '',
          allocated: Math.round(total * weight),
          spent: spentByCategory.get(categoryId) ?? 0,
        }));
        set({ profile: { ...profile, budgetTotal: total }, budgetLines: next });
      },

      addBudgetLine: (line) => set({ budgetLines: [...get().budgetLines, { ...line, id: makeId('bud') }] }),

      updateBudgetLine: (id, patch) =>
        set({ budgetLines: get().budgetLines.map((l) => (l.id === id ? { ...l, ...patch } : l)) }),

      removeBudgetLine: (id) => set({ budgetLines: get().budgetLines.filter((l) => l.id !== id) }),

      addGuest: (guest) => set({ guests: [...get().guests, { ...guest, id: makeId('gst') }] }),

      updateGuest: (id, patch) => set({ guests: get().guests.map((g) => (g.id === id ? { ...g, ...patch } : g)) }),

      removeGuest: (id) => set({ guests: get().guests.filter((g) => g.id !== id) }),

      resetWedding: () =>
        set({ profile: EMPTY_PROFILE, events: [], tasks: [], budgetLines: [], guests: [] }),
    }),
    {
      name: 'osb:wedding',
      version: 2,
      partialize: (state) => ({
        profile: state.profile,
        events: state.events,
        tasks: state.tasks,
        budgetLines: state.budgetLines,
        guests: state.guests,
        blueprint: state.blueprint,
        draft: state.draft,
        blueprintSkipped: state.blueprintSkipped,
      }),
      migrate: (persisted) => {
        const p = (persisted ?? {}) as Partial<WeddingState>;
        return {
          ...p,
          blueprint: p.blueprint ?? null,
          blueprintSkipped: p.blueprintSkipped ?? false,
          draft: {
            ...EMPTY_BLUEPRINT_DRAFT,
            ...p.draft,
            bride: { ...EMPTY_BLUEPRINT_DRAFT.bride, ...p.draft?.bride },
            partner: { ...EMPTY_BLUEPRINT_DRAFT.partner, ...p.draft?.partner },
            timeline: { ...EMPTY_BLUEPRINT_DRAFT.timeline, ...p.draft?.timeline },
          },
        } as WeddingState;
      },
    },
  ),
);

/* ==========================================================================
   Derived selectors — kept outside the store so components stay declarative.

   Each of these returns a fresh object or array, and Zustand compares selector
   results by reference. Without memoisation a component reading one of these
   would re-render on every store read, forever. The caches are keyed on the
   slice each selector actually reads, which only changes identity when the
   data behind it changes — the store always replaces arrays immutably.
   ========================================================================== */

export interface BudgetTotals {
  allocated: number;
  spent: number;
  remaining: number;
  percentSpent: number;
}

export interface TaskProgress {
  total: number;
  done: number;
  remaining: number;
  percent: number;
}

export interface GuestTotals {
  invited: number;
  attending: number;
  pending: number;
  declined: number;
}

export interface EventWithTasks {
  event: WeddingEventPlan;
  tasks: PlanningTask[];
}

export function selectContext(state: WeddingState) {
  return resolveWeddingContext(state.profile.faith, state.profile.secondaryFaiths, state.profile.customFaithLabel);
}

export function selectFaithLabel(state: WeddingState): string {
  return selectContext(state).label;
}

const budgetTotalsCache = new WeakMap<BudgetLine[], BudgetTotals>();

export function selectBudgetTotals(state: WeddingState): BudgetTotals {
  const lines = state.budgetLines;
  const cached = budgetTotalsCache.get(lines);
  if (cached) return cached;

  const allocated = lines.reduce((sum, l) => sum + l.allocated, 0);
  const spent = lines.reduce((sum, l) => sum + l.spent, 0);
  const value: BudgetTotals = {
    allocated,
    spent,
    remaining: allocated - spent,
    percentSpent: allocated > 0 ? Math.round((spent / allocated) * 100) : 0,
  };
  budgetTotalsCache.set(lines, value);
  return value;
}

const taskProgressCache = new WeakMap<PlanningTask[], TaskProgress>();

export function selectTaskProgress(state: WeddingState): TaskProgress {
  const tasks = state.tasks;
  const cached = taskProgressCache.get(tasks);
  if (cached) return cached;

  const total = tasks.length;
  const done = tasks.filter((t) => t.completed).length;
  const value: TaskProgress = {
    total,
    done,
    remaining: total - done,
    percent: total > 0 ? Math.round((done / total) * 100) : 0,
  };
  taskProgressCache.set(tasks, value);
  return value;
}

/* Depends on two slices, so the cache keys on both. */
let eventsWithTasksCache: {
  events: WeddingEventPlan[];
  tasks: PlanningTask[];
  value: EventWithTasks[];
} | null = null;

export function selectEventsWithTasks(state: WeddingState): EventWithTasks[] {
  const { events, tasks } = state;
  if (eventsWithTasksCache?.events === events && eventsWithTasksCache.tasks === tasks) {
    return eventsWithTasksCache.value;
  }

  const value: EventWithTasks[] = events.map((event) => ({
    event,
    tasks: tasks.filter((t) => t.eventId === event.id),
  }));
  eventsWithTasksCache = { events, tasks, value };
  return value;
}

const datedEventsCache = new WeakMap<WeddingEventPlan[], WeddingEventPlan[]>();

/** Events that carry a date, in order, for the timeline view. */
export function selectDatedEvents(state: WeddingState): WeddingEventPlan[] {
  const events = state.events;
  const cached = datedEventsCache.get(events);
  if (cached) return cached;

  const value = events
    .filter((e) => Boolean(e.date))
    .sort((a, b) => (a.date ?? '').localeCompare(b.date ?? ''));
  datedEventsCache.set(events, value);
  return value;
}

const guestTotalsCache = new WeakMap<Guest[], GuestTotals>();

export function selectGuestTotals(state: WeddingState): GuestTotals {
  const guests = state.guests;
  const cached = guestTotalsCache.get(guests);
  if (cached) return cached;

  const attending = guests.filter((g) => g.rsvp === 'attending');
  const value: GuestTotals = {
    invited: guests.reduce((sum, g) => sum + 1 + g.plusOnes, 0),
    attending: attending.reduce((sum, g) => sum + 1 + g.plusOnes, 0),
    pending: guests.filter((g) => g.rsvp === 'pending').length,
    declined: guests.filter((g) => g.rsvp === 'declined').length,
  };
  guestTotalsCache.set(guests, value);
  return value;
}

export { EMPTY_PROFILE };
