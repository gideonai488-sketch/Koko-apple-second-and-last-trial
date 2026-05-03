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

function buildPaystackHTML(
  key: string,
  email: string,
  amountPesewas: number,
  ref: string,
  firstName: string,
  lastName: string,
  phone: string
): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1,user-scalable=no"/>
  <title>Secure Payment</title>
  <style>
    *{box-sizing:border-box;margin:0;padding:0}
    body{font-family:-apple-system,sans-serif;background:#FAF9F7}
    #loading{display:flex;flex-direction:column;align-items:center;justify-content:center;min-height:100vh;gap:16px;color:#9C9A96}
    .spinner{width:44px;height:44px;border:3px solid #F0EDE8;border-top-color:#FF5C35;border-radius:50%;animation:spin .8s linear infinite}
    @keyframes spin{to{transform:rotate(360deg)}}
    p{font-size:14px}
  </style>
</head>
<body>
  <div id="loading"><div class="spinner"></div><p>Opening secure checkout…</p></div>
  <script src="https://js.paystack.co/v1/inline.js"></script>
  <script>
    function send(data){
      var msg=JSON.stringify(data);
      if(window.ReactNativeWebView){window.ReactNativeWebView.postMessage(msg);}
      else if(window.parent!==window){window.parent.postMessage(msg,'*');}
    }
    window.onload=function(){
      try{
        var h=PaystackPop.setup({
          key:'${key}',
          email:'${email}',
          amount:${amountPesewas},
          currency:'GHS',
          ref:'${ref}',
          firstname:'${firstName}',
          lastname:'${lastName}',
          phone:'${phone}',
          callback:function(r){send({type:'success',reference:r.reference||'${ref}'});},
          onClose:function(){send({type:'cancel'});}
        });
        h.openIframe();
      }catch(e){send({type:'error',message:e.message});}
    };
  </script>
</body>
</html>`;
}

function parseNameParts(name: string) {
  const parts = name.trim().split(" ");
  const firstName = parts[0] ?? "";
  const lastName = parts.slice(1).join(" ") || firstName;
  return { firstName, lastName };
}

// ── Native (iOS / Android): Modal + WebView with inline HTML ─────────────────
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

  useEffect(() => {
    if (visible) doneRef.current = false;
  }, [visible, reference]);

  const paystackKey = process.env.EXPO_PUBLIC_PAYSTACK_PUBLIC_KEY ?? "";
  const { firstName, lastName } = parseNameParts(name);
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
        if (!doneRef.current) { doneRef.current = true; onCancel(); }
      }}
    >
      <View style={[styles.container, { backgroundColor: colors.background, paddingTop: insets.top }]}>
        <View style={[styles.header, { borderBottomColor: colors.border }]}>
          <Text style={[styles.title, { color: colors.foreground }]}>Secure Payment</Text>
          <TouchableOpacity
            onPress={() => { if (!doneRef.current) { doneRef.current = true; onCancel(); } }}
            style={styles.closeBtn}
          >
            <Feather name="x" size={22} color={colors.foreground} />
          </TouchableOpacity>
        </View>
        <WebView
          source={{
            html,
            baseUrl: "https://paystack.com",
          }}
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

// ── Web: full-screen iframe overlay with blob URL ────────────────────────────
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
  const [blobUrl, setBlobUrl] = useState("");

  useEffect(() => {
    if (!visible) return;
    doneRef.current = false;

    const paystackKey = process.env.EXPO_PUBLIC_PAYSTACK_PUBLIC_KEY ?? "";
    const { firstName, lastName } = parseNameParts(name);
    const html = buildPaystackHTML(
      paystackKey,
      email,
      Math.round(amount * 100),
      reference,
      firstName,
      lastName,
      phone
    );

    const blob = new Blob([html], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    setBlobUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [visible, reference]);

  useEffect(() => {
    if (!visible) return;
    const handler = (event: MessageEvent) => {
      if (doneRef.current) return;
      try {
        const msg = typeof event.data === "string" ? JSON.parse(event.data) : event.data;
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

  if (!visible || !blobUrl) return null;

  return (
    <View style={styles.webOverlay}>
      <View style={[styles.webHeader, { backgroundColor: colors.background, borderBottomColor: colors.border }]}>
        <Text style={[styles.title, { color: colors.foreground }]}>Secure Payment</Text>
        <TouchableOpacity
          onPress={() => { if (!doneRef.current) { doneRef.current = true; onCancel(); } }}
          style={styles.closeBtn}
        >
          <Feather name="x" size={22} color={colors.foreground} />
        </TouchableOpacity>
      </View>
      {React.createElement("iframe", {
        src: blobUrl,
        style: { flex: 1, width: "100%", border: "none", display: "block" } as any,
        allow: "payment",
      })}
    </View>
  );
}

// ── Export ────────────────────────────────────────────────────────────────────
export function PaystackPayment(props: Props) {
  if (Platform.OS === "web") return <WebPaystackPayment {...props} />;
  return <NativePaystackPayment {...props} />;
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: "row", alignItems: "center", justifyContent: "space-between",
    paddingHorizontal: 20, paddingVertical: 16, borderBottomWidth: 1,
  },
  title: { fontSize: 18, fontWeight: "700" as const, fontFamily: "Inter_700Bold" },
  closeBtn: { padding: 4 },
  webview: { flex: 1 },
  loader: {
    position: "absolute", top: 0, left: 0, right: 0, bottom: 0,
    alignItems: "center", justifyContent: "center", gap: 16,
  },
  loaderText: { fontSize: 14, fontFamily: "Inter_400Regular" },
  webOverlay: {
    position: "absolute" as const,
    top: 0, left: 0, right: 0, bottom: 0,
    zIndex: 9999, backgroundColor: "#FAF9F7",
    flexDirection: "column" as const,
  },
  webHeader: {
    flexDirection: "row", alignItems: "center", justifyContent: "space-between",
    paddingHorizontal: 20, paddingTop: 56, paddingBottom: 16, borderBottomWidth: 1,
  },
});
