'use client';

import Link from 'next/link';
import { useServerAction } from 'zsa-react';

import { SubmitButton } from '@/components/submit-button';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';

import { resetPasswordAction } from './actions';

export function ForgotPasswordForm() {
  const { toast } = useToast();
  const { executeFormAction, isError, error } = useServerAction(
    resetPasswordAction,
    {
      onSuccess: () => {
        toast({
          title: '이메일을 확인해주세요',
          description: '비밀번호 재설정 링크가 발송되었습니다',
        });
      },
    }
  );

  return (
    <form className="flex flex-col gap-4" action={executeFormAction}>
      <div className="space-y-2">
        <Label>이메일</Label>
        <Input required name="email" type="email" autoComplete="email" />
      </div>
      <Button
        variant="link"
        size="sm"
        className="h-auto justify-start p-0"
        asChild
      >
        <Link href="/signup">회원가입하지 않으셨나요? 지금 가입하세요</Link>
      </Button>
      {isError && (
        <p className="rounded-lg border bg-[#f1464d] bg-opacity-10 p-2 text-[0.8rem] font-medium text-[#f1464d]">
          {error.message || error.data}
        </p>
      )}
      <SubmitButton className="w-full">비밀번호 초기화하기</SubmitButton>
    </form>
  );
}
