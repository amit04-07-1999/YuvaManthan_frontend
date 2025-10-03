import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const Login = ({ onLogin }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/api/auth/login`, formData);
      const { token, user } = response.data;
      
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      onLogin(user);
      navigate('/dashboard');
    } catch (error) {
      setError(error.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center p-4 bg-gradient-to-br from-primary-500 to-secondary-500">
      <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-md">
        <h2 className="text-center text-2xl font-bold text-gray-800 mb-6">Login to CrowdSolve</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="form-label">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="form-input"
              placeholder="Enter your email"
            />
          </div>
          
          <div>
            <label htmlFor="password" className="form-label">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="form-input"
              placeholder="Enter your password"
            />
          </div>

          {error && <div className="error-message">{error}</div>}

          <button 
            type="submit" 
            disabled={loading} 
            className="w-full btn-primary disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <p className="text-center mt-6 text-gray-600">
          Don't have an account? 
          <Link to="/signup" className="text-primary-500 font-medium hover:underline ml-1">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
