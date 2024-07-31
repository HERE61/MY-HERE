import Link from 'next/link';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

import { ForgotPasswordForm } from './forgot-password-form';

export const metadata = {
  title: 'Reset Password',
  description: 'Reset Password Page',
};

export default function ForgotPasswordPage() {
  return (
    <Card className="w-full max-w-md">
      <CardHeader className="space-y-1">
        <CardTitle>비밀번호를 잊으셨나요?</CardTitle>
        <CardDescription>
          비밀번호를 새로 설정하시거나 다른 방법으로 로그인하세요
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ForgotPasswordForm />
        <div className="my-2 flex items-center">
          <div className="flex-grow border-t" />
          <div className="mx-2 text-sm">또는</div>
          <div className="flex-grow border-t" />
        </div>
        <div className="flex flex-col gap-2">
          <Button variant="outline" className="w-full" asChild>
            <Link href="api/login/kakao">카카오로 시작하기</Link>
          </Button>
          <Button variant="outline" className="w-full" asChild>
            <Link href="api/login/google">구글로 시작하기</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
