import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logout } from '../store/slices/authSlice';
import Logo from '../components/Logo';
import ThemeToggle from '../components/ThemeToggle';

function LogoutPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Dispatch logout action on page load to clear auth state
  useEffect(() => {
    dispatch(logout());
  }, [dispatch]);

  const handleSignInAgain = () => {
    navigate('/login');
  };

  return (
    <div className="logout-page">
      <div className="logout-container">
        <div className="logout-header">
          <Logo />
          <ThemeToggle />
        </div>
        <div className="logout-card">
          <div className="logout-icon-container">
            <svg
              className="logout-icon"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              />
            </svg>
          </div>
          <h1 className="logout-title">You've been logged out</h1>
          <p className="logout-message">
            Thank you for using Collab-Notes. Your session has been securely ended.
          </p>
          <button className="logout-button" onClick={handleSignInAgain}>
            Sign In Again
          </button>
        </div>
      </div>
    </div>
  );
}

export default LogoutPage;
