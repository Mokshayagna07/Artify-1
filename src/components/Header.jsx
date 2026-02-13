import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ProfileDropdown from './ProfileDropdown';
import sparkIcon from '../assets/spark.png';
import '../css/Header.css';

const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [searchFocused, setSearchFocused] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreditDropdown, setShowCreditDropdown] = useState(false);

  // Mock Data
  const recentSearches = ['Cyberpunk City', 'Watercolor Cat', 'Abstract Neon'];
  const userCredits = { total: 100, used: 65, resetDate: 'Jan 15, 2026' };
  const creditPercentage = (userCredits.used / userCredits.total) * 100;

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="header">
      {/* Left: Logo */}
      <div className="header-left">
        <Link to="/" className="logo-container" style={{ textDecoration: 'none' }}>
          <img src={sparkIcon} alt="Spark" className="spark-icon" />
          <span className="logo">Artify</span>
        </Link>
      </div>

      {/* Center: Search Bar (Only when logged in) */}
      {user && (
        <div className={`header-center ${searchFocused ? 'expanded' : ''}`}>
          <div className="search-bar-wrapper">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              className="search-input"
              placeholder="Search creations, prompts, styles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setTimeout(() => setSearchFocused(false), 200)} // Delay to allow clicking items
            />
          </div>

          {searchFocused && (
            <div className="search-dropdown-panel">
              <div className="search-section">
                <h4>Recent Searches</h4>
                <div className="search-tags">
                  {recentSearches.map(term => (
                    <span key={term} className="search-tag" onClick={() => setSearchQuery(term)}>{term}</span>
                  ))}
                </div>
              </div>
              <div className="search-section">
                <h4>Quick Filters</h4>
                <div className="filter-chips">
                  <span className="filter-chip">🔥 Trending</span>
                  <span className="filter-chip">❤️ Favorites</span>
                  <span className="filter-chip">🎨 Styles</span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Right: Actions */}
      <nav className="header-right nav-links">
        {user ? (
          <>
            <Link to="/gallery" className="nav-link">Gallery</Link>

            {/* Credit Meter */}
            <div className="credit-meter-container">
              <div className="credit-pill" onClick={() => setShowCreditDropdown(!showCreditDropdown)}>
                <div className="credit-info">
                  <span className="credit-icon">⚡</span>
                  <span className="credit-text">{userCredits.total - userCredits.used} Left</span>
                </div>
                <div className="credit-progress-bg">
                  <div className="credit-progress-fill" style={{ width: `${creditPercentage}%` }}></div>
                </div>
              </div>

              {showCreditDropdown && (
                <>
                  <div className="dropdown-backdrop" onClick={() => setShowCreditDropdown(false)}></div>
                  <div className="credit-dropdown-menu">
                    <div className="credit-details-header">
                      <h3>Monthly Credits</h3>
                      <span className="reset-date">Resets {userCredits.resetDate}</span>
                    </div>
                    <div className="credit-stats-grid">
                      <div className="stat-box">
                        <span className="stat-label">Total</span>
                        <span className="stat-val">{userCredits.total}</span>
                      </div>
                      <div className="stat-box">
                        <span className="stat-label">Used</span>
                        <span className="stat-val used">{userCredits.used}</span>
                      </div>
                    </div>
                    <div className="main-progress-bar">
                      <div className="bar-fill" style={{ width: `${creditPercentage}%` }}></div>
                    </div>
                    <button className="upgrade-plan-btn" onClick={() => navigate('/subscription')}>
                      Upgrade Plan
                    </button>
                  </div>
                </>
              )}
            </div>

            <ProfileDropdown user={user} onLogout={handleLogout} />
          </>
        ) : (
          <>
            <Link to="/login" className="nav-link">Login</Link>
            <Link to="/gallery" className="nav-link">Gallery</Link>
          </>
        )}
      </nav>
    </header>
  );
};

export default Header;
