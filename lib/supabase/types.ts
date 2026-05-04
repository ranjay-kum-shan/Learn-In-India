/**
 * Database type — hand-curated to match supabase/schema.sql.
 * In production, regenerate via:
 *   supabase gen types typescript --linked > lib/supabase/types.ts
 */

export type Plan = 'free' | 'pro' | 'student' | 'annual'
export type Difficulty = 'easy' | 'medium' | 'hard'
export type SubmissionStatus = 'draft' | 'grading' | 'graded' | 'error'

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          display_name: string | null
          avatar_url: string | null
          stripe_customer_id: string | null
          plan: Plan
          total_xp: number
          streak_days: number
          last_active_on: string | null
          created_at: string
        }
        Insert: {
          id: string
          email: string
          display_name?: string | null
          avatar_url?: string | null
          stripe_customer_id?: string | null
          plan?: Plan
          total_xp?: number
          streak_days?: number
          last_active_on?: string | null
          created_at?: string
        }
        Update: Partial<Database['public']['Tables']['users']['Insert']>
        Relationships: any[]
      }
      problems: {
        Row: {
          id: string
          slug: string
          title: string
          difficulty: Difficulty
          tags: string[]
          estimated_minutes: number
          is_free: boolean
          is_published: boolean
          sort_order: number
          created_at: string
        }
        Insert: {
          id?: string
          slug: string
          title: string
          difficulty?: Difficulty
          tags?: string[]
          estimated_minutes?: number
          is_free?: boolean
          is_published?: boolean
          sort_order?: number
          created_at?: string
        }
        Update: Partial<Database['public']['Tables']['problems']['Insert']>
        Relationships: any[]
      }
      rubrics: {
        Row: {
          id: string
          problem_id: string
          version: number
          yaml: string
          is_current: boolean
          created_at: string
        }
        Insert: {
          id?: string
          problem_id: string
          version: number
          yaml: string
          is_current?: boolean
          created_at?: string
        }
        Update: Partial<Database['public']['Tables']['rubrics']['Insert']>
        Relationships: any[]
      }
      criteria: {
        Row: {
          id: string
          rubric_id: string
          external_id: string
          title: string
          weight: number
          category: string
          signals: string[]
          anti_signals: string[]
          sort_order: number
        }
        Insert: {
          id?: string
          rubric_id: string
          external_id: string
          title: string
          weight: number
          category: string
          signals?: string[]
          anti_signals?: string[]
          sort_order?: number
        }
        Update: Partial<Database['public']['Tables']['criteria']['Insert']>
        Relationships: any[]
      }
      submissions: {
        Row: {
          id: string
          user_id: string
          problem_id: string
          rubric_id: string
          design_json: Json
          transcript: string
          status: SubmissionStatus
          overall_score: number | null
          overall_summary: string | null
          error_message: string | null
          created_at: string
          graded_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          problem_id: string
          rubric_id: string
          design_json: Json
          transcript?: string
          status?: SubmissionStatus
          overall_score?: number | null
          overall_summary?: string | null
          error_message?: string | null
          created_at?: string
          graded_at?: string | null
        }
        Update: Partial<Database['public']['Tables']['submissions']['Insert']>
        Relationships: any[]
      }
      scores: {
        Row: {
          id: string
          submission_id: string
          criterion_id: string
          score: number
          evidence: string
          suggestion: string
          created_at: string
        }
        Insert: {
          id?: string
          submission_id: string
          criterion_id: string
          score: number
          evidence?: string
          suggestion?: string
          created_at?: string
        }
        Update: Partial<Database['public']['Tables']['scores']['Insert']>
        Relationships: any[]
      }
    }
    Views: {
      latest_attempts: {
        Row: {
          id: string
          user_id: string
          problem_id: string
          status: SubmissionStatus
          overall_score: number | null
          created_at: string
          graded_at: string | null
        }
        Relationships: any[]
      }
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      plan_t: Plan
      difficulty_t: Difficulty
      submission_status_t: SubmissionStatus
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

export type ProblemRow = Database['public']['Tables']['problems']['Row']
export type RubricRow = Database['public']['Tables']['rubrics']['Row']
export type CriterionRow = Database['public']['Tables']['criteria']['Row']
export type SubmissionRow = Database['public']['Tables']['submissions']['Row']
export type ScoreRow = Database['public']['Tables']['scores']['Row']
export type UserRow = Database['public']['Tables']['users']['Row']
