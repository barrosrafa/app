import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';
import { trackEvent } from '../../src/lib/analytics';

describe('trackEvent', () => {
  const originalWindow = global.window;

  beforeEach(() => {
    vi.restoreAllMocks();
  });

  afterEach(() => {
    global.window = originalWindow;
  });

  it('não lança erro quando executado em ambiente sem window', () => {
    expect(() => {
      // @ts-expect-error testando ambiente sem window
      delete global.window;
      trackEvent('share_book_clicked', { book_slug: 'verity', share_method: 'clipboard' });
    }).not.toThrow();
  });

  it('chama window.posthog.capture quando disponível', () => {
    const mockCapture = vi.fn();
    // @ts-expect-error simulando window.posthog
    global.window = {
      posthog: { capture: mockCapture },
    };

    trackEvent('chapter_marked_read', { chapter_id: 'c-1', chapter_number: 1 });
    expect(mockCapture).toHaveBeenCalledWith('chapter_marked_read', {
      chapter_id: 'c-1',
      chapter_number: 1,
    });
  });

  it('não falha se capture lançar exceção', () => {
    // @ts-expect-error simulando falha do capture
    global.window = {
      posthog: {
        capture: () => {
          throw new Error('PostHog offline');
        },
      },
    };

    expect(() => {
      trackEvent('comment_submitted', { chapter_id: 'c-1', has_spoiler_flag: true });
    }).not.toThrow();
  });
});
