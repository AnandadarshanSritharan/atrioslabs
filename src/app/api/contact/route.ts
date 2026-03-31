import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Contact from "@/lib/models/Contact";
import Message from "@/lib/models/Message";
import { isAuthenticated } from "@/lib/auth";

// GET /api/contact - Public
export async function GET() {
  try {
    await connectDB();
    let contact = await Contact.findOne();
    if (!contact) {
      contact = await Contact.create({});
    }
    return NextResponse.json({ success: true, data: contact });
  } catch (error) {
    console.error("GET /api/contact error:", error);
    return NextResponse.json({ error: "Failed to fetch contact data" }, { status: 500 });
  }
}

// POST /api/contact - Public (send message) — stored or emailed
export async function POST(request: NextRequest) {
  try {
    const { name, email, message } = await request.json();
    if (!name || !email || !message) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }
    // store in DB
    await connectDB();
    const newMessage = await Message.create({ name, email, message });
    
    console.log("Contact form submission saved:", newMessage._id);
    return NextResponse.json({ success: true, message: "Message received! We'll get back to you soon." });
  } catch (error) {
    console.error("POST /api/contact error:", error);
    return NextResponse.json({ error: "Failed to send message" }, { status: 500 });
  }
}

// PUT /api/contact - Admin
export async function PUT(request: NextRequest) {
  const admin = isAuthenticated(request);
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await connectDB();
    const body = await request.json();
    let contact = await Contact.findOne();

    if (!contact) {
      contact = await Contact.create(body);
    } else {
      contact = await Contact.findByIdAndUpdate(contact._id, body, { new: true });
    }

    return NextResponse.json({ success: true, data: contact });
  } catch (error) {
    console.error("PUT /api/contact error:", error);
    return NextResponse.json({ error: "Failed to update contact data" }, { status: 500 });
  }
}
