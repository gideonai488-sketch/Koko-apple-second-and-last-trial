import { Feather } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Platform,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useColors } from "@/hooks/useColors";

interface NotifSetting {
  id: string;
  icon: string;
  title: string;
  desc: string;
}

const SETTINGS: NotifSetting[] = [
  { id: "order_updates", icon: "shopping-bag", title: "Order Updates", desc: "Track your order from kitchen to door" },
  { id: "promotions", icon: "tag", title: "Promotions & Deals", desc: "Flash deals, discount codes, and offers" },
  { id: "loyalty", icon: "gift", title: "Loyalty Rewards", desc: "Points earned and redemption reminders" },
  { id: "new_items", icon: "star", title: "New Menu Items", desc: "Be first to know about new dishes" },
  { id: "app_news", icon: "bell", title: "App News", desc: "Updates, features, and announcements" },
];

const KEY = "koko_notif_settings";

export default function NotificationsScreen() {
  const colors = useColors();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const topPad = Platform.OS === "web" ? Math.max(insets.top, 67) : insets.top;

  const [prefs, setPrefs] = useState<Record<string, boolean>>({
    order_updates: true,
    promotions: true,
    loyalty: true,
    new_items: false,
    app_news: false,
  });

  useEffect(() => {
    AsyncStorage.getItem(KEY).then((val) => {
      if (val) {
        try {
          setPrefs(JSON.parse(val));
        } catch {}
      }
    });
  }, []);

  const toggle = (id: string) => {
    setPrefs((prev) => {
      const next = { ...prev, [id]: !prev[id] };
      AsyncStorage.setItem(KEY, JSON.stringify(next));
      return next;
    });
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
        <Text style={[styles.title, { color: colors.foreground }]}>Notifications</Text>
        <View style={{ width: 30 }} />
      </View>

      <ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 100 }]}
        showsVerticalScrollIndicator={false}
      >
        <View
          style={[
            styles.infoBox,
            { backgroundColor: colors.primary + "15", borderRadius: colors.radius, borderColor: colors.primary + "30" },
          ]}
        >
          <Feather name="info" size={15} color={colors.primary} />
          <Text style={[styles.infoText, { color: colors.primary }]}>
            Make sure notifications are enabled in your phone's Settings for 1st Koko Spot.
          </Text>
        </View>

        <View
          style={[
            styles.settingsList,
            { backgroundColor: colors.card, borderColor: colors.border, borderRadius: colors.radius },
          ]}
        >
          {SETTINGS.map((s, i) => (
            <View
              key={s.id}
              style={[
                styles.row,
                {
                  borderBottomColor: colors.border,
                  borderBottomWidth: i < SETTINGS.length - 1 ? 1 : 0,
                },
              ]}
            >
              <View
                style={[
                  styles.iconBox,
                  { backgroundColor: colors.primary + "15", borderRadius: 8 },
                ]}
              >
                <Feather name={s.icon as any} size={18} color={colors.primary} />
              </View>
              <View style={styles.rowInfo}>
                <Text style={[styles.rowTitle, { color: colors.foreground }]}>
                  {s.title}
                </Text>
                <Text style={[styles.rowDesc, { color: colors.mutedForeground }]}>
                  {s.desc}
                </Text>
              </View>
              <Switch
                value={prefs[s.id]}
                onValueChange={() => toggle(s.id)}
                trackColor={{ false: colors.border, true: colors.primary + "80" }}
                thumbColor={prefs[s.id] ? colors.primary : colors.mutedForeground}
              />
            </View>
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
  infoBox: { flexDirection: "row", gap: 10, padding: 14, borderWidth: 1, alignItems: "flex-start" },
  infoText: { fontSize: 13, fontFamily: "Inter_400Regular", flex: 1, lineHeight: 19 },
  settingsList: { borderWidth: 1, overflow: "hidden" },
  row: { flexDirection: "row", alignItems: "center", padding: 14, gap: 12 },
  iconBox: { width: 38, height: 38, alignItems: "center", justifyContent: "center" },
  rowInfo: { flex: 1, gap: 2 },
  rowTitle: { fontSize: 14, fontFamily: "Inter_500Medium", fontWeight: "500" as const },
  rowDesc: { fontSize: 12, fontFamily: "Inter_400Regular" },
});
