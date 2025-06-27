'use client';
import { useState, useEffect } from 'react';
import axios from 'axios';

interface MaxWaitTimeConfig {
  maxWaitTimeMin: number;
}

export const useMaxWaitTime = () => {
  const [maxWaitTime, setMaxWaitTime] = useState<number>(30);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMaxWaitTime = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get('/api/register/time');

      if (response.data && response.data.maxWaitTimeMin) {
        setMaxWaitTime(response.data.maxWaitTimeMin);
      }
    } catch (error: any) {
      console.error('Erro ao buscar tempo máximo de espera:', error);
      setError(error?.response?.data?.message || 'Erro ao buscar configuração');

      setMaxWaitTime(30);
    } finally {
      setLoading(false);
    }
  };

  const updateMaxWaitTime = async (newMaxWaitTime: number) => {
    try {
      setLoading(true);
      setError(null);
      await axios.put('/api/register/time', { maxWaitTimeMin: newMaxWaitTime });
      setMaxWaitTime(newMaxWaitTime);
      return true;
    } catch (error: any) {
      console.error('Erro ao atualizar tempo máximo de espera:', error);
      setError(
        error?.response?.data?.message || 'Erro ao atualizar configuração'
      );
      return false;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMaxWaitTime();
  }, []);

  return {
    maxWaitTime,
    loading,
    error,
    fetchMaxWaitTime,
    updateMaxWaitTime,
  };
};

export default useMaxWaitTime;
