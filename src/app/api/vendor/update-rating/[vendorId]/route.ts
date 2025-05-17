import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import connectDB from "@/lib/db/connectDB";
import Listing from "@/app/model/listingModel";
import Vendor from "@/app/model/vendorModel";

export async function PATCH(
  req: NextRequest,
  { params }: { params: { vendorId: string } }
) {
  try {
    await connectDB();

    const vendorId = params.vendorId;

    if (!mongoose.Types.ObjectId.isValid(vendorId)) {
      return NextResponse.json({ error: "Invalid vendor ID" }, { status: 400 });
    }

    // Get all listings by the vendor
    const listings = await Listing.find({ listingsVendorId: vendorId });

    let totalRatings = 0;
    let totalReviews = 0;

    for (const listing of listings) {
      for (const review of listing.reviews) {
        totalRatings += review.rating;
        totalReviews += 1;
      }
    }

    const averageRating = totalReviews > 0 ? totalRatings / totalReviews : 0;

    const updatedVendor = await Vendor.findOneAndUpdate(
      { vendorId: vendorId },
      {
        $set: {
          "rating.average": averageRating,
          "rating.totalReviews": totalReviews,
        },
      },
      { new: true }
    );

    if (!updatedVendor) {
      return NextResponse.json({ error: "Vendor not found" }, { status: 404 });
    }

    return NextResponse.json({
      message: "Vendor rating updated successfully",
      rating: updatedVendor.rating,
    });
  } catch (error) {
    console.error("Error updating vendor rating:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
