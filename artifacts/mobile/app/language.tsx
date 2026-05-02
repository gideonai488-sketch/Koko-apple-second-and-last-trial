import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
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

const LANGUAGES = [
  { id: "en", label: "English", native: "English", flag: "🇬🇧" },
  { id: "tw", label: "Twi", native: "Twi", flag: "🇬🇭" },
  { id: "ga", label: "Ga", native: "Ga", flag: "🇬🇭" },
  { id: "ee", label: "Ewe", native: "Eʋegbe", flag: "🇬🇭" },
  { id: "fr", label: "French", native: "Français", flag: "🇫🇷" },
];

export default function LanguageScreen() {
  const colors = useColors();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const topPad = Platform.OS === "web" ? Math.max(insets.top, 67) : insets.top;

  const [selected, setSelected] = useState("en");

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
        <Text style={[styles.title, { color: colors.foreground }]}>Language</Text>
        <View style={{ width: 30 }} />
      </View>

      <ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 100 }]}
        showsVerticalScrollIndicator={false}
      >
        <View
          style={[
            styles.list,
            { backgroundColor: colors.card, borderColor: colors.border, borderRadius: colors.radius },
          ]}
        >
          {LANGUAGES.map((lang, i) => {
            const isSelected = selected === lang.id;
            return (
              <TouchableOpacity
                key={lang.id}
                onPress={() => setSelected(lang.id)}
                style={[
                  styles.row,
                  {
                    borderBottomWidth: i < LANGUAGES.length - 1 ? 1 : 0,
                    borderBottomColor: colors.border,
                  },
                ]}
                activeOpacity={0.7}
              >
                <Text style={styles.flag}>{lang.flag}</Text>
                <View style={styles.rowInfo}>
                  <Text style={[styles.langLabel, { color: colors.foreground }]}>
                    {lang.label}
                  </Text>
                  {lang.native !== lang.label && (
                    <Text style={[styles.langNative, { color: colors.mutedForeground }]}>
                      {lang.native}
                    </Text>
                  )}
                </View>
                {isSelected && (
                  <Feather name="check" size={18} color={colors.primary} />
                )}
              </TouchableOpacity>
            );
          })}
        </View>

        <Text style={[styles.note, { color: colors.mutedForeground }]}>
          More languages coming soon. Currently English is fully supported.
        </Text>
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
  list: { borderWidth: 1, overflow: "hidden" },
  row: { flexDirection: "row", alignItems: "center", padding: 16, gap: 14 },
  flag: { fontSize: 24 },
  rowInfo: { flex: 1 },
  langLabel: { fontSize: 15, fontFamily: "Inter_500Medium", fontWeight: "500" as const },
  langNative: { fontSize: 12, fontFamily: "Inter_400Regular", marginTop: 2 },
  note: { fontSize: 12, fontFamily: "Inter_400Regular", textAlign: "center" },
});
