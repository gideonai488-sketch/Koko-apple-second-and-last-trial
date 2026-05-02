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
    title: "1. Information We Collect",
    body: `We collect information you provide directly to us when you create an account, place an order, or contact support. This includes:

• Name and email address
• Delivery address(es)
• Order history and preferences
• Payment references (we do NOT store card numbers — payments are handled by Paystack)
• Device and usage information to improve the app`,
  },
  {
    title: "2. How We Use Your Information",
    body: `We use your information to:

• Process and deliver your orders
• Send order status updates and receipts
• Manage your loyalty points
• Improve our menu and services
• Communicate promotions (if you opt in)
• Comply with legal obligations`,
  },
  {
    title: "3. Sharing of Information",
    body: `We do not sell your personal information. We share it only with:

• Delivery partners (name + address only, to fulfill your order)
• Paystack (payment processing — see their privacy policy at paystack.com)
• Supabase (database hosting, GDPR-compliant)
• Law enforcement when legally required`,
  },
  {
    title: "4. Data Retention",
    body: `We retain your account data for as long as your account is active. Order records are kept for 7 years for tax and legal compliance. You may request deletion at any time via Profile → Delete Account.`,
  },
  {
    title: "5. Your Rights",
    body: `You have the right to:

• Access your personal data
• Correct inaccurate data
• Request deletion of your account and data
• Opt out of marketing communications

Contact us at privacy@firstkokospot.com to exercise these rights.`,
  },
  {
    title: "6. Security",
    body: `We take security seriously. All data is encrypted in transit (TLS) and at rest. Payments are processed exclusively through Paystack's PCI-DSS compliant infrastructure.`,
  },
  {
    title: "7. Changes to This Policy",
    body: `We may update this policy from time to time. We'll notify you of significant changes through the app. Continued use after changes means you accept the updated policy.`,
  },
  {
    title: "8. Contact",
    body: `1st Koko Spot\n14 Osu Road, Accra, Ghana\nprivacy@firstkokospot.com\n+233 302 123 456`,
  },
];

export default function PrivacyPolicyScreen() {
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
        <Text style={[styles.title, { color: colors.foreground }]}>Privacy Policy</Text>
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
          At 1st Koko Spot, we respect your privacy. This policy explains how we collect,
          use, and protect your information when you use our app.
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
