'use client'
import type React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { 
  InputOTP,
  InputOTPGroup,
  InputOTPSlot
} from "@/components/ui/input-otp";
import { Loader2, Mail } from "lucide-react";
import { useSearchParams, useRouter, useParams } from "next/navigation";
import { useState } from "react";
import axios from "axios";
import { signIn } from "next-auth/react";
import { toast } from "@/hooks/use-toast";

// Add decrypt function to match the encrypt function in SignupForm
const decryptData = (text: string) => {
  return atob(text);
};

export function VerificationForm({ className, ...props }: React.ComponentProps<"div">) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [otp, setOtp] = useState("");
  
  const email = searchParams.get('email');
  const encryptedPassword = searchParams.get('p');
  const params = useParams<{fullname: string}>()
  const fullname = params.fullname
  
  const handleVerification = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !encryptedPassword || !fullname) {
      toast({
        title: "Error",
        description: "Missing credentials",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      // First verify the OTP
      const verifyResponse = await axios.post('/api/verify', {
        email,
        verifyCode: otp,
        fullname
      });

      if (verifyResponse.data.success) {
        // After successful verification, attempt to sign in
        const password = decryptData(encryptedPassword);
        const result = await signIn('credentials', {
          email,
          password,
          redirect: false
        });

        if (result?.error) {
          toast({
            title: "Login Failed",
            description: result.error,
            variant: "destructive",
          });
        } else {
          toast({
            title: "Success",
            description: "Email verified and logged in successfully",
          });
          router.replace('/');
        }
      }
    } catch (error: any) {
      toast({
        title: "Verification Failed",
        description: error.response?.data?.message || "Something went wrong",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResendCode = async () => {
    if (!email) return;
    
    try {
      await axios.post('/api/resend-verification', { email });
      toast({
        title: "Success",
        description: "Verification code has been resent",
      });
    } catch (error: any) {
      toast({
        title: "Failed to resend code",
        description: error.response?.data?.message || "Something went wrong",
        variant: "destructive",
      });
    }
  };
  
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden shadow-md">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form className="p-6 md:p-8" onSubmit={handleVerification}>
            <div className="flex flex-col gap-6">
              <div className="flex flex-col items-center text-center">
                <div className="flex justify-center items-center w-12 h-12 mb-4 rounded-full bg-rose/20">
                  <Mail className="h-6 w-6 text-rose" />
                </div>
                <h1 className="text-2xl font-bold text-rose-dark">Verify Your Email</h1>
                <p className="text-balance text-muted-foreground">
                  We've sent a 6-digit verification code to {email}
                </p>
              </div>
              
              <div className="flex flex-col items-center gap-4">
                <Label htmlFor="otp" className="sr-only">Verification Code</Label>
                <InputOTP 
                  maxLength={6} 
                  value={otp}
                  onChange={(value) => setOtp(value)}
                  className="justify-center gap-2"
                >
                  <InputOTPGroup>
                    <InputOTPSlot index={0} className="border-gray-dark focus:border-rose" />
                    <InputOTPSlot index={1} className="border-gray-dark focus:border-rose" />
                    <InputOTPSlot index={2} className="border-gray-dark focus:border-rose" />
                    <InputOTPSlot index={3} className="border-gray-dark focus:border-rose" />
                    <InputOTPSlot index={4} className="border-gray-dark focus:border-rose" />
                    <InputOTPSlot index={5} className="border-gray-dark focus:border-rose" />
                  </InputOTPGroup>
                </InputOTP>
              </div>
              
              <Button 
                type="submit" 
                className="w-full bg-rose hover:bg-rose-dark"
                disabled={isSubmitting || otp.length !== 6}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Verifying...
                  </>
                ) : (
                  "Verify Email"
                )}
              </Button>
              
              <div className="text-center text-sm">
                Didn't receive a code?{" "}
                <button 
                  type="button" 
                  onClick={handleResendCode}
                  className="text-rose hover:text-rose-dark underline underline-offset-4"
                >
                  Resend Code
                </button>
              </div>
              
              <div className="text-center text-sm">
                <a href="/" className="text-rose hover:text-rose-dark underline underline-offset-4">
                  Return to Sign Up
                </a>
              </div>
            </div>
          </form>
          
          <div className="relative hidden bg-gray md:block">
            <img
              src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158"
              alt="Woman using laptop"
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-rose-dark/20 backdrop-blur-sm"></div>
            <div className="absolute bottom-8 left-8 max-w-xs text-white">
              <h3 className="mb-2 text-xl font-bold">Verify your account</h3>
              <p className="text-sm opacity-90">Please check your email for the verification code to complete your registration.</p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <div className="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 hover:[&_a]:text-rose">
        By verifying your email, you confirm your account and agree to our <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>.
      </div>
    </div>
  );
}
