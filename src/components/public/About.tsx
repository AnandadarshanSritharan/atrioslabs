"use client";

import { useEffect, useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Target, Eye, TrendingUp } from "lucide-react";
import AnimatedSection from "@/components/shared/AnimatedSection";

interface AboutData {
  mission: string;
  vision: string;
  description: string;
  stats: { projects: number; clients: number; years: number; team: number };
}

function AnimatedCounter({ target, suffix = "" }: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const step = target / 50;
    const timer = setInterval(() => {
      start += step;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 30);
    return () => clearInterval(timer);
  }, [inView, target]);

  return (
    <span ref={ref} className="gradient-text">
      {count}
      {suffix}
    </span>
  );
}

export default function About() {
  const [about, setAbout] = useState<AboutData | null>(null);

  useEffect(() => {
    fetch("/api/about")
      .then((r) => r.json())
      .then((d) => setAbout(d.data))
      .catch(() => {});
  }, []);

  const description =
    about?.description ||
    "Atrios Labs is a forward-thinking technology company specializing in web development, IoT solutions, AI automation, and application development. We combine deep technical expertise with creative design to build products that matter.";

  const mission =
    about?.mission ||
    "To empower businesses with cutting-edge technology solutions that drive growth, efficiency, and innovation — making the digital future accessible to all.";

  const vision =
    about?.vision ||
    "To be the most trusted technology partner globally, transforming ideas into intelligent, scalable solutions that shape the next generation of digital experiences.";

  const stats = about?.stats || { projects: 50, clients: 30, years: 5, team: 20 };

  return (
    <section id="about" className="section-padding" style={{ background: "#0A0A0F" }}>
      <div className="container-max">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left: Visual */}
          <AnimatedSection direction="left">
            <div className="relative">
              {/* Main graphic */}
              <div
                className="rounded-3xl p-8 relative overflow-hidden"
                style={{
                  background: "linear-gradient(135deg, rgba(124,58,237,0.1), rgba(37,99,235,0.05))",
                  border: "1px solid rgba(124,58,237,0.2)",
                }}
              >
                {/* Decorative circle */}
                <div
                  className="absolute top-0 right-0 w-64 h-64 rounded-full opacity-10 -translate-y-1/2 translate-x-1/2"
                  style={{ background: "radial-gradient(circle, #7C3AED, transparent)" }}
                />

                <div className="relative z-10">
                  <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                    Who We <span className="gradient-text">Are</span>
                  </h2>
                  <p className="text-slate-400 leading-relaxed text-lg mb-8">
                    {description}
                  </p>

                  {/* Stats grid */}
                  <div className="grid grid-cols-2 gap-4">
                    {[
                      { value: stats.projects, suffix: "+", label: "Projects" },
                      { value: stats.clients, suffix: "+", label: "Clients" },
                      { value: stats.years, suffix: "+", label: "Years" },
                      { value: stats.team, suffix: "+", label: "Team" },
                    ].map((s, i) => (
                      <div
                        key={i}
                        className="rounded-xl p-4 text-center"
                        style={{
                          background: "rgba(18,18,26,0.8)",
                          border: "1px solid rgba(42,42,62,0.6)",
                        }}
                      >
                        <div className="text-2xl font-bold mb-1">
                          <AnimatedCounter target={s.value} suffix={s.suffix} />
                        </div>
                        <div className="text-xs text-slate-500">{s.label}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Floating badge */}
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -bottom-6 -right-6 rounded-2xl px-5 py-3 shadow-glow"
                style={{
                  background: "linear-gradient(135deg, #7C3AED, #2563EB)",
                }}
              >
                <span className="text-white text-sm font-semibold">🚀 Innovation First</span>
              </motion.div>
            </div>
          </AnimatedSection>

          {/* Right: Mission + Vision */}
          <div className="space-y-6">
            <AnimatedSection delay={0.1}>
              <span className="section-label">About Atrios Labs</span>
              <h2 className="text-3xl md:text-4xl font-bold text-white mt-2 mb-8">
                Driven by Purpose,
                <br />
                <span className="gradient-text">Built for Impact</span>
              </h2>
            </AnimatedSection>

            {/* Mission Card */}
            <AnimatedSection delay={0.2}>
              <div
                className="rounded-2xl p-6 group hover:shadow-glow transition-all duration-300"
                style={{
                  background: "rgba(124,58,237,0.08)",
                  border: "1px solid rgba(124,58,237,0.2)",
                }}
              >
                <div className="flex items-start gap-4">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: "rgba(124,58,237,0.2)" }}
                  >
                    <Target className="w-6 h-6 text-violet-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white mb-2">Our Mission</h3>
                    <p className="text-slate-400 leading-relaxed text-sm">{mission}</p>
                  </div>
                </div>
              </div>
            </AnimatedSection>

            {/* Vision Card */}
            <AnimatedSection delay={0.3}>
              <div
                className="rounded-2xl p-6 group hover:shadow-glow-blue transition-all duration-300"
                style={{
                  background: "rgba(37,99,235,0.08)",
                  border: "1px solid rgba(37,99,235,0.2)",
                }}
              >
                <div className="flex items-start gap-4">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: "rgba(37,99,235,0.2)" }}
                  >
                    <Eye className="w-6 h-6 text-blue-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white mb-2">Our Vision</h3>
                    <p className="text-slate-400 leading-relaxed text-sm">{vision}</p>
                  </div>
                </div>
              </div>
            </AnimatedSection>

            {/* Values strip */}
            <AnimatedSection delay={0.4}>
              <div
                className="rounded-2xl p-6"
                style={{
                  background: "rgba(6,182,212,0.06)",
                  border: "1px solid rgba(6,182,212,0.15)",
                }}
              >
                <div className="flex items-center gap-3 mb-3">
                  <TrendingUp className="w-5 h-5 text-cyan-400" />
                  <h3 className="text-base font-semibold text-white">Our Values</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {["Innovation", "Quality", "Transparency", "Collaboration", "Impact"].map((v) => (
                    <span
                      key={v}
                      className="px-3 py-1 rounded-full text-xs font-medium text-cyan-300"
                      style={{ background: "rgba(6,182,212,0.1)", border: "1px solid rgba(6,182,212,0.2)" }}
                    >
                      {v}
                    </span>
                  ))}
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </div>
    </section>
  );
}
