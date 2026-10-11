'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { setReadingGoal } from '@/features/goals/actions';
import type { ReadingGoal } from '@/features/goals/queries';

export function GoalForm({ goal, year }: { goal: ReadingGoal | null; year: number }) {
  const [busy, startTransition] = useTransition();
  const [feedback, setFeedback] = useState<{ ok: boolean; message: string } | null>(null);
  const router = useRouter();

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFeedback(null);
    const form = new FormData(event.currentTarget);
    const targetBooks = form.get('targetBooks');
    const targetPages = form.get('targetPages');
    const targetMinutes = form.get('targetMinutes');

    startTransition(async () => {
      const result = await setReadingGoal({
        year,
        targetBooks: targetBooks ? Number(targetBooks) : null,
        targetPages: targetPages ? Number(targetPages) : null,
        targetMinutes: targetMinutes ? Number(targetMinutes) : null,
      });
      setFeedback(result);
      if (result.ok) router.refresh();
    });
  }

  return (
    <form className="auth-form" onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="targetBooks">Meta de Livros lidos em {year}</label>
        <input
          id="targetBooks"
          name="targetBooks"
          type="number"
          min="1"
          max="365"
          className="field"
          placeholder="Ex: 12"
          defaultValue={goal?.target_books ?? ''}
        />
        <span className="field-hint">Quantos livros você planeja concluir ao longo do ano.</span>
      </div>

      <div className="form-group">
        <label htmlFor="targetPages">Meta de Páginas lidas</label>
        <input
          id="targetPages"
          name="targetPages"
          type="number"
          min="1"
          max="50000"
          className="field"
          placeholder="Ex: 3000"
          defaultValue={goal?.target_pages ?? ''}
        />
        <span className="field-hint">Calculado a partir dos registros do seu diário de leitura.</span>
      </div>

      <div className="form-group">
        <label htmlFor="targetMinutes">Meta de Minutos dedicados</label>
        <input
          id="targetMinutes"
          name="targetMinutes"
          type="number"
          min="1"
          max="500000"
          className="field"
          placeholder="Ex: 6000"
          defaultValue={goal?.target_minutes ?? ''}
        />
        <span className="field-hint">Minutos de leitura anotados no seu diário.</span>
      </div>

      <button className="button button-small" type="submit" disabled={busy}>
        {busy ? 'Salvando…' : 'Salvar meta'}
      </button>

      {feedback && (
        <p className={`action-feedback ${feedback.ok ? 'success' : 'error'}`} role="status">
          {feedback.message}
        </p>
      )}
    </form>
  );
}
