"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowRight, ChevronDown, Sparkles } from "lucide-react";

export default function Hero() {
  const [about, setAbout] = useState<{ stats: { projects: number; clients: number; years: number; team: number } } | null>(null);

  useEffect(() => {
    fetch("/api/about")
      .then((r) => r.json())
      .then((d) => setAbout(d.data))
      .catch(() => {});
  }, []);

  const stats = about?.stats || { projects: 50, clients: 30, years: 5, team: 4 };

  const scrollToSection = (id: string) => {
    document.querySelector(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden mesh-bg"
      style={{ background: "linear-gradient(135deg, #0A0A0F 0%, #1a0533 50%, #0A0A0F 100%)" }}
    >
      {/* Background orbs */}
      <div
        className="absolute top-1/4 -left-32 w-96 h-96 rounded-full opacity-20 blur-3xl pointer-events-none"
        style={{ background: "radial-gradient(circle, #7C3AED, transparent)" }}
      />
      <div
        className="absolute bottom-1/3 -right-32 w-80 h-80 rounded-full opacity-15 blur-3xl pointer-events-none"
        style={{ background: "radial-gradient(circle, #2563EB, transparent)" }}
      />
      <div
        className="absolute top-2/3 left-1/2 w-64 h-64 rounded-full opacity-10 blur-3xl pointer-events-none -translate-x-1/2"
        style={{ background: "radial-gradient(circle, #06B6D4, transparent)" }}
      />

      {/* Floating shapes */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full opacity-5"
            style={{
              width: `${40 + i * 20}px`,
              height: `${40 + i * 20}px`,
              background: i % 2 === 0 ? "#7C3AED" : "#2563EB",
              left: `${10 + i * 15}%`,
              top: `${20 + (i % 3) * 20}%`,
            }}
            animate={{
              y: [0, -20, 0],
              x: [0, 10, 0],
              rotate: [0, 360],
            }}
            transition={{
              duration: 8 + i * 2,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.5,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 container-max px-4 md:px-8 text-center pt-24 pb-20">
        {/* Badge */}
        <motion.div
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 0.6, delay: 0.1 }}
           className="mb-6 inline-flex"
        >
          <span className="section-label">
            <Sparkles className="w-3 h-3" />
            Next-Gen Technology Solutions
          </span>
        </motion.div>

        {/* Main heading */}
        <motion.h1
           initial={{ opacity: 0, y: 30 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 0.8, delay: 0.2 }}
           className="text-5xl md:text-7xl lg:text-8xl font-black leading-tight text-balance mb-6"
        >
          <span className="text-white">Think </span>
          <span className="gradient-text">Beyond</span>
           <br />
          <span className="text-white">Technology</span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 0.7, delay: 0.4 }}
           className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed"
        >
          We engineer intelligent, scalable digital solutions — from immersive web apps and
          IoT ecosystems to AI automation and mobile applications. Your vision, amplified.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 0.6, delay: 0.6 }}
           className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <button
            onClick={() => scrollToSection("#contact")}
            className="btn-primary text-base px-8 py-4"
          >
            Get Started
            <ArrowRight className="w-4 h-4" />
          </button>
          <button
            onClick={() => scrollToSection("#portfolio")}
            className="btn-outline text-base px-8 py-4"
          >
            View Our Work
          </button>
        </motion.div>

        {/* Stats bar */}
        <motion.div
           initial={{ opacity: 0, y: 30 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 0.7, delay: 0.8 }}
           className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto"
        >
          {[
            { value: `${stats.projects}+`, label: "Projects Delivered" },
            { value: `${stats.clients}+`, label: "Happy Clients" },
            { value: `${stats.years}+`, label: "Years Experience" },
            { value: `${stats.team}`, label: "Team Experts" },
          ].map((stat, i) => (
            <div
              key={i}
              className="glass-card p-4 text-center"
            >
              <div className="text-2xl md:text-3xl font-bold gradient-text mb-1">{stat.value}</div>
              <div className="text-xs text-slate-500">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.5 }}
        onClick={() => scrollToSection("#services")}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-slate-500 hover:text-slate-300 transition-colors"
        aria-label="Scroll down"
      >
        <span className="text-xs tracking-widest uppercase">Scroll</span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <ChevronDown className="w-5 h-5" />
        </motion.div>
      </motion.button>
    </section>
  );
}
