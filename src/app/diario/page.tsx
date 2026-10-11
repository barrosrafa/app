import type { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { requireSession } from '@/lib/auth/session';
import { JournalEntryForm } from '@/components/journal/journal-entry-form';
import { JournalEntryActions } from '@/components/journal/journal-entry-actions';
import { getJournalEntries } from '@/features/journal/queries';

type BookOption = { id: string; title: string };
export const metadata: Metadata = { title: 'Diário de leitura', description: 'Suas anotações privadas de leitura.', robots: { index: false, follow: false } };
export default async function JournalPage({ searchParams }: { searchParams: Promise<{ cursor?: string }> }) {
  const session = await requireSession();
  if (!session) redirect('/entrar?redirect=/diario');
  // The generated database contract is refreshed after applying the lifecycle migration.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const db = session.client as any;
  const { cursor } = await searchParams;
  const [{ data: rawBooks }, journal] = await Promise.all([
    db.from('books').select('id,title').order('title').limit(100),
    getJournalEntries(session.userId, cursor),
  ]) as [{ data: BookOption[] | null }, Awaited<ReturnType<typeof getJournalEntries>>];
  const books = rawBooks ?? [];
  const entries = journal.data ?? [];
  const bookMap = new Map<string, string>(books.map((book) => [book.id, book.title]));
  return <section className="container"><header className="page-intro"><span className="eyebrow">Seu espaço</span><h1>O que a leitura<br /><em style={{ color: 'var(--color-primary)' }}>deixou.</em></h1><p>Um diário privado para guardar ideias, ritmo e pequenas descobertas. Seu diário é privado.</p></header><JournalEntryForm books={books} /><section className="section" style={{ paddingTop: 58 }}><div className="section-head"><div><span className="eyebrow">Memória</span><h2>Registros recentes</h2></div><Link className="text-link" href="/livros">Explorar livros →</Link></div>{journal.error ? <div className="empty-state"><h2>Não foi possível carregar seu diário agora.</h2><p>Tente atualizar a página em alguns instantes.</p></div> : entries.length ? <><div className="timeline">{entries.map((entry) => <article className="member-card" key={entry.id}><div className="section-head"><span className="eyebrow">{new Intl.DateTimeFormat('pt-BR', { dateStyle: 'medium' }).format(new Date(`${entry.entry_date}T12:00:00`))}</span><JournalEntryActions id={entry.id} /></div><h3 style={{ font: '500 22px var(--font-serif)', marginTop: 9 }}>{entry.title || bookMap.get(entry.book_id) || 'Registro de leitura'}</h3><p style={{ whiteSpace: 'pre-wrap' }}>{entry.body}</p><p className="field-hint">{bookMap.get(entry.book_id) ?? 'Livro'}{entry.page_from ? ` · páginas ${entry.page_from}${entry.page_to ? `–${entry.page_to}` : ''}` : ''}{entry.minutes_read ? ` · ${entry.minutes_read} min` : ''}{entry.is_spoiler ? ' · spoiler marcado' : ''}</p></article>)}</div>{journal.nextCursor && <p style={{ marginTop: 20 }}><Link className="button button-quiet button-small" href={{ pathname: '/diario', query: { cursor: journal.nextCursor } }}>Carregar registros anteriores</Link></p>}</> : <div className="empty-state"><div className="empty-state-mark">✎</div><h2>Seu diário começa aqui</h2><p>Registre uma impressão depois do próximo capítulo.</p></div>}</section></section>;
}
