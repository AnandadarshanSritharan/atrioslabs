"use client";

import { useEffect, useState } from "react";
import { 
  FolderOpen, 
  Settings, 
  MessageSquare, 
  ArrowRight,
  TrendingUp,
  Clock,
  Plus
} from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

interface DashboardStats {
  projects: number;
  services: number;
  testimonials: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    projects: 0,
    services: 0,
    testimonials: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const [projectsRes, servicesRes, testimonialsRes] = await Promise.all([
          fetch("/api/projects"),
          fetch("/api/services"),
          fetch("/api/testimonials"),
        ]);

        const projectsData = await projectsRes.json();
        const servicesData = await servicesRes.json();
        const testimonialsData = await testimonialsRes.json();

        setStats({
          projects: projectsData.data?.length || 0,
          services: servicesData.data?.length || 0,
          testimonials: testimonialsData.data?.length || 0,
        });
      } catch (error) {
        console.error("Error fetching dashboard stats:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
  }, []);

  const statCards = [
    {
      label: "Total Projects",
      value: stats.projects,
      icon: FolderOpen,
      href: "/admin/projects",
      color: "from-violet-600/20 to-violet-600/5",
      iconColor: "text-violet-400",
    },
    {
      label: "Services Offered",
      value: stats.services,
      icon: Settings,
      href: "/admin/services",
      color: "from-blue-600/20 to-blue-600/5",
      iconColor: "text-blue-400",
    },
    {
      label: "Client Testimonials",
      value: stats.testimonials,
      icon: MessageSquare,
      href: "/admin/testimonials",
      color: "from-cyan-600/20 to-cyan-600/5",
      iconColor: "text-cyan-400",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Dashboard Overview</h1>
        <p className="text-slate-400">Welcome back! Here's what's happening with Atrios Labs.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {statCards.map((card, i) => (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <Link 
              href={card.href}
              className="block group p-6 rounded-2xl border transition-all duration-300 hover:scale-[1.02]"
              style={{
                background: `linear-gradient(135deg, ${card.color.split(' ')[0]}, ${card.color.split(' ')[1]})`,
                borderColor: "rgba(42, 42, 62, 0.8)",
              }}
            >
              <div className="flex justify-between items-start mb-4">
                <div className={`p-3 rounded-xl bg-white/5 ${card.iconColor}`}>
                  <card.icon className="w-6 h-6" />
                </div>
                <div className="flex items-center gap-1 text-xs text-green-400 font-medium bg-green-400/10 px-2 py-1 rounded-full">
                  <TrendingUp className="w-3 h-3" />
                  <span>Live</span>
                </div>
              </div>
              <div className="space-y-1">
                <div className="text-3xl font-bold text-white">
                  {loading ? "..." : card.value}
                </div>
                <div className="text-sm text-slate-400 flex items-center justify-between">
                  {card.label}
                  <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0" />
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Quick Actions & Recent Updates */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Quick Actions */}
        <div className="admin-card">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Plus className="w-5 h-5 text-violet-400" />
              Quick Actions
            </h2>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Link 
              href="/admin/projects" 
              className="p-4 rounded-xl border border-dashed border-slate-700 hover:border-violet-500 hover:bg-violet-500/5 transition-all text-center group"
            >
              <div className="w-10 h-10 rounded-full bg-violet-500/10 flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                <FolderOpen className="w-5 h-5 text-violet-400" />
              </div>
              <span className="text-sm text-slate-300">Add Project</span>
            </Link>
            <Link 
              href="/admin/services" 
              className="p-4 rounded-xl border border-dashed border-slate-700 hover:border-blue-500 hover:bg-blue-500/5 transition-all text-center group"
            >
              <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                <Settings className="w-5 h-5 text-blue-400" />
              </div>
              <span className="text-sm text-slate-300">Add Service</span>
            </Link>
          </div>
        </div>

        {/* System Activity */}
        <div className="admin-card">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Clock className="w-5 h-5 text-cyan-400" />
              System Status
            </h2>
          </div>
          <div className="space-y-4">
            <div className="flex items-center gap-4 p-3 rounded-lg bg-white/5 border border-white/5">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <div className="flex-1">
                <div className="text-sm text-white font-medium">Database Connected</div>
                <div className="text-xs text-slate-500">MongoDB is running locally</div>
              </div>
            </div>
            <div className="flex items-center gap-4 p-3 rounded-lg bg-white/5 border border-white/5">
              <div className="w-2 h-2 rounded-full bg-violet-500" />
              <div className="flex-1">
                <div className="text-sm text-white font-medium">API Routes Operational</div>
                <div className="text-xs text-slate-500">All Next.js endpoints are active</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
