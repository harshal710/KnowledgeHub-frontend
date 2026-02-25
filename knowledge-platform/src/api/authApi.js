import api from './axiosInstance'

export const authApi = {
    signup: async (data) => {
        const res = await api.post('/api/auth/signup', data)
        return res.data
    },

    login: async (data) => {
        const res = await api.post('/api/auth/login', data)
        return res.data
    },

    logout: async () => {
        const res = await api.post('/api/auth/logout')
        return res.data
    },

    getMe: async () => {
        const res = await api.get('/api/auth/me')
        return res.data
    },
}
