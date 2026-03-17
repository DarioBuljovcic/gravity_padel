import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// Service role client — only used server-side (actions, server components)
// Never expose this to the browser
export const supabase = createClient(supabaseUrl, supabaseServiceKey);

export type Blog = {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  body: string;
  created_at: string;
  updated_at: string;
};
