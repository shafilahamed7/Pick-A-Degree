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
    const t1 = setTimeout(() => setPhase("hold"), 450);   // after fade-in
    const t2 = setTimeout(() => setPhase("out"),  1000);  // start fade-out
    const t3 = setTimeout(() => setPhase("done"), 1350);  // unmount

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
          ? "opacity 0.45s ease-in"
          : phase === "out"
          ? "opacity 0.35s ease-out"
          : "none",
        pointerEvents: phase === "out" ? "none" : "all",
      }}
    >
      <div
        style={{
          transform: phase === "in" ? "scale(0.88)" : "scale(1)",
          opacity: phase === "in" ? 0 : 1,
          transition: "transform 0.5s cubic-bezier(0.22,1.2,0.36,1), opacity 0.45s ease-in",
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
