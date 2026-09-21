import { useState } from 'react';
import { Link } from '@tanstack/react-router';
import { Add, Trash } from 'iconsax-react';
import { BUDGET_CATEGORIES, DEFAULT_BUDGET_SPLIT } from '@/data/planning';
import { routes } from '@/config/routes';
import { selectBudgetTotals, useWeddingStore } from '@/stores/wedding';
import { useDocumentMeta } from '@/hooks/useDocumentMeta';
import { formatPrice, percentOf } from '@/lib/format';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Field, Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { EmptyState } from '@/components/ui/empty-state';

/**
 * Budget.
 *
 * Deliberately not a dashboard of charts. It is a table you can edit, because
 * that is what people actually do with a wedding budget, plus one honest bar
 * per category showing how much of the allocation is committed.
 */
export function PlanningBudgetPage() {
  useDocumentMeta({
    title: 'Wedding budget',
    description: 'Allocate your wedding budget across eleven categories and track what is committed.',
    canonicalPath: routes.planningBudget,
  });

  const profile = useWeddingStore((s) => s.profile);
  const budgetLines = useWeddingStore((s) => s.budgetLines);
  const setBudgetTotal = useWeddingStore((s) => s.setBudgetTotal);
  const updateBudgetLine = useWeddingStore((s) => s.updateBudgetLine);
  const addBudgetLine = useWeddingStore((s) => s.addBudgetLine);
  const removeBudgetLine = useWeddingStore((s) => s.removeBudgetLine);
  const totals = useWeddingStore(selectBudgetTotals);

  const [draftTotal, setDraftTotal] = useState(profile.budgetTotal ? String(profile.budgetTotal) : '');
  const [newLine, setNewLine] = useState({ categoryId: 'venue', label: '', allocated: '' });

  return (
    <div className="space-y-10">
      <div className="border-b border-border pb-6">
        <h2 className="font-display text-2xl text-ink">Budget</h2>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-ink-soft">
          Set a total and we suggest an allocation across eleven categories based on how weddings typically split. Adjust
          any line — the split is a starting point, not a rule.
        </p>
      </div>

      {/* Total */}
      <section aria-labelledby="total-heading" className="border border-border p-6">
        <h3 id="total-heading" className="eyebrow mb-4">
          Total budget
        </h3>
        <form
          className="flex flex-wrap items-end gap-3"
          onSubmit={(e) => {
            e.preventDefault();
            setBudgetTotal(draftTotal ? Number(draftTotal) : null);
          }}
        >
          <Field label="Amount" htmlFor="budget-total" className="w-full sm:w-56">
            <Input
              id="budget-total"
              type="number"
              inputMode="numeric"
              min={0}
              step={1000}
              value={draftTotal}
              onChange={(e) => setDraftTotal(e.target.value)}
              placeholder="2500000"
            />
          </Field>
          <Button type="submit">Set budget</Button>
          {profile.budgetTotal ? (
            <button
              type="button"
              onClick={() => {
                setDraftTotal('');
                setBudgetTotal(null);
              }}
              className="link-quiet pb-3 text-sm text-ink-muted hover:text-ink"
            >
              Clear budget
            </button>
          ) : null}
        </form>

        {totals.allocated > 0 ? (
          <dl className="mt-8 grid gap-6 border-t border-border pt-6 sm:grid-cols-3">
            <div>
              <dt className="eyebrow">Allocated</dt>
              <dd className="mt-1.5 font-display text-2xl text-ink">{formatPrice(totals.allocated)}</dd>
            </div>
            <div>
              <dt className="eyebrow">Committed</dt>
              <dd className="mt-1.5 font-display text-2xl text-ink">{formatPrice(totals.spent)}</dd>
            </div>
            <div>
              <dt className="eyebrow">Remaining</dt>
              <dd
                className={cn(
                  'mt-1.5 font-display text-2xl',
                  totals.remaining < 0 ? 'text-destructive' : 'text-ink',
                )}
              >
                {formatPrice(totals.remaining)}
              </dd>
            </div>
          </dl>
        ) : null}

        {totals.allocated > 0 ? (
          <div className="mt-6">
            <Progress
              value={Math.min(percentOf(totals.spent, totals.allocated), 100)}
              indicatorClassName={totals.spent > totals.allocated ? 'bg-destructive' : undefined}
              aria-label="Share of budget committed"
            />
            <p className="mt-2 text-xs text-ink-muted">
              {percentOf(totals.spent, totals.allocated)}% committed
              {totals.spent > totals.allocated ? ' — over the allocation' : ''}
            </p>
          </div>
        ) : null}
      </section>

      {budgetLines.length === 0 ? (
        <EmptyState
          title="No allocation yet"
          description="Enter a total above and we will build a suggested split you can edit line by line."
          action={
            <Button
              variant="outline"
              onClick={() => {
                setBudgetTotal(2_500_000);
                setDraftTotal('2500000');
              }}
            >
              Start from a suggested split
            </Button>
          }
        />
      ) : (
        <section aria-labelledby="lines-heading">
          <h3 id="lines-heading" className="eyebrow mb-4">
            By category
          </h3>
          <ul className="divide-y divide-border border-y border-border">
            {budgetLines.map((line) => {
              const category = BUDGET_CATEGORIES.find((c) => c.id === line.categoryId);
              const percent = percentOf(line.spent, line.allocated);
              return (
                <li key={line.id} className="py-5">
                  <div className="grid gap-4 lg:grid-cols-[1fr_9rem_9rem_6rem] lg:items-end">
                    <div>
                      <h4 className="text-sm font-medium text-ink">{category?.name ?? line.categoryId}</h4>
                      <p className="mt-1 text-xs leading-relaxed text-ink-muted">{category?.description}</p>
                    </div>

                    <div>
                      <label
                        htmlFor={`alloc-${line.id}`}
                        className="mb-1.5 block text-xs text-ink-muted"
                      >
                        Allocated
                      </label>
                      <Input
                        id={`alloc-${line.id}`}
                        type="number"
                        min={0}
                        step={1000}
                        value={line.allocated}
                        onChange={(e) => updateBudgetLine(line.id, { allocated: Number(e.target.value) || 0 })}
                        className="h-10"
                      />
                    </div>

                    <div>
                      <label htmlFor={`spent-${line.id}`} className="mb-1.5 block text-xs text-ink-muted">
                        Committed
                      </label>
                      <Input
                        id={`spent-${line.id}`}
                        type="number"
                        min={0}
                        step={1000}
                        value={line.spent}
                        onChange={(e) => updateBudgetLine(line.id, { spent: Number(e.target.value) || 0 })}
                        className="h-10"
                      />
                    </div>

                    <div className="flex items-center justify-between gap-3 lg:justify-end">
                      <span className="text-xs text-ink-muted">{percent}%</span>
                      <button
                        type="button"
                        onClick={() => removeBudgetLine(line.id)}
                        aria-label={`Remove ${category?.name ?? 'line'}`}
                        className="flex h-10 w-10 items-center justify-center text-ink-muted transition-colors hover:text-destructive"
                      >
                        <Trash size={16} variant="Linear" />
                      </button>
                    </div>
                  </div>

                  <Progress
                    value={Math.min(percent, 100)}
                    className="mt-4"
                    indicatorClassName={line.spent > line.allocated ? 'bg-destructive' : undefined}
                    aria-label={`${line.label || category?.name || 'Budget line'} committed`}
                  />
                </li>
              );
            })}
          </ul>
        </section>
      )}

      {/* Add a line */}
      <section aria-labelledby="add-heading" className="border-t border-border pt-8">
        <h3 id="add-heading" className="eyebrow mb-4">
          Add a line
        </h3>
        <form
          className="grid gap-4 sm:grid-cols-[12rem_1fr_9rem_auto] sm:items-end"
          onSubmit={(e) => {
            e.preventDefault();
            addBudgetLine({
              categoryId: newLine.categoryId as (typeof BUDGET_CATEGORIES)[number]['id'],
              label: newLine.label,
              allocated: Number(newLine.allocated) || 0,
              spent: 0,
            });
            setNewLine({ categoryId: newLine.categoryId, label: '', allocated: '' });
          }}
        >
          <Field label="Category" htmlFor="new-line-category">
            <select
              id="new-line-category"
              value={newLine.categoryId}
              onChange={(e) => setNewLine({ ...newLine, categoryId: e.target.value })}
              className="h-11 w-full border border-input bg-pearl px-3 text-sm text-ink focus:border-ink focus:outline-none"
            >
              {BUDGET_CATEGORIES.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </Field>

          <Field label="Description" htmlFor="new-line-label">
            <Input
              id="new-line-label"
              value={newLine.label}
              onChange={(e) => setNewLine({ ...newLine, label: e.target.value })}
              placeholder="Second photographer"
            />
          </Field>

          <Field label="Allocated" htmlFor="new-line-amount">
            <Input
              id="new-line-amount"
              type="number"
              min={0}
              step={1000}
              value={newLine.allocated}
              onChange={(e) => setNewLine({ ...newLine, allocated: e.target.value })}
              placeholder="45000"
            />
          </Field>

          <Button type="submit" className="sm:mb-0">
            <Add size={16} variant="Linear" />
            Add
          </Button>
        </form>
      </section>

      <details className="border-t border-border pt-6">
        <summary className="cursor-pointer text-sm font-medium text-ink">How the suggested split works</summary>
        <div className="prose-editorial mt-4">
          <p>
            The starting allocation is based on how weddings typically divide across categories, with venue and catering
            taking roughly 40% between them. It is a prompt for the conversation, not advice.
          </p>
          <ul>
            {DEFAULT_BUDGET_SPLIT.map(({ categoryId, weight }) => {
              const category = BUDGET_CATEGORIES.find((c) => c.id === categoryId);
              return (
                <li key={categoryId}>
                  {category?.name}: {Math.round(weight * 100)}%
                </li>
              );
            })}
          </ul>
          <p>
            Guest count moves almost every line at once, so it is worth agreeing early. See{' '}
            <Link to={routes.planningGuests}>your guest list</Link> and{' '}
            <Link to={routes.inspiration}>our planning guides</Link>.
          </p>
        </div>
      </details>
    </div>
  );
}
