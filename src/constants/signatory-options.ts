import type { AddressAssociation } from '@/hooks/queries/use-matter-details';

export const TITLE_OPTIONS = [
  { value: 'Mr', label: 'Mr' },
  { value: 'Mrs', label: 'Mrs' },
  { value: 'Ms', label: 'Ms' },
  { value: 'Miss', label: 'Miss' },
  { value: 'Dr', label: 'Dr' },
] as const;

export const ADDRESS_ASSOCIATION_OPTIONS: ReadonlyArray<{ value: AddressAssociation; label: string }> = [
  { value: 'Owner', label: 'Owner' },
  { value: 'Landlord', label: 'Landlord' },
  { value: 'Property Manager', label: 'Property Manager' },
  { value: 'Solicitor', label: 'Solicitor' },
  { value: 'Executor', label: 'Executor' },
  { value: 'Director', label: 'Director' },
  { value: 'Other', label: 'Other' },
];
