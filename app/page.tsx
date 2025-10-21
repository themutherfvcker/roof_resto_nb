// app/page.tsx
import { redirect } from "next/navigation";
import { createClient } from "@supabase/supabase-js";

export const revalidate = 60; // quick cache for home

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default async function Home() {
  const { data } = await supabase
    .from("site_settings")
    .select("home_slug")
    .eq("id", 1)
    .maybeSingle();

  const home = data?.home_slug || "manly/roof-restoration";
  redirect(`/${home}`);
}
