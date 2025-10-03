import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FiX, FiMapPin, FiUser, FiClock, FiThumbsUp, FiMessageCircle, FiPlus } from 'react-icons/fi';
import SolutionForm from './SolutionForm';
import SolutionCard from './SolutionCard';

const SolutionsModal = ({ problem, currentUser, onClose }) => {
  const [solutions, setSolutions] = useState([]);
  const [showSolutionForm, setShowSolutionForm] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSolutions();
  }, [problem._id]);

  const fetchSolutions = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/problems/${problem._id}/solutions`);
      setSolutions(response.data);
    } catch (error) {
      console.error('Error fetching solutions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSolutionCreated = (newSolution) => {
    setSolutions([newSolution, ...solutions]);
    setShowSolutionForm(false);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {/* Header - Fixed */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 rounded-t-2xl z-10">
          <div className="flex justify-between items-start mb-4">
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">{problem.title}</h2>
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <FiMapPin className="w-4 h-4" />
                  <span>{problem.location}</span>
                </div>
                <div className="flex items-center gap-1">
                  <FiUser className="w-4 h-4" />
                  <span>by {problem.postedBy?.username}</span>
                </div>
                <div className="flex items-center gap-1">
                  <FiClock className="w-4 h-4" />
                  <span>{formatDate(problem.createdAt)}</span>
                </div>
              </div>
            </div>
            <button 
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
            >
              <FiX className="w-6 h-6" />
            </button>
          </div>

          {/* Problem Description */}
          <div className="mb-4">
            <p className="text-gray-700 leading-relaxed">{problem.description}</p>
          </div>

          {/* Solutions Header */}
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-semibold text-gray-900">
              Solutions ({solutions.length})
            </h3>
            <button 
              className="btn-primary btn-small"
              onClick={() => setShowSolutionForm(true)}
            >
              <FiPlus className="w-4 h-4" /> Suggest Solution
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto">
          {/* Problem Image - Full Size */}
          {problem.image && (
            <div className="p-6 pb-0">
              <div className="bg-gray-50 rounded-xl p-4 mb-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-3">Problem Image</h4>
                <div className="flex justify-center">
                  <img 
                    src={problem.image} 
                    alt="Problem" 
                    className="max-w-full h-auto max-h-[70vh] object-contain rounded-lg shadow-lg"
                    style={{ maxWidth: '100%', height: 'auto' }}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Solutions Content */}
          <div className="p-6 pt-0">
            {showSolutionForm && (
              <SolutionForm 
                problemId={problem._id}
                onSolutionCreated={handleSolutionCreated}
                onCancel={() => setShowSolutionForm(false)}
              />
            )}

            {loading ? (
              <div className="flex justify-center items-center py-12">
                <div className="text-gray-600">Loading solutions...</div>
              </div>
            ) : solutions.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FiMessageCircle className="w-8 h-8 text-gray-400" />
                </div>
                <h4 className="text-lg font-semibold text-gray-900 mb-2">No solutions yet</h4>
                <p className="text-gray-600 mb-6">Be the first to suggest a solution for this problem!</p>
                <button 
                  className="btn-primary"
                  onClick={() => setShowSolutionForm(true)}
                >
                  <FiPlus className="w-5 h-5" /> Suggest First Solution
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                {solutions.map(solution => (
                  <SolutionCard 
                    key={solution._id} 
                    solution={solution}
                    currentUser={currentUser}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SolutionsModal;
