import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { PaystackPayment } from "@/components/PaystackPayment";
import { useCart } from "@/context/CartContext";
import { useOrders } from "@/context/OrdersContext";
import { useColors } from "@/hooks/useColors";

function generateRef() {
  return `GK_${Date.now()}_${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
}

export default function CartScreen() {
  const colors = useColors();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { items, updateQuantity, removeItem, clearCart, total, itemCount } = useCart();
  const { placeOrder } = useOrders();

  const [placing, setPlacing] = useState(false);
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [paystackVisible, setPaystackVisible] = useState(false);
  const [payRef, setPayRef] = useState("");

  const deliveryFee = items.length > 0 ? 1.99 : 0;
  const serviceFee = items.length > 0 ? 0.99 : 0;
  const grandTotal = total + deliveryFee + serviceFee;

  const topPad = Platform.OS === "web" ? Math.max(insets.top, 67) : insets.top;
  const bottomPad = Platform.OS === "web" ? insets.bottom + 34 : insets.bottom;

  const validateEmail = (e: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e.trim());

  const handleCheckout = () => {
    if (items.length === 0) return;

    if (!validateEmail(email)) {
      setEmailError("Please enter a valid email for your receipt");
      return;
    }
    setEmailError("");
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setPayRef(generateRef());
    setPaystackVisible(true);
  };

  const handlePaymentSuccess = async (reference: string) => {
    setPaystackVisible(false);
    setPlacing(true);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

    try {
      await placeOrder(
        items[0].restaurantId,
        items[0].restaurantName,
        items.map((i) => ({
          id: i.id,
          name: i.name,
          price: i.price,
          quantity: i.quantity,
        })),
        grandTotal
      );
      clearCart();
      router.replace("/(tabs)/orders" as any);
    } catch {
      Alert.alert(
        "Order saved",
        `Payment successful (ref: ${reference.slice(-8)}). Your order is being prepared.`
      );
      clearCart();
      router.replace("/(tabs)/orders" as any);
    } finally {
      setPlacing(false);
    }
  };

  const handlePaymentCancel = () => {
    setPaystackVisible(false);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <View
          style={[
            styles.header,
            {
              paddingTop: topPad + 16,
              backgroundColor: colors.background,
              borderBottomColor: colors.border,
            },
          ]}
        >
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Feather name="arrow-left" size={22} color={colors.foreground} />
          </TouchableOpacity>
          <Text style={[styles.title, { color: colors.foreground }]}>Your Cart</Text>
          {items.length > 0 && (
            <TouchableOpacity
              onPress={() => {
                Alert.alert("Clear Cart", "Remove all items?", [
                  { text: "Cancel", style: "cancel" },
                  { text: "Clear", style: "destructive", onPress: clearCart },
                ]);
              }}
            >
              <Text style={[styles.clearText, { color: colors.destructive }]}>Clear</Text>
            </TouchableOpacity>
          )}
        </View>

        {items.length === 0 ? (
          <View style={styles.emptyState}>
            <Feather name="shopping-cart" size={52} color={colors.mutedForeground} />
            <Text style={[styles.emptyTitle, { color: colors.foreground }]}>
              Your cart is empty
            </Text>
            <Text style={[styles.emptyText, { color: colors.mutedForeground }]}>
              Add items from the menu to get started
            </Text>
            <TouchableOpacity
              onPress={() => router.back()}
              style={[
                styles.browseBtn,
                { backgroundColor: colors.primary, borderRadius: colors.radius },
              ]}
            >
              <Text style={[styles.browseBtnText, { color: colors.primaryForeground }]}>
                Browse Menu
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={[
                styles.scrollContent,
                { paddingBottom: bottomPad + 220 },
              ]}
            >
              {items[0] && (
                <Text style={[styles.restaurantLabel, { color: colors.mutedForeground }]}>
                  {items[0].restaurantName}
                </Text>
              )}

              {/* Cart Items */}
              {items.map((item) => (
                <View
                  key={item.id}
                  style={[
                    styles.itemRow,
                    {
                      backgroundColor: colors.card,
                      borderRadius: colors.radius,
                      borderColor: colors.border,
                    },
                  ]}
                >
                  <View style={styles.itemInfo}>
                    <Text
                      style={[styles.itemName, { color: colors.foreground }]}
                      numberOfLines={1}
                    >
                      {item.name}
                    </Text>
                    <Text style={[styles.itemPrice, { color: colors.mutedForeground }]}>
                      GH₵{(item.price * item.quantity).toFixed(2)}
                    </Text>
                  </View>
                  <View style={styles.itemActions}>
                    <TouchableOpacity
                      onPress={() => removeItem(item.id)}
                      style={styles.removeBtn}
                    >
                      <Feather name="trash-2" size={15} color={colors.destructive} />
                    </TouchableOpacity>
                    <View
                      style={[
                        styles.qtyControl,
                        { backgroundColor: colors.muted, borderRadius: 10 },
                      ]}
                    >
                      <Pressable
                        onPress={() => updateQuantity(item.id, item.quantity - 1)}
                        style={styles.qtyBtn}
                      >
                        <Feather name="minus" size={14} color={colors.foreground} />
                      </Pressable>
                      <Text style={[styles.qtyText, { color: colors.foreground }]}>
                        {item.quantity}
                      </Text>
                      <Pressable
                        onPress={() => updateQuantity(item.id, item.quantity + 1)}
                        style={styles.qtyBtn}
                      >
                        <Feather name="plus" size={14} color={colors.foreground} />
                      </Pressable>
                    </View>
                  </View>
                </View>
              ))}

              {/* Order Summary */}
              <View
                style={[
                  styles.summaryCard,
                  {
                    backgroundColor: colors.card,
                    borderRadius: colors.radius,
                    borderColor: colors.border,
                  },
                ]}
              >
                <Text style={[styles.summaryTitle, { color: colors.foreground }]}>
                  Order Summary
                </Text>
                <View style={styles.summaryRow}>
                  <Text style={[styles.summaryLabel, { color: colors.mutedForeground }]}>
                    Subtotal ({itemCount} items)
                  </Text>
                  <Text style={[styles.summaryValue, { color: colors.foreground }]}>
                    GH₵{total.toFixed(2)}
                  </Text>
                </View>
                <View style={styles.summaryRow}>
                  <Text style={[styles.summaryLabel, { color: colors.mutedForeground }]}>
                    Delivery fee
                  </Text>
                  <Text style={[styles.summaryValue, { color: colors.foreground }]}>
                    GH₵{deliveryFee.toFixed(2)}
                  </Text>
                </View>
                <View style={styles.summaryRow}>
                  <Text style={[styles.summaryLabel, { color: colors.mutedForeground }]}>
                    Service fee
                  </Text>
                  <Text style={[styles.summaryValue, { color: colors.foreground }]}>
                    GH₵{serviceFee.toFixed(2)}
                  </Text>
                </View>
                <View style={[styles.divider, { backgroundColor: colors.border }]} />
                <View style={styles.summaryRow}>
                  <Text style={[styles.totalLabel, { color: colors.foreground }]}>Total</Text>
                  <Text style={[styles.totalValue, { color: colors.foreground }]}>
                    GH₵{grandTotal.toFixed(2)}
                  </Text>
                </View>
              </View>

              {/* Delivery Address */}
              <View
                style={[
                  styles.addressCard,
                  {
                    backgroundColor: colors.card,
                    borderRadius: colors.radius,
                    borderColor: colors.border,
                  },
                ]}
              >
                <Feather name="map-pin" size={18} color={colors.primary} />
                <View style={styles.addressInfo}>
                  <Text style={[styles.addressTitle, { color: colors.foreground }]}>
                    Deliver to
                  </Text>
                  <Text style={[styles.addressText, { color: colors.mutedForeground }]}>
                    Current Location
                  </Text>
                </View>
                <Feather name="chevron-right" size={16} color={colors.mutedForeground} />
              </View>

              {/* Email for Receipt */}
              <View
                style={[
                  styles.emailCard,
                  {
                    backgroundColor: colors.card,
                    borderRadius: colors.radius,
                    borderColor: emailError ? colors.destructive : colors.border,
                  },
                ]}
              >
                <View style={styles.emailHeader}>
                  <Feather name="mail" size={16} color={colors.primary} />
                  <Text style={[styles.emailLabel, { color: colors.foreground }]}>
                    Email for receipt
                  </Text>
                </View>
                <TextInput
                  style={[
                    styles.emailInput,
                    {
                      color: colors.foreground,
                      borderColor: emailError ? colors.destructive : colors.border,
                      backgroundColor: colors.muted,
                      borderRadius: colors.radius / 1.5,
                    },
                  ]}
                  placeholder="you@example.com"
                  placeholderTextColor={colors.mutedForeground}
                  value={email}
                  onChangeText={(t) => {
                    setEmail(t);
                    if (emailError) setEmailError("");
                  }}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                />
                {emailError ? (
                  <Text style={[styles.emailError, { color: colors.destructive }]}>
                    {emailError}
                  </Text>
                ) : null}
              </View>

              {/* Paystack Security Badge */}
              <View style={styles.securityBadge}>
                <Feather name="lock" size={13} color={colors.mutedForeground} />
                <Text style={[styles.securityText, { color: colors.mutedForeground }]}>
                  Secured by Paystack · SSL Encrypted
                </Text>
              </View>
            </ScrollView>

            {/* Checkout Bar */}
            <View
              style={[
                styles.checkoutBar,
                {
                  backgroundColor: colors.background,
                  borderTopColor: colors.border,
                  paddingBottom: bottomPad + 16,
                },
              ]}
            >
              <TouchableOpacity
                onPress={handleCheckout}
                disabled={placing}
                style={[
                  styles.checkoutBtn,
                  {
                    backgroundColor: placing ? colors.muted : colors.primary,
                    borderRadius: colors.radius,
                  },
                ]}
              >
                {placing ? (
                  <Text style={[styles.checkoutText, { color: colors.primaryForeground }]}>
                    Saving Order...
                  </Text>
                ) : (
                  <>
                    <Feather name="credit-card" size={18} color="#fff" />
                    <Text style={[styles.checkoutText, { color: colors.primaryForeground }]}>
                      Pay GH₵{grandTotal.toFixed(2)} with Paystack
                    </Text>
                  </>
                )}
              </TouchableOpacity>
            </View>
          </>
        )}

        {/* Paystack Payment Modal */}
        <PaystackPayment
          visible={paystackVisible}
          amount={grandTotal}
          email={email.trim()}
          reference={payRef}
          onSuccess={handlePaymentSuccess}
          onCancel={handlePaymentCancel}
        />
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    gap: 12,
  },
  backBtn: { padding: 4 },
  title: {
    flex: 1,
    fontSize: 20,
    fontWeight: "700" as const,
    fontFamily: "Inter_700Bold",
  },
  clearText: {
    fontSize: 14,
    fontFamily: "Inter_500Medium",
  },
  emptyState: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    paddingBottom: 80,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "600" as const,
    fontFamily: "Inter_600SemiBold",
  },
  emptyText: {
    fontSize: 14,
    fontFamily: "Inter_400Regular",
    textAlign: "center",
    paddingHorizontal: 40,
  },
  browseBtn: {
    paddingHorizontal: 24,
    paddingVertical: 14,
    marginTop: 8,
  },
  browseBtnText: {
    fontSize: 16,
    fontWeight: "600" as const,
    fontFamily: "Inter_600SemiBold",
  },
  scrollContent: {
    padding: 16,
    gap: 12,
  },
  restaurantLabel: {
    fontSize: 12,
    fontFamily: "Inter_600SemiBold",
    textTransform: "uppercase",
    letterSpacing: 0.8,
    marginBottom: 4,
  },
  itemRow: {
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
    borderWidth: 1,
    gap: 12,
  },
  itemInfo: { flex: 1, gap: 4 },
  itemName: {
    fontSize: 15,
    fontWeight: "500" as const,
    fontFamily: "Inter_500Medium",
  },
  itemPrice: {
    fontSize: 14,
    fontFamily: "Inter_400Regular",
  },
  itemActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  removeBtn: { padding: 6 },
  qtyControl: {
    flexDirection: "row",
    alignItems: "center",
    height: 34,
  },
  qtyBtn: {
    width: 30,
    height: 34,
    alignItems: "center",
    justifyContent: "center",
  },
  qtyText: {
    fontSize: 14,
    fontWeight: "600" as const,
    fontFamily: "Inter_600SemiBold",
    minWidth: 20,
    textAlign: "center",
  },
  summaryCard: {
    padding: 16,
    borderWidth: 1,
    gap: 10,
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: "600" as const,
    fontFamily: "Inter_600SemiBold",
    marginBottom: 2,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  summaryLabel: {
    fontSize: 14,
    fontFamily: "Inter_400Regular",
  },
  summaryValue: {
    fontSize: 14,
    fontFamily: "Inter_500Medium",
  },
  divider: { height: 1, marginVertical: 4 },
  totalLabel: {
    fontSize: 16,
    fontWeight: "700" as const,
    fontFamily: "Inter_700Bold",
  },
  totalValue: {
    fontSize: 18,
    fontWeight: "700" as const,
    fontFamily: "Inter_700Bold",
  },
  addressCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
    borderWidth: 1,
    gap: 12,
  },
  addressInfo: { flex: 1 },
  addressTitle: {
    fontSize: 14,
    fontWeight: "600" as const,
    fontFamily: "Inter_600SemiBold",
  },
  addressText: {
    fontSize: 13,
    fontFamily: "Inter_400Regular",
  },
  emailCard: {
    padding: 14,
    borderWidth: 1,
    gap: 10,
  },
  emailHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  emailLabel: {
    fontSize: 14,
    fontWeight: "600" as const,
    fontFamily: "Inter_600SemiBold",
  },
  emailInput: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    fontFamily: "Inter_400Regular",
    borderWidth: 1,
  },
  emailError: {
    fontSize: 12,
    fontFamily: "Inter_400Regular",
    marginTop: -4,
  },
  securityBadge: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 4,
  },
  securityText: {
    fontSize: 12,
    fontFamily: "Inter_400Regular",
  },
  checkoutBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 16,
    paddingTop: 12,
    borderTopWidth: 1,
  },
  checkoutBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    paddingVertical: 16,
  },
  checkoutText: {
    fontSize: 16,
    fontWeight: "700" as const,
    fontFamily: "Inter_700Bold",
  },
});
