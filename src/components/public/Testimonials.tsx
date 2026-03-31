"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Star, Quote } from "lucide-react";
import AnimatedSection from "@/components/shared/AnimatedSection";

interface Testimonial {
  _id: string;
  name: string;
  role: string;
  company: string;
  content: string;
  rating: number;
  avatar?: string;
}

const defaultTestimonials: Testimonial[] = [
  {
    _id: "1",
    name: "Arjun Mehta",
    role: "CTO",
    company: "TechBridge Solutions",
    content:
      "Atrios Labs transformed our vision into a stunning web platform in record time. Their technical depth and proactive communication made the entire project a smooth experience. Highly recommend!",
    rating: 5,
  },
  {
    _id: "2",
    name: "Priya Sharma",
    role: "Product Manager",
    company: "SmartEdge IoT",
    content:
      "The IoT dashboard they built for us is incredibly intuitive and robust. We went from data chaos to real-time clarity — and our clients love it. Atrios Labs are true professionals.",
    rating: 5,
  },
  {
    _id: "3",
    name: "Rohan Gupta",
    role: "Founder",
    company: "AutomateIQ",
    content:
      "We needed an AI automation pipeline built fast with zero margin for error. Atrios delivered exactly that — on time and on budget. The quality of code was exceptional.",
    rating: 5,
  },
  {
    _id: "4",
    name: "Sneha Iyer",
    role: "CEO",
    company: "MobiFirst Apps",
    content:
      "Our mobile app went from concept to App Store in 10 weeks. Beautiful UI, solid performance, and zero post-launch bugs. I couldn't be happier with the team at Atrios Labs.",
    rating: 5,
  },
];

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-1">
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          className={`w-4 h-4 ${i < rating ? "text-yellow-400 fill-yellow-400" : "text-slate-600"}`}
        />
      ))}
    </div>
  );
}

function getInitials(name: string) {
  return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
}

export default function Testimonials() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    fetch("/api/testimonials")
      .then((r) => r.json())
      .then((d) => {
        if (d.data && d.data.length > 0) {
          setTestimonials(d.data);
        } else {
          setTestimonials(defaultTestimonials);
        }
      })
      .catch(() => setTestimonials(defaultTestimonials));
  }, []);

  const startAutoplay = () => {
    intervalRef.current = setInterval(() => {
      setDirection(1);
      setCurrent((c) => (c + 1) % testimonials.length);
    }, 5000);
  };

  useEffect(() => {
    if (testimonials.length === 0) return;
    startAutoplay();
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [testimonials.length]);

  const navigate = (dir: number) => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setDirection(dir);
    setCurrent((c) => (c + dir + testimonials.length) % testimonials.length);
    startAutoplay();
  };

  if (testimonials.length === 0) return null;

  const t = testimonials[current];

  return (
    <section id="testimonials" className="section-padding" style={{ background: "#0D0D15" }}>
      <div className="container-max">
        {/* Header */}
        <AnimatedSection className="text-center mb-16">
          <span className="section-label">Testimonials</span>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            What Our{" "}
            <span className="gradient-text">Clients Say</span>
          </h2>
          <p className="text-slate-400 max-w-xl mx-auto">
            Don&apos;t take our word for it — here&apos;s what the people we&apos;ve worked with have
            to say about the Atrios Labs experience.
          </p>
        </AnimatedSection>

        {/* Carousel */}
        <div className="max-w-3xl mx-auto">
          <div
            className="rounded-3xl p-8 md:p-12 relative overflow-hidden"
            style={{
              background: "linear-gradient(135deg, rgba(124,58,237,0.08), rgba(37,99,235,0.05))",
              border: "1px solid rgba(124,58,237,0.2)",
            }}
          >
            {/* Quote icon */}
            <Quote
              className="absolute top-6 right-8 w-16 h-16 opacity-10 text-violet-400"
              fill="currentColor"
            />

            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={t._id}
                custom={direction}
                initial={{ opacity: 0, x: direction * 40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -direction * 40 }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
              >
                <StarRating rating={t.rating} />

                <blockquote className="text-xl md:text-2xl text-slate-200 font-medium leading-relaxed mt-6 mb-8">
                  &ldquo;{t.content}&rdquo;
                </blockquote>

                <div className="flex items-center gap-4">
                  {/* Avatar */}
                  {t.avatar ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={t.avatar}
                      alt={t.name}
                      className="w-14 h-14 rounded-full object-cover ring-2 ring-violet-500/30"
                    />
                  ) : (
                    <div
                      className="w-14 h-14 rounded-full flex items-center justify-center text-lg font-bold text-white ring-2 ring-violet-500/30"
                      style={{ background: "linear-gradient(135deg, #7C3AED, #2563EB)" }}
                    >
                      {getInitials(t.name)}
                    </div>
                  )}
                  <div>
                    <div className="font-bold text-white">{t.name}</div>
                    <div className="text-sm text-slate-400">
                      {t.role} · {t.company}
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-between mt-8">
            <div className="flex gap-2">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => { setDirection(i > current ? 1 : -1); setCurrent(i); }}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    i === current ? "w-8 bg-violet-500" : "bg-slate-600 hover:bg-slate-400"
                  }`}
                />
              ))}
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => navigate(-1)}
                className="w-10 h-10 rounded-xl flex items-center justify-center transition-all"
                style={{
                  background: "rgba(42,42,62,0.6)",
                  border: "1px solid rgba(42,42,62,0.8)",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.borderColor = "rgba(124,58,237,0.5)")}
                onMouseLeave={(e) => (e.currentTarget.style.borderColor = "rgba(42,42,62,0.8)")}
              >
                <ChevronLeft className="w-4 h-4 text-slate-400" />
              </button>
              <button
                onClick={() => navigate(1)}
                className="w-10 h-10 rounded-xl flex items-center justify-center transition-all"
                style={{
                  background: "rgba(42,42,62,0.6)",
                  border: "1px solid rgba(42,42,62,0.8)",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.borderColor = "rgba(124,58,237,0.5)")}
                onMouseLeave={(e) => (e.currentTarget.style.borderColor = "rgba(42,42,62,0.8)")}
              >
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
