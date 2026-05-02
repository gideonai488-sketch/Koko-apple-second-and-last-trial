import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
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
import { MenuSection } from "@/components/MenuSection";
import { PromoBanner } from "@/components/PromoBanner";
import { useCart } from "@/context/CartContext";
import { useProducts } from "@/context/ProductsContext";
import { promoSlides, restaurant } from "@/data/menu";
import { useColors } from "@/hooks/useColors";

export default function HomeScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { itemCount } = useCart();
  const {
    products,
    loading,
    error,
    refetch,
    getByCategory,
    getDealProducts,
    getCategories,
  } = useProducts();

  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const topPad = Platform.OS === "web" ? Math.max(insets.top, 67) : insets.top;
  const bottomPad = Platform.OS === "web" ? 34 + 84 : 100;

  const dealItems = getDealProducts().map((i) => ({
    ...i,
    restaurantId: "1",
    restaurantName: restaurant.name,
  }));

  const isSearching = searchQuery.length > 0;
  const searchResults = isSearching
    ? products.filter(
        (i) =>
          i.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          i.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          i.category.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  const categoryItems = getByCategory(selectedCategory).map((i) => ({
    ...i,
    restaurantId: "1",
    restaurantName: restaurant.name,
  }));

  const menuCategories = getCategories();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: bottomPad }}
        stickyHeaderIndices={[0]}
      >
        {/* Sticky Header */}
        <View
          style={[
            styles.header,
            {
              paddingTop: topPad + 10,
              backgroundColor: colors.background,
              borderBottomColor: colors.border,
            },
          ]}
        >
          <View style={styles.headerLeft}>
            <Text style={[styles.restaurantName, { color: colors.foreground }]}>
              {restaurant.name}
            </Text>
            <View style={styles.headerMeta}>
              <Feather name="clock" size={12} color={colors.mutedForeground} />
              <Text style={[styles.headerMetaText, { color: colors.mutedForeground }]}>
                {restaurant.deliveryTime} min
              </Text>
              <View style={[styles.dot, { backgroundColor: colors.mutedForeground }]} />
              <Feather name="star" size={12} color={colors.warning} />
              <Text style={[styles.headerMetaText, { color: colors.mutedForeground }]}>
                {restaurant.rating}
              </Text>
            </View>
          </View>
          <Pressable
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              router.push("/cart" as any);
            }}
            style={[
              styles.cartBtn,
              { backgroundColor: colors.primary, borderRadius: 12 },
            ]}
          >
            <Feather name="shopping-bag" size={18} color="#fff" />
            {itemCount > 0 && (
              <View style={[styles.cartBadge, { backgroundColor: colors.card }]}>
                <Text style={[styles.cartBadgeText, { color: colors.primary }]}>
                  {itemCount > 9 ? "9+" : itemCount}
                </Text>
              </View>
            )}
          </Pressable>
        </View>

        {/* Search Bar */}
        <View style={styles.searchWrapper}>
          <View
            style={[
              styles.searchBar,
              {
                backgroundColor: colors.card,
                borderRadius: colors.radius,
                borderColor: isSearching ? colors.primary : colors.border,
                borderWidth: isSearching ? 1.5 : 1,
              },
            ]}
          >
            <Feather
              name="search"
              size={16}
              color={isSearching ? colors.primary : colors.mutedForeground}
            />
            <TextInput
              style={[styles.searchInput, { color: colors.foreground }]}
              placeholder="Search menu..."
              placeholderTextColor={colors.mutedForeground}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            {isSearching && (
              <Pressable onPress={() => setSearchQuery("")}>
                <Feather name="x" size={15} color={colors.mutedForeground} />
              </Pressable>
            )}
          </View>
        </View>

        {loading ? (
          <View style={styles.loadingState}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={[styles.loadingText, { color: colors.mutedForeground }]}>
              Loading menu...
            </Text>
          </View>
        ) : error ? (
          <View style={styles.errorState}>
            <Feather name="wifi-off" size={40} color={colors.mutedForeground} />
            <Text style={[styles.errorTitle, { color: colors.foreground }]}>
              Couldn't load menu
            </Text>
            <Pressable
              onPress={refetch}
              style={[styles.retryBtn, { backgroundColor: colors.primary, borderRadius: colors.radius }]}
            >
              <Text style={[styles.retryText, { color: colors.primaryForeground }]}>
                Try Again
              </Text>
            </Pressable>
          </View>
        ) : isSearching ? (
          <View style={styles.searchSection}>
            <Text style={[styles.searchResultsLabel, { color: colors.mutedForeground }]}>
              {searchResults.length} result{searchResults.length !== 1 ? "s" : ""} for "{searchQuery}"
            </Text>
            <MenuSection
              items={searchResults.map((i) => ({
                ...i,
                restaurantId: "1",
                restaurantName: restaurant.name,
              }))}
            />
          </View>
        ) : (
          <>
            {/* Promo Banner */}
            <PromoBanner slides={promoSlides} />

            {/* Quick Info Strip */}
            <View
              style={[
                styles.infoStrip,
                { backgroundColor: colors.muted, borderColor: colors.border },
              ]}
            >
              <View style={styles.infoItem}>
                <Feather name="truck" size={14} color={colors.primary} />
                <Text style={[styles.infoText, { color: colors.foreground }]}>
                  GH₵{restaurant.deliveryFee.toFixed(2)} delivery
                </Text>
              </View>
              <View style={[styles.infoDivider, { backgroundColor: colors.border }]} />
              <View style={styles.infoItem}>
                <Feather name="clock" size={14} color={colors.primary} />
                <Text style={[styles.infoText, { color: colors.foreground }]}>
                  {restaurant.deliveryTime} min
                </Text>
              </View>
              <View style={[styles.infoDivider, { backgroundColor: colors.border }]} />
              <View style={styles.infoItem}>
                <Feather name="dollar-sign" size={14} color={colors.primary} />
                <Text style={[styles.infoText, { color: colors.foreground }]}>
                  GH₵{restaurant.minOrder} min
                </Text>
              </View>
            </View>

            {/* Flash Deals */}
            {dealItems.length > 0 && (
              <View style={styles.section}>
                <FlashDeals items={dealItems} />
              </View>
            )}

            {/* Category Tabs */}
            <View style={styles.section}>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.categoriesRow}
              >
                {menuCategories.map((cat) => {
                  const active = selectedCategory === cat;
                  return (
                    <Pressable
                      key={cat}
                      onPress={() => {
                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                        setSelectedCategory(cat);
                      }}
                      style={[
                        styles.categoryChip,
                        {
                          backgroundColor: active ? colors.primary : colors.card,
                          borderRadius: 100,
                          borderColor: active ? colors.primary : colors.border,
                        },
                      ]}
                    >
                      <Text
                        style={[
                          styles.categoryChipText,
                          { color: active ? "#fff" : colors.foreground },
                        ]}
                      >
                        {cat}
                      </Text>
                    </Pressable>
                  );
                })}
              </ScrollView>
            </View>

            {/* Menu Items Grid */}
            <View style={styles.menuGrid}>
              <View style={styles.sectionHeader}>
                <Text style={[styles.sectionTitle, { color: colors.foreground }]}>
                  {selectedCategory === "All" ? "Full Menu" : selectedCategory}
                </Text>
                <Text style={[styles.sectionCount, { color: colors.mutedForeground }]}>
                  {categoryItems.length} items
                </Text>
              </View>
              <MenuSection items={categoryItems} />
            </View>
          </>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
  },
  headerLeft: { gap: 3 },
  restaurantName: {
    fontSize: 20,
    fontWeight: "700" as const,
    fontFamily: "Inter_700Bold",
  },
  headerMeta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  headerMetaText: {
    fontSize: 12,
    fontFamily: "Inter_400Regular",
  },
  dot: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
  },
  cartBtn: {
    width: 42,
    height: 42,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  cartBadge: {
    position: "absolute",
    top: -5,
    right: -5,
    width: 18,
    height: 18,
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
    gap: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    fontFamily: "Inter_400Regular",
    padding: 0,
  },
  loadingState: {
    paddingTop: 80,
    alignItems: "center",
    gap: 16,
  },
  loadingText: {
    fontSize: 14,
    fontFamily: "Inter_400Regular",
  },
  errorState: {
    paddingTop: 80,
    alignItems: "center",
    gap: 16,
    paddingHorizontal: 32,
  },
  errorTitle: {
    fontSize: 18,
    fontWeight: "600" as const,
    fontFamily: "Inter_600SemiBold",
  },
  retryBtn: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    marginTop: 4,
  },
  retryText: {
    fontSize: 15,
    fontWeight: "600" as const,
    fontFamily: "Inter_600SemiBold",
  },
  searchSection: {
    paddingHorizontal: 4,
    gap: 12,
    paddingTop: 4,
  },
  searchResultsLabel: {
    fontSize: 13,
    fontFamily: "Inter_400Regular",
    paddingHorizontal: 16,
  },
  infoStrip: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 16,
    marginTop: 12,
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
  },
  infoItem: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 5,
  },
  infoText: {
    fontSize: 12,
    fontWeight: "500" as const,
    fontFamily: "Inter_500Medium",
  },
  infoDivider: {
    width: 1,
    height: 20,
  },
  section: { marginTop: 20 },
  categoriesRow: {
    paddingHorizontal: 16,
    gap: 8,
  },
  categoryChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderWidth: 1,
  },
  categoryChipText: {
    fontSize: 13,
    fontWeight: "500" as const,
    fontFamily: "Inter_500Medium",
  },
  menuGrid: { marginTop: 20 },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700" as const,
    fontFamily: "Inter_700Bold",
  },
  sectionCount: {
    fontSize: 13,
    fontFamily: "Inter_400Regular",
  },
});
