import Link from 'next/link';
import { supabasePublic } from '@/lib/supabase';

export const revalidate = 3600;

export default async function Home() {
  const { data, error } = await supabasePublic()
    .from('pages')
    .select('slug,title,meta_desc')
    .eq('status','published')
    .order('slug');

  if (error) return <div className="p-6 text-red-600">Error: {error.message}</div>;
  if (!data?.length) return <div className="p-6">No published pages yet.</div>;

  return (
    <main className="max-w-3xl mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold">Roof Restoration – Northern Beaches</h1>
      <p className="text-gray-700">Choose your suburb to get a fast, free quote.</p>
      <ul className="space-y-3">
        {data.map((row) => (
          <li key={row.slug} className="border rounded p-4">
            <Link href={`/${row.slug}`} className="font-semibold underline">
              {row.title || row.slug}
            </Link>
            {row.meta_desc && <p className="text-sm text-gray-600 mt-1">{row.meta_desc}</p>}
          </li>
        ))}
      </ul>
    </main>
  );
}
