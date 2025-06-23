import Layout from '@/components/template/layout';
import { SessionProvider } from 'next-auth/react';

export default function PrivateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Layout>
      <SessionProvider>{children}</SessionProvider>
    </Layout>
  );
}
