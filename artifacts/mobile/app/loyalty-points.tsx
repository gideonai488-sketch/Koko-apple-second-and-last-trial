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

const TIERS = [
  { name: "Koko Fan", min: 0, max: 499 },
  { name: "Koko Regular", min: 500, max: 1499 },
  { name: "Koko VIP", min: 1500, max: 4999 },
  { name: "Koko Legend", min: 5000, max: Infinity },
];

const TOTAL_PTS = 0;
const currentTier = TIERS[0];
const nextTier = TIERS[1];
const PTS_TO_REDEEM = 500;

export default function LoyaltyPointsScreen() {
  const colors = useColors();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const topPad = Platform.OS === "web" ? Math.max(insets.top, 67) : insets.top;

  const progress = nextTier
    ? (TOTAL_PTS - currentTier.min) / (nextTier.min - currentTier.min)
    : 1;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View
        style={[styles.header, { paddingTop: topPad + 16, borderBottomColor: colors.border }]}
      >
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Feather name="arrow-left" size={22} color={colors.foreground} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: colors.foreground }]}>Loyalty Points</Text>
        <View style={{ width: 30 }} />
      </View>

      <ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 100 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Balance Card */}
        <View
          style={[
            styles.balanceCard,
            { backgroundColor: colors.primary, borderRadius: colors.radius * 1.5 },
          ]}
        >
          <Text style={styles.balanceLabel}>Your Balance</Text>
          <Text style={styles.balancePoints}>{TOTAL_PTS.toLocaleString()}</Text>
          <Text style={styles.balanceUnit}>Koko Points</Text>
          <View style={styles.tierBadge}>
            <Feather name="star" size={14} color="#fff" />
            <Text style={styles.tierText}>{currentTier.name}</Text>
          </View>
        </View>

        {/* Progress */}
        {nextTier && (
          <View
            style={[
              styles.progressCard,
              { backgroundColor: colors.card, borderColor: colors.border, borderRadius: colors.radius },
            ]}
          >
            <View style={styles.progressHeader}>
              <Text style={[styles.progressLabel, { color: colors.foreground }]}>
                Progress to {nextTier.name}
              </Text>
              <Text style={[styles.progressValue, { color: colors.primary }]}>
                {nextTier.min - TOTAL_PTS} pts to go
              </Text>
            </View>
            <View style={[styles.progressBar, { backgroundColor: colors.muted, borderRadius: 4 }]}>
              <View
                style={[
                  styles.progressFill,
                  {
                    width: `${Math.max(2, Math.round(progress * 100))}%` as any,
                    backgroundColor: colors.primary,
                    borderRadius: 4,
                  },
                ]}
              />
            </View>
            <Text style={[styles.progressSub, { color: colors.mutedForeground }]}>
              {currentTier.name} · {nextTier.min} pts unlocks {nextTier.name}
            </Text>
          </View>
        )}

        {/* How to earn */}
        <View
          style={[
            styles.earnCard,
            { backgroundColor: colors.card, borderColor: colors.border, borderRadius: colors.radius },
          ]}
        >
          <Text style={[styles.earnTitle, { color: colors.foreground }]}>How to Earn Points</Text>
          {[
            { icon: "shopping-bag", text: "Earn points on every order placed" },
            { icon: "tag", text: "Bonus points with promo codes" },
            { icon: "gift", text: "Redeem 500 pts for free delivery" },
          ].map((row, i) => (
            <View key={i} style={styles.earnRow}>
              <View style={[styles.earnIcon, { backgroundColor: colors.primary + "15" }]}>
                <Feather name={row.icon as any} size={15} color={colors.primary} />
              </View>
              <Text style={[styles.earnText, { color: colors.mutedForeground }]}>{row.text}</Text>
            </View>
          ))}
        </View>

        {/* Redeem */}
        <View
          style={[
            styles.redeemCard,
            { backgroundColor: colors.card, borderColor: colors.border, borderRadius: colors.radius },
          ]}
        >
          <Feather name="gift" size={20} color={colors.primary} />
          <View style={{ flex: 1 }}>
            <Text style={[styles.redeemTitle, { color: colors.foreground }]}>Redeem Points</Text>
            <Text style={[styles.redeemSub, { color: colors.mutedForeground }]}>
              {PTS_TO_REDEEM} pts = Free delivery on your next order
            </Text>
          </View>
          <TouchableOpacity
            style={[
              styles.redeemBtn,
              { backgroundColor: colors.muted, borderRadius: colors.radius / 1.5 },
            ]}
            onPress={() => {}}
          >
            <Text style={[styles.redeemBtnText, { color: colors.mutedForeground }]}>
              Redeem
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.emptyHistory}>
          <Feather name="clock" size={32} color={colors.mutedForeground} />
          <Text style={[styles.emptyHistoryText, { color: colors.mutedForeground }]}>
            No activity yet. Place your first order to start earning points!
          </Text>
        </View>
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
  content: { padding: 16, gap: 14 },
  balanceCard: { padding: 24, alignItems: "center", gap: 6 },
  balanceLabel: { color: "rgba(255,255,255,0.8)", fontSize: 13, fontFamily: "Inter_500Medium" },
  balancePoints: { color: "#fff", fontSize: 52, fontWeight: "800" as const, fontFamily: "Inter_700Bold", lineHeight: 60 },
  balanceUnit: { color: "rgba(255,255,255,0.8)", fontSize: 14, fontFamily: "Inter_500Medium" },
  tierBadge: {
    flexDirection: "row", alignItems: "center", gap: 6,
    backgroundColor: "rgba(255,255,255,0.2)",
    paddingHorizontal: 12, paddingVertical: 5, borderRadius: 20, marginTop: 6,
  },
  tierText: { color: "#fff", fontSize: 13, fontFamily: "Inter_600SemiBold" },
  progressCard: { padding: 16, borderWidth: 1, gap: 10 },
  progressHeader: { flexDirection: "row", justifyContent: "space-between" },
  progressLabel: { fontSize: 14, fontFamily: "Inter_600SemiBold", fontWeight: "600" as const },
  progressValue: { fontSize: 13, fontFamily: "Inter_600SemiBold", fontWeight: "600" as const },
  progressBar: { height: 8 },
  progressFill: { height: 8 },
  progressSub: { fontSize: 11, fontFamily: "Inter_400Regular" },
  earnCard: { padding: 16, borderWidth: 1, gap: 12 },
  earnTitle: { fontSize: 15, fontWeight: "600" as const, fontFamily: "Inter_600SemiBold" },
  earnRow: { flexDirection: "row", alignItems: "center", gap: 12 },
  earnIcon: { width: 34, height: 34, borderRadius: 8, alignItems: "center", justifyContent: "center" },
  earnText: { fontSize: 13, fontFamily: "Inter_400Regular", flex: 1 },
  redeemCard: { flexDirection: "row", alignItems: "center", padding: 14, borderWidth: 1, gap: 12 },
  redeemTitle: { fontSize: 14, fontWeight: "600" as const, fontFamily: "Inter_600SemiBold" },
  redeemSub: { fontSize: 12, fontFamily: "Inter_400Regular", marginTop: 2 },
  redeemBtn: { paddingHorizontal: 14, paddingVertical: 8 },
  redeemBtnText: { fontSize: 13, fontWeight: "700" as const, fontFamily: "Inter_700Bold" },
  emptyHistory: { alignItems: "center", gap: 10, paddingVertical: 24 },
  emptyHistoryText: {
    fontSize: 13, fontFamily: "Inter_400Regular",
    textAlign: "center", paddingHorizontal: 32, lineHeight: 20,
  },
});
