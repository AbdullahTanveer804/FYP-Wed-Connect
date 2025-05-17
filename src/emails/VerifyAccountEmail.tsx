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
  } from "@react-email/components";
  
  interface VerifyEmailProps {
    email: string;
    verifyCode: string;
    expiryMinutes: number;
  }
  
  export default function verifyAccountEmail({
     verifyCode, email, expiryMinutes
  }: VerifyEmailProps) {
    return (
      <Html>
        <Head />
        <Preview>Verify your email</Preview>
        <Tailwind>
          <Body className="bg-gray-100 text-gray-800 font-sans">
            <Container className="bg-white max-w-xl mx-auto my-10 p-8 rounded-xl border shadow">
              {/* Logo */}
              <div className="text-center mb-6 flex justify-center items-center">
                <Img
                  src="/wed-connect-logo.png"
                  alt="GhostNote"
                  className=" h-12 "
                />
              </div>
  
              {/* Title */}
              <Text className="text-xl font-semibold text-center mb-4">
                Verify your email
              </Text>
  
              <Hr className="my-4" />
  
              {/* Message */}              <Text className="text-sm mb-4">
                Thanks for signing up with WedConnect! We need to verify that <strong>{email}</strong>{" "}
                is your email address.
              </Text>

              <Text className="text-sm mb-4">
                Please use the verification code below to complete your registration. For security reasons, this code will expire in {expiryMinutes} minutes:
              </Text>
  
              {/* Code */}
              <Text className="text-3xl font-bold tracking-widest text-center my-6">
                {verifyCode}
              </Text>              <Text className="text-sm mb-2">
                This code will expire in <strong>{expiryMinutes} minute{expiryMinutes > 1 ? 's' : ''}</strong>.
              </Text>
  
              <Text className="text-sm text-gray-600">
                If you don’t recognize <strong>{email}</strong>, you can safely ignore this email.
              </Text>
            </Container>
          </Body>
        </Tailwind>
      </Html>
    );
  }
  