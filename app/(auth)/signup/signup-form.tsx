'use client';

import { SignupFormSchema } from '../definitions';
import { Field, FieldErrorAlert, SubmitErrorAlert } from '../field';
import { useForm } from '@conform-to/react';
import { parseWithZod } from '@conform-to/zod';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useServerAction } from 'zsa-react';

import { InputConform, PasswordInputConfirm } from '@/components/conform/input';
import { SubmitButton } from '@/components/submit-button';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

import { signUpAction } from './actions';

export default function SignupForm() {
  const [isSubmitErrorShow, setIsSubmitErrorShow] = useState(false);
  const { error, executeFormAction, isError } = useServerAction(signUpAction);

  const [form, fields] = useForm({
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: SignupFormSchema });
    },
    shouldRevalidate: 'onInput',
    shouldValidate: 'onBlur',
  });

  useEffect(() => {
    if (isError) {
      setIsSubmitErrorShow(true);
    } else {
      setIsSubmitErrorShow(false);
    }
  }, [isError]);

  return (
    <form
      id={form.id}
      onSubmit={form.onSubmit}
      action={executeFormAction}
      className="flex flex-col gap-4"
      onInput={() => setIsSubmitErrorShow(false)}
    >
      <Field>
        <Label htmlFor={fields.email.id}>이메일</Label>
        <InputConform
          type="email"
          meta={fields.email}
          placeholder="email@example.com"
          required
        />
        {fields.email.errors && (
          <FieldErrorAlert>{fields.email.errors}</FieldErrorAlert>
        )}
      </Field>
      <Field>
        <Label>비밀번호</Label>
        <PasswordInputConfirm meta={fields.password} required />
        {fields.password.errors && (
          <FieldErrorAlert>{fields.password.errors}</FieldErrorAlert>
        )}
      </Field>
      {isSubmitErrorShow && error && (
        <SubmitErrorAlert
          title="회원가입에 실패했습니다"
          description={error.message}
        />
      )}
      <Button variant="link" size="sm" className="h-auto p-0" asChild>
        <Link href="/login">이미 가입하셨나요?</Link>
      </Button>
      <SubmitButton className="w-full">회원가입</SubmitButton>
    </form>
  );
}
