'use client';
import Link from 'next/link';
import { ContentLayout } from '@/components/template/content-layout';
import { Card } from '@/components/ui/card';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const data = {
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
  datasets: [
    {
      label: 'Agendamentos',
      data: [10, 20, 30, 40, 50],
      backgroundColor: 'rgba(54, 162, 235, 0.6)',
    },
  ],
};

const options = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top' as const,
    },
    title: {
      display: true,
      text: 'Gráfico de agendamentos',
    },
  },
};
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { useSidebar } from '@/contexts/sidebar-context';

export default function DashboardPage() {
  const sidebar = useSidebar();
  if (!sidebar) return null;
  return (
    <ContentLayout title="Dashboard">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-6 shadow-lg border border-gray-200 rounded-lg">
          <h3 className="text-lg font-bold mb-2">Card 1</h3>
          <p className="text-gray-600">Conteúdo do Card 1</p>
        </Card>
        <Card className="p-6 shadow-lg border border-gray-200 rounded-lg">
          <h3 className="text-lg font-bold mb-2">Card 2</h3>
          <p className="text-gray-600">Conteúdo do Card 2</p>
        </Card>
        <Card className="p-6 shadow-lg border border-gray-200 rounded-lg">
          <h3 className="text-lg font-bold mb-2">Card 3</h3>
          <p className="text-gray-600">Conteúdo do Card 3</p>
        </Card>
        <Card className="p-6 shadow-lg border border-gray-200 rounded-lg">
          <h3 className="text-lg font-bold mb-2">Card 4</h3>
          <p className="text-gray-600">Conteúdo do Card 4</p>
        </Card>
      </div>
      <div className="mt-8">
        <Bar data={data} options={options} className="h-[600px]! w-full!" />
      </div>
    </ContentLayout>
  );
}
