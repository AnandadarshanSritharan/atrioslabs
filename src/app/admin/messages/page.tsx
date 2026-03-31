"use client";

import { useEffect, useState } from "react";
import { 
  Mail, 
  Trash2, 
  Clock, 
  User, 
  CheckCircle, 
  Circle,
  Loader2,
  ChevronRight,
  Search
} from "lucide-react";
import toast from "react-hot-toast";

const formatDate = (dateString: string) => {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  }).format(new Date(dateString));
};

const formatFullDate = (dateString: string) => {
  return new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  }).format(new Date(dateString));
};

interface Message {
  _id: string;
  name: string;
  email: string;
  message: string;
  status: "read" | "unread";
  createdAt: string;
}

export default function AdminMessages() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const res = await fetch("/api/messages");
      const json = await res.json();
      if (json.success) {
        setMessages(json.data);
      }
    } catch (error) {
      toast.error("Failed to load messages");
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id: string) => {
    try {
      const res = await fetch(`/api/messages/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "read" }),
      });
      if (res.ok) {
        setMessages(messages.map(m => m._id === id ? { ...m, status: "read" } : m));
        if (selectedMessage?._id === id) {
          setSelectedMessage({ ...selectedMessage, status: "read" });
        }
      }
    } catch (error) {
      console.error("Error marking as read:", error);
    }
  };

  const deleteMessage = async (id: string) => {
    if (!confirm("Are you sure you want to delete this message?")) return;
    try {
      const res = await fetch(`/api/messages/${id}`, { method: "DELETE" });
      if (res.ok) {
        setMessages(messages.filter(m => m._id !== id));
        if (selectedMessage?._id === id) setSelectedMessage(null);
        toast.success("Message deleted");
      }
    } catch (error) {
      toast.error("Failed to delete message");
    }
  };

  const filteredMessages = messages.filter(m => 
    m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.message.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelectMessage = (msg: Message) => {
    setSelectedMessage(msg);
    if (msg.status === "unread") {
      markAsRead(msg._id);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 text-violet-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8 h-[calc(100vh-100px)] flex flex-col">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 shrink-0">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">User Messages</h1>
          <p className="text-slate-400">Manage inquiries from your contact form.</p>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="text"
            placeholder="Search messages..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="admin-input pl-10 w-full md:w-64"
          />
        </div>
      </div>

      <div className="flex flex-1 gap-6 overflow-hidden min-h-0">
        {/* Messages List */}
        <div className="flex-1 overflow-y-auto space-y-3 pr-2 scrollbar-thin scrollbar-thumb-white/10">
          {filteredMessages.length === 0 ? (
            <div className="text-center py-12 admin-card">
              <Mail className="w-12 h-12 text-slate-600 mx-auto mb-4" />
              <p className="text-slate-400">No messages found.</p>
            </div>
          ) : (
            filteredMessages.map((msg) => (
              <div
                key={msg._id}
                onClick={() => handleSelectMessage(msg)}
                className={`admin-card cursor-pointer transition-all duration-200 border-l-4 ${
                  selectedMessage?._id === msg._id 
                    ? "border-l-violet-500 bg-white/5" 
                    : msg.status === "unread" 
                      ? "border-l-blue-500" 
                      : "border-l-transparent hover:bg-white/5"
                }`}
              >
                <div className="flex justify-between items-start gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className={`font-semibold truncate ${msg.status === "unread" ? "text-white" : "text-slate-300"}`}>
                        {msg.name}
                      </h3>
                      {msg.status === "unread" && (
                        <span className="w-2 h-2 rounded-full bg-blue-500 shrink-0" />
                      )}
                    </div>
                    <p className="text-sm text-slate-400 truncate">{msg.email}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-[10px] text-slate-500 font-medium uppercase tracking-wider">
                      {formatDate(msg.createdAt)}
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Message Detail */}
        <div className="hidden lg:block w-[450px] shrink-0">
          {selectedMessage ? (
            <div className="admin-card h-full flex flex-col">
              <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-violet-500/20 flex items-center justify-center text-violet-400 font-bold">
                    {selectedMessage.name[0].toUpperCase()}
                  </div>
                  <div>
                    <h2 className="text-white font-bold">{selectedMessage.name}</h2>
                    <p className="text-sm text-slate-400">{selectedMessage.email}</p>
                  </div>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteMessage(selectedMessage._id);
                  }}
                  className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
                  title="Delete message"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto space-y-6">
                <div className="bg-white/5 rounded-2xl p-6 border border-white/5">
                  <div className="flex items-center gap-2 text-xs text-slate-500 mb-4 uppercase tracking-widest font-semibold">
                    <Clock className="w-3 h-3" />
                    Sent {formatFullDate(selectedMessage.createdAt)}
                  </div>
                  <div className="text-slate-200 leading-relaxed whitespace-pre-wrap">
                    {selectedMessage.message}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl bg-white/5 border border-white/5 text-center">
                    <p className="text-xs text-slate-500 mb-1">Status</p>
                    <div className="flex items-center justify-center gap-2 text-sm font-medium text-white">
                      {selectedMessage.status === "read" ? (
                        <><CheckCircle className="w-4 h-4 text-green-400" /> Read</>
                      ) : (
                        <><Circle className="w-4 h-4 text-blue-400" /> Unread</>
                      )}
                    </div>
                  </div>
                  <a
                    href={`mailto:${selectedMessage.email}`}
                    className="p-4 rounded-xl bg-violet-600/10 border border-violet-500/20 text-center hover:bg-violet-600/20 transition-colors"
                  >
                    <p className="text-xs text-violet-400 mb-1">Quick Reply</p>
                    <span className="text-sm font-medium text-white flex items-center justify-center gap-2">
                       Reply <ChevronRight className="w-4 h-4" />
                    </span>
                  </a>
                </div>
              </div>
            </div>
          ) : (
            <div className="admin-card h-full flex flex-col items-center justify-center text-center opacity-50">
              <Mail className="w-16 h-16 text-slate-700 mb-4" />
              <p className="text-slate-500">Select a message to view details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
