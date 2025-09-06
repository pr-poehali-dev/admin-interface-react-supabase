import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase, type Video, type User, type Comment, type Category, type ModerationLog } from '@/lib/supabase';

// Videos API
export const useVideos = (filters?: { status?: string; category?: string; page?: number; limit?: number }) => {
  return useQuery({
    queryKey: ['videos', filters],
    queryFn: async () => {
      let query = supabase
        .from('videos')
        .select(`
          *,
          user:users(*),
          category:categories(*)
        `)
        .order('created_at', { ascending: false });

      if (filters?.status) {
        query = query.eq('status', filters.status);
      }
      if (filters?.category) {
        query = query.eq('category_id', filters.category);
      }
      if (filters?.page && filters?.limit) {
        const from = (filters.page - 1) * filters.limit;
        const to = from + filters.limit - 1;
        query = query.range(from, to);
      }

      const { data, error, count } = await query;
      if (error) throw error;
      
      return {
        data: data as Video[],
        count: count || 0,
        page: filters?.page || 1,
        limit: filters?.limit || 10,
        hasMore: data ? data.length === (filters?.limit || 10) : false
      };
    },
  });
};

export const useUpdateVideo = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<Video> }) => {
      const { data, error } = await supabase
        .from('videos')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['videos'] });
    },
  });
};

export const useDeleteVideo = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('videos')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['videos'] });
    },
  });
};

// Users API
export const useUsers = (page = 1, limit = 10) => {
  return useQuery({
    queryKey: ['users', page, limit],
    queryFn: async () => {
      const from = (page - 1) * limit;
      const to = from + limit - 1;
      
      const { data, error, count } = await supabase
        .from('users')
        .select('*', { count: 'exact' })
        .order('created_at', { ascending: false })
        .range(from, to);

      if (error) throw error;
      
      return {
        data: data as User[],
        count: count || 0,
        page,
        limit,
        hasMore: data ? data.length === limit : false
      };
    },
  });
};

export const useUpdateUser = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<User> }) => {
      const { data, error } = await supabase
        .from('users')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
};

// Comments API
export const useComments = (filters?: { status?: string; video_id?: string; page?: number; limit?: number }) => {
  return useQuery({
    queryKey: ['comments', filters],
    queryFn: async () => {
      let query = supabase
        .from('comments')
        .select(`
          *,
          user:users(*),
          video:videos(title)
        `)
        .order('created_at', { ascending: false });

      if (filters?.status) {
        query = query.eq('status', filters.status);
      }
      if (filters?.video_id) {
        query = query.eq('video_id', filters.video_id);
      }
      if (filters?.page && filters?.limit) {
        const from = (filters.page - 1) * filters.limit;
        const to = from + filters.limit - 1;
        query = query.range(from, to);
      }

      const { data, error, count } = await query;
      if (error) throw error;
      
      return {
        data: data as Comment[],
        count: count || 0,
        page: filters?.page || 1,
        limit: filters?.limit || 10,
        hasMore: data ? data.length === (filters?.limit || 10) : false
      };
    },
  });
};

export const useUpdateComment = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<Comment> }) => {
      const { data, error } = await supabase
        .from('comments')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments'] });
    },
  });
};

// Categories API
export const useCategories = () => {
  return useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('name');

      if (error) throw error;
      return data as Category[];
    },
  });
};

export const useCreateCategory = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (category: Omit<Category, 'id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from('categories')
        .insert(category)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    },
  });
};

// Analytics API
export const useAnalytics = (dateRange?: { from: string; to: string }) => {
  return useQuery({
    queryKey: ['analytics', dateRange],
    queryFn: async () => {
      let query = supabase
        .from('analytics')
        .select('*')
        .order('date', { ascending: false });

      if (dateRange) {
        query = query.gte('date', dateRange.from).lte('date', dateRange.to);
      }

      const { data, error } = await query;
      if (error) throw error;
      
      return data;
    },
  });
};

export const useDashboardStats = () => {
  return useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: async () => {
      // Get total videos
      const { count: videosCount } = await supabase
        .from('videos')
        .select('*', { count: 'exact', head: true });

      // Get total users
      const { count: usersCount } = await supabase
        .from('users')
        .select('*', { count: 'exact', head: true });

      // Get pending moderation count
      const { count: pendingCount } = await supabase
        .from('videos')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'pending');

      // Get total views (mock data for now)
      const totalViews = 2456789;

      return {
        totalVideos: videosCount || 0,
        totalUsers: usersCount || 0,
        totalViews,
        pendingModeration: pendingCount || 0
      };
    },
  });
};

// Moderation API
export const useModerationQueue = () => {
  return useQuery({
    queryKey: ['moderation-queue'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('videos')
        .select(`
          *,
          user:users(username, avatar_url)
        `)
        .eq('status', 'pending')
        .order('created_at', { ascending: true });

      if (error) throw error;
      return data as Video[];
    },
  });
};

export const useModerateVideo = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ 
      videoId, 
      action, 
      reason, 
      moderatorId 
    }: { 
      videoId: string; 
      action: 'approved' | 'rejected'; 
      reason?: string;
      moderatorId: string;
    }) => {
      // Update video status
      const { error: videoError } = await supabase
        .from('videos')
        .update({ status: action === 'approved' ? 'published' : 'rejected' })
        .eq('id', videoId);

      if (videoError) throw videoError;

      // Log moderation action
      const { error: logError } = await supabase
        .from('moderation_logs')
        .insert({
          video_id: videoId,
          moderator_id: moderatorId,
          action,
          reason
        });

      if (logError) throw logError;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['moderation-queue'] });
      queryClient.invalidateQueries({ queryKey: ['videos'] });
    },
  });
};