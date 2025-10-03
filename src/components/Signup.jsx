import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const Signup = ({ onLogin }) => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
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

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    try {
      const { confirmPassword, ...signupData } = formData;
      const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/api/auth/register`, signupData);
      const { token, user } = response.data;
      
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      onLogin(user);
      navigate('/dashboard');
    } catch (error) {
      setError(error.response?.data?.message || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center p-4 bg-gradient-to-br from-primary-500 to-secondary-500">
      <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-md">
        <h2 className="text-center text-2xl font-bold text-gray-800 mb-6">Join CrowdSolve</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="username" className="form-label">Username</label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
              className="form-input"
              placeholder="Choose a username"
            />
          </div>

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
              placeholder="Create a password"
            />
          </div>

          <div>
            <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              className="form-input"
              placeholder="Confirm your password"
            />
          </div>

          {error && <div className="error-message">{error}</div>}

          <button 
            type="submit" 
            disabled={loading} 
            className="w-full btn-primary disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
          >
            {loading ? 'Creating account...' : 'Sign Up'}
          </button>
        </form>

        <p className="text-center mt-6 text-gray-600">
          Already have an account? 
          <Link to="/login" className="text-primary-500 font-medium hover:underline ml-1">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
