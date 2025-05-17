import { resend } from "@/lib/resendEmail";
import { IApiResponse } from "@/types/ApiResponse";
import verifyAccountEmail from "../../emails/VerifyAccountEmail";
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from "@/constants";

export async function sendAccountVerificationEmail(
  email: string,
  verifyCode: string,
  expiryMinutes: number = 1 // Default expiry time is 1 minute
): Promise<IApiResponse> {
  try {
    // Send the email with expiry information
    await resend.emails.send({
      from: "onboarding@resend.dev",
      to: email,
      subject: "WedConnect | Email Verification Code",
      react: verifyAccountEmail({ 
        verifyCode, 
        email, 
        expiryMinutes 
      }),
    });
    
    return {
      success: true,
      message: SUCCESS_MESSAGES.EMAIL_VERIFICATION_SEND,
      data: {
        expiryTime: new Date(Date.now() + expiryMinutes * 60 * 1000)
      }
    };
  } catch (error) {
    return {
      success: false,
      message: ERROR_MESSAGES.EMAIL_VERIFICATION
    };
  }
}
