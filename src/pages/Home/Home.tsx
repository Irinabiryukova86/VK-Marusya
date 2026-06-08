import { Link } from 'react-router-dom'; 
import Hero from '../../components/Hero/Hero';
import moviesData from '../../data/movies.json';
import './Home.scss';

const Home: React.FC = () => {
  const moviesToDisplay = moviesData.slice(0, 10);


  return (
    <div>
      <Hero />
      <main className="movies-grid">
        <div className="movies-grid__home">
          <h2 className="movies-grid__title">Топ 10 фильмов</h2>
          <div className="movies-grid__container">
            {moviesToDisplay.map((movie, index) => (
              <Link
                key={movie.id}
                to={`/movie/${movie.id}`}
                className="movie-card-link"
                style={{ textDecoration: 'none', color: 'inherit' }}
              >
                <div className="movie-card">
                  <div className="movie-card__inner">
                    <div className="movie-card__number">{index + 1}</div>
                    <div className="movie-card__poster">
                      <img
                        src={movie.poster}
                        alt={`Постер фильма ${movie.title}`}
                        width="224"
                        height="336"
                      />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};


export default Home;
