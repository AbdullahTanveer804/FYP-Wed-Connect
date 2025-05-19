// /app/api/vendor/apply/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { z } from "zod";
import mongoose from "mongoose";
import { authOptions } from "@/lib/authOptions";
import connectDB from "@/lib/db/connectDB";
import User from "@/app/model/userModel";
import Vendor from "@/app/model/vendorModel";
import { sendVendorVerificationEmail } from "@/helpers/sendEmailHelpers/sendVendorVerificationEmail";
import { vendorProfileSchema } from "@/Schemas/vendor";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const userId = session.user._id;

    // Check if user is already a vendor
    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (user.role === "VENDOR") {
      return NextResponse.json({ error: "Already a vendor" }, { status: 400 });
    }

    const body = await req.json();
    const validatedData = vendorProfileSchema.parse(body);

    // Check if vendor profile already exists
    const existingVendor = await Vendor.findOne({ vendorId: userId });
    if (existingVendor) {
      return NextResponse.json(
        { error: "Vendor profile already exists" },
        { status: 400 }
      );
    }

    const newVendor = (await Vendor.create({
      vendorId: userId,
      ...validatedData,
      memberSince: new Date(),
      rating: { average: 0, totalReviews: 0 },
      isVerified: false,
      featured: false,
    })) as mongoose.Document & { _id: mongoose.Types.ObjectId };

    // Update user role to VENDOR
    user.role = "VENDOR";
    await user.save();
    console.log("Newly saved Vendor: ", newVendor);

    // Send verification email to admin
    await sendVendorVerificationEmail(
      user.name,
      user.email,
      validatedData.businessName,
      newVendor._id.toString()
    );
    console.log("Email for vendor verification is successfully sent to admin");

    return NextResponse.json(
      {
        success: true,
        message: "Vendor profile created and pending verification",
      },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }

    console.error("Error creating vendor profile:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to create vendor profile",
      },
      { status: 500 }
    );
  }
}
