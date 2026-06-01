"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"

export default function AuthCallbackPage() {
  const router = useRouter()

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        const { data, error } = await supabase.auth.getSession()
        
        if (error) {
          console.error("Auth callback error:", error)
          router.push("/login?error=auth_callback_failed")
          return
        }

        if (data.session) {
          // User is authenticated, redirect to dashboard or onboarding
          router.push("/dashboard")
        } else {
          // No session, redirect to login
          router.push("/login")
        }
      } catch (error) {
        console.error("Auth callback error:", error)
        router.push("/login?error=auth_callback_failed")
      }
    }

    handleAuthCallback()
  }, [router])

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="text-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto mb-4" />
        <p className="text-muted-foreground">Processing authentication...</p>
      </div>
    </div>
  )
}
