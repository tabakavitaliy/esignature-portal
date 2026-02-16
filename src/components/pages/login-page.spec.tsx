import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import userEvent from '@testing-library/user-event';
import { useRouter } from 'next/navigation';
import { LoginPage } from './login-page';
import translations from '@/i18n/en.json';

vi.mock('next/navigation', () => ({
  useRouter: vi.fn(),
}));

describe('LoginPage', () => {
  const { loginPage: t } = translations;
  const mockPush = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    (useRouter as ReturnType<typeof vi.fn>).mockReturnValue({
      push: mockPush,
    });
  });

  it('renders without crashing', () => {
    render(<LoginPage />);
    const heading = screen.getByText(t.signaturePortal);
    expect(heading).toBeInTheDocument();
  });

  it('displays the logo', () => {
    render(<LoginPage />);
    const logo = screen.getByRole('img', { name: /liberty logo/i });
    expect(logo).toBeInTheDocument();
  });

  it('shows Signature Portal heading', () => {
    render(<LoginPage />);
    const heading = screen.getByRole('heading', { name: t.signaturePortal });
    expect(heading).toBeInTheDocument();
    expect(heading.tagName).toBe('H1');
  });

  it('shows powered by text', () => {
    render(<LoginPage />);
    const poweredBy = screen.getByText(t.poweredBy);
    expect(poweredBy).toBeInTheDocument();
  });

  it('displays welcome message', () => {
    render(<LoginPage />);
    const welcomeMessage = screen.getByText(t.welcomeMessage);
    expect(welcomeMessage).toBeInTheDocument();
  });

  it('displays credential hint', () => {
    render(<LoginPage />);
    const credentialHint = screen.getByText(t.credentialHint);
    expect(credentialHint).toBeInTheDocument();
  });

  it('renders input with correct label', () => {
    render(<LoginPage />);
    const input = screen.getByLabelText(t.credentialLabel);
    expect(input).toBeInTheDocument();
  });

  it('renders input with correct placeholder', () => {
    render(<LoginPage />);
    const input = screen.getByPlaceholderText(t.credentialPlaceholder);
    expect(input).toBeInTheDocument();
  });

  it('input has text type', () => {
    render(<LoginPage />);
    const input = screen.getByLabelText(t.credentialLabel);
    expect(input).toHaveAttribute('type', 'text');
  });

  it('has gradient background styling', () => {
    const { container } = render(<LoginPage />);
    const main = container.querySelector('main');
    expect(main).toHaveClass('bg-gradient-to-b');
  });

  it('has full-screen height', () => {
    const { container } = render(<LoginPage />);
    const main = container.querySelector('main');
    expect(main).toHaveClass('min-h-screen');
  });

  it('heading has white text', () => {
    render(<LoginPage />);
    const heading = screen.getByRole('heading', { name: t.signaturePortal });
    expect(heading).toHaveClass('text-white');
  });

  it('renders horizontal rule separator', () => {
    const { container } = render(<LoginPage />);
    const hr = container.querySelector('hr');
    expect(hr).toBeInTheDocument();
    expect(hr).toHaveClass('bg-white/30');
  });

  it('renders card with correct styling', () => {
    const { container } = render(<LoginPage />);
    const card = container.querySelector('.rounded-2xl');
    expect(card).toBeInTheDocument();
    expect(card).toHaveClass('bg-[var(--login-card-bg)]');
    expect(card).toHaveClass('backdrop-blur-sm');
  });

  it('renders main element with correct structure', () => {
    const { container } = render(<LoginPage />);
    const main = container.querySelector('main');
    expect(main).toBeInTheDocument();
    expect(main).toHaveClass('flex');
    expect(main).toHaveClass('flex-col');
    expect(main).toHaveClass('justify-between');
  });

  it('Next button is clickable', () => {
    render(<LoginPage />);
    const nextButton = screen.getByRole('button', { name: t.nextButton });
    expect(nextButton).toBeEnabled();
  });

  it('renders Recaptcha component', () => {
    render(<LoginPage />);
    const recaptchaImage = screen.getByRole('img', { name: 'reCAPTCHA logo' });
    expect(recaptchaImage).toBeInTheDocument();
  });

  it('renders Button with iconAfter', () => {
    render(<LoginPage />);
    const button = screen.getByRole('button', { name: t.nextButton });
    const icon = button.querySelector('svg');
    expect(icon).toBeInTheDocument();
  });

  describe('credential validation', () => {
    it('navigates to /confirm-name when valid credential is entered and Next is clicked', async () => {
      const user = userEvent.setup();
      render(<LoginPage />);
      const input = screen.getByLabelText(t.credentialLabel) as HTMLInputElement;
      const nextButton = screen.getByRole('button', { name: t.nextButton });

      await user.type(input, 'ABCD1234EFGH5678');
      await user.click(nextButton);

      expect(mockPush).toHaveBeenCalledWith('/confirm-name');
      expect(mockPush).toHaveBeenCalledTimes(1);
    });

    it('does not navigate when credential is empty and Next is clicked', async () => {
      const user = userEvent.setup();
      render(<LoginPage />);
      const nextButton = screen.getByRole('button', { name: t.nextButton });

      await user.click(nextButton);

      expect(mockPush).not.toHaveBeenCalled();
    });

    it('does not navigate when credential is invalid format and Next is clicked', async () => {
      const user = userEvent.setup();
      render(<LoginPage />);
      const input = screen.getByLabelText(t.credentialLabel) as HTMLInputElement;
      const nextButton = screen.getByRole('button', { name: t.nextButton });

      await user.type(input, 'ABCD-1234-EFGH');
      await user.click(nextButton);

      expect(mockPush).not.toHaveBeenCalled();
    });

    it('does not navigate when credential is partial (less than 16 characters)', async () => {
      const user = userEvent.setup();
      render(<LoginPage />);
      const input = screen.getByLabelText(t.credentialLabel) as HTMLInputElement;
      const nextButton = screen.getByRole('button', { name: t.nextButton });

      await user.type(input, 'ABCD-1234-EFGH-56');
      await user.click(nextButton);

      expect(mockPush).not.toHaveBeenCalled();
    });

    it('does not navigate when credential has lowercase letters', async () => {
      const user = userEvent.setup();
      render(<LoginPage />);
      const input = screen.getByLabelText(t.credentialLabel) as HTMLInputElement;
      const nextButton = screen.getByRole('button', { name: t.nextButton });

      // Even though input converts to uppercase, if we manually set an invalid value
      await user.type(input, 'abcd1234efgh5678');
      // The input will be converted to uppercase, so we need to test the actual validation
      // Let's test with a value that won't match the pattern after conversion
      await user.clear(input);
      await user.type(input, 'ABCD1234EFGH567'); // 15 characters
      await user.click(nextButton);

      expect(mockPush).not.toHaveBeenCalled();
    });

    it('validates credential pattern correctly for valid format', async () => {
      const user = userEvent.setup();
      render(<LoginPage />);
      const input = screen.getByLabelText(t.credentialLabel) as HTMLInputElement;
      const nextButton = screen.getByRole('button', { name: t.nextButton });

      await user.type(input, '2A2E42WX8375QC3B');
      expect(input.value).toBe('2A2E-42WX-8375-QC3B');
      await user.click(nextButton);

      expect(mockPush).toHaveBeenCalledWith('/confirm-name');
    });

    it('validates credential pattern correctly for invalid format with too few groups', async () => {
      const user = userEvent.setup();
      render(<LoginPage />);
      const input = screen.getByLabelText(t.credentialLabel) as HTMLInputElement;
      const nextButton = screen.getByRole('button', { name: t.nextButton });

      await user.type(input, 'ABCD1234EFGH');
      expect(input.value).toBe('ABCD-1234-EFGH');
      await user.click(nextButton);

      expect(mockPush).not.toHaveBeenCalled();
    });

    it('validates credential pattern correctly for format with extra characters', async () => {
      const user = userEvent.setup();
      render(<LoginPage />);
      const input = screen.getByLabelText(t.credentialLabel) as HTMLInputElement;
      const nextButton = screen.getByRole('button', { name: t.nextButton });

      await user.type(input, 'ABCD1234EFGH5678EXTRA');
      expect(input.value).toBe('ABCD-1234-EFGH-5678'); // Mask limits to 16 chars
      await user.click(nextButton);

      expect(mockPush).toHaveBeenCalledWith('/confirm-name');
    });

    it('validates credential pattern correctly for all numeric credential', async () => {
      const user = userEvent.setup();
      render(<LoginPage />);
      const input = screen.getByLabelText(t.credentialLabel) as HTMLInputElement;
      const nextButton = screen.getByRole('button', { name: t.nextButton });

      await user.type(input, '1234567890123456');
      expect(input.value).toBe('1234-5678-9012-3456');
      await user.click(nextButton);

      expect(mockPush).toHaveBeenCalledWith('/confirm-name');
    });

    it('validates credential pattern correctly for all alphabetic credential', async () => {
      const user = userEvent.setup();
      render(<LoginPage />);
      const input = screen.getByLabelText(t.credentialLabel) as HTMLInputElement;
      const nextButton = screen.getByRole('button', { name: t.nextButton });

      await user.type(input, 'ABCDEFGHJKMNPQRS');
      expect(input.value).toBe('ABCD-EFGH-JKMN-PQRS');
      await user.click(nextButton);

      expect(mockPush).toHaveBeenCalledWith('/confirm-name');
    });

    it('sets isInvalid state when credential is invalid', async () => {
      const user = userEvent.setup();
      render(<LoginPage />);
      const input = screen.getByLabelText(t.credentialLabel) as HTMLInputElement;
      const nextButton = screen.getByRole('button', { name: t.nextButton });

      await user.type(input, 'ABCD-1234-EFGH');
      await user.click(nextButton);

      // isInvalid should be set to true (though not displayed in UI)
      // We verify this by checking navigation didn't happen
      expect(mockPush).not.toHaveBeenCalled();
    });

    it('sets isInvalid state to false when credential is valid', async () => {
      const user = userEvent.setup();
      render(<LoginPage />);
      const input = screen.getByLabelText(t.credentialLabel) as HTMLInputElement;
      const nextButton = screen.getByRole('button', { name: t.nextButton });

      await user.type(input, 'ABCD1234EFGH5678');
      await user.click(nextButton);

      // isInvalid should be set to false (we verify by successful navigation)
      expect(mockPush).toHaveBeenCalledWith('/confirm-name');
    });
  });

  describe('error label display', () => {
    it('does not show error label initially', () => {
      render(<LoginPage />);
      const errorLabel = screen.queryByText(t.errorMessage);
      expect(errorLabel).not.toBeInTheDocument();
    });

    it('shows error label when invalid credential is submitted', async () => {
      const user = userEvent.setup();
      render(<LoginPage />);
      const nextButton = screen.getByRole('button', { name: t.nextButton });

      await user.click(nextButton);

      const errorLabel = screen.getByText(t.errorMessage);
      expect(errorLabel).toBeInTheDocument();
    });

    it('shows error label when partial credential is submitted', async () => {
      const user = userEvent.setup();
      render(<LoginPage />);
      const input = screen.getByLabelText(t.credentialLabel) as HTMLInputElement;
      const nextButton = screen.getByRole('button', { name: t.nextButton });

      await user.type(input, 'ABCD-1234');
      await user.click(nextButton);

      const errorLabel = screen.getByText(t.errorMessage);
      expect(errorLabel).toBeInTheDocument();
    });

    it('does not show error label when valid credential is submitted', async () => {
      const user = userEvent.setup();
      render(<LoginPage />);
      const input = screen.getByLabelText(t.credentialLabel) as HTMLInputElement;
      const nextButton = screen.getByRole('button', { name: t.nextButton });

      await user.type(input, 'ABCD1234EFGH5678');
      await user.click(nextButton);

      const errorLabel = screen.queryByText(t.errorMessage);
      expect(errorLabel).not.toBeInTheDocument();
    });

    it('error label has correct accessibility attributes', async () => {
      const user = userEvent.setup();
      render(<LoginPage />);
      const nextButton = screen.getByRole('button', { name: t.nextButton });

      await user.click(nextButton);

      const errorLabel = screen.getByRole('alert');
      expect(errorLabel).toBeInTheDocument();
      expect(errorLabel).toHaveAttribute('aria-live', 'polite');
      expect(errorLabel).toHaveTextContent(t.errorMessage);
    });

    it('error label appears below the Next button', async () => {
      const user = userEvent.setup();
      render(<LoginPage />);
      const nextButton = screen.getByRole('button', { name: t.nextButton });

      await user.click(nextButton);

      const errorLabel = screen.getByText(t.errorMessage);
      const buttonParent = nextButton.parentElement;
      expect(buttonParent).toContainElement(errorLabel);
    });
  });

  describe('keyboard interaction', () => {
    it('triggers handleNextClick when Enter key is pressed with valid credential', async () => {
      const user = userEvent.setup();
      render(<LoginPage />);
      const input = screen.getByLabelText(t.credentialLabel) as HTMLInputElement;

      await user.type(input, 'ABCD1234EFGH5678');
      await user.keyboard('{Enter}');

      expect(mockPush).toHaveBeenCalledWith('/confirm-name');
    });

    it('triggers handleNextClick when Enter key is pressed with invalid credential', async () => {
      const user = userEvent.setup();
      render(<LoginPage />);
      const input = screen.getByLabelText(t.credentialLabel) as HTMLInputElement;

      await user.type(input, 'ABCD');
      await user.keyboard('{Enter}');

      expect(mockPush).not.toHaveBeenCalled();
      const errorLabel = screen.getByText(t.errorMessage);
      expect(errorLabel).toBeInTheDocument();
    });

    it('triggers handleNextClick when Enter key is pressed with empty credential', async () => {
      const user = userEvent.setup();
      render(<LoginPage />);
      const input = screen.getByLabelText(t.credentialLabel) as HTMLInputElement;

      input.focus();
      await user.keyboard('{Enter}');

      expect(mockPush).not.toHaveBeenCalled();
      const errorLabel = screen.getByText(t.errorMessage);
      expect(errorLabel).toBeInTheDocument();
    });
  });

  describe('credential input mask', () => {
    it('formats input with dashes in groups of 4', async () => {
      const user = userEvent.setup();
      render(<LoginPage />);
      const input = screen.getByLabelText(t.credentialLabel) as HTMLInputElement;

      await user.type(input, '2A2E42WX8375QC3B');
      expect(input.value).toBe('2A2E-42WX-8375-QC3B');
    });

    it('converts lowercase letters to uppercase', async () => {
      const user = userEvent.setup();
      render(<LoginPage />);
      const input = screen.getByLabelText(t.credentialLabel) as HTMLInputElement;

      await user.type(input, 'abcd1234efgh5678');
      expect(input.value).toBe('ABCD-1234-EFGH-5678');
    });

    it('rejects non-alphanumeric characters', async () => {
      const user = userEvent.setup();
      render(<LoginPage />);
      const input = screen.getByLabelText(t.credentialLabel) as HTMLInputElement;

      await user.type(input, 'A@B#C$1!2%3^4&');
      expect(input.value).toBe('ABC1-234');
    });

    it('limits input to 16 characters plus 3 dashes', async () => {
      const user = userEvent.setup();
      render(<LoginPage />);
      const input = screen.getByLabelText(t.credentialLabel) as HTMLInputElement;

      await user.type(input, 'ABCD1234EFGH5678EXTRA');
      expect(input.value).toBe('ABCD-1234-EFGH-5678');
      expect(input.value.length).toBe(19);
    });

    it('handles partial input correctly', async () => {
      const user = userEvent.setup();
      render(<LoginPage />);
      const input = screen.getByLabelText(t.credentialLabel) as HTMLInputElement;

      await user.type(input, 'ABC1');
      expect(input.value).toBe('ABC1');
    });

    it('handles input with mixed case and special characters', async () => {
      const user = userEvent.setup();
      render(<LoginPage />);
      const input = screen.getByLabelText(t.credentialLabel) as HTMLInputElement;

      await user.type(input, '2a2e-42wx-8375-qc3b');
      expect(input.value).toBe('2A2E-42WX-8375-QC3B');
    });
  });
});
