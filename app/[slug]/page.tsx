import type { Metadata, Route } from 'next'
import { supabasePublic } from '@/lib/supabase'
import QuoteForm from '@/components/QuoteForm'

export const revalidate = 1800

export async function generateMetadata({ params }: { params: { slug: string[] } }): Promise<Metadata> {
  const slug = params.slug.join('/')
  const { data } = await supabasePublic()
    .from('pages')
    .select('meta_title, meta_desc')
    .eq('slug', slug)
    .eq('status','published')
    .maybeSingle()

  return {
    title: data?.meta_title || 'Roof Restoration – Northern Beaches',
    description: data?.meta_desc || 'Licensed & insured roof restorations. Free quotes.',
  }
}

export default async function Page({ params }: { params: { slug: string[] } }) {
  const slug = params.slug.join('/')
  const { data } = await supabasePublic()
    .from('pages')
    .select('*')
    .eq('slug', slug)
    .maybeSingle()

  // If page is published, render the full content
  if (data && data.status === 'published') {
    const faqs = Array.isArray(data.faqs_json) ? data.faqs_json : []

    const jsonLd = {
      "@context": "https://schema.org",
      "@type": "LocalBusiness",
      "name": data.title || 'Roof Restoration',
      "areaServed": data.suburb ? `${data.suburb} ${data.state || 'NSW'}` : 'Northern Beaches NSW',
      "url": `https://roof-resto-nb.vercel.app/${slug}`,
      "serviceType": "Roof Restoration",
      "telephone": "+611300000000"
    }

    return (
      <main className="space-y-16">
        <section className="hero" style={{background:'#f7fafc'}}>
          <h1 style={{margin:0}}>{data.h1 || data.title || 'Roof Restoration'}</h1>
          <p style={{color:'#555', margin:'6px 0 0'}}>10-year warranty · Licensed · Insured</p>
          <div className="ctas">
            <a className="btn btn-primary" href="#quote">Get My Free Quote</a>
            <a className="btn" href="tel:+611300000000">Call 1300 000 000</a>
          </div>
        </section>

        <article className="prose" dangerouslySetInnerHTML={{ __html: data.content_html || '' }} />

        {faqs.length > 0 && (
          <section className="faq">
            <h2 style={{fontSize:20, margin:'0 0 8px'}}>FAQs</h2>
            <dl>
              {faqs.map((f: any, i: number) => (
                <div key={i}>
                  <dt>{f.q}</dt>
                  <dd>{f.a}</dd>
                </div>
              ))}
            </dl>
          </section>
        )}

        <section id="quote" className="card">
          <h2 style={{fontSize:20, margin:'0 0 8px'}}>Get a fast, free quote</h2>
          <QuoteForm slug={slug} />
        </section>

        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      </main>
    )
  }

  // Fallback for missing/unpublished slugs:
  // show a minimal "Request this suburb" lead form (no 404 dead end)
  return (
    <main className="space-y-16">
      <section className="hero">
        <h1>Roof Restoration – Northern Beaches</h1>
        <p>Can’t find this suburb yet? Request a quote and we’ll prioritise it.</p>
      </section>
      <section className="card">
        <h2 style={{fontSize:20, margin:'0 0 8px'}}>Request a quote</h2>
        <QuoteForm slug={slug} />
      </section>
      <p style={{color:'#666'}}>Tip: once published, this page will immediately show your suburb-specific info.</p>
    </main>
  )
}
