import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Dimensions,
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
  ViewToken,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";

import { Restaurant } from "@/data/restaurants";
import { useColors } from "@/hooks/useColors";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const HERO_HEIGHT = 360;

interface Props {
  restaurants: Restaurant[];
}

function HeroSlide({ restaurant }: { restaurant: Restaurant }) {
  const colors = useColors();
  const router = useRouter();

  return (
    <View style={styles.slide}>
      <Image source={restaurant.image} style={styles.heroImage} />
      <LinearGradient
        colors={["transparent", "rgba(0,0,0,0.3)", "rgba(0,0,0,0.88)"]}
        style={StyleSheet.absoluteFill}
        locations={[0.2, 0.55, 1]}
      />
      <View style={styles.slideContent}>
        <View style={styles.badgeRow}>
          <View style={[styles.trendingBadge, { backgroundColor: colors.primary }]}>
            <Feather name="trending-up" size={11} color="#fff" />
            <Text style={styles.trendingText}>Trending</Text>
          </View>
          <View style={[styles.ratingBadge, { backgroundColor: "rgba(255,255,255,0.15)" }]}>
            <Feather name="star" size={11} color="#FFD700" />
            <Text style={styles.ratingText}>{restaurant.rating}</Text>
          </View>
        </View>
        <Text style={styles.heroName}>{restaurant.name}</Text>
        {restaurant.tagline && (
          <Text style={styles.heroTagline} numberOfLines={1}>
            {restaurant.tagline}
          </Text>
        )}
        <View style={styles.heroMeta}>
          <Feather name="clock" size={13} color="rgba(255,255,255,0.75)" />
          <Text style={styles.heroMetaText}>{restaurant.deliveryTime} min</Text>
          <View style={styles.heroDot} />
          <Text style={styles.heroMetaText}>
            {restaurant.deliveryFee === 0
              ? "Free delivery"
              : `$${restaurant.deliveryFee.toFixed(2)} delivery`}
          </Text>
        </View>
        <Pressable
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            router.push(`/restaurant/${restaurant.id}` as any);
          }}
          style={({ pressed }) => [
            styles.orderNowBtn,
            { backgroundColor: colors.primary, opacity: pressed ? 0.85 : 1 },
          ]}
        >
          <Text style={styles.orderNowText}>Order Now</Text>
          <Feather name="arrow-right" size={16} color="#fff" />
        </Pressable>
      </View>
    </View>
  );
}

export function HeroCarousel({ restaurants }: Props) {
  const [activeIndex, setActiveIndex] = useState(0);
  const listRef = useRef<FlatList>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setActiveIndex((prev) => {
        const next = (prev + 1) % restaurants.length;
        listRef.current?.scrollToIndex({ index: next, animated: true });
        return next;
      });
    }, 4000);
  }, [restaurants.length]);

  useEffect(() => {
    startTimer();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [startTimer]);

  const onViewableItemsChanged = useRef(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      if (viewableItems.length > 0 && viewableItems[0].index != null) {
        setActiveIndex(viewableItems[0].index);
      }
    }
  ).current;

  const viewabilityConfig = useRef({ viewAreaCoveragePercentThreshold: 50 }).current;

  return (
    <View style={styles.container}>
      <FlatList
        ref={listRef}
        data={restaurants}
        keyExtractor={(r) => r.id}
        renderItem={({ item }) => <HeroSlide restaurant={item} />}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
        scrollEventThrottle={16}
        onScrollBeginDrag={() => {
          if (timerRef.current) clearInterval(timerRef.current);
        }}
        onScrollEndDrag={startTimer}
        getItemLayout={(_, index) => ({
          length: SCREEN_WIDTH,
          offset: SCREEN_WIDTH * index,
          index,
        })}
      />
      <View style={styles.dots}>
        {restaurants.map((_, i) => (
          <View
            key={i}
            style={[
              styles.dot,
              {
                backgroundColor: i === activeIndex ? "#fff" : "rgba(255,255,255,0.4)",
                width: i === activeIndex ? 20 : 6,
              },
            ]}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: HERO_HEIGHT,
    position: "relative",
  },
  slide: {
    width: SCREEN_WIDTH,
    height: HERO_HEIGHT,
    position: "relative",
  },
  heroImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  slideContent: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    paddingBottom: 32,
    gap: 6,
  },
  badgeRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 4,
  },
  trendingBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 100,
  },
  trendingText: {
    color: "#fff",
    fontSize: 11,
    fontWeight: "700" as const,
    fontFamily: "Inter_700Bold",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  ratingBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 100,
  },
  ratingText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600" as const,
    fontFamily: "Inter_600SemiBold",
  },
  heroName: {
    color: "#fff",
    fontSize: 30,
    fontWeight: "700" as const,
    fontFamily: "Inter_700Bold",
    lineHeight: 34,
  },
  heroTagline: {
    color: "rgba(255,255,255,0.78)",
    fontSize: 14,
    fontFamily: "Inter_400Regular",
  },
  heroMeta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  heroMetaText: {
    color: "rgba(255,255,255,0.75)",
    fontSize: 13,
    fontFamily: "Inter_400Regular",
  },
  heroDot: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: "rgba(255,255,255,0.4)",
  },
  orderNowBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
    alignSelf: "flex-start",
    marginTop: 4,
  },
  orderNowText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "700" as const,
    fontFamily: "Inter_700Bold",
  },
  dots: {
    position: "absolute",
    bottom: 12,
    right: 20,
    flexDirection: "row",
    gap: 4,
    alignItems: "center",
  },
  dot: {
    height: 6,
    borderRadius: 3,
    backgroundColor: "#fff",
  },
});
