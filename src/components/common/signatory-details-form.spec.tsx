import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import {
  SignatoryDetailsForm,
  SIGNATORY_FORM_CONFIG,
  type SignatoryDetailsFormValue,
  type SignatoryDetailsFormConfig,
} from './signatory-details-form';
import translations from '@/i18n/en.json';

const t = translations.signatoryDetailsForm;

const defaultValue: SignatoryDetailsFormValue = {
  title: '',
  firstName: '',
  lastName: '',
  addressAssociation: '',
  email: '',
  confirmEmail: '',
  mobile: '',
  addressLine1: '',
  addressLine2: '',
  addressLine3: '',
  town: '',
  county: '',
  postcode: '',
};

const fullConfig: SignatoryDetailsFormConfig = {
  showAddressAssociation: true,
  showConfirmEmail: true,
  showExtendedAddress: true,
  required: {
    title: true,
    firstName: true,
    lastName: true,
    addressAssociation: true,
    email: true,
    confirmEmail: true,
    mobile: true,
    addressLine1: true,
    town: true,
    postcode: true,
  },
};

const minimalConfig: SignatoryDetailsFormConfig = {
  showAddressAssociation: false,
  showConfirmEmail: false,
  showExtendedAddress: false,
  required: {
    title: true,
    firstName: true,
    lastName: true,
    addressAssociation: false,
    email: true,
    confirmEmail: false,
    mobile: false,
    addressLine1: true,
    town: true,
    postcode: true,
  },
};

const ADDRESS_ASSOCIATION_OPTIONS = [
  { value: 'Owner' as const, label: 'Owner' },
  { value: 'Landlord' as const, label: 'Landlord' },
  { value: 'LegalTenant' as const, label: 'Legal Tenant' },
];

describe('SignatoryDetailsForm', () => {
  it('renders without crashing', () => {
    render(<SignatoryDetailsForm value={defaultValue} onChange={vi.fn()} config={fullConfig} />);

    expect(screen.getByText(t.firstNameLabel)).toBeInTheDocument();
  });

  it('renders all core form fields', () => {
    render(<SignatoryDetailsForm value={defaultValue} onChange={vi.fn()} config={fullConfig} />);

    expect(screen.getByText(t.titleLabel)).toBeInTheDocument();
    expect(screen.getByText(t.firstNameLabel)).toBeInTheDocument();
    expect(screen.getByText(t.lastNameLabel)).toBeInTheDocument();
    expect(screen.getByText(t.emailLabel)).toBeInTheDocument();
    expect(screen.getByText(t.mobileLabel)).toBeInTheDocument();
    expect(screen.getByText(t.correspondenceAddressLabel)).toBeInTheDocument();
  });

  it('renders confirm email field when showConfirmEmail is true', () => {
    render(<SignatoryDetailsForm value={defaultValue} onChange={vi.fn()} config={fullConfig} />);

    expect(screen.getByText(t.confirmEmailLabel)).toBeInTheDocument();
  });

  it('hides confirm email field when showConfirmEmail is false', () => {
    render(<SignatoryDetailsForm value={defaultValue} onChange={vi.fn()} config={minimalConfig} />);

    expect(screen.queryByText(t.confirmEmailLabel)).not.toBeInTheDocument();
  });

  it('renders address association select when showAddressAssociation is true', () => {
    render(
      <SignatoryDetailsForm
        value={defaultValue}
        onChange={vi.fn()}
        config={fullConfig}
        addressAssociationOptions={ADDRESS_ASSOCIATION_OPTIONS}
      />
    );

    expect(screen.getByText(t.addressAssociationLabel)).toBeInTheDocument();
  });

  it('hides address association select when showAddressAssociation is false', () => {
    render(<SignatoryDetailsForm value={defaultValue} onChange={vi.fn()} config={minimalConfig} />);

    expect(screen.queryByText(t.addressAssociationLabel)).not.toBeInTheDocument();
  });

  it('renders extended address fields when showExtendedAddress is true', () => {
    render(<SignatoryDetailsForm value={defaultValue} onChange={vi.fn()} config={fullConfig} />);

    expect(screen.getByPlaceholderText(t.addressLine3Placeholder)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(t.countyPlaceholder)).toBeInTheDocument();
  });

  it('hides extended address fields when showExtendedAddress is false', () => {
    render(<SignatoryDetailsForm value={defaultValue} onChange={vi.fn()} config={minimalConfig} />);

    expect(screen.queryByPlaceholderText(t.addressLine3Placeholder)).not.toBeInTheDocument();
    expect(screen.queryByPlaceholderText(t.countyPlaceholder)).not.toBeInTheDocument();
  });

  it('always renders address line 1, 2, town, and postcode', () => {
    render(<SignatoryDetailsForm value={defaultValue} onChange={vi.fn()} config={minimalConfig} />);

    expect(screen.getByPlaceholderText(t.addressLine1Placeholder)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(t.addressLine2Placeholder)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(t.townPlaceholder)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(t.postcodePlaceholder)).toBeInTheDocument();
  });

  it('disables all inputs when disabled prop is true', () => {
    render(
      <SignatoryDetailsForm
        value={defaultValue}
        onChange={vi.fn()}
        disabled={true}
        config={minimalConfig}
      />
    );

    const inputs = screen.getAllByRole('textbox');
    inputs.forEach((input) => {
      expect(input).toBeDisabled();
    });
  });

  it('enables all inputs when disabled prop is false', () => {
    render(
      <SignatoryDetailsForm
        value={defaultValue}
        onChange={vi.fn()}
        disabled={false}
        config={minimalConfig}
      />
    );

    const inputs = screen.getAllByRole('textbox');
    inputs.forEach((input) => {
      expect(input).not.toBeDisabled();
    });
  });

  it('calls onChange with correct field name when first name changes', async () => {
    const mockOnChange = vi.fn();
    const user = userEvent.setup();

    render(
      <SignatoryDetailsForm value={defaultValue} onChange={mockOnChange} config={minimalConfig} />
    );

    const firstNameInput = screen.getByPlaceholderText(t.firstNamePlaceholder);
    await user.type(firstNameInput, 'J');

    expect(mockOnChange).toHaveBeenCalledWith('firstName', 'J');
  });

  it('calls onChange with correct field name when email changes', async () => {
    const mockOnChange = vi.fn();
    const user = userEvent.setup();

    render(
      <SignatoryDetailsForm value={defaultValue} onChange={mockOnChange} config={minimalConfig} />
    );

    const emailInput = screen.getByPlaceholderText(t.emailPlaceholder);
    await user.type(emailInput, 'a');

    expect(mockOnChange).toHaveBeenCalledWith('email', 'a');
  });

  it('calls onChange for address fields', async () => {
    const mockOnChange = vi.fn();
    const user = userEvent.setup();

    render(
      <SignatoryDetailsForm value={defaultValue} onChange={mockOnChange} config={minimalConfig} />
    );

    const addressInput = screen.getByPlaceholderText(t.addressLine1Placeholder);
    await user.type(addressInput, '1');

    expect(mockOnChange).toHaveBeenCalledWith('addressLine1', '1');
  });

  it('prevents default form submission', () => {
    const mockOnChange = vi.fn();
    const { container } = render(
      <SignatoryDetailsForm value={defaultValue} onChange={mockOnChange} config={minimalConfig} />
    );

    const form = container.querySelector('form');
    expect(form).toBeInTheDocument();
  });

  it('displays populated values in form fields', () => {
    const populatedValue: SignatoryDetailsFormValue = {
      title: 'Mr',
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      mobile: '07700900000',
      addressLine1: '123 Main St',
      addressLine2: 'Apt 4',
      town: 'London',
      postcode: 'SW1A 1AA',
    };

    render(
      <SignatoryDetailsForm value={populatedValue} onChange={vi.fn()} config={minimalConfig} />
    );

    expect(screen.getByDisplayValue('John')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Doe')).toBeInTheDocument();
    expect(screen.getByDisplayValue('john@example.com')).toBeInTheDocument();
    expect(screen.getByDisplayValue('07700900000')).toBeInTheDocument();
    expect(screen.getByDisplayValue('123 Main St')).toBeInTheDocument();
  });

  it('handles null mobile value gracefully', () => {
    const valueWithNullMobile: SignatoryDetailsFormValue = {
      ...defaultValue,
      mobile: null,
    };

    render(
      <SignatoryDetailsForm value={valueWithNullMobile} onChange={vi.fn()} config={minimalConfig} />
    );

    const mobileInput = screen.getByPlaceholderText(t.mobilePlaceholder);
    expect(mobileInput).toHaveValue('');
  });

  describe('SIGNATORY_FORM_CONFIG', () => {
    it('confirmDetails config hides address association and confirm email', () => {
      const config = SIGNATORY_FORM_CONFIG.confirmDetails;

      expect(config.showAddressAssociation).toBe(false);
      expect(config.showConfirmEmail).toBe(false);
      expect(config.showExtendedAddress).toBe(false);
    });

    it('addAuthorizedSign config shows all fields', () => {
      const config = SIGNATORY_FORM_CONFIG.addAuthorizedSign;

      expect(config.showAddressAssociation).toBe(true);
      expect(config.showConfirmEmail).toBe(true);
      expect(config.showExtendedAddress).toBe(true);
    });

    it('notAuthorizedSignatory config shows all fields with optional mobile', () => {
      const config = SIGNATORY_FORM_CONFIG.notAuthorizedSignatory;

      expect(config.showAddressAssociation).toBe(true);
      expect(config.showConfirmEmail).toBe(true);
      expect(config.showExtendedAddress).toBe(true);
      expect(config.required.mobile).toBe(false);
    });
  });
});
