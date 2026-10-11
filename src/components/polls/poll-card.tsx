'use client';

import Link from 'next/link';
import { useState, useTransition, type FormEvent } from 'react';
import { castPollVote } from '@/features/polls/actions';
import type { PublicPoll } from '@/features/polls/queries';

function formatCloseDate(value: string): string {
  return new Intl.DateTimeFormat('pt-BR', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value));
}

export function PollCard({ poll }: { poll: PublicPoll }) {
  const [selectedOption, setSelectedOption] = useState('');
  const [feedback, setFeedback] = useState<{ message: string; ok: boolean; requiresAuth?: boolean } | null>(null);
  const [isPending, startTransition] = useTransition();
  const hasVoted = feedback?.ok === true;

  function submitVote(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFeedback(null);
    if (!selectedOption) {
      setFeedback({ message: 'Escolha uma opção antes de votar.', ok: false });
      return;
    }

    startTransition(async () => {
      try {
        const result = await castPollVote({ pollId: poll.id, optionId: selectedOption });
        setFeedback({ message: result.message, ok: result.ok, requiresAuth: result.ok ? undefined : result.requiresAuth });
      } catch {
        setFeedback({ message: 'Não foi possível registrar seu voto agora. Tente novamente.', ok: false });
      }
    });
  }

  if (poll.closed) {
    const totalVotes = poll.options.reduce((sum, option) => sum + (option.votes_count ?? 0), 0);
    return (
      <article className="poll-card" aria-labelledby={`poll-title-${poll.id}`}>
        <span className="eyebrow">Resultado da comunidade</span>
        <h2 id={`poll-title-${poll.id}`} className="poll-title">
          {poll.title}
        </h2>
        <p className="field-hint">
          Votação encerrada · {totalVotes} voto{totalVotes === 1 ? '' : 's'}
        </p>
        <div className="poll-results">
          {poll.options.map((option, index) => {
            const votes = option.votes_count ?? 0;
            const percentage = totalVotes ? Math.round((votes / totalVotes) * 100) : 0;
            return (
              <div key={option.id} className="poll-result-item">
                <div className="poll-result-label">
                  <strong>{option.proposal?.trim() || `Opção ${index + 1}`}</strong>
                  <span className="field-hint">
                    {percentage}% · {votes}
                  </span>
                </div>
                <div className="poll-progress-track" aria-hidden="true">
                  <div
                    className="poll-progress-bar"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </article>
    );
  }

  return (
    <article className="poll-card" aria-labelledby={`poll-title-${poll.id}`}>
      <div className="poll-head">
        <div>
          <span className="eyebrow">Enquete aberta</span>
          <h2 id={`poll-title-${poll.id}`} className="poll-title">
            {poll.title}
          </h2>
        </div>
        <span className="status-pill">Aberta</span>
      </div>
      <p className="field-hint">
        Você pode escolher uma opção até {formatCloseDate(poll.closes_at)}.
      </p>
      {!hasVoted && (
        <p className="field-hint">
          Já faz parte do clube?{' '}
          <Link className="text-link" href={{ pathname: '/entrar', query: { redirect: '/votacao' } }}>
            Entre para votar
          </Link>
          .
        </p>
      )}

      <form onSubmit={submitVote}>
        <fieldset disabled={isPending || hasVoted} style={{ border: 0, margin: '18px 0 0', padding: 0 }}>
          <legend className="sr-only">Opções para {poll.title}</legend>
          <div className="poll-options">
            {poll.options.map((option, index) => {
              const inputId = `poll-${poll.id}-option-${option.id}`;
              return (
                <label
                  htmlFor={inputId}
                  key={option.id}
                  className="poll-option"
                >
                  <input
                    id={inputId}
                    name={`poll-${poll.id}`}
                    type="radio"
                    value={option.id}
                    checked={selectedOption === option.id}
                    onChange={() => setSelectedOption(option.id)}
                  />
                  <span className="poll-option-text">
                    <strong>{option.proposal?.trim() || `Opção ${index + 1}`}</strong>
                    <span className="field-hint">Uma escolha da comunidade</span>
                  </span>
                </label>
              );
            })}
          </div>
        </fieldset>

        <div className="poll-actions">
          <button className="button button-small" type="submit" disabled={isPending || hasVoted}>
            {isPending ? 'Registrando…' : hasVoted ? 'Voto registrado' : 'Votar nesta opção'}
          </button>
          <span className="field-hint">O resultado aparece só depois do encerramento.</span>
        </div>
      </form>

      {feedback && (
        <div className={`notice${feedback.ok ? ' auth-success' : ''}`} role={feedback.ok ? 'status' : 'alert'} style={{ marginTop: '16px' }}>
          <p>{feedback.message}</p>
          {feedback.requiresAuth && (
            <p style={{ marginTop: '8px' }}>
              <Link className="text-link" href={{ pathname: '/entrar', query: { redirect: '/votacao' } }}>
                Entrar para votar
              </Link>
              {' · '}
              <Link className="text-link" href={{ pathname: '/cadastro', query: { redirect: '/votacao' } }}>
                Criar uma conta
              </Link>
            </p>
          )}
        </div>
      )}
    </article>
  );
}
