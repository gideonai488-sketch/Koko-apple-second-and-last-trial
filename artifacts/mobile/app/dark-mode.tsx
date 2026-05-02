import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import {
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { ThemeMode, useTheme } from "@/context/ThemeContext";
import { useColors } from "@/hooks/useColors";

const OPTIONS: { id: ThemeMode; label: string; desc: string; icon: string }[] = [
  { id: "light", label: "Light", desc: "Always use light mode", icon: "sun" },
  { id: "dark", label: "Dark", desc: "Always use dark mode", icon: "moon" },
  { id: "system", label: "System", desc: "Match your device setting", icon: "smartphone" },
];

export default function DarkModeScreen() {
  const colors = useColors();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const topPad = Platform.OS === "web" ? Math.max(insets.top, 67) : insets.top;
  const { theme, setTheme } = useTheme();

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
        <Text style={[styles.title, { color: colors.foreground }]}>Dark Mode</Text>
        <View style={{ width: 30 }} />
      </View>

      <View style={[styles.content]}>
        <View
          style={[
            styles.optionsList,
            { backgroundColor: colors.card, borderColor: colors.border, borderRadius: colors.radius },
          ]}
        >
          {OPTIONS.map((opt, i) => {
            const selected = theme === opt.id;
            return (
              <TouchableOpacity
                key={opt.id}
                onPress={() => setTheme(opt.id)}
                style={[
                  styles.option,
                  {
                    borderBottomWidth: i < OPTIONS.length - 1 ? 1 : 0,
                    borderBottomColor: colors.border,
                  },
                ]}
                activeOpacity={0.7}
              >
                <View
                  style={[
                    styles.iconBox,
                    {
                      backgroundColor: selected ? colors.primary + "20" : colors.muted,
                      borderRadius: 8,
                    },
                  ]}
                >
                  <Feather
                    name={opt.icon as any}
                    size={18}
                    color={selected ? colors.primary : colors.mutedForeground}
                  />
                </View>
                <View style={styles.optionInfo}>
                  <Text
                    style={[
                      styles.optionLabel,
                      { color: selected ? colors.primary : colors.foreground },
                    ]}
                  >
                    {opt.label}
                  </Text>
                  <Text style={[styles.optionDesc, { color: colors.mutedForeground }]}>
                    {opt.desc}
                  </Text>
                </View>
                <View
                  style={[
                    styles.radio,
                    {
                      borderColor: selected ? colors.primary : colors.border,
                      backgroundColor: selected ? colors.primary : "transparent",
                    },
                  ]}
                >
                  {selected && (
                    <Feather name="check" size={12} color="#fff" />
                  )}
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        <Text style={[styles.note, { color: colors.mutedForeground }]}>
          Changes apply instantly throughout the app.
        </Text>
      </View>
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
  optionsList: { borderWidth: 1, overflow: "hidden" },
  option: { flexDirection: "row", alignItems: "center", padding: 16, gap: 12 },
  iconBox: { width: 40, height: 40, alignItems: "center", justifyContent: "center" },
  optionInfo: { flex: 1, gap: 2 },
  optionLabel: { fontSize: 15, fontWeight: "600" as const, fontFamily: "Inter_600SemiBold" },
  optionDesc: { fontSize: 12, fontFamily: "Inter_400Regular" },
  radio: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
  },
  note: { fontSize: 12, fontFamily: "Inter_400Regular", textAlign: "center" },
});
