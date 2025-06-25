'use client';

import { Activity } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
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
          <h1 className="text-4xl font-bold mb-2">Oops!</h1>
          <h2 className="text-2xl font-semibold mb-4">Algo deu errado</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Um erro inesperado ocorreu. Por favor, tente novamente.
          </p>
          <div className="space-x-4">
            <Button variant="outline" onClick={() => reset()}>
              Tentar novamente
            </Button>
            <Button asChild>
              <a href="/">Voltar ao início</a>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
