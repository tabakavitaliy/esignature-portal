import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import AddNewNamePage from './page';

describe('AddNewNamePage', () => {
  it('renders without crashing', () => {
    render(<AddNewNamePage />);
    expect(screen.getByText('hello world')).toBeInTheDocument();
  });
});
