import { describe, expect, it } from 'vitest';
import { getMeetingState } from '../../src/features/meetings/state';

const base = { scheduled_at: '2026-10-11T20:00:00-03:00', duration_min: 60 };
const now = Date.parse('2026-10-11T20:30:00-03:00');

describe('getMeetingState', () => {
  it('prioriza cancelado', () => expect(getMeetingState({ ...base, status: 'cancelled' }, now)).toBe('cancelled'));
  it('prioriza encerramento manual sobre janela ao vivo', () => expect(getMeetingState({ ...base, status: 'done' }, now)).toBe('finished'));
  it('marca ao vivo apenas dentro da janela', () => expect(getMeetingState({ ...base, status: 'scheduled' }, now)).toBe('live'));
  it('usa sessenta minutos quando duração é nula', () => expect(getMeetingState({ ...base, duration_min: null, status: 'scheduled' }, now + 29 * 60_000)).toBe('live'));
});
