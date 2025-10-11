'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AUTH_CONFIG } from '../../constants/auth';

export default function GoogleCallback() {
  const router = useRouter();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const urlParams = new URLSearchParams(window.location.search);
        const errorParam = urlParams.get('error');
        const userParam = urlParams.get('user');
        const tokenParam = urlParams.get('token');

        if (errorParam) {
          setStatus('error');
          setError(decodeURIComponent(errorParam));
          setTimeout(() => router.push(AUTH_CONFIG.ROUTES.HOME), AUTH_CONFIG.TIMEOUTS.ERROR_REDIRECT);
          return;
        }

        if (!userParam || !tokenParam) {
          setStatus('error');
          setError('Не получены данные пользователя');
          setTimeout(() => router.push(AUTH_CONFIG.ROUTES.HOME), AUTH_CONFIG.TIMEOUTS.ERROR_REDIRECT);
          return;
        }

        try {
          const userData = JSON.parse(decodeURIComponent(userParam));

          localStorage.setItem(AUTH_CONFIG.STORAGE_KEYS.USER, JSON.stringify(userData));
          localStorage.setItem(AUTH_CONFIG.STORAGE_KEYS.TOKEN, decodeURIComponent(tokenParam));

          setStatus('success');

          setTimeout(() => {
            router.push(AUTH_CONFIG.ROUTES.HOME);
          }, AUTH_CONFIG.TIMEOUTS.SUCCESS_REDIRECT);

        } catch (parseError) {
          setStatus('error');
          setError('Ошибка обработки данных пользователя: ' + (parseError instanceof Error ? parseError.message : String(parseError)));
          setTimeout(() => router.push(AUTH_CONFIG.ROUTES.HOME), AUTH_CONFIG.TIMEOUTS.ERROR_REDIRECT);
        }

      } catch (err) {
        setStatus('error');
        setError('Произошла ошибка при авторизации: ' + (err instanceof Error ? err.message : String(err)));
        setTimeout(() => router.push(AUTH_CONFIG.ROUTES.HOME), AUTH_CONFIG.TIMEOUTS.ERROR_REDIRECT);
      }
    };

    handleCallback();
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-black">
      <div className="text-center">
        {status === 'loading' && (
          <div className="animate-pulse">
            <div className="w-16 h-16 mx-auto mb-4 border-4 border-green-500 border-t-transparent rounded-full animate-spin" />
            <p className="text-green-200 text-xl font-light">
              Обработка авторизации...
            </p>
          </div>
        )}

        {status === 'success' && (
          <div className="animate-[fadeIn_0.5s_ease-out]">
            <div className="w-16 h-16 mx-auto mb-4 bg-green-500 rounded-full flex items-center justify-center">
              <svg className="w-10 h-10 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <p className="text-green-400 text-xl font-light">
              Успешно авторизованы!
            </p>
            <p className="text-green-200 mt-2 font-light">
              Перенаправление на главную страницу...
            </p>
          </div>
        )}

        {status === 'error' && (
          <div className="animate-[fadeIn_0.5s_ease-out]">
            <div className="w-16 h-16 mx-auto mb-4 bg-red-600 rounded-full flex items-center justify-center">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <p className="text-red-400 text-xl font-light">
              Ошибка авторизации
            </p>
            <p className="text-green-200 mt-2 font-light">
              {error}
            </p>
            <p className="text-green-300 text-sm mt-4 font-light">
              Перенаправление на главную страницу...
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
