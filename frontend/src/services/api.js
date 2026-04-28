import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

console.log("API Configuration:", API_URL);

const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
});

// Request interceptor
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  console.log(`[${config.method.toUpperCase()}] ${config.url}`);
  return config;
});

// Response interceptor
api.interceptors.response.use(
  (response) => {
    console.log(`OK (${response.status}):`, response.data);
    return response.data;
  },
  (error) => {
    const status = error.response?.status;
    const data = error.response?.data;
    console.error(`ERROR (${status}):`, data);
    throw error;
  },
);

// ✅ Export as object with methods
export default {
  register: (username, email, password) =>
    api.post("/auth/register", { username, email, password }),

  login: (username, password) =>
    api.post("/auth/login", { username, password }),

  getActivities: () => api.get("/activities"),

  getActivity: (id) => api.get(`/activities/${id}`),

  createActivity: (data) => api.post("/activities", data),

  updateActivity: (id, data) => api.put(`/activities/${id}`, data),

  deleteActivity: (id) => api.delete(`/activities/${id}`),
};
