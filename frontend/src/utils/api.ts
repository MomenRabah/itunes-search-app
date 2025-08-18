const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export const API_ENDPOINTS = {
  search: (term: string) => `${API_BASE_URL}/api/search?term=${encodeURIComponent(term)}`,
  save: `${API_BASE_URL}/api/save`,
  favorites: `${API_BASE_URL}/api/favorites`,
  removeFavorite: (trackId: string) => `${API_BASE_URL}/api/favorites/remove/${trackId}`,
  clearFavorites: `${API_BASE_URL}/api/favorites/clear`,
};

export { API_BASE_URL };
