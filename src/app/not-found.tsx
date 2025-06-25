import Link from 'next/link';
import { Activity } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardContent className="pt-6 text-center">
          <div className="flex flex-col items-center justify-center gap-4 mb-4">
            <Activity className="w-10 h-10 mr-2 text-sky-500" />
            <h1 className="text-2xl font-bold text-center text-sky-500">
              Clinic Up
            </h1>
          </div>
          <h1 className="text-4xl font-bold mb-2">404</h1>
          <h2 className="text-2xl font-semibold mb-4">Página não encontrada</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Desculpe, a página que você está procurando não existe ou foi
            movida.
          </p>
          <Button asChild>
            <Link href="/">Voltar ao início</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
