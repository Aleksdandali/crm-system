import api from './api';

export const getDashboardStats = async () => {
  const response = await api.get('/reports/dashboard');
  return response.data;
};

export const getSalesFunnel = async () => {
  const response = await api.get('/reports/sales-funnel');
  return response.data;
};

export const getPerformanceReport = async (startDate: string, endDate: string) => {
  const response = await api.get('/reports/performance', {
    params: { startDate, endDate },
  });
  return response.data;
};
