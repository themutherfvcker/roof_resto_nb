import { supabasePublic } from '@/lib/supabase';
import QuoteForm from '@/components/QuoteForm';
import { notFound } from 'next/navigation';

export const revalidate = 3600;

export default async function Page({ params }: { params: { slug: string[] } }) {
  const slug = params.slug.join('/');
  const { data, error } = await supabasePublic()
    .from('pages')
    .select('*')
    .eq('slug', slug)
    .eq('status','published')
    .maybeSingle();

  if (error || !data) notFound();

  return (
    <main className="max-w-3xl mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold">{data.h1 || data.title}</h1>
      <article className="prose" dangerouslySetInnerHTML={{ __html: data.content_html || '' }} />
      <section className="mt-8 border rounded p-4">
        <h2 className="text-xl font-semibold mb-2">Get a fast, free quote</h2>
        <QuoteForm slug={slug} />
      </section>
    </main>
  );
}
