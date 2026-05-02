import { Feather } from "@expo/vector-icons";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Modal,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { WebView } from "react-native-webview";

import { useColors } from "@/hooks/useColors";

interface Props {
  visible: boolean;
  amount: number;
  email: string;
  name: string;
  phone: string;
  reference: string;
  onSuccess: (reference: string) => void;
  onCancel: () => void;
}

function buildPayUrl(
  amount: number,
  email: string,
  name: string,
  phone: string,
  reference: string
): string {
  const domain = process.env.EXPO_PUBLIC_DOMAIN ?? "";
  const key = process.env.EXPO_PUBLIC_PAYSTACK_PUBLIC_KEY ?? "";
  const nameParts = name.trim().split(" ");
  const firstName = nameParts[0] ?? "";
  const lastName = nameParts.slice(1).join(" ") || firstName;
  const params = new URLSearchParams({
    key,
    email: email.trim(),
    amount: String(Math.round(amount * 100)),
    ref: reference,
    firstName,
    lastName,
    phone: phone.trim(),
    scheme: "firstkokospot",
  });
  return `https://${domain}/api/pay?${params.toString()}`;
}

// ── Native (iOS / Android): full-screen Modal + WebView ──────────────────────
function NativePaystackPayment({
  visible,
  amount,
  email,
  name,
  phone,
  reference,
  onSuccess,
  onCancel,
}: Props) {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const doneRef = useRef(false);

  const payUrl = buildPayUrl(amount, email, name, phone, reference);

  // Reset guard each time we open
  useEffect(() => {
    if (visible) doneRef.current = false;
  }, [visible]);

  const handleMessage = (event: { nativeEvent: { data: string } }) => {
    if (doneRef.current) return;
    try {
      const msg = JSON.parse(event.nativeEvent.data);
      if (msg.type === "success") {
        doneRef.current = true;
        onSuccess(msg.reference ?? reference);
      } else if (msg.type === "cancel") {
        doneRef.current = true;
        onCancel();
      }
    } catch {}
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={() => {
        if (!doneRef.current) {
          doneRef.current = true;
          onCancel();
        }
      }}
    >
      <View
        style={[
          styles.container,
          { backgroundColor: colors.background, paddingTop: insets.top },
        ]}
      >
        <View style={[styles.header, { borderBottomColor: colors.border }]}>
          <Text style={[styles.title, { color: colors.foreground }]}>
            Secure Payment
          </Text>
          <TouchableOpacity
            onPress={() => {
              if (!doneRef.current) {
                doneRef.current = true;
                onCancel();
              }
            }}
            style={styles.closeBtn}
          >
            <Feather name="x" size={22} color={colors.foreground} />
          </TouchableOpacity>
        </View>

        <WebView
          source={{ uri: payUrl }}
          style={styles.webview}
          onMessage={handleMessage}
          originWhitelist={["*"]}
          javaScriptEnabled
          domStorageEnabled
          startInLoadingState
          renderLoading={() => (
            <View style={styles.loader}>
              <ActivityIndicator size="large" color={colors.primary} />
              <Text style={[styles.loaderText, { color: colors.mutedForeground }]}>
                Loading payment…
              </Text>
            </View>
          )}
        />
      </View>
    </Modal>
  );
}

// ── Web: full-screen iframe overlay (no external browser / no tab switch) ─────
function WebPaystackPayment({
  visible,
  amount,
  email,
  name,
  phone,
  reference,
  onSuccess,
  onCancel,
}: Props) {
  const colors = useColors();
  const doneRef = useRef(false);
  const [payUrl, setPayUrl] = useState("");

  useEffect(() => {
    if (visible) {
      doneRef.current = false;
      setPayUrl(buildPayUrl(amount, email, name, phone, reference));
    }
  }, [visible, reference]);

  // Listen for postMessage from iframe
  useEffect(() => {
    if (!visible) return;

    const handler = (event: MessageEvent) => {
      if (doneRef.current) return;
      try {
        const msg =
          typeof event.data === "string" ? JSON.parse(event.data) : event.data;
        if (msg.type === "success") {
          doneRef.current = true;
          onSuccess(msg.reference ?? reference);
        } else if (msg.type === "cancel") {
          doneRef.current = true;
          onCancel();
        }
      } catch {}
    };

    window.addEventListener("message", handler);
    return () => window.removeEventListener("message", handler);
  }, [visible, reference]);

  if (!visible || !payUrl) return null;

  // Render a full-screen iframe overlay via React.createElement
  // (React Native Web renders this straight to the DOM)
  return (
    <View style={styles.webOverlay} pointerEvents="box-none">
      <View
        style={[
          styles.webHeader,
          { backgroundColor: colors.background, borderBottomColor: colors.border },
        ]}
      >
        <Text style={[styles.title, { color: colors.foreground }]}>
          Secure Payment
        </Text>
        <TouchableOpacity
          onPress={() => {
            if (!doneRef.current) {
              doneRef.current = true;
              onCancel();
            }
          }}
          style={styles.closeBtn}
        >
          <Feather name="x" size={22} color={colors.foreground} />
        </TouchableOpacity>
      </View>
      {React.createElement("iframe", {
        src: payUrl,
        style: {
          flex: 1,
          width: "100%",
          border: "none",
          display: "block",
        } as any,
        allow: "payment",
      })}
    </View>
  );
}

// ── Export ────────────────────────────────────────────────────────────────────
export function PaystackPayment(props: Props) {
  if (Platform.OS === "web") {
    return <WebPaystackPayment {...props} />;
  }
  return <NativePaystackPayment {...props} />;
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  title: { fontSize: 18, fontWeight: "700" as const, fontFamily: "Inter_700Bold" },
  closeBtn: { padding: 4 },
  webview: { flex: 1 },
  loader: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: "center",
    justifyContent: "center",
    gap: 16,
  },
  loaderText: { fontSize: 14, fontFamily: "Inter_400Regular" },
  webOverlay: {
    position: "absolute" as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 9999,
    backgroundColor: "#FAF9F7",
    flexDirection: "column" as const,
  },
  webHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 56,
    paddingBottom: 16,
    borderBottomWidth: 1,
  },
});
