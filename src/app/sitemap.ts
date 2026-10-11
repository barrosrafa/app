import type { MetadataRoute } from 'next';
import { getBooks } from '@/features/catalog/queries';
import { createServerSupabase } from '@/lib/supabase/clients';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://diyspur.vercel.app';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const routes = ['', 'livros', 'calendario', 'comunidade', 'ranking', 'privacidade', 'termos'];
  const fixed: MetadataRoute.Sitemap = routes.map((route) => ({
    url: new URL(route, siteUrl).toString(),
    lastModified: new Date(),
    changeFrequency: route === '' ? 'daily' : 'weekly',
    priority: route === '' ? 1.0 : 0.7,
  }));

  try {
    const books = await getBooks().catch(() => []);
    const client = await createServerSupabase();
    const { data: seasons } = await client.from('seasons').select('id,slug,status').in('status', ['active', 'finished']).limit(36);
    const { data: chapters } = seasons?.length
      ? await client.from('chapters').select('id,season_id,published_at').in('season_id', seasons.map((s) => s.id)).or(`published_at.is.null,published_at.lte.${new Date().toISOString()}`).limit(200)
      : { data: [] };

    const bookRoutes: MetadataRoute.Sitemap = (books ?? []).map((book) => ({
      url: new URL(`livros/${encodeURIComponent(book.slug)}`, siteUrl).toString(),
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    }));

    const seasonRoutes: MetadataRoute.Sitemap = (seasons ?? []).map((season) => ({
      url: new URL(`temporadas/${encodeURIComponent(season.slug)}`, siteUrl).toString(),
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.65,
    }));

    const chapterRoutes: MetadataRoute.Sitemap = (chapters ?? []).map((chapter) => ({
      url: new URL(`capitulos/${chapter.id}`, siteUrl).toString(),
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.55,
    }));

    return [...fixed, ...bookRoutes, ...seasonRoutes, ...chapterRoutes];
  } catch {
    return fixed;
  }
}
