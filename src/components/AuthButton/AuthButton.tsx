import React, { useState } from 'react';
import { useAuth } from '../modals/AuthContext/AuthContext';
import { Link } from 'react-router-dom';
import LoginForm from '../modals/LoginForm/LoginForm';

const AuthButton: React.FC = () => {
  const { isAuthenticated, user } = useAuth();
  const [showLogin, setShowLogin] = useState(false);

  const handleLoginClick = () => setShowLogin(true);
  const handleCloseLogin = () => setShowLogin(false);
  const handleLoginSuccess = () => setShowLogin(false);

  // Определяем отображаемое имя
  const displayName = isAuthenticated
    ? user?.lastName || user?.firstName || 'Пользователь'
    : null;

  if (isAuthenticated && displayName) {
    return (
      <Link
        to="/account"
        className="account-button"
        title="Перейти в аккаунт"
      >
        <span className="account-surname">
          {displayName}
        </span>
      </Link>
    );
  }

  return (
    <>
      <button
        className="login-button"
        onClick={handleLoginClick}
        title="Войти в аккаунт"
      >
        Войти
      </button>

      {showLogin && (
        <LoginForm
          onClose={handleCloseLogin}
          onSuccess={handleLoginSuccess}
        />
      )}
    </>
  );
};

export default AuthButton;
