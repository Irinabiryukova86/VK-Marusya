import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../modals/AuthContext/AuthContext';
import { UserProfile } from '../UserProfile/UserProfile';
import SearchModal from '../SearchModal/SearchModal';

import './Header.scss';

interface HeaderProps {
  onLoginClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ onLoginClick }) => {
  const location = useLocation();
  const { user, isAuthenticated, loading } = useAuth();
  const [showLogin, setShowLogin] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const [query, setQuery] = useState('');
  const [isSearchVisible, setIsSearchVisible] = useState(false);

  // Состояние для управления видимостью иконок
  const [areIconsHidden, setAreIconsHidden] = useState(false);

  const closeLoginForm = () => setShowLogin(false);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isSearchOpen &&
        modalRef.current &&
        !modalRef.current.contains(event.target as Node) &&
        searchInputRef.current &&
        !searchInputRef.current.contains(event.target as Node)
      ) {
        setIsSearchOpen(false);
        setIsSearchVisible(false);
        setAreIconsHidden(false); // Возвращаем иконки
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isSearchOpen]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (showLogin && !(event.target as Element).closest('.login-form')) {
        closeLoginForm();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showLogin]);


  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);

    if (value.trim()) {
      setIsSearchOpen(true);
      setIsSearchVisible(true);
      if (window.innerHeight <= 1439) {
        setAreIconsHidden(true);
      }
    } else {
      setIsSearchOpen(false);
      setIsSearchVisible(false);
      setAreIconsHidden(false);
    }
  };

  const [hasSearchResults, setHasSearchResults] = useState(false);

  const [screenWidth, setScreenWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 0);

  useEffect(() => {
    const handleResize = () => setScreenWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);


  return (
    <>
      <header className="home-header">
        <div className="header__container">
          <div className={`logo-wrapper ${areIconsHidden ? 'hidden' : ''}`}>
            <Link to="/" className="logo">
              <img
                src="/images/MarysiaWhite.png"
                alt="МАРУСЯ"
              />
            </Link>
          </div>
          <div className="header__nav-search">
            <nav className={`nav-links ${areIconsHidden ? 'hidden' : ''}`}>
              <Link
                to="/"
                className={`nav-link ${location.pathname === '/' ? 'nav-link--active' : ''}`}
              >
                Главная
              </Link>
              <Link
                to="/genres"
                className={`nav-link ${location.pathname === '/genres' ? 'nav-link--active' : ''}`}
              >
                Жанры
              </Link>
            </nav>

            <div className={`search-container ${isSearchVisible ? 'search-visible' : ''}`}>
              <div className={`search-wrapper ${isSearchVisible ? 'search-wrapper--visible' : ''}`}>
                <img
                  src="/images/search-icon.png"
                  alt="Поиск"
                  className="search-icon"
                />
                <input
                  ref={searchInputRef}
                  type="text"
                  value={query}
                  onChange={handleInputChange}
                  placeholder="Поиск"
                  className="search-input"
                />

                {query && (
                  <button
                    type="button"
                    className="clear-button"
                    aria-label="Очистить поиск"
                    onClick={() => {
                      setQuery('');
                      searchInputRef.current?.focus();
                    }}
                  >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M11.9987 10.5865L16.9485 5.63672L18.3627 7.05093L13.4129 12.0007L18.3627 16.9504L16.9485 18.3646L11.9987 13.4149L7.04899 18.3646L5.63477 16.9504L10.5845 12.0007L5.63477 7.05093L7.04899 5.63672L11.9987 10.5865Z" fill="white" fill-opacity="0.5" />
                    </svg>
                  </button>
                )}
              </div>
              {isSearchOpen && (
                <div
                  ref={modalRef}
                  className="search-modal"
                >
                  <SearchModal
                    isOpen={isSearchOpen}
                    onClose={() => {
                      setIsSearchOpen(false);
                      setIsSearchVisible(false);
                      setAreIconsHidden(false);
                      setHasSearchResults(false);
                    }}
                    searchInputRef={searchInputRef}
                    query={query}
                    setQuery={setQuery}
                    setHasSearchResults={setHasSearchResults}
                  />

                </div>
              )}
            </div>
          </div>

          {/* ПРОФИЛЬ ПОЛЬЗОВАТЕЛЯ: фамилия или кнопка «Войти» */}
          <UserProfile onLoginClick={onLoginClick} user={user} isAuthenticated={isAuthenticated} loading={loading} />

          {/* ИКОНКИ: теперь управляем их видимостью через areIconsHidden */}
          <div className={`header__icons ${areIconsHidden ? 'hidden' : ''}`}>
            <Link to="/genres" className="icon-btn" aria-label="Жанры">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M7 11.5C4.51472 11.5 2.5 9.48528 2.5 7C2.5 4.51472 4.51472 2.5 7 2.5C9.48528 2.5 11.5 4.51472 11.5 7C11.5 9.48528 9.48528 11.5 7 11.5ZM7 21.5C4.51472 21.5 2.5 19.4853 2.5 17C2.5 14.5147 4.51472 12.5 7 12.5C9.48528 12.5 11.5 14.5147 11.5 17C11.5 19.4853 9.48528 21.5 7 21.5ZM17 11.5C14.5147 11.5 12.5 9.48528 12.5 7C12.5 4.51472 14.5147 2.5 17 2.5C19.4853 2.5 21.5 4.51472 21.5 7C21.5 9.48528 19.4853 11.5 17 11.5ZM17 21.5C14.5147 21.5 12.5 19.4853 12.5 17C12.5 14.5147 14.5147 12.5 17 12.5C19.4853 12.5 21.5 14.5147 21.5 17C21.5 19.4853 19.4853 21.5 17 21.5ZM7 9.5C8.38071 9.5 9.5 8.38071 9.5 7C9.5 5.61929 8.38071 4.5 7 4.5C5.61929 4.5 4.5 5.61929 4.5 7C4.5 8.38071 5.61929 9.5 7 9.5ZM7 19.5C8.38071 19.5 9.5 18.3807 9.5 17C9.5 15.6193 8.38071 14.5 7 14.5C5.61929 14.5 4.5 15.6193 4.5 17C4.5 18.3807 5.61929 19.5 7 19.5ZM17 9.5C18.3807 9.5 19.5 8.38071 19.5 7C19.5 5.61929 18.3807 4.5 17 4.5C15.6193 4.5 14.5 5.61929 14.5 7C14.5 8.38071 15.6193 9.5 17 9.5ZM17 19.5C18.3807 19.5 19.5 18.3807 19.5 17C19.5 15.6193 18.3807 14.5 17 14.5C15.6193 14.5 14.5 15.6193 14.5 17C14.5 18.3807 15.6193 19.5 17 19.5Z" fill="white" />
              </svg>
            </Link>
            <button
              className="icon-btn"
              aria-label="Поиск"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setIsSearchVisible(true);
                setIsSearchOpen(true);
                setAreIconsHidden(true);

                requestAnimationFrame(() => {
                  searchInputRef.current?.focus();
                });
              }}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M18.031 16.6168L22.3137 20.8995L20.8995 22.3137L16.6168 18.031C15.0769 19.263 13.124 20 11 20C6.032 20 2 15.968 2 11C2 6.032 6.032 2 11 2C15.968 2 20 6.032 20 11C20 13.124 19.263 15.0769 18.031 16.6168ZM16.0247 15.8748C17.2475 14.6146 18 12.8956 18 11C18 7.1325 14.8675 4 11 4C7.1325 4 4 7.1325 4 11C4 14.8675 7.1325 18 11 18C12.8956 18 14.6146 17.2475 15.8748 16.0247L16.0247 15.8748Z" fill="white" />
              </svg>
            </button>
            <button
              className="icon-btn"
              aria-label="Профиль"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onLoginClick();
              }}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M4 22C4 17.5817 7.58172 14 12 14C16.4183 14 20 17.5817 20 22H18C18 18.6863 15.3137 16 12 16C8.68629 16 6 18.6863 6 22H4ZM12 13C8.685 13 6 10.315 6 7C6 3.685 8.685 1 12 1C15.315 1 18 3.685 18 7C18 10.315 15.315 13 12 13ZM12 11C14.21 11 16 9.21 16 7C16 4.79 14.21 3 12 3C9.79 3 8 4.79 8 7C8 9.21 9.79 11 12 11Z" fill="white" />
              </svg>
            </button>
          </div>
        </div>
        {/* МОДАЛЬНОЕ ОКНО ПОИСКА ДЛЯ МОБИЛЬНОЙ ВЕРСИИ */}
        {isSearchVisible && typeof window !== 'undefined' && screenWidth <= 1439 && (
          <div
            className={`mobile-search-overlay ${hasSearchResults ? 'overlay-with-results' : 'overlay-without-results'}`}
            onClick={() => {
              if (!hasSearchResults) {
                setIsSearchVisible(false);
                setAreIconsHidden(false);
                setQuery('');
                setHasSearchResults(false);
              }
            }}
          >
            <div className="mobile-keyboard-wrapper" onClick={(e) => e.stopPropagation()}>
              <img src="/images/Keyboard.png" alt="Клавиатура" className="mobile-keyboard-image" />
            </div>
          </div>
        )}
      </header>
    </>
  );
};

export default Header;