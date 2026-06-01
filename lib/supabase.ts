import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Get the origin for redirect URLs (works in browser, falls back to localhost for SSR)
const getOrigin = () => {
  if (typeof window !== 'undefined') {
    return window.location.origin
  }
  return process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    // Use a valid callback URL for email confirmation
    // This must match the allowed redirect URLs in your Supabase dashboard
    emailRedirectTo: `${getOrigin()}/auth/callback`,
  },
})

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          username: string
          career_track: string | null
          skill_level: string | null
          time_commitment: string | null
          interests: string[] | null
          onboarding_complete: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          username: string
          career_track?: string | null
          skill_level?: string | null
          time_commitment?: string | null
          interests?: string[] | null
          onboarding_complete?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          username?: string
          career_track?: string | null
          skill_level?: string | null
          time_commitment?: string | null
          interests?: string[] | null
          onboarding_complete?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      user_progress: {
        Row: {
          id: string
          user_id: string
          readiness_score: number
          employability_score: number
          simulations_completed: number
          skills_tracked: number
          opportunities_matched: number
          certifications_earned: number
          milestones_completed: number
          ai_confidence: number
          recommendation_strength: number
          skill_mastery: number
          pathway_readiness: number
          completed_simulations: string[]
          unlocked_pathways: string[]
          skills: Array<{ name: string; level: number }>
          simulation_performance: Record<string, number>
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          readiness_score?: number
          employability_score?: number
          simulations_completed?: number
          skills_tracked?: number
          opportunities_matched?: number
          certifications_earned?: number
          milestones_completed?: number
          ai_confidence?: number
          recommendation_strength?: number
          skill_mastery?: number
          pathway_readiness?: number
          completed_simulations?: string[]
          unlocked_pathways?: string[]
          skills?: Array<{ name: string; level: number }>
          simulation_performance?: Record<string, number>
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          readiness_score?: number
          employability_score?: number
          simulations_completed?: number
          skills_tracked?: number
          opportunities_matched?: number
          certifications_earned?: number
          milestones_completed?: number
          ai_confidence?: number
          recommendation_strength?: number
          skill_mastery?: number
          pathway_readiness?: number
          completed_simulations?: string[]
          unlocked_pathways?: string[]
          skills?: Array<{ name: string; level: number }>
          simulation_performance?: Record<string, number>
          created_at?: string
          updated_at?: string
        }
      }
      user_settings: {
        Row: {
          id: string
          user_id: string
          push_notifications: boolean
          email_alerts: boolean
          simulation_reminders: boolean
          dark_mode: boolean
          auto_theme: boolean
          reduced_motion: boolean
          high_contrast: boolean
          low_data_mode: boolean
          auto_save_progress: boolean
          show_ai_hints: boolean
          difficulty_level: 'easy' | 'medium' | 'hard'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          push_notifications?: boolean
          email_alerts?: boolean
          simulation_reminders?: boolean
          dark_mode?: boolean
          auto_theme?: boolean
          reduced_motion?: boolean
          high_contrast?: boolean
          low_data_mode?: boolean
          auto_save_progress?: boolean
          show_ai_hints?: boolean
          difficulty_level?: 'easy' | 'medium' | 'hard'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          push_notifications?: boolean
          email_alerts?: boolean
          simulation_reminders?: boolean
          dark_mode?: boolean
          auto_theme?: boolean
          reduced_motion?: boolean
          high_contrast?: boolean
          low_data_mode?: boolean
          auto_save_progress?: boolean
          show_ai_hints?: boolean
          difficulty_level?: 'easy' | 'medium' | 'hard'
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}
