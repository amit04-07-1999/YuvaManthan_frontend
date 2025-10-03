import React, { useState } from 'react';
import axios from 'axios';

const CommentForm = ({ solutionId, onCommentCreated, onCancel }) => {
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/api/solutions/${solutionId}/comments`,
        { text },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      onCommentCreated(response.data);
      setText('');
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to post comment');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 mb-4">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            required
            rows="2"
            className="form-textarea"
            placeholder="Add a comment..."
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
            {loading ? 'Posting...' : 'Post Comment'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CommentForm;
