import { describe, expect, it } from 'vitest';
import { safeLocalRedirect, getSafeRedirectUrl } from '../../src/lib/safe-redirect';

describe('safeLocalRedirect', () => {
  it('permite somente caminhos locais e mantém query e fragmento', () => {
    expect(safeLocalRedirect('/historico?q=livro#top')).toBe('/historico?q=livro#top');
  });

  it.each(['https://evil.example', '//evil.example', '/\\evil.example', 'javascript:alert(1)', '', undefined])(
    'rejeita URL externa ou ausente: %s',
    (value) => {
      expect(safeLocalRedirect(value)).toBe('/perfil');
    }
  );

  it('aceita fallback explicitamente local', () => {
    expect(safeLocalRedirect('//evil.example', '/')).toBe('/');
  });
});

describe('getSafeRedirectUrl', () => {
  it('retorna fallback padrão "/" quando valor é vazio ou inválido', () => {
    expect(getSafeRedirectUrl(null)).toBe('/');
    expect(getSafeRedirectUrl(undefined)).toBe('/');
    expect(getSafeRedirectUrl('')).toBe('/');
    expect(getSafeRedirectUrl('https://malicious.com')).toBe('/');
    expect(getSafeRedirectUrl('//malicious.com/attack')).toBe('/');
  });

  it('preserva rotas relativas válidas', () => {
    expect(getSafeRedirectUrl('/diario')).toBe('/diario');
    expect(getSafeRedirectUrl('/capitulos/123?page=1#discussion')).toBe('/capitulos/123?page=1#discussion');
  });

  it('usa fallback customizado quando fornecido', () => {
    expect(getSafeRedirectUrl('https://malicious.com', '/livros')).toBe('/livros');
  });
});
