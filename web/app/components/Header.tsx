import GoogleAuth from './GoogleAuth';

export default function Header() {
  return (
    <div className="mb-12 animate-[fadeIn_0.6s_ease-out]">
      <div className="text-center mb-8">
        <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Audio → PDF
        </h1>
        <p className="text-slate-600 dark:text-slate-400 text-lg">
          Транскрипция и суммаризация в один клик
        </p>
      </div>

      <GoogleAuth />
    </div>
  );
}
