import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import connectDB from "../src/lib/db";
import Admin from "../src/lib/models/Admin";
import Project from "../src/lib/models/Project";
import Service from "../src/lib/models/Service";
import About from "../src/lib/models/About";
import Contact from "../src/lib/models/Contact";
import Testimonial from "../src/lib/models/Testimonial";

const seed = async () => {
  try {
    console.log("🌱 Starting database seeding...");
    await connectDB();

    // Clear existing data
    await Promise.all([
      Admin.deleteMany({}),
      Project.deleteMany({}),
      Service.deleteMany({}),
      About.deleteMany({}),
      Contact.deleteMany({}),
      Testimonial.deleteMany({}),
    ]);
    console.log("🧹 Cleared existing data");

    // Create Admin
    const hashedPassword = await bcrypt.hash("admin123", 10);
    await Admin.create({
      email: "admin@atrioslabs.com",
      password: hashedPassword,
      name: "Atrios Admin",
    });
    console.log("👤 Created admin user (admin@atrioslabs.com / admin123)");

    // Create Services
    const services = await Service.insertMany([
      {
        title: "Web Development",
        description: "High-performance, responsive web applications built with modern frameworks like Next.js and React.",
        icon: "Globe",
        features: ["Custom UI/UX", "SEO Optimization", "Performance Tuning"],
        color: "violet",
        order: 1,
      },
      {
        title: "IoT Solutions",
        description: "End-to-end IoT ecosystems connecting devices to the cloud for real-time monitoring and automation.",
        icon: "Cpu",
        features: ["Sensor Integration", "Real-time Dashboards", "Edge Computing"],
        color: "blue",
        order: 2,
      },
      {
        title: "AI & Automation",
        description: "Intelligent solutions leveraging machine learning and NLP to automate complex business processes.",
        icon: "Bot",
        features: ["Process Automation", "Predictive Analytics", "Custom Chatbots"],
        color: "cyan",
        order: 3,
      },
      {
        title: "App Development",
        description: "Native and cross-platform mobile applications designed for seamless user experiences on iOS and Android.",
        icon: "Smartphone",
        features: ["React Native", "Push Notifications", "Offline Support"],
        color: "violet",
        order: 4,
      },
    ]);
    console.log("⚙️ Seeded services");

    // Create Projects
    await Project.insertMany([
      {
        title: "E-commerce Platform X",
        description: "A full-scale e-commerce solution with real-time inventory and AI-driven recommendations.",
        image: "https://images.unsplash.com/photo-1557821552-17105176677c?q=80&w=2089&auto=format&fit=crop",
        category: "Web",
        tags: ["Next.js", "MongoDB", "Stripe"],
        featured: true,
        order: 1,
      },
      {
        title: "Smart Factory Monitor",
        description: "IoT dashboard for monitoring industrial machinery state and predicting maintenance needs.",
        image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=2070&auto=format&fit=crop",
        category: "IoT",
        tags: ["Arduino", "MQTT", "React"],
        featured: true,
        order: 2,
      },
      {
        title: "AI Customer Support",
        description: "Advanced NLP chatbot capable of handling 80% of routine customer inquiries autonomously.",
        image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=2070&auto=format&fit=crop",
        category: "AI",
        tags: ["Python", "OpenAI", "Node.js"],
        featured: true,
        order: 3,
      },
    ]);
    console.log("📂 Seeded projects");

    // Create About Info
    await About.create({
      tagline: "Think Beyond Technology",
      description: "Atrios Labs is a forward-thinking technology company specializing in web development, IoT solutions, AI automation, and application development. We combine deep technical expertise with creative design to build products that matter.",
      mission: "To empower businesses with cutting-edge technology solutions that drive growth, efficiency, and innovation — making the digital future accessible to all.",
      vision: "To be the most trusted technology partner globally, transforming ideas into intelligent, scalable solutions that shape the next generation of digital experiences.",
      stats: {
        projects: 50,
        clients: 30,
        years: 5,
        team: 20,
      }
    });
    console.log("ℹ️ Seeded about info");

    // Create Contact Info
    await Contact.create({
      email: "hello@atrioslabs.com",
      phone: "+91 98765 43210",
      address: "Hyderabad, Telangana, India",
      linkedIn: "https://linkedin.com/company/atrioslabs",
      twitter: "https://twitter.com/atrioslabs",
      github: "https://github.com/atrioslabs",
      instagram: "https://instagram.com/atrioslabs",
      mapEmbedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15228.4552462335!2d78.369796!3d17.447466!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bcb93976378e0f5%3A0xc005fb5efbc39223!2sMadhapur%2C%20Hyderabad%2C%20Telangana%2C%20India!5e0!3m2!1sen!2sin!4v1711800000000!5m2!1sen!2sin",
    });
    console.log("📞 Seeded contact info");

    // Create Testimonials
    await Testimonial.insertMany([
      {
        name: "Arjun Mehta",
        role: "CTO",
        company: "TechBridge Solutions",
        content: "Atrios Labs transformed our vision into a stunning web platform in record time. Their technical depth and proactive communication made the entire project a smooth experience.",
        rating: 5,
        order: 1,
      },
      {
        name: "Priya Sharma",
        role: "Product Manager",
        company: "SmartEdge IoT",
        content: "The IoT dashboard they built for us is incredibly intuitive and robust. We went from data chaos to real-time clarity — and our clients love it.",
        rating: 5,
        order: 2,
      }
    ]);
    console.log("💬 Seeded testimonials");

    console.log("✅ Seeding completed successfully!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Seeding failed:", error);
    process.exit(1);
  }
};

seed();
