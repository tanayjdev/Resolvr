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

// ============================================================
// Types
// ============================================================

export interface AuthUser {
  email: string
  username: string
  createdAt: string
}

export interface AuthState {
  currentUser: AuthUser | null
  isAuthenticated: boolean
  isLoading: boolean
}

export interface AuthContextType extends AuthState {
  login: (email: string, username: string, password: string) => Promise<void>
  signup: (email: string, username: string, password: string) => Promise<void>
  logout: () => void
  restoreSession: () => void
  getUserData: (email: string) => PersistedUserState | null
  saveUserData: (email: string, data: PersistedUserState) => void
}

const AuthContext = createContext<AuthContextType | null>(null)

// ============================================================
// Constants
// ============================================================

const USERS_STORAGE_KEY = "resolvr-users"
const ACTIVE_SESSION_KEY = "resolvr-active-session"

// ============================================================
// Helper Functions
// ============================================================

function getUsers(): Record<string, any> {
  if (typeof window === "undefined") return {}
  try {
    const data = localStorage.getItem(USERS_STORAGE_KEY)
    return data ? JSON.parse(data) : {}
  } catch (error) {
    console.error("Failed to read users:", error)
    return {}
  }
}

function saveUsers(users: Record<string, any>): void {
  if (typeof window === "undefined") return
  try {
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users))
  } catch (error) {
    console.error("Failed to save users:", error)
  }
}

function getActiveSession(): string | null {
  if (typeof window === "undefined") return null
  try {
    return localStorage.getItem(ACTIVE_SESSION_KEY)
  } catch (error) {
    console.error("Failed to read active session:", error)
    return null
  }
}

function setActiveSession(email: string | null): void {
  if (typeof window === "undefined") return
  try {
    if (email) {
      localStorage.setItem(ACTIVE_SESSION_KEY, email)
    } else {
      localStorage.removeItem(ACTIVE_SESSION_KEY)
    }
  } catch (error) {
    console.error("Failed to set active session:", error)
  }
}

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

  const restoreSession = useCallback(() => {
    if (typeof window === "undefined") return

    try {
      const activeEmail = getActiveSession()
      if (activeEmail) {
        const users = getUsers()
        const userData = users[activeEmail]
        
        if (userData) {
          setCurrentUser({
            email: activeEmail,
            username: userData.username || activeEmail.split('@')[0],
            createdAt: userData.createdAt || new Date().toISOString(),
          })
        } else {
          // Session exists but user data doesn't - clear session
          setActiveSession(null)
        }
      }
    } catch (error) {
      console.error("Failed to restore session:", error)
      setActiveSession(null)
    } finally {
      setIsLoading(false)
    }
  }, [])

  const login = useCallback(async (email: string, username: string, password: string) => {
    if (typeof window === "undefined") return

    setIsLoading(true)

    try {
      const users = getUsers()
      const normalizedEmail = email.toLowerCase().trim()

      // Check if user exists
      if (!users[normalizedEmail]) {
        throw new Error("User not found. Please sign up first.")
      }

      // Simple password validation (in production, use proper hashing)
      if (users[normalizedEmail].password !== password) {
        throw new Error("Invalid password")
      }

      // Set active session
      setActiveSession(normalizedEmail)
      setCurrentUser({
        email: normalizedEmail,
        username: users[normalizedEmail].username,
        createdAt: users[normalizedEmail].createdAt,
      })

      // Redirect to dashboard
      router.push("/dashboard")
    } catch (error) {
      console.error("Login failed:", error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }, [router])

  const signup = useCallback(async (email: string, username: string, password: string) => {
    if (typeof window === "undefined") return

    setIsLoading(true)

    try {
      const users = getUsers()
      const normalizedEmail = email.toLowerCase().trim()

      // Check if user already exists
      if (users[normalizedEmail]) {
        throw new Error("User already exists. Please login instead.")
      }

      // Create new user
      const newUser: AuthUser = {
        email: normalizedEmail,
        username: username.trim(),
        createdAt: new Date().toISOString(),
      }

      // Save user with password
      users[normalizedEmail] = {
        ...newUser,
        password, // In production, hash this!
      }

      saveUsers(users)

      // Initialize user data with default state
      const defaultData = getDefaultPersistedState()
      saveUserData(normalizedEmail, defaultData)

      // Set active session
      setActiveSession(normalizedEmail)
      setCurrentUser(newUser)

      // Redirect to onboarding
      router.push("/onboarding")
    } catch (error) {
      console.error("Signup failed:", error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }, [router])

  const logout = useCallback(() => {
    if (typeof window === "undefined") return

    try {
      // Clear active session
      setActiveSession(null)
      setCurrentUser(null)

      // Redirect to landing page
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
