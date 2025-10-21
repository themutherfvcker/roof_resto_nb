import { supabase } from '@/lib/supabase';

export default async function sitemap() {
  const { data } = await supabase
    .from('pages')
    .select('slug')
    .eq('status', 'published');

  const base = 'https://roof-resto-nb.vercel.app'; // update if you use a custom domain
  return (data ?? []).map((r: { slug: string }) => ({
    url: `${base}/${r.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8
  }));
}
