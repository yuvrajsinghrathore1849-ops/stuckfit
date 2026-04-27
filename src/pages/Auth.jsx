import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Auth.css';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: ''
  });

  const handleChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value});
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Mock authentication
    navigate('/dashboard');
  };

  return (
    <div className="auth-page container">
      <div className="auth-container">
        <h1 className="auth-title">{isLogin ? 'Welcome Back' : 'Create Account'}</h1>
        <p className="auth-subtitle">
          {isLogin 
            ? 'Sign in to access your saved items and order history.' 
            : 'Join Stuckfit to save your favorite items and speed up checkout.'}
        </p>

        <form className="auth-form" onSubmit={handleSubmit}>
          {!isLogin && (
            <div className="form-group fade-in">
              <label>Full Name</label>
              <input 
                type="text" 
                name="name" 
                placeholder="John Doe"
                required={!isLogin}
                value={formData.name}
                onChange={handleChange}
              />
            </div>
          )}
          
          <div className="form-group">
            <label>Email Address</label>
            <input 
              type="email" 
              name="email" 
              placeholder="you@example.com"
              required 
              value={formData.email}
              onChange={handleChange}
            />
          </div>
          
          <div className="form-group">
            <div className="password-header">
              <label>Password</label>
              {isLogin && <button type="button" className="forgot-password">Forgot Password?</button>}
            </div>
            <input 
              type="password" 
              name="password" 
              placeholder="••••••••"
              required 
              value={formData.password}
              onChange={handleChange}
            />
          </div>

          <button type="submit" className="btn btn-primary auth-btn">
            {isLogin ? 'Sign In' : 'Create Account'}
          </button>
        </form>

        <div className="auth-toggle">
          <p>
            {isLogin ? "Don't have an account?" : "Already have an account?"}
            <button onClick={() => setIsLogin(!isLogin)}>
              {isLogin ? 'Sign Up' : 'Sign In'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Auth;
