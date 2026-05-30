"use client"

import { BrandLogo } from "@/components/branding/brand-logo"

export default function Loading() {
  return (
    <div className="h-screen w-full flex items-center justify-center bg-black">
      <div className="flex flex-col items-center gap-4">
        <div className="w-16 h-16 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin" />
        <BrandLogo size="loading" priority />
        <h1 className="text-cyan-400 text-xl font-semibold">
          Loading...
        </h1>
      </div>
    </div>
  )
}