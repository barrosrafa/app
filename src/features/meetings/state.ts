export type MeetingState = 'cancelled' | 'finished' | 'live' | 'upcoming';

export function getMeetingState(
  meeting: { status: string; scheduled_at: string; duration_min: number | null },
  now: number,
): MeetingState {
  if (meeting.status === 'cancelled') return 'cancelled';
  if (meeting.status === 'done') return 'finished';
  const start = Date.parse(meeting.scheduled_at);
  const end = start + (meeting.duration_min ?? 60) * 60_000;
  if (!Number.isFinite(start) || end <= now) return 'finished';
  if (meeting.status === 'live' || (start <= now && now < end)) return 'live';
  return 'upcoming';
}
