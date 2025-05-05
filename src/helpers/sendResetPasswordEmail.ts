import { resend } from "@/lib/resendEmail";
import { IApiResponse } from "@/types/ApiResponse";
import ResetPasswordEmail from "../../emails/ResetPasswordEmail";
import { ERROR_MESSAGES } from "@/constants";

export async function sendResetPasswordEmail(
  email: string,
  resetCode: string
): Promise<IApiResponse> {
  try {
    await resend.emails.send({
      from: "onboarding@resend.dev",
      to: email,
      subject: "WedConnect | Password Reset Code",
      react: ResetPasswordEmail({ resetCode, email }),
    });
    return {
      success: true,
      message: "Password reset code sent successfully"
    }
  } catch (error) {
    return {
      success: false,
      message: ERROR_MESSAGES.SERVER_ERROR
    }
  }
}