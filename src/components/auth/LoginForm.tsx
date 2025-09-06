import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAuth } from '@/hooks/useAuth';
import Icon from '@/components/ui/icon';

const loginSchema = z.object({
  email: z.string().email('Некорректный email адрес'),
  password: z.string().min(6, 'Пароль должен содержать минимум 6 символов'),
});

type LoginFormData = z.infer<typeof loginSchema>;

const LoginForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isResetMode, setIsResetMode] = useState(false);
  const { signIn, resetPassword } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    setError(null);

    try {
      if (isResetMode) {
        const { error } = await resetPassword(data.email);
        if (error) {
          setError(error.message);
        } else {
          setError(null);
          alert('Инструкции по восстановлению пароля отправлены на ваш email');
          setIsResetMode(false);
          reset();
        }
      } else {
        const { error } = await signIn(data.email, data.password);
        if (error) {
          setError('Неверный email или пароль');
        }
      }
    } catch (err) {
      setError('Произошла ошибка при входе в систему');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo/10 via-purple-50 to-green/10 p-6">
      <Card className="w-full max-w-md shadow-xl border-0">
        <CardHeader className="text-center">
          <div className="w-16 h-16 bg-gradient-admin rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Icon name="Shield" className="text-white" size={32} />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900">
            {isResetMode ? 'Восстановить пароль' : 'Вход в админ-панель'}
          </CardTitle>
          <CardDescription className="text-gray-600">
            {isResetMode
              ? 'Введите email для восстановления пароля'
              : 'Войдите в свою учетную запись администратора'
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {error && (
              <Alert className="border-red-200 bg-red-50">
                <Icon name="AlertCircle" className="text-red-600" size={16} />
                <AlertDescription className="text-red-600">
                  {error}
                </AlertDescription>
              </Alert>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@example.com"
                {...register('email')}
                disabled={isLoading}
                className="h-11"
              />
              {errors.email && (
                <p className="text-sm text-red-600">{errors.email.message}</p>
              )}
            </div>

            {!isResetMode && (
              <div className="space-y-2">
                <Label htmlFor="password">Пароль</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  {...register('password')}
                  disabled={isLoading}
                  className="h-11"
                />
                {errors.password && (
                  <p className="text-sm text-red-600">{errors.password.message}</p>
                )}
              </div>
            )}

            <Button
              type="submit"
              className="w-full h-11 bg-gradient-admin text-white hover:opacity-90 transition-opacity"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Обработка...</span>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <Icon name={isResetMode ? "Mail" : "LogIn"} size={16} />
                  <span>{isResetMode ? 'Отправить инструкции' : 'Войти'}</span>
                </div>
              )}
            </Button>

            <div className="text-center">
              <Button
                type="button"
                variant="link"
                onClick={() => {
                  setIsResetMode(!isResetMode);
                  setError(null);
                  reset();
                }}
                className="text-sm text-gray-600 hover:text-gray-900"
              >
                {isResetMode ? 'Вернуться к входу' : 'Забыли пароль?'}
              </Button>
            </div>
          </form>

          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="text-center">
              <p className="text-xs text-gray-500 mb-2">Демо-доступ:</p>
              <div className="text-xs text-gray-600 space-y-1">
                <p><strong>Email:</strong> admin@demo.com</p>
                <p><strong>Пароль:</strong> demo123</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginForm;