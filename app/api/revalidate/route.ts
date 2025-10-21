import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';

export async function POST(req: Request) {
  const { slug, secret } = await req.json().catch(() => ({}));
  if (secret !== process.env.REVALIDATE_SECRET) {
    return NextResponse.json({ ok: false, error: 'unauthorized' }, { status: 401 });
  }
  if (!slug) {
    return NextResponse.json({ ok: false, error: 'missing slug' }, { status: 400 });
  }
  revalidatePath(`/${slug}`);
  return NextResponse.json({ ok: true, slug });
}
