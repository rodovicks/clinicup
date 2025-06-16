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
import { NewExamType } from './components/newExamType';
import { ExamTypesProvider } from '@/contexts/exams-context';
import ExamTypeTable from './components/table';

export default function ExamTypePage() {
  return (
    <ExamTypesProvider>
      <ContentLayout title="Tipo de exames">
        <div className="flex items-center justify-between">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link href="/dashboard">Dashboard</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Usuários</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <div>
            <NewExamType />
          </div>
        </div>
        <div className="mt-8">
          <ExamTypeTable />
        </div>
      </ContentLayout>
    </ExamTypesProvider>
  );
}
