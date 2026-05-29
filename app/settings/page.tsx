"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import {
  Settings,
  Bell,
  Moon,
  Sun,
  Accessibility,
  Database,
  Gamepad2,
  Shield,
  LogOut,
  Save,
} from "lucide-react"

import { useUserProgress } from "@/context/user-context"
import PageTransition from "@/components/common/PageTransition"
import { Sidebar, TopBar, BottomNav } from "@/components/dashboard/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"

export default function SettingsPage() {
  const router = useRouter()
  const { progress, profile, hasHydrated, toggleLowDataMode } = useUserProgress()

  React.useEffect(() => {
    if (!hasHydrated) return
    if (!profile.onboardingComplete) {
      router.replace("/onboarding")
    }
  }, [hasHydrated, profile.onboardingComplete, router])

  if (!hasHydrated || !profile.onboardingComplete) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="h-10 w-10 animate-pulse rounded-full border border-primary/30 bg-primary/10" />
      </div>
    )
  }

  const [notifications, setNotifications] = React.useState(true)
  const [emailAlerts, setEmailAlerts] = React.useState(true)
  const [simulationReminders, setSimulationReminders] = React.useState(true)
  const [darkMode, setDarkMode] = React.useState(true)
  const [reducedMotion, setReducedMotion] = React.useState(false)
  const [highContrast, setHighContrast] = React.useState(false)
  const [autoSave, setAutoSave] = React.useState(true)

  const handleSave = () => {
    // Save settings to localStorage
    const settings = {
      notifications,
      emailAlerts,
      simulationReminders,
      darkMode,
      reducedMotion,
      highContrast,
      autoSave,
      lowDataMode: profile.lowDataMode,
    }
    localStorage.setItem('userSettings', JSON.stringify(settings))
    
    // Show save confirmation
    console.log('Settings saved:', settings)
  }

  return (
    <PageTransition>
      <div className="min-h-screen overflow-hidden bg-background text-foreground">
        <Sidebar />

        <div className="relative lg:pl-64">
          <TopBar />

          <main className="relative space-y-6 p-4 pb-24 sm:p-6 lg:p-8 lg:pb-10">
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45 }}
              className="flex items-center justify-between"
            >
              <div>
                <h1 className="font-[var(--font-syne)] text-2xl font-bold tracking-tight sm:text-3xl">
                  Settings
                </h1>
                <p className="mt-1 text-sm text-muted-foreground">
                  Customize your experience and preferences
                </p>
              </div>

              <Button onClick={handleSave} className="gap-2">
                <Save className="h-4 w-4" />
                Save Changes
              </Button>
            </motion.div>

            {/* Notification Settings */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.1 }}
              className="rounded-2xl border border-white/10 bg-card/40 p-5 backdrop-blur-xl"
            >
              <div className="mb-4 flex items-center gap-2">
                <Bell className="h-5 w-5 text-primary" />
                <h3 className="font-semibold text-lg">Notification Settings</h3>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 p-4">
                  <div>
                    <p className="text-sm font-medium">Push Notifications</p>
                    <p className="text-xs text-muted-foreground">Receive in-app notifications</p>
                  </div>
                  <Switch checked={notifications} onCheckedChange={setNotifications} />
                </div>

                <div className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 p-4">
                  <div>
                    <p className="text-sm font-medium">Email Alerts</p>
                    <p className="text-xs text-muted-foreground">Get updates via email</p>
                  </div>
                  <Switch checked={emailAlerts} onCheckedChange={setEmailAlerts} />
                </div>

                <div className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 p-4">
                  <div>
                    <p className="text-sm font-medium">Simulation Reminders</p>
                    <p className="text-xs text-muted-foreground">Remind me to complete simulations</p>
                  </div>
                  <Switch checked={simulationReminders} onCheckedChange={setSimulationReminders} />
                </div>
              </div>
            </motion.div>

            {/* Theme Preferences */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.2 }}
              className="rounded-2xl border border-white/10 bg-card/40 p-5 backdrop-blur-xl"
            >
              <div className="mb-4 flex items-center gap-2">
                <Moon className="h-5 w-5 text-primary" />
                <h3 className="font-semibold text-lg">Theme Preferences</h3>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 p-4">
                  <div>
                    <p className="text-sm font-medium">Dark Mode</p>
                    <p className="text-xs text-muted-foreground">Use dark theme by default</p>
                  </div>
                  <Switch checked={darkMode} onCheckedChange={setDarkMode} />
                </div>

                <div className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 p-4">
                  <div>
                    <p className="text-sm font-medium">Auto Theme</p>
                    <p className="text-xs text-muted-foreground">Follow system preference</p>
                  </div>
                  <Switch checked={!darkMode} onCheckedChange={() => setDarkMode(!darkMode)} />
                </div>
              </div>
            </motion.div>

            {/* Accessibility */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.3 }}
              className="rounded-2xl border border-white/10 bg-card/40 p-5 backdrop-blur-xl"
            >
              <div className="mb-4 flex items-center gap-2">
                <Accessibility className="h-5 w-5 text-primary" />
                <h3 className="font-semibold text-lg">Accessibility</h3>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 p-4">
                  <div>
                    <p className="text-sm font-medium">Reduced Motion</p>
                    <p className="text-xs text-muted-foreground">Minimize animations</p>
                  </div>
                  <Switch checked={reducedMotion} onCheckedChange={setReducedMotion} />
                </div>

                <div className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 p-4">
                  <div>
                    <p className="text-sm font-medium">High Contrast</p>
                    <p className="text-xs text-muted-foreground">Increase color contrast</p>
                  </div>
                  <Switch checked={highContrast} onCheckedChange={setHighContrast} />
                </div>
              </div>
            </motion.div>

            {/* Data & Performance */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.4 }}
              className="rounded-2xl border border-white/10 bg-card/40 p-5 backdrop-blur-xl"
            >
              <div className="mb-4 flex items-center gap-2">
                <Database className="h-5 w-5 text-primary" />
                <h3 className="font-semibold text-lg">Data & Performance</h3>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 p-4">
                  <div>
                    <p className="text-sm font-medium">Low Data Mode</p>
                    <p className="text-xs text-muted-foreground">Reduce data usage</p>
                  </div>
                  <Switch checked={profile.lowDataMode} onCheckedChange={toggleLowDataMode} />
                </div>

                <div className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 p-4">
                  <div>
                    <p className="text-sm font-medium">Auto Save Progress</p>
                    <p className="text-xs text-muted-foreground">Automatically save your progress</p>
                  </div>
                  <Switch checked={autoSave} onCheckedChange={setAutoSave} />
                </div>

                <div className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 p-4">
                  <div>
                    <p className="text-sm font-medium">Clear Cache</p>
                    <p className="text-xs text-muted-foreground">Free up storage space</p>
                  </div>
                  <Button variant="outline" size="sm">
                    Clear
                  </Button>
                </div>
              </div>
            </motion.div>

            {/* Simulation Preferences */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.5 }}
              className="rounded-2xl border border-white/10 bg-card/40 p-5 backdrop-blur-xl"
            >
              <div className="mb-4 flex items-center gap-2">
                <Gamepad2 className="h-5 w-5 text-primary" />
                <h3 className="font-semibold text-lg">Simulation Preferences</h3>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 p-4">
                  <div>
                    <p className="text-sm font-medium">Show AI Hints</p>
                    <p className="text-xs text-muted-foreground">Display AI guidance during simulations</p>
                  </div>
                  <Switch checked={true} />
                </div>

                <div className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 p-4">
                  <div>
                    <p className="text-sm font-medium">Difficulty Level</p>
                    <p className="text-xs text-muted-foreground">Adjust simulation complexity</p>
                  </div>
                  <Button variant="outline" size="sm">
                    Medium
                  </Button>
                </div>
              </div>
            </motion.div>

            {/* Account */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.6 }}
              className="rounded-2xl border border-white/10 bg-card/40 p-5 backdrop-blur-xl"
            >
              <div className="mb-4 flex items-center gap-2">
                <Shield className="h-5 w-5 text-primary" />
                <h3 className="font-semibold text-lg">Account</h3>
              </div>

              <div className="space-y-4">
                <Button variant="outline" className="w-full justify-start gap-2">
                  <Shield className="h-4 w-4" />
                  Privacy Settings
                </Button>

                <Button variant="outline" className="w-full justify-start gap-2">
                  <Database className="h-4 w-4" />
                  Export Data
                </Button>

                <Button variant="destructive" className="w-full justify-start gap-2">
                  <LogOut className="h-4 w-4" />
                  Sign Out
                </Button>
              </div>
            </motion.div>
          </main>
        </div>

        <BottomNav />
      </div>
    </PageTransition>
  )
}
