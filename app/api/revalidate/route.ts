import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  const { slug, secret } = await req.json().catch(() => ({}))
  if (!secret || secret !== process.env.REVALIDATE_SECRET) {
    return NextResponse.json({ ok:false, error:'unauthorized' }, { status:401 })
  }
  const path = slug ? `/${slug}` : '/'
  // import { revalidatePath } from 'next/cache'; await revalidatePath(path);
  return NextResponse.json({ ok:true, revalidated:true, slug })
}
