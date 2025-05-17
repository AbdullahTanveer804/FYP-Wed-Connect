import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { z } from "zod";
import { authOptions } from "@/lib/authOptions";
import connectDB from "@/lib/db/connectDB";
import User from "@/app/model/userModel";
import { hashPassword } from "@/helpers/authUtils";
import { updateUserSchema } from "@/Schemas/auth";

// PUT /api/user - Update user profile


export async function PUT(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const body = await req.json();
    const validatedData = updateUserSchema.parse(body);
    const userId = session.user._id;

    // Check if email is being changed
    if (validatedData.email && validatedData.email !== session.user.email) {
      const existingUser = await User.findOne({
        email: validatedData.email,
        _id: { $ne: userId },
      });

      if (existingUser) {
        return NextResponse.json(
          { error: "Email is already in use" },
          { status: 400 }
        );
      }
    }

    // Handle password update (hash if present)
    if (validatedData.password) {
      const hashedPassword = await hashPassword(validatedData.password)
      validatedData.password = hashedPassword;
    }

    // Update user
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: validatedData },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    
    console.log(updatedUser);
    
    return NextResponse.json(updatedUser);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }

    console.error("Error updating user:", error);
    return NextResponse.json(
      { error: "Failed to update user" },
      { status: 500 }
    );
  }
}
