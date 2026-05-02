import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useColors } from "@/hooks/useColors";

const METHODS = [
  { id: "1", type: "card", label: "Visa •••• 4242", expiry: "12/26", isDefault: true },
  { id: "2", type: "momo", label: "MTN Mobile Money", expiry: "+233 20 123 4567", isDefault: false },
];

export default function PaymentMethodsScreen() {
  const colors = useColors();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const topPad = Platform.OS === "web" ? Math.max(insets.top, 67) : insets.top;

  const [methods, setMethods] = useState(METHODS);

  const removeMethod = (id: string) => {
    Alert.alert("Remove", "Remove this payment method?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Remove",
        style: "destructive",
        onPress: () => setMethods((m) => m.filter((x) => x.id !== id)),
      },
    ]);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View
        style={[
          styles.header,
          { paddingTop: topPad + 16, borderBottomColor: colors.border },
        ]}
      >
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Feather name="arrow-left" size={22} color={colors.foreground} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: colors.foreground }]}>
          Payment Methods
        </Text>
        <View style={{ width: 30 }} />
      </View>

      <ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 100 }]}
        showsVerticalScrollIndicator={false}
      >
        {methods.map((m) => (
          <View
            key={m.id}
            style={[
              styles.card,
              {
                backgroundColor: colors.card,
                borderColor: m.isDefault ? colors.primary : colors.border,
                borderRadius: colors.radius,
              },
            ]}
          >
            <View
              style={[
                styles.iconBox,
                { backgroundColor: colors.primary + "15", borderRadius: 8 },
              ]}
            >
              <Feather
                name={m.type === "card" ? "credit-card" : "smartphone"}
                size={20}
                color={colors.primary}
              />
            </View>
            <View style={styles.info}>
              <View style={styles.infoRow}>
                <Text style={[styles.methodLabel, { color: colors.foreground }]}>
                  {m.label}
                </Text>
                {m.isDefault && (
                  <View style={[styles.defaultBadge, { backgroundColor: colors.primary }]}>
                    <Text style={styles.defaultText}>Default</Text>
                  </View>
                )}
              </View>
              <Text style={[styles.expiry, { color: colors.mutedForeground }]}>
                {m.expiry}
              </Text>
            </View>
            <TouchableOpacity onPress={() => removeMethod(m.id)} style={styles.deleteBtn}>
              <Feather name="trash-2" size={18} color={colors.destructive} />
            </TouchableOpacity>
          </View>
        ))}

        <View
          style={[
            styles.infoBox,
            { backgroundColor: colors.card, borderColor: colors.border, borderRadius: colors.radius },
          ]}
        >
          <Feather name="lock" size={14} color={colors.mutedForeground} />
          <Text style={[styles.infoText, { color: colors.mutedForeground }]}>
            Payments are secured by Paystack. Your card details are never stored on our
            servers.
          </Text>
        </View>

        <TouchableOpacity
          style={[
            styles.addBtn,
            { borderColor: colors.primary, borderRadius: colors.radius, backgroundColor: colors.primary + "10" },
          ]}
          onPress={() =>
            Alert.alert("Add Payment Method", "Payment method will be saved when you complete your next Paystack transaction.")
          }
        >
          <Feather name="plus" size={20} color={colors.primary} />
          <Text style={[styles.addBtnText, { color: colors.primary }]}>
            Add Payment Method
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
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
  },
  backBtn: { padding: 4 },
  title: {
    flex: 1,
    fontSize: 20,
    fontWeight: "700" as const,
    fontFamily: "Inter_700Bold",
    textAlign: "center",
  },
  content: { padding: 16, gap: 12 },
  card: {
    borderWidth: 1.5,
    padding: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  iconBox: { width: 42, height: 42, alignItems: "center", justifyContent: "center" },
  info: { flex: 1, gap: 3 },
  infoRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  methodLabel: { fontSize: 15, fontFamily: "Inter_500Medium", fontWeight: "500" as const },
  defaultBadge: { paddingHorizontal: 7, paddingVertical: 2, borderRadius: 4 },
  defaultText: { color: "#fff", fontSize: 10, fontFamily: "Inter_600SemiBold" },
  expiry: { fontSize: 13, fontFamily: "Inter_400Regular" },
  deleteBtn: { padding: 6 },
  infoBox: {
    flexDirection: "row",
    gap: 10,
    padding: 14,
    borderWidth: 1,
    alignItems: "flex-start",
  },
  infoText: { fontSize: 12, fontFamily: "Inter_400Regular", flex: 1, lineHeight: 18 },
  addBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    padding: 16,
    borderWidth: 1.5,
    borderStyle: "dashed",
  },
  addBtnText: { fontSize: 15, fontWeight: "600" as const, fontFamily: "Inter_600SemiBold" },
});
