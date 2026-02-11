import React, { useState } from 'react';
import {  Link } from 'react-router-dom';
import Logo from '../components/Logo';
import ThemeToggle from '../components/ThemeToggle';
import FormInput from '../components/FormInput';
import Loader from '../components/Loader';
import axios  from 'axios';
const API_URL = import.meta.env.VITE_API_URL as string;

const SignupPage: React.FC = () => {
 

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [verificationSent, setVerificationSent] = useState(false);

  const handleSubmit = async(e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation
    if (!username || !email || !password || !confirmPassword) {
      return;
    }

    if (password !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    setIsLoading(true);
    try {
      // Register the user
      await axios.post(`${API_URL}/users/register/`,{"name":username,"email":email,"password":password},{withCredentials:true});
      
      // Show verification message instead of auto-login
      setVerificationSent(true);
    } catch (error: any) {  
      console.error("Signup failed", error);
      // Show error message to user
      const errorMessage = error.response?.data?.message || 'Signup failed. Please try again.';
      alert(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="signup-page">
      {isLoading && <Loader fullScreen message="Creating your account..." />}
      <div className="signup-container">
        <div className="signup-header">
          <Logo />
          <ThemeToggle />
        </div>

        {verificationSent ? (
          <div className="signup-card">
            <h1 className="signup-title">Verify Your Email</h1>
            <p className="signup-subtitle">
              We've sent a verification link to <strong>{email}</strong>
            </p>
            <div style={{ 
              padding: '16px', 
              marginTop: '20px',
              marginBottom: '20px',
              backgroundColor: '#d4edda', 
              color: '#155724', 
              borderRadius: '4px',
              fontSize: '14px',
              lineHeight: '1.6'
            }}>
              Please check your email and click the verification link to activate your account.
            </div>
            <div className="signup-footer">
              <Link to="/login">Go to Sign In</Link>
            </div>
          </div>
        ) : (
          <div className="signup-card">
            <h1 className="signup-title">Create Account</h1>
            <p className="signup-subtitle">
              Join Collab-Notes to start organizing your thoughts
            </p>

            <form className="signup-form" onSubmit={handleSubmit}>
              <FormInput
                label="Username"
                type="text"
                placeholder="Enter your username"
                value={username}
                onChange={setUsername}
                required
              />

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
                placeholder="Create a password"
                value={password}
                onChange={setPassword}
                required
              />

              <FormInput
                label="Confirm Password"
                type="password"
                placeholder="Confirm your password"
                value={confirmPassword}
                onChange={setConfirmPassword}
                required
              />

              <button type="submit" className="signup-button">
                Sign Up
              </button>
            </form>

            <div className="signup-footer">
              Already have an account?{' '}
              <Link to="/login">Sign In</Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SignupPage;
