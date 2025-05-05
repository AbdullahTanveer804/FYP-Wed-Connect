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
  Button,
} from "@react-email/components";

interface ResetPasswordEmailProps {
  email: string;
  resetCode: string;
}

export default function ResetPasswordEmail({
  resetCode,
  email,
}: ResetPasswordEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Reset your password</Preview>
      <Tailwind>
        <Body className="bg-gray-100 text-gray-800 font-sans">
          <Container className="bg-white max-w-xl mx-auto my-10 p-8 rounded-xl border shadow">
            <div className="text-center mb-6 flex justify-center items-center">
              <Img src="/wed-connect-logo.png" alt="Wed Connect" className="h-12" />
            </div>

            <Text className="text-xl font-semibold text-center mb-4">
              Reset Your Password
            </Text>

            <Hr className="my-4" />

            <Text className="text-sm mb-4">
              We received a request to reset the password for your account associated with{" "}
              <strong>{email}</strong>.
            </Text>

            <Text className="text-sm mb-4">
              Use this code to reset your password:
            </Text>

            <Text className="text-3xl font-bold tracking-widest text-center my-6">
              {resetCode}
            </Text>

            <Text className="text-sm mb-2">
              This code will expire in <strong>1 hour</strong>.
            </Text>

            <Text className="text-sm text-gray-600 mt-4">
              If you didn't request a password reset, you can safely ignore this email.
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}