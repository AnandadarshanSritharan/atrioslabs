"use client";

import { motion } from "framer-motion";
import { Shield, Zap, Users, BarChart3, Headphones, Code2 } from "lucide-react";
import AnimatedSection from "@/components/shared/AnimatedSection";

const strengths = [
  {
    icon: Code2,
    title: "Clean, Scalable Code",
    description:
      "Every line we write follows industry best practices — modular, testable, and built to scale as your business grows.",
    color: "violet",
  },
  {
    icon: Zap,
    title: "Fast Delivery, Zero Compromises",
    description:
      "We use agile workflows and modern tooling to ship fast without cutting corners on quality or performance.",
    color: "blue",
  },
  {
    icon: Shield,
    title: "Security First",
    description:
      "From auth to data handling, we bake security into every layer — so you can focus on growth, not threats.",
    color: "cyan",
  },
  {
    icon: Users,
    title: "Dedicated Collaboration",
    description:
      "We work as your extended team — transparent communication, regular check-ins, and full ownership.",
    color: "violet",
  },
  {
    icon: BarChart3,
    title: "Data-Driven Decision Making",
    description:
      "We build analytics into every product so you always have the insights to make smart business decisions.",
    color: "blue",
  },
  {
    icon: Headphones,
    title: "Post-Launch Support",
    description:
      "Our relationship doesn&apos;t end at launch. We provide ongoing maintenance and support to keep you running smoothly.",
    color: "cyan",
  },
];

const colorMap: Record<string, { bg: string; icon: string; border: string }> = {
  violet: {
    bg: "rgba(124,58,237,0.08)",
    icon: "#A78BFA",
    border: "rgba(124,58,237,0.2)",
  },
  blue: {
    bg: "rgba(37,99,235,0.08)",
    icon: "#60A5FA",
    border: "rgba(37,99,235,0.2)",
  },
  cyan: {
    bg: "rgba(6,182,212,0.08)",
    icon: "#22D3EE",
    border: "rgba(6,182,212,0.2)",
  },
};

export default function WhyUs() {
  return (
    <section id="why-us" className="section-padding" style={{ background: "#0A0A0F" }}>
      <div className="container-max">
        {/* Header */}
        <AnimatedSection className="text-center mb-16">
          <span className="section-label">Why Atrios Labs</span>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            The Atrios{" "}
            <span className="gradient-text">Advantage</span>
          </h2>
          <p className="text-slate-400 max-w-xl mx-auto text-lg">
            We don&apos;t just deliver projects — we build partnerships. Here&apos;s what sets us apart
            from the competition.
          </p>
        </AnimatedSection>

        {/* Strengths Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {strengths.map((item, i) => {
            const Icon = item.icon;
            const colors = colorMap[item.color];

            return (
              <AnimatedSection key={i} delay={i * 0.08}>
                <motion.div
                  whileHover={{ y: -4, scale: 1.02 }}
                  transition={{ duration: 0.2 }}
                  className="rounded-2xl p-6 h-full cursor-default transition-all duration-300 group"
                  style={{
                    background: colors.bg,
                    border: `1px solid ${colors.border}`,
                  }}
                >
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center mb-5"
                    style={{ background: colors.bg, border: `1px solid ${colors.border}` }}
                  >
                    <Icon className="w-6 h-6" style={{ color: colors.icon }} />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-3 group-hover:text-violet-300 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-slate-400 text-sm leading-relaxed">{item.description}</p>
                </motion.div>
              </AnimatedSection>
            );
          })}
        </div>

        {/* Bottom CTA strip */}
        <AnimatedSection delay={0.4} className="mt-16">
          <div
            className="rounded-3xl p-8 md:p-12 text-center relative overflow-hidden"
            style={{
              background: "linear-gradient(135deg, rgba(124,58,237,0.15), rgba(37,99,235,0.1))",
              border: "1px solid rgba(124,58,237,0.25)",
            }}
          >
            <div
              className="absolute top-0 right-0 w-64 h-64 rounded-full opacity-10 blur-3xl pointer-events-none"
              style={{ background: "radial-gradient(circle, #7C3AED, transparent)" }}
            />
            <h3 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Ready to{" "}
              <span className="gradient-text">Build Together?</span>
            </h3>
            <p className="text-slate-400 mb-8 max-w-lg mx-auto">
              Let&apos;s turn your ideas into reality. Reach out and we&apos;ll get back to you within 24 hours.
            </p>
            <button
              onClick={() => document?.querySelector("#contact")?.scrollIntoView({ behavior: "smooth" })}
              className="btn-primary text-base px-8 py-4"
            >
              Start a Project
            </button>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}
