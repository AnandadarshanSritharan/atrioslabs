import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Message from "@/lib/models/Message";
import { isAuthenticated } from "@/lib/auth";

// GET /api/messages - Admin
export async function GET(request: NextRequest) {
  const admin = isAuthenticated(request);
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await connectDB();
    const messages = await Message.find().sort({ createdAt: -1 });
    return NextResponse.json({ success: true, data: messages });
  } catch (error) {
    console.error("GET /api/messages error:", error);
    return NextResponse.json({ error: "Failed to fetch messages" }, { status: 500 });
  }
}

// DELETE /api/messages/[id] - Admin
// Handling DELETE in a separate dynamic route is better, but for simplicity we can check for an ID in the body or URL if we want.
// However, standard Next.js app router practice is a dynamic route for [id].
// I'll create the dynamic route separately.
