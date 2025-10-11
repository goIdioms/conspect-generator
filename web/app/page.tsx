'use client';

import { useRouter } from 'next/navigation';
import Navbar from './components/Navbar';
import { Button } from './ui';

export default function Home() {
  const router = useRouter();

  const features = [
    {
      title: 'Audio → PDF',
      description: 'Преобразуйте аудиозаписи лекций в структурированные конспекты',
      icon: '🎙️',
      available: true,
      path: '/audio-to-pdf',
      example: 'Загрузите аудио → Получите красивый PDF с конспектом',
    },
    {
      title: 'Конспект по теме',
      description: 'Автоматический поиск и создание конспекта по любой теме',
      icon: '🔍',
      available: false,
      path: '/topic-to-pdf',
      example: 'Введите тему → AI найдёт материалы → Создаст конспект',
    },
  ];

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-48 w-96 h-96 bg-green-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/3 -right-48 w-96 h-96 bg-green-600/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
        <div className="absolute bottom-1/4 left-1/2 w-96 h-96 bg-green-400/5 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
      </div>

      <Navbar />
      <div className="container mx-auto px-4 pt-24 pb-8 relative z-10">

        <section className="text-center mb-20 animate-[fadeIn_0.6s_ease-out]">
          <h1 className="text-6xl md:text-8xl font-display font-light mb-6 text-white tracking-wider relative">
            <span className="relative inline-block">
              CONSPECT
              <div className="absolute -inset-1 bg-gradient-to-r from-green-500/20 to-transparent blur-2xl opacity-50"></div>
            </span>
          </h1>
          <h2 className="text-2xl md:text-4xl font-display font-thin mb-6 text-transparent bg-clip-text bg-gradient-to-r from-green-400 via-green-300 to-green-500 tracking-wide">
            Generator
          </h2>
          <p className="text-xl md:text-2xl text-green-200 mb-8 max-w-3xl mx-auto font-light">
            Автоматическое создание структурированных конспектов из аудио и текста
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Button
              onClick={() => router.push('/audio-to-pdf')}
              className="bg-green-500 hover:bg-green-400 text-black px-8 py-4 text-lg font-light"
            >
              Начать работу
            </Button>
            <Button
              onClick={() => {
                document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="bg-black border border-green-500 text-green-400 hover:bg-green-500 hover:text-black px-8 py-4 text-lg font-light"
            >
              Узнать больше
            </Button>
          </div>
        </section>

        <section id="features" className="mb-20">
          <h2 className="text-4xl font-display font-light text-center mb-12 text-white tracking-wide">
            Возможности сервиса
          </h2>
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {features.map((feature, index) => (
              <div
                key={index}
                className={`relative rounded-xl p-8 bg-green-900/10 border border-green-900/30 hover:border-green-500/50 transition-all duration-500 group/card backdrop-blur-sm overflow-hidden ${
                  !feature.available ? 'opacity-75' : ''
                }`}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity duration-500"></div>
                {!feature.available && (
                  <div className="absolute top-4 right-4 bg-green-800 text-green-200 px-3 py-1 rounded text-sm font-light">
                    Скоро
                  </div>
                )}
                <div className="text-6xl mb-4 relative z-10 group-hover/card:animate-bounce">{feature.icon}</div>
                <h3 className="text-2xl font-display font-light mb-3 text-white relative z-10">
                  {feature.title}
                </h3>
                <p className="text-green-200 mb-4 font-light relative z-10">
                  {feature.description}
                </p>
                <div className="bg-green-900/20 border border-green-800 rounded p-4 mb-4 relative z-10 backdrop-blur-sm">
                  <p className="text-sm text-green-300 font-light">
                    📝 {feature.example}
                  </p>
                </div>
                {feature.available ? (
                  <Button
                    onClick={() => router.push(feature.path)}
                    className="w-full bg-green-500 hover:bg-green-400 text-black font-light relative z-10"
                  >
                    Попробовать
                  </Button>
                ) : (
                  <Button
                    disabled
                    className="w-full bg-green-900/30 text-green-300 cursor-not-allowed font-light relative z-10"
                  >
                    В разработке
                  </Button>
                )}
              </div>
            ))}
          </div>
        </section>

        <section className="mb-20 max-w-4xl mx-auto">
          <h2 className="text-4xl font-display font-light text-center mb-12 text-white tracking-wide">
            Как это работает
          </h2>
          <div className="space-y-8">
            <div className="flex gap-6 items-start animate-[slideUp_0.5s_ease-out]">
              <div className="flex-shrink-0 w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-black font-light text-xl">
                1
              </div>
              <div>
                <h3 className="text-xl font-light mb-2 text-white">
                  Загрузите материал
                </h3>
                <p className="text-green-200 font-light">
                  Загрузите аудиофайл лекции или введите тему для исследования
                </p>
              </div>
            </div>

            <div className="flex gap-6 items-start animate-[slideUp_0.6s_ease-out]">
              <div className="flex-shrink-0 w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-black font-light text-xl">
                2
              </div>
              <div>
                <h3 className="text-xl font-light mb-2 text-white">
                  AI обработает данные
                </h3>
                <p className="text-green-200 font-light">
                  Искусственный интеллект транскрибирует аудио, найдёт релевантные материалы и создаст структурированный конспект
                </p>
              </div>
            </div>

            <div className="flex gap-6 items-start animate-[slideUp_0.7s_ease-out]">
              <div className="flex-shrink-0 w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-black font-light text-xl">
                3
              </div>
              <div>
                <h3 className="text-xl font-light mb-2 text-white">
                  Получите PDF
                </h3>
                <p className="text-green-200 font-light">
                  Скачайте красиво оформленный конспект в формате PDF, готовый к использованию
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="text-center py-16 px-6 bg-green-900/10 border border-green-500 rounded mb-12">
          <h2 className="text-3xl md:text-4xl font-display font-light text-white mb-6 tracking-wide">
            Готовы начать?
          </h2>
          <p className="text-lg md:text-xl text-green-200 mb-8 max-w-2xl mx-auto font-light">
            Создавайте профессиональные конспекты за минуты, а не часы
          </p>
          <Button
            onClick={() => router.push('/audio-to-pdf')}
            className="bg-green-500 hover:bg-green-400 text-black px-8 py-4 text-lg font-light"
          >
            Попробовать бесплатно
          </Button>
        </section>

        <footer className="text-center py-8 text-green-300 font-light">
          <p>© 2025 Conspect Generator. Все права защищены.</p>
        </footer>
      </div>
    </div>
  );
}
