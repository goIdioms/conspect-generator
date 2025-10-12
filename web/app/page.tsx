'use client';

import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function Home() {
  const router = useRouter();

  const features = [
    {
      title: 'Audio → PDF',
      description: 'Преобразуйте аудиозаписи лекций в структурированные конспекты с помощью продвинутого ИИ',
      available: true,
      path: '/audio-to-pdf',
      gradient: 'from-primary/20 via-primary/10 to-transparent'
    },
    {
      title: 'Конспект по теме',
      description: 'Автоматический поиск и создание подробного конспекта по любой заданной теме',
      available: false,
      path: '/topic-to-pdf',
      gradient: 'from-accent/20 via-accent/10 to-transparent'
    },
  ];

  return (
    <div className="min-h-screen bg-background relative">
      {/* Sophisticated background grid */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent"></div>
      </div>

      {/* Floating orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-48 w-96 h-96 bg-primary/3 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 -right-48 w-96 h-96 bg-primary/3 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
      </div>

      <Navbar />

      <main className="relative z-10">
        {/* Hero Section */}
        <section className="container mx-auto px-6 pt-40 pb-32 text-center">
          <div className="max-w-6xl mx-auto">
            {/* Main heading with sophisticated typography */}
            <div className="relative mb-16">
              <h1 className="text-8xl md:text-9xl lg:text-[12rem] font-display font-black tracking-tighter text-foreground mb-4 leading-none">
                CONSPECT
              </h1>
              <div className="relative -mt-8 mb-8">
                <h2 className="text-4xl md:text-6xl lg:text-7xl font-display font-thin tracking-widest text-primary/80 uppercase">
                  Generator
                </h2>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/20 to-transparent blur-xl"></div>
              </div>
            </div>

            {/* Subtitle */}
            <p className="text-xl md:text-2xl lg:text-3xl text-muted-foreground font-light leading-relaxed max-w-4xl mx-auto mb-16">
              Революционная платформа для создания
              <span className="font-semibold text-foreground"> интеллектуальных конспектов </span>
              из аудио и текстовых материалов
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <Button
                onClick={() => router.push('/audio-to-pdf')}
                size="lg"
                className="group px-12 py-6 text-xl font-bold bg-primary hover:bg-primary/90 text-primary-foreground shadow-2xl hover:shadow-primary/25 transition-all duration-500 transform hover:scale-105 relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <span className="relative z-10">Начать работу</span>
              </Button>

              <Button
                variant="outline"
                size="lg"
                onClick={() => {
                  document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="px-12 py-6 text-xl font-semibold border-2 hover:bg-primary hover:text-primary-foreground transition-all duration-300"
              >
                Узнать больше
              </Button>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="container mx-auto px-6 py-32">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-20">
              <h2 className="text-5xl md:text-7xl font-display font-bold text-foreground mb-6 tracking-tight">
                Возможности
              </h2>
              <p className="text-xl md:text-2xl text-muted-foreground font-light max-w-3xl mx-auto leading-relaxed">
                Мощные инструменты для создания идеальных конспектов с использованием искусственного интеллекта
              </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-12">
              {features.map((feature, index) => (
                <Card
                  key={index}
                  className={`group relative overflow-hidden border-border/50 hover:border-primary/50 transition-all duration-700 hover:scale-[1.02] ${
                    !feature.available ? 'opacity-60' : ''
                  }`}
                >
                  {/* Gradient background */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-700`}></div>

                  {/* Coming soon badge */}
                  {!feature.available && (
                    <div className="absolute top-6 right-6 z-10">
                      <Badge variant="secondary" className="font-medium">
                        Скоро
                      </Badge>
                    </div>
                  )}

                  <CardHeader className="pb-8 relative z-10">
                    {/* Abstract geometric shape instead of emoji */}
                    <div className="w-20 h-20 mb-8 relative">
                      <div className="absolute inset-0 bg-primary/10 rounded-2xl rotate-12 group-hover:rotate-45 transition-transform duration-700"></div>
                      <div className="absolute inset-2 bg-primary/20 rounded-xl -rotate-12 group-hover:rotate-0 transition-transform duration-700"></div>
                      <div className="absolute inset-4 bg-primary/30 rounded-lg rotate-6 group-hover:-rotate-12 transition-transform duration-700"></div>
                    </div>

                    <CardTitle className="text-3xl md:text-4xl font-display font-bold mb-4 group-hover:text-primary transition-colors duration-500">
                      {feature.title}
                    </CardTitle>
                    <CardDescription className="text-lg leading-relaxed font-light">
                      {feature.description}
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="relative z-10">
                    {feature.available ? (
                      <Button
                        onClick={() => router.push(feature.path)}
                        className="w-full font-semibold text-lg py-6 group-hover:shadow-lg transition-all duration-300"
                      >
                        Попробовать
                      </Button>
                    ) : (
                      <Button
                        disabled
                        variant="secondary"
                        className="w-full font-medium text-lg py-6"
                      >
                        В разработке
                      </Button>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* How it Works Section */}
        <section className="container mx-auto px-6 py-32 relative">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-20">
              <h2 className="text-5xl md:text-7xl font-display font-bold text-foreground mb-6 tracking-tight">
                Как это работает
              </h2>
              <p className="text-xl md:text-2xl text-muted-foreground font-light max-w-3xl mx-auto">
                Простой процесс из трех этапов для получения профессионального результата
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-12">
              {[
                {
                  step: "01",
                  title: "Загрузка",
                  subtitle: "Материала",
                  description: "Загрузите аудиофайл лекции или введите интересующую вас тему для исследования"
                },
                {
                  step: "02",
                  title: "Обработка",
                  subtitle: "Искусственным интеллектом",
                  description: "Наш ИИ анализирует контент, выделяет ключевые моменты и структурирует информацию"
                },
                {
                  step: "03",
                  title: "Результат",
                  subtitle: "Готовый PDF",
                  description: "Получите красиво оформленный конспект с четкой структурой и выводами"
                }
              ].map((item, index) => (
                <div
                  key={index}
                  className="group text-center relative"
                  style={{animationDelay: `${index * 0.2}s`}}
                >
                  {/* Step number with modern design */}
                  <div className="relative mb-8">
                    <div className="text-8xl md:text-9xl font-display font-black text-primary/10 leading-none">
                      {item.step}
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center group-hover:rotate-12 transition-transform duration-500">
                        <div className="w-8 h-8 bg-primary-foreground rounded-lg"></div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-2xl md:text-3xl font-display font-bold text-foreground">
                      {item.title}
                    </h3>
                    <h4 className="text-lg md:text-xl font-display font-light text-primary">
                      {item.subtitle}
                    </h4>
                    <p className="text-muted-foreground leading-relaxed font-light max-w-sm mx-auto">
                      {item.description}
                    </p>
                  </div>

                  {/* Connecting line for desktop */}
                  {index < 2 && (
                    <div className="hidden md:block absolute top-20 -right-6 w-12 h-px bg-gradient-to-r from-primary/50 to-transparent"></div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="container mx-auto px-6 py-32">
          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-3 gap-12 text-center">
              <div className="group">
                <div className="text-5xl md:text-6xl font-display font-black text-primary mb-4">
                  99%
                </div>
                <h3 className="text-xl font-display font-semibold text-foreground mb-2">
                  Точность
                </h3>
                <p className="text-muted-foreground font-light">
                  Высокое качество транскрипции и анализа
                </p>
              </div>

              <div className="group">
                <div className="text-5xl md:text-6xl font-display font-black text-primary mb-4">
                  &lt;5
                </div>
                <h3 className="text-xl font-display font-semibold text-foreground mb-2">
                  Минут
                </h3>
                <p className="text-muted-foreground font-light">
                  Среднее время обработки файла
                </p>
              </div>

              <div className="group">
                <div className="text-5xl md:text-6xl font-display font-black text-primary mb-4">
                  24/7
                </div>
                <h3 className="text-xl font-display font-semibold text-foreground mb-2">
                  Доступность
                </h3>
                <p className="text-muted-foreground font-light">
                  Работает круглосуточно без выходных
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="container mx-auto px-6 py-32">
          <div className="max-w-4xl mx-auto text-center relative">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5 rounded-3xl blur-3xl"></div>

            <Card className="relative bg-card/50 backdrop-blur-xl border-primary/20">
              <CardContent className="py-16 px-8">
                <h2 className="text-4xl md:text-6xl font-display font-bold text-foreground mb-8 tracking-tight">
                  Готовы к
                  <span className="block text-primary font-black">революции?</span>
                </h2>

                <p className="text-xl md:text-2xl text-muted-foreground font-light mb-12 max-w-2xl mx-auto leading-relaxed">
                  Присоединяйтесь к тысячам пользователей, которые уже создают
                  <span className="font-semibold text-foreground"> идеальные конспекты </span>
                  за считанные минуты
                </p>

                <div className="flex flex-col sm:flex-row gap-6 justify-center">
                  <Button
                    onClick={() => router.push('/audio-to-pdf')}
                    size="lg"
                    className="px-12 py-6 text-xl font-bold shadow-2xl hover:shadow-primary/30 transition-all duration-500 transform hover:scale-105 relative group overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    <span className="relative z-10">Начать бесплатно</span>
                  </Button>

                  <Button
                    variant="outline"
                    size="lg"
                    className="px-12 py-6 text-xl font-semibold border-2 transition-all duration-300"
                  >
                    Смотреть демо
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-border bg-card/30 backdrop-blur-sm">
          <div className="container mx-auto px-6 py-16">
            <div className="flex flex-col md:flex-row justify-between items-center gap-8">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
                  <span className="text-primary-foreground font-display font-bold text-lg">C</span>
                </div>
                <span className="text-xl font-display font-medium text-foreground tracking-wider">
                  CONSPECT
                </span>
              </div>

              <div className="text-center md:text-right">
                <p className="text-muted-foreground font-light mb-2">
                  © 2025 CONSPECT Generator
                </p>
                <p className="text-sm text-muted-foreground/60 font-light">
                  Создавайте конспекты с помощью ИИ
                </p>
              </div>
            </div>
      </div>
        </footer>
      </main>
    </div>
  );
}