import { NextResponse } from 'next/server'
import { supabaseServer } from '@/lib/supabase'

export async function POST(req: Request) {
  try {
    const { slug, name, email, phone, message } = await req.json()
    if (!slug || !name || !email) {
      return NextResponse.json({ ok:false, error:'Missing fields' }, { status:400 })
    }
    const { error } = await supabaseServer()
      .from('leads')
      .insert({ slug, name, email, phone, message })
    if (error) throw error
    return NextResponse.json({ ok:true })
  } catch (e:any) {
    return NextResponse.json({ ok:false, error:e.message || 'Error' }, { status:500 })
  }
}
