import React, { useRef } from "react";
import { Modal, StyleSheet, View, Text, TouchableOpacity, ActivityIndicator } from "react-native";
import PaystackWebView from "react-native-paystack-webview";
import { Feather } from "@expo/vector-icons";
import { useColors } from "@/hooks/useColors";

interface Props {
  visible: boolean;
  amount: number;
  email: string;
  reference: string;
  onSuccess: (reference: string) => void;
  onCancel: () => void;
}

export function PaystackPayment({ visible, amount, email, reference, onSuccess, onCancel }: Props) {
  const colors = useColors();
  const paystackKey = process.env.EXPO_PUBLIC_PAYSTACK_PUBLIC_KEY ?? "";

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onCancel}
    >
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={[styles.header, { borderBottomColor: colors.border }]}>
          <Text style={[styles.title, { color: colors.foreground }]}>Secure Payment</Text>
          <TouchableOpacity onPress={onCancel} style={styles.closeBtn}>
            <Feather name="x" size={22} color={colors.foreground} />
          </TouchableOpacity>
        </View>

        <PaystackWebView
          paystackKey={paystackKey}
          amount={Math.round(amount * 100)}
          billingEmail={email}
          currency="GHS"
          refNumber={reference}
          onCancel={onCancel}
          onSuccess={(res: any) => {
            const ref = res?.transactionRef?.reference ?? reference;
            onSuccess(ref);
          }}
          autoStart
          ActivityIndicatorColor={colors.primary}
          SafeAreaViewContainer={{ flex: 1 }}
          renderLoader={() => (
            <View style={styles.loader}>
              <ActivityIndicator size="large" color={colors.primary} />
              <Text style={[styles.loaderText, { color: colors.mutedForeground }]}>
                Loading payment...
              </Text>
            </View>
          )}
        />
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: "700" as const,
    fontFamily: "Inter_700Bold",
  },
  closeBtn: {
    padding: 4,
  },
  loader: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 16,
  },
  loaderText: {
    fontSize: 14,
    fontFamily: "Inter_400Regular",
  },
});
