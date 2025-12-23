import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAppDispatch } from '../store/hooks';
// import { login } from '../store/slices/authSlice';
import Logo from '../components/Logo';
import ThemeToggle from '../components/ThemeToggle';
import FormInput from '../components/FormInput';
import Loader from '../components/Loader';
import { loginUser } from '../store/slices/authSlice';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation
    if (!email || !password) {
      return;
    }

    try {
      setIsLoading(true);
      // Dispatch login action to Redux
      await dispatch(loginUser({ email, password })).unwrap();

      // Navigate to dashboard after successful login
      navigate('/dashboard');
    } catch (err) {
      console.error("Login failed", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = (e: React.MouseEvent) => {
    e.preventDefault();
    alert('Password reset functionality coming soon!');
  };

  return (
    <div className="login-page">
      {isLoading && <Loader fullScreen message="Signing in..." />}
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
