'use client';

import { useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { removeFromUpNext } from '@/features/up-next/actions';

export function RemoveQueueButton({ bookId }: { bookId: string }) {
  const [busy, startTransition] = useTransition();
  const router = useRouter();

  function handleRemove() {
    startTransition(async () => {
      await removeFromUpNext(bookId);
      router.refresh();
    });
  }

  return (
    <button
      className="button button-quiet button-small"
      type="button"
      onClick={handleRemove}
      disabled={busy}
    >
      {busy ? 'Removendo…' : 'Remover da fila'}
    </button>
  );
}
