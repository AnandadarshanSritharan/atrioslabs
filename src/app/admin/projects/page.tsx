"use client";

import { useEffect, useState } from "react";
import { 
  Plus, 
  Search, 
  Filter, 
  MoreVertical, 
  Edit2, 
  Trash2, 
  Eye, 
  ExternalLink,
  Image as ImageIcon,
  Loader2,
  X
} from "lucide-react";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

interface Project {
  _id: string;
  title: string;
  description: string;
  image: string;
  category: "Web" | "AI" | "IoT" | "Apps";
  tags: string[];
  liveUrl?: string;
  githubUrl?: string;
  featured: boolean;
}

export default function AdminProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [formLoading, setFormLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    image: "",
    category: "Web",
    tags: "",
    liveUrl: "",
    githubUrl: "",
    featured: false,
  });

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/projects");
      const data = await res.json();
      setProjects(data.data || []);
    } catch (error) {
      toast.error("Failed to fetch projects");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleEdit = (project: Project) => {
    setEditingProject(project);
    setFormData({
      title: project.title,
      description: project.description,
      image: project.image,
      category: project.category,
      tags: project.tags.join(", "),
      liveUrl: project.liveUrl || "",
      githubUrl: project.githubUrl || "",
      featured: project.featured,
    });
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this project?")) return;
    
    try {
      const res = await fetch(`/api/projects/${id}`, { method: "DELETE" });
      if (res.ok) {
        toast.success("Project deleted successfully");
        fetchProjects();
      } else {
        toast.error("Failed to delete project");
      }
    } catch (error) {
      toast.error("An error occurred");
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const body = new FormData();
    body.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body,
      });
      const data = await res.json();
      if (data.success) {
        setFormData({ ...formData, image: data.url });
        toast.success("Image uploaded!");
      } else {
        toast.error(data.error || "Upload failed");
      }
    } catch (error) {
      toast.error("Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);

    const payload = {
      ...formData,
      tags: formData.tags.split(",").map(t => t.trim()).filter(Boolean),
    };

    try {
      const url = editingProject ? `/api/projects/${editingProject._id}` : "/api/projects";
      const method = editingProject ? "PUT" : "POST";
      
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        toast.success(`Project ${editingProject ? "updated" : "created"} successfully`);
        setShowModal(false);
        setEditingProject(null);
        setFormData({
          title: "",
          description: "",
          image: "",
          category: "Web",
          tags: "",
          liveUrl: "",
          githubUrl: "",
          featured: false,
        });
        fetchProjects();
      } else {
        const data = await res.json();
        toast.error(data.error || "Failed to save project");
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
          <h1 className="text-3xl font-bold text-white mb-2">Project Management</h1>
          <p className="text-slate-400">Add, edit or remove projects from your portfolio.</p>
        </div>
        <button 
          onClick={() => {
            setEditingProject(null);
            setFormData({
              title: "",
              description: "",
              image: "",
              category: "Web",
              tags: "",
              liveUrl: "",
              githubUrl: "",
              featured: false,
            });
            setShowModal(true);
          }}
          className="btn-primary"
        >
          <Plus className="w-4 h-4" />
          Add New Project
        </button>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input 
            type="text" 
            placeholder="Search projects..." 
            className="admin-input pl-10"
          />
        </div>
        <div className="flex gap-2">
          <button className="admin-card py-2 px-4 flex items-center gap-2 text-sm text-slate-300">
            <Filter className="w-4 h-4" />
            Category
          </button>
        </div>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => (
            <div key={i} className="admin-card h-64 animate-pulse bg-white/5" />
          ))}
        </div>
      ) : projects.length === 0 ? (
        <div className="admin-card py-20 text-center">
          <div className="text-4xl mb-4">📂</div>
          <h3 className="text-xl font-bold text-white mb-2">No projects found</h3>
          <p className="text-slate-400">Start by adding your first project.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {projects.map((project) => (
            <motion.div 
              key={project._id}
              layout
              className="admin-card group p-4 space-y-4"
            >
              {/* Image Preview */}
              <div className="relative h-48 rounded-xl overflow-hidden bg-slate-800">
                <Image 
                  src={project.image} 
                  alt={project.title} 
                  fill 
                  className="object-cover group-hover:scale-105 transition-transform"
                />
                <div className="absolute top-2 left-2">
                  <span className="px-2 py-1 rounded-lg bg-black/60 backdrop-blur-md text-[10px] font-bold text-white uppercase tracking-wider">
                    {project.category}
                  </span>
                </div>
              </div>

              {/* Info */}
              <div>
                <h3 className="text-lg font-bold text-white mb-1 line-clamp-1">{project.title}</h3>
                <p className="text-sm text-slate-400 line-clamp-2 h-10 mb-4">{project.description}</p>
                <div className="flex flex-wrap gap-1 mb-4">
                  {project.tags.slice(0, 3).map(tag => (
                    <span key={tag} className="text-[10px] bg-white/5 border border-white/10 px-2 py-0.5 rounded text-slate-300">
                      {tag}
                    </span>
                  ))}
                  {project.tags.length > 3 && <span className="text-[10px] text-slate-500">+{project.tags.length - 3}</span>}
                </div>
              </div>

              {/* Actions */}
              <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                <div className="flex gap-2">
                  <button 
                    onClick={() => handleEdit(project)}
                    className="p-2 rounded-lg bg-white/5 hover:bg-violet-500/10 text-slate-400 hover:text-violet-400 transition-all"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => handleDelete(project._id)}
                    className="p-2 rounded-lg bg-white/5 hover:bg-red-500/10 text-slate-400 hover:text-red-400 transition-all"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <div className="flex gap-2">
                  {project.liveUrl && (
                    <a href={project.liveUrl} target="_blank" className="p-2 rounded-lg bg-white/5 text-slate-400 hover:text-white transition-all">
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  )}
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
              className="relative w-full max-w-2xl admin-card p-0 overflow-hidden shadow-2xl"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between p-6 border-b border-white/5">
                <h2 className="text-xl font-bold text-white">
                  {editingProject ? "Edit Project" : "New Project"}
                </h2>
                <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Form Content */}
              <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[70vh] overflow-y-auto no-scrollbar">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Title */}
                  <div className="md:col-span-2">
                    <label className="admin-label">Project Title</label>
                    <input 
                      type="text" 
                      required
                      value={formData.title}
                      onChange={e => setFormData({ ...formData, title: e.target.value })}
                      className="admin-input" 
                      placeholder="e.g. Modern E-commerce Platform"
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
                      placeholder="Describe the project goal, tech stack and results..."
                    />
                  </div>

                  {/* Category */}
                  <div>
                    <label className="admin-label">Category</label>
                    <select 
                      value={formData.category}
                      onChange={e => setFormData({ ...formData, category: e.target.value as any })}
                      className="admin-input"
                    >
                      <option value="Web">Web Development</option>
                      <option value="AI">AI & Automation</option>
                      <option value="IoT">IoT Solutions</option>
                      <option value="Apps">Application Development</option>
                    </select>
                  </div>

                  {/* Tags */}
                  <div>
                    <label className="admin-label">Tags (comma separated)</label>
                    <input 
                      type="text" 
                      value={formData.tags}
                      onChange={e => setFormData({ ...formData, tags: e.target.value })}
                      className="admin-input" 
                      placeholder="React, Node.js, TailWind"
                    />
                  </div>

                  {/* Image Upload */}
                  <div className="md:col-span-2">
                    <label className="admin-label">Project Image</label>
                    <div className="flex flex-col md:flex-row gap-4 items-start">
                      <div className="relative w-full md:w-48 h-32 rounded-xl border-2 border-dashed border-slate-700 overflow-hidden group flex items-center justify-center bg-slate-800/50">
                        {formData.image ? (
                          <>
                            <Image src={formData.image} alt="Preview" fill className="object-cover" />
                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                              <label className="cursor-pointer text-white text-xs font-bold py-2 px-3 bg-violet-600 rounded-lg">
                                Change Image
                                <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                              </label>
                            </div>
                          </>
                        ) : (
                          <label className="cursor-pointer flex flex-col items-center gap-2 text-slate-500 hover:text-slate-300 transition-colors">
                            <ImageIcon className="w-8 h-8" />
                            <span className="text-xs font-medium">Upload Image</span>
                            <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                          </label>
                        )}
                        {uploading && (
                          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                            <Loader2 className="w-6 h-6 text-violet-400 animate-spin" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 space-y-4 w-full">
                        <input 
                          type="text" 
                          placeholder="Or paste direct image URL..." 
                          className="admin-input"
                          value={formData.image}
                          onChange={e => setFormData({ ...formData, image: e.target.value })}
                        />
                        <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Recommended size: 1200 x 800px</p>
                      </div>
                    </div>
                  </div>

                  {/* Links */}
                  <div>
                    <label className="admin-label">Live URL</label>
                    <input 
                      type="url" 
                      value={formData.liveUrl}
                      onChange={e => setFormData({ ...formData, liveUrl: e.target.value })}
                      className="admin-input" 
                      placeholder="https://..."
                    />
                  </div>
                  <div>
                    <label className="admin-label">Github URL</label>
                    <input 
                      type="url" 
                      value={formData.githubUrl}
                      onChange={e => setFormData({ ...formData, githubUrl: e.target.value })}
                      className="admin-input" 
                      placeholder="https://github.com/..."
                    />
                  </div>
                </div>

                {/* Featured */}
                <div className="flex items-center gap-3 py-2">
                  <input 
                    type="checkbox" 
                    id="featured"
                    checked={formData.featured}
                    onChange={e => setFormData({ ...formData, featured: e.target.checked })}
                    className="w-4 h-4 rounded border-slate-700 bg-slate-900 text-violet-600 focus:ring-violet-500" 
                  />
                  <label htmlFor="featured" className="text-sm font-medium text-slate-300 cursor-pointer">Mark as Featured Project</label>
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
                  disabled={formLoading || uploading}
                  className="btn-primary"
                >
                  {formLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    editingProject ? "Update Project" : "Create Project"
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
