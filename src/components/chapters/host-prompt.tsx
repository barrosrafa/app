'use client';

import Link from 'next/link';
import { useState, useTransition } from 'react';
import { saveHostPromptVote } from '@/features/host-prompts/actions';

type HostPromptProps = {
  prompt: { id: string; question: string; options: string[] };
  results: { counts: number[]; total: number } | null;
  selectedOption: number | null;
  signedIn: boolean;
  chapterId: string;
};

export function HostPrompt({
  prompt,
  results,
  selectedOption,
  signedIn,
  chapterId,
}: HostPromptProps) {
  const [selected, setSelected] = useState<number | null>(selectedOption);
  const [saved, setSaved] = useState(Boolean(selectedOption !== null));
  const [feedback, setFeedback] = useState('');
  const [busy, startTransition] = useTransition();
  const counts = results?.counts ?? prompt.options.map(() => 0);
  const total = results?.total ?? 0;

  function submit() {
    if (selected === null) return;
    setFeedback('');
    startTransition(async () => {
      const result = await saveHostPromptVote({ promptId: prompt.id, optionIdx: selected });
      setFeedback(result.message);
      if (result.ok) setSaved(true);
    });
  }

  return (
    <section className="chapter-discussion host-prompt" aria-labelledby={`host-prompt-${prompt.id}`}>
      <span className="eyebrow">Pergunta do anfitrião</span>
      <h2 id={`host-prompt-${prompt.id}`}>{prompt.question}</h2>

      {!signedIn ? (
        <p className="notice">
          Entre para responder e comparar o resultado agregado.{' '}
          <Link className="text-link" href={`/entrar?redirect=${encodeURIComponent(`/capitulos/${chapterId}`)}`}>
            Entrar →
          </Link>
        </p>
      ) : (
        <>
          <fieldset disabled={busy} style={{ border: 0, padding: 0, margin: '18px 0' }}>
            <legend className="sr-only">Escolha uma resposta</legend>
            <div className="quiz-options">
              {prompt.options.map((option, index) => (
                <label className="quiz-option" key={`${prompt.id}-${index}`}>
                  <input
                    type="radio"
                    name={`host-prompt-${prompt.id}`}
                    checked={selected === index}
                    onChange={() => setSelected(index)}
                  />
                  <span>{option}</span>
                </label>
              ))}
            </div>
          </fieldset>
          <button
            className="button button-small"
            type="button"
            onClick={submit}
            disabled={busy || selected === null}
          >
            {busy ? 'Salvando…' : saved ? 'Atualizar resposta' : 'Responder'}
          </button>
          {saved && (
            <p className="field-hint" role="status">
              Sua resposta está registrada. Você pode trocar depois.
            </p>
          )}
        </>
      )}

      {feedback && <p className="action-feedback" role="status">{feedback}</p>}

      <div className="host-prompt-results">
        <p className="field-hint">
          {total} resposta{total === 1 ? '' : 's'} · resultado agregado
        </p>
        {prompt.options.map((option, index) => {
          const count = counts[index] ?? 0;
          const percentage = total ? Math.round((count / total) * 100) : 0;
          return (
            <div key={`result-${prompt.id}-${index}`} className="host-prompt-row">
              <div className="host-prompt-row-label">
                <span>{option}</span>
                <span className="field-hint">{percentage}%</span>
              </div>
              <div className="host-prompt-bar" aria-hidden="true">
                <div
                  className="host-prompt-bar-fill"
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
