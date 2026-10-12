import Link from 'next/link';
import Image from 'next/image';
import { getBooks, getMeetings, getActiveSeason } from '@/features/catalog/queries';
import { getPublicPolls } from '@/features/polls/queries';
import { BookCard } from '@/components/book-card';

export default async function HomePage() {
  const [books, meetings, activeSeason, polls] = await Promise.all([
    getBooks(),
    getMeetings(),
    getActiveSeason(),
    getPublicPolls(),
  ]);

  const featuredBook = activeSeason?.book ?? books[0];
  const activePoll = polls[0];

  return (
    <>
      {/* 1. Hero Section — Alinhado com o Wireframe do SDD */}
      <section className="hero">
        <div className="container hero-copy">
          <div className="hero-badge">
            <span className="badge-dot" aria-hidden="true" />
            O CLUBE DE LEITURA COLETIVO
          </div>
          <h1>
            Histórias ganham vida quando lidas <em>juntas.</em>
          </h1>
          <p className="hero-lede">
            Cronogramas sem pressa, discussões capítulo a capítulo e encontros ao vivo para quem ama ler em comunidade.
          </p>
          <div className="hero-cta">
            <Link className="btn btn-primary btn-lg" href="#temporada-destaque">
              Começar a ler junto <span aria-hidden="true">↗</span>
            </Link>
            <Link className="btn btn-secondary btn-lg" href="/livros">
              Descobrir leituras <span aria-hidden="true">↗</span>
            </Link>
            <Link className="btn btn-ghost btn-sm" href="#como-funciona" style={{ marginTop: '4px' }}>
              Ver como funciona ↓
            </Link>
          </div>
          <p className="hero-micro">
            Aberto a todos os leitores · Sem mensalidade obrigatória · 100% colaborativo
          </p>
        </div>
      </section>

      {/* 2. Seção "Como Funciona o DIYSPUR em 3 Passos" */}
      <section id="como-funciona" className="steps-section container">
        <div className="section-head" style={{ textAlign: 'center', alignItems: 'center' }}>
          <div>
            <span className="eyebrow">Simples, leve e acolhedor</span>
            <h2>Como funciona o DIYSPUR</h2>
            <p>Três passos para nunca mais ler um livro no isolamento.</p>
          </div>
        </div>

        <div className="steps-grid">
          <article className="step-card">
            <span className="step-number">1</span>
            <h3 className="step-title">Escolha a Temporada</h3>
            <p className="step-desc">
              Descubra a leitura coletiva do momento com cronograma semanal sugerido, metas de leitura e contexto editorial sem pressa.
            </p>
          </article>

          <article className="step-card">
            <span className="step-number">2</span>
            <h3 className="step-title">Leia no Seu Ritmo</h3>
            <p className="step-desc">
              Acompanhe os capítulos semana a semana, marque seus avanços no diário e teste reflexões com quizzes rápidos sem ansiedade.
            </p>
          </article>

          <article className="step-card">
            <span className="step-number">3</span>
            <h3 className="step-title">Debata Sem Spoilers</h3>
            <p className="step-desc">
              Converse trecho a trecho com comentários protegidos e encontre o clube em debates virtuais ao vivo para trocar teorias.
            </p>
          </article>
        </div>
      </section>

      {/* 3. Temporada em Destaque (Season Spotlight) */}
      <section id="temporada-destaque" className="section container">
        <div className="section-head">
          <div>
            <span className="eyebrow">Ciclo de Leitura em Andamento</span>
            <h2>Temporada em Destaque</h2>
            <p>A comunidade está reunida lendo e debatendo esta obra agora mesmo.</p>
          </div>
          {activeSeason?.season && (
            <Link className="text-link" href={`/temporadas/${activeSeason.season.slug}`}>
              Ver cronograma completo <span aria-hidden="true">→</span>
            </Link>
          )}
        </div>

        {activeSeason?.season ? (
          <div className="season-spotlight-card">
            <div className="season-spotlight-cover">
              {activeSeason.season.cover_url || activeSeason.book?.cover_url ? (
                <Image
                  src={(activeSeason.season.cover_url || activeSeason.book?.cover_url)!}
                  alt={`Capa do livro ${activeSeason.book?.title ?? activeSeason.season.title}`}
                  width={240}
                  height={348}
                  priority
                />
              ) : (
                <div className="cover-placeholder">
                  {activeSeason.book?.title ?? activeSeason.season.title}
                </div>
              )}
            </div>

            <div className="season-spotlight-content">
              <div className="detail-pills">
                <span className="status-pill">Temporada {activeSeason.season.number} · Em andamento</span>
                {activeSeason.nextMeeting && (
                  <span className="status-pill neutral">Encontro ao vivo marcado</span>
                )}
              </div>

              <h3 style={{ fontSize: 'var(--text-display-lg)', fontWeight: 'var(--weight-display)', margin: '4px 0' }}>
                {activeSeason.book?.title ?? activeSeason.season.title}
              </h3>

              <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-body)', margin: '0 0 12px' }}>
                {activeSeason.season.description ?? 'Acompanhe a leitura coletiva semana a semana com o clube.'}
              </p>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--text-caption)', color: 'var(--text-tertiary)', marginBottom: '4px' }}>
                  <span>Progresso do ciclo</span>
                  <span>{activeSeason.publishedChapters} de {activeSeason.totalChapters} capítulos liberados</span>
                </div>
                <div className="season-progress-bar-wrap">
                  <div
                    className="season-progress-bar-fill"
                    style={{
                      width: `${activeSeason.totalChapters ? Math.min(100, Math.round((activeSeason.publishedChapters / activeSeason.totalChapters) * 100)) : 20}%`,
                    }}
                  />
                </div>
              </div>

              {activeSeason.nextMeeting && (
                <p style={{ fontSize: 'var(--text-body-sm)', color: 'var(--text-secondary)' }}>
                  🎙️ <strong>Próximo debate:</strong>{' '}
                  {new Intl.DateTimeFormat('pt-BR', {
                    dateStyle: 'full',
                    timeStyle: 'short',
                    timeZone: 'America/Sao_Paulo',
                  }).format(new Date(activeSeason.nextMeeting.scheduled_at))}{' '}
                  (horário de Brasília)
                </p>
              )}

              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginTop: '12px' }}>
                <Link className="btn btn-primary" href={`/temporadas/${activeSeason.season.slug}`}>
                  Entrar nesta leitura <span aria-hidden="true">↗</span>
                </Link>
                {activeSeason.book && (
                  <Link className="btn btn-secondary" href={`/livros/${activeSeason.book.slug}`}>
                    Ver ficha do livro
                  </Link>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="notice">
            A temporada do próximo ciclo será anunciada em breve.{' '}
            <Link className="text-link" href="/livros">
              Explore os livros disponíveis →
            </Link>
          </div>
        )}
      </section>

      {/* 4. Reader Demo Mockup — Demonstração Interativa */}
      <section className="section container">
        <div className="section-head" style={{ textAlign: 'center', alignItems: 'center' }}>
          <div>
            <span className="eyebrow">A Experiência no Navegador</span>
            <h2>Segunda tela para quem ama ler</h2>
            <p>Seja com livro físico, Kindle ou Kobo: o DIYSPUR é seu espaço de debate e acompanhamento.</p>
          </div>
        </div>

        <div className="hero-mockup" aria-label="Demonstração interativa do leitor DIYSPUR">
          <div className="mac-window-frame">
            <div className="mac-window-toolbar">
              <div className="mac-lights" aria-hidden="true">
                <span className="light red" />
                <span className="light amber" />
                <span className="light green" />
              </div>
              <div className="mac-window-title">
                <span>📖</span>
                <span>Exemplo demonstrativo · DIYSPUR Reader</span>
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
                  {featuredBook?.title ?? 'Verity'}
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
      </section>

      {/* 5. Próximos Encontros e Votação Popular (Grid 2 Colunas) */}
      <section className="section container">
        <div className="home-split-grid">
          {/* Coluna A: Calendário de Encontros */}
          <div className="cell" style={{ padding: 'var(--space-6)', borderRadius: 'var(--radius-card)', background: 'var(--surface-1)', border: '1px solid var(--border)' }}>
            <div className="section-head" style={{ marginBottom: '16px' }}>
              <div>
                <span className="eyebrow">Agenda</span>
                <h3 style={{ fontSize: 'var(--text-title)', fontWeight: 'var(--weight-display)' }}>Próximos debates ao vivo</h3>
              </div>
              <Link className="text-link" href="/calendario">
                Ver todos →
              </Link>
            </div>

            {meetings.length ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {meetings.slice(0, 2).map((meeting) => (
                  <Link className="meeting-row" key={meeting.id} href="/calendario">
                    <div>
                      <h4 style={{ fontSize: 'var(--text-body)', fontWeight: 'var(--weight-semibold)', margin: 0 }}>
                        {meeting.title}
                      </h4>
                      <p style={{ fontSize: 'var(--text-caption)', color: 'var(--text-secondary)', margin: '4px 0 0' }}>
                        {new Intl.DateTimeFormat('pt-BR', {
                          dateStyle: 'medium',
                          timeStyle: 'short',
                          timeZone: 'America/Sao_Paulo',
                        }).format(new Date(meeting.scheduled_at))}{' '}
                        · horário de Brasília
                      </p>
                    </div>
                    <span className="status-pill">
                      {meeting.status === 'live' ? 'AO VIVO' : 'Agendado'}
                    </span>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="field-hint">Novas datas serão agendadas em breve para o ciclo.</p>
            )}
          </div>

          {/* Coluna B: Votação da Próxima Leitura */}
          <div className="cell" style={{ padding: 'var(--space-6)', borderRadius: 'var(--radius-card)', background: 'var(--surface-1)', border: '1px solid var(--border)' }}>
            <div className="section-head" style={{ marginBottom: '16px' }}>
              <div>
                <span className="eyebrow">Escolha Coletiva</span>
                <h3 style={{ fontSize: 'var(--text-title)', fontWeight: 'var(--weight-display)' }}>Próxima leitura do clube</h3>
              </div>
              <Link className="text-link" href="/votacao">
                Votar →
              </Link>
            </div>

            {activePoll ? (
              <div>
                <h4 style={{ fontSize: 'var(--text-body)', fontWeight: 'var(--weight-semibold)', marginBottom: '8px' }}>
                  {activePoll.title}
                </h4>
                <p style={{ fontSize: 'var(--text-body-sm)', color: 'var(--text-secondary)', marginBottom: '16px' }}>
                  A comunidade decide democraticamente o que vamos ler a seguir. Participe com seu voto.
                </p>
                <Link className="btn btn-primary btn-sm" href="/votacao">
                  Votar na enquete ativa ↗
                </Link>
              </div>
            ) : (
              <div>
                <p style={{ fontSize: 'var(--text-body-sm)', color: 'var(--text-secondary)', marginBottom: '16px' }}>
                  A próxima votação de leitura será aberta ao final do ciclo atual. Leitores cadastrados votam gratuitamente.
                </p>
                <Link className="btn btn-secondary btn-sm" href="/votacao">
                  Ver histórico de votações
                </Link>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 6. Prova Social e Depoimentos */}
      <section className="section container">
        <div className="section-head" style={{ textAlign: 'center', alignItems: 'center' }}>
          <div>
            <span className="eyebrow">Comunidade</span>
            <h2>Quem lê junto, lê mais longe</h2>
            <p>O que nossos leitores dizem sobre participar das temporadas.</p>
          </div>
        </div>

        <div className="testimonials-grid">
          <div className="testimonial-card">
            <p className="testimonial-quote">
              “Sempre abandonava livros densos no meio. Ter encontros marcados e o cronograma semana a semana me fez finalmente terminar leituras desafiadoras.”
            </p>
            <div className="testimonial-author">
              <div className="testimonial-avatar">C</div>
              <div className="testimonial-meta">
                <span className="testimonial-name">Camila S.</span>
                <span className="testimonial-role">Leitora desde a Temporada 1</span>
              </div>
            </div>
          </div>

          <div className="testimonial-card">
            <p className="testimonial-quote">
              “O melhor do DIYSPUR é poder comentar sem medo de spoiler. Eu leio no meu ritmo e sei que ninguém vai estragar o final antes da hora.”
            </p>
            <div className="testimonial-author">
              <div className="testimonial-avatar">F</div>
              <div className="testimonial-meta">
                <span className="testimonial-name">Felipe M.</span>
                <span className="testimonial-role">Participante dos debates ao vivo</span>
              </div>
            </div>
          </div>

          <div className="testimonial-card">
            <p className="testimonial-quote">
              “A sensação de debater um plot twist incrível logo depois de ler o capítulo com outras pessoas é imbatível. Parece um clube de amigos de verdade.”
            </p>
            <div className="testimonial-author">
              <div className="testimonial-avatar">L</div>
              <div className="testimonial-meta">
                <span className="testimonial-name">Larissa R.</span>
                <span className="testimonial-role">Membro do clube</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. Catálogo / Biblioteca Geral */}
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

      {/* 8. Membership & CTA Final de Adesão */}
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
