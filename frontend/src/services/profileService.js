import api from './api';

const API_URL = '/api/v1/profile/';

// Get public profile by username
const getPublicProfile = async (username) => {
    const response = await api.get(API_URL + username);
    return response.data;
};

// Update profile with form data (for file uploads)
const updateProfile = async (formData) => {
    const response = await api.put(API_URL, formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
    return response.data;
};

// Add portfolio item
const addPortfolioItem = async (formData) => {
    const response = await api.post(API_URL + 'portfolio', formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
    return response.data;
};

// Delete portfolio item
const deletePortfolioItem = async (itemId) => {
    const response = await api.delete(API_URL + 'portfolio/' + itemId);
    return response.data;
};

const profileService = {
    getPublicProfile,
    updateProfile,
    addPortfolioItem,
    deletePortfolioItem
};

export default profileService;