import api from './axiosInstance'

export const aiApi = {
    improveContent: async (content, mode = 'clarity') => {
        const res = await api.post('/api/ai/improve', { content, mode })
        return res.data
    },

    suggestTitle: async (content) => {
        const res = await api.post('/api/ai/suggest-title', { content })
        return res.data
    },

    generateSummary: async (content, title) => {
        const res = await api.post('/api/ai/generate-summary', { content, title })
        return res.data
    },

    suggestTags: async (content, category) => {
        const res = await api.post('/api/ai/suggest-tags', { content, category })
        return res.data
    },
}
