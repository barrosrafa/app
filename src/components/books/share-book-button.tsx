'use client';

import { useState } from 'react';

interface ShareBookButtonProps {
  bookTitle: string;
  bookSlug: string;
}

export function ShareBookButton({ bookTitle, bookSlug }: ShareBookButtonProps) {
  const [copied, setCopied] = useState(false);

  async function handleShare() {
    const url = typeof window !== 'undefined' ? `${window.location.origin}/livros/${bookSlug}` : `/livros/${bookSlug}`;
    const shareData = {
      title: `Vamos ler "${bookTitle}" juntos no DIYSPUR?`,
      text: `Estou acompanhando o clube de leitura de "${bookTitle}" no DIYSPUR com discussões capítulo a capítulo sem spoilers!`,
      url,
    };

    if (typeof navigator !== 'undefined' && navigator.share && navigator.canShare?.(shareData)) {
      try {
        await navigator.share(shareData);
        return;
      } catch (error) {
        if ((error as Error).name === 'AbortError') return;
      }
    }

    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    } catch {
      // Fallback silencioso
    }
  }

  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
      <button
        type="button"
        className="btn btn-secondary btn-sm"
        onClick={handleShare}
        aria-label={`Convidar amigos para ler ${bookTitle} juntos`}
      >
        <span aria-hidden="true">🤝</span>{' '}
        {copied ? '✓ Link copiado!' : 'Convidar amigo para ler junto'}
      </button>
      {copied && (
        <span className="field-hint" role="status" style={{ color: 'var(--positive-text)' }}>
          Link copiado para a área de transferência!
        </span>
      )}
    </div>
  );
}
