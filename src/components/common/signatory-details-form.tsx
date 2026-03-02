'use client';

import type { ReactNode } from 'react';
import { Select } from '@/components/common/select';
import { Input } from '@/components/common/input';
import type { AddressAssociation } from '@/hooks/queries/use-matter-details';
import { TITLE_OPTIONS } from '@/constants/signatory-options';
import translations from '@/i18n/en.json';

export interface SignatoryDetailsFormValue {
  title: string;
  firstName: string;
  lastName: string;
  addressAssociation?: AddressAssociation | '';
  email: string;
  confirmEmail?: string;
  mobile: string | null;
  addressLine1?: string;
  addressLine2?: string;
  addressLine3?: string;
  town?: string;
  county?: string;
  postcode?: string;
}

export interface SignatoryDetailsFormConfig {
  showAddressAssociation: boolean;
  showConfirmEmail: boolean;
  showExtendedAddress: boolean;
  required: {
    title: boolean;
    firstName: boolean;
    lastName: boolean;
    addressAssociation: boolean;
    email: boolean;
    confirmEmail: boolean;
    mobile: boolean;
    addressLine1: boolean;
    town: boolean;
    postcode: boolean;
  };
}

export interface SignatoryDetailsFormProps {
  value: SignatoryDetailsFormValue;
  onChange: (field: keyof SignatoryDetailsFormValue, value: string) => void;
  disabled?: boolean;
  config: SignatoryDetailsFormConfig;
  titleOptions?: ReadonlyArray<{ value: string; label: string }>;
  addressAssociationOptions?: ReadonlyArray<{ value: AddressAssociation; label: string }>;
}

export function SignatoryDetailsForm({
  value,
  onChange,
  disabled = false,
  config,
  titleOptions = TITLE_OPTIONS,
  addressAssociationOptions = [],
}: SignatoryDetailsFormProps): ReactNode {
  const t = translations.signatoryDetailsForm;

  return (
    <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
      <Select
        label={t.titleLabel}
        placeholder={t.titlePlaceholder}
        options={titleOptions}
        value={value.title}
        onChange={(v) => onChange('title', v)}
        disabled={disabled}
      />

      <Input
        label={t.firstNameLabel}
        placeholder={t.firstNamePlaceholder}
        value={value.firstName}
        onChange={(v) => onChange('firstName', v)}
        disabled={disabled}
      />

      <Input
        label={t.lastNameLabel}
        placeholder={t.lastNamePlaceholder}
        value={value.lastName}
        onChange={(v) => onChange('lastName', v)}
        disabled={disabled}
      />

      {config.showAddressAssociation && (
        <Select
          label={t.addressAssociationLabel}
          placeholder={t.addressAssociationPlaceholder}
          options={addressAssociationOptions}
          value={value.addressAssociation ?? ''}
          onChange={(v) => onChange('addressAssociation', v)}
          disabled={disabled}
        />
      )}

      <Input
        label={t.emailLabel}
        type="email"
        placeholder={t.emailPlaceholder}
        value={value.email}
        onChange={(v) => onChange('email', v)}
        disabled={disabled}
      />

      {config.showConfirmEmail && (
        <Input
          label={t.confirmEmailLabel}
          type="email"
          placeholder={t.confirmEmailPlaceholder}
          value={value.confirmEmail ?? ''}
          onChange={(v) => onChange('confirmEmail', v)}
          disabled={disabled}
        />
      )}

      <Input
        label={t.mobileLabel}
        type="tel"
        placeholder={t.mobilePlaceholder}
        value={value.mobile ?? ''}
        onChange={(v) => onChange('mobile', v)}
        disabled={disabled}
      />

      <div className="flex flex-col gap-2">
        <label className="text-xs text-white">{t.correspondenceAddressLabel}</label>
        <div className="space-y-2">
          <Input
            label=""
            placeholder={t.addressLine1Placeholder}
            value={value.addressLine1 ?? ''}
            onChange={(v) => onChange('addressLine1', v)}
            disabled={disabled}
            className="gap-0"
          />

          <Input
            label=""
            placeholder={t.addressLine2Placeholder}
            value={value.addressLine2 ?? ''}
            onChange={(v) => onChange('addressLine2', v)}
            disabled={disabled}
            className="gap-0"
          />

          {config.showExtendedAddress && (
            <Input
              label=""
              placeholder={t.addressLine3Placeholder}
              value={value.addressLine3 ?? ''}
              onChange={(v) => onChange('addressLine3', v)}
              disabled={disabled}
              className="gap-0"
            />
          )}

          <Input
            label=""
            placeholder={t.townPlaceholder}
            value={value.town ?? ''}
            onChange={(v) => onChange('town', v)}
            disabled={disabled}
            className="gap-0"
          />

          {config.showExtendedAddress && (
            <Input
              label=""
              placeholder={t.countyPlaceholder}
              value={value.county ?? ''}
              onChange={(v) => onChange('county', v)}
              disabled={disabled}
              className="gap-0"
            />
          )}

          <Input
            label=""
            placeholder={t.postcodePlaceholder}
            value={value.postcode ?? ''}
            onChange={(v) => onChange('postcode', v)}
            disabled={disabled}
            className="gap-0"
          />
        </div>
      </div>
    </form>
  );
}

export const SIGNATORY_FORM_CONFIG = {
  confirmDetails: {
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
  } satisfies SignatoryDetailsFormConfig,

  addAuthorizedSign: {
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
  } satisfies SignatoryDetailsFormConfig,

  notAuthorizedSignatory: {
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
      mobile: false,
      addressLine1: true,
      town: true,
      postcode: true,
    },
  } satisfies SignatoryDetailsFormConfig,
} as const;
