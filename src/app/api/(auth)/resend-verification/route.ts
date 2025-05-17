import { ERROR_MESSAGES } from "@/constants";
import { sendAccountVerificationEmail } from "@/helpers/sendEmailHelpers/sendVerificationEmail";
import connectDB from "@/lib/db/connectDB";
import User from "@/app/model/userModel";
import { IApiResponse } from "@/types/ApiResponse";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest): Promise<NextResponse<IApiResponse>> {
  try {
    await connectDB();
    const { email } = await req.json();

    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json(
        { success: false, message: ERROR_MESSAGES.USER_NOT_FOUND },
        { status: 404 }
      );
    }

    if (user.isVerified) {
      return NextResponse.json(
        { success: false, message: ERROR_MESSAGES.ACCOUNT_ALREADY_VERIFIED },
        { status: 400 }
      );
    }    // Generate new verification code
    const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();
    const EXPIRY_MINUTES = 60;
    const verifyCodeExpiry = new Date(Date.now() + EXPIRY_MINUTES * 60 * 1000);

    // Update user with new verification code
    await User.findByIdAndUpdate(user._id, {
      verifyCode,
      verifyCodeExpiry,
    });
    console.log(verifyCode);
    

    // Send new verification email with expiry time
    const response = await sendAccountVerificationEmail(email, verifyCode, EXPIRY_MINUTES);
    return NextResponse.json(response);
  } catch (error) {
    console.error("Resend verification error:", error);
    return NextResponse.json(
      { success: false, message: "Resend verification error" },
      { status: 500 }
    );
  }
}
