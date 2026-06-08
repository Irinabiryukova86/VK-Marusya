import { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './components/modals/AuthContext/AuthContext';
import LoginForm from './components/modals/LoginForm/LoginForm';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import Home from './pages/Home/Home';
import GenresList from './pages/GenresList/GenresList';
import GenrePage from './pages/GenrePage/GenrePage';
import Movie from './pages/Movie/Movie';
import Account from './pages/Account/Account';
import './styles/fonts.scss';
import './App.scss'

function App() {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  const handleLoginClick = () => {
    setIsLoginModalOpen(true);
  };

  return (
    <AuthProvider>
      <div
        className="app"
            >
        <Header onLoginClick={handleLoginClick} />
                <main
          className="main-content"
          style={{ flexGrow: 1 }}
        >
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/account" element={<Account />} />
            <Route path="/genres" element={<GenresList />} />
            <Route path="/genre/:genre" element={<GenrePage />} />
            <Route
              path="/movie/:id"
              element={<Movie isAuthenticated={false} onLoginClick={handleLoginClick} />}
            />
          </Routes>
        </main>
        <Footer />
      </div>
      {isLoginModalOpen && (
        <LoginForm
          onClose={() => setIsLoginModalOpen(false)}
          onSuccess={() => setIsLoginModalOpen(false)}
        />
      )}
    </AuthProvider>
  );
}


export default App;
