import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import connectDB from "./db/connectDB";
import User from "@/app/model/userModel";
import { ERROR_MESSAGES } from "@/constants";
import { verifyPassword } from "@/helpers/authUtils";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!
    }),
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
          const signUpUser = await User.findOne({ email: credentials.email });
          if (!signUpUser) {
            throw new Error(ERROR_MESSAGES.USER_NOT_FOUND);
          }
          if (!signUpUser.isVerified) {
            throw new Error(ERROR_MESSAGES.ACCOUNT_NOT_VERIFIED);
          }
          const isPasswordCorrect = await verifyPassword(
            credentials.password,
            signUpUser.password
          );
          if (isPasswordCorrect) {
            return signUpUser;
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
    async signIn({user, account}){
      if (account?.provider === 'google') {
        try {
          await connectDB()
          const existingUser = await User.findOne({email: user.email})

           if (!existingUser) {
            // Create new user if doesn't exist
            const newUser = await User.create({
              email: user.email,
              name: user.name,
              isVerified: true, // Google accounts are already verified
              image: user.image,
            });
          }
          return true;
        } catch (error) {
          console.error("Error during Google sign in:", error);
          throw new Error(ERROR_MESSAGES.INVALID_CREDENTIALS);
        }
      }
      return true
    },    async jwt({token, user}){
        if(user){
            // Initial sign in
            token._id = user._id?.toString()
            token.email = user.email
            token.name = user.name
            token.role = user.role
            token.isVerified = user.isVerified
            token.picture = user.image
        }        // On subsequent requests, fetch fresh user data to check for updates
        try {
            await connectDB();
            const currentUser = await User.findOne({ email: token.email });
            if (currentUser) {
                // Update all user fields in token to stay in sync with database
                const fieldsToUpdate = {
                    name: currentUser.name,
                    email: currentUser.email,
                    role: currentUser.role,
                    isVerified: currentUser.isVerified,
                    picture: currentUser.image,
                };

                let hasChanges = false;
                for (const [key, value] of Object.entries(fieldsToUpdate)) {
                    const tokenKey = key === 'picture' ? 'picture' : key;
                    if (token[tokenKey] !== value) {
                        console.log(`User ${key} changed, updating token:`, value);
                        token[tokenKey] = value;
                        hasChanges = true;
                    }
                }

                if (hasChanges) {
                    console.log('Token updated with latest user data');
                }
            }
        } catch (error) {
            console.error('Error fetching updated user data:', error);
        }

        return token
    },
    async session({session, token}){
        if(token){
            session.user._id = token._id
            session.user.name = token.name
            session.user.email = token.email
            session.user.role = token.role
            session.user.isVerified = token.isVerified
            session.user.image = token.picture
        }
        return session
    }
  },
  pages: {
    signIn: "/login"
  },
  session: {
    strategy: 'jwt',
    maxAge: 60 * 60 * 24 * 30,
  },
  secret: process.env.NEXT_AUTH_SECRET
};
