import api from './axiosInstance'

export const articleApi = {
    getAll: async ({ page = 0, size = 9, category, search } = {}) => {
        const params = new URLSearchParams({ page, size })
        if (category && category !== 'ALL') params.append('category', category)
        if (search) params.append('search', search)
        const res = await api.get(`/api/articles?${params}`)
        return res.data
    },

    getById: async (id) => {
        const res = await api.get(`/api/articles/${id}`)
        return res.data
    },

    create: async (data) => {
        const res = await api.post('/api/articles', data)
        return res.data
    },

    update: async (id, data) => {
        const res = await api.put(`/api/articles/${id}`, data)
        return res.data
    },

    delete: async (id) => {
        const res = await api.delete(`/api/articles/${id}`)
        return res.data
    },

    getMyArticles: async () => {
        const res = await api.get('/api/articles/my-articles')
        return res.data
    },
}
