'use server';

import axios from 'axios';

const BASE_URL = process.env.BASE_URL || '';

export const confirmAppointment = async (cpf: string) => {
  const response = await axios.post(`${BASE_URL}/appoiments/${cpf}/confirmed`);
  return response.data;
};
