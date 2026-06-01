// ============================================================
// Persona Theme System
// ============================================================
// This file provides utilities for applying persona-specific
// visual themes (colors, gradients, icons) throughout the app.
// ============================================================

import type { CareerTrack, PersonaTheme } from "@/lib/personas/persona-config"
import { PERSONA_DATA } from "@/lib/personas/persona-config"

// ============================================================
// Theme Utilities
// ============================================================

export function getPersonaTheme(careerTrack: CareerTrack | null): PersonaTheme | null {
  if (!careerTrack) return null
  return PERSONA_DATA[careerTrack]?.theme || null
}

export function getPersonaGradient(careerTrack: CareerTrack | null): string {
  const theme = getPersonaTheme(careerTrack)
  return theme?.gradient || "from-primary to-secondary"
}

export function getPersonaGlowColor(careerTrack: CareerTrack | null): string {
  const theme = getPersonaTheme(careerTrack)
  return theme?.glowColor || "rgba(0, 198, 255, 0.3)"
}

export function getPersonaIcon(careerTrack: CareerTrack | null): string {
  const theme = getPersonaTheme(careerTrack)
  return theme?.icon || "🎯"
}

export function getPersonaPrimaryColor(careerTrack: CareerTrack | null): string {
  const theme = getPersonaTheme(careerTrack)
  return theme?.primaryColor || "primary"
}

export function getPersonaAccentColor(careerTrack: CareerTrack | null): string {
  const theme = getPersonaTheme(careerTrack)
  return theme?.accentColor || "primary"
}

// ============================================================
// CSS Class Generators
// ============================================================

export function getPersonaGradientClass(careerTrack: CareerTrack | null): string {
  const gradient = getPersonaGradient(careerTrack)
  return `bg-gradient-to-r ${gradient}`
}

export function getPersonaTextGradientClass(careerTrack: CareerTrack | null): string {
  const gradient = getPersonaGradient(careerTrack)
  return `bg-gradient-to-r ${gradient} bg-clip-text text-transparent`
}

export function getPersonaBorderClass(careerTrack: CareerTrack | null): string {
  const primaryColor = getPersonaPrimaryColor(careerTrack)
  return `border-${primaryColor}/30`
}

export function getPersonaGlowClass(careerTrack: CareerTrack | null): string {
  const glowColor = getPersonaGlowColor(careerTrack)
  return `shadow-[0_0_30px_${glowColor}]`
}

// ============================================================
// Theme Hook
// ============================================================

export interface PersonaThemeStyles {
  gradientClass: string
  textGradientClass: string
  borderClass: string
  glowClass: string
  icon: string
  primaryColor: string
  accentColor: string
}

export function usePersonaTheme(careerTrack: CareerTrack | null): PersonaThemeStyles {
  return {
    gradientClass: getPersonaGradientClass(careerTrack),
    textGradientClass: getPersonaTextGradientClass(careerTrack),
    borderClass: getPersonaBorderClass(careerTrack),
    glowClass: getPersonaGlowClass(careerTrack),
    icon: getPersonaIcon(careerTrack),
    primaryColor: getPersonaPrimaryColor(careerTrack),
    accentColor: getPersonaAccentColor(careerTrack),
  }
}
