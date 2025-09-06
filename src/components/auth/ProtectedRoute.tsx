import { ReactNode } from 'react';
import { useAuth } from '@/hooks/useAuth';
import LoginForm from './LoginForm';
import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';

interface ProtectedRouteProps {
  children: ReactNode;
  requiredRole?: 'admin' | 'moderator';
}

const ProtectedRoute = ({ children, requiredRole = 'moderator' }: ProtectedRouteProps) => {
  const { user, loading } = useAuth();

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo/10 via-purple-50 to-green/10">
        <Card className="p-8 shadow-xl border-0">
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-admin rounded-2xl flex items-center justify-center mx-auto mb-4">
              <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Загрузка...</h2>
            <p className="text-gray-600">Проверяем доступ к админ-панели</p>
          </div>
        </Card>
      </div>
    );
  }

  // Show login form if not authenticated
  if (!user) {
    return <LoginForm />;
  }

  // Check role permissions
  const hasPermission = () => {
    if (requiredRole === 'admin') {
      return user.role === 'admin';
    }
    if (requiredRole === 'moderator') {
      return user.role === 'admin' || user.role === 'moderator';
    }
    return true;
  };

  // Show access denied if insufficient permissions
  if (!hasPermission()) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo/10 via-purple-50 to-green/10 p-6">
        <Card className="w-full max-w-md p-8 shadow-xl border-0 text-center">
          <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Icon name="ShieldX" className="text-red-600" size={32} />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Доступ запрещен</h2>
          <p className="text-gray-600 mb-4">
            У вас недостаточно прав для доступа к этому разделу.
          </p>
          <p className="text-sm text-gray-500">
            Требуемая роль: <span className="font-medium">{requiredRole}</span>
            <br />
            Ваша роль: <span className="font-medium">{user.role}</span>
          </p>
        </Card>
      </div>
    );
  }

  // Render protected content
  return <>{children}</>;
};

export default ProtectedRoute;