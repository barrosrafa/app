import { createServerSupabase } from '@/lib/supabase/clients';

export type UpNextItem = {
  book_id: string;
  position: number;
  added_at: string;
  book: {
    id: string;
    title: string;
    slug: string;
    cover_url: string | null;
    total_pages: number | null;
    synopsis: string | null;
  } | null;
};

export async function getUserUpNext(userId: string): Promise<UpNextItem[]> {
  const client = await createServerSupabase();
  const { data, error } = await client
    .from('user_up_next')
    .select('book_id,position,added_at,book:books(id,title,slug,cover_url,total_pages,synopsis)')
    .eq('user_id', userId)
    .order('position', { ascending: true });

  if (error || !data) return [];
  return data as unknown as UpNextItem[];
}
