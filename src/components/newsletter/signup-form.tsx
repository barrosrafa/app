'use client';

import { useState, useTransition } from 'react';
import { subscribeNewsletter } from '@/features/newsletter/actions';

export function NewsletterSignupForm() {
  const [busy, startTransition] = useTransition();
  const [feedback, setFeedback] = useState<{ ok: boolean; message: string } | null>(null);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFeedback(null);
    const form = new FormData(event.currentTarget);
    const email = form.get('email');
    const consent = form.get('consent') === 'on';

    startTransition(async () => {
      const result = await subscribeNewsletter({ email, consent });
      setFeedback(result);
      if (result.ok) {
        (event.target as HTMLFormElement).reset();
      }
    });
  }

  return (
    <div className="newsletter-card" style={{ padding: '24px', background: 'var(--surface-2)', borderRadius: 'var(--radius-lg)', marginTop: '24px' }}>
      <span className="eyebrow">Novidades por e-mail</span>
      <h3 style={{ marginTop: '4px', marginBottom: '8px' }}>Receba as datas e cronogramas de leitura</h3>
      <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-sm)', marginBottom: '16px' }}>
        Avisamos quando novos ciclos forem abertos e quando os encontros ao vivo forem agendados. Sem spam.
      </p>

      <form onSubmit={handleSubmit} className="auth-form" style={{ maxWidth: '420px' }}>
        <div className="form-group">
          <label htmlFor="newsletter-email">Seu e-mail</label>
          <input
            id="newsletter-email"
            name="email"
            type="email"
            required
            className="field"
            placeholder="leitor@exemplo.com"
            disabled={busy}
          />
        </div>

        <label className="checkbox-line" style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)' }}>
          <input type="checkbox" name="consent" required disabled={busy} />
          Concordo em receber comunicações sobre as leituras do DIYSPUR.
        </label>

        <button className="button button-small" type="submit" disabled={busy} style={{ marginTop: '8px' }}>
          {busy ? 'Inscrevendo…' : 'Inscrever-se na newsletter'}
        </button>

        {feedback && (
          <p className={`action-feedback ${feedback.ok ? 'success' : 'error'}`} role="status" aria-live="polite">
            {feedback.message}
          </p>
        )}
      </form>
    </div>
  );
}
