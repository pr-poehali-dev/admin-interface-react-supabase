import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Avatar } from '@/components/ui/avatar';
import Icon from '@/components/ui/icon';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  
  // Mock data
  const stats = {
    totalVideos: 12543,
    totalUsers: 8921,
    totalViews: 2456789,
    pendingModeration: 23
  };

  const recentVideos = [
    { id: 1, title: "Как программировать на React", author: "Алексей Петров", status: "approved", views: 15420, duration: "12:34" },
    { id: 2, title: "Введение в TypeScript", author: "Мария Иванова", status: "pending", views: 8543, duration: "18:25" },
    { id: 3, title: "CSS Grid Layout", author: "Дмитрий Сидоров", status: "rejected", views: 2341, duration: "9:15" },
    { id: 4, title: "Node.js для начинающих", author: "Елена Козлова", status: "approved", views: 23876, duration: "25:41" }
  ];

  const moderationQueue = [
    { id: 1, title: "Обзор новых технологий", author: "Игорь Смирнов", uploadedAt: "2 часа назад", priority: "high" },
    { id: 2, title: "Туториал по Vue.js", author: "Анна Волкова", uploadedAt: "4 часа назад", priority: "medium" },
    { id: 3, title: "Базы данных MongoDB", author: "Сергей Белов", uploadedAt: "6 часов назад", priority: "low" }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green text-white';
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

  return (
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
            <Button variant="outline" size="sm" className="flex items-center space-x-2">
              <Icon name="Bell" size={16} />
              <span>Уведомления</span>
              <Badge className="bg-red text-white text-xs">3</Badge>
            </Button>
            <Avatar className="w-10 h-10">
              <div className="w-full h-full bg-gradient-card rounded-full flex items-center justify-center text-white font-semibold">
                АП
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
          <TabsTrigger value="analytics" className="rounded-lg">
            <Icon name="TrendingUp" size={18} className="mr-2" />
            Аналитика
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
                  <p className="text-3xl font-bold">{stats.totalVideos.toLocaleString()}</p>
                </div>
                <Icon name="Video" size={32} className="text-blue-200" />
              </div>
            </Card>
            
            <Card className="p-6 bg-gradient-to-br from-green-500 to-emerald-600 text-white border-0 shadow-xl">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm">Пользователи</p>
                  <p className="text-3xl font-bold">{stats.totalUsers.toLocaleString()}</p>
                </div>
                <Icon name="Users" size={32} className="text-green-200" />
              </div>
            </Card>
            
            <Card className="p-6 bg-gradient-to-br from-orange-500 to-red-500 text-white border-0 shadow-xl">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-100 text-sm">Просмотры</p>
                  <p className="text-3xl font-bold">{stats.totalViews.toLocaleString()}</p>
                </div>
                <Icon name="Eye" size={32} className="text-orange-200" />
              </div>
            </Card>
            
            <Card className="p-6 bg-gradient-to-br from-purple-500 to-pink-600 text-white border-0 shadow-xl">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm">На модерации</p>
                  <p className="text-3xl font-bold">{stats.pendingModeration}</p>
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
                        {video.author} • {video.views.toLocaleString()} просмотров • {video.duration}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Badge className={getStatusColor(video.status)}>
                      {video.status === 'approved' ? 'Одобрено' : 
                       video.status === 'pending' ? 'На рассмотрении' : 'Отклонено'}
                    </Badge>
                    <Button variant="ghost" size="sm">
                      <Icon name="MoreHorizontal" size={16} />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
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
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recentVideos.map((video) => (
                <Card key={video.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="h-48 bg-gradient-card flex items-center justify-center">
                    <Icon name="Play" className="text-white" size={48} />
                  </div>
                  <div className="p-4">
                    <h4 className="font-medium text-gray-900 mb-2">{video.title}</h4>
                    <p className="text-sm text-gray-600 mb-3">{video.author}</p>
                    <div className="flex items-center justify-between">
                      <Badge className={getStatusColor(video.status)} variant="secondary">
                        {video.status === 'approved' ? 'Одобрено' : 
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
                  {moderationQueue.length} в очереди
                </Badge>
              </div>
              <div className="space-y-4">
                {moderationQueue.map((item) => (
                  <div key={item.id} className="p-4 bg-gray-50 rounded-xl">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">{item.title}</h4>
                        <p className="text-sm text-gray-600">{item.author} • {item.uploadedAt}</p>
                      </div>
                      <Badge className={getPriorityColor(item.priority)}>
                        {item.priority === 'high' ? 'Высокий' : 
                         item.priority === 'medium' ? 'Средний' : 'Низкий'}
                      </Badge>
                    </div>
                    <div className="flex space-x-2">
                      <Button size="sm" className="bg-green text-white">
                        <Icon name="Check" size={16} className="mr-1" />
                        Одобрить
                      </Button>
                      <Button size="sm" variant="destructive">
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
              </div>
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

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Chart */}
            <Card className="lg:col-span-2 p-6 shadow-xl border-0">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">Статистика просмотров</h3>
              <div className="h-64 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl flex items-center justify-center">
                <div className="text-center">
                  <Icon name="BarChart3" size={48} className="text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">График аналитики</p>
                  <p className="text-sm text-gray-500">Данные за последние 30 дней</p>
                </div>
              </div>
            </Card>

            {/* Side Stats */}
            <div className="space-y-6">
              <Card className="p-6 shadow-xl border-0">
                <h4 className="font-semibold text-gray-900 mb-4">Топ категории</h4>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Программирование</span>
                    <span className="text-sm font-medium">45%</span>
                  </div>
                  <Progress value={45} className="h-2" />
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Дизайн</span>
                    <span className="text-sm font-medium">30%</span>
                  </div>
                  <Progress value={30} className="h-2" />
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Маркетинг</span>
                    <span className="text-sm font-medium">25%</span>
                  </div>
                  <Progress value={25} className="h-2" />
                </div>
              </Card>

              <Card className="p-6 shadow-xl border-0">
                <h4 className="font-semibold text-gray-900 mb-4">Активность сегодня</h4>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-green rounded-full"></div>
                    <span className="text-sm">132 новых просмотра</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span className="text-sm">28 новых пользователей</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                    <span className="text-sm">5 видео загружено</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-red rounded-full"></div>
                    <span className="text-sm">2 жалобы получено</span>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminDashboard;