/**
 * DIYSPUR Product Telemetry & Analytics Module (OBS-01)
 *
 * Módulo seguro de instrumentação de eventos de produto conforme o dicionário
 * da auditoria (Seção 14.2). Suporta PostHog ou qualquer provedor configurado no browser,
 * com fallback gracioso sem quebra de execução.
 */

export type ProductEventMap = {
  sign_up_completed: {
    method: 'email' | 'google' | 'magic_link';
    source_path?: string;
  };
  book_detail_viewed: {
    book_id: string;
    book_title: string;
    has_active_season: boolean;
  };
  season_joined: {
    season_id: string;
    book_id?: string;
    club_id?: string;
  };
  chapter_marked_read: {
    chapter_id: string;
    chapter_number?: number;
    days_since_start?: number;
  };
  comment_submitted: {
    chapter_id: string;
    has_spoiler_flag: boolean;
  };
  calendar_event_clicked: {
    event_id: string;
    book_title?: string;
    platform?: string;
  };
  affiliate_link_clicked: {
    book_id?: string;
    retailer: 'amazon' | 'travessa' | 'kobo';
  };
  share_book_clicked: {
    book_slug: string;
    share_method: 'native' | 'clipboard';
  };
};

export type EventName = keyof ProductEventMap;

declare global {
  interface Window {
    posthog?: {
      capture: (eventName: string, properties?: Record<string, unknown>) => void;
    };
  }
}

/**
 * Dispara evento de telemetria tipado.
 */
export function trackEvent<E extends EventName>(
  eventName: E,
  properties: ProductEventMap[E]
): void {
  try {
    if (typeof window === 'undefined') return;

    if (window.posthog?.capture) {
      window.posthog.capture(eventName, properties as Record<string, unknown>);
      return;
    }

    if (process.env.NODE_ENV === 'development') {
      // Log informativo apenas em desenvolvimento local
      console.debug(`[Telemetry] ${eventName}`, properties);
    }
  } catch {
    // Analytics nunca deve interromper ou quebrar a experiência do usuário
  }
}
