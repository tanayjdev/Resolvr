"use client"

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react"
import { useRouter } from "next/navigation"
import type { PersistedUserState } from "@/lib/storage/user-state-storage"
import { getDefaultPersistedState } from "@/lib/storage/user-state-storage"
import { supabase } from "@/lib/supabase"
import type { User } from "@supabase/supabase-js"

// Get the origin for redirect URLs (works in browser, falls back to localhost for SSR)
const getOrigin = () => {
  if (typeof window !== 'undefined') {
    return window.location.origin
  }
  return process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
}

// ============================================================
// Types
// ============================================================

export interface AuthUser {
  email: string
  username: string
  createdAt: string
  id: string
  profile?: {
    career_track?: string | null
    skill_level?: string | null
    time_commitment?: string | null
    interests?: string[] | null
    onboarding_complete?: boolean
  }
  userProgress?: {
    readiness_score?: number
    completed_simulations?: string[]
    simulations_completed?: number
    employability_score?: number
    skills?: any[]
    simulation_performance?: Record<string, number>
  }
}

export interface AuthState {
  currentUser: AuthUser | null
  isAuthenticated: boolean
  isLoading: boolean
}

export interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>
  signup: (email: string, username: string, password: string) => Promise<void>
  logout: () => Promise<void>
  restoreSession: () => Promise<void>
  getUserData: (email: string) => PersistedUserState | null
  saveUserData: (email: string, data: PersistedUserState) => void
}

const AuthContext = createContext<AuthContextType | null>(null)

// ============================================================
// Helper Functions
// ============================================================

function getUserDataKey(email: string): string {
  return `resolvr-user-${email.replace(/[@.]/g, '-')}-data`
}

// ============================================================
// Provider
// ============================================================

export function AuthProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  const isAuthenticated = !!currentUser

  // Restore session on mount
  useEffect(() => {
    restoreSession()
  }, [])

  const restoreSession = useCallback(async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      
      if (session?.user) {
        // Fetch user profile from profiles table
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single()

        // Fetch user progress from user_progress table
        const { data: userProgress } = await supabase
          .from('user_progress')
          .select('*')
          .eq('user_id', session.user.id)
          .single()

        setCurrentUser({
          email: session.user.email!,
          username: profile?.username || session.user.email!.split('@')[0],
          createdAt: profile?.created_at || session.user.created_at,
          id: session.user.id,
          profile: profile ? {
            career_track: profile.career_track,
            skill_level: profile.skill_level,
            time_commitment: profile.time_commitment,
            interests: profile.interests,
            onboarding_complete: profile.onboarding_complete,
          } : undefined,
          userProgress: userProgress ? {
            readiness_score: userProgress.readiness_score,
            completed_simulations: userProgress.completed_simulations,
            simulations_completed: userProgress.simulations_completed,
            employability_score: userProgress.employability_score,
            skills: userProgress.skills,
            simulation_performance: userProgress.simulation_performance,
          } : undefined,
        })
      }
    } catch (error) {
      console.error("Failed to restore session:", error)
    } finally {
      setIsLoading(false)
    }
  }, [])

  const login = useCallback(async (email: string, password: string) => {
    setIsLoading(true)

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.toLowerCase().trim(),
        password,
      })

      if (error) throw error

      if (data.user) {
        // Fetch user profile
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', data.user.id)
          .single()

        // Fetch user progress from user_progress table
        const { data: userProgress } = await supabase
          .from('user_progress')
          .select('*')
          .eq('user_id', data.user.id)
          .single()

        setCurrentUser({
          email: data.user.email!,
          username: profile?.username || data.user.email!.split('@')[0],
          createdAt: profile?.created_at || data.user.created_at,
          id: data.user.id,
          profile: profile ? {
            career_track: profile.career_track,
            skill_level: profile.skill_level,
            time_commitment: profile.time_commitment,
            interests: profile.interests,
            onboarding_complete: profile.onboarding_complete,
          } : undefined,
          userProgress: userProgress ? {
            readiness_score: userProgress.readiness_score,
            completed_simulations: userProgress.completed_simulations,
            simulations_completed: userProgress.simulations_completed,
            employability_score: userProgress.employability_score,
            skills: userProgress.skills,
            simulation_performance: userProgress.simulation_performance,
          } : undefined,
        })

        // Check if onboarding is complete
        if (profile?.onboarding_complete) {
          router.push("/dashboard")
        } else {
          router.push("/onboarding")
        }
      }
    } catch (error) {
      console.error("Login failed:", error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }, [router])

  const signup = useCallback(async (email: string, username: string, password: string) => {
    setIsLoading(true)

    try {
      console.log("Starting signup process for:", email)

      const { data, error } = await supabase.auth.signUp({
        email: email.toLowerCase().trim(),
        password,
        options: {
          data: {
            username: username.trim(),
          },
          // Disable email confirmation for development
          // In production, remove this and ensure emailRedirectTo is configured
          emailRedirectTo: `${getOrigin()}/auth/callback`,
        },
      })

      if (error) {
        console.error("Signup error:", error)
        throw error
      }

      if (data.user) {
        console.log("User created successfully, ID:", data.user.id)

        // Wait for session to be established and get authenticated user
        const { data: { user }, error: userError } = await supabase.auth.getUser()

        if (userError) {
          console.error("Error getting authenticated user:", userError)
          throw userError
        }

        if (!user) {
          console.error("No authenticated user found after signup")
          throw new Error("Failed to establish authenticated session")
        }

        console.log("Authenticated user retrieved, ID:", user.id)

        // Profile is automatically created by the database trigger `handle_new_user`
        // No manual insert needed here to avoid duplicate key violations
        console.log("Profile will be created by database trigger")

        setCurrentUser({
          email: user.email!,
          username: username.trim(),
          createdAt: user.created_at,
          id: user.id,
        })

        // Redirect to onboarding
        router.push("/onboarding")
      }
    } catch (error) {
      console.error("Signup failed:", error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }, [router])

  const logout = useCallback(async () => {
    try {
      await supabase.auth.signOut()
      setCurrentUser(null)
      router.push("/")
    } catch (error) {
      console.error("Logout failed:", error)
    }
  }, [router])

  const getUserData = useCallback((email: string): PersistedUserState | null => {
    if (typeof window === "undefined") return null

    try {
      const key = getUserDataKey(email)
      const data = localStorage.getItem(key)
      if (!data) return null

      return JSON.parse(data)
    } catch (error) {
      console.error("Failed to get user data:", error)
      return null
    }
  }, [])

  const saveUserData = useCallback((email: string, data: PersistedUserState): void => {
    if (typeof window === "undefined") return

    try {
      const key = getUserDataKey(email)
      localStorage.setItem(key, JSON.stringify(data))
    } catch (error) {
      console.error("Failed to save user data:", error)
    }
  }, [])

  const value: AuthContextType = {
    currentUser,
    isAuthenticated,
    isLoading,
    login,
    signup,
    logout,
    restoreSession,
    getUserData,
    saveUserData,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

// ============================================================
// Hook
// ============================================================

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider")
  }
  return context
}
