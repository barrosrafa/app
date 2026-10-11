'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { requireSession } from '@/lib/auth/session';
import { mapDatabaseError } from '@/lib/actions/database-errors';

const goalSchema = z.object({
  year: z.coerce.number().int().min(2020).max(2050),
  targetBooks: z.coerce.number().int().positive().max(1000).nullable().optional(),
  targetPages: z.coerce.number().int().positive().max(1000000).nullable().optional(),
  targetMinutes: z.coerce.number().int().positive().max(1000000).nullable().optional(),
}).strict();

export async function setReadingGoal(input: unknown) {
  const parsed = goalSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, message: 'Informe metas numéricas válidas para livros, páginas ou minutos.', code: 'validation' as const };
  }
  const session = await requireSession();
  if (!session) {
    return { ok: false, message: 'Entre na sua conta para definir sua meta de leitura.', code: 'unauthenticated' as const };
  }

  const { error } = await session.client
    .from('reading_goals')
    .upsert({
      user_id: session.userId,
      year: parsed.data.year,
      target_books: parsed.data.targetBooks ?? null,
      target_pages: parsed.data.targetPages ?? null,
      target_minutes: parsed.data.targetMinutes ?? null,
    }, { onConflict: 'user_id,year' });

  if (error) return { ok: false, ...mapDatabaseError(error.code) };
  revalidatePath('/metas');
  revalidatePath('/perfil');
  return { ok: true, message: 'Meta de leitura salva com sucesso!' };
}
