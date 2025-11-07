import React from "react";

interface Step {
    id: string;
    name: string;
}

interface StepperProps {
    steps: Step[];
    currentStep: number;
    setCurrentStep: (step: number) => void;
}

export const Stepper: React.FC<StepperProps> = ({ steps, currentStep, setCurrentStep }) => {
  return (
    <nav aria-label="Progress">
      <ol role="list" className="space-y-4 md:flex md:space-y-0 md:space-x-8">
        {steps.map((step, index) => (
          <li key={step.name} className="md:flex-1">
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                setCurrentStep(index);
              }}
              className={`group flex flex-col border-l-4 py-2 pl-4 transition-colors md:border-l-0 md:border-t-4 md:pl-0 md:pt-4 md:pb-0 ${
                currentStep === index
                  ? "border-indigo-600"
                  : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-500"
              }`}
            >
              <span
                className={`text-sm font-medium transition-colors ${
                  currentStep === index
                    ? "text-indigo-600"
                    : "text-gray-500 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-200"
                }`}
              >
                {step.id}
              </span>
              <span className="text-sm font-medium">{step.name}</span>
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
};
