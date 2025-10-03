import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FiMapPin, FiUser, FiThumbsUp, FiMessageCircle, FiClock, FiEdit3, FiTrash2, FiMoreVertical } from 'react-icons/fi';
import SolutionForm from './SolutionForm';
import SolutionCard from './SolutionCard';
import EditProblemModal from './EditProblemModal';

const ProblemCard = ({ problem, currentUser, onProblemUpdated, onProblemDeleted }) => {
  const [solutions, setSolutions] = useState([]);
  const [showSolutionForm, setShowSolutionForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  useEffect(() => {
    fetchSolutions();
  }, [problem._id]);

  const fetchSolutions = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/problems/${problem._id}/solutions`);
      setSolutions(response.data);
    } catch (error) {
      console.error('Error fetching solutions:', error);
    }
  };

  const handleSolutionCreated = (newSolution) => {
    setSolutions([newSolution, ...solutions]);
    setShowSolutionForm(false);
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

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="card hover:shadow-xl">
      <div className="p-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Image Section */}
          {problem.image && (
            <div className="lg:w-80 flex-shrink-0">
              <div className="relative h-48 lg:h-full overflow-hidden rounded-xl">
                <img 
                  src={problem.image} 
                  alt="Problem" 
                  className="w-full h-full object-cover"
                />
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
            </div>
          )}

          {/* Content Section */}
          <div className="flex-1">
            <div className="mb-4">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-xl font-bold text-gray-900 flex-1">{problem.title}</h3>
                {isOwner && (
                  <div className="relative">
                    <button
                      onClick={() => setShowMenu(!showMenu)}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                    >
                      <FiMoreVertical className="w-5 h-5 text-gray-500" />
                    </button>
                    {showMenu && (
                      <div className="absolute right-0 top-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10 min-w-[120px]">
                        <button
                          onClick={() => {
                            setShowEditModal(true);
                            setShowMenu(false);
                          }}
                          className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                        >
                          <FiEdit3 className="w-4 h-4" />
                          Edit
                        </button>
                        <button
                          onClick={() => {
                            setShowEditModal(true);
                            setShowMenu(false);
                          }}
                          className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                        >
                          <FiTrash2 className="w-4 h-4" />
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
              <p className="text-gray-700 leading-relaxed mb-4">{problem.description}</p>
            </div>

            {/* Meta Information */}
            <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-6">
              <div className="flex items-center gap-1">
                <FiMapPin className="w-4 h-4" />
                <span>{problem.location}</span>
              </div>
              <div className="flex items-center gap-1">
                <FiUser className="w-4 h-4" />
                <span>Posted by {problem.postedBy?.username}</span>
              </div>
              <div className="flex items-center gap-1">
                <FiClock className="w-4 h-4" />
                <span>{formatDate(problem.createdAt)}</span>
              </div>
            </div>

            {/* Solutions Section */}
            <div className="border-t border-gray-200 pt-6">
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-3">
                  <h4 className="text-lg font-semibold text-gray-900">Solutions</h4>
                  <div className="solution-count">
                    <FiMessageCircle className="w-4 h-4 mr-1" />
                    {solutions.length}
                  </div>
                </div>
                <button 
                  className="btn-primary btn-small"
                  onClick={() => setShowSolutionForm(true)}
                >
                  Suggest Solution
                </button>
              </div>

              {showSolutionForm && (
                <SolutionForm 
                  problemId={problem._id}
                  onSolutionCreated={handleSolutionCreated}
                  onCancel={() => setShowSolutionForm(false)}
                />
              )}

              <div className="space-y-4">
                {solutions.length === 0 ? (
                  <div className="text-center py-8 bg-gray-50 rounded-xl">
                    <FiMessageCircle className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-500">No solutions yet. Be the first to suggest one!</p>
                  </div>
                ) : (
                  solutions.map(solution => (
                    <SolutionCard 
                      key={solution._id} 
                      solution={solution}
                      currentUser={currentUser}
                    />
                  ))
                )}
              </div>
            </div>
          </div>
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

export default ProblemCard;
