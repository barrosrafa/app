'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { createServerSupabase } from '@/lib/supabase/clients';

const createSchema = z.object({ title: z.string().trim().min(1, 'Dê um nome para sua lista.').max(80), description: z.string().trim().max(500).optional() }).strict();
const addSchema = z.object({ listId: z.string().uuid(), bookId: z.string().uuid() }).strict();
export type ListActionResult = { ok: true; message: string } | { ok: false; message: string; requiresAuth?: boolean };

async function sessionContext() {
  const client = await createServerSupabase();
  const { data, error } = await client.auth.getClaims();
  const userId = data?.claims?.sub;
  return !error && typeof userId === 'string' ? { client, userId } : null;
}

function slugify(value: string): string {
  return value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 48) || 'lista';
}

export async function createReadingList(input: unknown): Promise<ListActionResult> {
  const parsed = createSchema.safeParse(input);
  if (!parsed.success) return { ok: false, message: parsed.error.issues[0]?.message ?? 'Confira o nome da lista.' };
  const session = await sessionContext();
  if (!session) return { ok: false, message: 'Entre para criar uma lista.', requiresAuth: true };
  const slug = `${slugify(parsed.data.title)}-${crypto.randomUUID().slice(0, 8)}`;
  const { error } = await session.client.from('reading_lists').insert({ owner_id: session.userId, slug, title: parsed.data.title, description: parsed.data.description || null, visibility: 'private', is_collaborative: false });
  if (error) { console.error('List create failed', error.code); return { ok: false, message: 'Não foi possível criar a lista agora.' }; }
  revalidatePath('/listas');
  return { ok: true, message: 'Lista criada.' };
}

export async function addBookToReadingList(input: unknown): Promise<ListActionResult> {
  const parsed = addSchema.safeParse(input);
  if (!parsed.success) return { ok: false, message: 'Livro ou lista inválidos.' };
  const session = await sessionContext();
  if (!session) return { ok: false, message: 'Entre para salvar este livro.', requiresAuth: true };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error } = await (session.client as any).rpc('add_book_to_reading_list', { p_list_id: parsed.data.listId, p_book_id: parsed.data.bookId });
  if (error || !data?.ok) return { ok: false, message: data?.message ?? 'Não foi possível adicionar o livro agora.' };
  revalidatePath('/listas');
  return { ok: true, message: data.message ?? 'Livro adicionado à lista.' };
}

const manageListSchema = z.object({ listId: z.string().uuid(), title: z.string().trim().min(1).max(80), description: z.string().trim().max(500).optional() }).strict();
export async function updateReadingList(input: unknown): Promise<ListActionResult> {
  const parsed = manageListSchema.safeParse(input); if (!parsed.success) return { ok: false, message: 'Confira o nome da lista.' };
  const session = await sessionContext(); if (!session) return { ok: false, message: 'Entre para editar a lista.', requiresAuth: true };
  const { error } = await session.client.from('reading_lists').update({ title: parsed.data.title, description: parsed.data.description || null, updated_at: new Date().toISOString() }).eq('id', parsed.data.listId).eq('owner_id', session.userId);
  if (error) return { ok: false, message: 'Não foi possível atualizar a lista.' };
  revalidatePath('/listas'); return { ok: true, message: 'Lista atualizada.' };
}

export async function removeBookFromReadingList(input: unknown): Promise<ListActionResult> {
  const parsed = z.object({ listId: z.string().uuid(), itemId: z.string().uuid() }).safeParse(input); if (!parsed.success) return { ok: false, message: 'Item inválido.' };
  const session = await sessionContext(); if (!session) return { ok: false, message: 'Entre para editar a lista.', requiresAuth: true };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await (session.client as any).rpc('remove_reading_list_item', { p_list_id: parsed.data.listId, p_item_id: parsed.data.itemId });
  if (error) return { ok: false, message: error.code === '42501' ? 'Você não pode editar esta lista.' : 'Não foi possível remover o item.' };
  revalidatePath('/listas'); return { ok: true, message: 'Item removido.' };
}

export async function restoreBookToReadingList(input: unknown): Promise<ListActionResult> {
  const parsed = z.object({ listId: z.string().uuid(), itemId: z.string().uuid() }).safeParse(input); if (!parsed.success) return { ok: false, message: 'Item inválido.' };
  const session = await sessionContext(); if (!session) return { ok: false, message: 'Entre para editar a lista.', requiresAuth: true };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await (session.client as any).rpc('restore_reading_list_item', { p_list_id: parsed.data.listId, p_item_id: parsed.data.itemId });
  if (error) return { ok: false, message: error.code === '23505' ? 'Este livro já está ativo na lista.' : 'Não foi possível restaurar o item.' };
  revalidatePath('/listas'); return { ok: true, message: 'Item restaurado.' };
}

export async function reorderReadingList(input: unknown): Promise<ListActionResult> {
  const parsed = z.object({ listId: z.string().uuid(), version: z.number().int().positive(), itemIds: z.array(z.string().uuid()).max(500) }).safeParse(input); if (!parsed.success) return { ok: false, message: 'Ordem inválida.' };
  const session = await sessionContext(); if (!session) return { ok: false, message: 'Entre para editar a lista.', requiresAuth: true };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await (session.client as any).rpc('reorder_reading_list', { p_list: parsed.data.listId, p_version: parsed.data.version, p_item_ids: parsed.data.itemIds });
  if (error) return { ok: false, message: error.code === '40001' ? 'A lista mudou. Atualize e tente novamente.' : 'Não foi possível reorganizar a lista.' };
  revalidatePath('/listas'); return { ok: true, message: 'Ordem atualizada.' };
}
