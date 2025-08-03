import api from './api';

export const portfolioService = {
    getUserPortfolio: async (userId, options = {}) => {
        console.log('[PortfolioService] getUserPortfolio called with:', {
            userId,
            options
        });
        try {
            const { mediaType, limit = 50, offset = 0 } = options;
            const params = new URLSearchParams({ limit, offset });
            if (mediaType) params.append('mediaType', mediaType);

            const response = await api.get(`/api/v1/content/user/${userId}/portfolio?${params}`);
            console.log('[PortfolioService] Making API request to:', url);
            console.log('[PortfolioService] API Response:', {
                status: response.status,
                statusText: response.statusText,
                dataReceived: !!response.data,
                contentStructure: response.data ? Object.keys(response.data) : []
            });
            return response.data;
        } catch (error) {
            console.error('Portfolio service error:', error);
            // Return empty structure on error
            return {
                content: {
                    images: [],
                    videos: [],
                    audio: []
                },
                total: 0
            };
        }
    },

    setFeaturedContent: async (contentId, isFeatured) => {
        const response = await api.put(`/api/v1/content/${contentId}/featured`, {
            isFeatured
        });
        return response.data;
    },

    deleteContent: async (contentId) => {
        const response = await api.delete(`/api/v1/content/${contentId}`);
        return response.data;
    }
};