'use client';

import { useState } from 'react';

interface CommentSpoilerCardProps {
  content: string | null;
  isSpoiler: boolean;
  isLocked: boolean;
  chapterNumber?: number | string;
}

export function CommentSpoilerCard({
  content,
  isSpoiler,
  isLocked,
  chapterNumber,
}: CommentSpoilerCardProps) {
  const [revealed, setRevealed] = useState(!isSpoiler);

  if (isLocked || content === null) {
    return (
      <p className="spoiler-locked">
        Este comentário contém spoiler protegido. Avance seu progresso no capítulo para liberar o texto.
      </p>
    );
  }

  if (isSpoiler && !revealed) {
    return (
      <div className="spoiler-warning-card" role="region" aria-label="Aviso de spoiler">
        <span className="spoiler-warning-text">
          <span aria-hidden="true">⚠️</span>
          <span>
            Este comentário contém spoiler{chapterNumber ? ` do capítulo ${chapterNumber}` : ''}.
          </span>
        </span>
        <button
          type="button"
          className="spoiler-reveal-btn"
          onClick={() => setRevealed(true)}
          aria-label="Revelar comentário com spoiler"
        >
          Revelar comentário
        </button>
      </div>
    );
  }

  if (isSpoiler && revealed) {
    return (
      <div>
        <div className="spoiler-revealed-content">{content}</div>
        <button
          type="button"
          className="spoiler-hide-btn"
          onClick={() => setRevealed(false)}
        >
          Ocultar spoiler novamente
        </button>
      </div>
    );
  }

  return <p>{content}</p>;
}
