'use client';

import type { EmailVerifyFormSchema } from '../definitions';
import { REGEXP_ONLY_DIGITS_AND_CHARS } from 'input-otp';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import type { z } from 'zod';
import { useServerAction } from 'zsa-react';

import { LoadingButton } from '@/components/loading-button';
import { SubmitButton } from '@/components/submit-button';
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from '@/components/ui/input-otp';
import { useToast } from '@/components/ui/use-toast';

import { resendEmailAction, verifyEmailAction } from './actions';

export default function VerifyCodeForm() {
  const router = useRouter();
  const { toast } = useToast();
  const [code, setCode] = useState('');
  const {
    execute: executeVerifyEmail,
    isPending,
    error,
  } = useServerAction(verifyEmailAction, {
    onSuccess: () => {
      toast({
        title: '이메일이 인증되었습니다! 🙌',
        description: '가입해 주셔서 감사합니다, 즐거운 시간 보내세요',
      });
      router.replace('/');
    },
  });
  const {
    executeFormAction: executeResendEmailAction,
    error: resendEmailError,
  } = useServerAction(resendEmailAction, {
    onSuccess: () => {
      toast({
        title: '이메일을 확인해 주세요',
        description: '인증코드를 다시 보냈습니다',
      });
    },
  });

  useEffect(() => {
    if (error) {
      toast({
        title: '인증에 실패하였습니다',
        description: error.message,
        variant: 'destructive',
      });
    } else if (resendEmailError) {
      toast({
        title: '인증코드를 보내는데 실패했습니다',
        description: resendEmailError.message,
        variant: 'destructive',
      });
    }
  }, [error, toast, resendEmailError]);

  const onChangeOTPInput = (
    newValue: z.infer<typeof EmailVerifyFormSchema>['code']
  ) => {
    setCode(newValue);
    if (newValue.length === 6) {
      executeVerifyEmail({ code: newValue });
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          executeVerifyEmail({ code });
        }}
        id="verify-email"
      >
        <div className="flex w-full flex-col items-center gap-2">
          <InputOTP
            id="code"
            name="code"
            maxLength={6}
            pattern={REGEXP_ONLY_DIGITS_AND_CHARS}
            onChange={onChangeOTPInput}
            value={code}
          >
            <InputOTPGroup>
              <InputOTPSlot index={0} />
              <InputOTPSlot index={1} />
              <InputOTPSlot index={2} />
            </InputOTPGroup>
            <InputOTPSeparator />
            <InputOTPGroup>
              <InputOTPSlot index={3} />
              <InputOTPSlot index={4} />
              <InputOTPSlot index={5} />
            </InputOTPGroup>
          </InputOTP>
        </div>
        <LoadingButton className="mt-4 w-full" loading={isPending}>
          인증하기
        </LoadingButton>
      </form>
      <form action={executeResendEmailAction}>
        <SubmitButton className="w-full" variant="secondary">
          코드 재전송하기
        </SubmitButton>
      </form>
    </div>
  );
}
