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

const HISTORY = [
  { id: "1", desc: "Jollof Rice & Grilled Chicken order", pts: +120, date: "Today" },
  { id: "2", desc: "Waakye Special order", pts: +85, date: "Yesterday" },
  { id: "3", desc: "JOLLOF25 promo code bonus", pts: +200, date: "Apr 28" },
  { id: "4", desc: "Kelewele Combo order", pts: +75, date: "Apr 25" },
  { id: "5", desc: "Redeemed for free delivery", pts: -500, date: "Apr 20" },
  { id: "6", desc: "Banku & Tilapia order", pts: +100, date: "Apr 18" },
];

const TOTAL_PTS = 1240;
const PTS_TO_REDEEM = 500;

const TIERS = [
  { name: "Koko Fan", min: 0, max: 499, icon: "star" },
  { name: "Koko Regular", min: 500, max: 1499, icon: "award" },
  { name: "Koko VIP", min: 1500, max: 4999, icon: "zap" },
  { name: "Koko Legend", min: 5000, max: Infinity, icon: "crown" as any },
];

const currentTier = TIERS.find((t) => TOTAL_PTS >= t.min && TOTAL_PTS <= t.max)!;
const nextTier = TIERS[TIERS.indexOf(currentTier) + 1];

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
        style={[
          styles.header,
          { paddingTop: topPad + 16, borderBottomColor: colors.border },
        ]}
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
            <Feather name={currentTier.icon as any} size={14} color="#fff" />
            <Text style={styles.tierText}>{currentTier.name}</Text>
          </View>
        </View>

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
            <View
              style={[
                styles.progressBar,
                { backgroundColor: colors.muted, borderRadius: 4 },
              ]}
            >
              <View
                style={[
                  styles.progressFill,
                  {
                    width: `${Math.round(progress * 100)}%` as any,
                    backgroundColor: colors.primary,
                    borderRadius: 4,
                  },
                ]}
              />
            </View>
            <Text style={[styles.progressSub, { color: colors.mutedForeground }]}>
              {currentTier.name} ({currentTier.min}) → {nextTier.name} ({nextTier.min})
            </Text>
          </View>
        )}

        <View
          style={[
            styles.redeemCard,
            { backgroundColor: colors.card, borderColor: colors.border, borderRadius: colors.radius },
          ]}
        >
          <Feather name="gift" size={20} color={colors.primary} />
          <View style={{ flex: 1 }}>
            <Text style={[styles.redeemTitle, { color: colors.foreground }]}>
              Redeem Points
            </Text>
            <Text style={[styles.redeemSub, { color: colors.mutedForeground }]}>
              {PTS_TO_REDEEM} pts = Free delivery on your next order
            </Text>
          </View>
          <TouchableOpacity
            style={[
              styles.redeemBtn,
              {
                backgroundColor: TOTAL_PTS >= PTS_TO_REDEEM ? colors.primary : colors.muted,
                borderRadius: colors.radius / 1.5,
              },
            ]}
          >
            <Text
              style={[
                styles.redeemBtnText,
                { color: TOTAL_PTS >= PTS_TO_REDEEM ? "#fff" : colors.mutedForeground },
              ]}
            >
              Redeem
            </Text>
          </TouchableOpacity>
        </View>

        <Text style={[styles.sectionTitle, { color: colors.mutedForeground }]}>
          Recent Activity
        </Text>

        {HISTORY.map((item) => (
          <View
            key={item.id}
            style={[
              styles.historyRow,
              { backgroundColor: colors.card, borderColor: colors.border, borderRadius: colors.radius },
            ]}
          >
            <View
              style={[
                styles.historyIcon,
                {
                  backgroundColor:
                    item.pts > 0 ? colors.success + "20" : colors.destructive + "20",
                },
              ]}
            >
              <Feather
                name={item.pts > 0 ? "arrow-up-right" : "arrow-down-left"}
                size={16}
                color={item.pts > 0 ? colors.success : colors.destructive}
              />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.historyDesc, { color: colors.foreground }]}>
                {item.desc}
              </Text>
              <Text style={[styles.historyDate, { color: colors.mutedForeground }]}>
                {item.date}
              </Text>
            </View>
            <Text
              style={[
                styles.historyPts,
                { color: item.pts > 0 ? colors.success : colors.destructive },
              ]}
            >
              {item.pts > 0 ? "+" : ""}
              {item.pts} pts
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
  content: { padding: 16, gap: 14 },
  balanceCard: { padding: 24, alignItems: "center", gap: 6 },
  balanceLabel: { color: "rgba(255,255,255,0.8)", fontSize: 13, fontFamily: "Inter_500Medium" },
  balancePoints: { color: "#fff", fontSize: 52, fontWeight: "800" as const, fontFamily: "Inter_700Bold", lineHeight: 60 },
  balanceUnit: { color: "rgba(255,255,255,0.8)", fontSize: 14, fontFamily: "Inter_500Medium" },
  tierBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "rgba(255,255,255,0.2)",
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
    marginTop: 6,
  },
  tierText: { color: "#fff", fontSize: 13, fontFamily: "Inter_600SemiBold" },
  progressCard: { padding: 16, borderWidth: 1, gap: 10 },
  progressHeader: { flexDirection: "row", justifyContent: "space-between" },
  progressLabel: { fontSize: 14, fontFamily: "Inter_600SemiBold", fontWeight: "600" as const },
  progressValue: { fontSize: 13, fontFamily: "Inter_600SemiBold", fontWeight: "600" as const },
  progressBar: { height: 8 },
  progressFill: { height: 8 },
  progressSub: { fontSize: 11, fontFamily: "Inter_400Regular" },
  redeemCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
    borderWidth: 1,
    gap: 12,
  },
  redeemTitle: { fontSize: 14, fontWeight: "600" as const, fontFamily: "Inter_600SemiBold" },
  redeemSub: { fontSize: 12, fontFamily: "Inter_400Regular", marginTop: 2 },
  redeemBtn: { paddingHorizontal: 14, paddingVertical: 8 },
  redeemBtnText: { fontSize: 13, fontWeight: "700" as const, fontFamily: "Inter_700Bold" },
  sectionTitle: { fontSize: 11, fontFamily: "Inter_600SemiBold", textTransform: "uppercase", letterSpacing: 0.8 },
  historyRow: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderWidth: 1,
    gap: 12,
  },
  historyIcon: { width: 34, height: 34, borderRadius: 17, alignItems: "center", justifyContent: "center" },
  historyDesc: { fontSize: 13, fontFamily: "Inter_500Medium", fontWeight: "500" as const },
  historyDate: { fontSize: 12, fontFamily: "Inter_400Regular", marginTop: 2 },
  historyPts: { fontSize: 14, fontWeight: "700" as const, fontFamily: "Inter_700Bold" },
});
