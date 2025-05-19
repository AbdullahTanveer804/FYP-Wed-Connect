import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import connectDB from "@/lib/db/connectDB";
import { authOptions } from "@/lib/authOptions";
import Vendor from "@/app/model/vendorModel";


export async function PATCH(
  _: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
    }

    const vendor = await Vendor.findByIdAndUpdate(
      params.id,
      { isVerified: true },
      { new: true }
    );

    if (!vendor) {
      return NextResponse.json({ message: "Vendor not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Vendor verified", vendor });
  } catch (error) {
    console.error("Error verifying vendor:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
