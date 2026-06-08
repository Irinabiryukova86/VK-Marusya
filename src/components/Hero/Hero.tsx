import React, { useState, useEffect } from 'react';
import './Hero.scss';
import moviesData from '../../data/movies.json';
import { Link } from 'react-router-dom';
import type { Movie } from '../../types/Movie';
import FavoriteButton from '../FavoriteButton/FavoriteButton';

const Hero: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentMovie, setCurrentMovie] = useState<Movie | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRandomMovie();
  }, []);

  const loadRandomMovie = () => {
    setLoading(true);
    if (moviesData.length === 0) {
      setCurrentMovie(null);
      setLoading(false);
      return;
    }

    const randomIndex = Math.floor(Math.random() * moviesData.length);
    const selectedMovie = moviesData[randomIndex];

    if (selectedMovie && typeof selectedMovie === 'object') {
      setCurrentMovie(selectedMovie as Movie);
    } else {
      setCurrentMovie(null);
    }
    setLoading(false);
  };

  const handleTrailerClick = () => setIsModalOpen(true);

  if (loading || !currentMovie) {
    return <div className="hero-loading">Загрузка фильма...</div>;
  }

  return (
    <section className="hero">
      <div className="hero__container">
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
            <button className="btn btn--trailer" onClick={handleTrailerClick}>Трейлер</button>
            <Link
              to={`/movie/${currentMovie.id}`}
              className="btn btn--about"
            >
              О фильме
            </Link>

            {/* Заменяем кнопку на компонент FavoriteButton */}
            <FavoriteButton movieId={currentMovie.id} />

            <button className="btn btn--refresh" onClick={loadRandomMovie}>
              <img className='btn__icon'
                src="/images/update.svg"
                alt="Иконка обновления"
                width="24"
                height="24"
              />
            </button>
          </div>
        </div>

        <div className="hero__poster">
          <img
            src={currentMovie.poster}
            alt={`Постер фильма ${currentMovie.title}`}
          />
        </div>
      </div>

      {isModalOpen && currentMovie.trailerUrl && (
        <div className="modal" onClick={() => setIsModalOpen(false)}>
          <div className="modal__content" onClick={(e) => e.stopPropagation()}>
            <button className="modal__close" onClick={() => setIsModalOpen(false)}>×</button>
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
  );
};

export default Hero;
