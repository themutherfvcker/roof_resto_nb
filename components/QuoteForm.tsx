'use client';

import { useState } from 'react';

export default function QuoteForm({ slug }: { slug: string }) {
  const [loading, setLoading] = useState(false);
  const [ok, setOk] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true); setErr(null);
    const form = e.currentTarget;
    const body = {
      slug,
      name: (form.elements.namedItem('name') as HTMLInputElement).value,
      email: (form.elements.namedItem('email') as HTMLInputElement).value,
      phone: (form.elements.namedItem('phone') as HTMLInputElement).value,
      message: (form.elements.namedItem('message') as HTMLTextAreaElement).value,
    };
    const res = await fetch('/api/lead', {
      method: 'POST',
      headers: { 'Content-Type':'application/json' },
      body: JSON.stringify(body),
    });
    setLoading(false);
    if (res.ok) setOk(true); else setErr((await res.json()).error || 'Failed');
  }

  if (ok) return <div className="text-green-700">Thanks! We’ll contact you shortly.</div>;

  return (
    <form onSubmit={submit} className="space-y-3">
      <input name="name" placeholder="Name" className="border rounded p-2 w-full" required />
      <input name="email" type="email" placeholder="Email" className="border rounded p-2 w-full" required />
      <input name="phone" placeholder="Phone" className="border rounded p-2 w-full" />
      <textarea name="message" placeholder="Tell us about your roof…" className="border rounded p-2 w-full" rows={4} />
      {err && <div className="text-red-700">{err}</div>}
      <button disabled={loading} className="bg-black text-white px-4 py-2 rounded">
        {loading ? 'Sending…' : 'Get My Quote'}
      </button>
    </form>
  );
}
