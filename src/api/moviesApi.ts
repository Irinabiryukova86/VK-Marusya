import { api } from '.';

export const moviesApi = {
  getMovies: () => api.get('/movies'),
  searchMovies: (query: string) => api.get(`/movies?q=${encodeURIComponent(query)}`),
  getGenres: () => api.get<string[]>('/genres'),
  addToFavorites: (movieId: number) => api.post('/favorites', { movieId }),
  removeFromFavorites: (movieId: number) => api.delete(`/favorites/${movieId}`)
};
