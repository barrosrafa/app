'use client';

import { useTransition } from 'react';
import { archiveJournalEntry, restoreJournalEntry } from '@/features/journal/actions';

export function JournalEntryActions({ id, archived = false }: { id: string; archived?: boolean }) {
  const [pending, startTransition] = useTransition();
  const action = archived ? restoreJournalEntry : archiveJournalEntry;
  return <form action={() => startTransition(() => { void action(id); })}><button className="button button-quiet button-small" type="submit" disabled={pending}>{pending ? 'Salvando…' : archived ? 'Restaurar' : 'Arquivar'}</button></form>;
}
