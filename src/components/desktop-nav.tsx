'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function DesktopNav() {
  const [openDropdown, setOpenDropdown] = useState<'explore' | 'community' | null>(null);
  const pathname = usePathname();
  const navRef = useRef<HTMLDivElement>(null);

  // Fecha dropdowns na mudança de rota
  useEffect(() => {
    setOpenDropdown(null);
  }, [pathname]);

  // Fecha ao clicar fora ou pressionar Escape
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (navRef.current && !navRef.current.contains(event.target as Node)) {
        setOpenDropdown(null);
      }
    }
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setOpenDropdown(null);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const isExploreActive = pathname.startsWith('/livros') || pathname.startsWith('/clubes');
  const isCommunityActive =
    pathname.startsWith('/comunidade') ||
    pathname.startsWith('/calendario') ||
    pathname.startsWith('/votacao');
  const isJournalActive = pathname.startsWith('/diario');

  return (
    <nav className="nav-links" aria-label="Navegação principal" ref={navRef}>
      {/* Menu Dropdown: Explorar */}
      <div className="nav-dropdown">
        <button
          type="button"
          className={`nav-dropdown-trigger ${isExploreActive ? 'active' : ''}`}
          onClick={() => setOpenDropdown((prev) => (prev === 'explore' ? null : 'explore'))}
          aria-expanded={openDropdown === 'explore'}
          aria-haspopup="true"
        >
          <span>Explorar</span>
          <span className="nav-dropdown-chevron" aria-hidden="true">▼</span>
        </button>
        <div className={`nav-dropdown-menu ${openDropdown === 'explore' ? 'open' : ''}`} role="menu">
          <Link
            className="nav-dropdown-item"
            href="/livros"
            role="menuitem"
            onClick={() => setOpenDropdown(null)}
          >
            <span className="nav-dropdown-item-label">Livros</span>
            <span className="nav-dropdown-item-desc">Catálogo, sinopses e temporadas</span>
          </Link>
          <Link
            className="nav-dropdown-item"
            href="/clubes"
            role="menuitem"
            onClick={() => setOpenDropdown(null)}
          >
            <span className="nav-dropdown-item-label">Clubes</span>
            <span className="nav-dropdown-item-desc">Grupos e leituras ativas</span>
          </Link>
        </div>
      </div>

      {/* Menu Dropdown: Comunidade */}
      <div className="nav-dropdown">
        <button
          type="button"
          className={`nav-dropdown-trigger ${isCommunityActive ? 'active' : ''}`}
          onClick={() => setOpenDropdown((prev) => (prev === 'community' ? null : 'community'))}
          aria-expanded={openDropdown === 'community'}
          aria-haspopup="true"
        >
          <span>Comunidade</span>
          <span className="nav-dropdown-chevron" aria-hidden="true">▼</span>
        </button>
        <div className={`nav-dropdown-menu ${openDropdown === 'community' ? 'open' : ''}`} role="menu">
          <Link
            className="nav-dropdown-item"
            href="/comunidade"
            role="menuitem"
            onClick={() => setOpenDropdown(null)}
          >
            <span className="nav-dropdown-item-label">Conversas</span>
            <span className="nav-dropdown-item-desc">Ideias e debates dos leitores</span>
          </Link>
          <Link
            className="nav-dropdown-item"
            href="/calendario"
            role="menuitem"
            onClick={() => setOpenDropdown(null)}
          >
            <span className="nav-dropdown-item-label">Encontros</span>
            <span className="nav-dropdown-item-desc">Agenda de conversas ao vivo</span>
          </Link>
          <Link
            className="nav-dropdown-item"
            href="/votacao"
            role="menuitem"
            onClick={() => setOpenDropdown(null)}
          >
            <span className="nav-dropdown-item-label">Votação</span>
            <span className="nav-dropdown-item-desc">Escolha da próxima leitura</span>
          </Link>
        </div>
      </div>

      {/* Link Direto: Diário */}
      <Link className={isJournalActive ? 'active' : ''} href="/diario">
        Diário
      </Link>
    </nav>
  );
}
