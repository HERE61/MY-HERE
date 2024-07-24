'use server';

import { redirect } from 'next/navigation';

import { logout } from '@/lib/session';

export const logoutAction = async () => {
  try {
    await logout();
    redirect('/login');
  } catch (err) {
    console.error(err);
    redirect('/login');
  }
};
