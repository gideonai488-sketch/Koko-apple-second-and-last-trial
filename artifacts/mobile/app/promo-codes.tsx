import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useColors } from "@/hooks/useColors";

const VALID_CODES: Record<string, { desc: string; discount: string }> = {
  KOKO10: { desc: "10% off your order", discount: "10%" },
  WELCOME: { desc: "Free delivery on first order", discount: "Free Delivery" },
};

interface Applied {
  code: string;
  desc: string;
  discount: string;
}

export default function PromoCodesScreen() {
  const colors = useColors();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const topPad = Platform.OS === "web" ? Math.max(insets.top, 67) : insets.top;

  const [input, setInput] = useState("");
  const [applied, setApplied] = useState<Applied[]>([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const applyCode = () => {
    const code = input.trim().toUpperCase();
    if (!code) return;
    setSuccess("");
    if (applied.find((a) => a.code === code)) {
      setError("This code is already applied.");
      return;
    }
    const found = VALID_CODES[code];
    if (!found) {
      setError("Invalid promo code. Please check and try again.");
      return;
    }
    setApplied((prev) => [...prev, { code, ...found }]);
    setInput("");
    setError("");
    setSuccess(`${code} applied — ${found.discount}!`);
  };

  const removeCode = (code: string) => {
    setApplied((prev) => prev.filter((a) => a.code !== code));
    setSuccess("");
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View
        style={[styles.header, { paddingTop: topPad + 16, borderBottomColor: colors.border }]}
      >
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Feather name="arrow-left" size={22} color={colors.foreground} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: colors.foreground }]}>Promo Codes</Text>
        <View style={{ width: 30 }} />
      </View>

      <ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 100 }]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Input */}
        <View
          style={[
            styles.inputCard,
            { backgroundColor: colors.card, borderColor: colors.border, borderRadius: colors.radius },
          ]}
        >
          <Text style={[styles.inputLabel, { color: colors.foreground }]}>Enter Promo Code</Text>
          <View style={styles.inputRow}>
            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: colors.muted,
                  borderColor: error ? colors.destructive : "transparent",
                  color: colors.foreground,
                  borderRadius: colors.radius / 1.5,
                },
              ]}
              placeholder="Enter code here"
              placeholderTextColor={colors.mutedForeground}
              value={input}
              onChangeText={(t) => { setInput(t); setError(""); setSuccess(""); }}
              autoCapitalize="characters"
              autoCorrect={false}
            />
            <TouchableOpacity
              style={[styles.applyBtn, { backgroundColor: colors.primary, borderRadius: colors.radius / 1.5 }]}
              onPress={applyCode}
            >
              <Text style={styles.applyBtnText}>Apply</Text>
            </TouchableOpacity>
          </View>
          {error ? (
            <View style={styles.feedbackRow}>
              <Feather name="alert-circle" size={13} color={colors.destructive} />
              <Text style={[styles.error, { color: colors.destructive }]}>{error}</Text>
            </View>
          ) : null}
          {success ? (
            <View style={styles.feedbackRow}>
              <Feather name="check-circle" size={13} color={colors.success} />
              <Text style={[styles.success, { color: colors.success }]}>{success}</Text>
            </View>
          ) : null}
        </View>

        {/* Applied codes */}
        {applied.length > 0 && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.mutedForeground }]}>
              Applied Codes
            </Text>
            {applied.map((a) => (
              <View
                key={a.code}
                style={[
                  styles.promoCard,
                  { backgroundColor: colors.card, borderColor: colors.success + "50", borderRadius: colors.radius },
                ]}
              >
                <View style={[styles.codeIcon, { backgroundColor: colors.success + "20" }]}>
                  <Feather name="tag" size={16} color={colors.success} />
                </View>
                <View style={styles.promoInfo}>
                  <Text style={[styles.promoCode, { color: colors.foreground }]}>{a.code}</Text>
                  <Text style={[styles.promoDesc, { color: colors.mutedForeground }]}>{a.desc}</Text>
                </View>
                <View style={[styles.discountBadge, { backgroundColor: colors.success }]}>
                  <Text style={styles.discountText}>{a.discount}</Text>
                </View>
                <TouchableOpacity onPress={() => removeCode(a.code)} style={styles.removeBtn}>
                  <Feather name="x" size={16} color={colors.mutedForeground} />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}

        {applied.length === 0 && (
          <View style={styles.emptyState}>
            <Feather name="percent" size={38} color={colors.mutedForeground} />
            <Text style={[styles.emptyText, { color: colors.mutedForeground }]}>
              No promo codes applied yet. Enter a code above to get a discount on your next order.
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: "row", alignItems: "center",
    paddingHorizontal: 16, paddingBottom: 16, borderBottomWidth: 1,
  },
  backBtn: { padding: 4 },
  title: { flex: 1, fontSize: 20, fontWeight: "700" as const, fontFamily: "Inter_700Bold", textAlign: "center" },
  content: { padding: 16, gap: 16 },
  inputCard: { padding: 16, borderWidth: 1, gap: 10 },
  inputLabel: { fontSize: 15, fontWeight: "600" as const, fontFamily: "Inter_600SemiBold" },
  inputRow: { flexDirection: "row", gap: 8 },
  input: { flex: 1, borderWidth: 1, paddingHorizontal: 12, paddingVertical: 10, fontSize: 15, fontFamily: "Inter_400Regular" },
  applyBtn: { paddingHorizontal: 18, justifyContent: "center", alignItems: "center" },
  applyBtnText: { color: "#fff", fontWeight: "700" as const, fontFamily: "Inter_700Bold", fontSize: 14 },
  feedbackRow: { flexDirection: "row", alignItems: "center", gap: 6 },
  error: { fontSize: 13, fontFamily: "Inter_400Regular" },
  success: { fontSize: 13, fontFamily: "Inter_500Medium" },
  section: { gap: 10 },
  sectionTitle: { fontSize: 11, fontFamily: "Inter_600SemiBold", textTransform: "uppercase", letterSpacing: 0.8 },
  promoCard: { flexDirection: "row", alignItems: "center", padding: 12, borderWidth: 1.5, gap: 10 },
  codeIcon: { width: 36, height: 36, borderRadius: 8, alignItems: "center", justifyContent: "center" },
  promoInfo: { flex: 1, gap: 2 },
  promoCode: { fontSize: 14, fontWeight: "700" as const, fontFamily: "Inter_700Bold" },
  promoDesc: { fontSize: 12, fontFamily: "Inter_400Regular" },
  discountBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  discountText: { color: "#fff", fontSize: 11, fontFamily: "Inter_700Bold" },
  removeBtn: { padding: 4 },
  emptyState: { alignItems: "center", gap: 12, paddingVertical: 40 },
  emptyText: {
    fontSize: 13, fontFamily: "Inter_400Regular",
    textAlign: "center", paddingHorizontal: 32, lineHeight: 20,
  },
});
