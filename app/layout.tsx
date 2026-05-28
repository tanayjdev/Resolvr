import type {
  Metadata,
  Viewport,
} from "next"

import {
  Geist,
  Geist_Mono,
  Syne,
} from "next/font/google"

import { Analytics } from "@vercel/analytics/next"

import "./globals.css"

import { UserProvider } from "@/context/user-context"

// =========================================================
// Fonts
// =========================================================

const geistSans = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
  display: "swap",
})

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
  display: "swap",
})

const syne = Syne({
  subsets: ["latin"],
  variable: "--font-syne",
  weight: [
    "400",
    "500",
    "600",
    "700",
    "800",
  ],
  display: "swap",
})

// =========================================================
// Metadata
// =========================================================

export const metadata: Metadata = {
  manifest: "/site.webmanifest",
  metadataBase: new URL(
    "https://resolvr.vercel.app"
  ),

  title: {
    default:
      "Resolvr",

    template:
      "%s | Resolvr AI",
  },

  description:
    "Resolvr AI helps students discover employability pathways, identify skill gaps, and prepare for future careers through AI-powered simulations and adaptive intelligence.",
  keywords: [
    "AI career guidance",
    "career pathways",
    "student employability",
    "AI mentorship",
    "education to employment",
    "Resolvr AI",
    "AI simulations",
    "employability intelligence",
    "career simulation platform",
    "career roadmap",
    "future jobs",
    "AI learning platform",
  ],

  authors: [
    {
      name: "Resolvr AI Team",
    },
  ],

  creator: "Resolvr AI",

  applicationName:
    "Resolvr AI",

  category: "education",

  openGraph: {
    title:
      "Resolvr AI — Employability Intelligence Platform",

    description:
      "AI-powered employability intelligence platform helping students build industry-ready skills through adaptive simulations and career intelligence.",

    url: "https://resolvr.vercel.app",

    siteName: "Resolvr AI",

    locale: "en_IN",

    type: "website",

    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Resolvr AI",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",

    title:
      "Resolvr AI — Employability Intelligence Platform",

    description:
      "AI-powered employability intelligence platform with adaptive career simulations and readiness tracking.",

    images: ["/og-image.png"],
  },

  icons: {
    icon: [
      {
        url: "/branding/favicon.ico",
      },
      {
        url: "/branding/favicon-32x32.png",
        sizes: "32x32",
        type: "image/png",
      },
      {
        url: "/branding/favicon-16x16.png",
        sizes: "16x16",
        type: "image/png",
      },
    ],

    apple: "/branding/apple-touch-icon.png",
  },
}
// =========================================================
// Viewport
// =========================================================

export const viewport: Viewport = {
  width: "device-width",

  initialScale: 1,

  maximumScale: 1,

  themeColor: "#030308",

  colorScheme: "dark",
}

// =========================================================
// Root Layout
// =========================================================

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className="dark scroll-smooth"
    >
      <body suppressHydrationWarning
        className={`
          ${geistSans.variable}
          ${geistMono.variable}
          ${syne.variable}
          min-h-screen
          bg-background
          font-sans
          text-foreground
          antialiased
        `}
      >
        {/* Global App State */}
        <UserProvider>
          {children}
        </UserProvider>

        {/* Analytics */}
        {process.env.NODE_ENV ===
          "production" && (
            <Analytics />
          )}
      </body>
    </html>
  )
}