"use client"

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react"

import { useAuth } from "@/context/auth-context"
import { supabase } from "@/lib/supabase"
import type { Database } from "@/lib/supabase"

type UserSettings = Database["public"]["Tables"]["user_settings"]["Row"]

const DEFAULT_SETTINGS: UserSettings = {
  id: "",
  user_id: "",
  push_notifications: false,
  email_alerts: true,
  simulation_reminders: true,
  dark_mode: false,
  auto_theme: false,
  reduced_motion: false,
  high_contrast: false,
  low_data_mode: false,
  auto_save_progress: true,
  show_ai_hints: true,
  difficulty_level: "medium",
  created_at: "",
  updated_at: "",
}

interface SettingsContextType {
  settings: UserSettings
  hasHydrated: boolean
  isLoading: boolean
  setPushNotifications: (value: boolean) => void
  setEmailAlerts: (value: boolean) => void
  setSimulationReminders: (value: boolean) => void
  setDarkMode: (value: boolean) => void
  setAutoTheme: (value: boolean) => void
  setReducedMotion: (value: boolean) => void
  setHighContrast: (value: boolean) => void
  setLowDataMode: (value: boolean) => void
  setAutoSaveProgress: (value: boolean) => void
  setShowAiHints: (value: boolean) => void
  setDifficultyLevel: (value: "easy" | "medium" | "hard") => void
  saveSettings: () => Promise<void>
  clearCache: () => void
  requestNotificationPermission: () => Promise<void>
}

const SettingsContext = createContext<SettingsContextType | undefined>(
  undefined,
)

export function SettingsProvider({ children }: { children: ReactNode }) {
  const { currentUser, isAuthenticated } = useAuth()
  const [settings, setSettings] = useState<UserSettings>(DEFAULT_SETTINGS)
  const [hasHydrated, setHasHydrated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  // Load settings from localStorage on mount (fallback)
  useEffect(() => {
    const localSettings = localStorage.getItem("userSettings")
    if (localSettings) {
      try {
        const parsed = JSON.parse(localSettings)
        setSettings((prev) => ({
          ...prev,
          ...parsed,
        }))
      } catch (e) {
        console.error("Failed to parse local settings:", e)
      }
    }
    setHasHydrated(true)
  }, [])

  // Load settings from Supabase on login
  useEffect(() => {
    if (!isAuthenticated || !currentUser?.id) {
      setIsLoading(false)
      return
    }

    const loadSettings = async () => {
      setIsLoading(true)
      try {
        const { data, error } = await supabase
          .from("user_settings")
          .select("*")
          .eq("user_id", currentUser.id)
          .single()

        if (error) {
          console.error("Error loading settings:", error.message, error)
          // If row doesn't exist, create it
          if (error.code === "PGRST116") {
            const { data: newSettings, error: insertError } = await supabase
              .from("user_settings")
              .insert({ user_id: currentUser.id })
              .select()
              .single()

            if (insertError) {
              console.error("Error creating default settings:", insertError.message, insertError)
            } else if (newSettings) {
              setSettings(newSettings)
              localStorage.setItem("userSettings", JSON.stringify(newSettings))
            }
          }
          return
        }

        if (data) {
          setSettings(data)
          localStorage.setItem("userSettings", JSON.stringify(data))
        }
      } catch (e) {
        console.error("Error loading settings (catch):", e)
      } finally {
        setIsLoading(false)
      }
    }

    loadSettings()
  }, [isAuthenticated, currentUser?.id])

  // Apply theme classes to document
  useEffect(() => {
    if (!hasHydrated) return

    const root = document.documentElement

    // Dark Mode
    if (settings.dark_mode && !settings.auto_theme) {
      root.classList.add("dark")
    } else {
      root.classList.remove("dark")
    }

    // Auto Theme
    if (settings.auto_theme) {
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches
      if (prefersDark) {
        root.classList.add("dark")
      } else {
        root.classList.remove("dark")
      }
    }

    // Reduced Motion
    if (settings.reduced_motion) {
      root.classList.add("reduce-motion")
    } else {
      root.classList.remove("reduce-motion")
    }

    // High Contrast
    if (settings.high_contrast) {
      root.classList.add("high-contrast")
    } else {
      root.classList.remove("high-contrast")
    }

    // Low Data Mode
    if (settings.low_data_mode) {
      root.classList.add("low-data")
    } else {
      root.classList.remove("low-data")
    }
  }, [settings, hasHydrated])

  // Listen for system theme changes when auto_theme is enabled
  useEffect(() => {
    if (!settings.auto_theme) return

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)")
    const handleChange = (e: MediaQueryListEvent) => {
      const root = document.documentElement
      if (e.matches) {
        root.classList.add("dark")
      } else {
        root.classList.remove("dark")
      }
    }

    mediaQuery.addEventListener("change", handleChange)
    return () => mediaQuery.removeEventListener("change", handleChange)
  }, [settings.auto_theme])

  const saveSettings = useCallback(async () => {
    if (!isAuthenticated || !currentUser?.id) {
      // Save to localStorage if not logged in
      localStorage.setItem("userSettings", JSON.stringify(settings))
      return
    }

    try {
      const { error } = await supabase
        .from("user_settings")
        .upsert({
          user_id: currentUser.id,
          push_notifications: settings.push_notifications,
          email_alerts: settings.email_alerts,
          simulation_reminders: settings.simulation_reminders,
          dark_mode: settings.dark_mode,
          auto_theme: settings.auto_theme,
          reduced_motion: settings.reduced_motion,
          high_contrast: settings.high_contrast,
          low_data_mode: settings.low_data_mode,
          auto_save_progress: settings.auto_save_progress,
          show_ai_hints: settings.show_ai_hints,
          difficulty_level: settings.difficulty_level,
        }, {
          onConflict: "user_id",
        })

      if (error) {
        console.error("Error saving settings:", error.message, error)
        throw error
      }

      // Update localStorage cache
      localStorage.setItem("userSettings", JSON.stringify(settings))
    } catch (e) {
      console.error("Error saving settings (catch):", e)
      throw e
    }
  }, [settings, isAuthenticated, currentUser?.id])

  const clearCache = useCallback(() => {
    // Clear simulation cache
    const simulationKeys = Object.keys(localStorage).filter((key) =>
      key.startsWith("simulation_"),
    )
    simulationKeys.forEach((key) => localStorage.removeItem(key))

    // Clear temporary app data
    const tempKeys = Object.keys(localStorage).filter((key) =>
      key.startsWith("temp_"),
    )
    tempKeys.forEach((key) => localStorage.removeItem(key))

    console.log("Cache cleared")
  }, [])

  const requestNotificationPermission = useCallback(async () => {
    if (!("Notification" in window)) {
      console.log("This browser does not support notifications")
      return
    }

    const permission = await Notification.requestPermission()

    if (permission === "granted") {
      setSettings((prev) => ({
        ...prev,
        push_notifications: true,
      }))
      await saveSettings()
    } else if (permission === "denied") {
      setSettings((prev) => ({
        ...prev,
        push_notifications: false,
      }))
      await saveSettings()
    }
  }, [saveSettings])

  const setPushNotifications = useCallback((value: boolean) => {
    setSettings((prev) => ({ ...prev, push_notifications: value }))
  }, [])

  const setEmailAlerts = useCallback((value: boolean) => {
    setSettings((prev) => ({ ...prev, email_alerts: value }))
  }, [])

  const setSimulationReminders = useCallback((value: boolean) => {
    setSettings((prev) => ({ ...prev, simulation_reminders: value }))
  }, [])

  const setDarkMode = useCallback((value: boolean) => {
    setSettings((prev) => ({ ...prev, dark_mode: value, auto_theme: false }))
  }, [])

  const setAutoTheme = useCallback((value: boolean) => {
    setSettings((prev) => ({ ...prev, auto_theme: value }))
  }, [])

  const setReducedMotion = useCallback((value: boolean) => {
    setSettings((prev) => ({ ...prev, reduced_motion: value }))
  }, [])

  const setHighContrast = useCallback((value: boolean) => {
    setSettings((prev) => ({ ...prev, high_contrast: value }))
  }, [])

  const setLowDataMode = useCallback((value: boolean) => {
    setSettings((prev) => ({ ...prev, low_data_mode: value }))
  }, [])

  const setAutoSaveProgress = useCallback((value: boolean) => {
    setSettings((prev) => ({ ...prev, auto_save_progress: value }))
  }, [])

  const setShowAiHints = useCallback((value: boolean) => {
    setSettings((prev) => ({ ...prev, show_ai_hints: value }))
  }, [])

  const setDifficultyLevel = useCallback(
    (value: "easy" | "medium" | "hard") => {
      setSettings((prev) => ({ ...prev, difficulty_level: value }))
    },
    [],
  )

  const value: SettingsContextType = {
    settings,
    hasHydrated,
    isLoading,
    setPushNotifications,
    setEmailAlerts,
    setSimulationReminders,
    setDarkMode,
    setAutoTheme,
    setReducedMotion,
    setHighContrast,
    setLowDataMode,
    setAutoSaveProgress,
    setShowAiHints,
    setDifficultyLevel,
    saveSettings,
    clearCache,
    requestNotificationPermission,
  }

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  )
}

export function useSettings() {
  const context = useContext(SettingsContext)
  if (context === undefined) {
    throw new Error("useSettings must be used within a SettingsProvider")
  }
  return context
}
