import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Auth.css';

// Decode Google JWT Token natives
const parseJwt = (token) => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      window
        .atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Failed to parse JWT token:', error);
    return null;
  }
};

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    const name = formData.name || formData.email.split('@')[0];
    const email = formData.email;
    
    // Sync user details to backend API database
    try {
      await fetch('http://localhost:5000/api/users/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email })
      });
    } catch (err) {
      console.error('Failed to sync user details to API:', err);
    }

    localStorage.setItem('userAuth', JSON.stringify({
      email,
      name,
      picture: null
    }));
    navigate('/dashboard');
  };

  const handleGoogleLoginResponse = async (response) => {
    const responsePayload = parseJwt(response.credential);
    if (responsePayload) {
      const name = responsePayload.name;
      const email = responsePayload.email;

      // Sync user details to backend API database
      try {
        await fetch('http://localhost:5000/api/users/sync', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, email })
        });
      } catch (err) {
        console.error('Failed to sync Google user details to API:', err);
      }

      // Store user details in session (mock auth storage)
      localStorage.setItem('userAuth', JSON.stringify({
        email: email,
        name: name,
        picture: responsePayload.picture
      }));

      // Redirect to user dashboard
      navigate('/dashboard');
    }
  };

  useEffect(() => {
    /* global google */
    const initializeGoogleSignIn = () => {
      if (window.google) {
        window.google.accounts.id.initialize({
          client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
          callback: handleGoogleLoginResponse
        });
        
        window.google.accounts.id.renderButton(
          document.getElementById("google-signin-btn"),
          { 
            theme: "outline", 
            size: "large", 
            width: "100%",
            text: "continue_with",
            shape: "rectangular"
          }
        );
      }
    };

    // Initialize once script is loaded
    if (window.google) {
      initializeGoogleSignIn();
    } else {
      const interval = setInterval(() => {
        if (window.google) {
          initializeGoogleSignIn();
          clearInterval(interval);
        }
      }, 300);
      return () => clearInterval(interval);
    }
  }, [isLogin]);

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

        <div className="divider">
          <span>or</span>
        </div>

        <div id="google-signin-btn" className="google-btn-container"></div>

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
