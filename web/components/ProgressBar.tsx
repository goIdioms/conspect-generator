import { Card, CardContent } from '@/components/ui/card';

interface ProgressBarProps {
  progress: number;
  currentStep: string;
}

export default function ProgressBar({ progress, currentStep }: ProgressBarProps) {
  const steps = ['Подготовка', 'Транскрипция', 'Суммаризация', 'PDF'];
  const currentStepIndex = steps.indexOf(currentStep);

  return (
    <Card className="mt-8 relative overflow-hidden">
      <CardContent className="py-8">
        {/* Progress header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h3 className="text-xl font-display font-bold text-foreground">
              {currentStep}
            </h3>
            <p className="text-sm text-muted-foreground font-light">
              Обработка в процессе...
            </p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-display font-black text-primary">
              {progress}%
            </div>
            <p className="text-xs text-muted-foreground font-light">
              завершено
            </p>
          </div>
        </div>

        {/* Modern progress bar */}
        <div className="relative h-3 bg-secondary rounded-full overflow-hidden mb-8">
          <div className="absolute inset-0 bg-gradient-to-r from-muted/20 to-transparent"></div>
          <div
            className="relative h-full bg-gradient-to-r from-primary via-primary to-primary transition-all duration-1000 ease-out rounded-full shadow-lg shadow-primary/50"
            style={{ width: `${progress}%` }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent rounded-full"></div>
          </div>
        </div>

        {/* Steps indicator */}
        <div className="flex justify-between items-center">
          {steps.map((step, index) => (
            <div key={step} className="flex flex-col items-center gap-2">
              <div className={`w-3 h-3 rounded-full transition-all duration-500 ${
                index <= currentStepIndex
                  ? 'bg-primary shadow-lg shadow-primary/50'
                  : 'bg-muted border-2 border-border'
              }`}></div>
              <span className={`text-xs font-medium transition-colors duration-500 ${
                index <= currentStepIndex ? 'text-primary' : 'text-muted-foreground'
              }`}>
                {step}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}