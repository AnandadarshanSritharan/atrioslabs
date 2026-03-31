import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Project from "@/lib/models/Project";
import { isAuthenticated } from "@/lib/auth";

// GET /api/projects - Public
export async function GET(request: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");

    const filter = category && category !== "All" ? { category } : {};
    const projects = await Project.find(filter).sort({ order: 1, createdAt: -1 });

    return NextResponse.json({ success: true, data: projects });
  } catch (error) {
    console.error("GET /api/projects error:", error);
    return NextResponse.json({ error: "Failed to fetch projects" }, { status: 500 });
  }
}

// POST /api/projects - Admin only
export async function POST(request: NextRequest) {
  const admin = isAuthenticated(request);
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await connectDB();
    const body = await request.json();
    const { title, description, image, imagePublicId, category, tags, liveUrl, githubUrl, featured, order } = body;

    if (!title || !description || !image || !category) {
      return NextResponse.json(
        { error: "Title, description, image, and category are required" },
        { status: 400 }
      );
    }

    const project = await Project.create({
      title, description, image, imagePublicId, category,
      tags: tags || [],
      liveUrl, githubUrl,
      featured: featured ?? false,
      order: order ?? 0,
    });

    return NextResponse.json({ success: true, data: project }, { status: 201 });
  } catch (error) {
    console.error("POST /api/projects error:", error);
    return NextResponse.json({ error: "Failed to create project" }, { status: 500 });
  }
}
