'use client';
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
import AppointmentTable from './components/table';
import { AppointmentsProvider } from '@/contexts/appoiments-context';
import { useEffect, useState } from 'react';
import axios from 'axios';

export default function AppoimentsPage() {
  const [examTypes, setExamTypes] = useState<
    Array<{ id: string; name: string; defaultDuration?: number }>
  >([]);

  useEffect(() => {
    const fetchExamTypes = async () => {
      try {
        const response = await axios.get('/api/exam/types');
        setExamTypes(response.data.data || []);
      } catch (error) {
        console.error('Erro ao buscar tipos de exame:', error);
      }
    };
    fetchExamTypes();
  }, []);

  return (
    <AppointmentsProvider>
      <ContentLayout title="Atendimentos">
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
                <BreadcrumbPage>Atendimentos</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
        <div className="mt-8">
          <AppointmentTable examTypes={examTypes} />
        </div>
      </ContentLayout>
    </AppointmentsProvider>
  );
}
