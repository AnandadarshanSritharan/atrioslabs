"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { ExternalLink, Filter } from "lucide-react";
import { Github } from "../shared/BrandIcons";
import AnimatedSection from "@/components/shared/AnimatedSection";
import { SkeletonCard } from "@/components/shared/SkeletonLoader";

interface Project {
  _id: string;
  title: string;
  description: string;
  image: string;
  category: string;
  tags: string[];
  liveUrl?: string;
  githubUrl?: string;
  featured?: boolean;
}

const categories = ["All", "Web", "AI", "IoT", "Apps"];

const categoryColors: Record<string, string> = {
  Web: "#7C3AED",
  AI: "#2563EB",
  IoT: "#06B6D4",
  Apps: "#10B981",
  All: "#7C3AED",
};

export default function Portfolio() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [filtered, setFiltered] = useState<Project[]>([]);
  const [active, setActive] = useState("All");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/projects")
      .then((r) => r.json())
      .then((d) => {
        const data = d.data || [];
        setProjects(data);
        setFiltered(data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleFilter = (cat: string) => {
    setActive(cat);
    if (cat === "All") {
      setFiltered(projects);
    } else {
      setFiltered(projects.filter((p) => p.category === cat));
    }
  };

  return (
    <section id="portfolio" className="section-padding" style={{ background: "#0D0D15" }}>
      <div className="container-max">
        {/* Header */}
        <AnimatedSection className="text-center mb-12">
          <span className="section-label">Portfolio</span>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Our <span className="gradient-text">Work</span>
          </h2>
          <p className="text-slate-400 max-w-xl mx-auto">
            A curated selection of projects that demonstrate our technical depth and
            commitment to quality across every domain we work in.
          </p>
        </AnimatedSection>

        {/* Filter tabs */}
        <AnimatedSection delay={0.1} className="flex flex-wrap justify-center gap-3 mb-12">
          <div className="flex items-center gap-2 mr-2">
            <Filter className="w-4 h-4 text-slate-500" />
          </div>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => handleFilter(cat)}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                active === cat
                  ? "text-white shadow-glow"
                  : "text-slate-400 hover:text-white"
              }`}
              style={
                active === cat
                  ? {
                      background: `linear-gradient(135deg, ${categoryColors[cat]}, ${categoryColors[cat]}88)`,
                      boxShadow: `0 4px 20px ${categoryColors[cat]}44`,
                    }
                  : {
                      background: "rgba(42,42,62,0.4)",
                      border: "1px solid rgba(42,42,62,0.8)",
                    }
              }
            >
              {cat}
            </button>
          ))}
        </AnimatedSection>

        {/* Project Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🚀</div>
            <h3 className="text-xl font-semibold text-white mb-2">Projects Coming Soon</h3>
            <p className="text-slate-500">
              We&apos;re currently building amazing things. Check back soon!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence mode="popLayout">
              {filtered.map((project, i) => (
                <motion.div
                  key={project._id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3, delay: i * 0.05 }}
                  whileHover={{ y: -6 }}
                  className="glass-card overflow-hidden group cursor-default"
                >
                  {/* Image */}
                  <div className="relative h-52 overflow-hidden">
                    <Image
                      src={project.image}
                      alt={project.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                    {/* Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-end p-4 gap-2">
                      {project.liveUrl && (
                        <a
                          href={project.liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-9 h-9 rounded-lg bg-white/10 backdrop-blur-sm flex items-center justify-center hover:bg-white/20 transition-colors"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <ExternalLink className="w-4 h-4 text-white" />
                        </a>
                      )}
                      {project.githubUrl && (
                        <a
                          href={project.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-9 h-9 rounded-lg bg-white/10 backdrop-blur-sm flex items-center justify-center hover:bg-white/20 transition-colors"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Github className="w-4 h-4 text-white" />
                        </a>
                      )}
                    </div>
                    {/* Category badge on image */}
                    <div className="absolute top-3 left-3">
                      <span
                        className="px-2.5 py-1 rounded-full text-xs font-semibold text-white"
                        style={{
                          background: `${categoryColors[project.category] || "#7C3AED"}cc`,
                          backdropFilter: "blur(8px)",
                        }}
                      >
                        {project.category}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-5">
                    <h3 className="text-lg font-bold text-white mb-2 group-hover:text-violet-300 transition-colors">
                      {project.title}
                    </h3>
                    <p className="text-slate-400 text-sm leading-relaxed line-clamp-2 mb-4">
                      {project.description}
                    </p>
                    {project.tags && project.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1.5">
                        {project.tags.slice(0, 3).map((tag) => (
                          <span
                            key={tag}
                            className="px-2 py-0.5 rounded-md text-xs text-slate-400"
                            style={{
                              background: "rgba(42,42,62,0.6)",
                              border: "1px solid rgba(42,42,62,0.8)",
                            }}
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </section>
  );
}
