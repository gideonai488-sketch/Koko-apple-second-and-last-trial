import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import {
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useColors } from "@/hooks/useColors";

const SECTIONS = [
  {
    title: "1. Acceptance of Terms",
    body: "By downloading and using the 1st Koko Spot app, you agree to these Terms of Service. If you do not agree, please do not use the app.",
  },
  {
    title: "2. Eligibility",
    body: "You must be at least 13 years old to use this app. By using the app, you confirm you meet this requirement.",
  },
  {
    title: "3. Account Responsibility",
    body: "You are responsible for maintaining the confidentiality of your account credentials. Notify us immediately at support@firstkokospot.com if you suspect unauthorized access to your account.",
  },
  {
    title: "4. Orders and Payments",
    body: `• All prices are in Ghana Cedis (GH₵) and include applicable taxes
• Orders are confirmed once payment is successfully processed through Paystack
• We reserve the right to cancel orders due to stock availability or delivery area
• Refunds for cancelled orders are processed within 3–5 business days`,
  },
  {
    title: "5. Delivery",
    body: "Estimated delivery times are approximate and may vary due to traffic, weather, or order volume. We are not liable for delays outside our reasonable control.",
  },
  {
    title: "6. Loyalty Points",
    body: "Koko Points have no cash value, cannot be transferred, and expire 12 months after your last order. We reserve the right to modify or discontinue the loyalty program with reasonable notice.",
  },
  {
    title: "7. Prohibited Conduct",
    body: `You agree not to:
• Use the app for any unlawful purpose
• Attempt to gain unauthorized access to our systems
• Abuse refund or loyalty policies
• Resell food ordered through the app`,
  },
  {
    title: "8. Intellectual Property",
    body: "All content in the app — including logos, images, menu descriptions, and text — is owned by 1st Koko Spot and may not be reproduced without permission.",
  },
  {
    title: "9. Limitation of Liability",
    body: "To the maximum extent permitted by law, 1st Koko Spot is not liable for indirect, incidental, or consequential damages arising from use of the app or our services.",
  },
  {
    title: "10. Governing Law",
    body: "These terms are governed by the laws of the Republic of Ghana. Any disputes shall be resolved in the courts of Accra, Ghana.",
  },
  {
    title: "11. Contact",
    body: "1st Koko Spot · 14 Osu Road, Accra, Ghana\nlegal@firstkokospot.com · +233 302 123 456",
  },
];

export default function TermsOfServiceScreen() {
  const colors = useColors();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const topPad = Platform.OS === "web" ? Math.max(insets.top, 67) : insets.top;

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
        <Text style={[styles.title, { color: colors.foreground }]}>Terms of Service</Text>
        <View style={{ width: 30 }} />
      </View>

      <ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 60 }]}
        showsVerticalScrollIndicator={false}
      >
        <Text style={[styles.lastUpdated, { color: colors.mutedForeground }]}>
          Last updated: May 2, 2026
        </Text>
        <Text style={[styles.intro, { color: colors.foreground }]}>
          Please read these Terms of Service carefully before using the 1st Koko Spot app.
        </Text>

        {SECTIONS.map((s) => (
          <View key={s.title}>
            <Text style={[styles.sectionTitle, { color: colors.foreground }]}>
              {s.title}
            </Text>
            <Text style={[styles.sectionBody, { color: colors.mutedForeground }]}>
              {s.body}
            </Text>
          </View>
        ))}
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
  content: { padding: 20, gap: 20 },
  lastUpdated: { fontSize: 12, fontFamily: "Inter_400Regular" },
  intro: { fontSize: 14, fontFamily: "Inter_400Regular", lineHeight: 22 },
  sectionTitle: { fontSize: 15, fontWeight: "700" as const, fontFamily: "Inter_700Bold", marginBottom: 8 },
  sectionBody: { fontSize: 13, fontFamily: "Inter_400Regular", lineHeight: 22 },
});
