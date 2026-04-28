import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { siteConfig } from "@/config/site";
import { LocalizedClerkProvider } from "@/components/providers/clerk-provider";
import { ConvexClientProvider } from "@/components/providers/convex-provider";
import { Providers } from "@/components/providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.name} - AI Art Generation Platform`,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: [
    "AI art",
    "AI image generator",
    "text to image",
    "AI generation",
    "digital art",
    "creative AI",
  ],
  authors: [
    {
      name: siteConfig.author,
    },
  ],
  creator: siteConfig.author,
  openGraph: {
    type: "website",
    locale: "zh_CN",
    alternateLocale: ["en_US", "zh_TW"],
    url: siteConfig.url,
    title: siteConfig.name,
    description: siteConfig.description,
    siteName: siteConfig.name,
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.name,
    description: siteConfig.description,
    creator: "@ai_art",
  },
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
    ],
    shortcut: "/favicon.svg",
  },
  manifest: `${siteConfig.url}/manifest.json`,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <LocalizedClerkProvider>
      <ConvexClientProvider>
        <Providers>
          <html lang="zh-CN" suppressHydrationWarning>
            <head>
              <meta name="theme-color" content="#0a0a0a" />
              <meta name="color-scheme" content="dark" />
            </head>
            <body
              className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen`}
              data-theme="dark"
              suppressHydrationWarning
            >
              {children}
            </body>
          </html>
        </Providers>
      </ConvexClientProvider>
    </LocalizedClerkProvider>
  );
}
