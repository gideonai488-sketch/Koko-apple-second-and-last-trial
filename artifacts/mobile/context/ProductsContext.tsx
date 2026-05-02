import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

import { supabase, SupabaseProduct } from "@/lib/supabase";
import { MenuItem } from "@/data/menu";

function mapProduct(p: SupabaseProduct): MenuItem {
  return {
    id: p.id,
    name: p.name,
    description: p.description,
    price: p.price,
    originalPrice: p.original_price ?? undefined,
    category: p.category,
    image: p.image ?? undefined,
    rating: p.rating,
    sold: p.sold,
    badge: p.badge,
    stock: p.stock,
    popular: p.badge === "bestseller",
    trending: p.badge === "hot",
    isNew: false,
  };
}

interface ProductsContextValue {
  products: MenuItem[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
  findProduct: (id: string) => MenuItem | undefined;
  getByCategory: (category: string) => MenuItem[];
  getDealProducts: () => MenuItem[];
  getCategories: () => string[];
}

const ProductsContext = createContext<ProductsContextValue | null>(null);

export function ProductsProvider({ children }: { children: React.ReactNode }) {
  const [products, setProducts] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error: err } = await supabase
        .from("products")
        .select("*")
        .eq("is_active", true)
        .order("sold", { ascending: false });

      if (err) throw err;
      setProducts((data as SupabaseProduct[]).map(mapProduct));
    } catch (e: any) {
      setError(e?.message ?? "Failed to load menu");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const findProduct = useCallback(
    (id: string) => products.find((p) => p.id === id),
    [products]
  );

  const getByCategory = useCallback(
    (category: string) => {
      if (category === "All") return products;
      if (category === "Popular") return products.filter((p) => p.popular);
      return products.filter((p) => p.category === category);
    },
    [products]
  );

  const getDealProducts = useCallback(
    () => products.filter((p) => p.originalPrice != null),
    [products]
  );

  const getCategories = useCallback(() => {
    const cats = Array.from(new Set(products.map((p) => p.category)));
    return ["All", "Popular", ...cats];
  }, [products]);

  return (
    <ProductsContext.Provider
      value={{
        products,
        loading,
        error,
        refetch: fetchProducts,
        findProduct,
        getByCategory,
        getDealProducts,
        getCategories,
      }}
    >
      {children}
    </ProductsContext.Provider>
  );
}

export function useProducts() {
  const ctx = useContext(ProductsContext);
  if (!ctx) throw new Error("useProducts must be used within ProductsProvider");
  return ctx;
}
