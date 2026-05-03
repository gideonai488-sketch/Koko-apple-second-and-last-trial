import { createClient } from "@supabase/supabase-js";

const supabaseUrl =
  process.env.EXPO_PUBLIC_SUPABASE_URL ??
  "https://whyclfpsjhmmckxgjcan.supabase.co";

const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ?? "";

if (!supabaseAnonKey && __DEV__) {
  console.warn("[Supabase] EXPO_PUBLIC_SUPABASE_ANON_KEY is not set.");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type SupabaseProduct = {
  id: string;
  name: string;
  description: string;
  price: number;
  original_price: number | null;
  image: string | null;
  badge: "bestseller" | "hot" | "sale" | null;
  stock: number | null;
  rating: number;
  sold: number;
  category: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

export type SupabaseOrder = {
  id?: string;
  total: number;
  status: string;
  created_at?: string;
};

export type SupabaseOrderItem = {
  order_id: string;
  product_id: string;
  name: string;
  price: number;
  quantity: number;
};
