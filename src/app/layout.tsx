import type { Metadata } from "next";
import "./globals.css";
import { HydrationSuppressor } from "@/components/HydrationSuppressor";

export const metadata: Metadata = {
  title: "OrderPilot - AI-Powered Restaurant Management",
  description: "Transform your restaurant operations with intelligent voice agents and real-time order management",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script async src="https://js.stripe.com/v3/pricing-table.js"></script>
      </head>
      <body
        className="font-helvetica antialiased"
        suppressHydrationWarning
      >
        <HydrationSuppressor>
          {children}
        </HydrationSuppressor>
      </body>
    </html>
  );
}
