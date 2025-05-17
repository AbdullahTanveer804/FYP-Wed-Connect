import { resend } from "@/lib/resendEmail";
import { IApiResponse } from "@/types/ApiResponse";
import VendorVerificationEmail from "@/emails/VendorVerificationEmail";
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from "@/constants";

export async function sendVendorVerificationEmail(
  vendorName: string,
  vendorEmail: string,
  businessName: string,
  vendorId: string
): Promise<IApiResponse> {
  try {
    const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
    const verificationUrl = `${baseUrl}/api/vendor/verify/${vendorId}?action=verify`;
    const cancelUrl = `${baseUrl}/api/vendor/verify/${vendorId}?action=cancel`;

    await resend.emails.send({
      from: "WedConnect <onboarding@resend.dev>",
      to: process.env.ADMIN_EMAIL || "admin@wedconnect.com", // Make sure to set ADMIN_EMAIL in .env
      subject: "WedConnect | New Vendor Verification Request",
      react: VendorVerificationEmail({ 
        vendorName,
        vendorEmail,
        businessName,
        verificationUrl,
        cancelUrl
      }),
    });

    return {
      success: true,
      message: "Vendor verification email sent to admin"
    };
  } catch (error) {
    console.error("Error sending vendor verification email:", error);
    return {
      success: false,
      message: ERROR_MESSAGES.EMAIL_VERIFICATION
    };
  }
}
