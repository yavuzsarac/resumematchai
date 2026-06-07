export interface User {
  id: number;
  name: string;
  email: string;
  created_at: string;
}

export interface UserStats {
  total_completed_analyses: number;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
  user: User;
}

export interface AtsComponent {
  score: number;
  weight: number;
  explanation: string;
  weighted_contribution: number;
}

export interface Feedback {
  summary_feedback: string;
  missing_keywords: string[];
  bullet_point_suggestions: string[];
  action_items: string[];
  recommended_resume_summary: string;
}

export interface Analysis {
  id: number;
  user_id: number;
  resume_filename: string;
  job_description: string;
  resume_skills: string[];
  job_skills: string[];
  matched_skills: string[];
  missing_skills: string[];
  extra_resume_skills: string[];
  skill_match_score: number;
  semantic_similarity_score: number;
  ats_score: number;
  ats_breakdown: Record<string, AtsComponent>;
  ai_feedback: Feedback;
  created_at: string;
}

export interface HistoryItem {
  id: number;
  resume_filename: string;
  ats_score: number;
  skill_match_score: number;
  semantic_similarity_score: number;
  created_at: string;
}

export interface HistoryResponse {
  items: HistoryItem[];
  total: number;
}
