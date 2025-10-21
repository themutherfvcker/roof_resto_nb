// app/[[...slug]]/page.tsx
import { supabase } from '@/lib/supabase';
import type { PageRow } from '@/types/db';

export const revalidate = 3600;

export async function generateStaticParams() {
  const { data } = await supabase
    .from('pages')
    .select('slug')
    .eq('status','published');

  // For catch-all routes, return arrays of path segments
  return (data ?? []).map((r: { slug: string }) => ({
    slug: r.slug.split('/').filter(Boolean)
  }));
}

function JsonLd({ graph }: { graph: any[] }) {
  const jsonLd = JSON.stringify({ '@context': 'https://schema.org', '@graph': graph });
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd }} />;
}

export default async function Page({ params }: { params: { slug?: string[] } }) {
  const slug = (params.slug ?? []).join('/'); // "manly/roof-restoration"

  const { data: row } = await supabase
    .from('pages')
    .select('*')
    .eq('slug', slug)
    .eq('status','published')
    .single<PageRow>();

  if (!row) {
    return <main><h1>Not found</h1><p>No published page for “{slug}”.</p></main>;
  }

  const graph = Array.isArray(row.schema_json?.['@graph']) ? row.schema_json['@graph'] : [];
  const faq = graph.find((x: any) => x['@type'] === 'FAQPage');

  return (
    <main>
      <h1>{row.h1 || row.title}</h1>
      {graph.length > 0 && <JsonLd graph={graph} />}
      {row.content_html
        ? <article dangerouslySetInnerHTML={{ __html: row.content_html }} />
        : <p>No content yet.</p>}
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
