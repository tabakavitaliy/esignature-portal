import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { ProgressStepper } from './progress-stepper';

describe('ProgressStepper', () => {
  it('renders without crashing', () => {
    render(<ProgressStepper stepCount={4} currentStep={1} />);
    const nav = screen.getByRole('navigation', { name: 'Progress' });
    expect(nav).toBeInTheDocument();
  });

  it('renders correct number of steps', () => {
    render(<ProgressStepper stepCount={4} currentStep={2} />);
    const steps = screen.getAllByRole('img');
    expect(steps).toHaveLength(4);
  });

  it('shows checkmarks for completed steps', () => {
    render(<ProgressStepper stepCount={4} currentStep={3} />);
    
    const completedStep1 = screen.getByLabelText('Step 1 completed');
    expect(completedStep1).toBeInTheDocument();
    
    const completedStep2 = screen.getByLabelText('Step 2 completed');
    expect(completedStep2).toBeInTheDocument();
  });

  it('highlights current step correctly', () => {
    render(<ProgressStepper stepCount={4} currentStep={2} />);
    
    const currentStep = screen.getByLabelText('Step 2 current');
    expect(currentStep).toBeInTheDocument();
    expect(currentStep).toHaveClass('bg-stepper-current');
  });

  it('applies correct styling for upcoming steps', () => {
    render(<ProgressStepper stepCount={4} currentStep={2} />);
    
    const upcomingStep3 = screen.getByLabelText('Step 3 upcoming');
    expect(upcomingStep3).toBeInTheDocument();
    expect(upcomingStep3).toHaveClass('bg-stepper-upcoming');
    expect(upcomingStep3).toHaveClass('border');
    expect(upcomingStep3).toHaveClass('border-stepper-upcoming-border');
    
    const upcomingStep4 = screen.getByLabelText('Step 4 upcoming');
    expect(upcomingStep4).toBeInTheDocument();
  });

  it('has proper accessibility attributes for current step', () => {
    render(<ProgressStepper stepCount={4} currentStep={2} />);
    
    const listItems = screen.getAllByRole('listitem');
    expect(listItems[1]).toHaveAttribute('aria-current', 'step');
  });

  it('does not have aria-current for non-current steps', () => {
    render(<ProgressStepper stepCount={4} currentStep={2} />);
    
    const listItems = screen.getAllByRole('listitem');
    expect(listItems[0]).not.toHaveAttribute('aria-current');
    expect(listItems[2]).not.toHaveAttribute('aria-current');
    expect(listItems[3]).not.toHaveAttribute('aria-current');
  });

  it('handles first step as current', () => {
    render(<ProgressStepper stepCount={4} currentStep={1} />);
    
    const currentStep = screen.getByLabelText('Step 1 current');
    expect(currentStep).toBeInTheDocument();
    
    const upcomingSteps = screen.getAllByLabelText(/upcoming/);
    expect(upcomingSteps).toHaveLength(3);
  });

  it('handles last step as current', () => {
    render(<ProgressStepper stepCount={4} currentStep={4} />);
    
    const currentStep = screen.getByLabelText('Step 4 current');
    expect(currentStep).toBeInTheDocument();
    
    const completedSteps = screen.getAllByLabelText(/completed/);
    expect(completedSteps).toHaveLength(3);
  });

  it('applies custom className', () => {
    render(<ProgressStepper stepCount={4} currentStep={2} className="custom-stepper-class" />);
    const nav = screen.getByRole('navigation');
    expect(nav).toHaveClass('custom-stepper-class');
  });

  it('renders with single step', () => {
    render(<ProgressStepper stepCount={1} currentStep={1} />);
    const steps = screen.getAllByRole('img');
    expect(steps).toHaveLength(1);
    
    const currentStep = screen.getByLabelText('Step 1 current');
    expect(currentStep).toBeInTheDocument();
  });

  it('renders with many steps', () => {
    render(<ProgressStepper stepCount={10} currentStep={5} />);
    const steps = screen.getAllByRole('img');
    expect(steps).toHaveLength(10);
    
    const completedSteps = screen.getAllByLabelText(/completed/);
    expect(completedSteps).toHaveLength(4);
    
    const currentStep = screen.getByLabelText('Step 5 current');
    expect(currentStep).toBeInTheDocument();
    
    const upcomingSteps = screen.getAllByLabelText(/upcoming/);
    expect(upcomingSteps).toHaveLength(5);
  });

  it('has proper role for navigation', () => {
    render(<ProgressStepper stepCount={4} currentStep={2} />);
    const nav = screen.getByRole('navigation', { name: 'Progress' });
    expect(nav).toBeInTheDocument();
  });

  it('uses ordered list for steps', () => {
    render(<ProgressStepper stepCount={4} currentStep={2} />);
    const list = screen.getByRole('list');
    expect(list).toBeInTheDocument();
    expect(list.tagName).toBe('OL');
  });

  it('applies completed styling to steps before current', () => {
    render(<ProgressStepper stepCount={5} currentStep={3} />);
    
    const step1 = screen.getByLabelText('Step 1 completed');
    expect(step1).toHaveClass('bg-stepper-complete');
    
    const step2 = screen.getByLabelText('Step 2 completed');
    expect(step2).toHaveClass('bg-stepper-complete');
  });

  it('does not show checkmark for current step', () => {
    render(<ProgressStepper stepCount={4} currentStep={2} />);
    
    const currentStep = screen.getByLabelText('Step 2 current');
    expect(currentStep).toBeInTheDocument();
    
    // Current step should not have a checkmark
    const checkmarks = currentStep.querySelectorAll('svg');
    expect(checkmarks).toHaveLength(0);
  });

  it('does not show checkmark for upcoming steps', () => {
    render(<ProgressStepper stepCount={4} currentStep={2} />);
    
    const upcomingStep = screen.getByLabelText('Step 3 upcoming');
    expect(upcomingStep).toBeInTheDocument();
    
    // Upcoming step should not have a checkmark
    const checkmarks = upcomingStep.querySelectorAll('svg');
    expect(checkmarks).toHaveLength(0);
  });

  it('step circles are 16px (w-4 h-4)', () => {
    render(<ProgressStepper stepCount={4} currentStep={2} />);
    const steps = screen.getAllByRole('img');
    for (const step of steps) {
      expect(step).toHaveClass('h-4', 'w-4');
    }
  });

  it('renders connector lines between steps', () => {
    const { container } = render(<ProgressStepper stepCount={4} currentStep={1} />);
    const lines = container.querySelectorAll('.bg-stepper-line');
    expect(lines).toHaveLength(3);
    for (const line of lines) {
      expect(line).toHaveClass('flex-1');
    }
  });
});
