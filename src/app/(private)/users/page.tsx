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
('');
import { NewUser } from './components/newUser';
import UserTable from './components/table';
import { UsersProvider } from '@/contexts/users-context';

export default function UsersPage() {
  return (
    <UsersProvider>
      <ContentLayout title="Usuários">
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
                <BreadcrumbPage>Usuários</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <div>
            <NewUser />
          </div>
        </div>
        <div className="mt-8">
          <UserTable />
        </div>
      </ContentLayout>
    </UsersProvider>
  );
}
