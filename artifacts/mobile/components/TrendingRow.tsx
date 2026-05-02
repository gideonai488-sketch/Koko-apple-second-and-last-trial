import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import React from "react";
import {
  Dimensions,
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { Restaurant } from "@/data/restaurants";
import { useColors } from "@/hooks/useColors";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const CARD_WIDTH = SCREEN_WIDTH * 0.6;

function TrendingRestaurantCard({ restaurant }: { restaurant: Restaurant }) {
  const colors = useColors();
  const router = useRouter();

  return (
    <Pressable
      onPress={() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        router.push(`/restaurant/${restaurant.id}` as any);
      }}
      style={({ pressed }) => [
        styles.card,
        {
          backgroundColor: colors.card,
          borderRadius: colors.radius,
          width: CARD_WIDTH,
          opacity: pressed ? 0.92 : 1,
        },
      ]}
    >
      <View style={[styles.imageWrapper, { borderRadius: colors.radius }]}>
        <Image source={restaurant.image} style={styles.image} />
        <View style={[styles.gradientOverlay, { borderRadius: colors.radius }]} />
        <View style={styles.infoOverlay}>
          <Text style={styles.restaurantName}>{restaurant.name}</Text>
          <View style={styles.metaRow}>
            <Feather name="star" size={12} color="#FFD700" />
            <Text style={styles.metaText}>{restaurant.rating}</Text>
            <View style={styles.dot} />
            <Text style={styles.metaText}>{restaurant.deliveryTime} min</Text>
          </View>
        </View>
        <View
          style={[
            styles.cuisineBadge,
            { backgroundColor: "rgba(0,0,0,0.45)", borderRadius: 100 },
          ]}
        >
          <Text style={styles.cuisineText}>{restaurant.cuisine}</Text>
        </View>
      </View>
    </Pressable>
  );
}

interface Props {
  restaurants: Restaurant[];
  title: string;
  icon?: string;
}

export function TrendingRow({ restaurants, title, icon = "trending-up" }: Props) {
  const colors = useColors();

  return (
    <View style={styles.section}>
      <View style={styles.header}>
        <Feather name={icon as any} size={18} color={colors.primary} />
        <Text style={[styles.title, { color: colors.foreground }]}>{title}</Text>
      </View>
      <FlatList
        data={restaurants}
        keyExtractor={(r) => r.id}
        renderItem={({ item }) => <TrendingRestaurantCard restaurant={item} />}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        ItemSeparatorComponent={() => <View style={{ width: 12 }} />}
      />
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
  listContent: {
    paddingHorizontal: 16,
  },
  card: {
    overflow: "hidden",
  },
  imageWrapper: {
    position: "relative",
    height: 180,
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  gradientOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "transparent",
  },
  infoOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 12,
    gap: 3,
    backgroundColor: "rgba(0,0,0,0.35)",
  },
  restaurantName: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "700" as const,
    fontFamily: "Inter_700Bold",
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  metaText: {
    color: "rgba(255,255,255,0.85)",
    fontSize: 12,
    fontFamily: "Inter_400Regular",
  },
  dot: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: "rgba(255,255,255,0.5)",
  },
  cuisineBadge: {
    position: "absolute",
    top: 10,
    right: 10,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  cuisineText: {
    color: "#fff",
    fontSize: 11,
    fontWeight: "600" as const,
    fontFamily: "Inter_600SemiBold",
  },
});
