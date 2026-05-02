import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
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

export default function PaymentMethodsScreen() {
  const colors = useColors();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const topPad = Platform.OS === "web" ? Math.max(insets.top, 67) : insets.top;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View
        style={[styles.header, { paddingTop: topPad + 16, borderBottomColor: colors.border }]}
      >
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Feather name="arrow-left" size={22} color={colors.foreground} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: colors.foreground }]}>Payment Methods</Text>
        <View style={{ width: 30 }} />
      </View>

      <ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 100 }]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.emptyState}>
          <Feather name="credit-card" size={44} color={colors.mutedForeground} />
          <Text style={[styles.emptyTitle, { color: colors.foreground }]}>
            No payment methods saved
          </Text>
          <Text style={[styles.emptyText, { color: colors.mutedForeground }]}>
            Your card or mobile money details will appear here after your first Paystack payment.
          </Text>
        </View>

        <View
          style={[
            styles.infoBox,
            { backgroundColor: colors.card, borderColor: colors.border, borderRadius: colors.radius },
          ]}
        >
          <Feather name="shield" size={16} color={colors.primary} />
          <Text style={[styles.infoText, { color: colors.mutedForeground }]}>
            All payments are processed securely by Paystack. Your card details are never stored on 1st Koko Spot servers.
          </Text>
        </View>

        <TouchableOpacity
          style={[
            styles.addBtn,
            { borderColor: colors.primary, borderRadius: colors.radius, backgroundColor: colors.primary + "10" },
          ]}
          onPress={() =>
            Alert.alert(
              "Add Payment Method",
              "Payment methods are saved automatically when you complete a Paystack transaction."
            )
          }
        >
          <Feather name="plus" size={20} color={colors.primary} />
          <Text style={[styles.addBtnText, { color: colors.primary }]}>
            Add via Paystack
          </Text>
        </TouchableOpacity>
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
  emptyState: { alignItems: "center", gap: 10, paddingVertical: 48 },
  emptyTitle: { fontSize: 17, fontWeight: "600" as const, fontFamily: "Inter_600SemiBold" },
  emptyText: {
    fontSize: 13, fontFamily: "Inter_400Regular",
    textAlign: "center", paddingHorizontal: 24, lineHeight: 20,
  },
  infoBox: {
    flexDirection: "row", gap: 10, padding: 14, borderWidth: 1, alignItems: "flex-start",
  },
  infoText: { fontSize: 13, fontFamily: "Inter_400Regular", flex: 1, lineHeight: 19 },
  addBtn: {
    flexDirection: "row", alignItems: "center", justifyContent: "center",
    gap: 8, padding: 16, borderWidth: 1.5, borderStyle: "dashed",
  },
  addBtnText: { fontSize: 15, fontWeight: "600" as const, fontFamily: "Inter_600SemiBold" },
});
