import { NextRequest, NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";
import connectDB from "@/lib/db";
import Admin from "@/lib/models/Admin";

export async function GET(request: NextRequest) {
  try {
    const payload = isAuthenticated(request);
    
    if (!payload) {
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401 }
      );
    }

    await connectDB();
    const admin = await Admin.findById(payload.adminId).select("-password");

    if (!admin) {
      return NextResponse.json(
        { error: "Admin not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      user: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
      }
    });
  } catch (error) {
    console.error("GET /api/auth/me error:", error);
    return NextResponse.json(
      { error: "Authentication check failed" },
      { status: 500 }
    );
  }
}
