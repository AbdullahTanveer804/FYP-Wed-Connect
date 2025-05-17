import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { z } from "zod";
import connectDB from "@/lib/db/connectDB";
import Listing from "@/app/model/listingModel";
import { authOptions } from "@/lib/authOptions";
import { listingSchema } from "@/Schemas/listing";
import Vendor from "@/app/model/vendorModel";

// POST /api/listings — Create a new listing
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user || !session.user._id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    // Find the vendor by the session user's ID
    const vendor = await Vendor.findOne({ vendorId: session.user._id });
    if (!vendor) {
      return NextResponse.json({ error: "Vendor profile not found" }, { status: 404 });
    }

    // Validate the request body
    const body = await req.json();
    const validatedData = listingSchema.parse(body);

    // Create the listing
    const newListing = await Listing.create({
      ...validatedData,
      listingsVendorId: vendor._id,
    });

    return NextResponse.json({
      message: "Listing created successfully",
      listing: newListing,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }

    console.error("Error creating listing:", error);
    return NextResponse.json({ error: "Failed to create listing" }, { status: 500 });
  }
}

