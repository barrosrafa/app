import 'server-only';

import { createServerSupabase } from '@/lib/supabase/clients';
import type { Database } from '@/types/database';

export type NotificationRow = Pick<
  Database['public']['Tables']['notifications']['Row'],
  'id' | 'kind' | 'payload' | 'created_at' | 'read_at'
>;

export type NotificationsPageData = {
  userId: string | null;
  notifications: NotificationRow[];
  invitations: { id: string; club_id: string; expires_at: string; created_at: string }[];
  error: boolean;
};

export async function getNotificationsPageData(): Promise<NotificationsPageData> {
  try {
    const client = await createServerSupabase();
    const { data: claimsData, error: claimsError } = await client.auth.getClaims();
    const userId = claimsData?.claims?.sub;

    if (claimsError || !userId) {
      return { userId: null, notifications: [], invitations: [], error: Boolean(claimsError) };
    }

    const [{ data, error }, { data: invitations }] = await Promise.all([client
      .from('notifications')
      .select('id,kind,payload,created_at,read_at')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(50), client.from('user_club_invitations').select('id,club_id,expires_at,created_at').eq('invited_user_id', userId).is('accepted_at', null).is('revoked_at', null).gt('expires_at', new Date().toISOString()).order('created_at', { ascending: false }).limit(20)]);

    return {
      userId,
      notifications: (data ?? []) as NotificationRow[],
      invitations: invitations ?? [],
      error: Boolean(error),
    };
  } catch {
    return { userId: null, notifications: [], invitations: [], error: true };
  }
}
