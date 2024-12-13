import React, { useState } from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Routes, Navigate, NavLink } from 'react-router-dom'; // Import NavLink
import { Provider } from 'react-redux';
import store from './redux/store';
import Indonesia from './pages/Indonesia';
import Programming from './pages/Programming';
import Saved from './pages/Saved';
import Home from './pages/Home';
import SearchResults from './pages/SearchResults';

import logo from './icons/logo.png';

const App = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <Provider store={store}>
      <Router>
        <div className="container">
          <nav className="navbar">
            <img src={logo} alt="Logo" className="logo" />
            <button
              className="menu-toggle"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              ☰
            </button>
            <ul className={`nav-links ${isMenuOpen ? 'open' : ''}`}>
              {/* Use NavLink instead of Link */}
              <li>
                <NavLink to="/home" className={({ isActive }) => (isActive ? 'active' : '')}>
                  Home
                </NavLink>
              </li>
              <li>
                <NavLink to="/indonesia" className={({ isActive }) => (isActive ? 'active' : '')}>
                  Indonesia
                </NavLink>
              </li>
              <li>
                <NavLink to="/programming" className={({ isActive }) => (isActive ? 'active' : '')}>
                  Programming
                </NavLink>
              </li>
              <li>
                <NavLink to="/saved" className={({ isActive }) => (isActive ? 'active' : '')}>
                  Saved
                </NavLink>
              </li>
            </ul>
          </nav>

          <Routes>
            <Route path="/" element={<Navigate to="/home" />} />
            <Route path="/home" element={<Home />} />
            <Route path="/search/:query" element={<SearchResults />} />
            <Route path="/indonesia" element={<Indonesia />} />
            <Route path="/programming" element={<Programming />} />
            <Route path="/saved" element={<Saved />} />
          </Routes>

          <footer className="footer">
            © 2024 News Web App
          </footer>
        </div>
      </Router>
    </Provider>
  );
};

export default App;
