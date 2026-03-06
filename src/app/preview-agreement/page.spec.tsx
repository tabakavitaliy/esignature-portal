import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import PreviewAgreementPage from './page';

vi.mock('@/components/pages/preview-agreement', () => ({
  PreviewAgreement: () => (
    <div data-testid="preview-agreement-component">PreviewAgreement Component</div>
  ),
}));

describe('PreviewAgreementPage', () => {
  it('renders without crashing', () => {
    render(<PreviewAgreementPage />);
    const component = screen.getByTestId('preview-agreement-component');
    expect(component).toBeInTheDocument();
  });

  it('renders PreviewAgreement component', () => {
    render(<PreviewAgreementPage />);
    const component = screen.getByTestId('preview-agreement-component');
    expect(component).toBeInTheDocument();
    expect(component).toHaveTextContent('PreviewAgreement Component');
  });
});
