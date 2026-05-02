import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { FlashDeals } from "@/components/FlashDeals";
import { HeroCarousel } from "@/components/HeroCarousel";
import { PopularGrid } from "@/components/PopularGrid";
import { TrendingRow } from "@/components/TrendingRow";
import { useCart } from "@/context/CartContext";
import restaurants, {
  categories,
  getDealsItems,
  getFeaturedRestaurants,
  getTrendingItems,
  getTrendingRestaurants,
} from "@/data/restaurants";
import { useColors } from "@/hooks/useColors";

export default function HomeScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { itemCount } = useCart();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const topPad = Platform.OS === "web" ? Math.max(insets.top, 67) : insets.top;
  const bottomPad = Platform.OS === "web" ? 34 + 84 : 100;

  const featuredRestaurants = getFeaturedRestaurants();
  const trendingRestaurants = getTrendingRestaurants();
  const dealItems = getDealsItems();
  const trendingItems = getTrendingItems();

  const filteredRestaurants =
    selectedCategory === "all"
      ? restaurants
      : restaurants.filter((r) => r.cuisine === selectedCategory);

  const isSearching = searchQuery.length > 0;
  const searchResults = isSearching
    ? restaurants.filter(
        (r) =>
          r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          r.cuisine.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: bottomPad }}
        stickyHeaderIndices={[0]}
      >
        {/* Sticky Top Bar */}
        <View
          style={[
            styles.topBar,
            {
              paddingTop: topPad + 10,
              backgroundColor: colors.background,
              borderBottomColor: isSearching ? colors.border : "transparent",
            },
          ]}
        >
          <View style={styles.locationRow}>
            <Feather name="map-pin" size={14} color={colors.primary} />
            <Text style={[styles.locationText, { color: colors.foreground }]}>
              Current Location
            </Text>
            <Feather name="chevron-down" size={14} color={colors.mutedForeground} />
          </View>
          <View style={styles.topBarActions}>
            <Pressable
              onPress={() => router.push("/cart" as any)}
              style={[
                styles.cartIconBtn,
                { backgroundColor: colors.primary, borderRadius: 12 },
              ]}
            >
              <Feather name="shopping-bag" size={18} color="#fff" />
              {itemCount > 0 && (
                <View
                  style={[
                    styles.cartBadge,
                    { backgroundColor: colors.card },
                  ]}
                >
                  <Text style={[styles.cartBadgeText, { color: colors.primary }]}>
                    {itemCount > 9 ? "9+" : itemCount}
                  </Text>
                </View>
              )}
            </Pressable>
          </View>
        </View>

        {/* Search Bar */}
        {!isSearching && (
          <View style={styles.searchWrapper}>
            <View
              style={[
                styles.searchBar,
                {
                  backgroundColor: colors.card,
                  borderRadius: colors.radius,
                  borderColor: colors.border,
                },
              ]}
            >
              <Feather name="search" size={16} color={colors.mutedForeground} />
              <TextInput
                style={[styles.searchInput, { color: colors.foreground }]}
                placeholder="Search restaurants or dishes..."
                placeholderTextColor={colors.mutedForeground}
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
            </View>
          </View>
        )}

        {/* Search active state */}
        {isSearching && (
          <View style={styles.searchWrapper}>
            <View
              style={[
                styles.searchBar,
                {
                  backgroundColor: colors.card,
                  borderRadius: colors.radius,
                  borderColor: colors.primary,
                  borderWidth: 1.5,
                },
              ]}
            >
              <Feather name="search" size={16} color={colors.primary} />
              <TextInput
                style={[styles.searchInput, { color: colors.foreground }]}
                placeholder="Search restaurants or dishes..."
                placeholderTextColor={colors.mutedForeground}
                value={searchQuery}
                onChangeText={setSearchQuery}
                autoFocus
              />
              <Pressable onPress={() => setSearchQuery("")}>
                <Feather name="x" size={16} color={colors.mutedForeground} />
              </Pressable>
            </View>
          </View>
        )}

        {isSearching ? (
          /* Search Results */
          <View style={styles.searchResults}>
            {searchResults.length === 0 ? (
              <View style={styles.noResults}>
                <Feather name="search" size={36} color={colors.mutedForeground} />
                <Text style={[styles.noResultsText, { color: colors.mutedForeground }]}>
                  No results for "{searchQuery}"
                </Text>
              </View>
            ) : (
              searchResults.map((r) => (
                <Pressable
                  key={r.id}
                  onPress={() => router.push(`/restaurant/${r.id}` as any)}
                  style={({ pressed }) => [
                    styles.searchResultRow,
                    {
                      backgroundColor: colors.card,
                      borderRadius: colors.radius,
                      borderColor: colors.border,
                      opacity: pressed ? 0.88 : 1,
                    },
                  ]}
                >
                  <View
                    style={[
                      styles.searchResultIcon,
                      { backgroundColor: colors.muted, borderRadius: 10 },
                    ]}
                  >
                    <Feather name="map-pin" size={18} color={colors.primary} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.searchResultName, { color: colors.foreground }]}>
                      {r.name}
                    </Text>
                    <Text
                      style={[styles.searchResultMeta, { color: colors.mutedForeground }]}
                    >
                      {r.cuisine} · {r.deliveryTime} min
                    </Text>
                  </View>
                  <Feather name="chevron-right" size={16} color={colors.mutedForeground} />
                </Pressable>
              ))
            )}
          </View>
        ) : (
          <>
            {/* Hero Netflix Carousel */}
            <HeroCarousel restaurants={featuredRestaurants} />

            {/* Category Quick Filters */}
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.categoriesRow}
              style={styles.categoriesScroll}
            >
              {categories.map((cat) => {
                const active = selectedCategory === cat.id;
                return (
                  <Pressable
                    key={cat.id}
                    onPress={() => setSelectedCategory(cat.id)}
                    style={[
                      styles.categoryChip,
                      {
                        backgroundColor: active ? colors.primary : colors.card,
                        borderRadius: 100,
                        borderColor: active ? colors.primary : colors.border,
                      },
                    ]}
                  >
                    <Feather
                      name={cat.icon as any}
                      size={14}
                      color={active ? "#fff" : colors.mutedForeground}
                    />
                    <Text
                      style={[
                        styles.categoryChipText,
                        { color: active ? "#fff" : colors.foreground },
                      ]}
                    >
                      {cat.label}
                    </Text>
                  </Pressable>
                );
              })}
            </ScrollView>

            {/* Promo Banner */}
            <View style={styles.promoBannerWrapper}>
              <Pressable
                style={[
                  styles.promoBanner,
                  { backgroundColor: colors.primary, borderRadius: colors.radius * 1.2 },
                ]}
              >
                <View>
                  <Text style={styles.promoTitle}>Free Delivery</Text>
                  <Text style={styles.promoSubtitle}>
                    On your first 3 orders · Use code FIRST3
                  </Text>
                </View>
                <View
                  style={[
                    styles.promoTag,
                    { backgroundColor: "rgba(255,255,255,0.25)", borderRadius: 8 },
                  ]}
                >
                  <Text style={styles.promoTagText}>Claim</Text>
                </View>
              </Pressable>
            </View>

            {/* Flash Deals */}
            {dealItems.length > 0 && (
              <View style={styles.section}>
                <FlashDeals
                  items={dealItems.map((i) => ({
                    ...i,
                    restaurantId: i.restaurantId,
                    restaurantName: i.restaurantName,
                  }))}
                />
              </View>
            )}

            {/* Trending Restaurants - Netflix Row */}
            {trendingRestaurants.length > 0 && (
              <View style={styles.section}>
                <TrendingRow
                  restaurants={trendingRestaurants}
                  title="Trending Near You"
                  icon="trending-up"
                />
              </View>
            )}

            {/* Popular Items Grid */}
            {trendingItems.length > 0 && (
              <View style={styles.section}>
                <PopularGrid
                  items={trendingItems.map((i) => ({
                    ...i,
                    restaurantId: i.restaurantId,
                    restaurantName: i.restaurantName,
                  }))}
                  title="Popular Right Now"
                />
              </View>
            )}

            {/* All / Filtered Restaurants */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Feather name="list" size={18} color={colors.primary} />
                <Text style={[styles.sectionTitle, { color: colors.foreground }]}>
                  {selectedCategory === "all"
                    ? "All Restaurants"
                    : categories.find((c) => c.id === selectedCategory)?.label ?? selectedCategory}
                </Text>
                <Text style={[styles.sectionCount, { color: colors.mutedForeground }]}>
                  {filteredRestaurants.length}
                </Text>
              </View>
              {filteredRestaurants.map((r) => (
                <Pressable
                  key={r.id}
                  onPress={() => router.push(`/restaurant/${r.id}` as any)}
                  style={({ pressed }) => [
                    styles.listCard,
                    {
                      backgroundColor: colors.card,
                      borderRadius: colors.radius,
                      borderColor: colors.border,
                      opacity: pressed ? 0.92 : 1,
                    },
                  ]}
                >
                  <View
                    style={[
                      styles.listCardIcon,
                      {
                        backgroundColor: colors.muted,
                        borderRadius: colors.radius / 1.5,
                      },
                    ]}
                  >
                    <Feather name="map-pin" size={20} color={colors.primary} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <View style={styles.listCardTop}>
                      <Text
                        style={[styles.listCardName, { color: colors.foreground }]}
                        numberOfLines={1}
                      >
                        {r.name}
                      </Text>
                      <View style={styles.ratingPill}>
                        <Feather name="star" size={11} color={colors.warning} />
                        <Text
                          style={[styles.ratingText, { color: colors.foreground }]}
                        >
                          {r.rating}
                        </Text>
                      </View>
                    </View>
                    <Text
                      style={[styles.listCardMeta, { color: colors.mutedForeground }]}
                    >
                      {r.cuisine} · {r.deliveryTime} min ·{" "}
                      {r.deliveryFee === 0
                        ? "Free delivery"
                        : `$${r.deliveryFee.toFixed(2)}`}
                    </Text>
                  </View>
                  <Feather name="chevron-right" size={16} color={colors.mutedForeground} />
                </Pressable>
              ))}
            </View>
          </>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingBottom: 10,
    borderBottomWidth: 1,
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  locationText: {
    fontSize: 15,
    fontWeight: "600" as const,
    fontFamily: "Inter_600SemiBold",
  },
  topBarActions: {
    flexDirection: "row",
    gap: 8,
  },
  cartIconBtn: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  cartBadge: {
    position: "absolute",
    top: -4,
    right: -4,
    width: 17,
    height: 17,
    borderRadius: 9,
    alignItems: "center",
    justifyContent: "center",
  },
  cartBadgeText: {
    fontSize: 9,
    fontWeight: "700" as const,
    fontFamily: "Inter_700Bold",
  },
  searchWrapper: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: 11,
    borderWidth: 1,
    gap: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    fontFamily: "Inter_400Regular",
    padding: 0,
  },
  searchResults: {
    paddingHorizontal: 16,
    gap: 10,
    paddingTop: 4,
  },
  noResults: {
    alignItems: "center",
    paddingVertical: 40,
    gap: 10,
  },
  noResultsText: {
    fontSize: 14,
    fontFamily: "Inter_400Regular",
  },
  searchResultRow: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderWidth: 1,
    gap: 12,
  },
  searchResultIcon: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  searchResultName: {
    fontSize: 15,
    fontWeight: "600" as const,
    fontFamily: "Inter_600SemiBold",
  },
  searchResultMeta: {
    fontSize: 12,
    fontFamily: "Inter_400Regular",
    marginTop: 2,
  },
  categoriesScroll: {
    marginTop: 16,
  },
  categoriesRow: {
    paddingHorizontal: 16,
    gap: 8,
  },
  categoryChip: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderWidth: 1,
    gap: 6,
  },
  categoryChipText: {
    fontSize: 13,
    fontWeight: "500" as const,
    fontFamily: "Inter_500Medium",
  },
  promoBannerWrapper: {
    paddingHorizontal: 16,
    marginTop: 16,
  },
  promoBanner: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
  },
  promoTitle: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700" as const,
    fontFamily: "Inter_700Bold",
  },
  promoSubtitle: {
    color: "rgba(255,255,255,0.8)",
    fontSize: 12,
    fontFamily: "Inter_400Regular",
    marginTop: 2,
  },
  promoTag: {
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  promoTagText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "700" as const,
    fontFamily: "Inter_700Bold",
  },
  section: {
    marginTop: 24,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700" as const,
    fontFamily: "Inter_700Bold",
    flex: 1,
  },
  sectionCount: {
    fontSize: 14,
    fontFamily: "Inter_400Regular",
  },
  listCard: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 16,
    marginBottom: 10,
    padding: 12,
    borderWidth: 1,
    gap: 12,
  },
  listCardIcon: {
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
  },
  listCardTop: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
  },
  listCardName: {
    fontSize: 15,
    fontWeight: "600" as const,
    fontFamily: "Inter_600SemiBold",
    flex: 1,
  },
  listCardMeta: {
    fontSize: 12,
    fontFamily: "Inter_400Regular",
    marginTop: 3,
  },
  ratingPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
  },
  ratingText: {
    fontSize: 13,
    fontWeight: "600" as const,
    fontFamily: "Inter_600SemiBold",
  },
});
