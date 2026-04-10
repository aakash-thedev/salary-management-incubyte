import { useState, useEffect, useCallback, useRef } from "react";
import { ArrowRight, X } from "lucide-react";
import { Button } from "@/components/ui/button";

const STORAGE_KEY = "onboarding_complete";

interface Step {
  target: string; // data-onboarding attribute value
  title: string;
  description: string;
  position: "bottom" | "top" | "left" | "right";
}

const steps: Step[] = [
  {
    target: "nav",
    title: "Navigation",
    description:
      "Switch between the Employees dashboard and Salary Insights using these tabs.",
    position: "bottom",
  },
  {
    target: "employee-name",
    title: "Employee Details",
    description:
      "Click on any employee's name to view their detailed profile and salary benchmarks.",
    position: "bottom",
  },
  {
    target: "filters",
    title: "Search & Filter",
    description:
      "Use these controls to search by name, filter by country, or narrow down by employment type.",
    position: "bottom",
  },
  {
    target: "add-employee",
    title: "Add Employee",
    description:
      "Click here to add a new employee record to the system.",
    position: "bottom",
  },
];

export default function OnboardingTooltips() {
  const [currentStep, setCurrentStep] = useState(0);
  const [visible, setVisible] = useState(false);
  const [tooltipStyle, setTooltipStyle] = useState<React.CSSProperties>({});
  const [arrowStyle, setArrowStyle] = useState<React.CSSProperties>({});
  const tooltipRef = useRef<HTMLDivElement>(null);

  const positionTooltip = useCallback(() => {
    const step = steps[currentStep];
    const el = document.querySelector(`[data-onboarding="${step.target}"]`);
    if (!el) return;

    const rect = el.getBoundingClientRect();
    const tooltip = tooltipRef.current;
    const tooltipWidth = tooltip?.offsetWidth || 320;
    const tooltipHeight = tooltip?.offsetHeight || 120;
    const gap = 12;

    let top = 0;
    let left = 0;
    let arrowTop = "";
    let arrowLeft = "";
    let arrowTransform = "";

    switch (step.position) {
      case "bottom":
        top = rect.bottom + gap;
        left = rect.left + rect.width / 2 - tooltipWidth / 2;
        arrowTop = "-6px";
        arrowLeft = "50%";
        arrowTransform = "translateX(-50%) rotate(45deg)";
        break;
      case "top":
        top = rect.top - tooltipHeight - gap;
        left = rect.left + rect.width / 2 - tooltipWidth / 2;
        arrowTop = `${tooltipHeight - 6}px`;
        arrowLeft = "50%";
        arrowTransform = "translateX(-50%) rotate(45deg)";
        break;
      case "right":
        top = rect.top + rect.height / 2 - tooltipHeight / 2;
        left = rect.right + gap;
        arrowTop = "50%";
        arrowLeft = "-6px";
        arrowTransform = "translateY(-50%) rotate(45deg)";
        break;
      case "left":
        top = rect.top + rect.height / 2 - tooltipHeight / 2;
        left = rect.left - tooltipWidth - gap;
        arrowTop = "50%";
        arrowLeft = `${tooltipWidth - 6}px`;
        arrowTransform = "translateY(-50%) rotate(45deg)";
        break;
    }

    // Keep within viewport
    left = Math.max(12, Math.min(left, window.innerWidth - tooltipWidth - 12));
    top = Math.max(12, top);

    setTooltipStyle({ top, left, width: tooltipWidth });
    setArrowStyle({ top: arrowTop, left: arrowLeft, transform: arrowTransform });
  }, [currentStep]);

  // Check if onboarding should show
  useEffect(() => {
    if (localStorage.getItem(STORAGE_KEY)) return;

    // Wait for page content to render
    const timer = setTimeout(() => {
      const firstTarget = document.querySelector(
        `[data-onboarding="${steps[0].target}"]`
      );
      if (firstTarget) setVisible(true);
    }, 800);

    return () => clearTimeout(timer);
  }, []);

  // Position tooltip on step change
  useEffect(() => {
    if (!visible) return;

    // Scroll target into view
    const el = document.querySelector(
      `[data-onboarding="${steps[currentStep].target}"]`
    );
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "nearest" });
      // Reposition after scroll settles
      const timer = setTimeout(positionTooltip, 300);
      return () => clearTimeout(timer);
    }
  }, [currentStep, visible, positionTooltip]);

  // Reposition on resize
  useEffect(() => {
    if (!visible) return;
    window.addEventListener("resize", positionTooltip);
    return () => window.removeEventListener("resize", positionTooltip);
  }, [visible, positionTooltip]);

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep((s) => s + 1);
    }
  };

  const handleFinish = () => {
    localStorage.setItem(STORAGE_KEY, "true");
    setVisible(false);
  };

  if (!visible) return null;

  const step = steps[currentStep];
  const isLast = currentStep === steps.length - 1;

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 z-[100] bg-black/40 transition-opacity" />

      {/* Spotlight on current target */}
      <SpotlightHighlight target={step.target} />

      {/* Tooltip */}
      <div
        ref={tooltipRef}
        style={tooltipStyle}
        className="fixed z-[102] w-80 animate-fade-in-up rounded-xl border bg-card p-4 shadow-2xl"
      >
        {/* Arrow */}
        <div
          style={arrowStyle}
          className="absolute h-3 w-3 border-l border-t bg-card"
        />

        {/* Step indicator */}
        <div className="mb-2 flex items-center justify-between">
          <span className="text-xs font-medium text-muted-foreground">
            {currentStep + 1} of {steps.length}
          </span>
          <button
            onClick={handleFinish}
            className="cursor-pointer rounded-md p-0.5 text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Skip onboarding"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>

        {/* Content */}
        <h3 className="text-sm font-semibold">{step.title}</h3>
        <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
          {step.description}
        </p>

        {/* Actions */}
        <div className="mt-3 flex items-center justify-between">
          {/* Progress dots */}
          <div className="flex gap-1">
            {steps.map((_, i) => (
              <div
                key={i}
                className={`h-1.5 rounded-full transition-all ${
                  i === currentStep
                    ? "w-4 bg-primary"
                    : i < currentStep
                      ? "w-1.5 bg-primary/40"
                      : "w-1.5 bg-muted-foreground/20"
                }`}
              />
            ))}
          </div>

          {isLast ? (
            <Button size="sm" onClick={handleFinish} className="cursor-pointer gap-1.5">
              Got it!
            </Button>
          ) : (
            <Button size="sm" onClick={handleNext} className="cursor-pointer gap-1.5">
              Next
              <ArrowRight className="h-3 w-3" />
            </Button>
          )}
        </div>
      </div>
    </>
  );
}

function SpotlightHighlight({ target }: { target: string }) {
  const [rect, setRect] = useState<DOMRect | null>(null);

  useEffect(() => {
    const el = document.querySelector(`[data-onboarding="${target}"]`);
    if (el) {
      const update = () => setRect(el.getBoundingClientRect());
      update();
      // Re-measure after scroll
      const timer = setTimeout(update, 350);
      return () => clearTimeout(timer);
    }
  }, [target]);

  if (!rect) return null;

  const padding = 6;

  return (
    <div
      className="fixed z-[101] rounded-lg ring-[9999px] ring-black/40"
      style={{
        top: rect.top - padding,
        left: rect.left - padding,
        width: rect.width + padding * 2,
        height: rect.height + padding * 2,
        boxShadow: "0 0 0 4px rgba(var(--primary), 0.2)",
        background: "transparent",
      }}
    />
  );
}
