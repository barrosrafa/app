'use client';

import { useState, useTransition } from 'react';
import {
  removeBookFromReadingList,
  restoreBookToReadingList,
  reorderReadingList,
  updateReadingList,
} from '@/features/lists/actions';

type Item = { id: string; position: number };

export function ListManagement({
  listId,
  version,
  title,
  description,
  items,
}: {
  listId: string;
  version: number;
  title: string;
  description: string | null;
  items: Item[];
}) {
  const [open, setOpen] = useState(false);
  const [result, setResult] = useState('');
  const [busy, start] = useTransition();

  function edit(form: FormData) {
    start(async () => {
      const response = await updateReadingList({
        listId,
        title: form.get('title'),
        description: form.get('description'),
      });
      setResult(response.message);
    });
  }

  function move(index: number, direction: -1 | 1) {
    const next = [...items].sort((a, b) => a.position - b.position);
    const target = index + direction;
    if (target < 0 || target >= next.length) return;
    [next[index], next[target]] = [next[target], next[index]];
    start(async () =>
      setResult(
        (
          await reorderReadingList({
            listId,
            version,
            itemIds: next.map((item) => item.id),
          })
        ).message
      )
    );
  }

  return (
    <div className="chapter-progress-actions">
      <button
        className="button button-quiet button-small"
        type="button"
        onClick={() => setOpen((value) => !value)}
      >
        {open ? 'Fechar gestão' : 'Gerenciar lista'}
      </button>
      {open && (
        <div className="member-card">
          <form className="auth-form" action={edit}>
            <label>
              Nome
              <input className="field" name="title" defaultValue={title} />
            </label>
            <label>
              Descrição
              <textarea
                className="field"
                name="description"
                defaultValue={description ?? ''}
                rows={3}
              />
            </label>
            <button className="button button-small" disabled={busy}>
              Salvar lista
            </button>
          </form>
          {items.length > 1 && (
            <div className="chapter-progress-actions">
              {items.map((item, index) => (
                <span key={item.id}>
                  <button
                    className="button button-quiet button-small"
                    disabled={busy || index === 0}
                    onClick={() => move(index, -1)}
                    aria-label="Mover para cima"
                  >
                    ↑
                  </button>
                  <button
                    className="button button-quiet button-small"
                    disabled={busy || index === items.length - 1}
                    onClick={() => move(index, 1)}
                    aria-label="Mover para baixo"
                  >
                    ↓
                  </button>
                </span>
              ))}
            </div>
          )}
          {result && <p className="action-feedback" role="status">{result}</p>}
        </div>
      )}
    </div>
  );
}

export function RemoveListItemButton({
  listId,
  itemId,
}: {
  listId: string;
  itemId: string;
}) {
  const [removed, setRemoved] = useState(false);
  const [result, setResult] = useState('');
  const [busy, start] = useTransition();

  const run = (action: typeof removeBookFromReadingList) =>
    start(async () => {
      const response = await action({ listId, itemId });
      setResult(response.message);
      if (response.ok) setRemoved(action === removeBookFromReadingList);
    });

  return removed ? (
    <button
      className="button button-quiet button-small"
      type="button"
      disabled={busy}
      onClick={() => run(restoreBookToReadingList)}
    >
      Desfazer remoção
    </button>
  ) : (
    <button
      className="button button-quiet button-small"
      type="button"
      disabled={busy}
      onClick={() => run(removeBookFromReadingList)}
    >
      {result || (busy ? 'Removendo…' : 'Remover')}
    </button>
  );
}
