// app/page.tsx
import Link from 'next/link';
import { supabasePublic } from '@/lib/supabase';

export const revalidate = 1800;

export default async function Home() {
  const { data } = await supabasePublic()
    .from('pages')
    .select('slug,title,meta_desc')
    .eq('status','published')
    .order('slug');

  const pages = data || [];

  return (
    <main className="max-w-4xl mx-auto p-6 space-y-8">
      <section className="rounded-xl border p-6 bg-white">
        <h1 className="text-3xl font-bold">Roof Restoration – Northern Beaches</h1>
        <p className="mt-2 text-gray-700">Licensed & insured. 10-year warranty. Same-day quotes.</p>
        <div className="mt-4 flex gap-3">
          <Link href="/manly/roof-restoration" className="bg-black text-white px-5 py-3 rounded-lg">
            Get My Free Quote
          </Link>
          <a href="tel:+611300000000" className="px-5 py-3 rounded-lg border">Call 1300 000 000</a>
        </div>
        <ul className="mt-4 flex gap-4 text-sm text-gray-600">
          <li>✓ Fully licensed</li><li>✓ Insured</li><li>✓ Northern Beaches specialists</li>
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold">Choose your suburb</h2>
        {pages.length === 0 ? (
          <p>No published pages yet.</p>
        ) : (
          <ul className="grid sm:grid-cols-2 gap-3">
            {pages.map((row) => (
              <li key={row.slug} className="border rounded p-4 hover:bg-gray-50">
                <Link href={`/${row.slug}`} className="font-semibold underline">{row.title || row.slug}</Link>
                {row.meta_desc && <p className="text-sm text-gray-600 mt-1">{row.meta_desc}</p>}
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}
