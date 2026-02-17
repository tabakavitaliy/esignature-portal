import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { CustomerPrivacy } from './customer-privacy';
import * as useMatterDetailsModule from '@/hooks/queries/use-matter-details';
import type { MatterDetails } from '@/hooks/queries/use-matter-details';
import translations from '@/i18n/en.json';

vi.mock('@/hooks/queries/use-matter-details', () => ({
  useMatterDetails: vi.fn(),
}));

describe('CustomerPrivacy', () => {
  const { customerPrivacy: t } = translations;
  const mockPrivacyUrl = 'https://example.com/privacy-policy';

  const mockMatterDetails: MatterDetails = {
    hasSignedMatter: false,
    matterId: 'test-matter-id',
    matterReference: 'REF123',
    matterStatus: 'Pending',
    privacyPolicyUrl: mockPrivacyUrl,
    matterDocumentId: 'test-doc-id',
    propertyAddresses: [],
    signatories: [],
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders without crashing', () => {
    (useMatterDetailsModule.useMatterDetails as ReturnType<typeof vi.fn>).mockReturnValue({
      data: mockMatterDetails,
      isLoading: false,
      error: null,
    });

    render(<CustomerPrivacy />);
    const link = screen.getByRole('link');
    expect(link).toBeInTheDocument();
  });

  it('displays translated text from translations', () => {
    (useMatterDetailsModule.useMatterDetails as ReturnType<typeof vi.fn>).mockReturnValue({
      data: mockMatterDetails,
      isLoading: false,
      error: null,
    });

    render(<CustomerPrivacy />);
    const linkText = screen.getByText(t.linkText);
    expect(linkText).toBeInTheDocument();
  });

  it('link has correct href from data.privacyPolicyUrl', () => {
    (useMatterDetailsModule.useMatterDetails as ReturnType<typeof vi.fn>).mockReturnValue({
      data: mockMatterDetails,
      isLoading: false,
      error: null,
    });

    render(<CustomerPrivacy />);
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', mockPrivacyUrl);
  });

  it('opens in new tab with security attributes', () => {
    (useMatterDetailsModule.useMatterDetails as ReturnType<typeof vi.fn>).mockReturnValue({
      data: mockMatterDetails,
      isLoading: false,
      error: null,
    });

    render(<CustomerPrivacy />);
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('has correct height class', () => {
    (useMatterDetailsModule.useMatterDetails as ReturnType<typeof vi.fn>).mockReturnValue({
      data: mockMatterDetails,
      isLoading: false,
      error: null,
    });

    const { container } = render(<CustomerPrivacy />);
    const wrapper = container.firstChild;
    expect(wrapper).toHaveClass('h-[34px]');
  });

  it('has full width', () => {
    (useMatterDetailsModule.useMatterDetails as ReturnType<typeof vi.fn>).mockReturnValue({
      data: mockMatterDetails,
      isLoading: false,
      error: null,
    });

    const { container } = render(<CustomerPrivacy />);
    const wrapper = container.firstChild;
    expect(wrapper).toHaveClass('w-full');
  });

  it('uses background CSS variable class', () => {
    (useMatterDetailsModule.useMatterDetails as ReturnType<typeof vi.fn>).mockReturnValue({
      data: mockMatterDetails,
      isLoading: false,
      error: null,
    });

    const { container } = render(<CustomerPrivacy />);
    const wrapper = container.firstChild;
    expect(wrapper).toHaveClass('bg-[var(--login-card-bg)]');
    expect(wrapper).toHaveClass('backdrop-blur-sm');
  });

  it('uses text color CSS variable class', () => {
    (useMatterDetailsModule.useMatterDetails as ReturnType<typeof vi.fn>).mockReturnValue({
      data: mockMatterDetails,
      isLoading: false,
      error: null,
    });

    render(<CustomerPrivacy />);
    const link = screen.getByRole('link');
    expect(link).toHaveClass('text-[hsl(var(--privacy-notice-text))]');
  });

  it('applies custom className when provided', () => {
    (useMatterDetailsModule.useMatterDetails as ReturnType<typeof vi.fn>).mockReturnValue({
      data: mockMatterDetails,
      isLoading: false,
      error: null,
    });

    const { container } = render(<CustomerPrivacy className="custom-class" />);
    const wrapper = container.firstChild;
    expect(wrapper).toHaveClass('custom-class');
  });

  it('renders nothing when data is undefined', () => {
    (useMatterDetailsModule.useMatterDetails as ReturnType<typeof vi.fn>).mockReturnValue({
      data: undefined,
      isLoading: false,
      error: null,
    });

    const { container } = render(<CustomerPrivacy />);
    expect(container.firstChild).toBeNull();
  });

  it('renders nothing when privacyPolicyUrl is undefined', () => {
    const dataWithoutUrl: MatterDetails = {
      ...mockMatterDetails,
      privacyPolicyUrl: '',
    };

    (useMatterDetailsModule.useMatterDetails as ReturnType<typeof vi.fn>).mockReturnValue({
      data: dataWithoutUrl,
      isLoading: false,
      error: null,
    });

    const { container } = render(<CustomerPrivacy />);
    expect(container.firstChild).toBeNull();
  });

  it('link has proper aria-label for accessibility', () => {
    (useMatterDetailsModule.useMatterDetails as ReturnType<typeof vi.fn>).mockReturnValue({
      data: mockMatterDetails,
      isLoading: false,
      error: null,
    });

    render(<CustomerPrivacy />);
    const link = screen.getByRole('link', { name: t.linkText });
    expect(link).toHaveAttribute('aria-label', t.linkText);
  });

  it('link is focusable', () => {
    (useMatterDetailsModule.useMatterDetails as ReturnType<typeof vi.fn>).mockReturnValue({
      data: mockMatterDetails,
      isLoading: false,
      error: null,
    });

    render(<CustomerPrivacy />);
    const link = screen.getByRole('link');
    link.focus();
    expect(link).toHaveFocus();
  });

  it('has text size of 12px (text-xs)', () => {
    (useMatterDetailsModule.useMatterDetails as ReturnType<typeof vi.fn>).mockReturnValue({
      data: mockMatterDetails,
      isLoading: false,
      error: null,
    });

    render(<CustomerPrivacy />);
    const link = screen.getByRole('link');
    expect(link).toHaveClass('text-xs');
  });

  it('centers content horizontally and vertically', () => {
    (useMatterDetailsModule.useMatterDetails as ReturnType<typeof vi.fn>).mockReturnValue({
      data: mockMatterDetails,
      isLoading: false,
      error: null,
    });

    const { container } = render(<CustomerPrivacy />);
    const wrapper = container.firstChild;
    expect(wrapper).toHaveClass('flex');
    expect(wrapper).toHaveClass('items-center');
    expect(wrapper).toHaveClass('justify-center');
  });

  it('link has hover effect', () => {
    (useMatterDetailsModule.useMatterDetails as ReturnType<typeof vi.fn>).mockReturnValue({
      data: mockMatterDetails,
      isLoading: false,
      error: null,
    });

    render(<CustomerPrivacy />);
    const link = screen.getByRole('link');
    expect(link).toHaveClass('hover:underline');
  });

  it('link has focus ring for accessibility', () => {
    (useMatterDetailsModule.useMatterDetails as ReturnType<typeof vi.fn>).mockReturnValue({
      data: mockMatterDetails,
      isLoading: false,
      error: null,
    });

    render(<CustomerPrivacy />);
    const link = screen.getByRole('link');
    expect(link).toHaveClass('focus:outline-none');
    expect(link).toHaveClass('focus:ring-2');
    expect(link).toHaveClass('focus:ring-white');
  });
});
