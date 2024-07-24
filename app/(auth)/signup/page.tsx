import Link from 'next/link';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

import SignupForm from './signup-form';

export default async function SignUpPage() {
  return (
    <Card className="w-full max-w-md">
      <CardHeader className="text-center">
        <CardTitle>HERE 회원가입</CardTitle>
        <CardDescription>가입하시고 HERE를 시작하세요</CardDescription>
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
        <SignupForm />
      </CardContent>
    </Card>
  );
}
