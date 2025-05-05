import User from "@/app/model/userModel";
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from "@/constants";
import connectDB from "@/lib/db/connectDB";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json();
    const { email, verifyCode, fullname } = reqBody;

    if (!email || !verifyCode || !fullname) {
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

    if (user.isVerified) {
      return NextResponse.json(
        {
          success: true,
          message: "Account already verified",
        },
        { status: 200 }
      );
    }

    if (user.verifyCode !== verifyCode) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid verification code",
        },
        { status: 400 }
      );
    }

    if (user.verifyCodeExpiry < new Date()) {
      return NextResponse.json(
        {
          success: false,
          message: ERROR_MESSAGES.TOKEN_EXPIRED,
        },
        { status: 400 }
      );
    }

    // Update user verification status
    user.fullname = fullname
    user.isVerified = true;
    user.verifyCode = "";
    await user.save();

    return NextResponse.json(
      {
        success: true,
        message: SUCCESS_MESSAGES.EMAIL_VERIFIED,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Verification error:", error);
    return NextResponse.json(
      {
        success: false,
        message: ERROR_MESSAGES.SERVER_ERROR,
      },
      { status: 500 }
    );
  }
}