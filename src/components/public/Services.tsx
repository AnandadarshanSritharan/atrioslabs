"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Globe,
  Cpu,
  Bot,
  Smartphone,
  ArrowRight,
  Check,
} from "lucide-react";
import AnimatedSection from "@/components/shared/AnimatedSection";
import { SkeletonCard } from "@/components/shared/SkeletonLoader";

const iconMap: Record<string, React.ElementType> = {
  Globe,
  Cpu,
  Bot,
  Smartphone,
  Code: Globe,
};

const defaultServices = [
  {
    _id: "1",
    title: "Web Development",
    description:
      "From pixel-perfect landing pages to complex SaaS platforms, we craft high-performance web experiences that convert visitors into customers.",
    icon: "Globe",
    color: "violet",
    features: ["React / Next.js", "TypeScript", "REST & GraphQL APIs", "SEO Optimized"],
  },
  {
    _id: "2",
    title: "IoT Solutions",
    description:
      "Connect the physical and digital worlds with our intelligent IoT ecosystems — real-time monitoring, smart automation, and edge analytics.",
    icon: "Cpu",
    color: "blue",
    features: ["Sensor Integration", "Real-time Dashboards", "Edge Computing", "Cloud Sync"],
  },
  {
    _id: "3",
    title: "AI & Automation",
    description:
      "Leverage machine learning, NLP, and intelligent automation to streamline workflows, unlock insights, and reduce operational overhead.",
    icon: "Bot",
    color: "cyan",
    features: ["ML Models", "NLP & Chatbots", "Process Automation", "Data Analytics"],
  },
  {
    _id: "4",
    title: "App Development",
    description:
      "Native and cross-platform mobile applications designed for performance, beautiful UX, and seamless integration with your backend.",
    icon: "Smartphone",
    color: "violet",
    features: ["React Native", "iOS & Android", "Offline-first", "Push Notifications"],
  },
];

const colorConfig: Record<string, { gradient: string; glow: string; border: string; badge: string }> = {
  violet: {
    gradient: "linear-gradient(135deg, rgba(124,58,237,0.15), rgba(124,58,237,0.05))",
    glow: "rgba(124,58,237,0.3)",
    border: "rgba(124,58,237,0.3)",
    badge: "rgba(124,58,237,0.15)",
  },
  blue: {
    gradient: "linear-gradient(135deg, rgba(37,99,235,0.15), rgba(37,99,235,0.05))",
    glow: "rgba(37,99,235,0.3)",
    border: "rgba(37,99,235,0.3)",
    badge: "rgba(37,99,235,0.15)",
  },
  cyan: {
    gradient: "linear-gradient(135deg, rgba(6,182,212,0.15), rgba(6,182,212,0.05))",
    glow: "rgba(6,182,212,0.3)",
    border: "rgba(6,182,212,0.3)",
    badge: "rgba(6,182,212,0.15)",
  },
};

export default function Services() {
  const [services, setServices] = useState<typeof defaultServices>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/services")
      .then((r) => r.json())
      .then((data) => {
        if (data.data && data.data.length > 0) {
          setServices(data.data);
        } else {
          setServices(defaultServices);
        }
      })
      .catch(() => setServices(defaultServices))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section id="services" className="section-padding" style={{ background: "#0D0D15" }}>
      <div className="container-max">
        {/* Header */}
        <AnimatedSection className="text-center mb-16">
          <span className="section-label">Our Services</span>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Solutions That{" "}
            <span className="gradient-text">Drive Results</span>
          </h2>
          <p className="text-slate-400 max-w-xl mx-auto text-lg">
            Four specialized service verticals, each engineered to give your business
            a competitive edge in an ever-evolving digital landscape.
          </p>
        </AnimatedSection>

        {/* Service Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {loading
            ? [...Array(4)].map((_, i) => <SkeletonCard key={i} />)
            : services.map((service, i) => {
                const Icon = iconMap[service.icon] || Globe;
                const colors = colorConfig[service.color] || colorConfig.violet;

                return (
                  <AnimatedSection key={service._id} delay={i * 0.1}>
                    <motion.div
                      whileHover={{ y: -4 }}
                      transition={{ duration: 0.2 }}
                      className="glass-card gradient-border p-8 h-full cursor-default group"
                      style={{
                        background: colors.gradient,
                        transitionProperty: "border-color, box-shadow",
                        transitionDuration: "300ms",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = colors.border;
                        e.currentTarget.style.boxShadow = `0 4px 40px ${colors.glow}`;
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = "rgba(42,42,62,0.8)";
                        e.currentTarget.style.boxShadow = "none";
                      }}
                    >
                      {/* Icon */}
                      <div
                        className="w-14 h-14 rounded-xl flex items-center justify-center mb-6"
                        style={{ background: colors.badge }}
                      >
                        <Icon className="w-7 h-7" style={{ color: `hsl(${service.color === "violet" ? "258, 90%, 66%" : service.color === "blue" ? "221, 83%, 53%" : "187, 96%, 43%"})` }} />
                      </div>

                      <h3 className="text-xl font-bold text-white mb-3">{service.title}</h3>
                      <p className="text-slate-400 leading-relaxed mb-6">{service.description}</p>

                      {/* Features */}
                      {service.features && service.features.length > 0 && (
                        <ul className="space-y-2 mb-6">
                          {service.features.map((f, j) => (
                            <li key={j} className="flex items-center gap-2 text-sm text-slate-300">
                              <Check className="w-4 h-4 text-violet-400 flex-shrink-0" />
                              {f}
                            </li>
                          ))}
                        </ul>
                      )}

                      <button className="flex items-center gap-2 text-sm font-medium text-violet-400 hover:text-violet-300 transition-colors group-hover:gap-3">
                        Learn more <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                      </button>
                    </motion.div>
                  </AnimatedSection>
                );
              })}
        </div>
      </div>
    </section>
  );
}
