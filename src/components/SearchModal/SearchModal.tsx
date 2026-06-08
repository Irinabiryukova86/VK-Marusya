import React, { useState, useCallback, useRef, useEffect, useMemo } from 'react';
import { Movie } from '../../types/Movie';
import { moviesApi } from '../../api/moviesApi';
import { useNavigate } from 'react-router-dom';
import { debounce } from '../../utils/debounce';
import './SearchModal.scss';

interface SearchModalProps {
  onClose: () => void;
  searchInputRef: React.RefObject<HTMLInputElement | null>;
  query: string;
  setQuery: (value: string) => void;
  isOpen: boolean;
  setHasSearchResults: (hasResults: boolean) => void;
}

const SearchModal: React.FC<SearchModalProps> = ({
  onClose,
  searchInputRef,
  query,
  setQuery,
  isOpen,
  setHasSearchResults
}) => {
  const navigate = useNavigate();
  const [movies, setMovies] = useState<Movie[]>([]);
  const [hasSearchResults, setLocalHasSearchResults] = useState(false); 
  const dropdownRef = useRef<HTMLDivElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    if (searchInputRef.current && isOpen) {
      searchInputRef.current.focus();
    }
  }, [isOpen, searchInputRef]);

  const filteredMovies = useMemo(() => {
    if (!query.trim()) return movies;
    const lowerCaseQuery = query.toLowerCase();
    return movies.filter(movie =>
      movie.title.toLowerCase().startsWith(lowerCaseQuery)
    );
  }, [movies, query]);

  const searchMovies = useCallback(async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setMovies([]);
      return;
    }

    abortControllerRef.current?.abort();
    abortControllerRef.current = new AbortController();

    try {
      const response = await moviesApi.searchMovies(searchQuery);
      const data: Movie[] = response.data;
      setMovies(data.slice(0, 10));
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        return;
      }
      console.error('Ошибка при поиске фильмов:', error);
      setMovies([]);
    }
  }, [setMovies]);

  const debouncedSearch = useCallback(
    debounce((searchQuery: string) => searchMovies(searchQuery), 300),
    [searchMovies]
  );

  const handleMovieClick = (movie: Movie) => {
    navigate(`/movie/${movie.id}`);
    setQuery(movie.title);
    onClose();
  };

  useEffect(() => {
    if (query.trim()) {
      debouncedSearch(query);
    } else {
      setMovies([]);
    }
  }, [query, debouncedSearch]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  useEffect(() => {
    const hasResults = Boolean(filteredMovies.length > 0 && query.trim());
    setLocalHasSearchResults(hasResults); 
    setHasSearchResults(hasResults); 
  }, [filteredMovies, query, setHasSearchResults]);

  if (!isOpen) {
    return null;
  }

  return (
    <div> {/* Корневой элемент-обёртка */}
      <div className={`search-modal-wrapper ${hasSearchResults ? 'with-results' : ''}`}>
        <div
          className={`search-modal-overlay ${hasSearchResults ? 'overlay-with-results' : ''}`}
          onClick={onClose}
        />
        <div
          className="search-modal-content"
          ref={dropdownRef}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="movies-list">
          {filteredMovies.map((movie) => (
            <div
              key={movie.id}
              className="movie-result-item"
              onClick={() => handleMovieClick(movie)}
            >
              <img
                src={movie.poster}
                alt={movie.title}
                className="movie-thumbnail"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
              <div className="movie-info-wrapper">
                <div className="movie-inner">
                  <div className="movie-inner__rating">
                    <img
                      src="/images/star.svg"
                      alt="Иконка рейтинга"
                      width="16"
                      height="16"
                    />
                    {movie.rating}
                  </div>
                  <span className="movie-info__year">{movie.year}</span>
                  <span className="movie-info__genre"> {movie.genre}</span>
                  <span className="movie-info__duration">{movie.duration}</span>
                </div>
                <h4 className="movie-title-small">{movie.title}</h4>
              </div>
            </div>
          ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchModal;
