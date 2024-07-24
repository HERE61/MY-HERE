import type { ReactNode } from 'react';

function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="grid min-h-screen place-items-center p-4">{children}</div>
  );
}

export default AuthLayout;
