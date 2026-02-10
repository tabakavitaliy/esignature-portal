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
      className={cn('w-full max-w-[240px]', className)}
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
              <div className="flex w-full items-center">
                {/* Step Circle */}
                <div
                  className={cn(
                    'relative flex shrink-0 items-center justify-center rounded-full transition-all duration-200',
                    'h-4 w-4',
                    {
                      'bg-stepper-complete': status === 'completed',
                      'bg-stepper-current': status === 'current',
                      'bg-stepper-upcoming border border-stepper-upcoming-border': status === 'upcoming',
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
                      className="h-2.5 w-2.5 text-stepper-complete-foreground"
                      aria-hidden="true"
                    />
                  )}
                </div>

                {/* Connector Line */}
                {!isLast && (
                  <div
                    className="h-0.5 flex-1 bg-stepper-line opacity-25"
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
