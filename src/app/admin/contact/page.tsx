"use client";

import { useEffect, useState } from "react";
import { 
  Save, 
  Phone, 
  Mail, 
  MapPin, 
  Globe, 
  Loader2 
} from "lucide-react";
import { Linkedin, Twitter, Github, Instagram } from "@/components/shared/BrandIcons";
import toast from "react-hot-toast";

interface ContactData {
  email: string;
  phone: string;
  address: string;
  linkedIn: string;
  twitter: string;
  github: string;
  instagram: string;
  mapEmbedUrl: string;
}

export default function AdminContact() {
  const [data, setData] = useState<ContactData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch("/api/contact");
        const json = await res.json();
        setData(json.data);
      } catch (error) {
        toast.error("Failed to load contact data");
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
      const res = await fetch("/api/contact", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        toast.success("Contact information updated");
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
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Contact Settings</h1>
        <p className="text-slate-400">Update how clients can reach Atrios Labs.</p>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Contact Info */}
        <div className="admin-card">
          <div className="flex items-center gap-2 mb-6 text-white font-bold">
            <Phone className="w-5 h-5 text-violet-400" />
            Core Contact Details
          </div>
          <div className="space-y-4">
            <div>
              <label className="admin-label flex items-center gap-2">
                <Mail className="w-4 h-4 text-slate-500" />
                Email Address
              </label>
              <input 
                type="email" 
                value={data.email}
                onChange={e => setData({ ...data, email: e.target.value })}
                className="admin-input" 
              />
            </div>
            <div>
              <label className="admin-label flex items-center gap-2">
                <Phone className="w-4 h-4 text-slate-500" />
                Phone Number
              </label>
              <input 
                type="text" 
                value={data.phone}
                onChange={e => setData({ ...data, phone: e.target.value })}
                className="admin-input" 
              />
            </div>
            <div>
              <label className="admin-label flex items-center gap-2">
                <MapPin className="w-4 h-4 text-slate-500" />
                Physical Address
              </label>
              <textarea 
                rows={3}
                value={data.address}
                onChange={e => setData({ ...data, address: e.target.value })}
                className="admin-input resize-none" 
              />
            </div>
          </div>
        </div>

        {/* Social Links */}
        <div className="admin-card">
          <div className="flex items-center gap-2 mb-6 text-white font-bold">
            <Globe className="w-5 h-5 text-blue-400" />
            Social Presence
          </div>
          <div className="space-y-4">
            <div>
              <label className="admin-label flex items-center gap-2">
                <Linkedin className="w-4 h-4 text-[#0A66C2]" />
                LinkedIn Profile URL
              </label>
              <input 
                type="url" 
                value={data.linkedIn}
                onChange={e => setData({ ...data, linkedIn: e.target.value })}
                className="admin-input" 
                placeholder="https://linkedin.com/in/..."
              />
            </div>
            <div>
              <label className="admin-label flex items-center gap-2">
                <Twitter className="w-4 h-4 text-[#1DA1F2]" />
                Twitter/X Profile URL
              </label>
              <input 
                type="url" 
                value={data.twitter}
                onChange={e => setData({ ...data, twitter: e.target.value })}
                className="admin-input" 
                placeholder="https://x.com/..."
              />
            </div>
            <div>
              <label className="admin-label flex items-center gap-2">
                <Github className="w-4 h-4 text-white" />
                GitHub Profile URL
              </label>
              <input 
                type="url" 
                value={data.github}
                onChange={e => setData({ ...data, github: e.target.value })}
                className="admin-input" 
                placeholder="https://github.com/..."
              />
            </div>
            <div>
              <label className="admin-label flex items-center gap-2">
                <Instagram className="w-4 h-4 text-[#E4405F]" />
                Instagram Profile URL
              </label>
              <input 
                type="url" 
                value={data.instagram}
                onChange={e => setData({ ...data, instagram: e.target.value })}
                className="admin-input" 
                placeholder="https://instagram.com/..."
              />
            </div>
          </div>
        </div>

        {/* Maps Embed */}
        <div className="admin-card md:col-span-2">
          <div className="flex items-center gap-2 mb-4 text-white font-bold">
            <MapPin className="w-5 h-5 text-red-500" />
            Google Maps Embed URL
          </div>
          <input 
            type="text" 
            value={data.mapEmbedUrl}
            onChange={e => setData({ ...data, mapEmbedUrl: e.target.value })}
            className="admin-input mb-4" 
            placeholder="Paste your Google Maps iframe 'src' URL here..."
          />
          {data.mapEmbedUrl && (
            <div className="w-full h-64 rounded-xl overflow-hidden border border-white/10 bg-slate-800">
               <iframe 
                src={data.mapEmbedUrl} 
                width="100%" 
                height="100%" 
                style={{ border: 0 }} 
                allowFullScreen={true} 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          )}
        </div>

        {/* Submit */}
        <div className="md:col-span-2 flex justify-end">
          <button 
            type="submit" 
            disabled={saving}
            className="btn-primary px-12 py-3.5"
          >
            {saving ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                <Save className="w-5 h-5" />
                Update Contact Information
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
