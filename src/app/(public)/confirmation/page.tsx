'use client';
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import axios from 'axios';

const ConfirmationPage = () => {
  const [cpf, setCpf] = useState('');
  interface PatientData {
    name: string;
    exams: { name: string; time: string }[];
  }

  const [patientData, setPatientData] = useState<PatientData | null>(null);
  const [showWelcome, setShowWelcome] = useState(false);

  const handleCpfSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const response = await axios.get(`/api/patient?cpf=${cpf}`);
    setPatientData(response.data);
    setShowWelcome(true);
  };

  useEffect(() => {
    if (showWelcome) {
      const timeout = setTimeout(() => {
        setCpf('');
        setPatientData(null);
        setShowWelcome(false);
      }, 10000);
      return () => clearTimeout(timeout);
    }
  }, [showWelcome]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      {!showWelcome ? (
        <Card className="p-8 w-full max-w-md shadow-md">
          <div className="flex flex-col items-center justify-center gap-4 mb-4">
            <h1 className="text-2xl font-bold text-center text-sky-500">
              Bem-vindo à Clínica
            </h1>
          </div>
          <form className="space-y-4">
            <div>
              <Label
                htmlFor="cpf"
                className="block text-sm font-medium text-gray-700"
              >
                Informe seu CPF:
              </Label>
              <Input
                id="cpf"
                type="text"
                value={cpf
                  .replace(/\D/g, '')
                  .slice(0, 11)
                  .replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')}
                readOnly
                className="mt-1 w-full"
                maxLength={11}
                required
              />
              <div className="grid grid-cols-3 gap-2 mt-4">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 0].map((num) => (
                  <Button
                    key={num}
                    onClick={() =>
                      setCpf((prev) =>
                        prev.length < 11 ? prev + num.toString() : prev
                      )
                    }
                    className="py-8 text-2xl"
                  >
                    {num}
                  </Button>
                ))}
                <Button
                  onClick={() => setCpf((prev) => prev.slice(0, -1))}
                  className="py-8 col-span-2 text-2xl bg-red-500 text-white"
                >
                  APAGAR
                </Button>
              </div>
            </div>
            <Button
              type="button"
              variant="primary"
              className="w-full py-8 text-2xl"
              onClick={() => handleCpfSubmit}
            >
              CONFIRMAR
            </Button>
          </form>
        </Card>
      ) : (
        <Card className="p-8 w-full max-w-md shadow-md">
          <div className="flex flex-col items-center justify-center gap-4 mb-4">
            <h1 className="text-2xl font-bold text-center text-sky-500">
              Bem-vindo, {patientData?.name}!
            </h1>
          </div>
          <h2 className="text-lg font-semibold text-center mb-6">
            Exames de hoje:
          </h2>
          <ul className="space-y-2">
            {patientData?.exams.map(
              (exam: { name: string; time: string }, index: number) => (
                <li key={index} className="text-sm text-gray-700">
                  {exam.name} - {exam.time}
                </li>
              )
            )}
          </ul>
          <p className="text-sm text-center text-gray-500 mt-4">
            A página será reiniciada em breve...
          </p>
        </Card>
      )}
    </div>
  );
};

export default ConfirmationPage;
