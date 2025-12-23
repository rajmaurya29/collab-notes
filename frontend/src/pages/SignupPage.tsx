import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAppDispatch } from '../store/hooks';
import Logo from '../components/Logo';
import ThemeToggle from '../components/ThemeToggle';
import FormInput from '../components/FormInput';
import Loader from '../components/Loader';
import axios  from 'axios';
import { loginUser } from '../store/slices/authSlice';
const API_URL = import.meta.env.VITE_API_URL as string;

const SignupPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

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

    // Dispatch signup action to Redux
    // dispatch(signup({ username, email, password }));
    try {
      setIsLoading(true);
      // Demo-only: simulate async signup
      new Promise((r) => setTimeout(r, 800));
      try{  
              // console.log("Signup:", { "name":username, email, password });

                await axios.post(`${API_URL}/users/register/`,{"name":username,"email":email,"password":password},{withCredentials:true})
                // console.log(response.data);
                await dispatch(loginUser({"email":email,"password":password})).unwrap();
                
            }
            catch(error:any){
                console.log(error.value)
            }
      // console.log("Signup:", { "name":username, email, password });
      // Navigate to dashboard after successful signup
      navigate('/dashboard');
    } catch (err: any) {  
      console.error("Signup failed", err);
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
      </div>
    </div>
  );
};

export default SignupPage;
