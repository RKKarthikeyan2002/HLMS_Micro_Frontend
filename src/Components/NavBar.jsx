import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../Providers/AuthContext';
import '../Styles/NavBar.css';
import {jwtDecode} from 'jwt-decode';

function NavBar() {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const { isAuthenticated, user, logout, login } = useAuth(); // Destructure auth values
  const [isCalculatorOpen, setIsCalculatorOpen] = useState(false);
  const [userInitial, setUserInitial] = useState('C');

  useEffect(() => {
    const token = sessionStorage.getItem("token");
    if (token) {
        login()
        const decodedToken = jwtDecode(token);
        const { sub } = decodedToken;
        if (sub && typeof sub === 'string') {
          setUserInitial(sub[0].toUpperCase());
        }
        return;
    }
  }, [navigate]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleProfile = () => {
    setIsProfileOpen(!isProfileOpen);
  };

  const toggleCalculator = () => {
    setIsCalculatorOpen(!isCalculatorOpen); 
  };

  const handleLogout = () => {
    sessionStorage.removeItem('token');
    logout();
    navigate("/");
  };

  return (
    <nav className="bg-gray-800 p-4 sticky top-0 z-50">
      <div className="container mx-auto flex items-center justify-between">
        <Link to="/" className="text-white text-2xl font-bold hover:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 no-underline" aria-label="Home">
          R K Finance
        </Link>
        <div className="hidden md:flex items-center space-x-6">
          <Link to="/" className="text-white hover:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 no-underline" aria-label="Home">Home</Link>
          <div className="relative group">
            <button className="text-white focus:outline-none" onClick={toggleCalculator} aria-label="Calculator">
              <span className="hover:text-gray-400">Calculator</span>
            </button>
            {isCalculatorOpen && (
              <div
                className="absolute top-full left-0 mt-2 w-48 bg-gray-800 text-white rounded-md shadow-lg"
                style={{ zIndex: 50 }}
              >
                <Link to="/emiCalculator" className="block px-4 py-2 hover:bg-gray-700 text-white hover:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 no-underline" aria-label="EMI Calculator">
                  EMI Calculator
                </Link>
                <Link to="/eligibilityCalculator" className="block px-4 py-2 hover:bg-gray-700 text-white hover:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 no-underline" aria-label="Eligibility Loan Calculator">
                  Eligibility Loan Calculator
                </Link>
              </div>
            )}
          </div>
          {isAuthenticated && (
            <Link to="/myApplication" className="text-white hover:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 no-underline" aria-label="My Application">My Application</Link>
          )}
          <Link to="/feedbackForm" className="text-white hover:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 no-underline" aria-label="Contact">Feedback Form</Link>
          
          {isAuthenticated ? (
            <div className="relative" style={{ zIndex: 50 }}>
              <button className="text-white focus:outline-none" onClick={toggleProfile} aria-label="Profile">
                <div className="w-10 h-10 bg-gray-600 text-white flex items-center justify-center rounded-full">
                  {userInitial}
                </div>
              </button>
              {isProfileOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-gray-800 text-white rounded-md shadow-lg">
                  <Link to="/profile" className="block w-full px-4 py-2 text-white hover:bg-gray-700 no-underline" aria-label="My Profile">My Profile</Link>
                  <button onClick={handleLogout} className="block w-full px-4 py-2 text-left hover:bg-gray-700" aria-label="Logout">Logout</button>
                </div>
              )}
            </div>
          ) : (
            <Link to="/login" className="no-underline text-white px-4 py-2 rounded-md bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 " aria-label="Login">
              Login
            </Link>
          )}
        </div>
        <button className="md:hidden text-white focus:outline-none focus:ring-2 focus:ring-gray-500" aria-label="Open menu" onClick={toggleMenu}>
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path>
          </svg>
        </button>
      </div>
      {isMenuOpen && (
        <div className="md:hidden bg-gray-800 p-4 space-y-4">
          <Link to="/" className="text-white block hover:text-gray-400" aria-label="Home">Home</Link>
          <Link to="/about" className="text-white block hover:text-gray-400" aria-label="About">About</Link>
          {isAuthenticated && (
            <Link to="/my-application" className="text-white block hover:text-gray-400" aria-label="My Application">My Application</Link>
          )}
          <Link to="/contact" className="text-white block hover:text-gray-400" aria-label="Contact">Contact</Link>
          {isAuthenticated ? (
            <div className="relative">
              <button className="text-white w-full text-left px-4 py-2" onClick={toggleProfile} aria-label="Profile">
                <div className="w-10 h-10 bg-gray-600 text-white flex items-center justify-center rounded-full">
                  {userInitial}
                </div>
              </button>
              {isProfileOpen && (
                <div className="absolute left-0 mt-2 w-full bg-gray-800 text-white rounded-md shadow-lg">
                  <Link to="/profile" className="block px-4 py-2 hover:bg-gray-700" aria-label="My Profile">My Profile</Link>
                  <button onClick={handleLogout} className="block w-full px-4 py-2 text-left hover:bg-gray-700" aria-label="Logout">Logout</button>
                </div>
              )}
            </div>
          ) : (
            <Link to="/login" className="text-white block px-4 py-2 rounded-md bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400" aria-label="Login">
              Login
            </Link>
          )}
        </div>
      )}
    </nav>
  );
}

export default NavBar;
