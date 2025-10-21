import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

async function sendEmail({ html, subject }: { html: string; subject: string }) {
  const key = process.env.RESEND_API_KEY;
  const to = process.env.LEAD_TO_EMAIL;
  const from = process.env.LEAD_FROM_EMAIL || 'Leads <noreply@example.com>';

  if (!key || !to) return; // silently skip if not configured

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${key}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ from, to: [to], subject, html })
  });
  if (!res.ok) console.error('Resend error', await res.text());
}

export async function POST(req: Request) {
  const body = await req.formData?.() ?? await req.json().catch(() => null);

  const data = body instanceof FormData
    ? Object.fromEntries(body.entries())
    : (body || {});

  // Honeypot
  if (data.company) return NextResponse.json({ ok: true });

  const payload = {
    slug: String(data.slug || ''),
    name: String(data.name || ''),
    phone: String(data.phone || ''),
    email: String(data.email || ''),
    message: String(data.message || ''),
    source: 'site'
  };

  // Store lead
  await supabase.from('leads').insert(payload);

  // Email notification (optional)
  await sendEmail({
    subject: `New lead: ${payload.slug} – ${payload.name}`,
    html: `<p><b>From:</b> ${payload.name} (${payload.email}, ${payload.phone})</p>
           <p><b>Page:</b> ${payload.slug}</p>
           <p>${(payload.message || '').replace(/\n/g, '<br/>')}</p>`
  });

  return NextResponse.json({ ok: true });
}
