// app/page.tsx
import Link from 'next/link'
import type { Route } from 'next'
import { supabasePublic } from '@/lib/supabase'

export const revalidate = 1800

export default async function Home() {
  const { data } = await supabasePublic()
    .from('pages')
    .select('slug,title,meta_desc')
    .eq('status','published')
    .order('slug')

  const pages = (data ?? []).map(p => ({ ...p, route: (`/${p.slug}`) as Route }))
  const CTA_HREF = pages[0]?.route ?? ('/manly/roof-restoration' as Route)

  return (
    <main className="space-y-16">
      <section className="hero">
        <h1>Roof Restoration – Northern Beaches</h1>
        <p>Licensed & insured. 10-year warranty. Same-day quotes.</p>
        <div className="ctas">
          <Link href={CTA_HREF} className="btn btn-primary">Get My Free Quote</Link>
          <a className="btn" href="tel:+611300000000">Call 1300 000 000</a>
        </div>
        <div className="badges">
          <span>✓ Fully licensed</span><span>✓ Insured</span><span>✓ Local specialists</span>
        </div>
      </section>

      <section>
        <h2 style={{fontSize:18, margin:'0 0 10px'}}>Choose your suburb</h2>
        {pages.length === 0 ? (
          <p>No published pages yet.</p>
        ) : (
          <ul className="grid">
            {pages.map(row => (
              <li key={row.slug} className="card">
                <Link href={row.route} className="underline">{row.title || row.slug}</Link>
                {row.meta_desc && <p style={{marginTop:6, color:'#555'}}>{row.meta_desc}</p>}
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  )
}
