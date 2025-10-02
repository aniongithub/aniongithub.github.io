import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import ThemeToggle from './ThemeToggle';
import articles from '../data/articles.json';
import './Header.css';

const Header: React.FC = () => {
  const location = useLocation();
  
  const isActive = (path: string) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <header className="metro-header">
      <ThemeToggle />
      <nav className="pivot-nav">
        <Link 
          to="/"
          className={`tab ${isActive('/') ? 'active' : ''}`}
        >
          Home
        </Link>
        {articles.length > 0 && (
          <Link 
            to="/articles"
            className={`tab ${isActive('/articles') ? 'active' : ''}`}
          >
            Articles
          </Link>
        )}
        <Link 
          to="/github"
          className={`tab ${isActive('/github') ? 'active' : ''}`}
        >
          GitHub
        </Link> 
        <Link 
          to="/about"
          className={`tab ${isActive('/about') ? 'active' : ''}`}
        >
          About
        </Link>
      </nav>
    </header>
  );
};

export default Header;