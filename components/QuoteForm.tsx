'use client'
import { useState } from 'react'

export default function QuoteForm({ slug }: { slug: string }) {
  const [loading, setLoading] = useState(false)
  const [ok, setOk] = useState(false)
  const [err, setErr] = useState<string | null>(null)

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true); setErr(null)
    const f = e.currentTarget
    const body = {
      slug,
      name: (f.elements.namedItem('name') as HTMLInputElement).value,
      email: (f.elements.namedItem('email') as HTMLInputElement).value,
      phone: (f.elements.namedItem('phone') as HTMLInputElement).value,
      message: (f.elements.namedItem('message') as HTMLTextAreaElement).value,
    }
    const res = await fetch('/api/lead', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(body) })
    setLoading(false)
    if (res.ok) setOk(true); else setErr((await res.json()).error || 'Failed')
  }

  if (ok) return <div className="card" style={{borderColor:'#c6f6d5', background:'#f0fff4'}}>Thanks! We’ll contact you shortly.</div>

  return (
    <form onSubmit={submit} className="form" style={{display:'grid', gap:10}}>
      <input name="name" placeholder="Name" required />
      <input name="email" type="email" placeholder="Email" required />
      <input name="phone" placeholder="Phone" />
      <textarea name="message" rows={4} placeholder="Tell us about your roof…"></textarea>
      {err && <div style={{color:'#b00020'}}>{err}</div>}
      <button disabled={loading}>{loading ? 'Sending…' : 'Get My Quote'}</button>
    </form>
  )
}
