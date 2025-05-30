import User from "@/app/model/userModel";
import { ERROR_MESSAGES } from "@/constants";
import { generateVerificationCode, generateExpiryTime } from "@/helpers/authUtils";
import { sendResetPasswordEmail } from "@/helpers/sendEmailHelpers/sendResetPasswordEmail";
import connectDB from "@/lib/db/connectDB";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        {
          success: false,
          message: ERROR_MESSAGES.INVALID_INPUT,
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

    // Generate reset code and expiry time (1 minute)
    const resetCode = generateVerificationCode();
    const resetCodeExpiry = generateExpiryTime(1);

    // Save reset code to user
    user.forgotPasswordCode = resetCode;
    user.forgotPasswordCodeExpiry = resetCodeExpiry;
    await user.save();
    console.log(resetCode)

    // Send reset email
    const emailResponse = await sendResetPasswordEmail(email, resetCode);
    if (!emailResponse.success) {
      return NextResponse.json(
        {
          success: false,
          message: ERROR_MESSAGES.EMAIL_VERIFICATION,
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Reset code sent successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Forgot password error:", error);
    return NextResponse.json(
      {
        success: false,
        message: ERROR_MESSAGES.SERVER_ERROR,
      },
      { status: 500 }
    );
  }
}