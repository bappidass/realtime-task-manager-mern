import { API } from '../api/axios';

export const register = (email, password) => {
  return API.post('/auth/register', { email, password });
};

export const login = (email, password) => {
  return API.post('/auth/login', { email, password });
};


export const verifyUser= async (token) => {
  try {
    const response = await API.get('/user/me');
    return response.data;
  } catch (error) {
    console.error('Error fetching current user:', error.response?.data || error.message);
    throw error.response?.data || { message: 'Unauthorized' };
  }
};