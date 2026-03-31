"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Send, Loader2, CheckCircle } from "lucide-react";
import toast from "react-hot-toast";
import AnimatedSection from "@/components/shared/AnimatedSection";

interface ContactData {
  email: string;
  phone: string;
  address: string;
  linkedIn?: string;
  twitter?: string;
  github?: string;
}

interface FormData {
  name: string;
  email: string;
  message: string;
}

export default function Contact() {
  const [contactInfo, setContactInfo] = useState<ContactData | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormData>();

  useEffect(() => {
    fetch("/api/contact")
      .then((r) => r.json())
      .then((d) => setContactInfo(d.data))
      .catch(() => {});
  }, []);

  const onSubmit = async (data: FormData) => {
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (res.ok) {
        setSubmitted(true);
        reset();
        toast.success(json.message || "Message sent successfully!");
        setTimeout(() => setSubmitted(false), 5000);
      } else {
        toast.error(json.error || "Failed to send message");
      }
    } catch {
      toast.error("Something went wrong. Please try again.");
    }
  };

  const info = contactInfo || {
    email: "hello@atrioslabs.com",
    phone: "+91 98765 43210",
    address: "Hyderabad, Telangana, India",
  };

  return (
    <section id="contact" className="section-padding" style={{ background: "#0A0A0F" }}>
      <div className="container-max">
        {/* Header */}
        <AnimatedSection className="text-center mb-16">
          <span className="section-label">Contact Us</span>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Let&apos;s{" "}
            <span className="gradient-text">Connect</span>
          </h2>
          <p className="text-slate-400 max-w-xl mx-auto">
            Have a project in mind? We&apos;d love to hear about it. Drop us a message and
            we&apos;ll get back to you within 24 hours.
          </p>
        </AnimatedSection>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left: Contact info */}
          <AnimatedSection direction="left" className="space-y-6">
            <div
              className="rounded-3xl p-8 space-y-6"
              style={{
                background: "linear-gradient(135deg, rgba(124,58,237,0.08), rgba(37,99,235,0.05))",
                border: "1px solid rgba(124,58,237,0.2)",
              }}
            >
              <h3 className="text-2xl font-bold text-white">Get in Touch</h3>
              <p className="text-slate-400">
                We&apos;re available Monday to Friday, 9am to 6pm IST. For urgent inquiries,
                reach us on LinkedIn.
              </p>

              <div className="space-y-4">
                {[
                  { icon: Mail, label: "Email", value: info.email, href: `mailto:${info.email}` },
                  { icon: Phone, label: "Phone", value: info.phone, href: `tel:${info.phone}` },
                  { icon: MapPin, label: "Location", value: info.address, href: "#" },
                ].map((item) => (
                  <a
                    key={item.label}
                    href={item.href}
                    className="flex items-start gap-4 group cursor-pointer"
                  >
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform"
                      style={{ background: "rgba(124,58,237,0.15)", border: "1px solid rgba(124,58,237,0.2)" }}
                    >
                      <item.icon className="w-5 h-5 text-violet-400" />
                    </div>
                    <div>
                      <div className="text-xs text-slate-500 mb-0.5">{item.label}</div>
                      <div className="text-slate-200 group-hover:text-violet-300 transition-colors">
                        {item.value}
                      </div>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          </AnimatedSection>

          {/* Right: Form */}
          <AnimatedSection direction="right">
            <div
              className="rounded-3xl p-8"
              style={{
                background: "rgba(18,18,26,0.8)",
                border: "1px solid rgba(42,42,62,0.8)",
              }}
            >
              {submitted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="h-full flex flex-col items-center justify-center text-center py-12"
                >
                  <CheckCircle className="w-16 h-16 text-violet-400 mb-4" />
                  <h3 className="text-2xl font-bold text-white mb-2">Message Sent!</h3>
                  <p className="text-slate-400">
                    Thanks for reaching out. We&apos;ll get back to you within 24 hours.
                  </p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                  <h3 className="text-2xl font-bold text-white mb-6">Send a Message</h3>

                  <div>
                    <label className="admin-label">Full Name *</label>
                    <input
                      {...register("name", { required: "Name is required" })}
                      className="admin-input"
                      placeholder="John Doe"
                      id="contact-name"
                    />
                    {errors.name && (
                      <p className="text-red-400 text-xs mt-1">{errors.name.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="admin-label">Email Address *</label>
                    <input
                      {...register("email", {
                        required: "Email is required",
                        pattern: { value: /^\S+@\S+$/i, message: "Invalid email address" },
                      })}
                      className="admin-input"
                      placeholder="john@example.com"
                      id="contact-email"
                    />
                    {errors.email && (
                      <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="admin-label">Message *</label>
                    <textarea
                      {...register("message", {
                        required: "Message is required",
                        minLength: { value: 20, message: "Please write at least 20 characters" },
                      })}
                      className="admin-input resize-none"
                      rows={5}
                      placeholder="Tell us about your project..."
                      id="contact-message"
                    />
                    {errors.message && (
                      <p className="text-red-400 text-xs mt-1">{errors.message.message}</p>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="btn-primary w-full justify-center text-base py-4 disabled:opacity-60 disabled:cursor-not-allowed"
                    id="contact-submit"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        Send Message
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
}
