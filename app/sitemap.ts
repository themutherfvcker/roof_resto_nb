import type { MetadataRoute } from 'next'
import { supabasePublic } from '@/lib/supabase'

const BASE_URL = process.env.SITE_URL || 'https://roof-resto-nb.vercel.app'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = supabasePublic()
  try {
    const { data } = await supabase
      .from('pages')
      .select('slug, updated_at')
      .eq('status', 'published')

    const items: MetadataRoute.Sitemap =
      (data || []).map((row) => ({
        url: `${BASE_URL}/${row.slug}`,
        lastModified: row.updated_at ? new Date(row.updated_at) : new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.8,
      }))

    items.unshift({
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 1,
    })

    return items
  } catch {
    return [{
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 1,
    }]
  }
}
