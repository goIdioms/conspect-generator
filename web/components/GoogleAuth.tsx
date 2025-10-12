'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { AUTH_CONFIG } from '@/app/constants/auth';

interface GoogleUser {
  id: string;
  email: string;
  name: string;
  picture: string;
  verified_email: boolean;
}

interface AuthResponse {
  user: GoogleUser;
  access_token: string;
}

export default function GoogleAuth() {
  const [user, setUser] = useState<GoogleUser | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = () => {
    setLoading(true);
    setError(null);
    window.location.href = AUTH_CONFIG.BACKEND_URL + AUTH_CONFIG.ROUTES.LOGIN;
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem(AUTH_CONFIG.STORAGE_KEYS.USER);
    localStorage.removeItem(AUTH_CONFIG.STORAGE_KEYS.TOKEN);
  };

  useEffect(() => {
    const savedUser = localStorage.getItem(AUTH_CONFIG.STORAGE_KEYS.USER);
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        localStorage.removeItem(AUTH_CONFIG.STORAGE_KEYS.USER);
        localStorage.removeItem(AUTH_CONFIG.STORAGE_KEYS.TOKEN);
      }
    }
  }, []);

  if (user) {
    return (
      <div className="flex items-center gap-4 p-4 bg-white/80 dark:bg-slate-800/80 rounded-lg backdrop-blur-sm shadow-lg">
        <img
          src={user.picture}
          alt={user.name}
          className="w-10 h-10 rounded-full ring-2 ring-blue-500"
        />
        <div className="flex-1">
          <p className="font-semibold text-slate-900 dark:text-white">
            {user.name}
          </p>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            {user.email}
          </p>
        </div>
        <Button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2"
        >
          Выйти
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-4 p-6 bg-white/80 dark:bg-slate-800/80 rounded-lg backdrop-blur-sm shadow-lg">
      <p className="text-slate-700 dark:text-slate-300 text-center">
        Войдите через Google для доступа к сервису
      </p>

      <Button
        onClick={handleLogin}
        disabled={loading}
        className="flex items-center gap-3 bg-white hover:bg-gray-50 text-gray-700 px-6 py-3 rounded-lg shadow-md border border-gray-300 transition-all"
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
        {loading ? 'Загрузка...' : 'Войти через Google'}
      </Button>

      {error && (
        <p className="text-red-500 text-sm mt-2">{error}</p>
      )}
    </div>
  );
}
