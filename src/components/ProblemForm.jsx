import React, { useState } from 'react';
import axios from 'axios';
import { FiX, FiUpload } from 'react-icons/fi';

const ProblemForm = ({ onProblemCreated, onCancel }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: ''
  });
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleImageChange = (e) => {
    if (e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      const formDataToSend = new FormData();
      formDataToSend.append('title', formData.title);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('location', formData.location);
      if (image) {
        formDataToSend.append('image', image);
      }

      const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/api/problems`, formDataToSend, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });

      onProblemCreated(response.data);
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to create problem');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        {/* Header - Fixed */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200 flex-shrink-0">
          <h3 className="text-xl font-semibold text-gray-900">Post a New Problem</h3>
          <button 
            onClick={onCancel} 
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
          >
            <FiX className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form Content */}
        <div className="flex-1 overflow-y-auto">
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <div>
              <label htmlFor="title" className="form-label">Problem Title</label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                className="form-input"
                placeholder="Brief description of the problem"
              />
            </div>

            <div>
              <label htmlFor="description" className="form-label">Description</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                rows="4"
                className="form-textarea"
                placeholder="Detailed description of the problem..."
              />
            </div>

            <div>
              <label htmlFor="location" className="form-label">Location</label>
              <input
                type="text"
                id="location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                required
                className="form-input"
                placeholder="Where is this problem located?"
              />
            </div>

            <div>
              <label htmlFor="image" className="form-label">Image (Optional)</label>
              <div className="relative">
                <input
                  type="file"
                  id="image"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <label 
                  htmlFor="image" 
                  className="flex items-center gap-3 p-4 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-primary-500 transition-colors duration-200"
                >
                  <FiUpload className="w-5 h-5 text-gray-500" />
                  <span className="text-gray-600">
                    {image ? image.name : 'Choose an image'}
                  </span>
                </label>
              </div>
            </div>

            {error && <div className="error-message">{error}</div>}

            {/* Form Actions - Fixed at bottom */}
            <div className="sticky bottom-0 bg-white border-t border-gray-200 -mx-6 px-6 py-4 mt-6">
              <div className="flex gap-3 justify-end">
                <button 
                  type="button" 
                  onClick={onCancel} 
                  className="btn-secondary"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={loading} 
                  className="btn-primary disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {loading ? 'Posting...' : 'Post Problem'}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProblemForm;
