import React, { useState } from 'react';
import axios from 'axios';
import { FiX } from 'react-icons/fi';

const SolutionForm = ({ problemId, onSolutionCreated, onCancel }) => {
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/api/problems/${problemId}/solutions`,
        { description },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      onSolutionCreated(response.data);
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to post solution');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 mb-4">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="description" className="form-label">Your Solution</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            rows="3"
            className="form-textarea"
            placeholder="Describe your solution to this problem..."
          />
        </div>

        {error && <div className="error-message">{error}</div>}

        <div className="flex gap-3 justify-end">
          <button 
            type="button" 
            onClick={onCancel} 
            className="btn-secondary btn-small"
          >
            Cancel
          </button>
          <button 
            type="submit" 
            disabled={loading} 
            className="btn-primary btn-small disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
          >
            {loading ? 'Posting...' : 'Post Solution'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default SolutionForm;
