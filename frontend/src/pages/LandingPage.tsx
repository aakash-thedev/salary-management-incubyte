import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Users, BarChart3, Globe, Shield } from "lucide-react";

const features = [
  {
    icon: Users,
    title: "Employee Management",
    description: "Full CRUD operations for 10,000+ employee records with smart filtering",
  },
  {
    icon: BarChart3,
    title: "Salary Insights",
    description: "Real-time analytics with breakdowns by role, department, and type",
  },
  {
    icon: Globe,
    title: "Multi-Currency",
    description: "Local currency support across 12 countries with realistic benchmarks",
  },
  {
    icon: Shield,
    title: "Data Integrity",
    description: "PostgreSQL-backed with validations, constraints, and full test coverage",
  },
];

export default function LandingPage() {
  const navigate = useNavigate();
  const [exiting, setExiting] = useState(false);

  const handleEnter = () => {
    setExiting(true);
    setTimeout(() => {
      sessionStorage.setItem("visited", "true");
      navigate("/employees");
    }, 600);
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col bg-background transition-all duration-600 ease-out ${
        exiting ? "opacity-0 scale-105" : "opacity-100 scale-100"
      }`}
    >
      {/* Subtle gradient background */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-1/2 left-1/2 h-[800px] w-[800px] -translate-x-1/2 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute -bottom-1/2 right-0 h-[600px] w-[600px] rounded-full bg-primary/3 blur-3xl" />
      </div>

      {/* Main content */}
      <div className="relative flex flex-1 flex-col items-center justify-center px-6">
        {/* Incubyte badge */}
        <div className="animate-fade-in-up mb-8 flex items-center gap-2.5 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5">
          <div className="flex h-5 w-5 items-center justify-center rounded bg-primary">
            <span className="text-[10px] font-bold text-primary-foreground">i</span>
          </div>
          <span className="text-sm font-medium tracking-wide text-primary">
            incubyte
          </span>
        </div>

        {/* Title */}
        <h1 className="animate-fade-in-up animation-delay-100 max-w-3xl text-center text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
          Salary Management{" "}
          <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Platform
          </span>
        </h1>

        {/* Subtitle */}
        <p className="animate-fade-in-up animation-delay-200 mt-5 max-w-xl text-center text-lg text-muted-foreground sm:text-xl">
          A comprehensive tool to manage employee records, analyze salary
          distributions, and gain workforce insights across global teams.
        </p>

        {/* CTA */}
        <button
          onClick={handleEnter}
          disabled={exiting}
          className="animate-fade-in-up animation-delay-300 group mt-10 flex cursor-pointer items-center gap-2 rounded-xl bg-primary px-8 py-3.5 text-base font-semibold text-primary-foreground shadow-lg shadow-primary/25 transition-all hover:gap-3 hover:shadow-xl hover:shadow-primary/30 active:scale-[0.98] disabled:pointer-events-none"
        >
          Get Started
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
        </button>

        {/* Feature cards */}
        <div className="animate-fade-in-up animation-delay-400 mt-16 grid max-w-3xl grid-cols-2 gap-4 sm:grid-cols-4">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.title}
                className="flex flex-col items-center gap-2 rounded-xl border bg-card/50 p-4 text-center backdrop-blur-sm"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
                  <Icon className="h-4 w-4 text-primary" />
                </div>
                <h3 className="text-sm font-semibold">{feature.title}</h3>
                <p className="text-xs leading-relaxed text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer */}
      <div className="animate-fade-in-up animation-delay-500 pb-6 text-center">
        <p className="text-xs text-muted-foreground/50">
          Built with Rails API + React + PostgreSQL
        </p>
      </div>
    </div>
  );
}
