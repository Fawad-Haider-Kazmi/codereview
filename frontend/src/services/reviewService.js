import api from './api'

export const reviewService = {
  create:     (data)   => api.post('/api/review/',     data),
  getById:    (id)     => api.get(`/api/review/${id}`),
  delete:     (id)     => api.delete(`/api/review/${id}`),
  getHistory: (params) => api.get('/api/history/',     { params }),
  getStats:   ()       => api.get('/api/history/stats'),
}