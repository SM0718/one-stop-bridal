import { useMemo, useState } from 'react';
import { Link } from '@tanstack/react-router';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Add, Printer, Trash } from 'iconsax-react';
import { type z } from 'zod';
import type { ChecklistPhaseId, PlanningTask } from '@/types';
import { taskSchema } from '@/lib/validations';
import { CHECKLIST_PHASES } from '@/data/planning';
import { routes } from '@/config/routes';
import { selectTaskProgress, useWeddingStore } from '@/stores/wedding';
import { useWeddingContext } from '@/hooks/queries';
import { useDocumentMeta } from '@/hooks/useDocumentMeta';
import { useUrlFilters } from '@/hooks/useUrlFilters';
import { formatDate, daysUntil } from '@/lib/format';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Checkbox } from '@/components/ui/checkbox';
import { Field, Input, Textarea } from '@/components/ui/input';
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { EmptyState } from '@/components/ui/empty-state';

type TaskValues = z.input<typeof taskSchema>;

export function PlanningChecklistPage() {
  useDocumentMeta({
    title: 'Wedding checklist',
    description: 'Your wedding tasks, phased across twelve months and drawn from the traditions you selected.',
    canonicalPath: routes.planningChecklist,
  });

  const context = useWeddingContext();
  const tasks = useWeddingStore((s) => s.tasks);
  const events = useWeddingStore((s) => s.events);
  const toggleTask = useWeddingStore((s) => s.toggleTask);
  const removeTask = useWeddingStore((s) => s.removeTask);
  const updateTask = useWeddingStore((s) => s.updateTask);
  const addTask = useWeddingStore((s) => s.addTask);
  const clearCompleted = useWeddingStore((s) => s.clearCompletedTasks);
  const syncTasks = useWeddingStore((s) => s.syncTasks);
  const progress = useWeddingStore(selectTaskProgress);

  const [showCompleted, setShowCompleted] = useState(true);
  /* The ceremony filter lives in the URL so a ceremony can be linked to
     directly, and a filtered checklist stays shareable and refresh-safe. */
  const urlFilters = useUrlFilters();
  const eventFilter = urlFilters.get('event') ?? 'all';
  const setEventFilter = (value: string) => urlFilters.set('event', value === 'all' ? undefined : value);
  const [editing, setEditing] = useState<PlanningTask | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const filtered = useMemo(
    () =>
      tasks.filter((task) => {
        if (!showCompleted && task.completed) return false;
        if (eventFilter !== 'all' && task.eventId !== eventFilter) return false;
        return true;
      }),
    [tasks, showCompleted, eventFilter],
  );

  const byPhase = useMemo(() => {
    const map = new Map<ChecklistPhaseId, PlanningTask[]>();
    for (const phase of CHECKLIST_PHASES) {
      map.set(
        phase.id,
        filtered.filter((t) => t.phase === phase.id),
      );
    }
    return map;
  }, [filtered]);

  return (
    <div className="space-y-10">
      <div className="flex flex-wrap items-end justify-between gap-5 border-b border-border pb-6">
        <div>
          <h2 className="font-display text-2xl text-ink">Checklist</h2>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-ink-soft">
            {tasks.length === 0
              ? 'Nothing here yet. Generate your checklist from your wedding context, then edit it freely.'
              : `${progress.done} of ${progress.total} complete across ${context.label}. Seeded tasks are written for your ceremonies — rename, reassign or delete any of them.`}
          </p>
        </div>
        <div className="flex flex-wrap gap-2 print-hidden">
          <Button
            size="sm"
            onClick={() => {
              setEditing(null);
              setDialogOpen(true);
            }}
          >
            <Add size={16} variant="Linear" />
            Add task
          </Button>
          {tasks.length === 0 ? (
            <Button size="sm" variant="outline" onClick={syncTasks}>
              Generate from my context
            </Button>
          ) : (
            <Button size="sm" variant="outline" onClick={() => window.print()}>
              <Printer size={16} variant="Linear" />
              Print
            </Button>
          )}
        </div>
      </div>

      <div className="print-hidden">
        <Progress value={progress.percent} aria-label="Checklist progress" />
        <div className="mt-5 flex flex-wrap items-center gap-6">
          <div className="flex items-center gap-2.5">
            <Checkbox
              id="show-completed"
              checked={showCompleted}
              onCheckedChange={(checked) => setShowCompleted(checked === true)}
              label="Show completed"
            />
          </div>
          <div className="min-w-56">
            <label htmlFor="event-filter" className="sr-only">
              Filter by ceremony
            </label>
            <Select value={eventFilter} onValueChange={setEventFilter}>
              <SelectTrigger id="event-filter" className="h-9 text-[0.8125rem]">
                <SelectValue placeholder="All ceremonies" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All ceremonies</SelectItem>
                {events.map((event) => (
                  <SelectItem key={event.id} value={event.id}>
                    {event.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {progress.done > 0 ? (
            <button
              type="button"
              onClick={clearCompleted}
              className="link-quiet text-xs text-ink-muted hover:text-ink"
            >
              Remove completed tasks
            </button>
          ) : null}
        </div>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          title={tasks.length === 0 ? 'No tasks yet' : 'Nothing matches this filter'}
          description={
            tasks.length === 0
              ? 'Your checklist is generated from the traditions and ceremonies you selected, so it starts empty. Generate it and then make it yours.'
              : 'Try showing completed tasks, or clearing the ceremony filter.'
          }
          action={
            tasks.length === 0 ? (
              <Button onClick={syncTasks}>Generate my checklist</Button>
            ) : (
              <Button
                variant="outline"
                onClick={() => {
                  setEventFilter('all');
                  setShowCompleted(true);
                }}
              >
                Clear filters
              </Button>
            )
          }
        />
      ) : (
        <div className="space-y-12">
          {CHECKLIST_PHASES.map((phase) => {
            const phaseTasks = byPhase.get(phase.id) ?? [];
            if (phaseTasks.length === 0) return null;

            const done = phaseTasks.filter((t) => t.completed).length;

            return (
              <section key={phase.id} aria-labelledby={`phase-${phase.id}`}>
                <div className="flex flex-wrap items-baseline justify-between gap-4 border-b border-border pb-3">
                  <div>
                    <h3 id={`phase-${phase.id}`} className="font-display text-xl text-ink">
                      {phase.name}
                    </h3>
                    <p className="mt-1 text-xs text-ink-muted">{phase.description}</p>
                  </div>
                  <span className="text-xs text-ink-muted">
                    {done}/{phaseTasks.length} done
                  </span>
                </div>

                <ul className="divide-y divide-border">
                  {phaseTasks.map((task) => (
                    <TaskRow
                      key={task.id}
                      task={task}
                      eventName={events.find((e) => e.id === task.eventId)?.name}
                      onToggle={() => toggleTask(task.id)}
                      onDelete={() => removeTask(task.id)}
                      onEdit={() => {
                        setEditing(task);
                        setDialogOpen(true);
                      }}
                      onAssign={(assignee) => updateTask(task.id, { assignee })}
                      onNoteChange={(notes) => updateTask(task.id, { notes })}
                      readOnly={false}
                    />
                  ))}
                </ul>
              </section>
            );
          })}
        </div>
      )}

      <TaskDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        task={editing}
        onSubmit={(values) => {
          if (editing) {
            updateTask(editing.id, {
              title: values.title,
              phase: values.phase,
              dueDate: values.dueDate || null,
              assignee: values.assignee ?? '',
              notes: values.notes ?? '',
            });
          } else {
            addTask({
              title: values.title,
              phase: values.phase,
              dueDate: values.dueDate || null,
              assignee: values.assignee ?? '',
              notes: values.notes ?? '',
            });
          }
        }}
      />

      <p className="border-t border-border pt-6 text-xs leading-relaxed text-ink-muted">
        Tasks prefixed from your wedding context are marked as suggestions. Anything you add, rename or reassign is yours
        and will not be overwritten when you change your ceremonies. See the{' '}
        <Link to={routes.planningTimeline} className="underline decoration-gold/50 underline-offset-2">
          timeline
        </Link>{' '}
        for the same work in date order.
      </p>
    </div>
  );
}

function TaskRow({
  task,
  eventName,
  onToggle,
  onDelete,
  onEdit,
  onAssign,
  onNoteChange,
  readOnly,
}: {
  task: PlanningTask;
  eventName?: string;
  onToggle: () => void;
  onDelete: () => void;
  onEdit: () => void;
  onAssign: (value: string) => void;
  onNoteChange: (value: string) => void;
  readOnly: boolean;
}) {
  const [showNotes, setShowNotes] = useState(false);
  const overdue = !task.completed && (daysUntil(task.dueDate) ?? 0) < 0;

  return (
    <li className="group py-4">
      <div className="flex items-start gap-3.5">
        <button
          type="button"
          onClick={onToggle}
          aria-pressed={task.completed}
          aria-label={task.completed ? `Reopen "${task.title}"` : `Mark "${task.title}" complete`}
          className={cn(
            'mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center border transition-colors',
            task.completed ? 'border-ink bg-ink text-ivory' : 'border-input hover:border-ink',
          )}
        >
          {task.completed ? (
            <svg viewBox="0 0 12 12" className="h-3 w-3" aria-hidden="true">
              <path
                d="M2.5 6.2 4.7 8.4 9.5 3.6"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          ) : null}
        </button>

        <div className="min-w-0 flex-1">
          <p className={cn('text-sm', task.completed ? 'text-ink-muted line-through' : 'text-ink')}>{task.title}</p>

          <div className="mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-ink-muted">
            {task.dueDate ? (
              <span className={overdue ? 'text-destructive' : undefined}>
                {overdue ? 'Overdue ' : 'Due '}
                {formatDate(task.dueDate, 'short')}
              </span>
            ) : null}
            {eventName ? <Badge variant="outline">{eventName}</Badge> : null}
            {!task.custom ? <span>Suggested</span> : null}
            {!readOnly ? (
              <input
                value={task.assignee}
                onChange={(e) => onAssign(e.target.value)}
                placeholder="Assign to…"
                aria-label={`Assign "${task.title}" to`}
                className="w-32 border-b border-transparent bg-transparent py-0.5 text-xs text-ink-soft outline-none transition-colors placeholder:text-ink-muted/70 focus:border-ink print-hidden"
              />
            ) : null}
            <button
              type="button"
              onClick={() => setShowNotes((v) => !v)}
              aria-expanded={showNotes}
              className="text-xs text-ink-muted underline decoration-gold/50 underline-offset-2 hover:text-ink print-hidden"
            >
              {task.notes ? 'Notes' : 'Add note'}
            </button>
          </div>

          {showNotes ? (
            <Textarea
              value={task.notes}
              onChange={(e) => onNoteChange(e.target.value)}
              placeholder="Anything you need to remember about this task."
              aria-label={`Notes for "${task.title}"`}
              rows={2}
              className="mt-2.5 text-xs print-hidden"
            />
          ) : task.notes ? (
            <p className="mt-2 text-xs leading-relaxed text-ink-soft">{task.notes}</p>
          ) : null}
        </div>

        <div className="flex shrink-0 items-center gap-1 opacity-0 transition-opacity focus-within:opacity-100 group-hover:opacity-100 print-hidden">
          <button
            type="button"
            onClick={onEdit}
            className="flex h-9 w-9 items-center justify-center text-ink-muted transition-colors hover:text-ink"
            aria-label={`Edit "${task.title}"`}
          >
            <svg viewBox="0 0 20 20" className="h-4 w-4" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.4">
              <path d="M13.4 3.6a1.6 1.6 0 0 1 2.3 2.3l-7.5 7.5-3 .7.7-3z" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <button
            type="button"
            onClick={onDelete}
            className="flex h-9 w-9 items-center justify-center text-ink-muted transition-colors hover:text-destructive"
            aria-label={`Delete "${task.title}"`}
          >
            <Trash size={16} variant="Linear" />
          </button>
        </div>
      </div>
    </li>
  );
}

function TaskDialog({
  open,
  onOpenChange,
  task,
  onSubmit,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  task: PlanningTask | null;
  onSubmit: (values: z.output<typeof taskSchema>) => void;
}) {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<TaskValues>({
    resolver: zodResolver(taskSchema),
    values: {
      title: task?.title ?? '',
      phase: task?.phase ?? 'six-months',
      dueDate: task?.dueDate ?? null,
      assignee: task?.assignee ?? '',
      notes: task?.notes ?? '',
    },
  });

  const phase = watch('phase');

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        onOpenChange(next);
        if (!next) reset();
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{task ? 'Edit task' : 'Add a task'}</DialogTitle>
          <DialogDescription>
            Tasks you add are yours. They are not tied to a tradition and will never be regenerated or removed.
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={handleSubmit((values) => {
            onSubmit(values as z.output<typeof taskSchema>);
            onOpenChange(false);
            reset();
          })}
          noValidate
        >
          <DialogBody className="space-y-5">
            <Field label="Task" htmlFor="task-title" required error={errors.title?.message}>
              <Input id="task-title" {...register('title')} placeholder="Order the bridal shoes" />
            </Field>

            <Field label="Stage" htmlFor="task-phase" required error={errors.phase?.message}>
              <Select value={phase} onValueChange={(value) => setValue('phase', value as ChecklistPhaseId)}>
                <SelectTrigger id="task-phase">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CHECKLIST_PHASES.map((p) => (
                    <SelectItem key={p.id} value={p.id}>
                      {p.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>

            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Due date" htmlFor="task-due" hint="Optional.">
                <Input id="task-due" type="date" {...register('dueDate')} />
              </Field>
              <Field label="Assign to" htmlFor="task-assignee" hint="Optional.">
                <Input id="task-assignee" {...register('assignee')} placeholder="Ananya" />
              </Field>
            </div>

            <Field label="Notes" htmlFor="task-notes" error={errors.notes?.message}>
              <Textarea id="task-notes" rows={3} {...register('notes')} />
            </Field>
          </DialogBody>

          <DialogFooter>
            <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">{task ? 'Save changes' : 'Add task'}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
