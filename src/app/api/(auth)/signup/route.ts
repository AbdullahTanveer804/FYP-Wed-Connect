import User from "@/app/model/userModel";
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from "@/constants";
import { sendAccountVerificationEmail } from "@/helpers/sendVerificationEmail";
import connectDB from "@/lib/db/connectDB";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json();
    const { email, password, fullname } = reqBody;
    console.log("New Sign up data: ", reqBody);

    if (!reqBody) {
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
    const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();
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
        const hashedPassword = await bcrypt.hash(password, 10);
        existingVerifiedUserByEmail.password = hashedPassword;
        existingVerifiedUserByEmail.fullname = fullname;
        existingVerifiedUserByEmail.verifyCode = verifyCode;
        existingVerifiedUserByEmail.verifyCodeExpiry = new Date(
          Date.now() + 3600000
        );

        await existingVerifiedUserByEmail.save();
      }
    } else {
      const hashedPassword = await bcrypt.hash(password, 10);
      const expiryDate = new Date();
      expiryDate.setHours(expiryDate.getHours() + 1);

      const newUser = new User({
        fullname,
        email,
        password: hashedPassword,
        isVerified: false,
        verifyCode,
        verifyCodeExpiry: expiryDate,
      });
      await newUser.save();
      console.log("Newly saved user: ", newUser);
    }

    const emailResponse = await sendAccountVerificationEmail(email, verifyCode);
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
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: ERROR_MESSAGES.ACTION_FAILED,
      },
      { status: 500 }
    );
  }
}
