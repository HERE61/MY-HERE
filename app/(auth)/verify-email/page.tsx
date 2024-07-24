import { redirect } from 'next/navigation';

import { validateRequest } from '@/lib/auth';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

import { logoutAction } from '@/app/actions';

import VerifyCodeForm from './verify-code-form';

export default async function VerifyEmailPage() {
  const { user } = await validateRequest();

  if (!user) redirect('/login');

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>이메일 인증</CardTitle>
        <CardDescription>
          <strong>{user.email}</strong>으로 인증코드가 전송되었습니다.
          <br /> 이메일을 찾을 수 없는 경우 스팸 폴더를 확인하세요.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <VerifyCodeForm />
        <form>
          <Button
            variant="link"
            size="sm"
            className="mt-4 h-auto p-0"
            formAction={logoutAction}
          >
            다른 이메일을 사용하고 싶나요?
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
