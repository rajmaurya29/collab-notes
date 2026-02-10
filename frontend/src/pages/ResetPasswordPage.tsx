import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import Logo from '../components/Logo';
import ThemeToggle from '../components/ThemeToggle';
import FormInput from '../components/FormInput';
import Loader from '../components/Loader';
import axios from 'axios';

const ResetPasswordPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const uid = searchParams.get('uid');
  const token = searchParams.get('token');

  useEffect(() => {
    // Validate that uid and token are present
    if (!uid || !token) {
      setError('Invalid reset link. Please request a new password reset.');
    }
  }, [uid, token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!password || !confirmPassword) {
      setError('Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }

    if (!uid || !token) {
      setError('Invalid reset link');
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/users/reset-password/`,
        {
          uid,
          token,
          password,
        }
      );

      if (response.status === 200) {
        setSuccess(true);
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      }
    } catch (err: any) {
      console.error('Password reset failed', err);
      const errorMessage = err.response?.data?.message || 'Password reset failed. Please try again or request a new reset link.';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="login-page">
        <div className="login-container">
          <div className="login-header">
            <Logo />
            <ThemeToggle />
          </div>

          <div className="login-card">
            <h1 className="login-title">Password Reset Successful!</h1>
            <p className="login-subtitle">
              Your password has been reset successfully. Redirecting to login...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="login-page">
      {isLoading && <Loader fullScreen message="Resetting password..." />}
      <div className="login-container">
        <div className="login-header">
          <Logo />
          <ThemeToggle />
        </div>

        <div className="login-card">
          <h1 className="login-title">Reset Password</h1>
          <p className="login-subtitle">
            Enter your new password below
          </p>

          {error && (
            <div style={{ 
              padding: '12px', 
              marginBottom: '16px', 
              backgroundColor: '#fee', 
              color: '#c33', 
              borderRadius: '4px',
              fontSize: '14px'
            }}>
              {error}
            </div>
          )}

          <form className="login-form" onSubmit={handleSubmit}>
            <FormInput
              label="New Password"
              type="password"
              placeholder="Enter your new password"
              value={password}
              onChange={setPassword}
              required
            />

            <FormInput
              label="Confirm Password"
              type="password"
              placeholder="Confirm your new password"
              value={confirmPassword}
              onChange={setConfirmPassword}
              required
            />

            <button type="submit" className="login-button" disabled={!uid || !token}>
              Reset Password
            </button>
          </form>

          <div className="login-footer">
            Remember your password?{' '}
            <Link to="/login">Sign in</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
