import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Dimensions,
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { MenuItem } from "@/data/menu";
import { useColors } from "@/hooks/useColors";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const CARD_WIDTH = (SCREEN_WIDTH - 48) / 2.3;

interface DealItem extends MenuItem {
  restaurantId: string;
  restaurantName: string;
}

interface Props {
  items: DealItem[];
}

function CountdownTimer() {
  const colors = useColors();
  const [secs, setSecs] = useState(3 * 3600 + 47 * 60 + 22);

  useEffect(() => {
    const id = setInterval(() => setSecs((s) => (s > 0 ? s - 1 : 0)), 1000);
    return () => clearInterval(id);
  }, []);

  const h = String(Math.floor(secs / 3600)).padStart(2, "0");
  const m = String(Math.floor((secs % 3600) / 60)).padStart(2, "0");
  const s = String(secs % 60).padStart(2, "0");

  return (
    <View style={styles.timerRow}>
      {[h, m, s].map((val, i) => (
        <React.Fragment key={i}>
          <View
            style={[
              styles.timerBlock,
              { backgroundColor: colors.primary, borderRadius: 6 },
            ]}
          >
            <Text style={[styles.timerVal, { color: colors.primaryForeground }]}>
              {val}
            </Text>
          </View>
          {i < 2 && (
            <Text style={[styles.timerColon, { color: colors.primary }]}>:</Text>
          )}
        </React.Fragment>
      ))}
    </View>
  );
}

function DealCard({ item }: { item: DealItem }) {
  const colors = useColors();
  const router = useRouter();
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
        styles.dealCard,
        {
          backgroundColor: colors.card,
          borderRadius: colors.radius,
          borderColor: colors.border,
          opacity: pressed ? 0.92 : 1,
        },
      ]}
    >
      {item.image ? (
        <Image
          source={{ uri: item.image }}
          style={[
            styles.dealImage,
            {
              borderTopLeftRadius: colors.radius,
              borderTopRightRadius: colors.radius,
            },
          ]}
        />
      ) : (
        <View
          style={[
            styles.dealImagePlaceholder,
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
        <View
          style={[
            styles.discountBadge,
            { backgroundColor: colors.primary },
          ]}
        >
          <Text style={styles.discountText}>{discountPct}% OFF</Text>
        </View>
      )}
      <View style={styles.dealInfo}>
        <Text style={[styles.dealName, { color: colors.foreground }]} numberOfLines={1}>
          {item.name}
        </Text>
        <Text
          style={[styles.dealRestaurant, { color: colors.mutedForeground }]}
          numberOfLines={1}
        >
          {item.restaurantName}
        </Text>
        <View style={styles.priceRow}>
          <Text style={[styles.dealPrice, { color: colors.primary }]}>
            GH₵{item.price.toFixed(2)}
          </Text>
          {item.originalPrice && (
            <Text style={[styles.originalPrice, { color: colors.mutedForeground }]}>
              GH₵{item.originalPrice.toFixed(2)}
            </Text>
          )}
        </View>
      </View>
    </Pressable>
  );
}

export function FlashDeals({ items }: Props) {
  const colors = useColors();

  return (
    <View style={styles.section}>
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <Feather name="zap" size={18} color={colors.primary} />
          <Text style={[styles.title, { color: colors.foreground }]}>Flash Deals</Text>
        </View>
        <CountdownTimer />
      </View>
      <FlatList
        data={items}
        keyExtractor={(i) => i.id}
        renderItem={({ item }) => <DealCard item={item} />}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        ItemSeparatorComponent={() => <View style={{ width: 10 }} />}
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
    justifyContent: "space-between",
    paddingHorizontal: 16,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  title: {
    fontSize: 18,
    fontWeight: "700" as const,
    fontFamily: "Inter_700Bold",
  },
  timerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
  },
  timerBlock: {
    paddingHorizontal: 7,
    paddingVertical: 4,
  },
  timerVal: {
    fontSize: 13,
    fontWeight: "700" as const,
    fontFamily: "Inter_700Bold",
    letterSpacing: 1,
  },
  timerColon: {
    fontSize: 14,
    fontWeight: "700" as const,
    fontFamily: "Inter_700Bold",
  },
  listContent: {
    paddingHorizontal: 16,
  },
  dealCard: {
    width: CARD_WIDTH,
    borderWidth: 1,
    overflow: "hidden",
  },
  dealImage: {
    width: "100%",
    height: 110,
    resizeMode: "cover",
  },
  dealImagePlaceholder: {
    width: "100%",
    height: 110,
    alignItems: "center",
    justifyContent: "center",
  },
  discountBadge: {
    position: "absolute",
    top: 8,
    left: 8,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  discountText: {
    color: "#fff",
    fontSize: 11,
    fontWeight: "700" as const,
    fontFamily: "Inter_700Bold",
  },
  dealInfo: {
    padding: 10,
    gap: 3,
  },
  dealName: {
    fontSize: 13,
    fontWeight: "600" as const,
    fontFamily: "Inter_600SemiBold",
  },
  dealRestaurant: {
    fontSize: 11,
    fontFamily: "Inter_400Regular",
  },
  priceRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 2,
  },
  dealPrice: {
    fontSize: 15,
    fontWeight: "700" as const,
    fontFamily: "Inter_700Bold",
  },
  originalPrice: {
    fontSize: 12,
    fontFamily: "Inter_400Regular",
    textDecorationLine: "line-through",
  },
});
