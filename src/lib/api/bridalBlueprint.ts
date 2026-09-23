import type { BridalBlueprint } from '@/types';
import { delay, readLocal, writeLocal } from './client';

/**
 * Mock bridal blueprint service.
 *
 * Written as if it spoke to a real backend: asynchronous, returning plain
 * data, stored in the demo's local persistence. When a real API arrives,
 * replace the bodies of `get`, `create` and `update` — nothing in the UI
 * changes.
 */

const BLUEPRINT_KEY = 'bridal-blueprint';

function makeId(): string {
  return `bp-${Math.random().toString(36).slice(2, 9)}-${Date.now().toString(36)}`;
}

export const bridalBlueprintService = {
  async get(): Promise<BridalBlueprint | null> {
    return delay(readLocal<BridalBlueprint | null>(BLUEPRINT_KEY, null));
  },

  async create(blueprint: BridalBlueprint): Promise<BridalBlueprint> {
    const saved: BridalBlueprint = {
      ...blueprint,
      id: blueprint.id || makeId(),
      completedAt: blueprint.completedAt ?? new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    writeLocal(BLUEPRINT_KEY, saved);
    return delay(saved);
  },

  async update(blueprint: BridalBlueprint): Promise<BridalBlueprint> {
    const saved: BridalBlueprint = { ...blueprint, updatedAt: new Date().toISOString() };
    writeLocal(BLUEPRINT_KEY, saved);
    return delay(saved);
  },
};

export type BridalBlueprintService = typeof bridalBlueprintService;