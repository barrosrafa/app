import { createServerSupabase } from '@/lib/supabase/clients';

export type ReadingGoal = {
  id: string;
  user_id: string;
  year: number;
  target_books: number | null;
  target_pages: number | null;
  target_minutes: number | null;
};

export type ReadingGoalProgress = {
  goal_id: string;
  books_done: number;
  pages_done: number;
  minutes_done: number;
  updated_at: string;
};

export async function getUserReadingGoal(userId: string, year = new Date().getFullYear()) {
  const client = await createServerSupabase();
  const { data: goal, error } = await client
    .from('reading_goals')
    .select('id,user_id,year,target_books,target_pages,target_minutes')
    .eq('user_id', userId)
    .eq('year', year)
    .maybeSingle();

  if (error || !goal) return { goal: null, progress: null };

  const { data: progress } = await client
    .from('reading_goal_progress')
    .select('goal_id,books_done,pages_done,minutes_done,updated_at')
    .eq('goal_id', goal.id)
    .maybeSingle();

  return { goal: goal as ReadingGoal, progress: progress as ReadingGoalProgress | null };
}
