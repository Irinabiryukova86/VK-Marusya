import React, { useState, useEffect } from 'react';
import { useAuth } from '../../components/modals/AuthContext/AuthContext';
import LoginForm from '../modals/LoginForm/LoginForm';
import './FavoriteButton.scss';

interface FavoriteButtonProps {
  movieId: number;
  onRemove?: (movieId: number) => void;
}

const FavoriteButton: React.FC<FavoriteButtonProps> = ({ movieId, onRemove }) => {
  const { isAuthenticated, addFavorite, removeFavorite, favorites, logout } = useAuth();
  const [showLogin, setShowLogin] = useState(false);
  const isCurrentlyFavorite = favorites.includes(movieId);
  const [isLoading, setIsLoading] = useState(false);
  const [pendingState, setPendingState] = useState<boolean | null>(null);
  const displayAsFavorite = pendingState !== null ? pendingState : isCurrentlyFavorite;


  const handleToggleFavorite = async () => {
    if (!isAuthenticated) {
      setShowLogin(true);
      return;
    }

    setIsLoading(true);
    const wasFavorite = isCurrentlyFavorite;
    setPendingState(!wasFavorite);

    try {
      if (wasFavorite) {
        await removeFavorite(movieId);
        onRemove?.(movieId);
      } else {
        await addFavorite(movieId);
      }
      setPendingState(null);
    } catch (error) {
      let errorMessage = 'Не удалось обновить список избранного';
      setPendingState(wasFavorite);

      if (typeof error === 'object' && error !== null && 'response' in error) {
        const err = error as { response?: { status: number; data?: any }; request?: any; message?: string };

        if (err.response) {
          const status = err.response.status;
          const message = err.response.data?.message ||
            JSON.stringify(err.response.data) ||
            'Неизвестная ошибка сервера';
          errorMessage = `Ошибка сервера (${status}): ${message}`;

          if (status === 401) {
            alert('Сессия истекла. Пожалуйста, войдите снова.');
            logout();
            return;
          } else if (status === 404) {
            errorMessage = 'Эндпоинт не найден. Проверьте конфигурацию API.';
          } else if (status >= 500) {
            errorMessage = 'Ошибка сервера. Попробуйте позже.';
          }
        } else if (err.request) {
          errorMessage =
            'Нет ответа от сервера. Проверьте:\n' +
            '1) Запущен ли бэкенд на http://localhost:3001\n' +
            '2) Корректен ли путь /favorites\n' +
            '3) Настройки CORS на сервере';
          console.error('Request details:', {
            url: (error as any).config?.url,
            method: (error as any).config?.method,
            timeout: (error as any).config?.timeout,
            withCredentials: (error as any).config?.withCredentials
          });
        } else if (err.message) {
          errorMessage = `Ошибка конфигурации запроса: ${err.message}`;
        }
      } else if (error instanceof Error) {
        errorMessage = `Неожиданная ошибка: ${error.message}`;
      } else {
        errorMessage = 'Произошла неизвестная ошибка';
      }

      console.error('Полная ошибка API:', error);
      alert(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoginSuccess = () => {
    setShowLogin(false);
    if (!isCurrentlyFavorite) {
      handleToggleFavorite();
    }
  };

  useEffect(() => {
    if (isAuthenticated && showLogin) {
      setShowLogin(false); 
    }
  }, [isAuthenticated, showLogin]);

  return (
    <div
      className="favorite-button-container"
    >
      <button
        className={`favorite-button ${displayAsFavorite ? 'favorite-button--active' : ''} ${isLoading ? 'loading' : ''}`}
        onClick={handleToggleFavorite}
        disabled={isLoading}
        title={
          isAuthenticated
            ? (displayAsFavorite ? 'Удалить из избранного' : 'Добавить в избранное')
            : 'Авторизуйтесь для добавления в избранное'
        }
      >
        {isLoading ? (
          <div className="spinner">...</div>
        ) : displayAsFavorite ? (
          <svg width="20" height="19" viewBox="0 0 20 19" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M14.5 0C17.5376 0 20 2.5 20 6C20 13 12.5 17 10 18.5C7.5 17 0 13 0 6C0 2.5 2.5 0 5.5 0C7.35997 0 9 1 10 2C11 1 12.64 0 14.5 0Z" fill="#B4A9FF" />
          </svg>
        ) : (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M16.5 3C19.5376 3 22 5.5 22 9C22 16 14.5 20 12 21.5C9.5 20 2 16 2 9C2 5.5 4.5 3 7.5 3C9.35997 3 11 4 12 5C13 4 14.64 3 16.5 3ZM12.9339 18.6038C13.8155 18.0485 14.61 17.4955 15.3549 16.9029C18.3337 14.533 20 11.9435 20 9C20 6.64076 18.463 5 16.5 5C15.4241 5 14.2593 5.56911 13.4142 6.41421L12 7.82843L10.5858 6.41421C9.74068 5.56911 8.5759 5 7.5 5C5.55906 5 4 6.6565 4 9C4 11.9435 5.66627 14.533 8.64514 16.9029C9.39 17.4955 10.1845 18.0485 11.0661 18.6038C11.3646 18.7919 11.6611 18.9729 12 19.1752C12.3389 18.9729 12.6354 18.7919 12.9339 18.6038Z" fill="white" />
          </svg>
        )}
      </button>
      {showLogin && <LoginForm onClose={() => setShowLogin(false)} onSuccess={handleLoginSuccess} />}
    </div>
  );
};

export default FavoriteButton;
