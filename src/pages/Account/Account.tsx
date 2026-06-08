import React, { useState } from 'react';
import { useAuth } from '../../components/modals/AuthContext/AuthContext';
import { useNavigate } from 'react-router-dom';
import moviesData from '../../data/movies.json';
import './Account.scss';

const Account: React.FC = () => {
  const { user, favorites, logout, removeFavorite } = useAuth();
  const [activeTab, setActiveTab] = useState<'favorites' | 'settings'>('favorites');
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };


  const favoriteMovies = moviesData.filter(movie => favorites.includes(movie.id));

  const getInitials = () => {
    const firstName = user?.firstName || '';
    const lastName = user?.lastName || '';

    return `${firstName.charAt(0).toUpperCase()}${lastName.charAt(0).toUpperCase()}`;
  };

  // Функция удаления фильма из избранного
  const handleRemoveFromFavorites = async (movieId: number) => {
    await removeFavorite(movieId);
  };

  return (
    <div className="account-page">
      {/* Hero секция */}
      <section className="hero-accaunt">
        <h1 className='hero-accaunt__title'>Мой аккаунт</h1>

        {/* Табы */}
        <div className="account-options">
          <div
            className={`option ${activeTab === 'favorites' ? 'active' : ''}`}
            onClick={() => setActiveTab('favorites')}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M16.5 3C19.5376 3 22 5.5 22 9C22 16 14.5 20 12 21.5C9.5 20 2 16 2 9C2 5.5 4.5 3 7.5 3C9.35997 3 11 4 12 5C13 4 14.64 3 16.5 3ZM12.9339 18.6038C13.8155 18.0485 14.61 17.4955 15.3549 16.9029C18.3337 14.533 20 11.9435 20 9C20 6.64076 18.463 5 16.5 5C15.4241 5 14.2593 5.56911 13.4142 6.41421L12 7.82843L10.5858 6.41421C9.74068 5.56911 8.5759 5 7.5 5C5.55906 5 4 6.6565 4 9C4 11.9435 5.66627 14.533 8.64514 16.9029C9.39 17.4955 10.1845 18.0485 11.0661 18.6038C11.3646 18.7919 11.6611 18.9729 12 19.1752C12.3389 18.9729 12.6354 18.7919 12.9339 18.6038Z" fill="white" />
            </svg>
            <span className='option__name'>
              {window.innerWidth <= 1439 ? 'Избранное' : 'Избранные фильмы'}
            </span>
          </div>
          <div
            className={`option ${activeTab === 'settings' ? 'active' : ''}`}
            onClick={() => setActiveTab('settings')}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M4 22C4 17.5817 7.58172 14 12 14C16.4183 14 20 17.5817 20 22H18C18 18.6863 15.3137 16 12 16C8.68629 16 6 18.6863 6 22H4ZM12 13C8.685 13 6 10.315 6 7C6 3.685 8.685 1 12 1C15.315 1 18 3.685 18 7C18 10.315 15.315 13 12 13ZM12 11C14.21 11 16 9.21 16 7C16 4.79 14.21 3 12 3C9.79 3 8 4.79 8 7C8 9.21 9.79 11 12 11Z" fill="white" />
            </svg>
            <span className='option__name'>
              {window.innerWidth <= 1439 ? 'Настройки' : 'Настройка аккаунта'}
            </span>
          </div>
        </div>

      </section>

      {/* Секция избранных фильмов */}
      {activeTab === 'favorites' && (
        <section className="favorite-movies">
          <div className="movies-grid-container">
            <div className="movies-grid-accaunt">
              {favoriteMovies.map(movie => (
                <div key={movie.id} className="movie-card">
                  <div className="movie-card__container">
                    <button
                      className="remove-favorite-btn"
                      onClick={() => handleRemoveFromFavorites(movie.id)}
                      aria-label={`Удалить "${movie.title}" из избранного`}
                    >
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M11.9987 10.5865L16.9485 5.63672L18.3627 7.05093L13.4129 12.0007L18.3627 16.9504L16.9485 18.3646L11.9987 13.4149L7.04899 18.3646L5.63477 16.9504L10.5845 12.0007L5.63477 7.05093L7.04899 5.63672L11.9987 10.5865Z" fill="black" />
                      </svg>
                    </button>
                    <div className="movie-card__poster">
                      <img
                        src={movie.poster}
                        alt={movie.title}
                        className="movie-poster"
                        onError={(e) => {
                          const img = e.target as HTMLImageElement;
                          img.style.display = 'none';

                          const parent = img.parentElement;
                          if (parent instanceof HTMLElement) {
                            // Создаём placeholder элемент
                            const placeholder = document.createElement('div');
                            placeholder.className = 'poster-placeholder';
                            placeholder.textContent = 'Постер недоступен';
                            parent.innerHTML = '';
                            parent.appendChild(placeholder);
                          }
                        }}
                      />
                    </div>
                    {/* Новый оверлей со стрелкой */}
                    <div className="arrow-overlay">
                      <svg width="24" height="37" viewBox="0 0 24 37" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M15.4034 21.2569L19.9775 33.824L11.5594 36.8879L6.98546 24.3208L0 28.702L2.89992 0L23.5706 20.123L15.4034 21.2569ZM15.3846 31.6823L10.5202 18.3173L15.8225 17.5811L5.71895 7.74523L4.3015 21.7743L8.83661 18.9301L13.701 32.295L15.3846 31.6823Z" fill="white" />
                      </svg>
                    </div>
                  </div>
                </div>

              ))}
            </div>
          </div>
        </section>
      )}

      {/* Секция настроек аккаунта */}
      {activeTab === 'settings' && user && (
        <section className="account-settings">
          <div className="user">
            {/* Блок с инициалами и данными пользователя */}
            <div className="user__profile">
              <div className="initials-circle">
                {getInitials()}
              </div>
              <div className="info-item">
                <span className="label">Имя Фамилия</span>
                <span className="value">
                  {user?.firstName || ''} {user?.lastName || ''}
                </span>
              </div>
            </div>

            {/* Блок с email */}
            <div className="user__profile">
              <div className="email-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M21 3C21.5523 3 22 3.44772 22 4V20.0066C22 20.5552 21.5447 21 21.0082 21H2.9918C2.44405 21 2 20.5551 2 20.0066V19H20V7.3L12 14.5L2 5.5V4C2 3.44772 2.44772 3 3 3H21ZM8 15V17H0V10H5ZM19.5659 5H4.43414L12 11.8093L19.5659 5Z" fill="white" />
                </svg>
              </div>

              <div className="info-item">
                <span className="label">Электронная почта</span>
                <span className="value">{user?.email || 'Не указана'}</span>
              </div>
            </div>
          </div>

          <button className="logout-btn" onClick={handleLogout}>
            Выйти из аккаунта
          </button>
        </section>
      )}
    </div>
  );
};

export default Account;
