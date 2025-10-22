import { supabasePublic } from '@/lib/supabase'
import { NextResponse } from 'next/server'

export async function GET() {
  const { data, error } = await supabasePublic()
    .from('pages')
    .select('slug')
    .eq('status','published')
    .limit(1)
  if (error) return NextResponse.json({ ok:false, error: error.message }, { status:500 })
  return NextResponse.json({ ok:true, hasPages: (data?.length ?? 0) > 0 })
}
