'use client';
import React, { useState, useMemo } from 'react';
import { useUsers } from '@/hooks/use-users';
import { NewUser } from './newUser';
import { Edit, Trash } from 'lucide-react';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';

const UserTable = () => {
  const { users, fetchUsers, saveUser } = useUsers();

  const [refresh, setRefresh] = useState(false);

  useMemo(() => {
    fetchUsers();
  }, []);

  const handleSaveUser = async (data: any) => {
    await saveUser(data);
    setRefresh(!refresh);
  };

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const totalPages = Math.ceil(users.length / itemsPerPage);
  const paginatedUsers = users.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePrevious = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border-collapse border border-gray-200 bg-white shadow-md rounded-lg">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
              ID
            </th>
            <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
              Name
            </th>
            <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
              Email
            </th>
            <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
              Role
            </th>
            <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {paginatedUsers.map((user, index) => (
            <tr
              key={user.id}
              className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}
            >
              <td className="px-6 py-4 text-sm text-gray-700">{user.id}</td>
              <td className="px-6 py-4 text-sm text-gray-700">{user.name}</td>
              <td className="px-6 py-4 text-sm text-gray-700">{user.email}</td>
              <td className="px-6 py-4 text-sm text-gray-700">{user.role}</td>
              <td className="px-6 py-4 text-sm text-gray-700 flex space-x-4">
                <Dialog>
                  <DialogTrigger asChild>
                    <button
                      className="text-blue-500 hover:text-blue-700"
                      aria-label="Edit"
                    >
                      <Edit size={16} />
                    </button>
                  </DialogTrigger>
                  <NewUser mode="edit" user={user} onSave={handleSaveUser} />
                </Dialog>

                <button
                  className="text-red-500 hover:text-red-700"
                  aria-label="Delete"
                >
                  <Trash size={16} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="flex items-center justify-center gap-4 mt-8">
        <button
          onClick={handlePrevious}
          disabled={currentPage === 1}
          className={`px-4 py-2 text-sm font-medium text-white bg-sky-500 rounded-md hover:bg-sky-600 ${
            currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          Anterior
        </button>
        <span className="text-sm text-gray-700">
          Página {currentPage} de {totalPages}
        </span>
        <button
          onClick={handleNext}
          disabled={currentPage === totalPages}
          className={`px-4 py-2 text-sm font-medium text-white bg-sky-500 rounded-md hover:bg-sky-600 ${
            currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          Próximo
        </button>
      </div>
    </div>
  );
};

export default UserTable;
