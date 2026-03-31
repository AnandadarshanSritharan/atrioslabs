import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Atrios Labs — Think Beyond Technology",
    template: "%s | Atrios Labs",
  },
  description:
    "Atrios Labs is a forward-thinking technology company specializing in web development, IoT solutions, AI & automation, and application development.",
  keywords: [
    "web development",
    "IoT solutions",
    "AI automation",
    "app development",
    "technology company",
    "Atrios Labs",
  ],
  authors: [{ name: "Atrios Labs" }],
  creator: "Atrios Labs",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://atrioslabs.com",
    siteName: "Atrios Labs",
    title: "Atrios Labs — Think Beyond Technology",
    description:
      "Empowering businesses with cutting-edge web, IoT, AI, and application solutions.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Atrios Labs — Think Beyond Technology",
    description:
      "Empowering businesses with cutting-edge web, IoT, AI, and application solutions.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className={`${inter.variable} antialiased bg-brand-dark text-brand-light`}>
        {children}
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: "#1A1A2E",
              color: "#E2E8F0",
              border: "1px solid rgba(124,58,237,0.3)",
              borderRadius: "12px",
            },
            success: {
              iconTheme: { primary: "#7C3AED", secondary: "#fff" },
            },
            error: {
              iconTheme: { primary: "#EF4444", secondary: "#fff" },
            },
          }}
        />
      </body>
    </html>
  );
}
