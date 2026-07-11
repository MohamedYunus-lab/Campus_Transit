import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Routes
export const getRoutes = () => api.get('/routes');
export const getRoute = (id) => api.get(`/routes/${id}`);
export const createRoute = (data) => api.post('/routes', data);
export const updateRoute = (id, data) => api.put(`/routes/${id}`, data);
export const deleteRoute = (id) => api.delete(`/routes/${id}`);

// Buses
export const getBuses = () => api.get('/buses');
export const getBus = (id) => api.get(`/buses/${id}`);
export const createBus = (data) => api.post('/buses', data);
export const updateBus = (id, data) => api.put(`/buses/${id}`, data);
export const deleteBus = (id) => api.delete(`/buses/${id}`);

// Drivers
export const getDrivers = () => api.get('/drivers');
export const getDriver = (id) => api.get(`/drivers/${id}`);
export const createDriver = (data) => api.post('/drivers', data);
export const updateDriver = (id, data) => api.put(`/drivers/${id}`, data);
export const deleteDriver = (id) => api.delete(`/drivers/${id}`);

// Boarding Points
export const getBoardingPoints = () => api.get('/boarding-points');
export const getBoardingPoint = (id) => api.get(`/boarding-points/${id}`);
export const createBoardingPoint = (data) => api.post('/boarding-points', data);
export const updateBoardingPoint = (id, data) => api.put(`/boarding-points/${id}`, data);
export const deleteBoardingPoint = (id) => api.delete(`/boarding-points/${id}`);

// Schedules
export const getSchedules = () => api.get('/schedules');
export const getSchedule = (id) => api.get(`/schedules/${id}`);
export const createSchedule = (data) => api.post('/schedules', data);
export const updateSchedule = (id, data) => api.put(`/schedules/${id}`, data);
export const deleteSchedule = (id) => api.delete(`/schedules/${id}`);

export default api;
