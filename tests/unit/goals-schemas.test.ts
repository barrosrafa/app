import { describe, expect, it } from 'vitest';
import { z } from 'zod';

const goalSchema = z.object({
  year: z.coerce.number().int().min(2020).max(2050),
  targetBooks: z.coerce.number().int().positive().max(1000).nullable().optional(),
  targetPages: z.coerce.number().int().positive().max(1000000).nullable().optional(),
  targetMinutes: z.coerce.number().int().positive().max(1000000).nullable().optional(),
}).strict();

describe('reading goals schema', () => {
  it('validates a valid goal setup', () => {
    const result = goalSchema.safeParse({
      year: 2026,
      targetBooks: 12,
      targetPages: 3600,
      targetMinutes: 7200,
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.year).toBe(2026);
      expect(result.data.targetBooks).toBe(12);
    }
  });

  it('rejects invalid years and negative targets', () => {
    expect(goalSchema.safeParse({ year: 1999, targetBooks: 5 }).success).toBe(false);
    expect(goalSchema.safeParse({ year: 2026, targetBooks: -1 }).success).toBe(false);
    expect(goalSchema.safeParse({ year: 2026, targetBooks: 0 }).success).toBe(false);
  });
});
