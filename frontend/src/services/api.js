// src/services/api.js
import axios from "axios";

// Use environment variable for base URL (VITE_ prefix required)
// Fallback to localhost only in development
const BACKEND_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

const api = axios.create({
  baseURL: `${BACKEND_URL}/api`,
  headers: {
    "Content-Type": "application/json",
  },
});

// Optional: Add response interceptor for better error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error:", error.response?.data || error.message);
    return Promise.reject(error);
  }
);

/* ========== Organization API ========== */
export const organizationAPI = {
  getAll: () => api.get("/organizations"),
  getById: (id) => api.get(`/organizations/${id}`),
  create: (data) => api.post("/organizations", data),
  update: (id, data) => api.put(`/organizations/${id}`, data),
  updateStatus: (id, status) =>
    api.patch(`/organizations/${id}/status`, { status }),
  delete: (id) => api.delete(`/organizations/${id}`),
};

/* ========== User API ========== */
export const userAPI = {
  getByOrg: (orgId) => api.get(`/users/${orgId}`),
  create: (orgId, data) => api.post(`/users/${orgId}`, data),
  update: (id, data) => api.put(`/users/${id}`, data),
  delete: (id) => api.delete(`/users/${id}`),
};

export default api;