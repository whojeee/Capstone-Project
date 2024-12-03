import React, { useEffect } from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './redux/store';
import Indonesia from './pages/Indonesia';
import Programming from './pages/Programming';
import Saved from './pages/Saved';
import Home from './pages/Home';
import SearchResults from './pages/SearchResults'; // Create this component for displaying search results

import logo from './icons/logo.png'; 

const App = () => {
  return (
    <Provider store={store}>
      <Router>
        <div className="container">
          <nav className="navbar">
            <img src={logo} alt="Logo" className="logo" />
            <ul>
              <li><Link to="/home">Home</Link></li>
              <li><Link to="/indonesia">Indonesia</Link></li>
              <li><Link to="/programming">Programming</Link></li>
              <li><Link to="/saved">Saved</Link></li>
            </ul>
          </nav>

          <Routes>
            <Route path="/home" element={<Home />} />
            <Route path="/indonesia" element={<Indonesia />} />
            <Route path="/programming" element={<Programming />} />
            <Route path="/saved" element={<Saved />} />
            <Route path="/search" element={<SearchResults />} /> {/* New route for search */}
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
