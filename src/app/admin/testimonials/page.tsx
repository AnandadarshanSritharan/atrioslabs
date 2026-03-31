"use client";

import { useEffect, useState } from "react";
import { 
  Plus, 
  Search, 
  Edit2, 
  Trash2, 
  Star,
  User,
  Quote,
  Loader2,
  X
} from "lucide-react";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

interface Testimonial {
  _id: string;
  name: string;
  role: string;
  company: string;
  content: string;
  rating: number;
  avatar?: string;
  featured: boolean;
  order: number;
}

export default function AdminTestimonials() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingTestimonial, setEditingTestimonial] = useState<Testimonial | null>(null);
  const [formLoading, setFormLoading] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    role: "",
    company: "",
    content: "",
    rating: 5,
    avatar: "",
    featured: false,
    order: 0,
  });

  const fetchTestimonials = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/testimonials");
      const data = await res.json();
      setTestimonials(data.data || []);
    } catch (error) {
      toast.error("Failed to fetch testimonials");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const handleEdit = (testimonial: Testimonial) => {
    setEditingTestimonial(testimonial);
    setFormData({
      name: testimonial.name,
      role: testimonial.role,
      company: testimonial.company,
      content: testimonial.content,
      rating: testimonial.rating,
      avatar: testimonial.avatar || "",
      featured: testimonial.featured,
      order: testimonial.order,
    });
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this testimonial?")) return;
    
    try {
      const res = await fetch(`/api/testimonials/${id}`, { method: "DELETE" });
      if (res.ok) {
        toast.success("Testimonial deleted successfully");
        fetchTestimonials();
      } else {
        toast.error("Failed to delete testimonial");
      }
    } catch (error) {
      toast.error("An error occurred");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);

    try {
      const url = editingTestimonial ? `/api/testimonials/${editingTestimonial._id}` : "/api/testimonials";
      const method = editingTestimonial ? "PUT" : "POST";
      
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        toast.success(`Testimonial ${editingTestimonial ? "updated" : "created"} successfully`);
        setShowModal(false);
        setEditingTestimonial(null);
        setFormData({
          name: "",
          role: "",
          company: "",
          content: "",
          rating: 5,
          avatar: "",
          featured: false,
          order: 0,
        });
        fetchTestimonials();
      } else {
        const data = await res.json();
        toast.error(data.error || "Failed to save testimonial");
      }
    } catch (error) {
      toast.error("An error occurred");
    } finally {
      setFormLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Testimonials</h1>
          <p className="text-slate-400">Manage client reviews and project feedback.</p>
        </div>
        <button 
          onClick={() => {
            setEditingTestimonial(null);
            setFormData({
              name: "",
              role: "",
              company: "",
              content: "",
              rating: 5,
              avatar: "",
              featured: false,
              order: 0,
            });
            setShowModal(true);
          }}
          className="btn-primary"
        >
          <Plus className="w-4 h-4" />
          Add Testimonial
        </button>
      </div>

      {/* List */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="admin-card h-32 animate-pulse bg-white/5" />
          ))}
        </div>
      ) : testimonials.length === 0 ? (
        <div className="admin-card py-20 text-center">
          <div className="text-4xl mb-4">💬</div>
          <h3 className="text-xl font-bold text-white mb-2">No testimonials found</h3>
          <p className="text-slate-400">Collect social proof to build more trust with clients.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {testimonials.map((t) => (
            <motion.div 
              key={t._id}
              layout
              className="admin-card flex flex-col md:flex-row gap-6 items-start md:items-center justify-between group p-6"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full overflow-hidden bg-slate-800 flex-shrink-0">
                  {t.avatar ? (
                    <Image src={t.avatar} alt={t.name} width={48} height={48} className="object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-violet-500/20 text-violet-400">
                      <User className="w-6 h-6" />
                    </div>
                  )}
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">{t.name}</h3>
                  <p className="text-xs text-slate-400 font-medium">{t.role} at {t.company}</p>
                  <div className="flex gap-1 mt-1">
                    {[1, 2, 3, 4, 5].map(i => (
                      <Star key={i} className={`w-3 h-3 ${i <= t.rating ? "text-yellow-400 fill-yellow-400" : "text-slate-700"}`} />
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="flex-1 max-w-xl">
                 <div className="text-sm text-slate-300 italic flex gap-2">
                   <Quote className="w-4 h-4 text-violet-500 flex-shrink-0" />
                   <p className="line-clamp-2">{t.content}</p>
                 </div>
              </div>

              <div className="flex gap-2">
                <button 
                  onClick={() => handleEdit(t)}
                  className="p-2 rounded-lg bg-white/5 hover:bg-violet-500/10 text-slate-400 hover:text-white transition-all"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => handleDelete(t._id)}
                  className="p-2 rounded-lg bg-white/5 hover:bg-red-500/10 text-slate-400 hover:text-red-400 transition-all"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Modal */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowModal(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm" 
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-xl admin-card p-0 overflow-hidden shadow-2xl"
            >
              <div className="flex items-center justify-between p-6 border-b border-white/5">
                <h2 className="text-xl font-bold text-white">
                  {editingTestimonial ? "Edit Testimonial" : "Create Testimonial"}
                </h2>
                <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="admin-label">Client Name</label>
                    <input 
                      type="text" 
                      required
                      value={formData.name}
                      onChange={e => setFormData({ ...formData, name: e.target.value })}
                      className="admin-input" 
                    />
                  </div>
                  <div>
                    <label className="admin-label">Client Role</label>
                    <input 
                      type="text" 
                      required
                      value={formData.role}
                      onChange={e => setFormData({ ...formData, role: e.target.value })}
                      className="admin-input" 
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="admin-label">Company Name</label>
                    <input 
                      type="text" 
                      required
                      value={formData.company}
                      onChange={e => setFormData({ ...formData, company: e.target.value })}
                      className="admin-input" 
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="admin-label">Feedback</label>
                    <textarea 
                      required
                      rows={4}
                      value={formData.content}
                      onChange={e => setFormData({ ...formData, content: e.target.value })}
                      className="admin-input resize-none" 
                    />
                  </div>
                  <div>
                    <label className="admin-label">Star Rating (1-5)</label>
                    <div className="flex gap-2 pt-2">
                      {[1, 2, 3, 4, 5].map(i => (
                        <button 
                          key={i} 
                          type="button" 
                          onClick={() => setFormData({ ...formData, rating: i })}
                          className={`transition-all ${i <= formData.rating ? "scale-110" : "opacity-30"}`}
                        >
                          <Star className={`w-6 h-6 ${i <= formData.rating ? "text-yellow-400 fill-yellow-400" : "text-slate-400"}`} />
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="admin-label">Avatar URL</label>
                    <input 
                      type="text" 
                      value={formData.avatar}
                      onChange={e => setFormData({ ...formData, avatar: e.target.value })}
                      className="admin-input" 
                      placeholder="https://..."
                    />
                  </div>
                </div>
              </form>

              <div className="p-6 border-t border-white/5 flex justify-end gap-3">
                <button 
                  onClick={() => setShowModal(false)}
                  className="px-6 py-2 rounded-xl text-sm font-medium text-slate-400 hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleSubmit}
                  disabled={formLoading}
                  className="btn-primary"
                >
                  {formLoading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    editingTestimonial ? "Update Testimonial" : "Post Testimonial"
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
