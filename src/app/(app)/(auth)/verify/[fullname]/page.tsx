import { VerificationForm } from "@/components/VerificationForm";

const VerifyEmail = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-light p-4">
      <div className="w-full max-w-4xl">
        <VerificationForm />
      </div>
    </div>
  );
};

export default VerifyEmail;
