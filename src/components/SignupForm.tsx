"use client";
import type React from "react";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeClosed, Facebook, Loader2 } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { signUpSchema } from "@/Schemas/signUpSchema";
import * as z from "zod";
import axios, { AxiosError } from "axios";
import { IApiResponse } from "@/types/ApiResponse";
import { toast } from "@/hooks/use-toast";

// Add this helper function at the top of the file, outside the component
const encryptData = (text: string) => {
  // Simple base64 encoding - In a real app, use proper encryption
  return btoa(text);
};

export function SignupForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit, 
    formState: { errors },
  } = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      fullname: "",
      email: "",
      password: "",
    },
  });

  //On Submitting form
  const onSubmit = async (data: z.infer<typeof signUpSchema>) => {
    setIsSubmitting(true);
    try {
      const response = await axios.post<IApiResponse>("/api/signup", data);
      toast({
        title: "Success",
        description: response.data.message,
        variant: "default",
      });

      // Encrypt password before adding to URL
      const encryptedPassword = encryptData(data.password);

      setTimeout(() => {
        const fullname = data.fullname
        router.replace(
          `/verify/${fullname}?` +
          new URLSearchParams({
            email: data.email,
            p: encryptedPassword // 'p' instead of 'password' to be less obvious
          }).toString()
        );
      }, 500);
    } catch (error) {
      console.log("Error signing up user", error);
      const axiosError = error as AxiosError<IApiResponse>;
      toast({
        title: "Signup Failed",
        description: axiosError.response?.data.message,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden shadow-md">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form className="p-6 md:p-8" onSubmit={handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-6">
              <div className="flex flex-col items-center text-center">
                <h1 className="text-4xl mb-2 font-bold text-rose">
                  Create an Account
                </h1>
                <p className="text-balance text-muted-foreground">
                  Join Wed Connect and get started today
                </p>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  {...register("fullname")}
                  id="name"
                  type="text"
                  placeholder="John Doe"
                  required
                  className="focus-visible:ring-rose"
                />
                {errors.fullname && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.fullname.message}
                  </p>
                )}
              </div>

              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  {...register("email")}
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                  className="focus-visible:ring-rose"
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.email.message}
                  </p>
                )}
              </div>

              <div className="grid gap-2 relative">
                <Label htmlFor="password">Password</Label>
                <Input
                  {...register("password")}
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  required
                  className="focus-visible:ring-rose"
                />
                <button
                  type="button"
                  className="absolute right-3 top-8 text-gray-500"
                  onClick={() => {
                    setShowPassword(!showPassword);
                  }}
                >
                  {showPassword ? <Eye size={20} /> : <EyeClosed size={20} />}
                </button>
                {errors.password && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.password.message}
                  </p>
                )}
              </div>

              <Button
                type="submit"
                className="w-full bg-rose hover:bg-rose-dark"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  "Sign up"
                )}
              </Button>

              <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
                <span className="relative z-10 bg-background px-2 text-muted-foreground">
                  Or continue with
                </span>
              </div>

              <div className="flex justify-center">
                <Button //change icon
                  variant="outline"
                  className="w-full max-w-xs border-gray-dark hover:bg-gray-light flex items-center gap-2"
                >
                  <Facebook size={18} />
                  <span>Google</span>
                </Button>
              </div>

              <div className="text-center text-sm">
                Already have an account?{" "}
                <a
                  href="#"
                  className="text-rose hover:text-rose-dark underline underline-offset-4"
                >
                  Log in
                </a>
              </div>
            </div>
          </form>

          <div className="relative hidden bg-gray md:block">
            <img
              src="https://images.unsplash.com/flagged/photo-1580333657159-f5ec56bc079e?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              alt="Woman using laptop"
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-rose-dark/20 backdrop-blur-sm"></div>
            <div className="absolute top-11 left-8 max-w-xs ">
              <img
                src="/noBgLogo.png" //edit logo
                alt="Wed Connect Logo"
                className="h-6"
              />
            </div>
            <div className="absolute bottom-8 left-8 max-w-xs text-white">
              <h3 className="mb-2 text-xl font-bold">
                Start your journey with us
              </h3>
              <p className="text-sm opacity-90">
                Create an account today and discover all the amazing features we
                offer.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 hover:[&_a]:text-rose">
        By signing up, you agree to our <a href="#">Terms of Service</a> and{" "}
        <a href="#">Privacy Policy</a>.
      </div>
    </div>
  );
}
