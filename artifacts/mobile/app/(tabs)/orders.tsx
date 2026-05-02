import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import {
  FlatList,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useCart } from "@/context/CartContext";
import { Order, useOrders } from "@/context/OrdersContext";
import { useColors } from "@/hooks/useColors";

const STATUS_LABELS: Record<Order["status"], string> = {
  preparing: "Preparing",
  on_the_way: "On the way",
  delivered: "Delivered",
};

const STATUS_ICONS: Record<Order["status"], string> = {
  preparing: "clock",
  on_the_way: "truck",
  delivered: "check-circle",
};

const STATUS_COLORS: Record<Order["status"], string> = {
  preparing: "#F59E0B",
  on_the_way: "#3B82F6",
  delivered: "#22C55E",
};

function CartPreviewCard() {
  const colors = useColors();
  const router = useRouter();
  const { items, total, itemCount } = useCart();

  if (items.length === 0) return null;

  const deliveryFee = 1.99;
  const serviceFee = 0.99;
  const grandTotal = total + deliveryFee + serviceFee;

  return (
    <View
      style={[
        styles.cartCard,
        {
          backgroundColor: colors.card,
          borderColor: colors.primary,
          borderRadius: colors.radius,
        },
      ]}
    >
      <View style={styles.cartHeader}>
        <View style={styles.cartTitleRow}>
          <View style={[styles.pendingDot, { backgroundColor: colors.primary }]} />
          <Text style={[styles.cartTitle, { color: colors.foreground }]}>
            Cart — {itemCount} item{itemCount !== 1 ? "s" : ""}
          </Text>
        </View>
        <View style={[styles.pendingBadge, { backgroundColor: colors.primary + "18" }]}>
          <Text style={[styles.pendingText, { color: colors.primary }]}>Not yet placed</Text>
        </View>
      </View>

      <View style={[styles.divider, { backgroundColor: colors.border }]} />

      <View style={styles.itemsList}>
        {items.map((item) => (
          <View key={item.id} style={styles.itemRow}>
            <Text style={[styles.itemQty, { color: colors.mutedForeground }]}>
              {item.quantity}×
            </Text>
            <Text
              style={[styles.itemName, { color: colors.foreground }]}
              numberOfLines={1}
            >
              {item.name}
            </Text>
            <Text style={[styles.itemPrice, { color: colors.mutedForeground }]}>
              GH₵{(item.price * item.quantity).toFixed(2)}
            </Text>
          </View>
        ))}
      </View>

      <View style={[styles.divider, { backgroundColor: colors.border }]} />

      <View style={styles.cartFooter}>
        <View>
          <Text style={[styles.totalLabel, { color: colors.mutedForeground }]}>
            Total (incl. fees)
          </Text>
          <Text style={[styles.totalValue, { color: colors.foreground }]}>
            GH₵{grandTotal.toFixed(2)}
          </Text>
        </View>
        <Pressable
          onPress={() => router.push("/cart" as any)}
          style={[
            styles.checkoutBtn,
            { backgroundColor: colors.primary, borderRadius: colors.radius / 1.5 },
          ]}
        >
          <Feather name="credit-card" size={15} color="#fff" />
          <Text style={styles.checkoutBtnText}>Checkout</Text>
        </Pressable>
      </View>
    </View>
  );
}

function OrderCard({ order }: { order: Order }) {
  const colors = useColors();
  const statusColor = STATUS_COLORS[order.status];
  const placedDate = new Date(order.placedAt);
  const estDate = new Date(order.estimatedDelivery);

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: colors.card,
          borderRadius: colors.radius,
          borderColor: colors.border,
        },
      ]}
    >
      <View style={styles.cardHeader}>
        <View style={styles.restaurantInfo}>
          <Text style={[styles.restaurantName, { color: colors.foreground }]}>
            {order.restaurantName}
          </Text>
          <Text style={[styles.orderId, { color: colors.mutedForeground }]}>
            #{String(order.id).slice(-6).toUpperCase()}
          </Text>
        </View>
        <View
          style={[
            styles.statusBadge,
            { backgroundColor: statusColor + "20", borderRadius: 100 },
          ]}
        >
          <Feather name={STATUS_ICONS[order.status] as any} size={12} color={statusColor} />
          <Text style={[styles.statusText, { color: statusColor }]}>
            {STATUS_LABELS[order.status]}
          </Text>
        </View>
      </View>

      <View style={[styles.divider, { backgroundColor: colors.border }]} />

      <View style={styles.itemsList}>
        {order.items.map((item, idx) => (
          <View key={idx} style={styles.itemRow}>
            <Text style={[styles.itemQty, { color: colors.mutedForeground }]}>
              {item.quantity}×
            </Text>
            <Text
              style={[styles.itemName, { color: colors.foreground }]}
              numberOfLines={1}
            >
              {item.name}
            </Text>
            <Text style={[styles.itemPrice, { color: colors.mutedForeground }]}>
              GH₵{(item.price * item.quantity).toFixed(2)}
            </Text>
          </View>
        ))}
      </View>

      <View style={[styles.divider, { backgroundColor: colors.border }]} />

      <View style={styles.footer}>
        <View style={styles.footerLeft}>
          <Text style={[styles.date, { color: colors.mutedForeground }]}>
            {placedDate.toLocaleDateString("en-GH", {
              month: "short",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </Text>
          {order.status !== "delivered" && (
            <Text style={[styles.eta, { color: colors.primary }]}>
              ETA {estDate.toLocaleTimeString("en-GH", { hour: "2-digit", minute: "2-digit" })}
            </Text>
          )}
        </View>
        <Text style={[styles.total, { color: colors.foreground }]}>
          GH₵{order.total.toFixed(2)}
        </Text>
      </View>
    </View>
  );
}

export default function OrdersScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { orders } = useOrders();
  const { items: cartItems } = useCart();

  const topPad = Platform.OS === "web" ? Math.max(insets.top, 67) : insets.top;
  const bottomPad = Platform.OS === "web" ? 34 + 84 : 100;
  const hasContent = cartItems.length > 0 || orders.length > 0;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View
        style={[
          styles.headerBar,
          { paddingTop: topPad + 16, backgroundColor: colors.background },
        ]}
      >
        <Text style={[styles.screenTitle, { color: colors.foreground }]}>Orders</Text>
      </View>

      {!hasContent ? (
        <View style={styles.emptyState}>
          <Feather name="shopping-bag" size={48} color={colors.mutedForeground} />
          <Text style={[styles.emptyTitle, { color: colors.foreground }]}>No orders yet</Text>
          <Text style={[styles.emptyText, { color: colors.mutedForeground }]}>
            Add items to your cart and place an order
          </Text>
        </View>
      ) : (
        <FlatList
          data={orders}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <OrderCard order={item} />}
          ListHeaderComponent={<CartPreviewCard />}
          ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
          contentContainerStyle={{
            padding: 16,
            gap: 12,
            paddingBottom: bottomPad,
          }}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  headerBar: { paddingHorizontal: 16, paddingBottom: 16 },
  screenTitle: { fontSize: 26, fontWeight: "700" as const, fontFamily: "Inter_700Bold" },

  cartCard: { borderWidth: 1.5, marginBottom: 4 },
  cartHeader: {
    padding: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  cartTitleRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  pendingDot: { width: 8, height: 8, borderRadius: 4 },
  cartTitle: { fontSize: 15, fontWeight: "700" as const, fontFamily: "Inter_700Bold" },
  pendingBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 100 },
  pendingText: { fontSize: 12, fontWeight: "600" as const, fontFamily: "Inter_600SemiBold" },
  cartFooter: {
    padding: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  totalLabel: { fontSize: 11, fontFamily: "Inter_400Regular" },
  totalValue: { fontSize: 16, fontWeight: "700" as const, fontFamily: "Inter_700Bold" },
  checkoutBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  checkoutBtnText: { color: "#fff", fontSize: 14, fontWeight: "700" as const, fontFamily: "Inter_700Bold" },

  card: { borderWidth: 1 },
  cardHeader: {
    padding: 14,
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 12,
  },
  restaurantInfo: { flex: 1 },
  restaurantName: { fontSize: 16, fontWeight: "600" as const, fontFamily: "Inter_600SemiBold" },
  orderId: { fontSize: 12, fontFamily: "Inter_400Regular", marginTop: 2 },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 5,
    gap: 5,
  },
  statusText: { fontSize: 12, fontWeight: "500" as const, fontFamily: "Inter_500Medium" },
  divider: { height: 1, marginHorizontal: 14 },
  itemsList: { padding: 14, gap: 8 },
  itemRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  itemQty: { fontSize: 13, fontFamily: "Inter_500Medium", width: 24 },
  itemName: { flex: 1, fontSize: 13, fontFamily: "Inter_400Regular" },
  itemPrice: { fontSize: 13, fontFamily: "Inter_500Medium" },
  footer: {
    padding: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  footerLeft: { gap: 2 },
  date: { fontSize: 12, fontFamily: "Inter_400Regular" },
  eta: { fontSize: 12, fontFamily: "Inter_600SemiBold", fontWeight: "600" as const },
  total: { fontSize: 15, fontWeight: "600" as const, fontFamily: "Inter_600SemiBold" },

  emptyState: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    paddingBottom: 80,
  },
  emptyTitle: { fontSize: 20, fontWeight: "600" as const, fontFamily: "Inter_600SemiBold" },
  emptyText: {
    fontSize: 14,
    fontFamily: "Inter_400Regular",
    textAlign: "center",
    paddingHorizontal: 40,
  },
});
