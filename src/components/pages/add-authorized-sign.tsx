'use client';

import type { ReactNode } from 'react';
import { useState, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { ContentWrapper } from '@/components/layout/content-wrapper';
import { Header } from '@/components/common/header';
import { ProgressStepper } from '@/components/common/progress-stepper';
import { ButtonErrorLabel } from '@/components/common/button-error-label';
import { BackgroundPattern } from '@/components/common/background-pattern';
import {
  SignatoryDetailsForm,
  SIGNATORY_FORM_CONFIG,
  type SignatoryDetailsFormValue,
} from '@/components/common/signatory-details-form';
import { SignatoryFormCard } from '@/components/common/signatory-form-card';
import { SignatoryFormActions } from '@/components/common/signatory-form-actions';
import translations from '@/i18n/en.json';
import { CustomerPrivacy } from '@/components/common/customer-privacy';
import { useMatterDetails, type AddressAssociation } from '@/hooks/queries/use-matter-details';
import { useAddNewSignatory } from '@/hooks/queries/use-add-new-signatory';
import { TITLE_OPTIONS, ADDRESS_ASSOCIATION_OPTIONS } from '@/constants/signatory-options';
import { ROUTES } from '@/constants/routes';
import { EMAIL_REGEX, PHONE_REGEX } from '@/constants/validation';

type RequiredFormValue = Required<Omit<SignatoryDetailsFormValue, 'mobile'>> & { mobile: string | null };

/**
 * AddAuthorizedSign page collects and submits details for an authorised signatory.
 * Used when the logged-in user's name is not listed and they need to add a new signatory.
 * @returns ReactNode
 */
export function AddAuthorizedSign(): ReactNode {
  const [formValue, setFormValue] = useState<RequiredFormValue>({
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
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [selectedSignatoryId, setSelectedSignatoryId] = useState<string | null>(null);

  const { addAuthorizedSignPage: t, signatoryDetailsForm: tForm } = translations;
  const router = useRouter();
  const { data: matterData } = useMatterDetails();
  const { addNewSignatory, isPending } = useAddNewSignatory();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setSelectedSignatoryId(sessionStorage.getItem('selectedSignatoryId'));
    }
  }, []);

  const handleFormChange = useCallback((field: keyof RequiredFormValue, value: string): void => {
    setFormValue((prev) => ({ ...prev, [field]: value }));
  }, []);

  const handleBackClick = (): void => {
    router.push(ROUTES.CONFIRM_NAME);
  };

  const validateForm = (): boolean => {
    const { title, firstName, lastName, addressAssociation, email, confirmEmail, mobile, addressLine1, town, postcode } = formValue;

    if (!title || !firstName || !lastName || !addressAssociation || !email || !confirmEmail || !mobile || !addressLine1 || !town || !postcode) {
      setErrorMessage(tForm.requiredFieldsError);
      return false;
    }

    if (!EMAIL_REGEX.test(email)) {
      setErrorMessage(tForm.invalidEmailError);
      return false;
    }

    if (email !== confirmEmail) {
      setErrorMessage(tForm.emailMismatchError);
      return false;
    }

    if (!PHONE_REGEX.test(mobile)) {
      setErrorMessage(tForm.invalidMobileError);
      return false;
    }

    return true;
  };

  const handleSubmitClick = async (): Promise<void> => {
    setErrorMessage('');

    if (!validateForm()) {
      return;
    }

    const currentSignatory = matterData?.signatories.find(
      (s) => s.signatoryId === selectedSignatoryId
    );

    const { title, firstName, lastName, addressAssociation, email, mobile, addressLine1, addressLine2, addressLine3, town, county, postcode } = formValue;

    try {
      await addNewSignatory({
        signatory: {
          signatoryId: currentSignatory?.signatoryId ?? '',
          envelopeId: currentSignatory?.envelopeId ?? '',
          title,
          firstname: firstName,
          surname: lastName,
          addressAssociation: addressAssociation as AddressAssociation,
          emailAddress: email,
          mobile,
          agreementShareMethod: 'Unspecified',
          correspondenceAddress: {
            addressLine1,
            addressLine2,
            addressLine3,
            addressLine4: '',
            town,
            county,
            postcode,
          },
        },
      });
      router.push(ROUTES.CONFIRM_SIGNATORY);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'An error occurred while adding signatory');
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

          <SignatoryFormCard
            heading={t.formHeading}
            description={t.formDescription}
            signatoryDetailsHeading={t.signatoryDetailsHeading}
          >
            <SignatoryDetailsForm
              value={formValue}
              onChange={handleFormChange}
              config={SIGNATORY_FORM_CONFIG.addAuthorizedSign}
              titleOptions={TITLE_OPTIONS}
              addressAssociationOptions={ADDRESS_ASSOCIATION_OPTIONS}
            />
          </SignatoryFormCard>

          <p className="text-xs text-white text-center leading-[18px]">
            {t.legalBasisText}
          </p>

          {errorMessage && <ButtonErrorLabel message={errorMessage} />}

          <SignatoryFormActions
            backButtonLabel={t.backButtonLabel}
            submitButtonText={t.submitButton}
            onBackClick={handleBackClick}
            onSubmitClick={handleSubmitClick}
            isPending={isPending}
            dataHandlingText={t.dataHandlingText}
          />
        </ContentWrapper>
      </main>
      <CustomerPrivacy />
    </div>
  );
}
