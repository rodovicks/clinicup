import Layout from '@/components/template/layout';

export default function PrivateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <Layout>{children}</Layout>;
}
