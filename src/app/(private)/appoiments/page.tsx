import Link from 'next/link';
import { ContentLayout } from '@/components/template/content-layout';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { NewAppointment } from './components/newAppointment';
import AppointmentTable from './components/table';

import { AppointmentsProvider } from '@/contexts/appoiments-context';
import { SessionProvider } from 'next-auth/react';

export default function AppoimentsPage() {
  return (
    <SessionProvider>
      <AppointmentsProvider>
        <ContentLayout title="Agendamentos">
          <div className="flex items-center justify-between">
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <Link href="/home">Dashboard</Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>Agendamentos</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
            <div>
              <NewAppointment />
            </div>
          </div>
          <div className="mt-8">
            <AppointmentTable />
          </div>
        </ContentLayout>
      </AppointmentsProvider>
    </SessionProvider>
  );
}
