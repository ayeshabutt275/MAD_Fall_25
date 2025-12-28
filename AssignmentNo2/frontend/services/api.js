import axios from 'axios';

export const API_URL = 'http://10.0.2.2:5000'; // change to your PC IP for phone testing

const api = axios.create({
  baseURL: `${API_URL}/api` || `${API_URL}`,
});

export default api;
