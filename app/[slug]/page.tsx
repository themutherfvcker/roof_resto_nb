import { supabase } from '@/lib/supabase';
import type { PageRow } from '@/types/db';

export const revalidate = 3600; // 1h; n8n will also revalidate on demand

export async function generateStaticParams() {
  const { data, error } = await supabase
    .from('pages')
    .select('slug')
    .eq('status', 'published');

  if (error || !data) return [];
  return data.map((r: { slug: string }) => ({ slug: r.slug }));
}

function JsonLd({ graph }: { graph: any[] }) {
  const jsonLd = JSON.stringify({ '@context': 'https://schema.org', '@graph': graph });
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd }} />;
}

export default async function Page({ params }: { params: { slug: string } }) {
  const { data: row, error } = await supabase
    .from('pages')
    .select('*')
    .eq('slug', params.slug)
    .eq('status', 'published')
    .single<PageRow>();

  if (error || !row) {
    return <main><h1>Not found</h1><p className="small">No published page for “{params.slug}”.</p></main>;
  }

  const graph = Array.isArray(row.schema_json?.['@graph']) ? row.schema_json['@graph'] : [];
  const faq = graph.find((x: any) => x['@type'] === 'FAQPage');

  return (
    <main>
      {/* Basic SEO tags via head in App Router are handled by `metadata`, but we keep these inline for clarity */}
      <h1>{row.h1 || row.title}</h1>
      {graph.length > 0 && <JsonLd graph={graph} />}

      {row.content_html ? (
        <article dangerouslySetInnerHTML={{ __html: row.content_html }} />
      ) : (
        <p className="small">No content yet.</p>
      )}

      {/* Lead form */}
      <section style={{ marginTop: 32 }}>
        <h2>Request a Same-Day Quote</h2>
        <form action="/api/lead" method="post">
          <input type="hidden" name="slug" value={params.slug} />
          <input name="name" required placeholder="Your name" />
          <input name="phone" required placeholder="Phone" />
          <input name="email" type="email" placeholder="Email (optional)" />
          <textarea name="message" rows={4} placeholder="Tell us about your roof…" />
          {/* Honeypot */}
          <input name="company" style={{ display: 'none' }} tabIndex={-1} autoComplete="off" />
          <button type="submit">Send</button>
        </form>
        <p className="small">We aim to respond promptly during business hours.</p>
      </section>

      {/* FAQs */}
      {faq?.mainEntity?.length ? (
        <section style={{ marginTop: 32 }}>
          <h2>FAQs</h2>
          {faq.mainEntity.map((q: any, i: number) => (
            <details key={i}>
              <summary>{q.name}</summary>
              <div dangerouslySetInnerHTML={{ __html: q.acceptedAnswer?.text || '' }} />
            </details>
          ))}
        </section>
      ) : null}
    </main>
  );
}
