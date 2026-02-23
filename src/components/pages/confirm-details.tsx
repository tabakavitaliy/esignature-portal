'use client';

import type { ReactNode } from 'react';
import { useState, useMemo, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { ContentWrapper } from '@/components/layout/content-wrapper';
import { Header } from '@/components/common/header';
import { ProgressStepper } from '@/components/common/progress-stepper';
import { Checkbox } from '@/components/common/checkbox';
import {
  SignatoryDetailsForm,
  SIGNATORY_FORM_CONFIG,
  type SignatoryDetailsFormValue,
} from '@/components/common/signatory-details-form';
import { Button } from '@/components/common/button';
import { ButtonErrorLabel } from '@/components/common/button-error-label';
import { BackgroundPattern } from '@/components/common/background-pattern';
import translations from '@/i18n/en.json';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { useMatterDetails, type Signatory } from '@/hooks/queries/use-matter-details';
import { useUpdateSignatory } from '@/hooks/queries/use-update-signatory';
import { CustomerPrivacy } from '@/components/common/customer-privacy';
import { TITLE_OPTIONS } from '@/constants/signatory-options';
import { ROUTES } from '@/constants/routes';
import { EMAIL_REGEX } from '@/constants/validation';

/**
 * ConfirmDetails component displays the details confirmation page
 * @returns ReactNode
 */
export function ConfirmDetails(): ReactNode {
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const [isConfirmed, setIsConfirmed] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [selectedSignatoryId, setSelectedSignatoryId] = useState<string | null>(null);

  const [formValue, setFormValue] = useState<SignatoryDetailsFormValue>({
    title: '',
    firstName: '',
    lastName: '',
    addressAssociation: '',
    email: '',
    confirmEmail: '',
    mobile: null,
    addressLine1: '',
    addressLine2: '',
    addressLine3: '',
    town: '',
    county: '',
    postcode: '',
  });

  const handleFormChange = useCallback(
    (field: keyof SignatoryDetailsFormValue, value: string): void => {
      setFormValue((prev) => ({ ...prev, [field]: value }));
    },
    []
  );

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

  const {
    title,
    firstName,
    lastName,
    email,
    confirmEmail,
    mobile,
    addressLine1,
    addressLine2,
    town,
    postcode,
  } = formValue;

  const currentSignatory = useMemo(() => {
    if (selectedSignatoryId && data?.signatories) {
      return data.signatories.find((s) => s.signatoryId === selectedSignatoryId);
    }
    return undefined;
  }, [selectedSignatoryId, data]);

  useEffect(() => {
    if (selectedSignatoryId && data?.signatories) {
      const signatory = data.signatories.find((s) => s.signatoryId === selectedSignatoryId);

      if (signatory) {
        setFormValue({
          title: signatory.title,
          firstName: signatory.firstname,
          lastName: signatory.surname,
          email: signatory.emailAddress,
          mobile: signatory.mobile || null,
          addressLine1: signatory.correspondenceAddress?.addressLine1,
          addressLine2: signatory.correspondenceAddress?.addressLine2 || '',
          town: signatory.correspondenceAddress?.town,
          postcode: signatory.correspondenceAddress?.postcode || '',
        });
      }
    }
  }, [selectedSignatoryId, data]);

  const handleBackClick = (): void => {
    router.push(ROUTES.CONFIRM_NAME);
  };

  const handleEditClick = (): void => {
    setIsEditMode(true);
  };

  const validateForm = (): boolean => {
    if (!title || !firstName || !lastName || !email) {
      setErrorMessage(t.requiredFieldsError);
      return false;
    }

    if (!EMAIL_REGEX.test(email)) {
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
        mobile: mobile ?? '',
        agreementShareMethod: currentSignatory.agreementShareMethod,
        correspondenceAddress: {
          addressLine1: addressLine1 ?? '',
          addressLine2: addressLine2 ?? '',
          addressLine3: currentSignatory.correspondenceAddress?.addressLine3 ?? '',
          addressLine4: currentSignatory.correspondenceAddress?.addressLine4 ?? '',
          town: town ?? '',
          county: currentSignatory.correspondenceAddress?.county ?? '',
          postcode: postcode ?? '',
        },
      };

      try {
        await updateSignatory({ signatory });
        await refetch();
        router.push(ROUTES.CONFIRM_SIGNATORY);
      } catch (error) {
        setErrorMessage(
          error instanceof Error ? error.message : 'An error occurred while updating signatory'
        );
      }
    } else {
      if (!isConfirmed) {
        setErrorMessage(t.confirmDetailsError);
        return;
      }
      router.push(ROUTES.CONFIRM_SIGNATORY);
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
              'flex-1 rounded-2xl px-4 py-5',
              'bg-[var(--login-card-bg)] backdrop-blur-sm'
            )}
          >
            <p className="text-sm text-white mb-6">{t.description}</p>

            <div className="h-px w-[24px] bg-white/20 mb-6 mx-auto" />

            <div className="flex justify-between items-center mb-6">
              <h3 className="text-base font-bold text-white">{t.signatoryDetailsHeading}</h3>
              {!isEditMode && (
                <Button
                  text={t.editButton}
                  kind="secondary"
                  onClick={handleEditClick}
                  className="w-auto px-6 h-9 text-sm border-0 shadow-none"
                  iconBefore={
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 14 14"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M6 1.98744H1.91667C1.60725 1.98744 1.3105 2.11035 1.09171 2.32915C0.872916 2.54794 0.75 2.84468 0.75 3.1541V11.3208C0.75 11.6302 0.872916 11.9269 1.09171 12.1457C1.3105 12.3645 1.60725 12.4874 1.91667 12.4874H10.0833C10.3928 12.4874 10.6895 12.3645 10.9083 12.1457C11.1271 11.9269 11.25 11.6302 11.25 11.3208V7.23744M10.375 1.11244C10.6071 0.880372 10.9218 0.75 11.25 0.75C11.5782 0.75 11.8929 0.880372 12.125 1.11244C12.3571 1.3445 12.4874 1.65925 12.4874 1.98744C12.4874 2.31563 12.3571 2.63037 12.125 2.86244L6.58333 8.4041L4.25 8.98744L4.83333 6.6541L10.375 1.11244Z"
                        stroke="white"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  }
                />
              )}
            </div>

            <SignatoryDetailsForm
              value={formValue}
              onChange={handleFormChange}
              disabled={!isEditMode}
              config={SIGNATORY_FORM_CONFIG.confirmDetails}
              titleOptions={TITLE_OPTIONS}
            />
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
