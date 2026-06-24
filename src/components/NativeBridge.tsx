"use client";
import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Capacitor } from "@capacitor/core";

export default function NativeBridge() {
  const pathname = usePathname();
  const router = useRouter();

  // One-time native setup: status bar, splash hide, haptic taps
  useEffect(() => {
    if (!Capacitor.isNativePlatform()) return;

    (async () => {
      const [{ StatusBar, Style }, { SplashScreen }] = await Promise.all([
        import("@capacitor/status-bar"),
        import("@capacitor/splash-screen"),
      ]);
      await StatusBar.setBackgroundColor({ color: "#4f46e5" });
      await StatusBar.setStyle({ style: Style.Dark });
      await SplashScreen.hide();
    })();

    let cleanupHaptics: (() => void) | undefined;
    (async () => {
      const { Haptics, ImpactStyle } = await import("@capacitor/haptics");
      const handler = (e: MouseEvent) => {
        const target = (e.target as HTMLElement)?.closest("button, a");
        if (target) Haptics.impact({ style: ImpactStyle.Light }).catch(() => {});
      };
      document.addEventListener("click", handler, { passive: true });
      cleanupHaptics = () => document.removeEventListener("click", handler);
    })();

    return () => cleanupHaptics?.();
  }, []);

  // Android hardware back button: go back in history, or confirm exit on home
  useEffect(() => {
    if (!Capacitor.isNativePlatform()) return;

    let listenerHandle: { remove: () => void } | undefined;
    (async () => {
      const { App } = await import("@capacitor/app");
      const sub = await App.addListener("backButton", () => {
        if (pathname === "/" || pathname === "") {
          App.exitApp();
        } else {
          router.back();
        }
      });
      listenerHandle = sub;
    })();

    return () => listenerHandle?.remove();
  }, [pathname, router]);

  return null;
}
