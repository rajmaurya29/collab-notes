import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAppDispatch } from '../store/hooks';
// import { login } from '../store/slices/authSlice';
import Logo from '../components/Logo';
import ThemeToggle from '../components/ThemeToggle';
import FormInput from '../components/FormInput';
import Loader from '../components/Loader';
import { loginUser } from '../store/slices/authSlice';
import axios from 'axios';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [loaderMessage, setLoaderMessage] = useState('Signing in...');
  const [resetMessage, setResetMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation
    if (!email || !password) {
      return;
    }

    setLoaderMessage('Signing in...');
    setIsLoading(true);
    try {
      // Dispatch login action to Redux
      await dispatch(loginUser({ email, password })).unwrap();

      // Navigate to dashboard only after successful login
      navigate('/dashboard');
    } catch (err) {
      console.error("Login failed", err);
      // Optionally show error message to user
      alert('Login failed. Please check your credentials and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.MouseEvent) => {
    e.preventDefault();
    
    if (!email) {
      alert('Please enter your email address first');
      return;
    }

    setLoaderMessage('Sending reset link...');
    setIsLoading(true);
    setResetMessage('');
    
    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/users/forgot-password/`,
        { email }
      );
      
      setResetMessage('Reset link sent to your email. Please check your inbox.');
    } catch (err) {
      console.error('Forgot password request failed', err);
      setResetMessage('Reset link sent to your email. Please check your inbox.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-page">
      {isLoading && <Loader fullScreen message={loaderMessage} />}
      <div className="login-container">
        <div className="login-header">
          <Logo />
          <ThemeToggle />
        </div>

        <div className="login-card">
          <h1 className="login-title">Welcome Back</h1>
          <p className="login-subtitle">
            Sign in to continue to your notes
          </p>

          {resetMessage && (
            <div style={{ 
              padding: '12px', 
              marginBottom: '16px', 
              backgroundColor: '#d4edda', 
              color: '#155724', 
              borderRadius: '4px',
              fontSize: '14px'
            }}>
              {resetMessage}
            </div>
          )}

          <form className="login-form" onSubmit={handleSubmit}>
            <FormInput
              label="Email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={setEmail}
              required
            />

            <FormInput
              label="Password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={setPassword}
              required
            />

            <div className="login-forgot">
              <a href="#" onClick={handleForgotPassword}>
                Forgot password?
              </a>
            </div>

            <button type="submit" className="login-button">
              Sign In
            </button>
          </form>

          <div className="login-footer">
            Don't have an account?{' '}
            <Link to="/signup">Sign up</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
