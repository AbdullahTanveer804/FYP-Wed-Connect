import { resend } from "@/lib/resendEmail";
import { IApiResponse } from "@/types/ApiResponse";
import verifyAccountEmail from "../../emails/VerifyAccountEmail";
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from "@/constants";

export async function sendAccountVerificationEmail(
  email: string,
  verifyCode: string
): Promise<IApiResponse> {
  try {
    await resend.emails.send({
      from: "onboarding@resend.dev",
      to: email,
      subject: "WedConnect | Email Verification Code",
      react: verifyAccountEmail({ verifyCode, email }),
    });
    return {
        success: true,
        message: SUCCESS_MESSAGES.EMAIL_VERIFICATION_SEND
    }
  } catch (error) {
    return {
        success: true,
        message: ERROR_MESSAGES.EMAIL_VERIFICATION
    }
  }
}
