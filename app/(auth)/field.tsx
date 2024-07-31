import { AlertTriangle } from 'lucide-react';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export function Field({ children }: { children: React.ReactNode }) {
  return <div className="flex flex-col gap-2">{children}</div>;
}

export function FieldErrorAlert({ children }: { children: React.ReactNode }) {
  return (
    <Alert variant="destructive" className="p-2">
      <div className="flex items-center gap-2">
        <AlertTriangle className="h-3.5 w-3.5" />
        <AlertTitle className="m-0 text-[0.8rem]">{children}</AlertTitle>
      </div>
    </Alert>
  );
}

export function SubmitErrorAlert({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <Alert variant="destructive">
      <AlertTriangle className="h-4 w-4" />
      <AlertTitle className="text-sm">{title}</AlertTitle>
      <AlertDescription className="text-[0.8rem]">
        {description}
      </AlertDescription>
    </Alert>
  );
}
