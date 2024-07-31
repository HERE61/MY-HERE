'use client';

import { ResetPasswordValidationSchema } from '../definitions';
import { Field, FieldErrorAlert } from '../field';
import { useForm } from '@conform-to/react';
import { parseWithZod } from '@conform-to/zod';
import { Label } from '@radix-ui/react-label';
import { TriangleAlert } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useServerAction } from 'zsa-react';

import { PasswordInputConfirm } from '@/components/conform/input';
import { SubmitButton } from '@/components/submit-button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useToast } from '@/components/ui/use-toast';

import { resetPasswordAction } from './actions';

export default function ResetPasswordForm({ token }: { token: string }) {
  const { toast } = useToast();
  const router = useRouter();
  const { executeFormAction, isError } = useServerAction(resetPasswordAction, {
    onSuccess: () => {
      toast({
        title: '비밀번호가 성공적으로 변경되었습니다 🙌',
        description: '새 비밀번호로 로그인해 주세요',
      });
      router.replace('/login');
    },
  });

  const [form, fields] = useForm({
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: ResetPasswordValidationSchema });
    },
    shouldRevalidate: 'onInput',
    shouldValidate: 'onBlur',
  });

  return (
    <>
      <form
        id={form.id}
        onSubmit={form.onSubmit}
        className="flex flex-col gap-6"
        action={executeFormAction}
      >
        <input type="hidden" name="token" value={token} />
        <Field>
          <Label htmlFor="password">새로운 비밀번호</Label>
          <PasswordInputConfirm id="password" meta={fields.password} required />
          {fields.password.errors && (
            <FieldErrorAlert>{fields.password.errors}</FieldErrorAlert>
          )}
        </Field>
        <Field>
          <Label htmlFor="confirm-password">새로운 비밀번호 확인</Label>
          <PasswordInputConfirm
            id="confirm-password"
            meta={fields.confirmPassword}
            required
          />
          {fields.confirmPassword.errors && (
            <FieldErrorAlert>{fields.confirmPassword.errors}</FieldErrorAlert>
          )}
        </Field>
        <SubmitButton className="w-full">비밀번호 변경하기</SubmitButton>
      </form>
      <AlertDialog open={isError}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              비밀번호를 재설정하는 데 실패했습니다
              <TriangleAlert className="h-5 w-5 font-semibold text-red-500" />
            </AlertDialogTitle>
            <AlertDialogDescription>
              로그인을 다시하거나 비밀번호를 재설정하기 위해 이메일 링크를 새로
              받으세요
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction
              variant="outline"
              onClick={() => router.replace('/login')}
            >
              로그인하기
            </AlertDialogAction>
            <AlertDialogAction
              onClick={() => router.replace('/forgot-password')}
            >
              이메일 링크 받기
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
