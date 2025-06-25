'use client';

import { SessionProvider } from 'next-auth/react';
import FormChangePassword from './components/formChange';

export default function ChangePassword() {
  return (
    <SessionProvider>
      <FormChangePassword />
    </SessionProvider>
  );
}
