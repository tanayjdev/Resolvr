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
  metadataBase: new URL(
    "https://pathweaver-ai.vercel.app"
  ),

  title: {
    default:
      "PathWeaver AI — AI Career Intelligence Platform",

    template:
      "%s | PathWeaver AI",
  },

  description:
    "PathWeaver AI helps students discover career pathways, identify skill gaps, and prepare for the future of work through AI-powered guidance, immersive simulations, and adaptive learning intelligence.",

  keywords: [
    "AI career guidance",
    "career pathways",
    "student employability",
    "career intelligence",
    "AI mentorship",
    "education to employment",
    "PathWeaver AI",
    "career roadmap",
    "future jobs",
    "AI learning platform",
  ],

  authors: [
    {
      name: "PathWeaver AI Team",
    },
  ],

  creator: "PathWeaver AI",

  applicationName:
    "PathWeaver AI",

  category: "education",

  openGraph: {
    title:
      "PathWeaver AI — AI Career Intelligence Platform",

    description:
      "AI-powered career navigation platform helping students map pathways, build skills, and prepare for future careers.",

    url: "https://pathweaver-ai.vercel.app",

    siteName: "PathWeaver AI",

    locale: "en_IN",

    type: "website",

    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "PathWeaver AI",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",

    title:
      "PathWeaver AI — AI Career Intelligence",

    description:
      "AI-powered education-to-employment intelligence platform.",

    images: ["/og-image.png"],
  },

  icons: {
    icon: [
      {
        url: "/icon-light-32x32.png",
        media:
          "(prefers-color-scheme: light)",
      },

      {
        url: "/icon-dark-32x32.png",
        media:
          "(prefers-color-scheme: dark)",
      },

      {
        url: "/icon.svg",
        type: "image/svg+xml",
      },
    ],

    apple: "/apple-icon.png",
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