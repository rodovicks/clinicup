'use client';

import { useEffect, useState } from 'react';
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
import { useSidebar } from '@/contexts/sidebar-context';
import { useSession } from 'next-auth/react';
import {
  getDashboardData,
  type DashboardData,
  isAdminDashboard,
} from '@/services/api-dashboard-service';
import axios from 'axios';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const formatDate = (dateStr: string) => {
  return new Date(dateStr).toLocaleDateString('pt-BR');
};

const getWeeklyData = (weeklyData: Record<string, Record<string, number>>) => {
  const labels = Object.keys(weeklyData).map(formatDate);
  const datasets = [
    {
      label: 'Agendados',
      data: Object.values(weeklyData).map((day) => day.SCHEDULED),
      backgroundColor: 'rgba(54, 162, 235, 0.6)',
    },
    {
      label: 'Confirmados',
      data: Object.values(weeklyData).map((day) => day.CONFIRMED),
      backgroundColor: 'rgba(75, 192, 192, 0.6)',
    },
    {
      label: 'Em Espera',
      data: Object.values(weeklyData).map((day) => day.WAITING_APPOIMENT),
      backgroundColor: 'rgba(255, 206, 86, 0.6)',
    },
    {
      label: 'Em Atendimento',
      data: Object.values(weeklyData).map((day) => day.IN_APPOINTMENT),
      backgroundColor: 'rgba(153, 102, 255, 0.6)',
    },
    {
      label: 'Finalizados',
      data: Object.values(weeklyData).map((day) => day.FINISIHED),
      backgroundColor: 'rgba(75, 192, 192, 0.6)',
    },
    {
      label: 'Cancelados',
      data: Object.values(weeklyData).map((day) => day.CANCELED),
      backgroundColor: 'rgba(255, 99, 132, 0.6)',
    },
  ];

  return { labels, datasets };
};

const chartOptions = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top' as const,
    },
    title: {
      display: true,
      text: 'Status das Consultas - Últimos 7 dias',
    },
  },
  scales: {
    y: {
      beginAtZero: true,
      ticks: {
        precision: 0,
      },
    },
  },
};

export default function DashboardPage() {
  const { data: session } = useSession();
  const sidebar = useSidebar();
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadDashboard() {
      try {
        setLoading(true);
        const response = await axios.get<DashboardData>('/api/dashboard/');
        setDashboardData(response.data);
        setError(null);
      } catch (err) {
        console.error('Erro ao carregar dashboard:', err);
        setError('Não foi possível carregar os dados do dashboard');
      } finally {
        setLoading(false);
      }
    }

    loadDashboard();
  }, []);

  if (!sidebar) return null;

  if (loading) {
    return (
      <ContentLayout title="Dashboard">
        <div className="flex items-center justify-center min-h-[400px]">
          <p>Carregando dados...</p>
        </div>
      </ContentLayout>
    );
  }

  if (error || !dashboardData) {
    return (
      <ContentLayout title="Dashboard">
        <div className="text-center p-6">
          <h2 className="text-2xl font-bold mb-4">Erro</h2>
          <p>{error || 'Não foi possível carregar os dados do dashboard'}</p>
        </div>
      </ContentLayout>
    );
  }

  if (
    !session?.user?.role ||
    (session.user.role !== 'SECRETARIA' && session.user.role !== 'ADMIN')
  ) {
    return (
      <ContentLayout title="Dashboard">
        <div className="text-center p-6">
          <h2 className="text-2xl font-bold mb-4">Dashboard não disponível</h2>
          <p>Este dashboard é exclusivo para administradores e secretárias.</p>
        </div>
      </ContentLayout>
    );
  }

  const data = getWeeklyData(dashboardData.weeklyStatusCount);
  const isAdmin = session.user.role === 'ADMIN';

  return (
    <ContentLayout title="Dashboard">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {isAdmin && isAdminDashboard(dashboardData) ? (
          <>
            <Card className="p-6 shadow-lg border border-gray-200 rounded-lg">
              <h3 className="text-lg font-bold mb-2">Usuários Ativos</h3>
              <p className="text-3xl font-bold text-blue-600">
                {dashboardData.totalUsersActive}
              </p>
            </Card>
            <Card className="p-6 shadow-lg border border-gray-200 rounded-lg">
              <h3 className="text-lg font-bold mb-2">Total de Pacientes</h3>
              <p className="text-3xl font-bold text-green-600">
                {dashboardData.totalPatients}
              </p>
            </Card>
            <Card className="p-6 shadow-lg border border-gray-200 rounded-lg">
              <h3 className="text-lg font-bold mb-2">Tipos de Exames</h3>
              <p className="text-3xl font-bold text-purple-600">
                {dashboardData.totalExamTypes}
              </p>
            </Card>
            <Card className="p-6 shadow-lg border border-gray-200 rounded-lg">
              <h3 className="text-lg font-bold mb-2">Total de Consultas</h3>
              <p className="text-3xl font-bold text-orange-600">
                {dashboardData.totalAppoiments}
              </p>
            </Card>
          </>
        ) : (
          <>
            <Card className="p-6 shadow-lg border border-gray-200 rounded-lg">
              <h3 className="text-lg font-bold mb-2">Total de Pacientes</h3>
              <p className="text-3xl font-bold text-blue-600">
                {dashboardData.totalPatients}
              </p>
            </Card>
            <Card className="p-6 shadow-lg border border-gray-200 rounded-lg">
              <h3 className="text-lg font-bold mb-2">Consultas Totais</h3>
              <p className="text-3xl font-bold text-green-600">
                {dashboardData.totalAppoiments}
              </p>
            </Card>
            {!isAdmin && 'totalConfirmed' in dashboardData && (
              <Card className="p-6 shadow-lg border border-gray-200 rounded-lg">
                <h3 className="text-lg font-bold mb-2">
                  Consultas Confirmadas
                </h3>
                <p className="text-3xl font-bold text-purple-600">
                  {dashboardData.totalConfirmed}
                </p>
              </Card>
            )}
            {!isAdmin && 'finishedPercentage' in dashboardData && (
              <Card className="p-6 shadow-lg border border-gray-200 rounded-lg">
                <h3 className="text-lg font-bold mb-2">Taxa de Finalização</h3>
                <p className="text-3xl font-bold text-orange-600">
                  {dashboardData.finishedPercentage}%
                </p>
              </Card>
            )}
          </>
        )}
      </div>
      {!isAdmin && 'averageWaitingTimeMinutes' in dashboardData && (
        <div className="mt-6">
          <Card className="p-6 shadow-lg border border-gray-200 rounded-lg">
            <h3 className="text-lg font-bold mb-2">Tempo Médio de Espera</h3>
            <p className="text-2xl font-bold text-gray-700">
              {dashboardData.averageWaitingTimeMinutes} minutos
            </p>
          </Card>
        </div>
      )}
      <div className="mt-6">
        <Card className="p-6 shadow-lg border border-gray-200 rounded-lg">
          <div className="flex justify-center items-center h-[300px] sm:h-[400px] md:h-[500px]">
            <Bar data={data} options={chartOptions} />
          </div>
        </Card>
      </div>
    </ContentLayout>
  );
}
