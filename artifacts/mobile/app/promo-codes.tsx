import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
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
  JOLLOF25: { desc: "25% off rice dishes", discount: "25%" },
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

  const applyCode = () => {
    const code = input.trim().toUpperCase();
    if (!code) return;
    if (applied.find((a) => a.code === code)) {
      setError("Code already applied.");
      return;
    }
    const found = VALID_CODES[code];
    if (!found) {
      setError("Invalid promo code. Try KOKO10 or WELCOME.");
      return;
    }
    setApplied((prev) => [...prev, { code, ...found }]);
    setInput("");
    setError("");
  };

  const removeCode = (code: string) => {
    setApplied((prev) => prev.filter((a) => a.code !== code));
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
        <Text style={[styles.title, { color: colors.foreground }]}>Promo Codes</Text>
        <View style={{ width: 30 }} />
      </View>

      <ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 100 }]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View
          style={[
            styles.inputCard,
            { backgroundColor: colors.card, borderColor: colors.border, borderRadius: colors.radius },
          ]}
        >
          <Text style={[styles.inputLabel, { color: colors.foreground }]}>
            Enter Promo Code
          </Text>
          <View style={styles.inputRow}>
            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: colors.muted,
                  borderColor: error ? colors.destructive : colors.border,
                  color: colors.foreground,
                  borderRadius: colors.radius / 1.5,
                },
              ]}
              placeholder="e.g. KOKO10"
              placeholderTextColor={colors.mutedForeground}
              value={input}
              onChangeText={(t) => {
                setInput(t);
                setError("");
              }}
              autoCapitalize="characters"
              autoCorrect={false}
            />
            <TouchableOpacity
              style={[
                styles.applyBtn,
                { backgroundColor: colors.primary, borderRadius: colors.radius / 1.5 },
              ]}
              onPress={applyCode}
            >
              <Text style={styles.applyBtnText}>Apply</Text>
            </TouchableOpacity>
          </View>
          {error ? (
            <Text style={[styles.error, { color: colors.destructive }]}>{error}</Text>
          ) : null}
        </View>

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
                  <Text style={[styles.promoCode, { color: colors.foreground }]}>
                    {a.code}
                  </Text>
                  <Text style={[styles.promoDesc, { color: colors.mutedForeground }]}>
                    {a.desc}
                  </Text>
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

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.mutedForeground }]}>
            Available Codes
          </Text>
          {Object.entries(VALID_CODES).map(([code, info]) => (
            <TouchableOpacity
              key={code}
              style={[
                styles.availableCard,
                { backgroundColor: colors.card, borderColor: colors.border, borderRadius: colors.radius },
              ]}
              onPress={() => {
                setInput(code);
                setError("");
              }}
            >
              <View style={[styles.codeIcon, { backgroundColor: colors.primary + "15" }]}>
                <Feather name="percent" size={16} color={colors.primary} />
              </View>
              <View style={styles.promoInfo}>
                <Text style={[styles.promoCode, { color: colors.foreground }]}>{code}</Text>
                <Text style={[styles.promoDesc, { color: colors.mutedForeground }]}>
                  {info.desc}
                </Text>
              </View>
              <Text style={[styles.tapText, { color: colors.primary }]}>Tap to use</Text>
            </TouchableOpacity>
          ))}
        </View>
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
  title: { flex: 1, fontSize: 20, fontWeight: "700" as const, fontFamily: "Inter_700Bold", textAlign: "center" },
  content: { padding: 16, gap: 16 },
  inputCard: { padding: 16, borderWidth: 1, gap: 10 },
  inputLabel: { fontSize: 15, fontWeight: "600" as const, fontFamily: "Inter_600SemiBold" },
  inputRow: { flexDirection: "row", gap: 8 },
  input: { flex: 1, borderWidth: 1, paddingHorizontal: 12, paddingVertical: 10, fontSize: 15, fontFamily: "Inter_400Regular" },
  applyBtn: { paddingHorizontal: 18, justifyContent: "center", alignItems: "center" },
  applyBtnText: { color: "#fff", fontWeight: "700" as const, fontFamily: "Inter_700Bold", fontSize: 14 },
  error: { fontSize: 12, fontFamily: "Inter_400Regular" },
  section: { gap: 10 },
  sectionTitle: { fontSize: 11, fontFamily: "Inter_600SemiBold", textTransform: "uppercase", letterSpacing: 0.8 },
  promoCard: { flexDirection: "row", alignItems: "center", padding: 12, borderWidth: 1.5, gap: 10 },
  availableCard: { flexDirection: "row", alignItems: "center", padding: 12, borderWidth: 1, gap: 10 },
  codeIcon: { width: 36, height: 36, borderRadius: 8, alignItems: "center", justifyContent: "center" },
  promoInfo: { flex: 1, gap: 2 },
  promoCode: { fontSize: 14, fontWeight: "700" as const, fontFamily: "Inter_700Bold" },
  promoDesc: { fontSize: 12, fontFamily: "Inter_400Regular" },
  discountBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  discountText: { color: "#fff", fontSize: 11, fontFamily: "Inter_700Bold" },
  removeBtn: { padding: 4 },
  tapText: { fontSize: 12, fontFamily: "Inter_600SemiBold", fontWeight: "600" as const },
});
