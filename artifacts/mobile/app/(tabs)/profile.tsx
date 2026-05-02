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

import { useAuth } from "@/context/AuthContext";
import { useColors } from "@/hooks/useColors";

interface SettingRowProps {
  icon: string;
  label: string;
  value?: string;
  onPress?: () => void;
  showChevron?: boolean;
  danger?: boolean;
}

function SettingRow({
  icon,
  label,
  value,
  onPress,
  showChevron = true,
  danger = false,
}: SettingRowProps) {
  const colors = useColors();

  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.settingRow, { borderBottomColor: colors.border }]}
      activeOpacity={0.7}
    >
      <View
        style={[
          styles.iconContainer,
          {
            backgroundColor: danger ? colors.destructive + "15" : colors.secondary,
            borderRadius: colors.radius / 1.5,
          },
        ]}
      >
        <Feather
          name={icon as any}
          size={18}
          color={danger ? colors.destructive : colors.primary}
        />
      </View>
      <Text
        style={[
          styles.settingLabel,
          { color: danger ? colors.destructive : colors.foreground },
        ]}
      >
        {label}
      </Text>
      <View style={styles.settingRight}>
        {value && (
          <Text style={[styles.settingValue, { color: colors.mutedForeground }]}>
            {value}
          </Text>
        )}
        {showChevron && (
          <Feather name="chevron-right" size={16} color={colors.mutedForeground} />
        )}
      </View>
    </TouchableOpacity>
  );
}

export default function ProfileScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { user, signOut } = useAuth();

  const topPad = Platform.OS === "web" ? Math.max(insets.top, 67) : insets.top;
  const bottomPad = Platform.OS === "web" ? 34 + 84 : 100;

  const displayName =
    user?.user_metadata?.full_name ??
    user?.email?.split("@")[0] ??
    "Guest";
  const initial = displayName[0]?.toUpperCase() ?? "K";
  const email = user?.email ?? "";

  const handleSignOut = () => {
    Alert.alert("Sign Out", "Are you sure you want to sign out?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Sign Out",
        style: "destructive",
        onPress: signOut,
      },
    ]);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.content,
          { paddingTop: topPad + 16, paddingBottom: bottomPad },
        ]}
      >
        <Text style={[styles.screenTitle, { color: colors.foreground }]}>
          Profile
        </Text>

        <View
          style={[
            styles.avatarSection,
            {
              backgroundColor: colors.card,
              borderRadius: colors.radius * 1.5,
              borderColor: colors.border,
            },
          ]}
        >
          <View
            style={[
              styles.avatar,
              { backgroundColor: colors.primary, borderRadius: 100 },
            ]}
          >
            <Text style={[styles.avatarInitial, { color: colors.primaryForeground }]}>
              {initial}
            </Text>
          </View>
          <View style={styles.userInfo}>
            <Text style={[styles.userName, { color: colors.foreground }]}>
              {displayName}
            </Text>
            {email ? (
              <Text style={[styles.userEmail, { color: colors.mutedForeground }]}>
                {email}
              </Text>
            ) : null}
          </View>
          <Feather name="edit-2" size={18} color={colors.mutedForeground} />
        </View>

        <View
          style={[
            styles.section,
            { backgroundColor: colors.card, borderRadius: colors.radius, borderColor: colors.border },
          ]}
        >
          <Text style={[styles.sectionLabel, { color: colors.mutedForeground }]}>
            Account
          </Text>
          <SettingRow
            icon="map-pin"
            label="Saved Addresses"
            onPress={() => router.push("/saved-addresses" as any)}
          />
          <SettingRow
            icon="credit-card"
            label="Payment Methods"
            onPress={() => router.push("/payment-methods" as any)}
          />
          <SettingRow
            icon="tag"
            label="Promo Codes"
            onPress={() => router.push("/promo-codes" as any)}
          />
          <SettingRow
            icon="gift"
            label="Loyalty Points"
            value="1,240 pts"
            onPress={() => router.push("/loyalty-points" as any)}
          />
        </View>

        <View
          style={[
            styles.section,
            { backgroundColor: colors.card, borderRadius: colors.radius, borderColor: colors.border },
          ]}
        >
          <Text style={[styles.sectionLabel, { color: colors.mutedForeground }]}>
            Preferences
          </Text>
          <SettingRow
            icon="bell"
            label="Notifications"
            onPress={() => router.push("/notifications" as any)}
          />
          <SettingRow
            icon="moon"
            label="Dark Mode"
            onPress={() => router.push("/dark-mode" as any)}
          />
          <SettingRow
            icon="globe"
            label="Language"
            value="English"
            onPress={() => router.push("/language" as any)}
          />
        </View>

        <View
          style={[
            styles.section,
            { backgroundColor: colors.card, borderRadius: colors.radius, borderColor: colors.border },
          ]}
        >
          <Text style={[styles.sectionLabel, { color: colors.mutedForeground }]}>
            Support
          </Text>
          <SettingRow
            icon="help-circle"
            label="Help Center"
            onPress={() => router.push("/help-center" as any)}
          />
          <SettingRow
            icon="shield"
            label="Privacy Policy"
            onPress={() => router.push("/privacy-policy" as any)}
          />
          <SettingRow
            icon="file-text"
            label="Terms of Service"
            onPress={() => router.push("/terms-of-service" as any)}
          />
        </View>

        <View
          style={[
            styles.section,
            { backgroundColor: colors.card, borderRadius: colors.radius, borderColor: colors.border },
          ]}
        >
          <SettingRow
            icon="trash-2"
            label="Delete Account"
            showChevron
            danger
            onPress={() => router.push("/delete-account" as any)}
          />
          <SettingRow
            icon="log-out"
            label="Sign Out"
            showChevron={false}
            danger
            onPress={handleSignOut}
          />
        </View>

        <Text style={[styles.version, { color: colors.mutedForeground }]}>
          1st Koko Spot · Version 1.0.0
        </Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { paddingHorizontal: 16, gap: 16 },
  screenTitle: {
    fontSize: 26,
    fontWeight: "700" as const,
    fontFamily: "Inter_700Bold",
    marginBottom: 4,
  },
  avatarSection: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    gap: 14,
    borderWidth: 1,
  },
  avatar: {
    width: 52,
    height: 52,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarInitial: {
    fontSize: 22,
    fontWeight: "700" as const,
    fontFamily: "Inter_700Bold",
  },
  userInfo: { flex: 1 },
  userName: {
    fontSize: 17,
    fontWeight: "600" as const,
    fontFamily: "Inter_600SemiBold",
  },
  userEmail: {
    fontSize: 13,
    fontFamily: "Inter_400Regular",
    marginTop: 2,
  },
  section: { borderWidth: 1, overflow: "hidden" },
  sectionLabel: {
    fontSize: 11,
    fontFamily: "Inter_600SemiBold",
    fontWeight: "600" as const,
    textTransform: "uppercase",
    letterSpacing: 0.8,
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 6,
  },
  settingRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
    borderBottomWidth: 1,
  },
  iconContainer: {
    width: 34,
    height: 34,
    alignItems: "center",
    justifyContent: "center",
  },
  settingLabel: {
    flex: 1,
    fontSize: 15,
    fontFamily: "Inter_400Regular",
  },
  settingRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  settingValue: {
    fontSize: 13,
    fontFamily: "Inter_400Regular",
  },
  version: {
    textAlign: "center",
    fontSize: 12,
    fontFamily: "Inter_400Regular",
    marginTop: 4,
  },
});
