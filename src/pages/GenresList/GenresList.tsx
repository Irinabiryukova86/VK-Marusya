import React from 'react';
import { Link } from 'react-router-dom';
import moviesData from '../../data/movies.json';
import './GenresList.scss';

const GenresList: React.FC = () => {

  const genreSet = new Set<string>();

  moviesData.forEach(movie => {
    const genreParts = movie.genre
      .split(',')
      .map(g => g.trim())
      .filter(g => g.length > 0);

    genreParts.forEach(genre => {
      genreSet.add(genre);
    });
  });

  const uniqueGenres = Array.from(genreSet).sort((a, b) => a.localeCompare(b, 'ru'));

  const getRandomMovieByGenre = (genreName: string) => {
    const moviesOfGenre = moviesData.filter(movie => {
      const movieGenres = movie.genre;
      return movieGenres.includes(genreName);
    });

    if (moviesOfGenre.length === 0) return null;

    const randomIndex = Math.floor(Math.random() * moviesOfGenre.length);
    return moviesOfGenre[randomIndex];
  };

  return (
    <div className="genres-list">
      <h1 className="genres-list__title">Жанры фильмов</h1>
      <div className="genres-grid">
        {uniqueGenres.map((genre, index) => {
          const movie = getRandomMovieByGenre(genre);
          const color = '#' + Math.floor(Math.abs(genre.split('').reduce((a, c) => ((a << 5) - a) + c.charCodeAt(0), 0)) % 0xFFFFFF).toString(16).padStart(6, '0');

          return (
            <Link
              key={genre + index}
              to={`/genre/${genre}`}
              className="genre-card"
              style={{ backgroundColor: color }}
            >
              <div className="genre-card__image-wrapper">
                {movie && movie.poster ? (
                  <img
                    src={movie.poster}
                    alt={`Кадр из фильма в жанре ${genre}`}
                    className="genre-card__image"
                  />
                ) : (
                  <div className="genre-card__placeholder">
                    Нет постера
                  </div>
                )}
              </div>
              <div className="genre-card__footer">
                <h3 className="genre-card__title">{genre}</h3>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default GenresList;
