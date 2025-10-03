import React, { useState } from 'react';
import axios from 'axios';
import { FiX, FiUpload, FiTrash2 } from 'react-icons/fi';

const EditProblemModal = ({ problem, onClose, onProblemUpdated, onProblemDeleted }) => {
  const [formData, setFormData] = useState({
    title: problem.title,
    description: problem.description,
    location: problem.location
  });
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

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

      const response = await axios.put(`${import.meta.env.VITE_BASE_URL}/api/problems/${problem._id}`, formDataToSend, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });

      onProblemUpdated(response.data);
      onClose();
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to update problem');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${import.meta.env.VITE_BASE_URL}/api/problems/${problem._id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      onProblemDeleted(problem._id);
      onClose();
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to delete problem');
    } finally {
      setLoading(false);
      setShowDeleteConfirm(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {/* Header - Fixed */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200 flex-shrink-0">
          <h3 className="text-xl font-semibold text-gray-900">Edit Problem</h3>
          <button 
            onClick={onClose} 
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
              {problem.image && !image && (
                <div className="mb-3">
                  <p className="text-sm text-gray-600 mb-2">Current image:</p>
                  <img 
                    src={problem.image} 
                    alt="Current problem" 
                    className="w-full h-32 object-cover rounded-lg"
                  />
                </div>
              )}
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
                    {image ? image.name : 'Choose new image (optional)'}
                  </span>
                </label>
              </div>
            </div>

            {error && <div className="error-message">{error}</div>}

            {/* Form Actions - Fixed at bottom */}
            <div className="sticky bottom-0 bg-white border-t border-gray-200 -mx-6 px-6 py-4 mt-6">
              <div className="flex gap-3 justify-between">
                <button 
                  type="button" 
                  onClick={() => setShowDeleteConfirm(true)}
                  className="flex items-center gap-2 px-4 py-2 text-red-600 border border-red-300 rounded-lg hover:bg-red-50 transition-colors duration-200"
                  disabled={loading}
                >
                  <FiTrash2 className="w-4 h-4" />
                  Delete
                </button>
                <div className="flex gap-3">
                  <button 
                    type="button" 
                    onClick={onClose} 
                    className="btn-secondary"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    disabled={loading} 
                    className="btn-primary disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
                  >
                    {loading ? 'Updating...' : 'Update Problem'}
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>

        {/* Delete Confirmation Modal */}
        {showDeleteConfirm && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-10">
            <div className="bg-white rounded-xl p-6 max-w-md mx-4">
              <h4 className="text-lg font-semibold text-gray-900 mb-2">Delete Problem</h4>
              <p className="text-gray-600 mb-6">
                Are you sure you want to delete this problem? This action cannot be undone.
              </p>
              <div className="flex gap-3 justify-end">
                <button 
                  onClick={() => setShowDeleteConfirm(false)}
                  className="btn-secondary"
                  disabled={loading}
                >
                  Cancel
                </button>
                <button 
                  onClick={handleDelete}
                  className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200"
                  disabled={loading}
                >
                  {loading ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EditProblemModal;
