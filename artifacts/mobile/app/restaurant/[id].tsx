import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Image,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { MenuItemCard } from "@/components/MenuItemCard";
import { useCart } from "@/context/CartContext";
import restaurants from "@/data/restaurants";
import { useColors } from "@/hooks/useColors";

export default function RestaurantScreen() {
  const colors = useColors();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { itemCount, total } = useCart();

  const restaurant = restaurants.find((r) => r.id === id);
  const [activeCategory, setActiveCategory] = useState<string>(
    restaurant?.categories[0] ?? ""
  );

  if (!restaurant) {
    return (
      <View style={[styles.notFound, { backgroundColor: colors.background }]}>
        <Text style={{ color: colors.foreground }}>Restaurant not found</Text>
      </View>
    );
  }

  const menuByCategory = restaurant.categories.map((cat) => ({
    category: cat,
    items: restaurant.menu.filter((item) => item.category === cat),
  }));

  const filteredItems = restaurant.menu.filter(
    (item) => item.category === activeCategory
  );

  const bottomPad = Platform.OS === "web" ? insets.bottom + 34 : insets.bottom;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.heroContainer}>
        <Image source={restaurant.image} style={styles.heroImage} />
        <View
          style={[
            styles.heroOverlay,
            { paddingTop: Platform.OS === "web" ? Math.max(insets.top, 67) : insets.top },
          ]}
        >
          <TouchableOpacity
            onPress={() => router.back()}
            style={[
              styles.backBtn,
              { backgroundColor: colors.card + "EE", borderRadius: 100 },
            ]}
          >
            <Feather name="arrow-left" size={20} color={colors.foreground} />
          </TouchableOpacity>
        </View>
      </View>

      <View
        style={[
          styles.infoCard,
          {
            backgroundColor: colors.card,
            borderTopLeftRadius: 24,
            borderTopRightRadius: 24,
          },
        ]}
      >
        <View style={[styles.handle, { backgroundColor: colors.border }]} />
        <Text style={[styles.restaurantName, { color: colors.foreground }]}>
          {restaurant.name}
        </Text>
        <View style={styles.metaRow}>
          <Feather name="star" size={14} color={colors.warning} />
          <Text style={[styles.metaText, { color: colors.foreground }]}>
            {restaurant.rating} ({restaurant.reviewCount})
          </Text>
          <View style={styles.dot} />
          <Feather name="clock" size={13} color={colors.mutedForeground} />
          <Text style={[styles.metaText, { color: colors.mutedForeground }]}>
            {restaurant.deliveryTime} min
          </Text>
          <View style={styles.dot} />
          <Text style={[styles.metaText, { color: colors.mutedForeground }]}>
            {restaurant.deliveryFee === 0
              ? "Free delivery"
              : `$${restaurant.deliveryFee.toFixed(2)} delivery`}
          </Text>
        </View>
      </View>

      <View
        style={[
          styles.categoryTabs,
          { backgroundColor: colors.background, borderBottomColor: colors.border },
        ]}
      >
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryTabsContent}
        >
          {restaurant.categories.map((cat) => (
            <TouchableOpacity
              key={cat}
              onPress={() => setActiveCategory(cat)}
              style={[
                styles.categoryTab,
                {
                  borderBottomColor:
                    activeCategory === cat ? colors.primary : "transparent",
                },
              ]}
            >
              <Text
                style={[
                  styles.categoryTabText,
                  {
                    color:
                      activeCategory === cat
                        ? colors.primary
                        : colors.mutedForeground,
                    fontWeight: activeCategory === cat ? "600" : "400",
                  },
                ]}
              >
                {cat}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <ScrollView
        contentContainerStyle={[
          styles.menuList,
          {
            paddingBottom:
              itemCount > 0 ? bottomPad + 80 : bottomPad + 16,
          },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {filteredItems.map((item) => (
          <MenuItemCard
            key={item.id}
            item={item}
            restaurantId={restaurant.id}
            restaurantName={restaurant.name}
          />
        ))}
      </ScrollView>

      {itemCount > 0 && (
        <View
          style={[
            styles.cartBar,
            {
              backgroundColor: colors.foreground,
              bottom: bottomPad + 16,
              borderRadius: colors.radius,
            },
          ]}
        >
          <Pressable
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
              router.push("/cart" as any);
            }}
            style={styles.cartBarInner}
          >
            <View
              style={[
                styles.cartCount,
                { backgroundColor: colors.primary, borderRadius: 6 },
              ]}
            >
              <Text style={[styles.cartCountText, { color: colors.primaryForeground }]}>
                {itemCount}
              </Text>
            </View>
            <Text style={[styles.cartBarLabel, { color: colors.card }]}>
              View Cart
            </Text>
            <Text style={[styles.cartBarTotal, { color: colors.card }]}>
              ${total.toFixed(2)}
            </Text>
          </Pressable>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  notFound: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  heroContainer: {
    position: "relative",
    height: 220,
  },
  heroImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  heroOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  backBtn: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  infoCard: {
    padding: 16,
    paddingTop: 12,
    marginTop: -20,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.06,
        shadowRadius: 8,
      },
    }),
  },
  handle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    alignSelf: "center",
    marginBottom: 12,
  },
  restaurantName: {
    fontSize: 22,
    fontWeight: "700" as const,
    fontFamily: "Inter_700Bold",
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 6,
    flexWrap: "wrap",
  },
  metaText: {
    fontSize: 13,
    fontFamily: "Inter_400Regular",
  },
  dot: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: "#ccc",
  },
  categoryTabs: {
    borderBottomWidth: 1,
  },
  categoryTabsContent: {
    paddingHorizontal: 16,
    gap: 4,
  },
  categoryTab: {
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderBottomWidth: 2,
  },
  categoryTabText: {
    fontSize: 14,
    fontFamily: "Inter_500Medium",
  },
  menuList: {
    padding: 16,
  },
  cartBar: {
    position: "absolute",
    left: 16,
    right: 16,
    overflow: "hidden",
  },
  cartBarInner: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 12,
  },
  cartCount: {
    width: 26,
    height: 26,
    alignItems: "center",
    justifyContent: "center",
  },
  cartCountText: {
    fontSize: 13,
    fontWeight: "700" as const,
    fontFamily: "Inter_700Bold",
  },
  cartBarLabel: {
    flex: 1,
    fontSize: 16,
    fontWeight: "600" as const,
    fontFamily: "Inter_600SemiBold",
  },
  cartBarTotal: {
    fontSize: 16,
    fontWeight: "600" as const,
    fontFamily: "Inter_600SemiBold",
  },
});
