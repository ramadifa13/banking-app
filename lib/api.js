import axios from "axios";
import { getAuthToken } from "./common/token";

const api = axios.create({
  baseURL: "/api",
  timeout: 10000,
});

api.interceptors.request.use(
  async (config) => {
    const token = await getAuthToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
