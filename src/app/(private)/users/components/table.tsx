'use client';
import React, { useEffect } from 'react';
import { useUsers } from '@/contexts/users-context';
import { EditUser } from './editUser';
import RemoveUser from './removeUser';

const UserTable = () => {
  const {
    users,
    currentPage,
    fetchUsers,
    totalPages,
    loading,
    setCurrentPage,
  } = useUsers();

  const handlePrevious = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
      fetchUsers(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage(Number(currentPage) + 1);
      fetchUsers(Number(currentPage) + 1);
    }
  };

  useEffect(() => {
    fetchUsers(1);
  }, []);

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border-collapse border border-gray-200 bg-white shadow-md rounded-lg">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
              Name
            </th>
            <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
              Email
            </th>
            <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
              Cargo
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
                Carregando usuários...
              </td>
            </tr>
          ) : (
            users.map((user) => (
              <tr key={user.id} className="bg-white border-t">
                <td className="px-6 py-4 text-sm text-gray-700">{user.name}</td>
                <td className="px-6 py-4 text-sm text-gray-700">
                  {user.email}
                </td>
                <td className="px-6 py-4 text-sm text-gray-700">{user.role}</td>
                <td className="px-6 py-4 text-sm text-gray-700">
                  {user.active ? (
                    <span className="text-green-500">Ativo</span>
                  ) : (
                    <span className="text-red-500">Inativo</span>
                  )}
                </td>
                <td className="px-6 py-4 text-sm text-gray-700 flex items-center gap-2">
                  <EditUser user={user} />
                  <RemoveUser userId={user.id || ''} />
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      <div className="flex items-center justify-center gap-4 mt-8">
        <button
          onClick={handlePrevious}
          disabled={Number(currentPage) <= 1}
          className={`px-4 py-2 text-sm font-medium text-white bg-sky-500 rounded-md hover:bg-sky-600 ${
            Number(currentPage) <= 1 ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          Anterior
        </button>
        <span className="text-sm text-gray-700">
          Página {currentPage} de {totalPages}
        </span>
        <button
          onClick={handleNext}
          disabled={
            Number(currentPage) === Number(totalPages) || totalPages === 0
          }
          className={`px-4 py-2 text-sm font-medium text-white bg-sky-500 rounded-md hover:bg-sky-600 ${
            Number(currentPage) === Number(totalPages) || totalPages === 0
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

export default UserTable;
