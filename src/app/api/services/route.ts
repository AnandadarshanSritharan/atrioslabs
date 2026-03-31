import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Service from "@/lib/models/Service";
import { isAuthenticated } from "@/lib/auth";

// GET /api/services - Public
export async function GET() {
  try {
    await connectDB();
    const services = await Service.find().sort({ order: 1, createdAt: 1 });
    return NextResponse.json({ success: true, data: services });
  } catch (error) {
    console.error("GET /api/services error:", error);
    return NextResponse.json({ error: "Failed to fetch services" }, { status: 500 });
  }
}

// POST /api/services - Admin
export async function POST(request: NextRequest) {
  const admin = isAuthenticated(request);
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await connectDB();
    const body = await request.json();
    const { title, description, icon, features, color, order } = body;

    if (!title || !description) {
      return NextResponse.json({ error: "Title and description are required" }, { status: 400 });
    }

    const service = await Service.create({ title, description, icon, features, color, order });
    return NextResponse.json({ success: true, data: service }, { status: 201 });
  } catch (error) {
    console.error("POST /api/services error:", error);
    return NextResponse.json({ error: "Failed to create service" }, { status: 500 });
  }
}
