import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import ConfirmNamePage from './page';
import translations from '@/i18n/en.json';

describe('ConfirmNamePage', () => {
  const { confirmNamePage: t } = translations;

  it('renders without crashing', () => {
    render(<ConfirmNamePage />);
    const heading = screen.getByRole('heading', { name: t.headerText });
    expect(heading).toBeInTheDocument();
  });

  it('renders ConfirmName component', () => {
    render(<ConfirmNamePage />);
    const main = screen.getByRole('main');
    expect(main).toBeInTheDocument();
  });

  it('has header with correct text', () => {
    render(<ConfirmNamePage />);
    const heading = screen.getByRole('heading', { name: t.headerText });
    expect(heading).toBeInTheDocument();
  });

  it('has progress stepper', () => {
    render(<ConfirmNamePage />);
    const nav = screen.getByRole('navigation', { name: 'Progress' });
    expect(nav).toBeInTheDocument();
  });
});
