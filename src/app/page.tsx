import Link from 'next/link';
import { getBooks, getMeetings } from '@/features/catalog/queries';
import { BookCard } from '@/components/book-card';

export default async function HomePage() {
  const [books, meetings] = await Promise.all([getBooks(), getMeetings()]);

  const featuredBook = books[0];

  return (
    <>
      {/* Hero Section — Nimble Centered Layout (Mobile First) */}
      <section className="hero">
        <div className="container hero-copy">
          <div className="hero-badge">
            <span className="badge-dot" aria-hidden="true" />
            Clube de Leitura Coletivo
          </div>
          <h1>
            Histórias ganham vida quando lidas <em>juntas.</em>
          </h1>
          <p className="hero-lede">
            O DIYSPUR reúne leitores para mergulhar em livros capítulo a capítulo, trocar ideias ao vivo e descobrir novas perspectivas sem pressa.
          </p>
          <div className="hero-cta">
            <Link className="btn btn-primary btn-lg" href="/livros">
              Descobrir leituras <span aria-hidden="true">↗</span>
            </Link>
            <Link className="btn btn-secondary btn-lg" href="/comunidade">
              Conhecer a comunidade
            </Link>
          </div>
          <p className="hero-micro">
            Aberto a todos os leitores · Sem mensalidade obrigatória · 100% colaborativo
          </p>

          {/* App Preview Window Mockup */}
          <div className="hero-mockup" aria-label="Exemplo da experiência de leitura no DIYSPUR">
            <div className="mac-window-frame">
              <div className="mac-window-toolbar">
                <div className="mac-lights" aria-hidden="true">
                  <span className="light red" />
                  <span className="light amber" />
                  <span className="light green" />
                </div>
                <div className="mac-window-title">
                  <span>📖</span>
                  <span>Exemplo da experiência · DIYSPUR Reader</span>
                </div>
                <div className="mac-live-pill">
                  <span className="mac-live-dot" />
                  Leitura coletiva
                </div>
              </div>

              <div className="mac-window-body">
                <div className="mockup-pane-left">
                  <div className="mockup-book-badge">Temporada Atual</div>
                  <div className="mockup-book-title">
                    {featuredBook?.title ?? 'Entre Páginas e Encontros'}
                  </div>
                  <div className="mockup-chapter-row active">
                    <span>Capítulo 1 · Início do Ciclo</span>
                    <strong className="mockup-status-active">Em leitura</strong>
                  </div>
                  <div className="mockup-chapter-row">
                    <span>Capítulo 2 · Aprofundamento</span>
                    <span className="mockup-status-muted">Próx. semana</span>
                  </div>
                </div>

                <div className="mockup-pane-right">
                  <div className="mockup-quote-box">
                    <p className="mockup-quote-text">
                      “A verdadeira viagem de descobrimento não consiste em procurar novas paisagens, mas em ter novos olhos.”
                    </p>
                    <span className="mockup-quote-author">
                      — Reflexão compartilhada na conversa do capítulo
                    </span>
                  </div>
                  <div className="detail-pills">
                    <span className="status-pill">Discussão aberta</span>
                    <span className="status-pill neutral">Encontro com o clube</span>
                  </div>
                </div>
              </div>
            </div>
            <p className="field-hint" style={{ textAlign: 'center', marginTop: '12px' }}>
              Exemplo demonstrativo da experiência de leitura capítulo a capítulo.
            </p>
          </div>
        </div>
      </section>

      {/* Feature Grid — Nimble 3-Column Component (1-col on Mobile) */}
      <div className="container">
        <div className="feature-grid">
          <div className="cell">
            <span className="cell-icon" aria-hidden="true">📖</span>
            <h3 className="cell-title">Leituras por Capítulo</h3>
            <p className="cell-body">
              Acompanhe o ritmo do clube semana a semana. Ninguém toma spoiler e todo mundo compartilha reflexões no mesmo compasso.
            </p>
          </div>
          <div className="cell">
            <span className="cell-icon" aria-hidden="true">🎙️</span>
            <h3 className="cell-title">Encontros ao Vivo</h3>
            <p className="cell-body">
              Conversas virtuais periódicas para debater teorias, passagens marcantes e desfechos com quem viveu a história junto.
            </p>
          </div>
          <div className="cell">
            <span className="cell-icon" aria-hidden="true">💬</span>
            <h3 className="cell-title">Diário & Comunidade</h3>
            <p className="cell-body">
              Guarde suas citações prediletas, anote impressões de cada leitura e participe das votações dos próximos livros.
            </p>
          </div>
        </div>
      </div>

      {/* Catalog Section */}
      <section className="section container">
        <div className="section-head">
          <div>
            <span className="eyebrow">Biblioteca</span>
            <h2>Histórias para encontrar</h2>
            <p>Obras selecionadas para debater, se emocionar e dividir perspectivas.</p>
          </div>
          <Link className="text-link" href="/livros">
            Ver catálogo completo <span aria-hidden="true">→</span>
          </Link>
        </div>

        {books.length ? (
          <div className="book-grid">
            {books.slice(0, 4).map((book) => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <div className="empty-state-mark" aria-hidden="true">✳</div>
            <h3>Novas histórias estão a caminho</h3>
            <p>
              Estamos preparando a próxima seleção do clube. Enquanto isso, venha conhecer os leitores e as conversas em andamento.
            </p>
            <div className="empty-actions">
              <Link className="btn btn-secondary btn-sm" href="/comunidade">
                Explorar a comunidade
              </Link>
            </div>
          </div>
        )}
      </section>

      {/* Meetings Section */}
      <section className="section container">
        <div className="section-head">
          <div>
            <span className="eyebrow">Agenda</span>
            <h2>Próximos encontros</h2>
            <p>Conversas ao vivo sobre livros, ideias e tudo o que ficou nas entrelinhas.</p>
          </div>
          <Link className="text-link" href="/calendario">
            Abrir calendário completo <span aria-hidden="true">→</span>
          </Link>
        </div>

        {meetings.length ? (
          <div className="meeting-list">
            {meetings.slice(0, 3).map((meeting) => (
              <Link className="meeting-row" key={meeting.id} href="/calendario">
                <div>
                  <h3>{meeting.title}</h3>
                  <p>
                    {new Intl.DateTimeFormat('pt-BR', {
                      dateStyle: 'full',
                      timeStyle: 'short',
                      timeZone: 'America/Sao_Paulo',
                    }).format(new Date(meeting.scheduled_at))}{' '}
                    · horário de Brasília
                  </p>
                </div>
                <span className="status-pill">
                  {meeting.status === 'live' ? 'AO VIVO' : 'Encontro marcado'}
                </span>
              </Link>
            ))}
          </div>
        ) : (
          <div className="notice">
            A agenda do próximo ciclo será anunciada em breve.{' '}
            <Link className="text-link" href="/calendario">
              Acompanhe por aqui →
            </Link>
          </div>
        )}
      </section>

      {/* Membership / Price Card Section */}
      <section className="section container">
        <div className="price-card">
          <div className="price-head">
            <span className="price-amount">100% Livre</span>
            <span className="price-term">· gratuito</span>
          </div>
          <p className="price-note">
            Sem mensalidades, sem paywalls. Um espaço aberto e acolhedor feito por leitores para leitores.
          </p>
          <div className="price-actions">
            <Link className="btn btn-primary btn-lg" href="/cadastro">
              Criar minha conta gratuita <span aria-hidden="true">↗</span>
            </Link>
            <Link className="btn btn-secondary btn-sm" href="/livros">
              Explorar acervo de livros primeiro
            </Link>
          </div>
          <div className="price-guarantee">
            <span aria-hidden="true">✓</span>
            Participe no seu ritmo, quando e onde quiser.
          </div>
        </div>
      </section>
    </>
  );
}
