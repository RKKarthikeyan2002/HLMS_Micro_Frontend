import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../Providers/AuthContext';
import { FaHome, FaCalculator, FaCog } from 'react-icons/fa';
import { motion } from 'framer-motion';

function AdminNavbar() {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isCalculatorOpen, setIsCalculatorOpen] = useState(false);
  const { isAuthenticated, user, logout } = useAuth();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const toggleProfile = () => setIsProfileOpen(!isProfileOpen);
  const toggleCalculator = () => setIsCalculatorOpen(!isCalculatorOpen);

  const userInitial = (user && typeof user === 'string') ? user[0].toUpperCase() : 'A';

  const handleLogout = () => {
    sessionStorage.removeItem("adminToken");
    logout();
    navigate("/");
  };

  return (
    <nav className="bg-gray-900 text-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto flex items-center justify-between p-4">
        <Link to="/" className="text-2xl font-bold flex items-center space-x-2 hover:text-gray-300 transition-colors no-underline text-white">
          <span>R K Finance</span>
        </Link>

        <div className="hidden md:flex items-center space-x-6">
          <Link to="/" className="flex items-center space-x-2 hover:text-gray-300 transition-colors no-underline text-white">
            <FaHome className="text-lg" />
            <span>Home</span>
          </Link>
          <div className="relative group">
            <button className="flex items-center space-x-2 hover:text-gray-300 transition-colors" onClick={toggleCalculator}>
              <FaCalculator className="text-lg" />
              <span>Calculator</span>
            </button>
            {isCalculatorOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="absolute top-full left-0 mt-2 w-48 bg-gray-800 text-white rounded-md shadow-lg"
              >
                <Link to="/emiCalculator" className="block px-4 py-2 hover:bg-gray-700 transition-colors no-underline">EMI Calculator</Link>
                <Link to="/eligibilityCalculator" className="block px-4 py-2 hover:bg-gray-700 transition-colors no-underline">Eligibility Loan Calculator</Link>
              </motion.div>
            )}
          </div>
          <Link to="/feedbacks" className="flex items-center space-x-2 hover:text-gray-300 transition-colors no-underline text-white">
            <span>Feedback</span>
          </Link>
          {isAuthenticated ? (
            <div className="relative group">
              <button className="flex items-center space-x-2 hover:text-gray-300 transition-colors" onClick={toggleProfile}>
                <div className="w-10 h-10 bg-gray-700 text-white flex items-center justify-center rounded-full no-underline text-white">
                  {userInitial}
                </div>
              </button>
              {isProfileOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="absolute right-0 mt-2 w-48 bg-gray-800 text-white rounded-md shadow-lg"
                >
                  <Link to="/profile" className="block w-full px-4 py-2 text-white hover:bg-gray-700 transition-colors no-underline">My Profile</Link>
                  <button onClick={handleLogout} className="block w-full px-4 py-2 text-left hover:bg-gray-700 transition-colors">Logout</button>
                </motion.div>
              )}
            </div>
          ) : (
            <Link to="/login" className="no-underline bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-md transition-colors">Login</Link>
          )}
        </div>

        <button className="md:hidden text-white focus:outline-none" onClick={toggleMenu} aria-label="Open menu">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path>
          </svg>
        </button>
      </div>

      {isMenuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="md:hidden bg-gray-800 p-4 space-y-4"
        >
          <Link to="/" className="flex items-center space-x-2 text-white hover:text-gray-300 transition-colors">
            <FaHome className="text-lg" />
            <span>Home</span>
          </Link>
          <Link to="/about" className="flex items-center space-x-2 text-white hover:text-gray-300 transition-colors">
            <FaCog className="text-lg" />
            <span>About</span>
          </Link>
          <Link to="/request" className="flex items-center space-x-2 text-white hover:text-gray-300 transition-colors">
            <span>Request</span>
          </Link>
          {isAuthenticated ? (
            <div className="relative group">
              <button className="flex items-center space-x-2 text-white hover:text-gray-300 transition-colors" onClick={toggleProfile}>
                <div className="w-10 h-10 bg-gray-700 text-white flex items-center justify-center rounded-full">
                  {userInitial}
                </div>
                <span>Profile</span>
              </button>
              {isProfileOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="absolute left-0 mt-2 w-full bg-gray-800 text-white rounded-md shadow-lg"
                >
                  <Link 
                    to="/profile" 
                    className="block px-4 py-2 text-white hover:bg-gray-700 transition-colors"
                  >
                    My Profile
                  </Link>
                  <button 
                    onClick={handleLogout} 
                    className="block w-full px-4 py-2 text-left hover:bg-gray-700 transition-colors"
                  >
                    Logout
                  </button>
                </motion.div>
              )}
            </div>
          ) : (
            <Link to="/login" className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-md transition-colors">Login</Link>
          )}
        </motion.div>
      )}
    </nav>
  );
}

export default AdminNavbar;
