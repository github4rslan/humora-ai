import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "sonner";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Humora — your AI drafts, written like a human",
  description:
    "Paste a draft. Humora strips the AI tells and gives you back something a person would write. Free to try.",
  openGraph: {
    title: "Humora — your AI drafts, written like a human",
    description:
      "Paste a draft. Humora strips the AI tells and gives you back something a person would write.",
    url: "https://humora.ai",
    siteName: "Humora",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html
        lang="en"
        className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      >
        <body className="min-h-full flex flex-col bg-background text-foreground">
          {children}
          <Toaster
            position="bottom-right"
            toastOptions={{
              classNames: {
                toast:
                  "bg-card border border-border text-card-foreground rounded-xl",
              },
            }}
          />
        </body>
      </html>
    </ClerkProvider>
  );
}
