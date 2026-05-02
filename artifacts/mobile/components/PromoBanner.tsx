import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
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

import { PromoSlide } from "@/data/menu";
import { useColors } from "@/hooks/useColors";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const BANNER_HEIGHT = 220;

function Slide({ slide }: { slide: PromoSlide }) {
  const colors = useColors();

  return (
    <View style={styles.slide}>
      <Image source={{ uri: slide.imageUri }} style={styles.image} />
      <View style={StyleSheet.absoluteFillObject} pointerEvents="none">
        <View style={styles.darkOverlay} />
      </View>
      <View style={styles.content}>
        <View
          style={[
            styles.tag,
            { backgroundColor: colors.primary, borderRadius: 100 },
          ]}
        >
          <Text style={styles.tagText}>{slide.tag}</Text>
        </View>
        <Text style={styles.title}>{slide.title}</Text>
        <Text style={styles.subtitle}>{slide.subtitle}</Text>
        <Pressable
          onPress={() =>
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
          }
          style={[
            styles.ctaBtn,
            { backgroundColor: "rgba(255,255,255,0.2)", borderRadius: 10 },
          ]}
        >
          <Text style={styles.ctaText}>{slide.cta}</Text>
          <Feather name="arrow-right" size={14} color="#fff" />
        </Pressable>
      </View>
    </View>
  );
}

export function PromoBanner({ slides }: { slides: PromoSlide[] }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const listRef = useRef<FlatList>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setActiveIndex((prev) => {
        const next = (prev + 1) % slides.length;
        listRef.current?.scrollToIndex({ index: next, animated: true });
        return next;
      });
    }, 3500);
  }, [slides.length]);

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

  const viewabilityConfig = useRef({
    viewAreaCoveragePercentThreshold: 50,
  }).current;

  return (
    <View style={styles.container}>
      <FlatList
        ref={listRef}
        data={slides}
        keyExtractor={(s) => s.id}
        renderItem={({ item }) => <Slide slide={item} />}
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
        getItemLayout={(_, i) => ({
          length: SCREEN_WIDTH,
          offset: SCREEN_WIDTH * i,
          index: i,
        })}
      />
      <View style={styles.dots}>
        {slides.map((_, i) => (
          <View
            key={i}
            style={[
              styles.dot,
              {
                backgroundColor:
                  i === activeIndex ? "#fff" : "rgba(255,255,255,0.4)",
                width: i === activeIndex ? 18 : 6,
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
    height: BANNER_HEIGHT,
    position: "relative",
  },
  slide: {
    width: SCREEN_WIDTH,
    height: BANNER_HEIGHT,
    position: "relative",
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  darkOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.52)",
  },
  content: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    gap: 5,
  },
  tag: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    alignSelf: "flex-start",
    marginBottom: 2,
  },
  tagText: {
    color: "#fff",
    fontSize: 11,
    fontWeight: "700" as const,
    fontFamily: "Inter_700Bold",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  title: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "700" as const,
    fontFamily: "Inter_700Bold",
    lineHeight: 28,
  },
  subtitle: {
    color: "rgba(255,255,255,0.8)",
    fontSize: 13,
    fontFamily: "Inter_400Regular",
  },
  ctaBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 8,
    alignSelf: "flex-start",
    marginTop: 4,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.35)",
  },
  ctaText: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "600" as const,
    fontFamily: "Inter_600SemiBold",
  },
  dots: {
    position: "absolute",
    bottom: 14,
    right: 16,
    flexDirection: "row",
    gap: 4,
    alignItems: "center",
  },
  dot: {
    height: 6,
    borderRadius: 3,
  },
});
