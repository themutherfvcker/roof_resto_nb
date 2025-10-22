// app/api/seed/route.ts
import { NextResponse } from 'next/server'
import { supabaseServer } from '@/lib/supabase'

export async function POST(req: Request) {
  const { secret } = await req.json().catch(() => ({}))

  if (!secret || secret !== process.env.REVALIDATE_SECRET) {
    return NextResponse.json({ ok: false, error: 'unauthorized' }, { status: 401 })
  }

  const rows = [
    {
      slug: 'deewhy/roof-restoration',
      suburb: 'Dee Why',
      title: 'Roof Restoration Dee Why | Free Quote Today',
      h1: 'Roof Restoration in Dee Why',
      meta_title: 'Roof Restoration Dee Why | Northern Beaches Specialists',
      meta_desc: 'Licensed, insured roof restorations in Dee Why. Fast quotes, 10-yr warranty.',
      content_html:
        '<p>We restore, repair and paint roofs in Dee Why. Licensed & insured. <strong>Get a free quote today.</strong></p>',
      faqs_json: [
        { q: 'How long does a restoration take?', a: 'Most homes are 2–3 days depending on size and weather.' },
        { q: 'Do you offer warranty?', a: 'Yes, workmanship warranty up to 10 years.' },
      ],
      status: 'published',
    },
    {
      slug: 'mona-vale/roof-restoration',
      suburb: 'Mona Vale',
      title: 'Roof Restoration Mona Vale | Free Quote Today',
      h1: 'Roof Restoration in Mona Vale',
      meta_title: 'Roof Restoration Mona Vale | Northern Beaches Specialists',
      meta_desc: 'Licensed, insured roof restorations in Mona Vale. Fast quotes, 10-yr warranty.',
      content_html:
        '<p>We restore, repair and paint roofs in Mona Vale. Licensed & insured. <strong>Get a free quote today.</strong></p>',
      faqs_json: [{ q: 'Do you repair leaks?', a: 'Yes, leak repairs, repointing, resealing and painting.' }],
      status: 'published',
    },
  ]

  const { error } = await supabaseServer().from('pages').upsert(rows, { onConflict: 'slug' })
  if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 500 })

  return NextResponse.json({ ok: true, inserted: rows.length })
}
