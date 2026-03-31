"use client";

import { useEffect, useState } from "react";
import { 
  Plus, 
  Search, 
  MoreVertical, 
  Edit2, 
  Trash2, 
  Check,
  Globe,
  Cpu,
  Bot,
  Smartphone,
  Code,
  Loader2,
  X,
  Palette
} from "lucide-react";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";

interface Service {
  _id: string;
  title: string;
  description: string;
  icon: string;
  features: string[];
  color: string;
  order: number;
}

const iconOptions = [
  { name: "Globe", icon: Globe },
  { name: "Cpu", icon: Cpu },
  { name: "Bot", icon: Bot },
  { name: "Smartphone", icon: Smartphone },
  { name: "Code", icon: Code },
];

const colorOptions = [
  { name: "violet", class: "bg-violet-500" },
  { name: "blue", class: "bg-blue-500" },
  { name: "cyan", class: "bg-cyan-500" },
];

export default function AdminServices() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [formLoading, setFormLoading] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    icon: "Code",
    features: "",
    color: "violet",
    order: 0,
  });

  const fetchServices = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/services");
      const data = await res.json();
      setServices(data.data || []);
    } catch (error) {
      toast.error("Failed to fetch services");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const handleEdit = (service: Service) => {
    setEditingService(service);
    setFormData({
      title: service.title,
      description: service.description,
      icon: service.icon,
      features: service.features.join(", "),
      color: service.color,
      order: service.order,
    });
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this service?")) return;
    
    try {
      const res = await fetch(`/api/services/${id}`, { method: "DELETE" });
      if (res.ok) {
        toast.success("Service deleted successfully");
        fetchServices();
      } else {
        toast.error("Failed to delete service");
      }
    } catch (error) {
      toast.error("An error occurred");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);

    const payload = {
      ...formData,
      features: formData.features.split(",").map(f => f.trim()).filter(Boolean),
    };

    try {
      const url = editingService ? `/api/services/${editingService._id}` : "/api/services";
      const method = editingService ? "PUT" : "POST";
      
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        toast.success(`Service ${editingService ? "updated" : "created"} successfully`);
        setShowModal(false);
        setEditingService(null);
        setFormData({
          title: "",
          description: "",
          icon: "Code",
          features: "",
          color: "violet",
          order: 0,
        });
        fetchServices();
      } else {
        const data = await res.json();
        toast.error(data.error || "Failed to save service");
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
          <h1 className="text-3xl font-bold text-white mb-2">Service Management</h1>
          <p className="text-slate-400">Manage the technical services you offer to clients.</p>
        </div>
        <button 
          onClick={() => {
            setEditingService(null);
            setFormData({
              title: "",
              description: "",
              icon: "Code",
              features: "",
              color: "violet",
              order: 0,
            });
            setShowModal(true);
          }}
          className="btn-primary"
        >
          <Plus className="w-4 h-4" />
          Add New Service
        </button>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-center">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="admin-card h-48 animate-pulse bg-white/5" />
          ))}
        </div>
      ) : services.length === 0 ? (
        <div className="admin-card py-20 text-center">
          <div className="text-4xl mb-4">⚙️</div>
          <h3 className="text-xl font-bold text-white mb-2">No services found</h3>
          <p className="text-slate-400">Start by adding your first service offering.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {services.map((service) => (
            <motion.div 
              key={service._id}
              layout
              className="admin-card p-6"
              style={{
                borderLeftColor: service.color === "violet" ? "#7C3AED" : service.color === "blue" ? "#3B82F6" : "#06B6D4",
                borderLeftWidth: "4px"
              }}
            >
              <div className="flex justify-between items-start mb-4">
                <div className={`p-3 rounded-xl bg-white/5 text-${service.color}-400`}>
                  {(() => {
                    const Icon = iconOptions.find(i => i.name === service.icon)?.icon || Code;
                    return <Icon className="w-6 h-6" />;
                  })()}
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={() => handleEdit(service)}
                    className="p-2 rounded-lg bg-white/5 hover:bg-violet-500/10 text-slate-400 hover:text-white transition-all"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => handleDelete(service._id)}
                    className="p-2 rounded-lg bg-white/5 hover:bg-red-500/10 text-slate-400 hover:text-red-400 transition-all"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-bold text-white mb-2">{service.title}</h3>
                <p className="text-sm text-slate-400 mb-4 line-clamp-2">{service.description}</p>
                <div className="flex flex-wrap gap-2">
                  {service.features.map((feature, i) => (
                    <span key={i} className="flex items-center gap-1 text-[10px] text-slate-500 font-medium bg-white/5 px-2 py-1 rounded">
                      <Check className="w-3 h-3 text-green-500" />
                      {feature}
                    </span>
                  ))}
                </div>
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
              {/* Modal Header */}
              <div className="flex items-center justify-between p-6 border-b border-white/5">
                <h2 className="text-xl font-bold text-white">
                  {editingService ? "Edit Service" : "New Service"}
                </h2>
                <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Form Content */}
              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Title */}
                  <div className="md:col-span-2">
                    <label className="admin-label">Service Title</label>
                    <input 
                      type="text" 
                      required
                      value={formData.title}
                      onChange={e => setFormData({ ...formData, title: e.target.value })}
                      className="admin-input" 
                      placeholder="e.g. Custom Software Development"
                    />
                  </div>

                  {/* Description */}
                  <div className="md:col-span-2">
                    <label className="admin-label">Description</label>
                    <textarea 
                      required
                      rows={3}
                      value={formData.description}
                      onChange={e => setFormData({ ...formData, description: e.target.value })}
                      className="admin-input resize-none" 
                      placeholder="Explain what the service covers..."
                    />
                  </div>

                  {/* Icon Selection */}
                  <div>
                    <label className="admin-label">Icon</label>
                    <div className="grid grid-cols-5 gap-2">
                      {iconOptions.map((option) => (
                        <button
                          key={option.name}
                          type="button"
                          onClick={() => setFormData({ ...formData, icon: option.name })}
                          className={`p-3 rounded-lg border flex items-center justify-center transition-all ${
                            formData.icon === option.name 
                              ? "border-violet-500 bg-violet-500/10 text-violet-400" 
                              : "border-white/5 bg-slate-900 text-slate-500 hover:text-slate-300"
                          }`}
                        >
                          <option.icon className="w-5 h-5" />
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Color Selection */}
                  <div>
                    <label className="admin-label flex items-center gap-2">
                      <Palette className="w-4 h-4" />
                      Theme Color
                    </label>
                    <div className="flex gap-3 pt-1">
                      {colorOptions.map((option) => (
                        <button
                          key={option.name}
                          type="button"
                          onClick={() => setFormData({ ...formData, color: option.name })}
                          className={`w-10 h-10 rounded-full border-2 transition-all flex items-center justify-center ${
                            formData.color === option.name 
                              ? "border-white scale-110" 
                              : "border-transparent opacity-50"
                          }`}
                        >
                          <div className={`w-8 h-8 rounded-full ${option.class}`} />
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Features */}
                  <div className="md:col-span-2">
                    <label className="admin-label">Key Features (comma separated)</label>
                    <input 
                      type="text" 
                      value={formData.features}
                      onChange={e => setFormData({ ...formData, features: e.target.value })}
                      className="admin-input" 
                      placeholder="SEO, Cloud Hosting, Analytics"
                    />
                  </div>

                  {/* Order */}
                  <div>
                    <label className="admin-label">Display Order</label>
                    <input 
                      type="number" 
                      value={formData.order}
                      onChange={e => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
                      className="admin-input" 
                    />
                  </div>
                </div>
              </form>

              {/* Modal Footer */}
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
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    editingService ? "Update Service" : "Create Service"
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
