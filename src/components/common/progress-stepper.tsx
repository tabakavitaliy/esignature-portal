'use client';

import type { ReactNode } from 'react';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ProgressStepperProps {
  stepCount: number;
  currentStep: number;
  className?: string;
}

/**
 * ProgressStepper component displays a horizontal stepper with completed, current, and upcoming steps
 * @param stepCount - Total number of steps (required)
 * @param currentStep - Current active step (1-indexed, required)
 * @param className - Additional CSS classes for the stepper container
 * @returns ReactNode
 */
export function ProgressStepper({
  stepCount,
  currentStep,
  className,
}: ProgressStepperProps): ReactNode {
  const steps = Array.from({ length: stepCount }, (_, i) => i + 1);

  const getStepStatus = (step: number): 'completed' | 'current' | 'upcoming' => {
    if (step < currentStep) return 'completed';
    if (step === currentStep) return 'current';
    return 'upcoming';
  };

  return (
    <nav
      aria-label="Progress"
      className={cn('w-full', className)}
    >
      <ol className="flex items-center justify-between">
        {steps.map((step, index) => {
          const status = getStepStatus(step);
          const isLast = index === steps.length - 1;

          return (
            <li
              key={step}
              className="flex items-center flex-1 last:flex-none"
              aria-current={status === 'current' ? 'step' : undefined}
            >
              <div className="flex items-center">
                {/* Step Circle */}
                <div
                  className={cn(
                    'relative flex items-center justify-center rounded-full transition-all duration-200',
                    'w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16',
                    {
                      'bg-stepper-complete': status === 'completed',
                      'bg-stepper-current': status === 'current',
                      'bg-stepper-upcoming border-2 border-stepper-upcoming-border': status === 'upcoming',
                    }
                  )}
                  role="img"
                  aria-label={
                    status === 'completed'
                      ? `Step ${step} completed`
                      : status === 'current'
                        ? `Step ${step} current`
                        : `Step ${step} upcoming`
                  }
                >
                  {status === 'completed' && (
                    <Check
                      className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-stepper-complete-foreground"
                      aria-hidden="true"
                    />
                  )}
                </div>

                {/* Connector Line */}
                {!isLast && (
                  <div
                    className="h-0.5 bg-stepper-line flex-1 mx-2 sm:mx-3 md:mx-4"
                    aria-hidden="true"
                  />
                )}
              </div>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
