import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
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

import { useColors } from "@/hooks/useColors";

interface Address {
  id: string;
  label: string;
  address: string;
  isDefault: boolean;
}

const SAMPLE: Address[] = [
  { id: "1", label: "Home", address: "14 Osu Road, Accra, Ghana", isDefault: true },
  { id: "2", label: "Office", address: "Ring Road Central, Accra, Ghana", isDefault: false },
];

export default function SavedAddressesScreen() {
  const colors = useColors();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const topPad = Platform.OS === "web" ? Math.max(insets.top, 67) : insets.top;

  const [addresses, setAddresses] = useState<Address[]>(SAMPLE);

  const removeAddress = (id: string) => {
    Alert.alert("Remove Address", "Remove this saved address?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Remove",
        style: "destructive",
        onPress: () => setAddresses((a) => a.filter((x) => x.id !== id)),
      },
    ]);
  };

  const setDefault = (id: string) => {
    setAddresses((prev) => prev.map((a) => ({ ...a, isDefault: a.id === id })));
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
        <Text style={[styles.title, { color: colors.foreground }]}>
          Saved Addresses
        </Text>
        <View style={{ width: 30 }} />
      </View>

      <ScrollView
        contentContainerStyle={[
          styles.content,
          { paddingBottom: insets.bottom + 100 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {addresses.map((addr) => (
          <View
            key={addr.id}
            style={[
              styles.card,
              {
                backgroundColor: colors.card,
                borderColor: addr.isDefault ? colors.primary : colors.border,
                borderRadius: colors.radius,
              },
            ]}
          >
            <View style={styles.cardLeft}>
              <View
                style={[
                  styles.labelBadge,
                  { backgroundColor: colors.primary + "15" },
                ]}
              >
                <Feather
                  name={addr.label === "Home" ? "home" : "briefcase"}
                  size={14}
                  color={colors.primary}
                />
                <Text style={[styles.labelText, { color: colors.primary }]}>
                  {addr.label}
                </Text>
                {addr.isDefault && (
                  <View
                    style={[
                      styles.defaultPill,
                      { backgroundColor: colors.primary },
                    ]}
                  >
                    <Text style={styles.defaultText}>Default</Text>
                  </View>
                )}
              </View>
              <Text style={[styles.addressText, { color: colors.foreground }]}>
                {addr.address}
              </Text>
            </View>
            <View style={styles.cardActions}>
              {!addr.isDefault && (
                <TouchableOpacity
                  onPress={() => setDefault(addr.id)}
                  style={styles.actionBtn}
                >
                  <Feather name="check-circle" size={18} color={colors.mutedForeground} />
                </TouchableOpacity>
              )}
              <TouchableOpacity
                onPress={() => removeAddress(addr.id)}
                style={styles.actionBtn}
              >
                <Feather name="trash-2" size={18} color={colors.destructive} />
              </TouchableOpacity>
            </View>
          </View>
        ))}

        <TouchableOpacity
          style={[
            styles.addBtn,
            {
              borderColor: colors.primary,
              borderRadius: colors.radius,
              backgroundColor: colors.primary + "10",
            },
          ]}
          onPress={() =>
            Alert.alert(
              "Add Address",
              "Address picker coming soon. Use the map to drop a pin."
            )
          }
        >
          <Feather name="plus" size={20} color={colors.primary} />
          <Text style={[styles.addBtnText, { color: colors.primary }]}>
            Add New Address
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
  title: {
    flex: 1,
    fontSize: 20,
    fontWeight: "700" as const,
    fontFamily: "Inter_700Bold",
    textAlign: "center",
  },
  content: { padding: 16, gap: 12 },
  card: {
    borderWidth: 1.5,
    padding: 14,
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
  },
  cardLeft: { flex: 1, gap: 6 },
  labelBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    alignSelf: "flex-start",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  labelText: {
    fontSize: 13,
    fontWeight: "600" as const,
    fontFamily: "Inter_600SemiBold",
  },
  defaultPill: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  defaultText: {
    color: "#fff",
    fontSize: 10,
    fontFamily: "Inter_600SemiBold",
  },
  addressText: {
    fontSize: 14,
    fontFamily: "Inter_400Regular",
    lineHeight: 20,
  },
  cardActions: { flexDirection: "row", gap: 4 },
  actionBtn: { padding: 6 },
  addBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    padding: 16,
    borderWidth: 1.5,
    borderStyle: "dashed",
    marginTop: 4,
  },
  addBtnText: {
    fontSize: 15,
    fontWeight: "600" as const,
    fontFamily: "Inter_600SemiBold",
  },
});
