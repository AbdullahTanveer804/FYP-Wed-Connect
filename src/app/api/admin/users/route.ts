import User from "@/app/model/userModel";
import connectDB from "@/lib/db/connectDB";
import { NextResponse } from "next/server";

import { z } from "zod";

const querySchema = z.object({
  role: z.enum(["CUSTOMER", "VENDOR", "ADMIN"]).optional(),
  status: z.enum(["ACTIVE", "DISABLE", "DELETE"]).optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
});

export async function GET(req: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const query = Object.fromEntries(searchParams.entries());

    const parsed = querySchema.safeParse(query);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.format() },
        { status: 400 }
      );
    }

    const { role, status, startDate, endDate } = parsed.data;

    const filters: any = {};
    if (role) filters.role = role;
    if (status) filters.status = status;
    if (startDate || endDate) {
      filters.createdAt = {};
      if (startDate) filters.createdAt.$gte = new Date(startDate);
      if (endDate) filters.createdAt.$lte = new Date(endDate);
    }

    const users = await User.find(filters).sort({ createdAt: -1 });

    return NextResponse.json(users);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch users" },
      { status: 500 }
    );
  }
}
