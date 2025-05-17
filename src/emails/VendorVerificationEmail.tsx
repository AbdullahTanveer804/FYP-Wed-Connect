import {
  Html,
  Head,
  Preview,
  Tailwind,
  Body,
  Container,
  Text,
  Img,
  Hr,
  Link,
} from "@react-email/components";

interface VendorVerificationEmailProps {
  vendorName: string;
  vendorEmail: string;
  businessName: string;
  verificationUrl: string;
  cancelUrl: string;
}

export default function VendorVerificationEmail({
  vendorName,
  vendorEmail,
  businessName,
  verificationUrl,
  cancelUrl,
}: VendorVerificationEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>New Vendor Verification Request</Preview>
      <Tailwind>
        <Body className="bg-gray-100 text-gray-800 font-sans">
          <Container className="bg-white max-w-xl mx-auto my-10 p-8 rounded-xl border shadow">
            {/* Logo */}
            <div className="text-center mb-6 flex justify-center items-center">
              <Img
                src="/wed-connect-logo.png"
                alt="WedConnect"
                className="h-12"
              />
            </div>

            {/* Title */}
            <Text className="text-xl font-semibold text-center mb-4">
              New Vendor Verification Request
            </Text>

            <Hr className="my-4" />

            {/* Message */}
            <Text className="text-sm mb-4">
              A new vendor has registered on WedConnect and requires verification:
            </Text>

            <div className="bg-gray-50 p-4 rounded-lg mb-4">
              <Text className="text-sm mb-2">
                <strong>Vendor Name:</strong> {vendorName}
              </Text>
              <Text className="text-sm mb-2">
                <strong>Email:</strong> {vendorEmail}
              </Text>
              <Text className="text-sm mb-2">
                <strong>Business Name:</strong> {businessName}
              </Text>
            </div>

            <Text className="text-sm mb-4">
              Please review the vendor's information and verify or cancel their registration.
            </Text>

            <div className="text-center space-y-4 my-8">
              <Link
                href={verificationUrl}
                className="bg-green-500 text-white px-6 py-3 rounded-md font-medium inline-block no-underline hover:bg-green-600"
              >
                Verify Vendor
              </Link>
              
              <Link
                href={cancelUrl}
                className="bg-red-500 text-white px-6 py-3 rounded-md font-medium inline-block no-underline hover:bg-red-600 ml-4"
              >
                Cancel Registration
              </Link>
            </div>

            <Text className="text-sm text-gray-500 mt-8">
              If you did not expect this request, please ignore this email.
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}
