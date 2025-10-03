import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FiMapPin, FiUser, FiClock, FiEye, FiMessageCircle, FiEdit3, FiTrash2, FiMoreVertical } from 'react-icons/fi';
import EditProblemModal from './EditProblemModal';

const ProblemCardGrid = ({ problem, currentUser, onViewSolutions, onProblemUpdated, onProblemDeleted }) => {
  const [solutionsCount, setSolutionsCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  useEffect(() => {
    fetchSolutionsCount();
  }, [problem._id]);

  const fetchSolutionsCount = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/problems/${problem._id}/solutions`);
      setSolutionsCount(response.data.length);
    } catch (error) {
      console.error('Error fetching solutions count:', error);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const handleProblemUpdated = (updatedProblem) => {
    onProblemUpdated(updatedProblem);
    setShowEditModal(false);
  };

  const handleProblemDeleted = (problemId) => {
    onProblemDeleted(problemId);
    setShowEditModal(false);
  };

  const isOwner = currentUser && problem.postedBy && currentUser.id === problem.postedBy._id;

  return (
    <div className="card group cursor-pointer" onClick={onViewSolutions}>
      {/* Image Section */}
      {problem.image && (
        <div className="relative h-48 overflow-hidden">
          <img 
            src={problem.image} 
            alt="Problem" 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="image-overlay"></div>
          <div className="absolute top-4 left-4">
            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
              problem.status === 'open' 
                ? 'bg-green-100 text-green-800' 
                : 'bg-blue-100 text-blue-800'
            }`}>
              {problem.status}
            </span>
          </div>
        </div>
      )}

      {/* Content Section */}
      <div className="p-6">
          <div className="mb-4">
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-lg font-bold text-gray-900 line-clamp-2 group-hover:text-primary-600 transition-colors duration-200 flex-1">
                {problem.title}
              </h3>
              {isOwner && (
                <div className="relative ml-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowMenu(!showMenu);
                    }}
                    className="p-1 hover:bg-gray-100 rounded transition-colors duration-200"
                  >
                    <FiMoreVertical className="w-4 h-4 text-gray-500" />
                  </button>
                  {showMenu && (
                    <div className="absolute right-0 top-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10 min-w-[120px]">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowEditModal(true);
                          setShowMenu(false);
                        }}
                        className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                      >
                        <FiEdit3 className="w-3 h-3" />
                        Edit
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowEditModal(true);
                          setShowMenu(false);
                        }}
                        className="w-full px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                      >
                        <FiTrash2 className="w-3 h-3" />
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
            <p className="text-gray-600 text-sm line-clamp-3 leading-relaxed">
              {problem.description}
            </p>
          </div>

        {/* Meta Information */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <FiMapPin className="w-4 h-4 flex-shrink-0" />
            <span className="truncate">{problem.location}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <FiUser className="w-4 h-4 flex-shrink-0" />
            <span>by {problem.postedBy?.username}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <FiClock className="w-4 h-4 flex-shrink-0" />
            <span>{formatDate(problem.createdAt)}</span>
          </div>
        </div>

        {/* Stats and Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div className="flex items-center gap-3">
            <div className="solution-count">
              <FiMessageCircle className="w-4 h-4 mr-1" />
              {solutionsCount} solutions
            </div>
          </div>
          <button 
            className="flex items-center gap-2 text-primary-600 hover:text-primary-700 font-medium text-sm transition-colors duration-200"
            onClick={(e) => {
              e.stopPropagation();
              onViewSolutions();
            }}
          >
            <FiEye className="w-4 h-4" />
            View
          </button>
        </div>
      </div>

      {/* Edit Modal */}
      {showEditModal && (
        <EditProblemModal
          problem={problem}
          onClose={() => setShowEditModal(false)}
          onProblemUpdated={handleProblemUpdated}
          onProblemDeleted={handleProblemDeleted}
        />
      )}
    </div>
  );
};

export default ProblemCardGrid;
