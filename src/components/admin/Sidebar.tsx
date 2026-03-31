"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  FolderOpen,
  Settings,
  Info,
  Phone,
  Mail,
  MessageSquare,
  LogOut,
  Zap,
  Menu,
  X,
} from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/admin/dashboard" },
  { icon: FolderOpen, label: "Projects", href: "/admin/projects" },
  { icon: Settings, label: "Services", href: "/admin/services" },
  { icon: Info, label: "About", href: "/admin/about" },
  { icon: Phone, label: "Contact", href: "/admin/contact" },
  { icon: Mail, label: "Messages", href: "/admin/messages" },
  { icon: MessageSquare, label: "Testimonials", href: "/admin/testimonials" },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    localStorage.removeItem("admin_token");
    toast.success("Logged out successfully");
    router.push("/admin/login");
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="p-6 border-b" style={{ borderBottomColor: "rgba(42,42,62,0.5)" }}>
        <Link href="/" className="flex items-center gap-2">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ background: "linear-gradient(135deg, #7C3AED, #2563EB)" }}
          >
            <Zap className="w-4 h-4 text-white" />
          </div>
          <div>
            <div className="text-sm font-bold gradient-text">Atrios Labs</div>
            <div className="text-xs text-slate-500">Admin Panel</div>
          </div>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                active
                  ? "text-white"
                  : "text-slate-400 hover:text-white hover:bg-white/5"
              }`}
              style={
                active
                  ? {
                      background: "linear-gradient(135deg, rgba(124,58,237,0.2), rgba(37,99,235,0.1))",
                      border: "1px solid rgba(124,58,237,0.3)",
                    }
                  : {}
              }
            >
              <item.icon className={`w-4 h-4 ${active ? "text-violet-400" : ""}`} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t" style={{ borderTopColor: "rgba(42,42,62,0.5)" }}>
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-slate-400 hover:text-red-400 hover:bg-red-400/5 transition-all w-full"
        >
          <LogOut className="w-4 h-4" />
          Sign Out
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile header */}
      <div
        className="lg:hidden fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 py-3 border-b"
        style={{
          background: "rgba(18,18,26,0.95)",
          borderBottomColor: "rgba(42,42,62,0.8)",
          backdropFilter: "blur(12px)",
        }}
      >
        <Link href="/" className="flex items-center gap-2">
          <div
            className="w-7 h-7 rounded-lg flex items-center justify-center"
            style={{ background: "linear-gradient(135deg, #7C3AED, #2563EB)" }}
          >
            <Zap className="w-4 h-4 text-white" />
          </div>
          <span className="text-sm font-bold gradient-text">Atrios Labs Admin</span>
        </Link>
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="p-2 rounded-lg text-slate-400 hover:text-white"
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-40 flex">
          <div
            className="w-64 h-full border-r"
            style={{
              background: "#12121A",
              borderRightColor: "rgba(42,42,62,0.8)",
            }}
          >
            <div className="mt-14">
              <SidebarContent />
            </div>
          </div>
          <div
            className="flex-1 bg-black/60"
            onClick={() => setMobileOpen(false)}
          />
        </div>
      )}

      {/* Desktop sidebar */}
      <aside
        className="hidden lg:flex flex-col w-64 h-screen fixed left-0 top-0 border-r"
        style={{
          background: "#12121A",
          borderRightColor: "rgba(42,42,62,0.8)",
        }}
      >
        <SidebarContent />
      </aside>
    </>
  );
}
