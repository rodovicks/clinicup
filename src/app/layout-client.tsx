'use client';

import { GeistSans } from 'geist/font/sans';
import './globals.css';
import { Toaster } from '@/components/ui/sonner';
import { SidebarProvider } from '@/contexts/sidebar-context';

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <body className={GeistSans.className}>
      <SidebarProvider>{children}</SidebarProvider>
      <Toaster />
    </body>
  );
}
