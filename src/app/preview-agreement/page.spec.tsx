import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import PreviewAgreementPage from './page';

describe('PreviewAgreementPage', () => {
  it('renders placeholder content', () => {
    render(<PreviewAgreementPage />);
    expect(screen.getByText(/Agreement preview/i)).toBeInTheDocument();
  });
});
