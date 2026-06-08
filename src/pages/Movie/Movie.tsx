import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import './Movie.scss';
import moviesData from '../../data/movies.json';
import type { Movie } from '../../types/Movie';

interface MovieProps {
  isAuthenticated: boolean;
  onLoginClick: () => void;
}

const Movie: React.FC<MovieProps> = ({ isAuthenticated, onLoginClick }) => {
  const { id } = useParams<{ id: string }>();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const currentMovie = (moviesData as Movie[]).find(
    movie => movie.id === Number(id)
  ) || null;

  if (!currentMovie) {
    return <div className="movie-not-found">Фильм не найден</div>;
  }

  const handleTrailerClick = () => setIsModalOpen(true);

  const handleFavoriteClick = () => {
    if (!isAuthenticated) {
      onLoginClick();
      return;
    }
    setIsFavorite(!isFavorite);
  };

  return (
    <div className="movie-page">
      {/* Адаптированный Hero-блок для страницы фильма */}
      <section className="hero hero--movie-page">
        <div className="hero__container">
          {/* Левая часть — информация */}
          <div className="hero__info">
            <div className="movie-meta">
              <div className="movie-info">
                <div className="movie-info__rating">
                  <img
                    src="/images/star.svg"
                    alt="Иконка рейтинга"
                    width="16"
                    height="16"
                  />
                  {currentMovie.rating}
                </div>
                <span className="movie-info__year">{currentMovie.year}</span>
                <span className="movie-info__genre"> {currentMovie.genre}</span>
                <span className="movie-info__duration">{currentMovie.duration}</span>
              </div>
            </div>

            <h1 className="movie-title">{currentMovie.title}</h1>
            <p className="movie-description">{currentMovie.description}</p>

            <div className="movie-actions">
              <button
                className="btn btn--trailer"
                onClick={handleTrailerClick}
              >
                Трейлер
              </button>
              <button
                className={`btn btn--favorite ${isFavorite ? 'btn--favorite--active' : ''}`}
                onClick={handleFavoriteClick}
              >
                <img
                  src={isFavorite ? "/images/favorites-filled.svg" : "/images/favorites.svg"}
                  alt={isFavorite ? "В избранных" : "Добавить в избранные"}
                  width="24"
                  height="24"
                />
              </button>
            </div>
          </div>

          {/* Правая часть — постер */}
          <div className="hero__poster">
            <img
              src={currentMovie.poster}
              alt={`Постер фильма ${currentMovie.title}`}
              width="680"
              height="552"
            />
          </div>
        </div>

        {/* Модальное окно трейлера */}
        {isModalOpen && currentMovie.trailerUrl && (
          <div className="modal" onClick={() => setIsModalOpen(false)}>
            <div
              className="modal__content"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className="modal__close"
                onClick={() => setIsModalOpen(false)}
              >
                ×
              </button>
              <iframe
                width="560"
                height="315"
                src={currentMovie.trailerUrl}
                title="Трейлер фильма"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          </div>
        )}
      </section>

      {/* Дополнительная информация о фильме */}
      <div className="movie-details">
        <div className="container">
          <h2>О фильме</h2>
          <div className="movie-info-table">
            <div className="info-row">
              <span className="info-label">Язык оригинала</span>
              <span className="info-value">{currentMovie.originalLanguage || 'Не указан'}</span>
            </div>
            <div className="info-row">
              <span className="info-label">Бюджет</span>
              <span className="info-value">{currentMovie.budget || 'Не указан'}</span>
            </div>
            <div className="info-row">
              <span className="info-label">Выручка</span>
              <span className="info-value">{currentMovie.revenue || 'Не указана'}</span>
            </div>
            <div className="info-row">
              <span className="info-label">Режиссёр</span>
              <span className="info-value">{currentMovie.director || 'Не указан'}</span>
            </div>
            <div className="info-row">
              <span className="info-label">Продакшен</span>
              <span className="info-value">{currentMovie.production || 'Не указан'}</span>
            </div>
            <div className="info-row">
              <span className="info-label">Награды</span>
              <span className="info-value">{currentMovie.awards || 'Нет'}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Movie;
