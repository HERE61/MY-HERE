'use client';

import { SubmitErrorAlert } from '../field';
import Link from 'next/link';
import { useServerAction } from 'zsa-react';

import { PasswordInput } from '@/components/password-input';
import { SubmitButton } from '@/components/submit-button';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import { signInAction } from './actions';

export function LoginForm() {
  const {
    executeFormAction: executeLogin,
    isError,
    error,
  } = useServerAction(signInAction);

  return (
    <form action={executeLogin} className="grid gap-4">
      <div className="space-y-2">
        <Label>이메일</Label>
        <Input
          required
          placeholder="email@example.com"
          autoComplete="email"
          name="email"
          type="email"
        />
      </div>

      <div className="space-y-2">
        <Label>비밀번호</Label>
        <PasswordInput
          name="password"
          required
          autoComplete="current-password"
        />
      </div>

      <div className="flex flex-wrap justify-between gap-1">
        <Button variant="link" size="sm" className="h-auto p-0" asChild>
          <Link href="/signup">회원이 아니신가요? 지금 가입하세요.</Link>
        </Button>
        <Button variant="link" size="sm" className="h-auto p-0" asChild>
          <Link href="/forgot-password">비밀번호를 잊으셨나요?</Link>
        </Button>
      </div>
      {isError && (
        <SubmitErrorAlert
          title="로그인에 실패하였습니다"
          description={error.message}
        />
      )}
      <SubmitButton className="w-full">로그인</SubmitButton>
    </form>
  );
}
