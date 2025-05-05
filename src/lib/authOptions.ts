import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import connectDB from "./db/connectDB";
import User from "@/app/model/userModel";
import { ERROR_MESSAGES } from "@/constants";
import bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials: any): Promise<any> {
        await connectDB();
        try {
          const user = await User.findOne({ email: credentials.email });
          if (!user) {
            throw new Error(ERROR_MESSAGES.USER_NOT_FOUND);
          }
          if (!user.isVerified) {
            throw new Error(ERROR_MESSAGES.ACCOUNT_NOT_VERIFIED);
          }
          const isPasswordCorrect = await bcrypt.compare(
            credentials.password,
            user.password
          );
          if (isPasswordCorrect) {
            return user;
          } else {
            throw new Error(ERROR_MESSAGES.PASSWORD_MISMATCH);
          }
        } catch (error) {
          throw new Error(ERROR_MESSAGES.INVALID_CREDENTIALS);
        }
      },
    }),
  ],
  callbacks: {
    async jwt({token, user}){
        if(user){
            token._id = user._id?.toString()
            token.isVerified = user.isVerified
            token.role = user.role
            token.isActive = user.isActive
            token.fullName = user.fullName
        }
        return token
    },
    async session({session, token}){
        if(token){
            session.user._id = token._id
            session.user.isVerified = token.isVerified
            session.user.role = token.role
            session.user.isActive = token.isActive
            session.user.fullName = token.fullName
        }
        return session
    }
  },
  pages: {
    signIn: '/login'
  },
  session: {
    strategy: 'jwt',
    maxAge: 60 * 60 * 24 * 30,
  },
  secret: process.env.NEXT_AUTH_SECRET
};
