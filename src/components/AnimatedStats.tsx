"use client";
import { useEffect, useRef, useState } from "react";

const stats = [
  { label: "Colleges", end: 119, suffix: "+", icon: "🏛️" },
  { label: "Courses", end: 5000, suffix: "+", icon: "📚" },
  { label: "Scholarships", end: 15, suffix: "+", icon: "🎓" },
  { label: "Entrance Exams", end: 11, suffix: "+", icon: "📝" },
];

function useCountUp(end: number, duration = 1800, start = false) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!start) return;
    let startTime: number;
    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * end));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [end, duration, start]);
  return count;
}

function StatItem({ label, end, suffix, icon }: typeof stats[0]) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const count = useCountUp(end, 1800, visible);

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true); }, { threshold: 0.3 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  return (
    <div ref={ref} className="py-7 px-8 text-center">
      <div className="text-3xl mb-2">{icon}</div>
      <div className="text-3xl font-extrabold text-slate-900 tabular-nums">
        {count.toLocaleString("en-IN")}{suffix}
      </div>
      <div className="text-sm text-slate-500 mt-1 font-medium">{label}</div>
    </div>
  );
}

export default function AnimatedStats() {
  return (
    <section className="bg-white border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 divide-x divide-slate-100">
        {stats.map((s) => <StatItem key={s.label} {...s} />)}
      </div>
    </section>
  );
}
