import React from 'react';
import { useNavigate } from 'react-router-dom';
import './UserProfile.scss';

interface User {
  email: string;
  firstName: string;
  lastName: string;
}

interface UserProfileProps {
  onLoginClick: () => void;
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
}

export const UserProfile: React.FC<UserProfileProps> = ({
  onLoginClick,
  user,
  isAuthenticated,
  loading
}) => {
  const navigate = useNavigate();

  if (loading) {
    return <div className="user-greeting">Загрузка...</div>;
  }

  return (
    <div
      className={`user-profile ${isAuthenticated ? 'authenticated' : ''}`}
      onClick={() => {
        if (isAuthenticated) {
          navigate('/account');
        } else {
          onLoginClick();
        }
      }}
      style={{ cursor: 'pointer' }}
    >
      {isAuthenticated && user ? (
        <span className="greeting-text">{user.lastName}</span>
      ) : (
          <button className="login-btn mobile-hidden" disabled={loading}>
          Войти
        </button>
      )}
    </div>
  );
};
