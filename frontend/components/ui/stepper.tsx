import * as React from "react"
import { cn } from "@/lib/utils"

import { Check } from "lucide-react"

interface StepperProps {
  currentStep: number
  steps: string[]
  children: React.ReactNode
  className?: string
}

export function Stepper({ currentStep, steps, children, className }: StepperProps) {
  return (
    <div className={cn("space-y-6", className)}>
      { }
      <div className="flex items-center justify-between mb-8">
        {steps.map((step, index) => {
          const stepNumber = index + 1
          const isCompleted = stepNumber < currentStep
          const isCurrent = stepNumber === currentStep

          return (
            <React.Fragment key={index}>
              <div className="flex flex-col items-center flex-1">
                <div
                  className={cn(
                    "flex items-center justify-center w-10 h-10 rounded-full border-2 transition-colors",
                    isCompleted && "bg-primary border-primary text-primary-foreground",
                    isCurrent && "border-primary bg-primary text-primary-foreground",
                    !isCompleted && !isCurrent && "border-muted-foreground/50 bg-background"
                  )}
                >
                  {isCompleted ? (
                    <Check className="h-5 w-5" />
                  ) : (
                    <span className="font-semibold">{stepNumber}</span>
                  )}
                </div>
                <span className={cn(
                  "mt-2 text-sm font-medium",
                  isCurrent && "text-primary",
                  !isCurrent && "text-muted-foreground"
                )}>
                  {step}
                </span>
              </div>
              {index < steps.length - 1 && (
                <div
                  className={cn(
                    "flex-1 h-0.5 mx-4 transition-colors",
                    stepNumber < currentStep ? "bg-primary" : "bg-muted"
                  )}
                />
              )}
            </React.Fragment>
          )
        })}
      </div>

      { }
      <div>
        {children}
      </div>
    </div>
  )
}

