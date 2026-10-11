'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export interface NavLinkItem {
  href: string;
  label: string;
}

interface MobileNavProps {
  links: NavLinkItem[];
  signedIn?: boolean;
}

export function MobileNav({ links, signedIn = false }: MobileNavProps) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    if (open) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [open]);

  return (
    <>
      <button
        type="button"
        className="mobile-nav-toggle"
        onClick={() => setOpen((prev) => !prev)}
        aria-expanded={open}
        aria-controls="mobile-nav-panel"
        aria-label={open ? 'Fechar menu de navegação' : 'Abrir menu de navegação'}
      >
        {open ? (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        ) : (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <line x1="4" y1="7" x2="20" y2="7" />
            <line x1="4" y1="12" x2="20" y2="12" />
            <line x1="4" y1="17" x2="20" y2="17" />
          </svg>
        )}
      </button>

      <div
        className={`nav-mobile-backdrop ${open ? 'open' : ''}`}
        onClick={() => setOpen(false)}
        aria-hidden="true"
      />

      <div
        id="mobile-nav-panel"
        hidden={!open}
        className={`nav-mobile-panel ${open ? 'open' : ''}`}
        role={open ? 'dialog' : undefined}
        aria-modal={open ? true : undefined}
        aria-label="Menu móvel"
      >
        <nav className="nav-mobile-links" aria-label="Navegação móvel principal">
          {links.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`nav-mobile-link ${isActive ? 'active' : ''}`}
                onClick={() => setOpen(false)}
              >
                <span>{link.label}</span>
                <span aria-hidden="true">→</span>
              </Link>
            );
          })}
        </nav>

        <div className="nav-mobile-actions">
          {signedIn ? (
            <Link
              href="/perfil"
              className="btn btn-secondary btn-block"
              onClick={() => setOpen(false)}
            >
              Meu espaço
            </Link>
          ) : (
            <>
              <Link
                href="/cadastro"
                className="btn btn-primary btn-block"
                onClick={() => setOpen(false)}
              >
                Fazer parte do clube ↗
              </Link>
              <Link
                href="/entrar"
                className="btn btn-secondary btn-block"
                onClick={() => setOpen(false)}
              >
                Entrar
              </Link>
            </>
          )}
        </div>
      </div>
    </>
  );
}
