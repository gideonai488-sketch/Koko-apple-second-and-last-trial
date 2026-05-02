import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import React from "react";
import {
  Dimensions,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { useCart } from "@/context/CartContext";
import { MenuItem } from "@/data/restaurants";
import { useColors } from "@/hooks/useColors";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const CARD_WIDTH = (SCREEN_WIDTH - 40) / 2;

interface GridItem extends MenuItem {
  restaurantId: string;
  restaurantName: string;
}

interface Props {
  items: GridItem[];
  title: string;
}

function GridCard({ item }: { item: GridItem }) {
  const colors = useColors();
  const router = useRouter();
  const { addItem, items: cartItems } = useCart();
  const isInCart = cartItems.some((c) => c.id === item.id);

  const discountPct = item.originalPrice
    ? Math.round((1 - item.price / item.originalPrice) * 100)
    : 0;

  return (
    <Pressable
      onPress={() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        router.push({
          pathname: "/item/[itemId]" as any,
          params: { itemId: item.id, restaurantId: item.restaurantId },
        });
      }}
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
          style={[styles.image, { borderTopLeftRadius: colors.radius, borderTopRightRadius: colors.radius }]}
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
          <Feather name="coffee" size={32} color={colors.mutedForeground} />
        </View>
      )}

      {discountPct > 0 && (
        <View style={[styles.badge, { backgroundColor: colors.primary }]}>
          <Text style={styles.badgeText}>{discountPct}% OFF</Text>
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
        <Text style={[styles.name, { color: colors.foreground }]} numberOfLines={1}>
          {item.name}
        </Text>
        <Text
          style={[styles.restaurant, { color: colors.mutedForeground }]}
          numberOfLines={1}
        >
          {item.restaurantName}
        </Text>
        <View style={styles.priceRow}>
          <View style={styles.prices}>
            <Text style={[styles.price, { color: colors.primary }]}>
              ${item.price.toFixed(2)}
            </Text>
            {item.originalPrice && (
              <Text
                style={[styles.originalPrice, { color: colors.mutedForeground }]}
              >
                ${item.originalPrice.toFixed(2)}
              </Text>
            )}
          </View>
          <Pressable
            onPress={(e) => {
              e.stopPropagation();
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              addItem({
                id: item.id,
                restaurantId: item.restaurantId,
                restaurantName: item.restaurantName,
                name: item.name,
                price: item.price,
              });
            }}
            style={[
              styles.addBtn,
              {
                backgroundColor: isInCart ? colors.success : colors.primary,
                borderRadius: 8,
              },
            ]}
          >
            <Feather
              name={isInCart ? "check" : "plus"}
              size={16}
              color="#fff"
            />
          </Pressable>
        </View>
      </View>
    </Pressable>
  );
}

export function PopularGrid({ items, title }: Props) {
  const colors = useColors();

  const rows: GridItem[][] = [];
  for (let i = 0; i < items.length; i += 2) {
    rows.push(items.slice(i, i + 2));
  }

  return (
    <View style={styles.section}>
      <View style={styles.header}>
        <Feather name="award" size={18} color={colors.primary} />
        <Text style={[styles.title, { color: colors.foreground }]}>{title}</Text>
      </View>
      <View style={styles.grid}>
        {rows.map((row, i) => (
          <View key={i} style={styles.row}>
            {row.map((item) => (
              <GridCard key={item.id} item={item} />
            ))}
            {row.length === 1 && <View style={{ width: CARD_WIDTH }} />}
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    gap: 12,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: "700" as const,
    fontFamily: "Inter_700Bold",
  },
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
  },
  image: {
    width: "100%",
    height: 120,
    resizeMode: "cover",
  },
  imagePlaceholder: {
    width: "100%",
    height: 120,
    alignItems: "center",
    justifyContent: "center",
  },
  badge: {
    position: "absolute",
    top: 8,
    left: 8,
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 6,
  },
  badgeText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "700" as const,
    fontFamily: "Inter_700Bold",
  },
  trendBadge: {
    position: "absolute",
    top: 8,
    right: 8,
    width: 24,
    height: 24,
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
  restaurant: {
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
    gap: 5,
  },
  price: {
    fontSize: 15,
    fontWeight: "700" as const,
    fontFamily: "Inter_700Bold",
  },
  originalPrice: {
    fontSize: 11,
    fontFamily: "Inter_400Regular",
    textDecorationLine: "line-through",
  },
  addBtn: {
    width: 30,
    height: 30,
    alignItems: "center",
    justifyContent: "center",
  },
});
