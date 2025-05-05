import NextAuth from "next-auth";

declare module "next-auth" {
  interface User {
    _id?: string;
    role: string;
    isVerified: boolean;
    isActive: boolean;
    fullName?: string;
  }
}
declare module "next-auth" {
  interface Session {
    user: {
      _id?: string;
      role: string;
      isVerified: boolean;
      isActive: boolean;
      fullName?: string;
    } & DefaultSession["user"];
  }
}
declare module "next-auth" {
  interface JWT {
    _id?: string;
    role: string;
    isVerified: boolean;
    isActive: boolean;
    fullName?: string;
  }
}
