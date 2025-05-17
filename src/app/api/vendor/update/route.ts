import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { z } from "zod";
import { authOptions } from "@/lib/authOptions";
import connectDB from "@/lib/db/connectDB";
import Vendor from "@/app/model/vendorModel";
import { vendorUpdateSchema } from "@/Schemas/vendor";

export async function PATCH(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const userId = session.user._id;

    const existingVendor = await Vendor.findOne({ vendorId: userId });
    if (!existingVendor) {
      return NextResponse.json(
        { error: "Vendor profile not found" },
        { status: 404 }
      );
    }

    const body = await req.json();
    const validatedData = vendorUpdateSchema.parse(body); // only includes provided fields

    const updatedVendor = await Vendor.findOneAndUpdate(
      { vendorId: userId },
      { $set: validatedData },
      { new: true, runValidators: true }
    );

    return NextResponse.json({
      message: "Vendor profile updated",
      vendor: updatedVendor,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    console.error("Error updating vendor:", error);
    return NextResponse.json(
      { error: "Failed to update vendor" },
      { status: 500 }
    );
  }
}
