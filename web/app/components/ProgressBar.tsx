import Card from '../ui/Card';

interface ProgressBarProps {
  progress: number;
  currentStep: string;
}

export default function ProgressBar({ progress, currentStep }: ProgressBarProps) {
  return (
    <Card variant="bordered" className="mt-6 p-6 animate-[slideUp_0.4s_ease-out] backdrop-blur-xl bg-green-900/10 border-green-800/30">
      <div className="flex justify-between items-center mb-4">
        <span className="text-sm font-light text-green-200">{currentStep}</span>
        <span className="text-sm font-light text-green-400">{progress}%</span>
      </div>

      <div className="relative h-2 bg-green-950/50 rounded-full overflow-hidden backdrop-blur-sm">
        <div className="absolute inset-0 bg-gradient-to-r from-green-900/20 to-transparent" />
        <div
          className="relative h-full bg-gradient-to-r from-green-500 via-green-400 to-green-500 transition-all duration-500 ease-out rounded-full shadow-lg shadow-green-500/50"
          style={{ width: `${progress}%` }}
        />
      </div>

      <p className="mt-4 text-xs text-green-300 text-center font-light">
        Подготовка → Транскрипция → Суммаризация → PDF
      </p>
    </Card>
  );
}
