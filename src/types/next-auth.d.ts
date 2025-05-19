import NextAuth from "next-auth";

declare module "next-auth" {  interface User {
    _id?: string;
    role: "CUSTOMER" | "VENDOR" | "ADMIN";
    email: string;
    isVerified: boolean;
    name?: string;
  }
}
declare module "next-auth" {
  interface Session {
    user: {
      _id?: string;
      role: "CUSTOMER" | "VENDOR" | "ADMIN";
      email: string;
      isVerified: boolean;
      name?: string;
    } & DefaultSession["user"];
  }
}
declare module "next-auth" {
  interface JWT {
    _id?: string;
    role: "CUSTOMER" | "VENDOR" | "ADMIN";
    email: string;
    isVerified: boolean;
    name?: string;
  }
}
