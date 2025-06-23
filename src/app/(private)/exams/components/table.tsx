'use client';
import React, { useEffect } from 'react';
import { useExamTypes } from '@/contexts/exams-context';
import { EditExamType } from './editExamType';
import RemoveExamType from './removeExamType';

const ExamTypeTable = () => {
  const {
    examTypes,
    currentPage,
    fetchExamTypes,
    totalPages,
    loading,
    setCurrentPage,
  } = useExamTypes();

  const handlePrevious = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
      fetchExamTypes(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage(Number(currentPage) + 1);
      fetchExamTypes(Number(currentPage) + 1);
    }
  };

  useEffect(() => {
    fetchExamTypes(1);
  }, []);

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border-collapse border border-gray-200 bg-white shadow-md rounded-lg">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
              Nome
            </th>
            <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
              Descrição
            </th>
            <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
              Duração
            </th>
            <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
              Situação
            </th>
            <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
              Ações
            </th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan={4} className="text-center py-6 text-gray-500">
                Carregando tipos de exame...
              </td>
            </tr>
          ) : (
            examTypes?.map((examType) => (
              <tr key={examType.id} className="bg-white border-t">
                <td className="px-6 py-4 text-sm text-gray-700">
                  {examType.name}
                </td>
                <td className="px-6 py-4 text-sm text-gray-700">
                  {examType.description}
                </td>
                <td className="px-6 py-4 text-sm text-gray-700">
                  {examType.defaultDuration} min
                </td>
                <td className="px-6 py-4 text-sm text-gray-700">
                  {examType.active ? (
                    <span className="text-green-500">Ativo</span>
                  ) : (
                    <span className="text-red-500">Inativo</span>
                  )}
                </td>
                <td className="px-6 py-4 text-sm text-gray-700 flex items-center gap-2">
                  <EditExamType examType={examType} />
                  <RemoveExamType examType={examType} />
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      <div className="flex items-center justify-center gap-4 mt-8">
        <button
          onClick={handlePrevious}
          disabled={Number(currentPage) === 1}
          className={`px-4 py-2 text-sm font-medium text-white bg-sky-500 rounded-md hover:bg-sky-600 ${
            Number(currentPage) === 1 ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          Anterior
        </button>
        <span className="text-sm text-gray-700">
          Página {currentPage} de {totalPages}
        </span>
        <button
          onClick={handleNext}
          disabled={Number(currentPage) === Number(totalPages)}
          className={`px-4 py-2 text-sm font-medium text-white bg-sky-500 rounded-md hover:bg-sky-600 ${
            Number(currentPage) === Number(totalPages)
              ? 'opacity-50 cursor-not-allowed'
              : ''
          }`}
        >
          Próximo
        </button>
      </div>
    </div>
  );
};

export default ExamTypeTable;
