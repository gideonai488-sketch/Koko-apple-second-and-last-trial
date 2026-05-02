import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useRef } from "react";
import {
  Animated,
  Image,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { Restaurant } from "@/data/restaurants";
import { useColors } from "@/hooks/useColors";

interface Props {
  restaurant: Restaurant;
}

export function RestaurantCard({ restaurant }: Props) {
  const colors = useColors();
  const router = useRouter();
  const scale = useRef(new Animated.Value(1)).current;

  const onPressIn = () => {
    Animated.spring(scale, {
      toValue: 0.97,
      useNativeDriver: true,
      speed: 20,
    }).start();
  };

  const onPressOut = () => {
    Animated.spring(scale, {
      toValue: 1,
      useNativeDriver: true,
      speed: 20,
    }).start();
  };

  return (
    <Pressable
      onPress={() => router.push(`/restaurant/${restaurant.id}` as any)}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
    >
      <Animated.View
        style={[
          styles.card,
          {
            backgroundColor: colors.card,
            borderRadius: colors.radius,
            borderColor: colors.border,
            transform: [{ scale }],
          },
        ]}
      >
        <View style={[styles.imageContainer, { borderRadius: colors.radius }]}>
          <Image source={restaurant.image} style={styles.image} />
          {restaurant.promoted && (
            <View
              style={[
                styles.badge,
                { backgroundColor: colors.primary, borderRadius: colors.radius / 2 },
              ]}
            >
              <Text style={[styles.badgeText, { color: colors.primaryForeground }]}>
                Featured
              </Text>
            </View>
          )}
          {restaurant.deliveryFee === 0 && (
            <View
              style={[
                styles.freeBadge,
                { backgroundColor: colors.success, borderRadius: colors.radius / 2 },
              ]}
            >
              <Text style={[styles.badgeText, { color: "#fff" }]}>Free delivery</Text>
            </View>
          )}
        </View>

        <View style={styles.info}>
          <View style={styles.row}>
            <Text
              style={[styles.name, { color: colors.foreground }]}
              numberOfLines={1}
            >
              {restaurant.name}
            </Text>
            <View style={styles.ratingRow}>
              <Feather name="star" size={13} color={colors.warning} />
              <Text style={[styles.rating, { color: colors.foreground }]}>
                {restaurant.rating}
              </Text>
              <Text style={[styles.reviews, { color: colors.mutedForeground }]}>
                ({restaurant.reviewCount})
              </Text>
            </View>
          </View>

          <Text style={[styles.cuisine, { color: colors.mutedForeground }]}>
            {restaurant.cuisine}
          </Text>

          <View style={styles.meta}>
            <View style={styles.metaItem}>
              <Feather name="clock" size={12} color={colors.mutedForeground} />
              <Text style={[styles.metaText, { color: colors.mutedForeground }]}>
                {restaurant.deliveryTime} min
              </Text>
            </View>
            <View style={styles.dot} />
            <Text style={[styles.metaText, { color: colors.mutedForeground }]}>
              {restaurant.deliveryFee === 0
                ? "Free delivery"
                : `$${restaurant.deliveryFee.toFixed(2)} delivery`}
            </Text>
            <View style={styles.dot} />
            <Text style={[styles.metaText, { color: colors.mutedForeground }]}>
              ${restaurant.minOrder} min
            </Text>
          </View>
        </View>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 16,
    marginBottom: 12,
    borderWidth: 1,
    overflow: "hidden",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 8,
      },
      android: { elevation: 2 },
    }),
  },
  imageContainer: {
    position: "relative",
  },
  image: {
    width: "100%",
    height: 160,
    resizeMode: "cover",
  },
  badge: {
    position: "absolute",
    top: 10,
    left: 10,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  freeBadge: {
    position: "absolute",
    top: 10,
    right: 10,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: "600" as const,
    fontFamily: "Inter_600SemiBold",
  },
  info: {
    padding: 14,
    gap: 4,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  name: {
    fontSize: 16,
    fontWeight: "600" as const,
    fontFamily: "Inter_600SemiBold",
    flex: 1,
    marginRight: 8,
  },
  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
  },
  rating: {
    fontSize: 13,
    fontWeight: "600" as const,
    fontFamily: "Inter_600SemiBold",
  },
  reviews: {
    fontSize: 12,
    fontFamily: "Inter_400Regular",
  },
  cuisine: {
    fontSize: 13,
    fontFamily: "Inter_400Regular",
  },
  meta: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 2,
    flexWrap: "wrap",
    gap: 4,
  },
  metaItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
  },
  metaText: {
    fontSize: 12,
    fontFamily: "Inter_400Regular",
  },
  dot: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: "#ccc",
  },
});
