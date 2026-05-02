import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import React, { useRef } from "react";
import {
  Animated,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { useCart } from "@/context/CartContext";
import { MenuItem } from "@/data/restaurants";
import { useColors } from "@/hooks/useColors";

interface Props {
  item: MenuItem;
  restaurantId: string;
  restaurantName: string;
}

export function MenuItemCard({ item, restaurantId, restaurantName }: Props) {
  const colors = useColors();
  const { items, addItem, updateQuantity } = useCart();
  const scale = useRef(new Animated.Value(1)).current;

  const cartItem = items.find((i) => i.id === item.id);
  const quantity = cartItem?.quantity ?? 0;

  const handleAdd = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    Animated.sequence([
      Animated.timing(scale, {
        toValue: 0.93,
        duration: 80,
        useNativeDriver: true,
      }),
      Animated.spring(scale, {
        toValue: 1,
        useNativeDriver: true,
        speed: 20,
      }),
    ]).start();
    addItem({
      id: item.id,
      restaurantId,
      restaurantName,
      name: item.name,
      price: item.price,
    });
  };

  const handleDecrement = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    updateQuantity(item.id, quantity - 1);
  };

  const handleIncrement = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    updateQuantity(item.id, quantity + 1);
  };

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: colors.card,
          borderRadius: colors.radius,
          borderColor: colors.border,
        },
      ]}
    >
      <View style={styles.content}>
        <View style={styles.textContent}>
          {item.popular && (
            <Text style={[styles.popularTag, { color: colors.primary }]}>
              Popular
            </Text>
          )}
          <Text
            style={[styles.name, { color: colors.foreground }]}
            numberOfLines={2}
          >
            {item.name}
          </Text>
          <Text
            style={[styles.description, { color: colors.mutedForeground }]}
            numberOfLines={2}
          >
            {item.description}
          </Text>
          <Text style={[styles.price, { color: colors.foreground }]}>
            ${item.price.toFixed(2)}
          </Text>
        </View>

        <View style={styles.actions}>
          {quantity === 0 ? (
            <Animated.View style={{ transform: [{ scale }] }}>
              <Pressable
                onPress={handleAdd}
                style={[
                  styles.addButton,
                  {
                    backgroundColor: colors.primary,
                    borderRadius: colors.radius / 1.5,
                  },
                ]}
              >
                <Feather name="plus" size={18} color={colors.primaryForeground} />
              </Pressable>
            </Animated.View>
          ) : (
            <View
              style={[
                styles.quantityControl,
                {
                  backgroundColor: colors.muted,
                  borderRadius: colors.radius / 1.5,
                },
              ]}
            >
              <Pressable onPress={handleDecrement} style={styles.qtyBtn}>
                <Feather name="minus" size={14} color={colors.foreground} />
              </Pressable>
              <Text style={[styles.quantityText, { color: colors.foreground }]}>
                {quantity}
              </Text>
              <Pressable onPress={handleIncrement} style={styles.qtyBtn}>
                <Feather name="plus" size={14} color={colors.foreground} />
              </Pressable>
            </View>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    marginBottom: 8,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.04,
        shadowRadius: 4,
      },
      android: { elevation: 1 },
    }),
  },
  content: {
    flexDirection: "row",
    padding: 14,
    gap: 12,
    alignItems: "flex-end",
  },
  textContent: {
    flex: 1,
    gap: 4,
  },
  popularTag: {
    fontSize: 11,
    fontWeight: "600" as const,
    fontFamily: "Inter_600SemiBold",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  name: {
    fontSize: 15,
    fontWeight: "600" as const,
    fontFamily: "Inter_600SemiBold",
    lineHeight: 20,
  },
  description: {
    fontSize: 12,
    fontFamily: "Inter_400Regular",
    lineHeight: 16,
  },
  price: {
    fontSize: 15,
    fontWeight: "600" as const,
    fontFamily: "Inter_600SemiBold",
    marginTop: 2,
  },
  actions: {
    alignItems: "center",
    justifyContent: "flex-end",
  },
  addButton: {
    width: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
  },
  quantityControl: {
    flexDirection: "row",
    alignItems: "center",
    height: 36,
  },
  qtyBtn: {
    width: 32,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
  },
  quantityText: {
    fontSize: 14,
    fontWeight: "600" as const,
    fontFamily: "Inter_600SemiBold",
    minWidth: 20,
    textAlign: "center",
  },
});
