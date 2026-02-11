import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import Logo from '../components/Logo';
import ThemeToggle from '../components/ThemeToggle';
import Loader from '../components/Loader';
import axios from 'axios';

const VerifyEmailPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const uid = searchParams.get('uid');
  const token = searchParams.get('token');

  useEffect(() => {
    const verifyEmail = async () => {
      if (!uid || !token) {
        setError('Invalid verification link. Please check your email or request a new verification link.');
        setIsLoading(false);
        return;
      }

      try {
        const response = await axios.post(
          `${import.meta.env.VITE_API_URL}/users/verify-email/`,
          {
            uid,
            token,
          }
        );

        if (response.status === 200) {
          setSuccess(true);
          setTimeout(() => {
            navigate('/login');
          }, 3000);
        }
      } catch (err: any) {
        console.error('Email verification failed', err);
        const errorMessage = err.response?.data?.message || 'Email verification failed. The link may be expired or invalid.';
        setError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    };

    verifyEmail();
  }, [uid, token, navigate]);

  if (isLoading) {
    return (
      <div className="login-page">
        <Loader fullScreen message="Verifying your email..." />
      </div>
    );
  }

  if (success) {
    return (
      <div className="login-page">
        <div className="login-container">
          <div className="login-header">
            <Logo />
            <ThemeToggle />
          </div>

          <div className="login-card">
            <h1 className="login-title">Email Verified!</h1>
            <p className="login-subtitle">
              Your email has been successfully verified.
            </p>
            <div style={{ 
              padding: '16px', 
              marginTop: '20px',
              marginBottom: '20px',
              backgroundColor: '#d4edda', 
              color: '#155724', 
              borderRadius: '4px',
              fontSize: '14px'
            }}>
              Redirecting to login page...
            </div>
            <div className="login-footer">
              <Link to="/login">Go to Sign In</Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-header">
          <Logo />
          <ThemeToggle />
        </div>

        <div className="login-card">
          <h1 className="login-title">Verification Failed</h1>
          <p className="login-subtitle">
            We couldn't verify your email address
          </p>

          <div style={{ 
            padding: '16px', 
            marginTop: '20px',
            marginBottom: '20px',
            backgroundColor: '#fee', 
            color: '#c33', 
            borderRadius: '4px',
            fontSize: '14px',
            lineHeight: '1.6'
          }}>
            {error}
          </div>

          <div className="login-footer">
            <Link to="/signup">Create a new account</Link>
            {' or '}
            <Link to="/login">Sign In</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmailPage;
