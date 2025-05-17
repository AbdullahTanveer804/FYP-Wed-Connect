"use client";
import AuthProvider from "@/providers/AuthProviders";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import Navbar from "@/components/layouts/Navbar";
import Footer from "@/components/layouts/Footer";
import { usePathname } from "next/navigation";

const publicPaths = ["/login", "/signup", "/verify"];

const isPublicPath = (path: string) => {
  return publicPaths.some((publicPath) => path.startsWith(publicPath));
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const isPublic = isPublicPath(pathname);

  return (
    <html lang="en">
      <AuthProvider>
        <body>
          {!isPublic && <Navbar />}
          {children}
          <Toaster />
          {!isPublic && <Footer />}
        </body>
      </AuthProvider>
    </html>
  );
}
