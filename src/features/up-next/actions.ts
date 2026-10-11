'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { requireSession } from '@/lib/auth/session';
import { mapDatabaseError } from '@/lib/actions/database-errors';

const bookIdSchema = z.string().uuid();

export async function addToUpNext(bookId: string) {
  const parsed = bookIdSchema.safeParse(bookId);
  if (!parsed.success) return { ok: false, message: 'Livro inválido.' };
  const session = await requireSession();
  if (!session) return { ok: false, message: 'Entre para adicionar livros à sua fila.' };

  const { data: existing } = await session.client
    .from('user_up_next')
    .select('position')
    .eq('user_id', session.userId)
    .order('position', { ascending: false })
    .limit(1);

  const nextPos = (existing?.[0]?.position ?? -1) + 1;

  const { error } = await session.client
    .from('user_up_next')
    .upsert({
      user_id: session.userId,
      book_id: parsed.data,
      position: nextPos,
    }, { onConflict: 'user_id,book_id' });

  if (error) return { ok: false, ...mapDatabaseError(error.code) };
  revalidatePath('/minha-fila');
  return { ok: true, message: 'Livro adicionado à sua fila!' };
}

export async function removeFromUpNext(bookId: string) {
  const parsed = bookIdSchema.safeParse(bookId);
  if (!parsed.success) return { ok: false, message: 'Livro inválido.' };
  const session = await requireSession();
  if (!session) return { ok: false, message: 'Entre para alterar sua fila.' };

  const { error } = await session.client
    .from('user_up_next')
    .delete()
    .eq('user_id', session.userId)
    .eq('book_id', parsed.data);

  if (error) return { ok: false, ...mapDatabaseError(error.code) };
  revalidatePath('/minha-fila');
  return { ok: true, message: 'Livro removido da sua fila.' };
}
