'use client';

import { createContext, useContext, useState, ReactNode } from 'react';
import axios from 'axios';
import { toast } from 'sonner';

export interface ExamType {
  id?: string;
  name: string;
  description: string;
  defaultDuration: number | string;
  preparationInstruction: string;
  createdAt?: Date;
}

interface ExamTypesContextType {
  examTypes: ExamType[];
  currentPage: number;
  totalPages: number;
  totalItems: number;
  loading: boolean;
  setCurrentPage: (page: number) => void;
  fetchExamTypes: (page?: number) => Promise<void>;
  saveExamType: (examType: ExamType) => Promise<void>;
  updateExamType: (id: string, examType: ExamType) => Promise<void>;
  deleteExamType: (id: string) => Promise<void>;
}

const ExamTypesContext = createContext<ExamTypesContextType | null>(null);

export const ExamTypesProvider = ({ children }: { children: ReactNode }) => {
  const [examTypes, setExamTypes] = useState<ExamType[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState(false);

  const withLoading = async (callback: () => Promise<void>) => {
    setLoading(true);
    try {
      await callback();
    } catch (error: any) {
      console.error(error);
      toast.error(
        error.response?.data?.message || error.message || 'Erro inesperado'
      );
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const fetchExamTypes = async (page = currentPage) => {
    await withLoading(async () => {
      const response = await axios.get('/api/exam/types', { params: { page } });
      const data = response.data;

      setExamTypes(data.data);
      setCurrentPage(data.currentPage);
      setTotalPages(data.totalPages);
      setTotalItems(data.totalItems);
    });
  };

  const handleSaveExamType = async (examType: ExamType) => {
    await withLoading(async () => {
      await axios.post('/api/exam/types', examType);
      toast.success('Tipo de exame salvo com sucesso!');
      await fetchExamTypes(currentPage);
    });
  };

  const handleUpdateExamType = async (id: string, examType: ExamType) => {
    await withLoading(async () => {
      await axios.put(`/api/exam/types/${id}`, examType);
      toast.success('Tipo de exame atualizado com sucesso!');
      await fetchExamTypes(currentPage);
    });
  };

  const handleDeleteExamType = async (id: string) => {
    await withLoading(async () => {
      await axios.delete(`/api/exam/types/${id}`);
      toast.success('Tipo de exame excluído com sucesso!');
      await fetchExamTypes(currentPage);
    });
  };

  return (
    <ExamTypesContext.Provider
      value={{
        examTypes,
        currentPage,
        totalPages,
        totalItems,
        loading,
        setCurrentPage,
        fetchExamTypes,
        saveExamType: handleSaveExamType,
        updateExamType: handleUpdateExamType,
        deleteExamType: handleDeleteExamType,
      }}
    >
      {children}
    </ExamTypesContext.Provider>
  );
};

export const useExamTypes = (): ExamTypesContextType => {
  const context = useContext(ExamTypesContext);
  if (!context) {
    throw new Error('Erro ao acessar o contexto de tipos de exame.');
  }
  return context;
};
