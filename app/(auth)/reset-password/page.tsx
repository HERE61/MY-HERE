import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

import ResetPasswordForm from './reset-password-form';

export default function ResetPasswordPage({
  searchParams,
}: {
  searchParams: { token: string };
}) {
  return (
    <Card className="w-full max-w-md">
      <CardHeader className="space-y-1">
        <CardTitle>비밀번호를 다시 설정하세요</CardTitle>
        <CardDescription>새 비밀번호를 입력하세요</CardDescription>
      </CardHeader>
      <CardContent>
        <ResetPasswordForm token={searchParams.token} />
      </CardContent>
    </Card>
  );
}
