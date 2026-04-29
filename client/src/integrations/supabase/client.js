import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Check if credentials are valid
const isValidUrl = (url) => {
  if (!url) return false;
  try {
    return url.startsWith("https://") && url.includes(".supabase.co");
  } catch {
    return false;
  }
};

if (!supabaseUrl || !supabaseAnonKey || !isValidUrl(supabaseUrl)) {
  console.warn(
    "⚠️ Supabase credentials are missing or invalid. Please configure .env.local:\n" +
    "1. Go to https://app.supabase.com and create/select a project\n" +
    "2. Copy your Project URL and Anon Key from Settings → API\n" +
    "3. Add them to .env.local:\n" +
    "   NEXT_PUBLIC_SUPABASE_URL=your-project-url\n" +
    "   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key\n" +
    "4. Restart your dev server"
  );
}

export const supabase = supabaseUrl && supabaseAnonKey && isValidUrl(supabaseUrl) ? createClient(supabaseUrl, supabaseAnonKey) : null;