'use client';

import { useTransition, type ReactNode } from 'react';

export function SubmitButton({
  action,
  children,
  className = 'button',
}: {
  action: () => Promise<void> | void;
  children: ReactNode;
  className?: string;
}) {
  const [pending, startTransition] = useTransition();

  return (
    <button
      type="button"
      disabled={pending}
      onClick={() => startTransition(async () => { await action(); })}
      className={className}
    >
      {pending ? (
        <span className="button-loading">
          <span className="spinner" aria-hidden="true" />
          Processando…
        </span>
      ) : children}
    </button>
  );
}
