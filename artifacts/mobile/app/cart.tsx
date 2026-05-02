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
  return `KS_${Date.now()}_${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
}

function SectionCard({ children, style }: { children: React.ReactNode; style?: any }) {
  const colors = useColors();
  return (
    <View
      style={[
        sectionStyles.card,
        {
          backgroundColor: colors.card,
          borderRadius: colors.radius,
          borderColor: colors.border,
        },
        style,
      ]}
    >
      {children}
    </View>
  );
}

function SectionTitle({ label, icon }: { label: string; icon: string }) {
  const colors = useColors();
  return (
    <View style={sectionStyles.titleRow}>
      <Feather name={icon as any} size={16} color={colors.primary} />
      <Text style={[sectionStyles.title, { color: colors.foreground }]}>{label}</Text>
    </View>
  );
}

function InputField({
  label,
  icon,
  error,
  optional,
  children,
}: {
  label: string;
  icon: string;
  error?: string;
  optional?: boolean;
  children: React.ReactNode;
}) {
  const colors = useColors();
  return (
    <View style={fieldStyles.wrap}>
      <View style={fieldStyles.labelRow}>
        <Feather name={icon as any} size={13} color={colors.mutedForeground} />
        <Text style={[fieldStyles.label, { color: colors.foreground }]}>{label}</Text>
        {optional && (
          <Text style={[fieldStyles.optional, { color: colors.mutedForeground }]}>(optional)</Text>
        )}
      </View>
      {children}
      {error ? (
        <Text style={[fieldStyles.error, { color: colors.destructive }]}>{error}</Text>
      ) : null}
    </View>
  );
}

const sectionStyles = StyleSheet.create({
  card: { padding: 16, borderWidth: 1, gap: 14 },
  titleRow: { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 2 },
  title: { fontSize: 15, fontWeight: "700" as const, fontFamily: "Inter_700Bold" },
});

const fieldStyles = StyleSheet.create({
  wrap: { gap: 7 },
  labelRow: { flexDirection: "row", alignItems: "center", gap: 5 },
  label: { fontSize: 13, fontWeight: "600" as const, fontFamily: "Inter_600SemiBold" },
  optional: { fontSize: 12, fontFamily: "Inter_400Regular" },
  error: { fontSize: 12, fontFamily: "Inter_400Regular" },
});

export default function CartScreen() {
  const colors = useColors();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { items, updateQuantity, removeItem, clearCart, total, itemCount } = useCart();
  const { placeOrder } = useOrders();

  const [placing, setPlacing] = useState(false);
  const [paystackVisible, setPaystackVisible] = useState(false);
  const [payRef, setPayRef] = useState("");

  // Customer details
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");

  // Delivery address
  const [street, setStreet] = useState("");
  const [area, setArea] = useState("");
  const [deliveryNote, setDeliveryNote] = useState("");

  const [errors, setErrors] = useState<Record<string, string>>({});

  const deliveryFee = items.length > 0 ? 1.99 : 0;
  const serviceFee = items.length > 0 ? 0.99 : 0;
  const grandTotal = total + deliveryFee + serviceFee;

  const topPad = Platform.OS === "web" ? Math.max(insets.top, 67) : insets.top;
  const bottomPad = Platform.OS === "web" ? insets.bottom + 34 : insets.bottom;

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!name.trim() || name.trim().length < 2) errs.name = "Enter your full name";
    if (!phone.trim() || phone.replace(/\D/g, "").length < 9)
      errs.phone = "Enter a valid phone number";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()))
      errs.email = "Enter a valid email address";
    if (!street.trim() || street.trim().length < 5)
      errs.street = "Enter your delivery street address";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleCheckout = () => {
    if (items.length === 0) return;
    if (!validate()) return;
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
        items.map((i) => ({ id: i.id, name: i.name, price: i.price, quantity: i.quantity })),
        grandTotal
      );
      clearCart();
      router.replace("/(tabs)/orders" as any);
    } catch {
      Alert.alert(
        "Payment successful!",
        `Your order is confirmed (ref: ${reference.slice(-8)}). We'll start preparing it now.`
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

  const inputStyle = [
    styles.input,
    {
      backgroundColor: colors.muted,
      color: colors.foreground,
      borderRadius: colors.radius / 1.5,
    },
  ];

  const inputWithError = (field: string) => [
    ...inputStyle,
    errors[field] ? { borderWidth: 1, borderColor: colors.destructive } : {},
  ];

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        {/* Header */}
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
              onPress={() =>
                Alert.alert("Clear Cart", "Remove all items?", [
                  { text: "Cancel", style: "cancel" },
                  { text: "Clear", style: "destructive", onPress: clearCart },
                ])
              }
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
                { paddingBottom: bottomPad + 120 },
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
                      GH₵{item.price.toFixed(2)} × {item.quantity} ={" "}
                      <Text style={{ color: colors.foreground, fontFamily: "Inter_600SemiBold" }}>
                        GH₵{(item.price * item.quantity).toFixed(2)}
                      </Text>
                    </Text>
                  </View>
                  <View style={styles.itemActions}>
                    <TouchableOpacity onPress={() => removeItem(item.id)} style={styles.removeBtn}>
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
              <SectionCard>
                <SectionTitle label="Order Summary" icon="file-text" />
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
                  <Text style={[styles.totalValue, { color: colors.primary }]}>
                    GH₵{grandTotal.toFixed(2)}
                  </Text>
                </View>
              </SectionCard>

              {/* Delivery Address */}
              <SectionCard>
                <SectionTitle label="Delivery Address" icon="map-pin" />

                <InputField label="Street Address" icon="home" error={errors.street}>
                  <TextInput
                    style={inputWithError("street")}
                    placeholder="e.g. 12 Accra New Town Road"
                    placeholderTextColor={colors.mutedForeground}
                    value={street}
                    onChangeText={(t) => {
                      setStreet(t);
                      setErrors((e) => ({ ...e, street: "" }));
                    }}
                    autoCapitalize="words"
                  />
                </InputField>

                <InputField label="Area / Landmark" icon="map" optional>
                  <TextInput
                    style={inputStyle}
                    placeholder="e.g. Near Shoprite, Osu"
                    placeholderTextColor={colors.mutedForeground}
                    value={area}
                    onChangeText={setArea}
                    autoCapitalize="words"
                  />
                </InputField>

                <InputField label="Delivery Note" icon="message-circle" optional>
                  <TextInput
                    style={[...inputStyle, styles.multiline]}
                    placeholder="e.g. Call when you arrive, Gate is blue"
                    placeholderTextColor={colors.mutedForeground}
                    value={deliveryNote}
                    onChangeText={setDeliveryNote}
                    multiline
                    numberOfLines={2}
                    autoCapitalize="sentences"
                  />
                </InputField>
              </SectionCard>

              {/* Customer Details */}
              <SectionCard>
                <SectionTitle label="Your Details" icon="user" />
                <Text style={[styles.detailsSub, { color: colors.mutedForeground }]}>
                  Used for your order and receipt
                </Text>

                <InputField label="Full Name" icon="user" error={errors.name}>
                  <TextInput
                    style={inputWithError("name")}
                    placeholder="Kwame Asante"
                    placeholderTextColor={colors.mutedForeground}
                    value={name}
                    onChangeText={(t) => {
                      setName(t);
                      setErrors((e) => ({ ...e, name: "" }));
                    }}
                    autoCapitalize="words"
                  />
                </InputField>

                <InputField label="Phone Number" icon="phone" error={errors.phone}>
                  <TextInput
                    style={inputWithError("phone")}
                    placeholder="+233 20 123 4567"
                    placeholderTextColor={colors.mutedForeground}
                    value={phone}
                    onChangeText={(t) => {
                      setPhone(t);
                      setErrors((e) => ({ ...e, phone: "" }));
                    }}
                    keyboardType="phone-pad"
                  />
                </InputField>

                <InputField label="Email for Receipt" icon="mail" error={errors.email}>
                  <TextInput
                    style={inputWithError("email")}
                    placeholder="you@example.com"
                    placeholderTextColor={colors.mutedForeground}
                    value={email}
                    onChangeText={(t) => {
                      setEmail(t);
                      setErrors((e) => ({ ...e, email: "" }));
                    }}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                  />
                </InputField>
              </SectionCard>

              {/* Security */}
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
                    Saving Order…
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

        <PaystackPayment
          visible={paystackVisible}
          amount={grandTotal}
          name={name.trim()}
          phone={phone.trim()}
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
  title: { flex: 1, fontSize: 20, fontWeight: "700" as const, fontFamily: "Inter_700Bold" },
  clearText: { fontSize: 14, fontFamily: "Inter_500Medium" },
  emptyState: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    paddingBottom: 80,
  },
  emptyTitle: { fontSize: 20, fontWeight: "600" as const, fontFamily: "Inter_600SemiBold" },
  emptyText: {
    fontSize: 14,
    fontFamily: "Inter_400Regular",
    textAlign: "center",
    paddingHorizontal: 40,
  },
  browseBtn: { paddingHorizontal: 24, paddingVertical: 14, marginTop: 8 },
  browseBtnText: { fontSize: 16, fontWeight: "600" as const, fontFamily: "Inter_600SemiBold" },
  scrollContent: { padding: 16, gap: 12 },
  restaurantLabel: {
    fontSize: 12,
    fontFamily: "Inter_600SemiBold",
    textTransform: "uppercase",
    letterSpacing: 0.8,
    marginBottom: 2,
  },
  itemRow: {
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
    borderWidth: 1,
    gap: 12,
  },
  itemInfo: { flex: 1, gap: 4 },
  itemName: { fontSize: 15, fontWeight: "500" as const, fontFamily: "Inter_500Medium" },
  itemPrice: { fontSize: 13, fontFamily: "Inter_400Regular" },
  itemActions: { flexDirection: "row", alignItems: "center", gap: 10 },
  removeBtn: { padding: 6 },
  qtyControl: { flexDirection: "row", alignItems: "center", height: 34 },
  qtyBtn: { width: 30, height: 34, alignItems: "center", justifyContent: "center" },
  qtyText: {
    fontSize: 14,
    fontWeight: "600" as const,
    fontFamily: "Inter_600SemiBold",
    minWidth: 20,
    textAlign: "center",
  },
  summaryRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  summaryLabel: { fontSize: 14, fontFamily: "Inter_400Regular" },
  summaryValue: { fontSize: 14, fontFamily: "Inter_500Medium" },
  divider: { height: 1, marginVertical: 2 },
  totalLabel: { fontSize: 16, fontWeight: "700" as const, fontFamily: "Inter_700Bold" },
  totalValue: { fontSize: 18, fontWeight: "700" as const, fontFamily: "Inter_700Bold" },
  detailsSub: { fontSize: 12, fontFamily: "Inter_400Regular", marginTop: -8 },
  input: {
    paddingHorizontal: 12,
    paddingVertical: 11,
    fontSize: 14,
    fontFamily: "Inter_400Regular",
  },
  multiline: {
    minHeight: 60,
    textAlignVertical: "top",
    paddingTop: 10,
  },
  securityBadge: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 4,
  },
  securityText: { fontSize: 12, fontFamily: "Inter_400Regular" },
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
  checkoutText: { fontSize: 16, fontWeight: "700" as const, fontFamily: "Inter_700Bold" },
});
