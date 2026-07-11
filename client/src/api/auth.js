import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const login = async (email, password) => {
  const response = await axios.post(`${API_URL}/auth/login`, { email, password });
  return response.data;
};

export const verifyToken = async () => {
  const token = localStorage.getItem('token');
  const response = await axios.get(`${API_URL}/auth/verify`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};
