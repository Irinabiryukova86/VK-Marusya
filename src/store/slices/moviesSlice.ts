import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Movie } from '../../types';

interface MoviesState {
  randomMovie: Movie | null;
  topMovies: Movie[];
  favoriteMovies: Movie[];
  genreMovies: Movie[];
  searchResults: Movie[];
  loading: boolean;
  error: string | null;
}

const initialState: MoviesState = {
  randomMovie: null,
  topMovies: [],
  favoriteMovies: [],
  genreMovies: [],
  searchResults: [],
  loading: false,
  error: null
};

const moviesSlice = createSlice({
  name: 'movies',
  initialState,
  reducers: {
    setRandomMovie: (state, action: PayloadAction<Movie>) => {
      state.randomMovie = action.payload;
    },
    setTopMovies: (state, action: PayloadAction<Movie[]>) => {
      state.topMovies = action.payload;
    },
    toggleFavorite: (state, action: PayloadAction<Movie>) => {
      const movie = action.payload;
      const index = state.favoriteMovies.findIndex(m => m.id === movie.id);
      if (index >= 0) {
        state.favoriteMovies.splice(index, 1);
      } else {
        state.favoriteMovies.push(movie);
      }
    }
  }
});

export const { setRandomMovie, setTopMovies, toggleFavorite } = moviesSlice.actions;
export default moviesSlice.reducer;
