import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
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

import { useAuth } from "@/context/AuthContext";
import { useColors } from "@/hooks/useColors";

const CONSEQUENCES = [
  { icon: "user-x", text: "Your account and profile will be permanently deleted" },
  { icon: "shopping-bag", text: "Your order history will be removed" },
  { icon: "gift", text: "All Koko Points (1,240 pts) will be forfeited" },
  { icon: "map-pin", text: "Saved addresses and payment methods will be erased" },
  { icon: "tag", text: "Any unused promo codes will be invalidated" },
];

export default function DeleteAccountScreen() {
  const colors = useColors();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const topPad = Platform.OS === "web" ? Math.max(insets.top, 67) : insets.top;
  const { user, deleteAccount } = useAuth();

  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);

  const CONFIRM_WORD = "DELETE";
  const isConfirmed = confirm === CONFIRM_WORD;

  const handleDelete = () => {
    Alert.alert(
      "Permanently Delete Account",
      "This action cannot be undone. Your account and all data will be permanently deleted. Are you absolutely sure?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete Forever",
          style: "destructive",
          onPress: async () => {
            setLoading(true);
            const { error } = await deleteAccount();
            setLoading(false);
            if (error) {
              Alert.alert("Error", error);
            }
          },
        },
      ]
    );
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
        <Text style={[styles.title, { color: colors.foreground }]}>Delete Account</Text>
        <View style={{ width: 30 }} />
      </View>

      <ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 100 }]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View
          style={[
            styles.warningBanner,
            {
              backgroundColor: colors.destructive + "15",
              borderColor: colors.destructive + "40",
              borderRadius: colors.radius,
            },
          ]}
        >
          <Feather name="alert-triangle" size={28} color={colors.destructive} />
          <Text style={[styles.warningTitle, { color: colors.destructive }]}>
            This action is permanent
          </Text>
          <Text style={[styles.warningText, { color: colors.destructive + "CC" }]}>
            Deleting your account cannot be undone. All your data will be erased from
            our systems within 30 days.
          </Text>
        </View>

        <View
          style={[
            styles.card,
            { backgroundColor: colors.card, borderColor: colors.border, borderRadius: colors.radius },
          ]}
        >
          <Text style={[styles.cardTitle, { color: colors.foreground }]}>
            What will be deleted
          </Text>
          {CONSEQUENCES.map((c) => (
            <View key={c.icon} style={styles.consequenceRow}>
              <View style={[styles.cIcon, { backgroundColor: colors.destructive + "15" }]}>
                <Feather name={c.icon as any} size={15} color={colors.destructive} />
              </View>
              <Text style={[styles.consequenceText, { color: colors.foreground }]}>
                {c.text}
              </Text>
            </View>
          ))}
        </View>

        <View
          style={[
            styles.card,
            { backgroundColor: colors.card, borderColor: colors.border, borderRadius: colors.radius },
          ]}
        >
          <Text style={[styles.cardTitle, { color: colors.foreground }]}>
            Account to be deleted
          </Text>
          <View style={[styles.emailBox, { backgroundColor: colors.muted, borderRadius: colors.radius / 2 }]}>
            <Feather name="mail" size={15} color={colors.mutedForeground} />
            <Text style={[styles.emailText, { color: colors.foreground }]}>
              {user?.email ?? "Unknown"}
            </Text>
          </View>
        </View>

        <View
          style={[
            styles.confirmCard,
            { backgroundColor: colors.card, borderColor: colors.border, borderRadius: colors.radius },
          ]}
        >
          <Text style={[styles.confirmLabel, { color: colors.foreground }]}>
            Type{" "}
            <Text style={{ color: colors.destructive, fontFamily: "Inter_700Bold" }}>
              DELETE
            </Text>{" "}
            to confirm
          </Text>
          <TextInput
            style={[
              styles.confirmInput,
              {
                backgroundColor: colors.muted,
                borderColor: isConfirmed ? colors.destructive : colors.border,
                color: colors.foreground,
                borderRadius: colors.radius / 1.5,
              },
            ]}
            placeholder="Type DELETE here"
            placeholderTextColor={colors.mutedForeground}
            value={confirm}
            onChangeText={setConfirm}
            autoCapitalize="characters"
            autoCorrect={false}
          />
        </View>

        <TouchableOpacity
          style={[
            styles.deleteBtn,
            {
              backgroundColor: isConfirmed ? colors.destructive : colors.muted,
              borderRadius: colors.radius,
              opacity: loading ? 0.7 : 1,
            },
          ]}
          onPress={handleDelete}
          disabled={!isConfirmed || loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <>
              <Feather
                name="trash-2"
                size={18}
                color={isConfirmed ? "#fff" : colors.mutedForeground}
              />
              <Text
                style={[
                  styles.deleteBtnText,
                  { color: isConfirmed ? "#fff" : colors.mutedForeground },
                ]}
              >
                Permanently Delete Account
              </Text>
            </>
          )}
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.back()} style={styles.cancelLink}>
          <Text style={[styles.cancelText, { color: colors.primary }]}>
            Keep my account
          </Text>
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
  content: { padding: 16, gap: 14 },
  warningBanner: {
    borderWidth: 1,
    padding: 20,
    alignItems: "center",
    gap: 10,
  },
  warningTitle: { fontSize: 18, fontWeight: "700" as const, fontFamily: "Inter_700Bold" },
  warningText: { fontSize: 13, fontFamily: "Inter_400Regular", textAlign: "center", lineHeight: 20 },
  card: { borderWidth: 1, padding: 16, gap: 12 },
  cardTitle: { fontSize: 14, fontWeight: "700" as const, fontFamily: "Inter_700Bold" },
  consequenceRow: { flexDirection: "row", alignItems: "center", gap: 10 },
  cIcon: { width: 30, height: 30, borderRadius: 8, alignItems: "center", justifyContent: "center" },
  consequenceText: { fontSize: 13, fontFamily: "Inter_400Regular", flex: 1 },
  emailBox: { flexDirection: "row", alignItems: "center", gap: 10, padding: 12 },
  emailText: { fontSize: 14, fontFamily: "Inter_500Medium", fontWeight: "500" as const },
  confirmCard: { borderWidth: 1, padding: 16, gap: 10 },
  confirmLabel: { fontSize: 14, fontFamily: "Inter_400Regular", lineHeight: 20 },
  confirmInput: {
    borderWidth: 1.5,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 15,
    fontFamily: "Inter_700Bold",
    letterSpacing: 2,
  },
  deleteBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    paddingVertical: 16,
  },
  deleteBtnText: { fontSize: 15, fontWeight: "700" as const, fontFamily: "Inter_700Bold" },
  cancelLink: { alignItems: "center", paddingVertical: 8 },
  cancelText: { fontSize: 14, fontFamily: "Inter_600SemiBold", fontWeight: "600" as const },
});
