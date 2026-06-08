import React, { useState } from 'react';
import { useAuth } from '../AuthContext/AuthContext';
import { useNavigate } from 'react-router-dom';
import './LoginForm.scss';

interface LoginFormProps {
  onClose: () => void;
  onSuccess?: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onClose, onSuccess }) => {
  const [registeredEmail, setRegisteredEmail] = useState('');
  const [registeredPassword, setRegisteredPassword] = useState('');
  const { login, register } = useAuth();
  const navigate = useNavigate();
  const [activeButton, setActiveButton] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState<{
    email?: boolean;
    password?: boolean;
    confirmPassword?: boolean;
    firstName?: boolean;
    lastName?: boolean;
  }>({});
  const [isRegistrationSuccess, setIsRegistrationSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // Индикатор загрузки

  const validateForm = (): boolean => {
    const newErrors: {
      email?: boolean;
      password?: boolean;
      confirmPassword?: boolean;
      firstName?: boolean;
      lastName?: boolean;
    } = {};

    if (!email) {
      newErrors.email = true;
    } else if (!/^\S+@\S+\.\S+$/.test(email)) {
      newErrors.email = true;
    }

    if (!password) {
      newErrors.password = true;
    }

    if (activeButton === 'register') {
      if (!firstName) {
        newErrors.firstName = true;
      }
      if (!lastName) {
        newErrors.lastName = true;
      }
      // Проверка подтверждения пароля
      if (!confirmPassword) {
        newErrors.confirmPassword = true;
      } else if (confirmPassword !== password) {
        newErrors.confirmPassword = true;
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      if (activeButton === 'login') {
        const success = await login(email, password);
        if (success) {
          onSuccess?.();
          onClose();
          navigate('/account');
        }
      } else if (activeButton === 'register') {
        const success = await register(email, password, firstName, lastName);
        if (success) {
          setIsRegistrationSuccess(true);
          setRegisteredEmail(email);
          setRegisteredPassword(password);
          setEmail('');
          setPassword('');
          setFirstName('');
          setLastName('');
          setConfirmPassword('');
        }
      }
    } catch (error) {
      console.error('Authentication error:', error);
      alert('Произошла ошибка при авторизации.');
    } finally {
      setIsLoading(false);
    }
  };


  const handleSuccessLogin = async () => {
    setIsLoading(true);
    try {
      const success = await login(registeredEmail, registeredPassword);

      if (success) {
        onSuccess?.();
        onClose();
        setIsRegistrationSuccess(false);
        navigate('/account');
      } else {
        alert('Не удалось войти автоматически. Проверьте данные и попробуйте снова.');
      }
    } catch (error) {
      console.error('Login after registration error:', error);
      alert('Произошла ошибка при входе. Проверьте данные.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSwitchToRegister = () => {
    setActiveButton('register');
    setErrors({});
    setIsRegistrationSuccess(false);
  };


  const handleLoginButtonClick = () => {
    setActiveButton('login');
    setErrors({});
    setIsRegistrationSuccess(false);
  };

  return (
    <div className="login-form-overlay">
      {isRegistrationSuccess ? (
        <div className="registration-success-screen">
          <button
            type="button"
            className="close-modal-btn"
            onClick={onClose}
            aria-label="Закрыть форму"
            disabled={isLoading}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12L19 6.41Z" fill="currentColor" />
            </svg>
          </button>
          <img
            className='logo-image'
            src="/images/MarysiaBlack.png"
            alt="МАРУСЯ"
          />
          <h1>Регистрация завершена</h1>
          <p className="success-message">
            Используйте вашу электронную почту для входа
          </p>
          <button
            type="button"
            className="success-login-btn"
            onClick={handleSuccessLogin}
            disabled={isLoading}
          >
            {isLoading ? 'Загрузка...' : 'Войти'}
          </button>
        </div>
      ) : (
        <form className="login-form" onSubmit={handleSubmit}>
          <img
            className='logo-image'
            src="/images/MarysiaBlack.png"
            alt="МАРУСЯ"
          />
          {activeButton === 'register' && (
            <h1>Регистрация</h1>
          )}

          <div className="inputs-wrapper">
            {/* Поле email */}
            <div className="form-group">
              <div className={`input-with-icon ${errors.email ? 'input-with-icon--error' : ''}`}>
                <svg className="input-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M21 3C21.5523 3 22 3.44772 22 4V20.0066C22 20.5552 21.5447 21 21.0082 21H2.9918C2.44405 21 2 20.5551 2 20.0066V19H20V7.3L12 14.5L2 5.5V4C2 3.44772 2.44772 3 3 3H21ZM8 15V17H0V15H8ZM5 10V12H0V10H5ZM19.5659 5H4.43414L12 11.8093L19.5659 5Z" fill="black" fillOpacity="0.4" />
                </svg>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={errors.email ? 'input-error email-input' : 'email-input'}
                  placeholder="Электронная почта"
                />
              </div>
            </div>

            {/* Поле пароля */}
            <div className="form-group">
              <div className={`input-with-icon ${errors.password ? 'input-with-icon--error' : ''}`}>
                <svg className="input-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12.917 13C12.441 15.8377 9.973 18 7 18C3.68629 18 1 15.3137 1 12C1 8.68629 3.68629 6 7 6C9.973 6 12.441 8.16229 12.917 11H23V13H21V17H19V13H17V17H15V13H12.917ZM7 16C9.20914 16 11 14.2091 11 12C11 9.79086 9.20914 8 7 8C4.79086 8 3 9.79086 3 12C3 14.2091 4.79086 16 7 16Z" fill="black" fillOpacity="0.4" />
                </svg>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={errors.password ? 'input-error password-input' : 'password-input'}
                  placeholder="Пароль"
                />
              </div>
            </div>

            {/* Поля для регистрации */}
            {activeButton === 'register' && (
              <>
                <div className="form-group">
                  <div className={`input-with-icon ${errors.firstName ? 'input-with-icon--error' : ''}`}>
                    <svg className="input-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M4 22C4 17.5817 7.58172 14 12 14C16.4183 14 20 17.5817 20 22H18C18 18.6863 15.3137 16 12 16C8.68629 16 6 18.6863 6 22H4ZM12 13C8.685 13 6 10.315 6 7C6 3.685 8.685 1 12 1C15.315 1 18 3.685 18 7C18 10.315 15.315 13 12 13ZM12 11C14.21 11 16 9.21 16 7C16 4.79 14.21 3 12 3C9.79 3 8 4.79 8 7C8 9.21 9.79 11 12 11Z" fill="black" fillOpacity="0.4" />
                    </svg>
                    <input
                      type="text"
                      id="firstName"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className={errors.firstName ? 'input-error name-input' : 'name-input'}
                      placeholder="Имя"
                    />
                  </div>
                </div>
                <div className="form-group">
                  <div className={`input-with-icon ${errors.lastName ? 'input-with-icon--error' : ''}`}>
                    <svg className="input-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M4 22C4 17.5817 7.58172 14 12 14C16.4183 14 20 17.5817 20 22H18C18 18.6863 15.3137 16 12 16C8.68629 16 6 18.6863 6 22H4ZM12 13C8.685 13 6 10.315 6 7C6 3.685 8.685 1 12 1C15.315 1 18 3.685 18 7C18 10.315 15.315 13 12 13ZM12 11C14.21 11 16 9.21 16 7C16 4.79 14.21 3 12 3C9.79 3 8 4.79 8 7C8 9.21 9.79 11 12 11Z" fill="black" fillOpacity="0.4" />
                    </svg>
                    <input
                      type="text"
                      id="lastName"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      className={errors.lastName ? 'input-error name-input' : 'name-input'}
                      placeholder="Фамилия"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <div className={`input-with-icon ${errors.confirmPassword ? 'input-with-icon--error' : ''}`}>
                    <svg className="input-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12.917 13C12.441 15.8377 9.973 18 7 18C3.68629 18 1 15.3137 1 12C1 8.68629 3.68629 6 7 6C9.973 6 12.441 8.16229 12.917 11H23V13H21V17H19V13H17V17H15V13H12.917ZM7 16C9.20914 16 11 14.2091 11 12C11 9.79086 9.20914 8 7 8C4.79086 8 3 9.79086 3 12C3 14.2091 4.79086 16 7 16Z" fill="black" fillOpacity="0.4" />
                    </svg>
                    <input
                      type="password"
                      id="confirmPassword"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className={errors.confirmPassword ? 'input-error confirm-password-input' : 'confirm-password-input'}
                      placeholder="Подтвердите пароль"
                    />
                  </div>
                </div>
              </>
            )}
          </div>
          <div className="form-actions">
            <button
              type="submit"
              className={`submit-btn ${activeButton === 'login' ? 'submit-btn--login' : 'submit-btn--register'}`}
              disabled={isLoading}
            >
              {isLoading ? 'Загрузка...' : (activeButton === 'login' ? 'Войти' : 'Зарегистрироваться')}
            </button>
            <button
              type="button"
              onClick={activeButton === 'login' ? handleSwitchToRegister : handleLoginButtonClick}
              className="switch-btn"
            >
              {activeButton === 'login' ? 'Регистрация' : 'У меня есть пароль'}
            </button>
          </div>
          <button
            type="button"
            className="close-modal-btn"
            onClick={onClose}
            aria-label="Закрыть форму"
            disabled={isLoading}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12L19 6.41Z" fill="currentColor" />
            </svg>
          </button>
        </form>
      )}
    </div>
  );

};

export default LoginForm;
