import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import moviesData from '../../../data/movies.json';

interface User {
  email: string;
  firstName: string;
  lastName: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  token: string | null;
  favorites: number[];
  getFavoriteMovies: () => { id: number }[];
  login: (email: string, password: string) => Promise<boolean>;
  register: (email: string, password: string, firstName: string, lastName: string) => Promise<boolean>;
  logout: () => void;
  loading: boolean;
  addFavorite: (movieId: number) => Promise<void>;
  removeFavorite: (movieId: number) => Promise<void>;
}

// Создаём экземпляр axios с базовым URL вашего бэкенда
const api = axios.create({
  baseURL: 'http://localhost:3001',
});

export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [favorites, setFavorites] = useState<number[]>([]);
  const [token, setToken] = useState<string | null>(null);

  const isAuthenticated = !!user;

  // Инициализация при загрузке
  useEffect(() => {
    const savedToken = localStorage.getItem('authToken');
    const savedUserEmail = localStorage.getItem('activeEmail');

    if (savedToken && savedUserEmail) {
      // Восстанавливаем пользователя из сохранённых данных
      const savedUserString = localStorage.getItem(`user_${savedUserEmail}`);
      if (savedUserString) {
        try {
          const savedUser: User = JSON.parse(savedUserString);
          setUser(savedUser);
          setToken(savedToken);
        } catch (error) {
          console.error('Error parsing saved user:', error);
        }
      }
    }

    const savedFavorites = localStorage.getItem('favorites');
    if (savedFavorites) {
      try {
        const parsedFavorites = JSON.parse(savedFavorites);
        if (Array.isArray(parsedFavorites)) {
          setFavorites(parsedFavorites);
        }
      } catch (error) {
        console.error('Error parsing favorites:', error);
        localStorage.removeItem('favorites');
      }
    }
  }, []);

  const login = useCallback(async (email: string, password: string): Promise<boolean> => {
    setLoading(true);
    try {
      const savedUserString = localStorage.getItem(`user_${email}`);

      if (!savedUserString) {
        alert('Пользователь не найден. Зарегистрируйтесь сначала.');
        return false;
      }

      const savedUser: User = JSON.parse(savedUserString);
      const savedPasswordHash = localStorage.getItem(`password_hash_${email}`);

      if (!savedPasswordHash || savedPasswordHash !== password) {
        alert('Неверный пароль. Проверьте данные и попробуйте снова.');
        return false;
      }

      const { firstName, lastName } = savedUser;

      setUser({ email, firstName, lastName });
      localStorage.setItem('activeEmail', email);
      setToken(email);
      localStorage.setItem('authToken', email);
      return true;
    } catch (error) {
      console.error('Login error:', error);
      alert('Произошла ошибка при входе.');
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const register = useCallback(async (
    email: string,
    password: string,
    firstName: string,
    lastName: string
  ): Promise<boolean> => {
    setLoading(true);
    try {
      if (!email || !password || !firstName || !lastName) {
        alert('Заполните все поля.');
        return false;
      }

      if (password.length < 6) {
        alert('Пароль должен содержать минимум 6 символов.');
        return false;
      }

      const existingUser = localStorage.getItem(`user_${email}`);
      if (existingUser) {
        alert('Пользователь с таким email уже существует. Войдите в систему.');
        return false;
      }

      const newUser: User = { email, firstName, lastName };
      setUser(newUser);

      // Сохраняем данные пользователя и хешированный пароль
      localStorage.setItem(`user_${email}`, JSON.stringify(newUser));
      localStorage.setItem(`password_hash_${email}`, password);
      localStorage.setItem('activeEmail', email);
      setToken(email);
      localStorage.setItem('authToken', email); 

      return true;
    } catch (error) {
      console.error('Registration error:', error);
      alert('Произошла ошибка при регистрации.');
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('activeEmail');
    localStorage.removeItem('authToken');
    setUser(null);
    setToken(null);
  }, []);

  const addFavorite = async (movieId: number): Promise<void> => {
    try {
      await api.post('/favorites', { movieId });
      setFavorites(prev => [...prev, movieId]);
      // Сохраняем в localStorage
      localStorage.setItem('favorites', JSON.stringify([...favorites, movieId]));
    } catch (error) {
      console.error('Ошибка при добавлении в избранное:', error);
    }
  };

  const getFavoriteMovies = useCallback(() => {
    return moviesData.filter((movie: { id: number }) =>
      favorites.includes(movie.id)
    );
  }, [favorites]);

  const removeFavorite = async (movieId: number): Promise<void> => {
    try {
      await api.delete(`/favorites/${movieId}`);
      // Обновляем локальное состояние после успешного удаления
      setFavorites(prev => prev.filter(id => id !== movieId));
      // Сохраняем в localStorage
      localStorage.setItem('favorites', JSON.stringify(favorites.filter(id => id !== movieId)));
    } catch (error) {
      console.error('Ошибка при удалении из избранного:', error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        token,
        favorites,
        getFavoriteMovies,
        login,
        register,
        logout,
        loading,
        addFavorite,
        removeFavorite
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
