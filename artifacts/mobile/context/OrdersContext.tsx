import AsyncStorage from "@react-native-async-storage/async-storage";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

import { supabase } from "@/lib/supabase";

export type OrderStatus = "preparing" | "on_the_way" | "delivered";

export interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

export interface Order {
  id: string;
  restaurantId: string;
  restaurantName: string;
  items: OrderItem[];
  total: number;
  status: OrderStatus;
  placedAt: number;
  estimatedDelivery: number;
}

interface OrdersContextValue {
  orders: Order[];
  placeOrder: (
    restaurantId: string,
    restaurantName: string,
    items: OrderItem[],
    total: number
  ) => Promise<Order>;
}

const OrdersContext = createContext<OrdersContextValue | null>(null);

const ORDERS_KEY = "food_app_orders";

export function OrdersProvider({ children }: { children: React.ReactNode }) {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    AsyncStorage.getItem(ORDERS_KEY).then((val) => {
      if (val) {
        try {
          setOrders(JSON.parse(val));
        } catch {}
      }
    });
  }, []);

  const placeOrder = useCallback(
    async (
      restaurantId: string,
      restaurantName: string,
      items: OrderItem[],
      total: number
    ): Promise<Order> => {
      const now = Date.now();
      const localId = now.toString() + Math.random().toString(36).substr(2, 6);

      const order: Order = {
        id: localId,
        restaurantId,
        restaurantName,
        items,
        total,
        status: "preparing",
        placedAt: now,
        estimatedDelivery: now + 35 * 60 * 1000,
      };

      // Save to Supabase (best-effort — falls back to local if it fails)
      try {
        const { data: orderRow, error: orderErr } = await supabase
          .from("orders")
          .insert({ total, status: "preparing" })
          .select("id")
          .single();

        if (!orderErr && orderRow) {
          order.id = orderRow.id;

          const orderItems = items.map((i) => ({
            order_id: orderRow.id,
            product_id: i.id,
            name: i.name,
            price: i.price,
            quantity: i.quantity,
          }));

          await supabase.from("order_items").insert(orderItems);
        }
      } catch {
        // silently fall back to local-only order
      }

      setOrders((prev) => {
        const updated = [order, ...prev];
        AsyncStorage.setItem(ORDERS_KEY, JSON.stringify(updated));
        return updated;
      });

      return order;
    },
    []
  );

  return (
    <OrdersContext.Provider value={{ orders, placeOrder }}>
      {children}
    </OrdersContext.Provider>
  );
}

export function useOrders() {
  const ctx = useContext(OrdersContext);
  if (!ctx) throw new Error("useOrders must be used within OrdersProvider");
  return ctx;
}
