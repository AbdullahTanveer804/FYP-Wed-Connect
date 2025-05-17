import User from "@/app/model/userModel";
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from "@/constants";
import { sendAccountVerificationEmail } from "@/helpers/sendEmailHelpers/sendVerificationEmail";
import {
  generateVerificationCode,
  hashPassword,
  generateExpiryTime,
} from "@/helpers/authUtils";
import connectDB from "@/lib/db/connectDB";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json();
    const { email, password, name } = reqBody;
    console.log("New Sign up data: ", { email, name }); // Don't log password for security

    if (!email || !password || !name) {
      return NextResponse.json(
        {
          success: false,
          message: ERROR_MESSAGES.INVALID_INPUT,
        },
        { status: 400 }
      );
    }

    await connectDB();
    const existingVerifiedUserByEmail = await User.findOne({ email });
    const verifyCode = generateVerificationCode();
    const EXPIRY_MINUTES = 1; // 1 minute expiry time
    const expiryTime = generateExpiryTime(EXPIRY_MINUTES);

    if (existingVerifiedUserByEmail) {
      if (existingVerifiedUserByEmail.isVerified) {
        return NextResponse.json(
          {
            success: false,
            message: ERROR_MESSAGES.USER_ALREADY_EXISTS,
          },
          { status: 400 }
        );
      } else {
        const hashedPassword = await hashPassword(password);
        // Update all required fields
        existingVerifiedUserByEmail.password = hashedPassword;
        existingVerifiedUserByEmail.name = name;
        existingVerifiedUserByEmail.verifyCode = verifyCode;
        existingVerifiedUserByEmail.verifyCodeExpiry = expiryTime;

        await existingVerifiedUserByEmail.save();
      }
    } else {
      const hashedPassword = await hashPassword(password);
      const userData = {
        name,
        email,
        password: hashedPassword,
        isVerified: false,
        verifyCode,
        verifyCodeExpiry: expiryTime,
      };
      console.log("Creating new user with data:", {
        ...userData,
        password: "[REDACTED]",
      });
      const newUser = new User(userData);
      const savedUser = await newUser.save();
      console.log("Newly saved user ID: ", savedUser._id);
    }
    const emailResponse = await sendAccountVerificationEmail(
      email,
      verifyCode,
      EXPIRY_MINUTES
    );
    if (!emailResponse.success) {
      return NextResponse.json(
        {
          success: false,
          message: emailResponse.message,
        },
        { status: 500 }
      );
    }
    console.log(SUCCESS_MESSAGES.EMAIL_VERIFICATION_SEND);
    return NextResponse.json(
      {
        success: true,
        message: SUCCESS_MESSAGES.USER_REGISTERED,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Signup error details:", {
      message: error?.message,
    });
    return NextResponse.json(
      {
        success: false,
        message: ERROR_MESSAGES.ACTION_FAILED,
      },
      { status: 500 }
    );
  }
}
