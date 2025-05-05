import AuthProvider from "@/providers/AuthProviders";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <AuthProvider>
        <body>{children}</body>
        <Toaster/>
      </AuthProvider>
    </html>
  );
}
