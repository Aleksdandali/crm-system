import api from './api';

export const getDeals = async (params?: any) => {
  const response = await api.get('/deals', { params });
  return response.data;
};

export const getDealById = async (id: string) => {
  const response = await api.get(`/deals/${id}`);
  return response.data;
};

export const createDeal = async (data: any) => {
  const response = await api.post('/deals', data);
  return response.data;
};

export const updateDeal = async (id: string, data: any) => {
  const response = await api.put(`/deals/${id}`, data);
  return response.data;
};

export const updateDealStage = async (id: string, stage: string) => {
  const response = await api.patch(`/deals/${id}/stage`, { stage });
  return response.data;
};

export const deleteDeal = async (id: string) => {
  const response = await api.delete(`/deals/${id}`);
  return response.data;
};
