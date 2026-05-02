import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  Image,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useCart } from "@/context/CartContext";
import { findItem, getItemsByCategory, restaurant } from "@/data/menu";
import { useColors } from "@/hooks/useColors";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

export default function ItemDetailScreen() {
  const colors = useColors();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { itemId } = useLocalSearchParams<{ itemId: string }>();
  const { addItem, items: cartItems, updateQuantity } = useCart();
  const [added, setAdded] = useState(false);
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const item = findItem(itemId ?? "");
  const cartItem = cartItems.find((c) => c.id === itemId);
  const quantity = cartItem?.quantity ?? 0;

  const bottomPad = Platform.OS === "web" ? insets.bottom + 34 : insets.bottom;

  if (!item) {
    return (
      <View style={[styles.notFound, { backgroundColor: colors.background }]}>
        <Feather name="alert-circle" size={40} color={colors.mutedForeground} />
        <Text style={[styles.notFoundText, { color: colors.foreground }]}>
          Item not found
        </Text>
        <Pressable onPress={() => router.back()}>
          <Text style={[styles.goBack, { color: colors.primary }]}>Go back</Text>
        </Pressable>
      </View>
    );
  }

  const discountPct = item.originalPrice
    ? Math.round((1 - item.price / item.originalPrice) * 100)
    : 0;

  const similarItems = getItemsByCategory(item.category)
    .filter((m) => m.id !== item.id)
    .slice(0, 4);

  const handleAddToCart = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.94,
        duration: 80,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true, speed: 20 }),
    ]).start();
    addItem({
      id: item.id,
      restaurantId: "1",
      restaurantName: restaurant.name,
      name: item.name,
      price: item.price,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Image Hero */}
      <View style={styles.imageContainer}>
        {item.image ? (
          <Image source={item.image} style={styles.heroImage} />
        ) : (
          <View style={[styles.imagePlaceholder, { backgroundColor: colors.muted }]}>
            <Feather name="coffee" size={64} color={colors.mutedForeground} />
          </View>
        )}

        <Pressable
          onPress={() => router.back()}
          style={[
            styles.backBtn,
            {
              backgroundColor: colors.card + "EE",
              borderRadius: 100,
              top:
                Platform.OS === "web"
                  ? Math.max(insets.top, 67) + 12
                  : insets.top + 12,
            },
          ]}
        >
          <Feather name="arrow-left" size={20} color={colors.foreground} />
        </Pressable>

        {discountPct > 0 && (
          <View
            style={[
              styles.heroBadge,
              { backgroundColor: colors.primary, borderRadius: 10 },
            ]}
          >
            <Feather name="zap" size={13} color="#fff" />
            <Text style={styles.heroBadgeText}>{discountPct}% OFF</Text>
          </View>
        )}
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: bottomPad + 90 }]}
      >
        {/* Main Info Card */}
        <View
          style={[
            styles.mainCard,
            { backgroundColor: colors.card, borderRadius: colors.radius * 1.5, marginTop: -20 },
          ]}
        >
          <View style={[styles.handle, { backgroundColor: colors.border }]} />

          {/* Tags */}
          <View style={styles.tagsRow}>
            <View
              style={[
                styles.tag,
                { backgroundColor: colors.muted, borderRadius: 100, borderColor: colors.border },
              ]}
            >
              <Feather name="grid" size={11} color={colors.mutedForeground} />
              <Text style={[styles.tagText, { color: colors.mutedForeground }]}>
                {item.category}
              </Text>
            </View>
            {item.popular && (
              <View
                style={[
                  styles.tag,
                  { backgroundColor: colors.primary + "18", borderRadius: 100, borderColor: colors.primary + "40" },
                ]}
              >
                <Feather name="award" size={11} color={colors.primary} />
                <Text style={[styles.tagText, { color: colors.primary }]}>Popular</Text>
              </View>
            )}
            {item.trending && (
              <View
                style={[
                  styles.tag,
                  { backgroundColor: "#F59E0B18", borderRadius: 100, borderColor: "#F59E0B40" },
                ]}
              >
                <Feather name="trending-up" size={11} color="#F59E0B" />
                <Text style={[styles.tagText, { color: "#F59E0B" }]}>Trending</Text>
              </View>
            )}
            {item.isNew && (
              <View
                style={[
                  styles.tag,
                  { backgroundColor: "#7C3AED18", borderRadius: 100, borderColor: "#7C3AED40" },
                ]}
              >
                <Feather name="star" size={11} color="#7C3AED" />
                <Text style={[styles.tagText, { color: "#7C3AED" }]}>New</Text>
              </View>
            )}
          </View>

          <Text style={[styles.itemName, { color: colors.foreground }]}>{item.name}</Text>

          {/* Price Block */}
          <View style={styles.priceBlock}>
            <Text style={[styles.price, { color: colors.primary }]}>
              ${item.price.toFixed(2)}
            </Text>
            {item.originalPrice && (
              <View style={styles.originalPriceBlock}>
                <Text style={[styles.originalPrice, { color: colors.mutedForeground }]}>
                  ${item.originalPrice.toFixed(2)}
                </Text>
                <View
                  style={[
                    styles.savingBadge,
                    { backgroundColor: colors.success + "18", borderRadius: 100 },
                  ]}
                >
                  <Text style={[styles.savingText, { color: colors.success }]}>
                    Save ${(item.originalPrice - item.price).toFixed(2)}
                  </Text>
                </View>
              </View>
            )}
          </View>

          <Text style={[styles.description, { color: colors.mutedForeground }]}>
            {item.description}
          </Text>

          {/* Info Strip */}
          <View
            style={[
              styles.infoStrip,
              { backgroundColor: colors.muted, borderRadius: colors.radius },
            ]}
          >
            {item.calories && (
              <View style={styles.infoItem}>
                <Feather name="zap" size={14} color={colors.primary} />
                <View>
                  <Text style={[styles.infoLabel, { color: colors.mutedForeground }]}>
                    Calories
                  </Text>
                  <Text style={[styles.infoValue, { color: colors.foreground }]}>
                    {item.calories}
                  </Text>
                </View>
              </View>
            )}
            {item.calories && <View style={[styles.divider, { backgroundColor: colors.border }]} />}
            {item.prepTime && (
              <View style={styles.infoItem}>
                <Feather name="clock" size={14} color={colors.primary} />
                <View>
                  <Text style={[styles.infoLabel, { color: colors.mutedForeground }]}>
                    Prep time
                  </Text>
                  <Text style={[styles.infoValue, { color: colors.foreground }]}>
                    {item.prepTime}
                  </Text>
                </View>
              </View>
            )}
            {item.prepTime && <View style={[styles.divider, { backgroundColor: colors.border }]} />}
            <View style={styles.infoItem}>
              <Feather name="truck" size={14} color={colors.primary} />
              <View>
                <Text style={[styles.infoLabel, { color: colors.mutedForeground }]}>
                  Delivery
                </Text>
                <Text style={[styles.infoValue, { color: colors.foreground }]}>
                  {restaurant.deliveryTime} min
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* More From This Category */}
        {similarItems.length > 0 && (
          <View style={styles.similarSection}>
            <Text style={[styles.similarTitle, { color: colors.foreground }]}>
              More from {item.category}
            </Text>
            <View style={styles.similarGrid}>
              {similarItems.map((si) => {
                const siDiscount = si.originalPrice
                  ? Math.round((1 - si.price / si.originalPrice) * 100)
                  : 0;
                return (
                  <Pressable
                    key={si.id}
                    onPress={() =>
                      router.replace({
                        pathname: "/item/[itemId]" as any,
                        params: { itemId: si.id, restaurantId: "1" },
                      })
                    }
                    style={({ pressed }) => [
                      styles.similarCard,
                      {
                        backgroundColor: colors.card,
                        borderRadius: colors.radius,
                        borderColor: colors.border,
                        opacity: pressed ? 0.9 : 1,
                      },
                    ]}
                  >
                    {si.image ? (
                      <Image
                        source={si.image}
                        style={[
                          styles.similarImage,
                          {
                            borderTopLeftRadius: colors.radius,
                            borderTopRightRadius: colors.radius,
                          },
                        ]}
                      />
                    ) : (
                      <View
                        style={[
                          styles.similarImagePlaceholder,
                          {
                            backgroundColor: colors.muted,
                            borderTopLeftRadius: colors.radius,
                            borderTopRightRadius: colors.radius,
                          },
                        ]}
                      >
                        <Feather name="coffee" size={22} color={colors.mutedForeground} />
                      </View>
                    )}
                    {siDiscount > 0 && (
                      <View style={[styles.simBadge, { backgroundColor: colors.primary }]}>
                        <Text style={styles.simBadgeText}>{siDiscount}%</Text>
                      </View>
                    )}
                    <View style={styles.similarInfo}>
                      <Text
                        style={[styles.similarName, { color: colors.foreground }]}
                        numberOfLines={1}
                      >
                        {si.name}
                      </Text>
                      <Text style={[styles.similarPrice, { color: colors.primary }]}>
                        ${si.price.toFixed(2)}
                      </Text>
                    </View>
                  </Pressable>
                );
              })}
            </View>
          </View>
        )}
      </ScrollView>

      {/* Bottom Bar */}
      <View
        style={[
          styles.bottomBar,
          {
            backgroundColor: colors.background,
            borderTopColor: colors.border,
            paddingBottom: bottomPad + 12,
          },
        ]}
      >
        {quantity > 0 ? (
          <View style={styles.bottomRow}>
            <View
              style={[styles.qtyControl, { backgroundColor: colors.muted, borderRadius: colors.radius }]}
            >
              <Pressable
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  updateQuantity(item.id, quantity - 1);
                }}
                style={styles.qtyBtn}
              >
                <Feather name="minus" size={16} color={colors.foreground} />
              </Pressable>
              <Text style={[styles.qtyText, { color: colors.foreground }]}>{quantity}</Text>
              <Pressable
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  updateQuantity(item.id, quantity + 1);
                }}
                style={styles.qtyBtn}
              >
                <Feather name="plus" size={16} color={colors.foreground} />
              </Pressable>
            </View>
            <Animated.View style={[{ flex: 1 }, { transform: [{ scale: scaleAnim }] }]}>
              <Pressable
                onPress={() => router.push("/cart" as any)}
                style={[
                  styles.viewCartBtn,
                  { backgroundColor: colors.foreground, borderRadius: colors.radius },
                ]}
              >
                <Feather name="shopping-bag" size={18} color={colors.card} />
                <Text style={[styles.viewCartText, { color: colors.card }]}>
                  View Cart · ${(item.price * quantity).toFixed(2)}
                </Text>
              </Pressable>
            </Animated.View>
          </View>
        ) : (
          <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
            <Pressable
              onPress={handleAddToCart}
              style={[
                styles.addToCartBtn,
                { backgroundColor: added ? colors.success : colors.primary, borderRadius: colors.radius },
              ]}
            >
              <Feather name={added ? "check" : "shopping-bag"} size={20} color="#fff" />
              <Text style={styles.addToCartText}>
                {added ? "Added to Cart!" : `Add to Cart · $${item.price.toFixed(2)}`}
              </Text>
            </Pressable>
          </Animated.View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  notFound: { flex: 1, alignItems: "center", justifyContent: "center", gap: 12 },
  notFoundText: { fontSize: 18, fontWeight: "600" as const, fontFamily: "Inter_600SemiBold" },
  goBack: { fontSize: 15, fontFamily: "Inter_500Medium", textDecorationLine: "underline" },
  imageContainer: { height: 300, position: "relative" },
  heroImage: { width: "100%", height: "100%", resizeMode: "cover" },
  imagePlaceholder: { width: "100%", height: "100%", alignItems: "center", justifyContent: "center" },
  backBtn: { position: "absolute", left: 16, width: 40, height: 40, alignItems: "center", justifyContent: "center" },
  heroBadge: {
    position: "absolute", bottom: 28, right: 16,
    flexDirection: "row", alignItems: "center", gap: 5,
    paddingHorizontal: 12, paddingVertical: 6,
  },
  heroBadgeText: { color: "#fff", fontSize: 13, fontWeight: "700" as const, fontFamily: "Inter_700Bold" },
  scrollContent: { gap: 0 },
  mainCard: { paddingHorizontal: 20, paddingBottom: 20, paddingTop: 12 },
  handle: { width: 36, height: 4, borderRadius: 2, alignSelf: "center", marginBottom: 16 },
  tagsRow: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginBottom: 12 },
  tag: { flexDirection: "row", alignItems: "center", gap: 5, paddingHorizontal: 10, paddingVertical: 5, borderWidth: 1 },
  tagText: { fontSize: 12, fontWeight: "600" as const, fontFamily: "Inter_600SemiBold" },
  itemName: { fontSize: 26, fontWeight: "700" as const, fontFamily: "Inter_700Bold", lineHeight: 32 },
  priceBlock: { flexDirection: "row", alignItems: "center", gap: 10, marginTop: 10, flexWrap: "wrap" },
  price: { fontSize: 28, fontWeight: "700" as const, fontFamily: "Inter_700Bold" },
  originalPriceBlock: { flexDirection: "row", alignItems: "center", gap: 8 },
  originalPrice: { fontSize: 16, fontFamily: "Inter_400Regular", textDecorationLine: "line-through" },
  savingBadge: { paddingHorizontal: 10, paddingVertical: 4 },
  savingText: { fontSize: 12, fontWeight: "600" as const, fontFamily: "Inter_600SemiBold" },
  description: { fontSize: 14, fontFamily: "Inter_400Regular", lineHeight: 22, marginTop: 12 },
  infoStrip: { flexDirection: "row", alignItems: "center", padding: 14, marginTop: 16, gap: 0 },
  infoItem: { flex: 1, flexDirection: "row", alignItems: "center", gap: 8, justifyContent: "center" },
  divider: { width: 1, height: 36, marginHorizontal: 4 },
  infoLabel: { fontSize: 11, fontFamily: "Inter_400Regular" },
  infoValue: { fontSize: 13, fontWeight: "600" as const, fontFamily: "Inter_600SemiBold" },
  similarSection: { paddingHorizontal: 16, paddingTop: 24, gap: 14 },
  similarTitle: { fontSize: 18, fontWeight: "700" as const, fontFamily: "Inter_700Bold" },
  similarGrid: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  similarCard: { width: (SCREEN_WIDTH - 42) / 2, borderWidth: 1, overflow: "hidden" },
  similarImage: { width: "100%", height: 90, resizeMode: "cover" },
  similarImagePlaceholder: { width: "100%", height: 90, alignItems: "center", justifyContent: "center" },
  simBadge: { position: "absolute", top: 6, left: 6, paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 },
  simBadgeText: { color: "#fff", fontSize: 10, fontWeight: "700" as const, fontFamily: "Inter_700Bold" },
  similarInfo: { padding: 8, gap: 3 },
  similarName: { fontSize: 12, fontWeight: "600" as const, fontFamily: "Inter_600SemiBold" },
  similarPrice: { fontSize: 14, fontWeight: "700" as const, fontFamily: "Inter_700Bold" },
  bottomBar: { position: "absolute", bottom: 0, left: 0, right: 0, paddingHorizontal: 16, paddingTop: 12, borderTopWidth: 1 },
  bottomRow: { flexDirection: "row", alignItems: "center", gap: 12 },
  qtyControl: { flexDirection: "row", alignItems: "center", height: 52 },
  qtyBtn: { width: 44, height: 52, alignItems: "center", justifyContent: "center" },
  qtyText: { fontSize: 16, fontWeight: "700" as const, fontFamily: "Inter_700Bold", minWidth: 24, textAlign: "center" },
  viewCartBtn: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8, paddingVertical: 15 },
  viewCartText: { fontSize: 15, fontWeight: "700" as const, fontFamily: "Inter_700Bold" },
  addToCartBtn: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 10, paddingVertical: 16 },
  addToCartText: { color: "#fff", fontSize: 16, fontWeight: "700" as const, fontFamily: "Inter_700Bold" },
});
