import { Feather } from "@expo/vector-icons";
import * as Linking from "expo-linking";
import * as WebBrowser from "expo-web-browser";
import React, { useEffect, useRef } from "react";
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

function buildPaystackHTML(
  key: string,
  email: string,
  amountPesewas: number,
  ref: string,
  firstName: string,
  lastName: string,
  phone: string
) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
  <title>Secure Payment</title>
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: -apple-system, sans-serif; background: #FAF9F7; }
    #loading {
      display: flex; flex-direction: column; align-items: center;
      justify-content: center; min-height: 100vh; gap: 16px; color: #9C9A96;
    }
    .spinner {
      width: 44px; height: 44px; border: 3px solid #F0EDE8;
      border-top-color: #FF5C35; border-radius: 50%;
      animation: spin 0.8s linear infinite;
    }
    @keyframes spin { to { transform: rotate(360deg); } }
    p { font-size: 14px; }
  </style>
</head>
<body>
  <div id="loading">
    <div class="spinner"></div>
    <p>Opening secure checkout…</p>
  </div>
  <script src="https://js.paystack.co/v1/inline.js"></script>
  <script>
    function send(data) {
      var msg = JSON.stringify(data);
      if (window.ReactNativeWebView) { window.ReactNativeWebView.postMessage(msg); }
      else { window.parent.postMessage(msg, '*'); }
    }
    window.onload = function () {
      try {
        var handler = PaystackPop.setup({
          key:       '${key}',
          email:     '${email}',
          amount:    ${amountPesewas},
          currency:  'GHS',
          ref:       '${ref}',
          firstname: '${firstName}',
          lastname:  '${lastName}',
          phone:     '${phone}',
          callback:  function (r) { send({ type: 'success', reference: r.reference || '${ref}' }); },
          onClose:   function ()  { send({ type: 'cancel' }); }
        });
        handler.openIframe();
      } catch (e) { send({ type: 'error', message: e.message }); }
    };
  </script>
</body>
</html>`;
}

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
  const paystackKey = process.env.EXPO_PUBLIC_PAYSTACK_PUBLIC_KEY ?? "";
  const nameParts = name.trim().split(" ");
  const firstName = nameParts[0] ?? "";
  const lastName = nameParts.slice(1).join(" ") || firstName;
  const html = buildPaystackHTML(
    paystackKey,
    email,
    Math.round(amount * 100),
    reference,
    firstName,
    lastName,
    phone
  );

  const handleMessage = (event: { nativeEvent: { data: string } }) => {
    try {
      const msg = JSON.parse(event.nativeEvent.data);
      if (msg.type === "success") onSuccess(msg.reference ?? reference);
      else if (msg.type === "cancel") onCancel();
    } catch {}
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onCancel}
    >
      <View
        style={[
          styles.container,
          { backgroundColor: colors.background, paddingTop: insets.top },
        ]}
      >
        <View style={[styles.header, { borderBottomColor: colors.border }]}>
          <Text style={[styles.title, { color: colors.foreground }]}>Secure Payment</Text>
          <TouchableOpacity onPress={onCancel} style={styles.closeBtn}>
            <Feather name="x" size={22} color={colors.foreground} />
          </TouchableOpacity>
        </View>
        <WebView
          source={{ html }}
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
  const completedRef = useRef(false);

  useEffect(() => {
    if (!visible) return;
    completedRef.current = false;

    const domain = process.env.EXPO_PUBLIC_DOMAIN ?? "";
    const paystackKey = process.env.EXPO_PUBLIC_PAYSTACK_PUBLIC_KEY ?? "";
    const nameParts = name.trim().split(" ");
    const firstName = nameParts[0] ?? "";
    const lastName = nameParts.slice(1).join(" ") || firstName;

    const params = new URLSearchParams({
      key: paystackKey,
      email: email.trim(),
      amount: String(Math.round(amount * 100)),
      ref: reference,
      firstName,
      lastName,
      phone: phone.trim(),
      scheme: "firstkokospot",
    });

    const payUrl = `https://${domain}/api/pay?${params.toString()}`;

    const subscription = Linking.addEventListener("url", ({ url }) => {
      if (completedRef.current) return;
      if (url.includes("payment-success")) {
        completedRef.current = true;
        const refMatch = url.match(/ref=([^&]+)/);
        const ref = refMatch ? decodeURIComponent(refMatch[1]) : reference;
        subscription.remove();
        WebBrowser.dismissBrowser();
        onSuccess(ref);
      } else if (url.includes("payment-cancel")) {
        completedRef.current = true;
        subscription.remove();
        WebBrowser.dismissBrowser();
        onCancel();
      }
    });

    WebBrowser.openBrowserAsync(payUrl, {
      dismissButtonStyle: "cancel",
      presentationStyle: WebBrowser.WebBrowserPresentationStyle.PAGE_SHEET,
      controlsColor: "#FF5C35",
    }).then(() => {
      subscription.remove();
      if (!completedRef.current) {
        completedRef.current = true;
        onCancel();
      }
    });

    return () => { subscription.remove(); };
  }, [visible, reference]);

  return null;
}

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
    top: 0, left: 0, right: 0, bottom: 0,
    alignItems: "center",
    justifyContent: "center",
    gap: 16,
  },
  loaderText: { fontSize: 14, fontFamily: "Inter_400Regular" },
});
