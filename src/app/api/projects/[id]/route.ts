import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Project from "@/lib/models/Project";
import { isAuthenticated } from "@/lib/auth";
import { deleteImage } from "@/lib/cloudinary";

// GET /api/projects/:id
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDB();
    const { id } = await params;
    const project = await Project.findById(id);
    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: project });
  } catch (error) {
    console.error("GET /api/projects/[id] error:", error);
    return NextResponse.json({ error: "Failed to fetch project" }, { status: 500 });
  }
}

// PUT /api/projects/:id - Admin
export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const admin = isAuthenticated(request);
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await connectDB();
    const { id } = await params;
    const body = await request.json();

    // Get the existing project to check for the old image
    const oldProject = await Project.findById(id);
    if (!oldProject) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    // If the image is being changed and there's an old publicId, delete it from Cloudinary
    if (body.imagePublicId && oldProject.imagePublicId && body.imagePublicId !== oldProject.imagePublicId) {
      try {
        await deleteImage(oldProject.imagePublicId);
      } catch (err) {
        console.warn("Failed to delete old image from Cloudinary:", err);
      }
    }

    const project = await Project.findByIdAndUpdate(id, body, { new: true, runValidators: true });

    return NextResponse.json({ success: true, data: project });
  } catch (error) {
    console.error("PUT /api/projects/[id] error:", error);
    return NextResponse.json({ error: "Failed to update project" }, { status: 500 });
  }
}

// DELETE /api/projects/:id - Admin
export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const admin = isAuthenticated(request);
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await connectDB();
    const { id } = await params;
    const project = await Project.findByIdAndDelete(id);

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    // Delete image from Cloudinary if exists
    if (project.imagePublicId) {
      try {
        await deleteImage(project.imagePublicId);
      } catch {
        console.warn("Failed to delete Cloudinary image:", project.imagePublicId);
      }
    }

    return NextResponse.json({ success: true, message: "Project deleted" });
  } catch (error) {
    console.error("DELETE /api/projects/[id] error:", error);
    return NextResponse.json({ error: "Failed to delete project" }, { status: 500 });
  }
}
