'use client'
import type React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Facebook, Loader2, Eye, EyeClosed } from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "@/hooks/use-toast";
import axios from "axios";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";

export function LoginForm({ className, ...props }: React.ComponentProps<"div">) {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showResetModal, setShowResetModal] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [resetCode, setResetCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [resetStep, setResetStep] = useState<"email" | "code" | "password">("email");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        toast({
          title: "Error",
          description: result.error,
          variant: "destructive",
        });
      } else {
        router.replace("/dashboard");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await axios.post("/api/forgot-password", {
        email: resetEmail,
      });

      if (response.data.success) {
        toast({
          title: "Success",
          description: "Reset code sent to your email",
        });
        setResetStep("code");
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Something went wrong",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await axios.post("/api/reset-password", {
        email: resetEmail,
        resetCode,
        newPassword,
      });

      if (response.data.success) {
        toast({
          title: "Success",
          description: "Password reset successfully",
        });
        setShowResetModal(false);
        setResetStep("email");
        setResetEmail("");
        setResetCode("");
        setNewPassword("");
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Something went wrong",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden shadow-md">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form className="p-6 md:p-8" onSubmit={handleLogin}>
            <div className="flex flex-col gap-6">
              <div className="flex flex-col items-center text-center">
                <h1 className="text-2xl font-bold text-rose-dark">Welcome Back</h1>
                <p className="text-balance text-muted-foreground">
                  Login to your Wed Connect account
                </p>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="m@example.com"
                  required
                  className="focus-visible:ring-rose"
                />
              </div>

              <div className="grid gap-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  <button
                    type="button"
                    onClick={() => setShowResetModal(true)}
                    className="text-xs text-rose hover:text-rose-dark underline underline-offset-4"
                  >
                    Forgot password?
                  </button>
                </div>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="focus-visible:ring-rose pr-10"
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-2.5 text-gray-500"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <Eye size={20} /> : <EyeClosed size={20} />}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full bg-rose hover:bg-rose-dark"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  "Sign in"
                )}
              </Button>

              <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
                <span className="relative z-10 bg-background px-2 text-muted-foreground">
                  Or continue with
                </span>
              </div>

              <div className="flex justify-center">
                <Button
                  variant="outline"
                  className="w-full max-w-xs border-gray-dark hover:bg-gray-light flex items-center gap-2"
                >
                  <Facebook size={18} />
                  <span>Login with Google</span>
                </Button>
              </div>

              <div className="text-center text-sm">
                Don't have an account?{" "}
                <Link
                  href="/"
                  className="text-rose hover:text-rose-dark underline underline-offset-4"
                >
                  Sign up
                </Link>
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
              <h3 className="mb-2 text-xl font-bold">Welcome back</h3>
              <p className="text-sm opacity-90">
                Login to continue your journey and access all your saved content.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Reset Password Modal */}
      {showResetModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-background p-6 rounded-lg shadow-lg max-w-md w-full mx-4">
            <h2 className="text-xl font-bold mb-4">Reset Password</h2>
            {resetStep === "email" && (
              <form onSubmit={handleForgotPassword}>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="reset-email">Email</Label>
                    <Input
                      id="reset-email"
                      type="email"
                      value={resetEmail}
                      onChange={(e) => setResetEmail(e.target.value)}
                      placeholder="Enter your email"
                      required
                    />
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setShowResetModal(false);
                        setResetStep("email");
                      }}
                    >
                      Cancel
                    </Button>
                    <Button type="submit" className="bg-rose hover:bg-rose-dark">
                      {isLoading ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        "Send Reset Code"
                      )}
                    </Button>
                  </div>
                </div>
              </form>
            )}

            {resetStep === "code" && (
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Enter the 6-digit code sent to your email
                </p>
                <InputOTP
                  maxLength={6}
                  value={resetCode}
                  onChange={(value) => setResetCode(value)}
                  className="justify-center gap-2"
                >
                  <InputOTPGroup>
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                    <InputOTPSlot index={2} />
                    <InputOTPSlot index={3} />
                    <InputOTPSlot index={4} />
                    <InputOTPSlot index={5} />
                  </InputOTPGroup>
                </InputOTP>
                <div className="flex justify-end gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setResetStep("email")}
                  >
                    Back
                  </Button>
                  <Button
                    onClick={() => setResetStep("password")}
                    disabled={resetCode.length !== 6}
                    className="bg-rose hover:bg-rose-dark"
                  >
                    Verify Code
                  </Button>
                </div>
              </div>
            )}

            {resetStep === "password" && (
              <form onSubmit={handleResetPassword}>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="new-password">New Password</Label>
                    <div className="relative">
                      <Input
                        id="new-password"
                        type={showPassword ? "text" : "password"}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="Enter new password"
                        required
                        className="pr-10"
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-2.5 text-gray-500"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <Eye size={20} /> : <EyeClosed size={20} />}
                      </button>
                    </div>
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setResetStep("code")}
                    >
                      Back
                    </Button>
                    <Button type="submit" className="bg-rose hover:bg-rose-dark">
                      {isLoading ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        "Reset Password"
                      )}
                    </Button>
                  </div>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      <div className="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 hover:[&_a]:text-rose">
        By logging in, you agree to our <a href="#">Terms of Service</a> and{" "}
        <a href="#">Privacy Policy</a>.
      </div>
    </div>
  );
}
