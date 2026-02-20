'use client';

import type { ReactNode } from 'react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { ContentWrapper } from '@/components/layout/content-wrapper';
import { Header } from '@/components/common/header';
import { ProgressStepper } from '@/components/common/progress-stepper';
import { Select } from '@/components/common/select';
import { Input } from '@/components/common/input';
import { Checkbox } from '@/components/common/checkbox';
import { Button } from '@/components/common/button';
import { BackgroundPattern } from '@/components/common/background-pattern';
import translations from '@/i18n/en.json';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { CustomerPrivacy } from '@/components/common/customer-privacy';

/**
 * ConfirmDetails component displays the details confirmation page
 * @returns ReactNode
 */
export function ConfirmDetails(): ReactNode {
  const [title, setTitle] = useState<string>('');
  const [firstName, setFirstName] = useState<string>('');
  const [lastName, setLastName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [mobile, setMobile] = useState<string>('');
  const [addressLine1, setAddressLine1] = useState<string>('');
  const [addressLine2, setAddressLine2] = useState<string>('');
  const [town, setTown] = useState<string>('');
  const [postcode, setPostcode] = useState<string>('');
  const [isConfirmed, setIsConfirmed] = useState<boolean>(false);
  const { confirmDetailsPage: t } = translations;
  const router = useRouter();

  const titleOptions = [
    { value: 'mr', label: 'Mr' },
    { value: 'mrs', label: 'Mrs' },
    { value: 'miss', label: 'Miss' },
    { value: 'ms', label: 'Ms' },
    { value: 'dr', label: 'Dr' },
  ];

  const handleBackClick = (): void => {
    console.log('Back button clicked');
    router.push('/confirm-name');
  };

  const handleNextClick = (): void => {
    console.log('Next button clicked');
  };

  const handleEditClick = (): void => {
    console.log('Edit button clicked');
  };

  const handleTitleChange = (value: string): void => {
    console.log('Title changed:', value);
    setTitle(value);
  };

  const handleFirstNameChange = (value: string): void => {
    console.log('First name changed:', value);
    setFirstName(value);
  };

  const handleLastNameChange = (value: string): void => {
    console.log('Last name changed:', value);
    setLastName(value);
  };

  const handleEmailChange = (value: string): void => {
    console.log('Email changed:', value);
    setEmail(value);
  };

  const handleMobileChange = (value: string): void => {
    console.log('Mobile changed:', value);
    setMobile(value);
  };

  const handleAddressLine1Change = (value: string): void => {
    console.log('Address line 1 changed:', value);
    setAddressLine1(value);
  };

  const handleAddressLine2Change = (value: string): void => {
    console.log('Address line 2 changed:', value);
    setAddressLine2(value);
  };

  const handleTownChange = (value: string): void => {
    console.log('Town changed:', value);
    setTown(value);
  };

  const handlePostcodeChange = (value: string): void => {
    console.log('Postcode changed:', value);
    setPostcode(value);
  };

  const handleCheckboxChange = (value: boolean): void => {
    console.log('Checkbox changed:', value);
    setIsConfirmed(value);
  };

  return (
    <div
      className={cn(
        'relative flex min-h-screen flex-col overflow-hidden',
        'bg-gradient-to-b from-[var(--login-gradient-start)] to-[var(--login-gradient-end)]'
      )}
    >
      <BackgroundPattern />
      <Header text={t.headerText} />

      <main className={cn('flex flex-1 flex-col px-6 py-12')}>
        <ContentWrapper className="flex flex-1 flex-col gap-8">
          <ProgressStepper stepCount={4} currentStep={2} className="self-center" />

          <div
            className={cn(
              'flex-1 rounded-2xl px-8 py-10',
              'bg-[var(--login-card-bg)] backdrop-blur-sm'
            )}
          >
            <p className="text-sm text-white mb-6">{t.description}</p>

            <div className="h-px w-[24px] bg-white/20 mb-6 mx-auto" />

            <div className="flex items-center justify-between mb-6">
              <h2 className="text-base font-semibold text-white">
                {t.signatoryDetailsHeading}
              </h2>
              <button
                onClick={handleEditClick}
                className={cn(
                  'flex items-center gap-2 text-sm text-white',
                  'hover:underline focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-transparent rounded'
                )}
                aria-label={t.editButton}
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                  <path d="M6 1.98744H1.91667C1.60725 1.98744 1.3105 2.11035 1.09171 2.32915C0.872916 2.54794 0.75 2.84468 0.75 3.1541V11.3208C0.75 11.6302 0.872916 11.9269 1.09171 12.1457C1.3105 12.3645 1.60725 12.4874 1.91667 12.4874H10.0833C10.3928 12.4874 10.6895 12.3645 10.9083 12.1457C11.1271 11.9269 11.25 11.6302 11.25 11.3208V7.23744M10.375 1.11244C10.6071 0.880372 10.9218 0.75 11.25 0.75C11.5782 0.75 11.8929 0.880372 12.125 1.11244C12.3571 1.3445 12.4874 1.65925 12.4874 1.98744C12.4874 2.31563 12.3571 2.63037 12.125 2.86244L6.58333 8.4041L4.25 8.98744L4.83333 6.6541L10.375 1.11244Z" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span>{t.editButton}</span>
              </button>
            </div>

            <div className="space-y-4">
              <Select
                label={t.titleLabel}
                placeholder={t.titlePlaceholder}
                options={titleOptions}
                value={title}
                onChange={handleTitleChange}
              />

              <Input
                label={t.firstNameLabel}
                value={firstName}
                onChange={handleFirstNameChange}
              />

              <Input
                label={t.lastNameLabel}
                value={lastName}
                onChange={handleLastNameChange}
              />

              <Input
                label={t.emailLabel}
                type="email"
                value={email}
                onChange={handleEmailChange}
              />

              <Input
                label={t.mobileLabel}
                type="tel"
                value={mobile}
                onChange={handleMobileChange}
              />

              <div className="pt-2">
                <label className="text-xs text-white mb-1 block">{t.correspondenceAddressLabel}</label>
                <div className="space-y-1">
                  <Input
                    label={''}
                    value={addressLine1}
                    onChange={handleAddressLine1Change}
                  />

                  <Input
                    label={''}
                    value={addressLine2}
                    onChange={handleAddressLine2Change}
                  />

                  <Input
                    label={''}
                    value={town}
                    onChange={handleTownChange}
                  />

                  <Input
                    label={''}
                    value={postcode}
                    onChange={handlePostcodeChange}
                  />
                </div>
              </div>
            </div>
          </div>
          <Checkbox
              label={t.confirmCheckboxLabel}
              value={isConfirmed}
              onChange={handleCheckboxChange}
              className="mt-6"
            />
          <div className="flex gap-4">
            <Button
              text=""
              kind="secondary"
              iconBefore={<ArrowLeft className="h-5 w-5" />}
              onClick={handleBackClick}
              aria-label={t.backButtonLabel}
              className="w-auto px-6"
            />
            <Button
              text={t.nextButton}
              kind="primary"
              iconAfter={<ArrowRight className="h-5 w-5" />}
              onClick={handleNextClick}
            />
          </div>
        </ContentWrapper>
      </main>
      <CustomerPrivacy />
    </div>
  );
}
