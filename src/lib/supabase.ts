import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://your-project.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types
export interface User {
  id: string;
  email: string;
  username: string;
  avatar_url?: string;
  role: 'admin' | 'moderator' | 'user';
  created_at: string;
  updated_at: string;
}

export interface Video {
  id: string;
  title: string;
  description?: string;
  url: string;
  thumbnail_url?: string;
  duration?: number;
  views: number;
  likes: number;
  dislikes: number;
  status: 'published' | 'pending' | 'rejected' | 'draft';
  created_at: string;
  updated_at: string;
  user_id: string;
  category_id?: string;
  user?: User;
  category?: Category;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  color?: string;
  created_at: string;
  updated_at: string;
}

export interface Comment {
  id: string;
  content: string;
  video_id: string;
  user_id: string;
  parent_id?: string;
  status: 'approved' | 'pending' | 'rejected';
  created_at: string;
  updated_at: string;
  user?: User;
  video?: Video;
}

export interface Analytics {
  id: string;
  video_id: string;
  views: number;
  date: string;
  user_id?: string;
}

export interface ModerationLog {
  id: string;
  video_id: string;
  moderator_id: string;
  action: 'approved' | 'rejected' | 'flagged';
  reason?: string;
  created_at: string;
  moderator?: User;
  video?: Video;
}

// Auth types
export type AuthUser = {
  id: string;
  email: string;
  role: string;
  user_metadata: {
    username?: string;
    avatar_url?: string;
  };
};

// API response types
export type ApiResponse<T> = {
  data: T;
  error: null;
} | {
  data: null;
  error: string;
};

export type PaginatedResponse<T> = {
  data: T[];
  count: number;
  page: number;
  limit: number;
  hasMore: boolean;
};