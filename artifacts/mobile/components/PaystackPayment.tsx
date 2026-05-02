import * as Linking from "expo-linking";
import * as WebBrowser from "expo-web-browser";
import { useEffect, useRef } from "react";

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
      toolbarColor: "#FAF9F7",
    }).then(() => {
      subscription.remove();
      if (!completedRef.current) {
        completedRef.current = true;
        onCancel();
      }
    });

    return () => {
      subscription.remove();
    };
  }, [visible, reference]);

  return null;
}
