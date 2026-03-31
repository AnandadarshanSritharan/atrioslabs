"use client";

import { useEffect, useState } from "react";
import { 
  Save, 
  Info, 
  Target, 
  Eye, 
  BarChart, 
  Loader2 
} from "lucide-react";
import toast from "react-hot-toast";

interface AboutData {
  mission: string;
  vision: string;
  description: string;
  tagline: string;
  stats: {
    projects: number;
    clients: number;
    years: number;
    team: number;
  };
}

export default function AdminAbout() {
  const [data, setData] = useState<AboutData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch("/api/about");
        const json = await res.json();
        setData(json.data);
      } catch (error) {
        toast.error("Failed to load about data");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!data) return;

    setSaving(true);
    try {
      const res = await fetch("/api/about", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        toast.success("About information updated");
      } else {
        toast.error("Failed to update information");
      }
    } catch (error) {
      toast.error("An error occurred");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 text-violet-500 animate-spin" />
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Company Information</h1>
          <p className="text-slate-400">Update your company mission, vision and core description.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <div className="admin-card">
            <div className="flex items-center gap-2 mb-6 text-white font-bold">
              <Info className="w-5 h-5 text-violet-400" />
              General Description
            </div>
            <div className="space-y-4">
              <div>
                <label className="admin-label">Tagline</label>
                <input 
                  type="text" 
                  value={data.tagline}
                  onChange={e => setData({ ...data, tagline: e.target.value })}
                  className="admin-input" 
                />
              </div>
              <div>
                <label className="admin-label">Company Description</label>
                <textarea 
                  rows={6}
                  value={data.description}
                  onChange={e => setData({ ...data, description: e.target.value })}
                  className="admin-input resize-none" 
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="admin-card">
              <div className="flex items-center gap-2 mb-4 text-white font-bold">
                <Target className="w-5 h-5 text-violet-400" />
                Mission Statement
              </div>
              <textarea 
                rows={5}
                value={data.mission}
                onChange={e => setData({ ...data, mission: e.target.value })}
                className="admin-input resize-none" 
              />
            </div>
            <div className="admin-card">
              <div className="flex items-center gap-2 mb-4 text-white font-bold">
                <Eye className="w-5 h-5 text-blue-400" />
                Vision Statement
              </div>
              <textarea 
                rows={5}
                value={data.vision}
                onChange={e => setData({ ...data, vision: e.target.value })}
                className="admin-input resize-none" 
              />
            </div>
          </div>
        </div>

        {/* Sidebar Settings */}
        <div className="space-y-6">
          <div className="admin-card">
            <div className="flex items-center gap-2 mb-6 text-white font-bold">
              <BarChart className="w-5 h-5 text-cyan-400" />
              Company Stats
            </div>
            <div className="space-y-4">
              <div>
                <label className="admin-label">Projects Delivered</label>
                <input 
                  type="number" 
                  value={data.stats.projects}
                  onChange={e => setData({ 
                    ...data, 
                    stats: { ...data.stats, projects: parseInt(e.target.value) || 0 } 
                  })}
                  className="admin-input" 
                />
              </div>
              <div>
                <label className="admin-label">Happy Clients</label>
                <input 
                  type="number" 
                  value={data.stats.clients}
                  onChange={e => setData({ 
                    ...data, 
                    stats: { ...data.stats, clients: parseInt(e.target.value) || 0 } 
                  })}
                  className="admin-input" 
                />
              </div>
              <div>
                <label className="admin-label">Years of Experience</label>
                <input 
                  type="number" 
                  value={data.stats.years}
                  onChange={e => setData({ 
                    ...data, 
                    stats: { ...data.stats, years: parseInt(e.target.value) || 0 } 
                  })}
                  className="admin-input" 
                />
              </div>
              <div>
                <label className="admin-label">Team Members</label>
                <input 
                  type="number" 
                  value={data.stats.team}
                  onChange={e => setData({ 
                    ...data, 
                    stats: { ...data.stats, team: parseInt(e.target.value) || 0 } 
                  })}
                  className="admin-input" 
                />
              </div>
            </div>
          </div>

          <button 
            type="submit" 
            disabled={saving}
            className="btn-primary w-full justify-center py-4"
          >
            {saving ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                <Save className="w-5 h-5" />
                Save Changes
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
