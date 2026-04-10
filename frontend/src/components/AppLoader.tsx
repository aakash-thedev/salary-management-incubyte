import { useEffect, useState } from "react";
import { BarChart3, Users, Database } from "lucide-react";

const steps = [
  { icon: Database, label: "Connecting to database..." },
  { icon: Users, label: "Loading employee records..." },
  { icon: BarChart3, label: "Preparing dashboard..." },
];

interface AppLoaderProps {
  onComplete: () => void;
}

export default function AppLoader({ onComplete }: AppLoaderProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    const stepDuration = 700;

    const timers = steps.map((_, i) =>
      setTimeout(() => setCurrentStep(i), i * stepDuration)
    );

    const fadeTimer = setTimeout(() => setFading(true), steps.length * stepDuration);
    const completeTimer = setTimeout(onComplete, steps.length * stepDuration + 500);

    return () => {
      timers.forEach(clearTimeout);
      clearTimeout(fadeTimer);
      clearTimeout(completeTimer);
    };
  }, [onComplete]);

  const Icon = steps[currentStep].icon;

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-background transition-opacity duration-500 ${
        fading ? "opacity-0" : "opacity-100"
      }`}
    >
      {/* Animated icon */}
      <div className="relative mb-8">
        <div className="absolute inset-0 animate-ping rounded-full bg-primary/10" />
        <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
          <Icon className="h-7 w-7 text-primary animate-pulse" />
        </div>
      </div>

      {/* Step label */}
      <p className="mb-8 text-sm font-medium text-muted-foreground animate-pulse">
        {steps[currentStep].label}
      </p>

      {/* Progress dots */}
      <div className="flex gap-2">
        {steps.map((_, i) => (
          <div
            key={i}
            className={`h-1.5 rounded-full transition-all duration-500 ${
              i <= currentStep
                ? "w-8 bg-primary"
                : "w-1.5 bg-muted-foreground/20"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
