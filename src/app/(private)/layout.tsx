import Layout from '@/components/template/layout';
import { AppointmentsProvider } from '@/contexts/appoiments-context';
import { SessionProvider } from 'next-auth/react';

export default function PrivateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Layout>
      <SessionProvider>
        <AppointmentsProvider>{children}</AppointmentsProvider>
      </SessionProvider>
    </Layout>
  );
}
