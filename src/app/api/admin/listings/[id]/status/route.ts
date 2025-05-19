import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import connectDB from "@/lib/db/connectDB";
import Listing from "@/app/model/listingModel";

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
    }

    const { status } = await req.json();
    const allowedStatuses = ["ACTIVE", "DISABLE", "DELETE"];

    if (!allowedStatuses.includes(status)) {
      return NextResponse.json({ message: "Invalid status" }, { status: 400 });
    }

    const updated = await Listing.findByIdAndUpdate(
      params.id,
      { status },
      { new: true }
    );

    if (!updated) {
      return NextResponse.json(
        { message: "Listing not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: "Listing status updated",
      listing: updated,
    });
  } catch (error) {
    console.error("[ADMIN_LISTING_STATUS_PATCH_ERROR]", error);
    return NextResponse.json(
      { message: "Something went wrong while updating listing status." },
      { status: 500 }
    );
  }
}
