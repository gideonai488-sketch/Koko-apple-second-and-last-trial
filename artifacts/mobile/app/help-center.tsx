import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Animated,
  Linking,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useColors } from "@/hooks/useColors";

const FAQS = [
  {
    q: "How do I track my order?",
    a: "After placing your order, go to the Orders tab to see real-time updates from our kitchen to your door.",
  },
  {
    q: "Can I change or cancel my order?",
    a: "Orders can be cancelled within 2 minutes of placing them. After that, our kitchen has already started preparing your food. Contact us at +233 302 123 456.",
  },
  {
    q: "How does Paystack payment work?",
    a: "We use Paystack, Ghana's most trusted payment gateway. Your card and mobile money details are fully secured — we never store them on our servers.",
  },
  {
    q: "What areas do you deliver to?",
    a: "We currently deliver within Accra (Osu, Cantonments, Airport Residential, East Legon, Adabraka, and more). Enter your address at checkout to confirm availability.",
  },
  {
    q: "How do I earn Loyalty Points?",
    a: "You earn points on every order — 1 GH₵ spent = 1 Koko Point. Redeem 500 points for free delivery on your next order.",
  },
  {
    q: "My food arrived cold — what do I do?",
    a: "We're so sorry! Please contact us within 1 hour of delivery via WhatsApp at +233 302 123 456 and we'll make it right with a refund or free replacement.",
  },
  {
    q: "How do I use a promo code?",
    a: "Go to Profile → Promo Codes and enter your code there, or apply it during checkout in the cart.",
  },
];

function FAQItem({ q, a }: { q: string; a: string }) {
  const colors = useColors();
  const [open, setOpen] = useState(false);

  return (
    <TouchableOpacity
      onPress={() => setOpen((o) => !o)}
      activeOpacity={0.8}
      style={[
        styles.faqItem,
        {
          backgroundColor: colors.card,
          borderColor: open ? colors.primary + "50" : colors.border,
          borderRadius: colors.radius,
        },
      ]}
    >
      <View style={styles.faqHeader}>
        <Text style={[styles.faqQ, { color: colors.foreground, flex: 1 }]}>{q}</Text>
        <Feather
          name={open ? "chevron-up" : "chevron-down"}
          size={18}
          color={colors.mutedForeground}
        />
      </View>
      {open && (
        <Text style={[styles.faqA, { color: colors.mutedForeground }]}>{a}</Text>
      )}
    </TouchableOpacity>
  );
}

export default function HelpCenterScreen() {
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
        <Text style={[styles.title, { color: colors.foreground }]}>Help Center</Text>
        <View style={{ width: 30 }} />
      </View>

      <ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 100 }]}
        showsVerticalScrollIndicator={false}
      >
        <Text style={[styles.sectionTitle, { color: colors.mutedForeground }]}>
          Frequently Asked Questions
        </Text>

        {FAQS.map((faq, i) => (
          <FAQItem key={i} q={faq.q} a={faq.a} />
        ))}

        <Text style={[styles.sectionTitle, { color: colors.mutedForeground, marginTop: 8 }]}>
          Still need help?
        </Text>

        <TouchableOpacity
          style={[
            styles.contactCard,
            { backgroundColor: colors.card, borderColor: colors.border, borderRadius: colors.radius },
          ]}
          onPress={() => Linking.openURL("https://wa.me/233302123456")}
        >
          <View style={[styles.contactIcon, { backgroundColor: "#25D366" + "20" }]}>
            <Feather name="message-circle" size={20} color="#25D366" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={[styles.contactTitle, { color: colors.foreground }]}>
              WhatsApp Support
            </Text>
            <Text style={[styles.contactSub, { color: colors.mutedForeground }]}>
              Chat with us · Avg. response 5 min
            </Text>
          </View>
          <Feather name="chevron-right" size={16} color={colors.mutedForeground} />
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.contactCard,
            { backgroundColor: colors.card, borderColor: colors.border, borderRadius: colors.radius },
          ]}
          onPress={() => Linking.openURL("tel:+233302123456")}
        >
          <View style={[styles.contactIcon, { backgroundColor: colors.primary + "20" }]}>
            <Feather name="phone" size={20} color={colors.primary} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={[styles.contactTitle, { color: colors.foreground }]}>
              Call Us
            </Text>
            <Text style={[styles.contactSub, { color: colors.mutedForeground }]}>
              +233 302 123 456 · Mon–Sun 7am–10pm
            </Text>
          </View>
          <Feather name="chevron-right" size={16} color={colors.mutedForeground} />
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.contactCard,
            { backgroundColor: colors.card, borderColor: colors.border, borderRadius: colors.radius },
          ]}
          onPress={() => Linking.openURL("mailto:support@firstkokospot.com")}
        >
          <View style={[styles.contactIcon, { backgroundColor: colors.primary + "20" }]}>
            <Feather name="mail" size={20} color={colors.primary} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={[styles.contactTitle, { color: colors.foreground }]}>
              Email Support
            </Text>
            <Text style={[styles.contactSub, { color: colors.mutedForeground }]}>
              support@firstkokospot.com
            </Text>
          </View>
          <Feather name="chevron-right" size={16} color={colors.mutedForeground} />
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
  title: { flex: 1, fontSize: 20, fontWeight: "700" as const, fontFamily: "Inter_700Bold", textAlign: "center" },
  content: { padding: 16, gap: 10 },
  sectionTitle: { fontSize: 11, fontFamily: "Inter_600SemiBold", textTransform: "uppercase", letterSpacing: 0.8 },
  faqItem: { borderWidth: 1, padding: 14 },
  faqHeader: { flexDirection: "row", alignItems: "center", gap: 10 },
  faqQ: { fontSize: 14, fontWeight: "600" as const, fontFamily: "Inter_600SemiBold", lineHeight: 20 },
  faqA: { fontSize: 13, fontFamily: "Inter_400Regular", lineHeight: 20, marginTop: 10 },
  contactCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
    borderWidth: 1,
    gap: 12,
  },
  contactIcon: { width: 40, height: 40, borderRadius: 10, alignItems: "center", justifyContent: "center" },
  contactTitle: { fontSize: 14, fontWeight: "600" as const, fontFamily: "Inter_600SemiBold" },
  contactSub: { fontSize: 12, fontFamily: "Inter_400Regular", marginTop: 2 },
});
