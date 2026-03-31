import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import About from "@/lib/models/About";
import { isAuthenticated } from "@/lib/auth";

// GET /api/about - Public
export async function GET() {
  try {
    await connectDB();
    let about = await About.findOne();
    if (!about) {
      about = await About.create({});
    }
    return NextResponse.json({ success: true, data: about });
  } catch (error) {
    console.error("GET /api/about error:", error);
    return NextResponse.json({ error: "Failed to fetch about data" }, { status: 500 });
  }
}

// PUT /api/about - Admin
export async function PUT(request: NextRequest) {
  const admin = isAuthenticated(request);
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await connectDB();
    const body = await request.json();
    let about = await About.findOne();

    if (!about) {
      about = await About.create(body);
    } else {
      about = await About.findByIdAndUpdate(about._id, body, { new: true, runValidators: true });
    }

    return NextResponse.json({ success: true, data: about });
  } catch (error) {
    console.error("PUT /api/about error:", error);
    return NextResponse.json({ error: "Failed to update about data" }, { status: 500 });
  }
}
