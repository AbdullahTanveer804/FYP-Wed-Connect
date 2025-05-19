import Listing from "@/app/model/listingModel";
import connectDB from "@/lib/db/connectDB";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const url = new URL(req.url);
    const category = url.searchParams.get("category");
    const city = url.searchParams.get("city");
    const minPrice = url.searchParams.get("minPrice");
    const maxPrice = url.searchParams.get("maxPrice");
    const search = url.searchParams.get("q");
    const page = parseInt(url.searchParams.get("page") || "1");
    const limit = parseInt(url.searchParams.get("limit") || "10");

    const query: any = { status: "ACTIVE" };

    if (category) query.categoryId = category;
    if (city) query["location.city"] = { $regex: city, $options: "i" };
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    if (minPrice || maxPrice) {
      query["pricing.minPrice"] = {};
      if (minPrice) query["pricing.minPrice"].$gte = parseInt(minPrice);
      if (maxPrice) query["pricing.minPrice"].$lte = parseInt(maxPrice);
    }    const skip = (page - 1) * limit;
    const listings = await Listing.find(query)
      .sort({ featured: -1, createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Listing.countDocuments(query);

    if (total === 0) {
      console.log(`No listings found${category ? ` for category: ${category}` : ''}${city ? ` in city: ${city}` : ''}`);
    }

    return NextResponse.json({
      listings,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      total,
    });
  } catch (error) {
    console.error("Error fetching listings:", error);
    return NextResponse.json(
      { error: "Failed to fetch listings" },
      { status: 500 }
    );
  }
}
