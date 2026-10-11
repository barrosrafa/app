'use client';

import { useEffect, useState } from 'react';

function SunIcon() {
  return (
    <svg
      width="13"
      height="13"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="5" />
      <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg
      width="13"
      height="13"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  );
}

export function ThemeToggle() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const attr = document.documentElement.getAttribute('data-theme') as 'light' | 'dark' | null;
    const stored = localStorage.getItem('theme') as 'light' | 'dark' | null;
    const system = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    const active = attr ?? stored ?? system;
    setTheme(active);
    document.documentElement.setAttribute('data-theme', active);
  }, []);

  const toggle = () => {
    const next = theme === 'light' ? 'dark' : 'light';
    setTheme(next);
    localStorage.setItem('theme', next);
    document.documentElement.setAttribute('data-theme', next);
  };

  const isDark = theme === 'dark';

  return (
    <div className="theme-switch-wrap">
      <button
        type="button"
        role="switch"
        aria-checked={mounted ? isDark : false}
        className="theme-switch"
        onClick={toggle}
        aria-label={`Alternar tema. Atualmente no modo ${isDark ? 'escuro' : 'claro'}. Clique para mudar para ${isDark ? 'claro' : 'escuro'}.`}
        title={`Mudar para modo ${isDark ? 'claro' : 'escuro'}`}
      >
        <span className="theme-switch-thumb">
          {mounted ? (isDark ? <MoonIcon /> : <SunIcon />) : <SunIcon />}
        </span>
        <span className="theme-switch-icons">
          <SunIcon />
          <MoonIcon />
        </span>
      </button>
    </div>
  );
}

export const ThemeSwitch = ThemeToggle;
