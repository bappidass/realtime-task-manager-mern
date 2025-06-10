import axios from 'axios';
import Cookies from 'js-cookie';


export const API = axios.create({
  baseURL: 'https://realtime-task-manager-mer.onrender.com/api',
});


API.interceptors.request.use((config) => {
 const token = Cookies.get('token');// or from context/store
  console.log(token)
  if (token) {
    config.headers.Authorization = `${token}`;
  }
  return config;
});
