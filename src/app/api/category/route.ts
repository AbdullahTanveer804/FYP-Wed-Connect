import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import connectDB from "@/lib/db/connectDB";
import User from "@/app/model/userModel";
import Category from "@/app/model/categoryModel";
import { z } from "zod";
import { categorySchema } from "@/Schemas/category";


// POST /api/categories  Create a new category (Admin only)
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    // Check if user is admin
    const user = await User.findById(session.user._id);
    if (!user || user.role !== "ADMIN") {
      return NextResponse.json({ error: "Only admins can create categories" }, { status: 403 });
    }

    const body = await req.json();
    const { name } = categorySchema.parse(body);

    // Check for duplicates (case-insensitive)
    const existing = await Category.findOne({
      name: { $regex: new RegExp(`^${name}$`, "i") },
    });

    if (existing) {
      return NextResponse.json({ error: "Category already exists" }, { status: 409 });
    }

    const newCategory = await Category.create({
      name,
      createdBy: session.user._id,
    });

    return NextResponse.json({ message: "Category created", category: newCategory }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    console.error("Error creating category:", error);
    return NextResponse.json({ error: "Failed to create category" }, { status: 500 });
  }
}

// GET /api/categories  Get all categories
export async function GET() {
  try {
    await connectDB();
    const categories = await Category.find().sort({ createdAt: -1 });
    return NextResponse.json({ categories }, { status: 200 });
  } catch (error) {
    console.error("Error fetching categories:", error);
    return NextResponse.json({ error: "Failed to fetch categories" }, { status: 500 });
  }
}
