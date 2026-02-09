import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import userEvent from '@testing-library/user-event';
import { ConfirmName } from './confirm-name';
import translations from '@/i18n/en.json';

describe('ConfirmName', () => {
  const { confirmNamePage: t } = translations;

  it('renders without crashing', () => {
    render(<ConfirmName />);
    const heading = screen.getByRole('heading', { name: t.headerText });
    expect(heading).toBeInTheDocument();
  });

  it('renders Header with correct text', () => {
    render(<ConfirmName />);
    const heading = screen.getByRole('heading', { name: t.headerText });
    expect(heading).toBeInTheDocument();
    expect(heading.tagName).toBe('H1');
  });

  it('renders ProgressStepper with 4 steps', () => {
    render(<ConfirmName />);
    const nav = screen.getByRole('navigation', { name: 'Progress' });
    expect(nav).toBeInTheDocument();
    
    const listItems = screen.getAllByRole('listitem');
    expect(listItems).toHaveLength(4);
  });

  it('ProgressStepper shows step 1 as current', () => {
    render(<ConfirmName />);
    const currentStep = screen.getByLabelText('Step 1 current');
    expect(currentStep).toBeInTheDocument();
    expect(currentStep).toHaveClass('bg-stepper-current');
  });

  it('ProgressStepper shows steps 2-4 as upcoming', () => {
    render(<ConfirmName />);
    
    const upcomingStep2 = screen.getByLabelText('Step 2 upcoming');
    expect(upcomingStep2).toBeInTheDocument();
    
    const upcomingStep3 = screen.getByLabelText('Step 3 upcoming');
    expect(upcomingStep3).toBeInTheDocument();
    
    const upcomingStep4 = screen.getByLabelText('Step 4 upcoming');
    expect(upcomingStep4).toBeInTheDocument();
  });

  it('renders Select with correct label', () => {
    render(<ConfirmName />);
    const label = screen.getByText(t.selectLabel);
    expect(label).toBeInTheDocument();
  });

  it('renders Select with correct placeholder', () => {
    render(<ConfirmName />);
    const placeholder = screen.getByText(t.selectPlaceholder);
    expect(placeholder).toBeInTheDocument();
  });

  it('renders Back button with arrow icon', () => {
    render(<ConfirmName />);
    const backButton = screen.getByRole('button', { name: t.backButtonLabel });
    expect(backButton).toBeInTheDocument();
  });

  it('Back button has secondary styling', () => {
    render(<ConfirmName />);
    const backButton = screen.getByRole('button', { name: t.backButtonLabel });
    expect(backButton).toHaveClass('bg-transparent');
    expect(backButton).toHaveClass('border-2');
    expect(backButton).toHaveClass('border-white');
  });

  it('renders Next button with correct text', () => {
    render(<ConfirmName />);
    const nextButton = screen.getByRole('button', { name: t.nextButton });
    expect(nextButton).toBeInTheDocument();
  });

  it('Next button has primary styling', () => {
    render(<ConfirmName />);
    const nextButton = screen.getByRole('button', { name: t.nextButton });
    expect(nextButton).toHaveClass('bg-white');
  });

  it('has gradient background styling', () => {
    const { container } = render(<ConfirmName />);
    const main = container.querySelector('main');
    expect(main).toHaveClass('bg-gradient-to-b');
  });

  it('has full-screen height', () => {
    const { container } = render(<ConfirmName />);
    const wrapper = container.firstChild;
    expect(wrapper).toHaveClass('min-h-screen');
  });

  it('main has semantic main element for accessibility', () => {
    render(<ConfirmName />);
    const main = screen.getByRole('main');
    expect(main).toBeInTheDocument();
  });

  it('header has semantic header element for accessibility', () => {
    render(<ConfirmName />);
    const header = screen.getByRole('banner');
    expect(header).toBeInTheDocument();
  });

  it('logs to console when Back button is clicked', async () => {
    const consoleSpy = vi.spyOn(console, 'log');
    const user = userEvent.setup();
    
    render(<ConfirmName />);
    const backButton = screen.getByRole('button', { name: t.backButtonLabel });
    
    await user.click(backButton);
    
    expect(consoleSpy).toHaveBeenCalledWith('Back button clicked');
    consoleSpy.mockRestore();
  });

  it('logs to console when Next button is clicked', async () => {
    const consoleSpy = vi.spyOn(console, 'log');
    const user = userEvent.setup();
    
    render(<ConfirmName />);
    const nextButton = screen.getByRole('button', { name: t.nextButton });
    
    await user.click(nextButton);
    
    expect(consoleSpy).toHaveBeenCalledWith('Next button clicked');
    consoleSpy.mockRestore();
  });

  it('Select has combobox role for accessibility', () => {
    render(<ConfirmName />);
    const select = screen.getByRole('combobox');
    expect(select).toBeInTheDocument();
  });

  it('Select label is properly associated with select element', () => {
    render(<ConfirmName />);
    const label = screen.getByText(t.selectLabel);
    const select = screen.getByRole('combobox');
    
    expect(label).toHaveAttribute('for');
    expect(select).toHaveAttribute('id');
    expect(label.getAttribute('for')).toBe(select.getAttribute('id'));
  });

  it('card has rounded corners and backdrop blur', () => {
    const { container } = render(<ConfirmName />);
    const card = container.querySelector('.rounded-2xl');
    expect(card).toBeInTheDocument();
    expect(card).toHaveClass('backdrop-blur-sm');
  });

  it('buttons are in a flex container with gap', () => {
    const { container } = render(<ConfirmName />);
    const buttonContainer = container.querySelector('.flex.gap-4');
    expect(buttonContainer).toBeInTheDocument();
    
    const buttons = buttonContainer?.querySelectorAll('button');
    expect(buttons).toHaveLength(2);
  });

  it('Back button is narrower than Next button', () => {
    render(<ConfirmName />);
    const backButton = screen.getByRole('button', { name: t.backButtonLabel });
    const nextButton = screen.getByRole('button', { name: t.nextButton });
    
    expect(backButton).toHaveClass('w-auto');
    expect(nextButton).toHaveClass('w-full');
  });

  it('all text comes from translations', () => {
    render(<ConfirmName />);
    
    expect(screen.getByText(t.headerText)).toBeInTheDocument();
    expect(screen.getByText(t.selectLabel)).toBeInTheDocument();
    expect(screen.getByText(t.selectPlaceholder)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: t.nextButton })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: t.backButtonLabel })).toBeInTheDocument();
  });

  it('renders logo in header', () => {
    render(<ConfirmName />);
    const logo = screen.getByRole('img', { name: /liberty logo/i });
    expect(logo).toBeInTheDocument();
  });

  it('ContentWrapper centers content with max width', () => {
    const { container } = render(<ConfirmName />);
    const wrapper = container.querySelector('.max-w-\\[600px\\]');
    expect(wrapper).toBeInTheDocument();
    expect(wrapper).toHaveClass('mx-auto');
  });
});
