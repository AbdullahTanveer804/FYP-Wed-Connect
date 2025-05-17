import User from "@/app/model/userModel";
import { ERROR_MESSAGES } from "@/constants";
import { hashPassword, isCodeExpired, checkVerifyCode } from "@/helpers/authUtils";
import connectDB from "@/lib/db/connectDB";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { email, resetCode, newPassword } = await request.json();

    if (!email || !resetCode || !newPassword) {
      return NextResponse.json(
        {
          success: false,
          message: ERROR_MESSAGES.MISSING_FIELDS,
        },
        { status: 400 }
      );
    }

    await connectDB();

    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: ERROR_MESSAGES.USER_NOT_FOUND,
        },
        { status: 404 }
      );
    }

    // Verify reset code
    if (!checkVerifyCode(resetCode, user.forgotPasswordCode as string)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid reset code",
        },
        { status: 400 }
      );
    }

    // Check if code is expired
    if (isCodeExpired(user.forgotPasswordCodeExpiry as Date)) {
      return NextResponse.json(
        {
          success: false,
          message: ERROR_MESSAGES.TOKEN_EXPIRED,
        },
        { status: 400 }
      );
    }

    // Update password
    const hashedPassword = await hashPassword(newPassword);
    user.password = hashedPassword;
    user.forgotPasswordCode = "";
    await user.save();

    return NextResponse.json(
      {
        success: true,
        message: "Password reset successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Reset password error:", error);
    return NextResponse.json(
      {
        success: false,
        message: ERROR_MESSAGES.SERVER_ERROR,
      },
      { status: 500 }
    );
  }
}