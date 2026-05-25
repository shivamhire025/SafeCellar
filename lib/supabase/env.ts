/** True when Supabase URL and anon key are set to real values (not placeholders). */
export function isSupabaseConfigured(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  return Boolean(
    url &&
      anon &&
      !url.includes("your-project") &&
      !anon.includes("your-anon")
  );
}
