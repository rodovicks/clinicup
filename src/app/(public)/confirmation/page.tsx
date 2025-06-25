'use client';
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import axios from 'axios';
import { Appointment } from '@/contexts/appoiments-context';
import { ExamType } from '@/contexts/exams-context';

const ConfirmationPage = () => {
  const [cpf, setCpf] = useState('');
  const [patientData, setPatientData] = useState<Appointment[]>([]);
  const [showWelcome, setShowWelcome] = useState(false);
  const [exam, setExam] = useState<ExamType[]>([]);

  const handleCpfSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const response = await axios.post(`/api/appointments/confirmed/${cpf}`);
    setPatientData(response.data);
    setShowWelcome(true);
  };

  useEffect(() => {
    if (showWelcome) {
      const timeout = setTimeout(() => {
        setCpf('');
        setPatientData([]);
        setShowWelcome(false);
      }, 30000);
      return () => clearTimeout(timeout);
    }
  }, [showWelcome]);

  useEffect(() => {
    const fetchExams = async () => {
      const response = await axios.get('/api/exam/types');
      setExam(response.data?.data || []);
    };
    fetchExams();
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      {!showWelcome ? (
        <Card className="p-8 w-full max-w-md shadow-md">
          <div className="flex flex-col items-center justify-center gap-4 mb-4">
            <h1 className="text-2xl font-bold text-center text-sky-500">
              Bem-vindo à Clínica
            </h1>
          </div>
          <form className="space-y-4" onSubmit={handleCpfSubmit}>
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
                    type="button"
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
                  type="button"
                  onClick={() => setCpf((prev) => prev.slice(0, -1))}
                  className="py-8 col-span-2 text-2xl bg-red-500 text-white"
                >
                  APAGAR
                </Button>
              </div>
            </div>
            <Button
              type="submit"
              variant="primary"
              className="w-full py-8 text-2xl"
            >
              CONFIRMAR
            </Button>
          </form>
        </Card>
      ) : (
        <Card className="p-8 w-full max-w-md shadow-md">
          <div className="flex flex-col items-center justify-center gap-4 mb-4">
            <h1 className="text-2xl font-bold text-center text-sky-500">
              Bem-vindo,{' '}
              {patientData.length > 0 ? patientData[0]?.patient_name : ''}!
            </h1>
          </div>
          <h2 className="text-lg font-semibold text-center mb-6">
            Exames de hoje:
          </h2>
          <ul className="space-y-2 flex flex-col items-center">
            {patientData?.map((x) => (
              <li key={x.id} className="text-md font-bold text-gray-700">
                {exam?.find((e) => e.id === x.examsTypeId)?.name ?? ''} -{' '}
                {exam?.find((e) => e.id === x.examsTypeId)?.defaultDuration ??
                  ''}{' '}
                minutos
              </li>
            ))}
          </ul>
          <Button
            type="button"
            variant="destructive"
            className="w-full py-8 text-2xl mt-6"
            onClick={() => {
              setCpf('');
              setPatientData([]);
              setShowWelcome(false);
            }}
          >
            FECHAR
          </Button>
          <p className="text-sm text-center text-gray-500 mt-4">
            A página será reiniciada em breve...
          </p>
        </Card>
      )}
    </div>
  );
};

export default ConfirmationPage;
