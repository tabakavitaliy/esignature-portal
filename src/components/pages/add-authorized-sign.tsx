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
import { Button } from '@/components/common/button';
import { ButtonErrorLabel } from '@/components/common/button-error-label';
import { BackgroundPattern } from '@/components/common/background-pattern';
import translations from '@/i18n/en.json';
import { ArrowLeft } from 'lucide-react';
import { CustomerPrivacy } from '@/components/common/customer-privacy';
import type { AddressAssociation } from '@/hooks/queries/use-matter-details';

/**
 * AddAuthorizedSign component displays the form for adding authorized signatory information
 * @returns ReactNode
 */
export function AddAuthorizedSign(): ReactNode {
  const [title, setTitle] = useState<string>('');
  const [firstName, setFirstName] = useState<string>('');
  const [lastName, setLastName] = useState<string>('');
  const [addressAssociation, setAddressAssociation] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [confirmEmail, setConfirmEmail] = useState<string>('');
  const [mobile, setMobile] = useState<string>('');
  const [addressLine1, setAddressLine1] = useState<string>('');
  const [addressLine2, setAddressLine2] = useState<string>('');
  const [addressLine3, setAddressLine3] = useState<string>('');
  const [city, setCity] = useState<string>('');
  const [county, setCounty] = useState<string>('');
  const [postcode, setPostcode] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');

  const { addAuthorizedSignPage: t } = translations;
  const router = useRouter();

  const titleOptions = [
    { value: 'Mr', label: 'Mr' },
    { value: 'Mrs', label: 'Mrs' },
    { value: 'Miss', label: 'Miss' },
    { value: 'Ms', label: 'Ms' },
    { value: 'Dr', label: 'Dr' },
  ];

  const addressAssociationOptions = [
    { value: 'Owner' as AddressAssociation, label: 'Owner' },
  ];

  const handleBackClick = (): void => {
    router.push('/confirm-name');
  };

  const validateForm = (): boolean => {
    if (
      !title ||
      !firstName ||
      !lastName ||
      !addressAssociation ||
      !email ||
      !confirmEmail ||
      !addressLine1 ||
      !city ||
      !postcode
    ) {
      setErrorMessage(t.requiredFieldsError);
      return false;
    }

    if (email !== confirmEmail) {
      setErrorMessage(t.emailMismatchError);
      return false;
    }

    return true;
  };

  const handleSubmitClick = (): void => {
    setErrorMessage('');

    if (!validateForm()) {
      return;
    }

    // TODO: Submit form data - navigation to next step TBD
    console.warn('Form submitted successfully', {
      title,
      firstName,
      lastName,
      addressAssociation,
      email,
      mobile,
      addressLine1,
      addressLine2,
      addressLine3,
      city,
      county,
      postcode,
    });
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
            <div className="flex flex-col gap-2 mb-6">
              <h2 className="text-base font-bold text-white">{t.formHeading}</h2>
              <p className="text-sm text-white">{t.formDescription}</p>
            </div>

            <div className="h-px w-[24px] bg-white/20 mb-6 mx-auto" />

            <h3 className="text-base font-bold text-white mb-6">
              {t.signatoryDetailsHeading}
            </h3>

            <div className="space-y-5">
              <Select
                label={t.titleLabel}
                placeholder={t.titlePlaceholder}
                options={titleOptions}
                value={title}
                onChange={setTitle}
              />

              <Input
                label={t.firstNameLabel}
                placeholder={t.firstNamePlaceholder}
                value={firstName}
                onChange={setFirstName}
              />

              <Input
                label={t.lastNameLabel}
                placeholder={t.lastNamePlaceholder}
                value={lastName}
                onChange={setLastName}
              />

              <Select
                label={t.addressAssociationLabel}
                placeholder={t.addressAssociationPlaceholder}
                options={addressAssociationOptions}
                value={addressAssociation}
                onChange={setAddressAssociation}
              />

              <Input
                label={t.emailLabel}
                type="email"
                placeholder={t.emailPlaceholder}
                value={email}
                onChange={setEmail}
              />

              <Input
                label={t.confirmEmailLabel}
                type="email"
                placeholder={t.confirmEmailPlaceholder}
                value={confirmEmail}
                onChange={setConfirmEmail}
              />

              <Input
                label={t.mobileLabel}
                type="tel"
                placeholder={t.mobilePlaceholder}
                value={mobile}
                onChange={setMobile}
              />

              <div className="flex flex-col gap-2">
                <label className="text-xs text-white">{t.correspondenceAddressLabel}</label>
                <div className="space-y-2">
                  <Input
                    label=""
                    placeholder={t.addressLine1Placeholder}
                    value={addressLine1}
                    onChange={setAddressLine1}
                    className="gap-0"
                  />

                  <Input
                    label=""
                    placeholder={t.addressLine2Placeholder}
                    value={addressLine2}
                    onChange={setAddressLine2}
                    className="gap-0"
                  />

                  <Input
                    label=""
                    placeholder={t.addressLine3Placeholder}
                    value={addressLine3}
                    onChange={setAddressLine3}
                    className="gap-0"
                  />

                  <Input
                    label=""
                    placeholder={t.cityPlaceholder}
                    value={city}
                    onChange={setCity}
                    className="gap-0"
                  />

                  <Input
                    label=""
                    placeholder={t.countyPlaceholder}
                    value={county}
                    onChange={setCounty}
                    className="gap-0"
                  />

                  <Input
                    label=""
                    placeholder={t.postcodePlaceholder}
                    value={postcode}
                    onChange={setPostcode}
                    className="gap-0"
                  />
                </div>
              </div>
            </div>
          </div>

          <p className="text-xs text-white text-center leading-[18px]">
            {t.legalBasisText}
          </p>

          {errorMessage && <ButtonErrorLabel message={errorMessage} />}

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
              text={t.submitButton}
              kind="primary"
              onClick={handleSubmitClick}
            />
          </div>

          <p className="text-xs text-center text-white/80 pt-4">
            {t.dataHandlingText}
          </p>
        </ContentWrapper>
      </main>
      <CustomerPrivacy />
    </div>
  );
}
