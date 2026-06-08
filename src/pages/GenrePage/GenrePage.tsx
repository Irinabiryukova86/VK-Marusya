import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import moviesData from '../../data/movies.json';
import { Movie } from '../../types/Movie';
import './GenrePage.scss';

const GenrePage: React.FC = () => {
  const { genre } = useParams();
  const [displayedMovies, setDisplayedMovies] = useState<Movie[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const lastMovieRef = useRef<HTMLDivElement | null>(null);

  // Фильтруем фильмы по жанру и сортируем по рейтингу
  const filteredMovies = moviesData
    .filter(movie =>
      movie.genre
        .split(',')
        .map(g => g.trim())
        .includes((genre || ''))
    )
    .sort((a, b) => b.rating - a.rating);

  const MOVIES_PER_PAGE = 10;

  const loadMoreMovies = () => {
    const startIndex = currentPage * MOVIES_PER_PAGE;
    if (startIndex >= filteredMovies.length) return;

    const endIndex = startIndex + MOVIES_PER_PAGE;
    const newMovies = filteredMovies.slice(startIndex, endIndex);
    setDisplayedMovies(prev => [...prev, ...newMovies]);
    setCurrentPage(prev => prev + 1);
  };

  useEffect(() => {
    setDisplayedMovies(filteredMovies.slice(0, MOVIES_PER_PAGE));
    setCurrentPage(1);
  }, [genre, filteredMovies]);

  useEffect(() => {
    if (!lastMovieRef.current) return;

    observerRef.current?.disconnect();

    observerRef.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        loadMoreMovies();
      }
    });

    observerRef.current.observe(lastMovieRef.current);

    return () => {
      observerRef.current?.disconnect();
    };
  }, [currentPage, filteredMovies, loadMoreMovies]);

  if (!genre) {
    return <div>Жанр не найден</div>;
  }

  return (
    <div className="genre-page">
      <div className="genre-page__header">
        <button
          className="genre-page__back-btn"
          onClick={() => window.history.back()}
          aria-label="Вернуться на страницу жанров"
        >
          <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M18.047 20.0012L26.2967 28.2507L23.9397 30.6077L13.333 20.0012L23.9397 9.39453L26.2967 11.7515L18.047 20.0012Z" fill="white" />
          </svg>
        </button>
        <h1 className="genre-page__title">{genre}</h1>
      </div>
      <>
        <div className="movies-grid__genre">
          {displayedMovies.map((movie, index) => (
            <div
              key={movie.id}
              ref={index === displayedMovies.length - 1 ? lastMovieRef : null}
              className="movie-card__genre"
            >
              <img
                src={movie.poster}
                alt={movie.title}
                className="movie-card__genre-img"
                onError={(e) => {
                  const img = e.target as HTMLImageElement;
                  img.style.display = 'none';
                  const parent = img.parentElement;
                  if (parent) {
                    const placeholder = document.createElement('div');
                    placeholder.className = 'poster-placeholder';
                    placeholder.textContent = 'Постер недоступен';
                    parent.innerHTML = '';
                    parent.appendChild(placeholder);
                  }
                }}
              />
            </div>
          ))}
        </div>
        {/* Кнопка «Показать ещё» */}
        <div className="load-more-container">
          <button
            className="load-more-btn"
            onClick={loadMoreMovies}
            disabled={currentPage * MOVIES_PER_PAGE >= filteredMovies.length}
            aria-label="Загрузить ещё фильмы"
          >
            Показать ещё
          </button>
        </div>
      </>
    </div>
  );
};

export default GenrePage;
