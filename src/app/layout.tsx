import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Providers from "@/components/providers";
import { PosHoProvider } from "./provider";
// import { AuthProvider } from "@/components/providers/auth-provider";
import { Toaster } from "sonner";
import dynamic from "next/dynamic";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

const PostHogPageView = dynamic(() => import("./postHogView"), {
  ssr: false,
});

export const metadata: Metadata = {
  title: "Ttickles Platform",
  description:
    "The Ttickles Platform is built to automate marketing with text generation, text optimization, and chat edits.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <PosHoProvider>
      <html lang="en">
        <head>
          {/* <script
            src="https://unpkg.com/react-scan/dist/auto.global.js"
            async
            /> */}
        </head>
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          <PostHogPageView />
          <Providers>
            <Toaster />
            {children}
          </Providers>
        </body>
      </html>
    </PosHoProvider>
  );
}
