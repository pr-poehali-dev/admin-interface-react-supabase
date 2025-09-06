import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Avatar } from '@/components/ui/avatar';
import Icon from '@/components/ui/icon';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { useAuth } from '@/hooks/useAuth';
import { useDashboardStats, useVideos, useModerationQueue, useModerateVideo, useComments, useUpdateComment } from '@/hooks/useApi';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const { user, signOut } = useAuth();
  
  // Real data from API
  const { data: stats, isLoading: statsLoading } = useDashboardStats();
  const { data: videosData, isLoading: videosLoading } = useVideos({ limit: 8 });
  const { data: moderationData, isLoading: moderationLoading } = useModerationQueue();
  const { data: commentsData, isLoading: commentsLoading } = useComments({ status: 'pending', limit: 10 });
  
  const moderateVideoMutation = useModerateVideo();
  const updateCommentMutation = useUpdateComment();

  // Fallback to mock data if API fails
  const fallbackStats = {
    totalVideos: 12543,
    totalUsers: 8921,
    totalViews: 2456789,
    pendingModeration: 23
  };

  const displayStats = stats || fallbackStats;
  const recentVideos = videosData?.data || [];
  const moderationQueue = moderationData || [];
  const pendingComments = commentsData?.data || [];

  const handleLogout = async () => {
    await signOut();
  };

  const handleVideoModeration = async (videoId: string, action: 'approved' | 'rejected', reason?: string) => {
    if (!user) return;
    
    try {
      await moderateVideoMutation.mutateAsync({
        videoId,
        action,
        reason,
        moderatorId: user.id
      });
    } catch (error) {
      console.error('Ошибка модерации:', error);
    }
  };

  const handleCommentModeration = async (commentId: string, action: 'approved' | 'rejected') => {
    try {
      await updateCommentMutation.mutateAsync({
        id: commentId,
        updates: { status: action }
      });
    } catch (error) {
      console.error('Ошибка модерации комментария:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
      case 'published': return 'bg-green text-white';
      case 'pending': return 'bg-yellow-500 text-white';
      case 'rejected': return 'bg-red text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red text-white';
      case 'medium': return 'bg-yellow-500 text-white';
      case 'low': return 'bg-blue-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <ProtectedRoute requiredRole="moderator">
      <div className="min-h-screen bg-gradient-to-br from-indigo/10 via-purple-50 to-green/10 p-6 font-inter">
        {/* Header */}
        <div className="mb-8 bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-admin rounded-xl flex items-center justify-center">
                <Icon name="Play" className="text-white" size={24} />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">VideoAdmin</h1>
                <p className="text-gray-600">Панель управления видеоплатформой</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">{user?.email}</p>
                <Badge variant="secondary" className="text-xs">
                  {user?.role === 'admin' ? 'Администратор' : 'Модератор'}
                </Badge>
              </div>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                <Icon name="LogOut" size={16} className="mr-2" />
                Выйти
              </Button>
              <Avatar className="w-10 h-10">
                <div className="w-full h-full bg-gradient-card rounded-full flex items-center justify-center text-white font-semibold">
                  {user?.email?.charAt(0).toUpperCase()}
                </div>
              </Avatar>
            </div>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-8 bg-white rounded-xl shadow-lg p-2">
            <TabsTrigger value="dashboard" className="rounded-lg">
              <Icon name="BarChart3" size={18} className="mr-2" />
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="videos" className="rounded-lg">
              <Icon name="Video" size={18} className="mr-2" />
              Видео
            </TabsTrigger>
            <TabsTrigger value="moderation" className="rounded-lg">
              <Icon name="Shield" size={18} className="mr-2" />
              Модерация
            </TabsTrigger>
            <TabsTrigger value="comments" className="rounded-lg">
              <Icon name="MessageSquare" size={18} className="mr-2" />
              Комментарии
            </TabsTrigger>
          </TabsList>

          {/* Dashboard Tab */}
          <TabsContent value="dashboard" className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="p-6 bg-gradient-to-br from-blue-500 to-purple-600 text-white border-0 shadow-xl">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-100 text-sm">Всего видео</p>
                    <p className="text-3xl font-bold">
                      {statsLoading ? '...' : displayStats.totalVideos.toLocaleString()}
                    </p>
                  </div>
                  <Icon name="Video" size={32} className="text-blue-200" />
                </div>
              </Card>
              
              <Card className="p-6 bg-gradient-to-br from-green-500 to-emerald-600 text-white border-0 shadow-xl">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-100 text-sm">Пользователи</p>
                    <p className="text-3xl font-bold">
                      {statsLoading ? '...' : displayStats.totalUsers.toLocaleString()}
                    </p>
                  </div>
                  <Icon name="Users" size={32} className="text-green-200" />
                </div>
              </Card>
              
              <Card className="p-6 bg-gradient-to-br from-orange-500 to-red-500 text-white border-0 shadow-xl">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-orange-100 text-sm">Просмотры</p>
                    <p className="text-3xl font-bold">
                      {statsLoading ? '...' : displayStats.totalViews.toLocaleString()}
                    </p>
                  </div>
                  <Icon name="Eye" size={32} className="text-orange-200" />
                </div>
              </Card>
              
              <Card className="p-6 bg-gradient-to-br from-purple-500 to-pink-600 text-white border-0 shadow-xl">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-purple-100 text-sm">На модерации</p>
                    <p className="text-3xl font-bold">
                      {statsLoading ? '...' : displayStats.pendingModeration}
                    </p>
                  </div>
                  <Icon name="Clock" size={32} className="text-purple-200" />
                </div>
              </Card>
            </div>

            {/* Recent Videos */}
            <Card className="p-6 shadow-xl border-0">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-gray-900">Последние видео</h3>
                <Button variant="outline" size="sm">
                  <Icon name="Plus" size={16} className="mr-2" />
                  Добавить видео
                </Button>
              </div>
              
              {videosLoading ? (
                <div className="space-y-4">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-xl animate-pulse">
                      <div className="w-16 h-12 bg-gray-300 rounded-lg"></div>
                      <div className="flex-1">
                        <div className="h-4 bg-gray-300 rounded mb-2 w-3/4"></div>
                        <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                      </div>
                      <div className="w-20 h-6 bg-gray-200 rounded"></div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {recentVideos.map((video) => (
                    <div key={video.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                      <div className="flex items-center space-x-4">
                        <div className="w-16 h-12 bg-gradient-card rounded-lg flex items-center justify-center">
                          <Icon name="Play" className="text-white" size={16} />
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900">{video.title}</h4>
                          <p className="text-sm text-gray-600">
                            {video.user?.username || 'Неизвестный автор'} • {video.views?.toLocaleString() || 0} просмотров
                            {video.created_at && ` • ${formatDate(video.created_at)}`}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Badge className={getStatusColor(video.status)}>
                          {video.status === 'published' ? 'Опубликовано' : 
                           video.status === 'pending' ? 'На рассмотрении' : 'Отклонено'}
                        </Badge>
                        <Button variant="ghost" size="sm">
                          <Icon name="MoreHorizontal" size={16} />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </TabsContent>

          {/* Videos Tab */}
          <TabsContent value="videos" className="space-y-6">
            <Card className="p-6 shadow-xl border-0">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-gray-900">Управление видео</h3>
                <div className="flex space-x-3">
                  <Button variant="outline" size="sm">
                    <Icon name="Filter" size={16} className="mr-2" />
                    Фильтры
                  </Button>
                  <Button className="bg-gradient-admin text-white" size="sm">
                    <Icon name="Upload" size={16} className="mr-2" />
                    Загрузить
                  </Button>
                </div>
              </div>
              
              {videosLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[...Array(6)].map((_, i) => (
                    <Card key={i} className="overflow-hidden animate-pulse">
                      <div className="h-48 bg-gray-300"></div>
                      <div className="p-4">
                        <div className="h-4 bg-gray-300 rounded mb-2"></div>
                        <div className="h-3 bg-gray-200 rounded mb-3"></div>
                        <div className="flex justify-between">
                          <div className="w-16 h-6 bg-gray-200 rounded"></div>
                          <div className="w-8 h-6 bg-gray-200 rounded"></div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {recentVideos.map((video) => (
                    <Card key={video.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                      <div className="h-48 bg-gradient-card flex items-center justify-center">
                        <Icon name="Play" className="text-white" size={48} />
                      </div>
                      <div className="p-4">
                        <h4 className="font-medium text-gray-900 mb-2">{video.title}</h4>
                        <p className="text-sm text-gray-600 mb-3">{video.user?.username || 'Неизвестный автор'}</p>
                        <div className="flex items-center justify-between">
                          <Badge className={getStatusColor(video.status)} variant="secondary">
                            {video.status === 'published' ? 'Опубликовано' : 
                             video.status === 'pending' ? 'На рассмотрении' : 'Отклонено'}
                          </Badge>
                          <Button variant="ghost" size="sm">
                            <Icon name="Edit" size={16} />
                          </Button>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </Card>
          </TabsContent>

          {/* Moderation Tab */}
          <TabsContent value="moderation" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Moderation Queue */}
              <Card className="p-6 shadow-xl border-0">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-semibold text-gray-900">Очередь модерации</h3>
                  <Badge className="bg-red text-white">
                    {moderationLoading ? '...' : `${moderationQueue.length} в очереди`}
                  </Badge>
                </div>
                
                {moderationLoading ? (
                  <div className="space-y-4">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="p-4 bg-gray-50 rounded-xl animate-pulse">
                        <div className="h-4 bg-gray-300 rounded mb-2 w-3/4"></div>
                        <div className="h-3 bg-gray-200 rounded mb-3 w-1/2"></div>
                        <div className="flex space-x-2">
                          <div className="w-16 h-8 bg-gray-200 rounded"></div>
                          <div className="w-16 h-8 bg-gray-200 rounded"></div>
                          <div className="w-16 h-8 bg-gray-200 rounded"></div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {moderationQueue.map((video) => (
                      <div key={video.id} className="p-4 bg-gray-50 rounded-xl">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900">{video.title}</h4>
                            <p className="text-sm text-gray-600">
                              {video.user?.username || 'Неизвестный автор'} • {formatDate(video.created_at)}
                            </p>
                          </div>
                          <Badge className="bg-yellow-500 text-white">
                            Ожидает
                          </Badge>
                        </div>
                        <div className="flex space-x-2">
                          <Button 
                            size="sm" 
                            className="bg-green text-white"
                            onClick={() => handleVideoModeration(video.id, 'approved')}
                            disabled={moderateVideoMutation.isPending}
                          >
                            <Icon name="Check" size={16} className="mr-1" />
                            Одобрить
                          </Button>
                          <Button 
                            size="sm" 
                            variant="destructive"
                            onClick={() => handleVideoModeration(video.id, 'rejected', 'Нарушение правил')}
                            disabled={moderateVideoMutation.isPending}
                          >
                            <Icon name="X" size={16} className="mr-1" />
                            Отклонить
                          </Button>
                          <Button size="sm" variant="outline">
                            <Icon name="Eye" size={16} className="mr-1" />
                            Просмотр
                          </Button>
                        </div>
                      </div>
                    ))}
                    {moderationQueue.length === 0 && (
                      <div className="text-center py-8 text-gray-500">
                        <Icon name="CheckCircle" size={48} className="mx-auto mb-2 text-green-500" />
                        <p>Очередь модерации пуста!</p>
                      </div>
                    )}
                  </div>
                )}
              </Card>

              {/* Moderation Settings */}
              <Card className="p-6 shadow-xl border-0">
                <h3 className="text-xl font-semibold text-gray-900 mb-6">Настройки модерации</h3>
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Автоматическая модерация</h4>
                      <p className="text-sm text-gray-600">Включить ИИ-анализ контента</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Проверка на дубликаты</h4>
                      <p className="text-sm text-gray-600">Автоматически находить похожий контент</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Возрастные ограничения</h4>
                      <p className="text-sm text-gray-600">Проверять контент на соответствие возрасту</p>
                    </div>
                    <Switch />
                  </div>

                  <div className="space-y-3">
                    <h4 className="font-medium">Критерии качества</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm">Качество видео</span>
                        <span className="text-sm font-medium">720p+</span>
                      </div>
                      <Progress value={85} className="h-2" />
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm">Качество звука</span>
                        <span className="text-sm font-medium">Хорошее</span>
                      </div>
                      <Progress value={70} className="h-2" />
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </TabsContent>

          {/* Comments Tab */}
          <TabsContent value="comments" className="space-y-6">
            <Card className="p-6 shadow-xl border-0">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-gray-900">Модерация комментариев</h3>
                <Badge className="bg-yellow-500 text-white">
                  {commentsLoading ? '...' : `${pendingComments.length} ожидают`}
                </Badge>
              </div>
              
              {commentsLoading ? (
                <div className="space-y-4">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="p-4 bg-gray-50 rounded-xl animate-pulse">
                      <div className="flex items-start space-x-3 mb-3">
                        <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
                        <div className="flex-1">
                          <div className="h-3 bg-gray-300 rounded mb-1 w-1/4"></div>
                          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <div className="w-16 h-8 bg-gray-200 rounded"></div>
                        <div className="w-16 h-8 bg-gray-200 rounded"></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {pendingComments.map((comment) => (
                    <div key={comment.id} className="p-4 bg-gray-50 rounded-xl">
                      <div className="flex items-start space-x-3 mb-3">
                        <Avatar className="w-8 h-8">
                          <div className="w-full h-full bg-gradient-card rounded-full flex items-center justify-center text-white text-sm font-semibold">
                            {comment.user?.username?.charAt(0).toUpperCase() || 'U'}
                          </div>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <span className="text-sm font-medium">{comment.user?.username || 'Анонимный пользователь'}</span>
                            <span className="text-xs text-gray-500">
                              к видео "{comment.video?.title || 'Неизвестное видео'}"
                            </span>
                          </div>
                          <p className="text-sm text-gray-700">{comment.content}</p>
                          <p className="text-xs text-gray-500 mt-1">{formatDate(comment.created_at)}</p>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button 
                          size="sm" 
                          className="bg-green text-white"
                          onClick={() => handleCommentModeration(comment.id, 'approved')}
                          disabled={updateCommentMutation.isPending}
                        >
                          <Icon name="Check" size={16} className="mr-1" />
                          Одобрить
                        </Button>
                        <Button 
                          size="sm" 
                          variant="destructive"
                          onClick={() => handleCommentModeration(comment.id, 'rejected')}
                          disabled={updateCommentMutation.isPending}
                        >
                          <Icon name="X" size={16} className="mr-1" />
                          Отклонить
                        </Button>
                      </div>
                    </div>
                  ))}
                  {pendingComments.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      <Icon name="MessageSquare" size={48} className="mx-auto mb-2 text-green-500" />
                      <p>Нет комментариев на модерации!</p>
                    </div>
                  )}
                </div>
              )}
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </ProtectedRoute>
  );
};

export default AdminDashboard;