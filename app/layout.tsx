import type { Metadata } from "next";
import { Toaster } from "sonner";
import { Plus_Jakarta_Sans } from "next/font/google";
import { AuthProvider } from "@/context/AuthContext";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-jakarta',
  display: 'swap',
});

export const metadata: Metadata = {
  title: "Fahim-er Banglish Translator - Convert Any Language to Casual Banglish",
  description: "Convert any language into casual Banglish instantly. Perfect for social media, chats, and messaging. Easy, friendly, and fast Banglish conversion with accurate transliteration.",
  icons: {
    icon: '/favicon.svg',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={` ${jakarta.variable} antialiased`}
      >
        <AuthProvider>
          {children}
          <Toaster
            richColors
            position="top-center"
            closeButton
          />
        </AuthProvider>
      </body>
    </html>
  );
}
