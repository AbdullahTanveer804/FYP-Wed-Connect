import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import connectDB from "@/lib/db/connectDB";
import { authOptions } from "@/lib/authOptions";
import Vendor from "@/app/model/vendorModel";
import User from "@/app/model/userModel";

export async function DELETE(
  _: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
    }

    // Soft delete both vendor and corresponding user
    const vendor = await Vendor.findByIdAndUpdate(params.id, {
      status: "DELETE",
    });
    if (!vendor) {
      return NextResponse.json({ message: "Vendor not found" }, { status: 404 });
    }

    await User.findByIdAndUpdate(vendor.vendorId, { status: "DELETE" });

    return NextResponse.json({ message: "Vendor and user marked as deleted" });
  } catch (error) {
    console.error("Error deleting vendor:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
