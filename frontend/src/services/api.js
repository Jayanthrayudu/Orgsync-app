import axios from "axios";

// Use environment variable and append /api
const api = axios.create({
  baseURL: `${import.meta.env.VITE_API_BASE_URL}/api`
});

// Organization API
export const organizationAPI = {
  getAll: () => api.get("/organizations"),
  getById: (id) => api.get(`/organizations/${id}`),
  create: (data) => api.post("/organizations", data),
  update: (id, data) => api.put(`/organizations/${id}`, data),
  updateStatus: (id, status) => api.patch(`/organizations/${id}/status`, { status }),
  delete: (id) => api.delete(`/organizations/${id}`),
};

// User API
export const userAPI = {
  getByOrg: (orgId) => api.get(`/users/${orgId}`),
  create: (orgId, data) => api.post(`/users/${orgId}`, data),
};

export default api;
