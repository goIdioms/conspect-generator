'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { AUTH_CONFIG } from '@/app/constants/auth';

export default function Register() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleGoogleRegister = () => {
    setLoading(true);
    window.location.href = AUTH_CONFIG.BACKEND_URL + AUTH_CONFIG.ROUTES.LOGIN;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert('Пароли не совпадают');
      return;
    }
    // Registration logic here
  };

  return (
    <div className="min-h-screen bg-background relative flex items-center justify-center">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
      </div>

      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-48 w-96 h-96 bg-primary/3 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 -right-48 w-96 h-96 bg-primary/3 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
      </div>

      <div className="relative z-10 w-full max-w-md mx-auto px-6">
        <Card className="bg-card/50 backdrop-blur-xl border-primary/20">
          <CardHeader className="space-y-4 text-center pb-8">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center relative">
                <span className="text-primary-foreground font-display font-bold text-2xl">C</span>
                <div className="absolute inset-0 bg-primary/20 rounded-2xl blur-xl"></div>
              </div>
            </div>

            <CardTitle className="text-4xl font-display font-bold tracking-tight">
              Регистрация
            </CardTitle>
            <CardDescription className="text-lg font-light">
              Создайте аккаунт, чтобы начать работу
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            <Button
              onClick={handleGoogleRegister}
              disabled={loading}
              className="w-full h-12 bg-white hover:bg-gray-100 text-gray-800 font-medium flex items-center justify-center gap-3 transition-all duration-300 hover:scale-[1.02]"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              {loading ? 'Загрузка...' : 'Регистрация через Google'}
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-card text-muted-foreground font-light">
                  или используйте email
                </span>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-light text-foreground">
                  Имя
                </label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Ваше имя"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="h-12 bg-input border-border focus:border-primary transition-colors"
                  required
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-light text-foreground">
                  Email
                </label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-12 bg-input border-border focus:border-primary transition-colors"
                  required
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-light text-foreground">
                  Пароль
                </label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-12 bg-input border-border focus:border-primary transition-colors"
                  required
                  minLength={8}
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="confirmPassword" className="text-sm font-light text-foreground">
                  Подтвердите пароль
                </label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="h-12 bg-input border-border focus:border-primary transition-colors"
                  required
                  minLength={8}
                />
              </div>

              <Button
                type="submit"
                className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-medium transition-all duration-300 hover:scale-[1.02] relative group overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <span className="relative z-10">Зарегистрироваться</span>
              </Button>
            </form>

            <div className="text-center pt-4">
              <div className="flex items-center justify-center gap-2 text-sm font-light">
                <span className="text-muted-foreground">Уже есть аккаунт?</span>
                <button
                  onClick={() => router.push('/login')}
                  className="text-primary hover:underline font-medium"
                >
                  Войти
                </button>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="mt-8 text-center">
          <p className="text-sm text-muted-foreground font-light">
            Регистрируясь, вы соглашаетесь с нашими
            <button className="text-primary hover:underline ml-1">
              условиями использования
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
