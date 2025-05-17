import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { z } from "zod";
import { listingSchema } from "@/Schemas/listing";
import { authOptions } from "@/lib/authOptions";
import connectDB from "@/lib/db/connectDB";
import Vendor from "@/app/model/vendorModel";
import Listing from "@/app/model/listingModel";

const listingUpdateSchema = listingSchema.partial();

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const userId = session.user._id;

    const vendor = await Vendor.findOne({ vendorId: userId });
    if (!vendor) {
      return NextResponse.json({ error: "Vendor not found" }, { status: 404 });
    }

    const body = await req.json();
    const data = listingUpdateSchema.parse(body);

    const updatedListing = await Listing.findOneAndUpdate(
      { _id: params.id, listingsVendorId: vendor._id },
      { $set: data },
      { new: true }
    );

    if (!updatedListing) {
      return NextResponse.json({ error: "Listing not found or unauthorized" }, { status: 404 });
    }

    return NextResponse.json({ listing: updatedListing });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    console.error("Error updating listing:", error);
    return NextResponse.json({ error: "Failed to update listing" }, { status: 500 });
  }
}