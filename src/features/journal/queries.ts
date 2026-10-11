import { createServerSupabase } from '@/lib/supabase/clients';

export type JournalEntry = { id: string; book_id: string; entry_date: string; title: string | null; body: string; page_from: number | null; page_to: number | null; minutes_read: number | null; is_spoiler: boolean; archived_at: string | null };

export async function getJournalEntries(userId: string, cursor?: string, limit = 20) {
  const client = await createServerSupabase();
  const query = client.from('reading_journal_entries').select('id,book_id,entry_date,title,body,page_from,page_to,minutes_read,is_spoiler,archived_at').eq('user_id', userId).is('archived_at', null).order('entry_date', { ascending: false }).limit(limit);
  if (cursor) query.lt('entry_date', cursor);
  const { data, error } = await query;
  const rows = (data ?? []) as JournalEntry[];
  return { data: error ? null : rows, error, nextCursor: rows.length === limit ? rows.at(-1)?.entry_date ?? null : null };
}
