'use client';

import type { ReactNode } from 'react';
import { useState, useMemo, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { ContentWrapper } from '@/components/layout/content-wrapper';
import { Header } from '@/components/common/header';
import { ProgressStepper } from '@/components/common/progress-stepper';
import { Select } from '@/components/common/select';
import { Input } from '@/components/common/input';
import { Checkbox } from '@/components/common/checkbox';
import { Button } from '@/components/common/button';
import { ButtonErrorLabel } from '@/components/common/button-error-label';
import { BackgroundPattern } from '@/components/common/background-pattern';
import translations from '@/i18n/en.json';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { useMatterDetails, type Signatory } from '@/hooks/queries/use-matter-details';
import { useUpdateSignatory } from '@/hooks/queries/use-update-signatory';
import { CustomerPrivacy } from '@/components/common/customer-privacy';

/**
 * ConfirmDetails component displays the details confirmation page
 * @returns ReactNode
 */
export function ConfirmDetails(): ReactNode {
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const [isConfirmed, setIsConfirmed] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [selectedSignatoryId, setSelectedSignatoryId] = useState<string | null>(null);
  
  const [title, setTitle] = useState<string>('');
  const [firstName, setFirstName] = useState<string>('');
  const [lastName, setLastName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [confirmEmail, setConfirmEmail] = useState<string>('');
  const [mobile, setMobile] = useState<string>('');
  const [addressLine1, setAddressLine1] = useState<string>('');
  const [addressLine2, setAddressLine2] = useState<string>('');
  const [addressLine3, setAddressLine3] = useState<string>('');
  const [town, setTown] = useState<string>('');
  const [county, setCounty] = useState<string>('');
  const [postcode, setPostcode] = useState<string>('');

  const { confirmDetailsPage: t } = translations;
  const router = useRouter();
  const { data, isLoading: _isLoading, error: _error, refetch } = useMatterDetails();
  const { updateSignatory, isPending } = useUpdateSignatory();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedId = sessionStorage.getItem('selectedSignatoryId');
      setSelectedSignatoryId(storedId);
    }
  }, []);

  const titleOptions = useMemo(() => [
    { value: 'Mr', label: 'Mr' },
    { value: 'Mrs', label: 'Mrs' },
    { value: 'Miss', label: 'Miss' },
    { value: 'Ms', label: 'Ms' },
    { value: 'Dr', label: 'Dr' },
  ], []);

  const currentSignatory = useMemo(() => {
    if (selectedSignatoryId && data?.signatories) {
      return data.signatories.find(
        (s) => s.signatoryId === selectedSignatoryId
      );
    }
    return undefined;
  }, [selectedSignatoryId, data]);

  useEffect(() => {
    if (selectedSignatoryId && data?.signatories) {
      const signatory = data.signatories.find(
        (s) => s.signatoryId === selectedSignatoryId
      );
      
      if (signatory) {
        setTitle(signatory.title);
        setFirstName(signatory.firstname);
        setLastName(signatory.surname);
        setEmail(signatory.emailAddress);
        setConfirmEmail(signatory.emailAddress);
        setMobile(signatory.mobile || '');
        setAddressLine1(signatory.correspondenceAddress?.addressLine1 || '');
        setAddressLine2(signatory.correspondenceAddress?.addressLine2 || '');
        setAddressLine3(signatory.correspondenceAddress?.addressLine3 || '');
        setTown(signatory.correspondenceAddress?.town || '');
        setCounty(signatory.correspondenceAddress?.county || '');
        setPostcode(signatory.correspondenceAddress?.postcode || '');
      }
    }
  }, [selectedSignatoryId, data]);

  const handleBackClick = (): void => {
    router.push('/confirm-name');
  };

  const handleEditClick = (): void => {
    setIsEditMode(true);
  };

  const validateForm = (): boolean => {
    if (!title || !firstName || !lastName || !email) {
      setErrorMessage(t.requiredFieldsError);
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setErrorMessage(t.invalidEmailError);
      return false;
    }

    if (email !== confirmEmail) {
      setErrorMessage(t.emailMismatchError);
      return false;
    }

    return true;
  };

  const handleNextClick = async (): Promise<void> => {
    setErrorMessage('');

    if (isEditMode) {
      if (!validateForm()) {
        return;
      }

      if (!isConfirmed) {
        setErrorMessage(t.confirmDetailsError);
        return;
      }

      if (!selectedSignatoryId || !currentSignatory) {
        setErrorMessage('Signatory information is not available');
        return;
      }

      const signatory: Signatory = {
        signatoryId: selectedSignatoryId,
        envelopeId: currentSignatory.envelopeId,
        title,
        firstname: firstName,
        surname: lastName,
        addressAssociation: currentSignatory.addressAssociation,
        emailAddress: email,
        mobile,
        agreementShareMethod: currentSignatory.agreementShareMethod,
        correspondenceAddress: {
          addressLine1,
          addressLine2,
          addressLine3,
          addressLine4: currentSignatory.correspondenceAddress?.addressLine4 ?? '',
          town,
          county,
          postcode,
        },
      };

      try {
        await updateSignatory({ signatory });
        await refetch();
        router.push('/confirm-signatory');
      } catch (error) {
        setErrorMessage(error instanceof Error ? error.message : 'An error occurred while updating signatory');
      }
    } else {
      if (!isConfirmed) {
        setErrorMessage(t.confirmDetailsError);
        return;
      }
      router.push('/confirm-signatory');
    }
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

            <div className="flex justify-between items-center mb-6">
              <h3 className="text-base font-bold text-white">
                {t.signatoryDetailsHeading}
              </h3>
              {!isEditMode && (
                <Button
                  text={t.editButton}
                  kind="secondary"
                  onClick={handleEditClick}
                  className="w-auto px-6 h-9 text-sm border-0 shadow-none"
                  iconBefore={
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M6 1.98744H1.91667C1.60725 1.98744 1.3105 2.11035 1.09171 2.32915C0.872916 2.54794 0.75 2.84468 0.75 3.1541V11.3208C0.75 11.6302 0.872916 11.9269 1.09171 12.1457C1.3105 12.3645 1.60725 12.4874 1.91667 12.4874H10.0833C10.3928 12.4874 10.6895 12.3645 10.9083 12.1457C11.1271 11.9269 11.25 11.6302 11.25 11.3208V7.23744M10.375 1.11244C10.6071 0.880372 10.9218 0.75 11.25 0.75C11.5782 0.75 11.8929 0.880372 12.125 1.11244C12.3571 1.3445 12.4874 1.65925 12.4874 1.98744C12.4874 2.31563 12.3571 2.63037 12.125 2.86244L6.58333 8.4041L4.25 8.98744L4.83333 6.6541L10.375 1.11244Z" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  }
                />
              )}
            </div>

            <div className="space-y-5">
              <Select
                label={t.titleLabel}
                placeholder={t.titlePlaceholder}
                options={titleOptions}
                value={title}
                onChange={setTitle}
                disabled={!isEditMode}
              />

              <Input
                label={t.firstNameLabel}
                placeholder={t.firstNameLabel}
                value={firstName}
                onChange={setFirstName}
                disabled={!isEditMode}
              />

              <Input
                label={t.lastNameLabel}
                placeholder={t.lastNameLabel}
                value={lastName}
                onChange={setLastName}
                disabled={!isEditMode}
              />

              <Input
                label={t.emailLabel}
                type="email"
                placeholder={t.emailLabel}
                value={email}
                onChange={setEmail}
                disabled={!isEditMode}
              />

              {isEditMode && (
                <Input
                  label={t.confirmEmailLabel}
                  type="email"
                  placeholder={t.confirmEmailLabel}
                  value={confirmEmail}
                  onChange={setConfirmEmail}
                  disabled={!isEditMode}
                />
              )}

              {(isEditMode || mobile) && (
                <Input
                  label={t.mobileLabel}
                  type="tel"
                  placeholder={t.mobileLabel}
                  value={mobile}
                  onChange={setMobile}
                  disabled={!isEditMode}
                />
              )}

              {(isEditMode || addressLine1 || addressLine2 || addressLine3 || town || county || postcode) && (
                <div className="flex flex-col gap-2">
                  <label className="text-xs text-white">{t.correspondenceAddressLabel}</label>
                  <div className="space-y-2">
                    {(isEditMode || addressLine1) && (
                      <Input
                        label=""
                        placeholder={t.addressLine1Label}
                        value={addressLine1}
                        onChange={setAddressLine1}
                        disabled={!isEditMode}
                        className="gap-0"
                      />
                    )}

                    {(isEditMode || addressLine2) && (
                      <Input
                        label=""
                        placeholder={t.addressLine2Label}
                        value={addressLine2}
                        onChange={setAddressLine2}
                        disabled={!isEditMode}
                        className="gap-0"
                      />
                    )}

                    {(isEditMode || addressLine3) && (
                      <Input
                        label=""
                        placeholder={t.addressLine3Label}
                        value={addressLine3}
                        onChange={setAddressLine3}
                        disabled={!isEditMode}
                        className="gap-0"
                      />
                    )}

                    {(isEditMode || town) && (
                      <Input
                        label=""
                        placeholder={t.townLabel}
                        value={town}
                        onChange={setTown}
                        disabled={!isEditMode}
                        className="gap-0"
                      />
                    )}

                    {(isEditMode || county) && (
                      <Input
                        label=""
                        placeholder={t.countyLabel}
                        value={county}
                        onChange={setCounty}
                        disabled={!isEditMode}
                        className="gap-0"
                      />
                    )}

                    {(isEditMode || postcode) && (
                      <Input
                        label=""
                        placeholder={t.postcodeLabel}
                        value={postcode}
                        onChange={setPostcode}
                        disabled={!isEditMode}
                        className="gap-0"
                      />
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          <Checkbox
            label={t.confirmCheckboxLabel}
            value={isConfirmed}
            onChange={setIsConfirmed}
            className="mt-6"
          />

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
              text={isEditMode ? t.saveAndNextButton : t.nextButton}
              kind="primary"
              iconAfter={<ArrowRight className="h-5 w-5" />}
              onClick={handleNextClick}
              disabled={isPending}
            />
          </div>
        </ContentWrapper>
      </main>
      <CustomerPrivacy />
    </div>
  );
}
