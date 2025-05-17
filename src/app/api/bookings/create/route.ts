import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { z } from "zod";
import { authOptions } from "@/lib/authOptions";
import connectDB from "@/lib/db/connectDB";
import Listing from "@/app/model/listingModel";
import Booking from "@/app/model/bookingModel";
import { bookingSchema } from "@/Schemas/booking";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const body = await req.json();
    const validatedData = bookingSchema.parse(body);

    // Get listing & vendor info
    const listing = await Listing.findById(validatedData.listingId).populate(
      "listingsVendorId"
    );

    if (!listing) {
      return NextResponse.json({ error: "Listing not found" }, { status: 404 });
    }

    const vendor = listing.listingsVendorId as any; // populated vendor document
    if (!vendor || !vendor.name || !vendor.contactInfo.email) {
      return NextResponse.json(
        { error: "Vendor information is incomplete" },
        { status: 400 }
      );
    }

    const booking = await Booking.create({
      vendorId: vendor._id,
      vendorName: vendor.name,
      vendorEmail: vendor.email,

      customerId: session.user._id,
      customerName: session.user.name,
      customerEmail: session.user.email,

      listingId: listing._id,
      serviceTitle: listing.title,

      date: new Date(validatedData.date),
      message: validatedData.message || "",
      amount: validatedData.amount,

      status: "PENDING",
      paymentStatus: "PENDING",
    });

    return NextResponse.json(
      { message: "Booking created successfully", booking },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }

    console.error("Booking creation failed:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
