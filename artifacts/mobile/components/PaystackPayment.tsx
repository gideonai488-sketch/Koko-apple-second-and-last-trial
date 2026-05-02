import { Feather } from "@expo/vector-icons";
import React from "react";
import {
  ActivityIndicator,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { WebView } from "react-native-webview";
import { useSafeAreaInsets } from "react-native-safe-area-context";

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
  amount: number,
  ref: string,
  firstName: string,
  lastName: string,
  phone: string
) {
  const amountInPesewas = Math.round(amount * 100);
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0" />
  <title>Payment</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { background: #fff; font-family: -apple-system, sans-serif; }
    #loading {
      display: flex; flex-direction: column; align-items: center;
      justify-content: center; height: 100vh; gap: 16px; color: #9C9A96;
    }
    .spinner {
      width: 40px; height: 40px; border: 3px solid #F4F3F0;
      border-top-color: #FF5C35; border-radius: 50%;
      animation: spin 0.8s linear infinite;
    }
    @keyframes spin { to { transform: rotate(360deg); } }
  </style>
</head>
<body>
  <div id="loading">
    <div class="spinner"></div>
    <p>Loading secure payment…</p>
  </div>
  <script src="https://js.paystack.co/v1/inline.js"></script>
  <script>
    function sendMsg(data) {
      var msg = JSON.stringify(data);
      if (window.ReactNativeWebView) {
        window.ReactNativeWebView.postMessage(msg);
      } else {
        window.parent.postMessage(msg, '*');
      }
    }

    window.onload = function () {
      document.getElementById('loading').style.display = 'none';
      try {
        var handler = PaystackPop.setup({
          key: '${key}',
          email: '${email}',
          amount: ${amountInPesewas},
          currency: 'GHS',
          ref: '${ref}',
          firstname: '${firstName}',
          lastname: '${lastName}',
          phone: '${phone}',
          callback: function (response) {
            sendMsg({ type: 'success', reference: response.reference || '${ref}' });
          },
          onClose: function () {
            sendMsg({ type: 'cancel' });
          }
        });
        handler.openIframe();
      } catch (e) {
        sendMsg({ type: 'error', message: e.message });
      }
    };
  </script>
</body>
</html>`;
}

export function PaystackPayment({
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
    amount,
    reference,
    firstName,
    lastName,
    phone
  );

  const handleMessage = (event: { nativeEvent: { data: string } }) => {
    try {
      const msg = JSON.parse(event.nativeEvent.data);
      if (msg.type === "success") {
        onSuccess(msg.reference ?? reference);
      } else if (msg.type === "cancel") {
        onCancel();
      }
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
          <Text style={[styles.title, { color: colors.foreground }]}>
            Secure Payment
          </Text>
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
  container: { flex: 1 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: "700" as const,
    fontFamily: "Inter_700Bold",
  },
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
  loaderText: {
    fontSize: 14,
    fontFamily: "Inter_400Regular",
  },
});
