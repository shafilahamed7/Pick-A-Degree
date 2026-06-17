"use client";
import { useEffect, useState } from "react";
import Image from "next/image";

export default function SplashScreen() {
  // Only show once per browser session
  const [phase, setPhase] = useState<"in" | "hold" | "out" | "done">("in");

  useEffect(() => {
    if (sessionStorage.getItem("pad-splash-shown")) {
      setPhase("done");
      return;
    }
    sessionStorage.setItem("pad-splash-shown", "1");

    // fade-in → hold → fade-out → done
    const t1 = setTimeout(() => setPhase("hold"), 300);   // after fade-in
    const t2 = setTimeout(() => setPhase("out"),  650);   // start fade-out
    const t3 = setTimeout(() => setPhase("done"), 900);   // unmount

    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, []);

  if (phase === "done") return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        background: "#ffffff",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        opacity: phase === "out" ? 0 : 1,
        transition: phase === "in"
          ? "opacity 0.3s ease-in"
          : phase === "out"
          ? "opacity 0.25s ease-out"
          : "none",
        pointerEvents: phase === "out" ? "none" : "all",
      }}
    >
      <div
        style={{
          transform: phase === "in" ? "scale(0.92)" : "scale(1)",
          opacity: phase === "in" ? 0 : 1,
          transition: "transform 0.35s cubic-bezier(0.34,1.2,0.64,1), opacity 0.3s ease-in",
        }}
      >
        <Image
          src="/logo.png"
          alt="Pick A Degree"
          width={320}
          height={320}
          priority
          style={{ objectFit: "contain" }}
        />
      </div>
    </div>
  );
}
