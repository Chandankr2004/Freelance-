import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FaSearch } from 'react-icons/fa';
import Logo from '../Logo';
import ThemeToggle from '../ThemeToggle';
import './Navbar.css';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    setMenuOpen(false);
  };

  const getDashboardLink = () => {
    if (!user) return null;
    if (user.role === 'admin') return '/admin-dashboard';
    if (user.role === 'freelancer') return '/freelancer-dashboard';
    return '/dashboard';
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/jobs?search=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
    }
  };

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <div className="container">
        <div className="navbar-content">
          <div className="navbar-left">
            <Logo />
          </div>

          <div className="navbar-search">
            <form onSubmit={handleSearch} className="search-form">
              <input
                type="text"
                placeholder="Search by role, skills, or keywords"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input-header"
              />
              <button type="submit" className="search-btn-header">
                <FaSearch />
              </button>
            </form>
          </div>

          <div className={`navbar-menu ${menuOpen ? 'active' : ''}`}>
            {!user ? (
              <>
                <Link to="/jobs" onClick={() => setMenuOpen(false)}>Hire Freelancers</Link>
                <Link to="/freelancers" onClick={() => setMenuOpen(false)}>Find Work</Link>
                <Link to="/jobs" onClick={() => setMenuOpen(false)}>Categories</Link>
                <Link to="/pricing" onClick={() => setMenuOpen(false)}>Pricing</Link>
                <Link to="/about" onClick={() => setMenuOpen(false)}>About</Link>
              </>
            ) : (
              <>
                <Link to="/jobs" onClick={() => setMenuOpen(false)}>Jobs</Link>
                <Link to="/freelancers" onClick={() => setMenuOpen(false)}>Freelancers</Link>
                {user.role === 'buyer' && (
                  <Link to="/post-job" onClick={() => setMenuOpen(false)}>Post Job</Link>
                )}
                {user.role === 'freelancer' && (
                  <Link to="/my-bids" onClick={() => setMenuOpen(false)}>My Bids</Link>
                )}
                <Link to="/contracts" onClick={() => setMenuOpen(false)}>Contracts</Link>
                <Link to={getDashboardLink()} onClick={() => setMenuOpen(false)}>Dashboard</Link>
              </>
            )}
            
            <ThemeToggle />
            
            {user ? (
              <>
                <Link to="/profile" onClick={() => setMenuOpen(false)}>Profile</Link>
                <button onClick={handleLogout} className="btn btn-outline">Logout</button>
              </>
            ) : (
              <>
                <Link to="/login" onClick={() => setMenuOpen(false)} className="btn-text">Log in</Link>
                <Link to="/register" onClick={() => setMenuOpen(false)} className="btn btn-primary">Sign up</Link>
              </>
            )}
          </div>

          <button
            className={`navbar-toggle ${menuOpen ? 'active' : ''}`}
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
