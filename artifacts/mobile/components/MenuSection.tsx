import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import React from "react";
import {
  Dimensions,
  Image,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { useCart } from "@/context/CartContext";
import { MenuItem, restaurant } from "@/data/menu";
import { useColors } from "@/hooks/useColors";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const CARD_WIDTH = (SCREEN_WIDTH - 40) / 2;

interface Props {
  items: MenuItem[];
}

function MenuItemCard({ item }: { item: MenuItem }) {
  const colors = useColors();
  const router = useRouter();
  const { addItem, items: cartItems, updateQuantity } = useCart();

  const cartItem = cartItems.find((c) => c.id === item.id);
  const qty = cartItem?.quantity ?? 0;

  const discountPct = item.originalPrice
    ? Math.round((1 - item.price / item.originalPrice) * 100)
    : 0;

  return (
    <Pressable
      onPress={() =>
        router.push({
          pathname: "/item/[itemId]" as any,
          params: { itemId: item.id, restaurantId: "1" },
        })
      }
      style={({ pressed }) => [
        styles.card,
        {
          backgroundColor: colors.card,
          borderRadius: colors.radius,
          borderColor: colors.border,
          width: CARD_WIDTH,
          opacity: pressed ? 0.92 : 1,
        },
      ]}
    >
      {item.image ? (
        <Image
          source={item.image}
          style={[
            styles.image,
            {
              borderTopLeftRadius: colors.radius,
              borderTopRightRadius: colors.radius,
            },
          ]}
        />
      ) : (
        <View
          style={[
            styles.imagePlaceholder,
            {
              backgroundColor: colors.muted,
              borderTopLeftRadius: colors.radius,
              borderTopRightRadius: colors.radius,
            },
          ]}
        >
          <Feather name="coffee" size={28} color={colors.mutedForeground} />
        </View>
      )}

      {discountPct > 0 && (
        <View style={[styles.discountBadge, { backgroundColor: colors.primary }]}>
          <Text style={styles.discountText}>{discountPct}% OFF</Text>
        </View>
      )}

      {item.isNew && !discountPct && (
        <View
          style={[
            styles.discountBadge,
            { backgroundColor: "#7C3AED" },
          ]}
        >
          <Text style={styles.discountText}>New</Text>
        </View>
      )}

      {item.trending && (
        <View
          style={[
            styles.trendBadge,
            { backgroundColor: "rgba(0,0,0,0.55)", borderRadius: 100 },
          ]}
        >
          <Feather name="trending-up" size={10} color="#FFD700" />
        </View>
      )}

      <View style={styles.info}>
        <Text
          style={[styles.name, { color: colors.foreground }]}
          numberOfLines={1}
        >
          {item.name}
        </Text>
        {item.calories && (
          <Text style={[styles.meta, { color: colors.mutedForeground }]}>
            {item.calories}
          </Text>
        )}
        <View style={styles.priceRow}>
          <View style={styles.prices}>
            <Text style={[styles.price, { color: colors.primary }]}>
              ${item.price.toFixed(2)}
            </Text>
            {item.originalPrice && (
              <Text
                style={[styles.origPrice, { color: colors.mutedForeground }]}
              >
                ${item.originalPrice.toFixed(2)}
              </Text>
            )}
          </View>
          {qty === 0 ? (
            <Pressable
              onPress={(e) => {
                e.stopPropagation();
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                addItem({
                  id: item.id,
                  restaurantId: "1",
                  restaurantName: restaurant.name,
                  name: item.name,
                  price: item.price,
                });
              }}
              style={[
                styles.addBtn,
                { backgroundColor: colors.primary, borderRadius: 8 },
              ]}
            >
              <Feather name="plus" size={16} color="#fff" />
            </Pressable>
          ) : (
            <View
              style={[
                styles.qtyControl,
                { backgroundColor: colors.muted, borderRadius: 8 },
              ]}
            >
              <Pressable
                onPress={(e) => {
                  e.stopPropagation();
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  updateQuantity(item.id, qty - 1);
                }}
                style={styles.qtyBtn}
              >
                <Feather name="minus" size={12} color={colors.foreground} />
              </Pressable>
              <Text style={[styles.qtyText, { color: colors.foreground }]}>
                {qty}
              </Text>
              <Pressable
                onPress={(e) => {
                  e.stopPropagation();
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  updateQuantity(item.id, qty + 1);
                }}
                style={styles.qtyBtn}
              >
                <Feather name="plus" size={12} color={colors.foreground} />
              </Pressable>
            </View>
          )}
        </View>
      </View>
    </Pressable>
  );
}

export function MenuSection({ items }: Props) {
  const colors = useColors();

  const rows: MenuItem[][] = [];
  for (let i = 0; i < items.length; i += 2) {
    rows.push(items.slice(i, i + 2));
  }

  if (items.length === 0) {
    return (
      <View style={styles.empty}>
        <Feather name="search" size={36} color={colors.mutedForeground} />
        <Text style={[styles.emptyText, { color: colors.mutedForeground }]}>
          No items found
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.grid}>
      {rows.map((row, i) => (
        <View key={i} style={styles.row}>
          {row.map((item) => (
            <MenuItemCard key={item.id} item={item} />
          ))}
          {row.length === 1 && <View style={{ width: CARD_WIDTH }} />}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    paddingHorizontal: 12,
    gap: 8,
  },
  row: {
    flexDirection: "row",
    gap: 8,
  },
  card: {
    borderWidth: 1,
    overflow: "hidden",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
      },
      android: { elevation: 1 },
    }),
  },
  image: {
    width: "100%",
    height: 110,
    resizeMode: "cover",
  },
  imagePlaceholder: {
    width: "100%",
    height: 110,
    alignItems: "center",
    justifyContent: "center",
  },
  discountBadge: {
    position: "absolute",
    top: 8,
    left: 8,
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 6,
  },
  discountText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "700" as const,
    fontFamily: "Inter_700Bold",
  },
  trendBadge: {
    position: "absolute",
    top: 8,
    right: 8,
    width: 22,
    height: 22,
    alignItems: "center",
    justifyContent: "center",
  },
  info: {
    padding: 10,
    gap: 3,
  },
  name: {
    fontSize: 13,
    fontWeight: "600" as const,
    fontFamily: "Inter_600SemiBold",
  },
  meta: {
    fontSize: 11,
    fontFamily: "Inter_400Regular",
  },
  priceRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 4,
  },
  prices: {
    flexDirection: "row",
    alignItems: "baseline",
    gap: 4,
  },
  price: {
    fontSize: 15,
    fontWeight: "700" as const,
    fontFamily: "Inter_700Bold",
  },
  origPrice: {
    fontSize: 11,
    fontFamily: "Inter_400Regular",
    textDecorationLine: "line-through",
  },
  addBtn: {
    width: 28,
    height: 28,
    alignItems: "center",
    justifyContent: "center",
  },
  qtyControl: {
    flexDirection: "row",
    alignItems: "center",
    height: 28,
  },
  qtyBtn: {
    width: 26,
    height: 28,
    alignItems: "center",
    justifyContent: "center",
  },
  qtyText: {
    fontSize: 12,
    fontWeight: "700" as const,
    fontFamily: "Inter_700Bold",
    minWidth: 16,
    textAlign: "center",
  },
  empty: {
    alignItems: "center",
    paddingVertical: 40,
    gap: 10,
  },
  emptyText: {
    fontSize: 14,
    fontFamily: "Inter_400Regular",
  },
});
