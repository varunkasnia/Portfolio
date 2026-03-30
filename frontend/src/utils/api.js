import axios from 'axios'

const normalizeApiBaseUrl = (rawBaseUrl) => {
  const baseUrl = rawBaseUrl?.trim()

  if (!baseUrl) return '/api'
  if (baseUrl === '/api') return baseUrl

  const trimmedBaseUrl = baseUrl.replace(/\/+$/, '')
  return trimmedBaseUrl.endsWith('/api') ? trimmedBaseUrl : `${trimmedBaseUrl}/api`
}

const API = axios.create({
  baseURL: normalizeApiBaseUrl(import.meta.env.VITE_API_URL),
})

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('admin_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

export const getAbout = () => API.get('/about')
export const updateAbout = (data) => API.put('/about', data)

export const getSettings = () => API.get('/settings')
export const updateSettings = (data) => API.put('/settings', data)

export const getProjects = () => API.get('/projects')
export const createProject = (data) => API.post('/projects', data)
export const updateProject = (id, data) => API.put(`/projects/${id}`, data)
export const deleteProject = (id) => API.delete(`/projects/${id}`)

export const getSkills = () => API.get('/skills')
export const createSkill = (data) => API.post('/skills', data)
export const updateSkill = (id, data) => API.put(`/skills/${id}`, data)
export const deleteSkill = (id) => API.delete(`/skills/${id}`)

export const getAchievements = () => API.get('/achievements')
export const createAchievement = (data) => API.post('/achievements', data)
export const updateAchievement = (id, data) => API.put(`/achievements/${id}`, data)
export const deleteAchievement = (id) => API.delete(`/achievements/${id}`)

export const getWorkshops = () => API.get('/workshops')
export const createWorkshop = (data) => API.post('/workshops', data)
export const updateWorkshop = (id, data) => API.put(`/workshops/${id}`, data)
export const deleteWorkshop = (id) => API.delete(`/workshops/${id}`)

export const uploadImage = (formData) => API.post('/upload', formData, {
  headers: { 'Content-Type': 'multipart/form-data' }
})

export default API
