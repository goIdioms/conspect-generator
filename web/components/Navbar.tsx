'use client';

import { useRouter, usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { AUTH_CONFIG } from '@/app/constants/auth';

interface GoogleUser {
  id: string;
  email: string;
  name: string;
  picture: string;
  verified_email: boolean;
}

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<GoogleUser | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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

  const handleLogin = () => {
    window.location.href = AUTH_CONFIG.BACKEND_URL + AUTH_CONFIG.ROUTES.LOGIN;
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem(AUTH_CONFIG.STORAGE_KEYS.USER);
    localStorage.removeItem(AUTH_CONFIG.STORAGE_KEYS.TOKEN);
    router.push('/');
  };

  const navItems = [
    { label: 'Главная', path: '/' },
    { label: 'Audio → PDF', path: '/audio-to-pdf' },
    { label: 'Конспект по теме', path: '/topic-to-pdf' },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black border-b border-green-900">
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          <div
            onClick={() => router.push('/')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-8 h-8 bg-green-500 rounded flex items-center justify-center group-hover:scale-105 transition-transform">
              <span className="text-black font-medium text-lg">C</span>
            </div>
            <span className="text-xl font-display font-light text-white tracking-wider">
              CONSPECT
            </span>
          </div>

          <div className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <button
                key={item.path}
                onClick={() => router.push(item.path)}
                className={`text-sm font-light transition-colors ${
                  pathname === item.path
                    ? 'text-green-400'
                    : 'text-green-200 hover:text-green-400'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-4">
            {user ? (
              <div className="flex items-center gap-3">
                <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-green-900/30 rounded border border-green-800">
                  <img
                    src={user.picture}
                    alt={user.name}
                    className="w-7 h-7 rounded-full"
                  />
                  <span className="text-sm font-light text-green-200">
                    {user.name}
                  </span>
                </div>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 rounded bg-green-900/30 border border-green-700 text-green-300 hover:bg-green-800/30 font-light transition-all"
                >
                  Выйти
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
              <button
                onClick={() => router.push('/login')}
                className="px-6 py-2 rounded bg-green-900/30 border border-green-700 text-green-300 hover:bg-green-800/30 font-light transition-all"
              >
                Войти
              </button>
              <button
                onClick={() => router.push('/register')}
                className="px-6 py-2 rounded bg-green-500 text-black hover:bg-green-400 font-light transition-all"
              >
                Регистрация
              </button>
              </div>
            )}

            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 hover:bg-green-900/20 text-green-200"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>

        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-green-900">
            {navItems.map((item) => (
              <button
                key={item.path}
                onClick={() => {
                  router.push(item.path);
                  setIsMenuOpen(false);
                }}
                className={`block w-full text-left px-4 py-3 font-light transition-colors ${
                  pathname === item.path
                    ? 'text-green-400'
                    : 'text-green-200 hover:text-green-400'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
}
