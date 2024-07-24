import Link from 'next/link';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

import { LoginForm } from './login-form';

export default async function SignInPage() {
  return (
    <Card className="w-full max-w-md">
      <CardHeader className="text-center">
        <CardTitle>HERE 로그인</CardTitle>
        <CardDescription>HERE를 시작하기 위해 로그인하세요</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-2">
          <Button variant="outline" className="w-full" asChild>
            <Link href="/login/discord">카카오로 시작하기</Link>
          </Button>
          <Button variant="outline" className="w-full" asChild>
            <Link href="/login/discord">구글로 시작하기</Link>
          </Button>
        </div>
        <div className="my-2 flex items-center">
          <div className="flex-grow border-t" />
          <div className="mx-2 text-xs">또는</div>
          <div className="flex-grow border-t" />
        </div>
        <LoginForm />
      </CardContent>
    </Card>
  );
}
