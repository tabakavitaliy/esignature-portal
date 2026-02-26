'use client';

import type { ReactNode } from 'react';
import { useState, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { ContentWrapper } from '@/components/layout/content-wrapper';
import { Header } from '@/components/common/header';
import { ProgressStepper } from '@/components/common/progress-stepper';
import { Button } from '@/components/common/button';
import { ButtonErrorLabel } from '@/components/common/button-error-label';
import { BackgroundPattern } from '@/components/common/background-pattern';
import {
  SignatoryDetailsForm,
  SIGNATORY_FORM_CONFIG,
  type SignatoryDetailsFormValue,
} from '@/components/common/signatory-details-form';
import translations from '@/i18n/en.json';
import { ArrowLeft } from 'lucide-react';
import { CustomerPrivacy } from '@/components/common/customer-privacy';
import { useMatterDetails, type AddressAssociation } from '@/hooks/queries/use-matter-details';
import { useAddSignatory } from '@/hooks/queries/use-add-signatory';
import { TITLE_OPTIONS, ADDRESS_ASSOCIATION_OPTIONS } from '@/constants/signatory-options';
import { ROUTES } from '@/constants/routes';
import { EMAIL_REGEX, PHONE_REGEX } from '@/constants/validation';

type RequiredFormValue = Required<Omit<SignatoryDetailsFormValue, 'mobile'>> & { mobile: string | null };

/**
 * NotAuthorizedSignatory page for the "No, I do not have authority" flow.
 * Collects details of an authorised person who can sign the wayleave agreement.
 * @returns ReactNode
 */
export function NotAuthorizedSignatory(): ReactNode {
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

  const { notAuthorizedSignatoryPage: t, signatoryDetailsForm: tForm } = translations;
  const router = useRouter();
  const { data: matterData } = useMatterDetails();
  const { addSignatory, isPending } = useAddSignatory();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setSelectedSignatoryId(sessionStorage.getItem('selectedSignatoryId'));
    }
  }, []);

  const handleFormChange = useCallback((field: keyof RequiredFormValue, value: string): void => {
    setFormValue((prev) => ({ ...prev, [field]: value }));
  }, []);

  const handleBackClick = (): void => {
    router.push(ROUTES.CONFIRM_SIGNATORY);
  };

  const validateForm = (): boolean => {
    const { title, firstName, lastName, addressAssociation, email, confirmEmail, mobile, addressLine1, town, postcode } = formValue;

    if (!title || !firstName || !lastName || !addressAssociation || !email || !confirmEmail || !addressLine1 || !town || !postcode) {
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

    if (mobile && !PHONE_REGEX.test(mobile)) {
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
      await addSignatory({
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
            town,
            county,
            postcode,
          },
        },
      });
      router.push(ROUTES.THANK_YOU);
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
          <ProgressStepper stepCount={4} currentStep={4} className="self-center" />

          <div
            className={cn(
              'flex-1 rounded-2xl px-4 py-5',
              'bg-[var(--login-card-bg)] backdrop-blur-sm'
            )}
          >
            <div className="flex flex-col gap-2 mb-4">
              <h2 className="text-base font-bold text-white">{t.formHeading}</h2>
              <p className="text-sm text-white">{t.formDescription}</p>
            </div>

            <div className="h-px w-[24px] bg-white/20 mb-4 mx-auto" />

            <h3 className="text-base font-bold text-white mb-6">
              {t.signatoryDetailsHeading}
            </h3>

            <SignatoryDetailsForm
              value={formValue}
              onChange={handleFormChange}
              config={SIGNATORY_FORM_CONFIG.notAuthorizedSignatory}
              titleOptions={TITLE_OPTIONS}
              addressAssociationOptions={ADDRESS_ASSOCIATION_OPTIONS}
            />
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
              disabled={isPending}
            />
          </div>
        </ContentWrapper>
      </main>
      <CustomerPrivacy />
    </div>
  );
}
