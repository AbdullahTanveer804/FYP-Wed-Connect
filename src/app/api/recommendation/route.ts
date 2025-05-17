// app/api/recommendations/route.ts
import Listing from "@/app/model/listingModel";
import { getListingRecommendations } from "@/helpers/getListingsRecommendations";
import connectDB from "@/lib/db/connectDB";
import { NextRequest, NextResponse } from "next/server";


export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const { prompt, budget, style, location, category } = await req.json();

    const listings = await Listing.find({ status: "ACTIVE" });

    const result = await getListingRecommendations({
      prompt,
      budget,
      style,
      location,
      category,
      listings,
    });

    return NextResponse.json(result);
  } catch (error: any) {
    console.error("Recommendation API Error:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
