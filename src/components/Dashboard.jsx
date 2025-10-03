import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FiPlus, FiMapPin, FiUser, FiThumbsUp, FiMessageCircle, FiLogOut, FiGrid, FiList, FiEye, FiChevronDown } from 'react-icons/fi';
import ProblemForm from './ProblemForm';
import ProblemCard from './ProblemCard';
import ProblemCardGrid from './ProblemCardGrid';
import SolutionsModal from './SolutionsModal';

const Dashboard = ({ user, onLogout }) => {
  const [problems, setProblems] = useState([]);
  const [showProblemForm, setShowProblemForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [selectedProblem, setSelectedProblem] = useState(null);
  const [showSolutionsModal, setShowSolutionsModal] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProblems();
  }, []);

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showUserMenu && !event.target.closest('.user-menu-container')) {
        setShowUserMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showUserMenu]);

  const fetchProblems = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/problems`);
      setProblems(response.data);
    } catch (error) {
      console.error('Error fetching problems:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    onLogout();
    navigate('/login');
  };

  const handleProblemCreated = (newProblem) => {
    setProblems([newProblem, ...problems]);
    setShowProblemForm(false);
  };

  const handleViewSolutions = (problem) => {
    setSelectedProblem(problem);
    setShowSolutionsModal(true);
  };

  const closeSolutionsModal = () => {
    setShowSolutionsModal(false);
    setSelectedProblem(null);
  };

  const handleProblemUpdated = (updatedProblem) => {
    setProblems(problems.map(p => p._id === updatedProblem._id ? updatedProblem : p));
  };

  const handleProblemDeleted = (problemId) => {
    setProblems(problems.filter(p => p._id !== problemId));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="flex justify-center items-center h-screen">
          <div className="text-lg text-gray-600">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-lg sticky top-0 z-40 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center gap-4">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-primary-500 to-secondary-500 bg-clip-text">
                CrowdSolve
              </h1>
              <div className="hidden md:flex items-center gap-2 text-sm text-gray-500">
                <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                <span>Community Platform</span>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <button 
                className="btn-primary"
                onClick={() => setShowProblemForm(true)}
                style={{
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: 'white',
                  padding: '0.75rem 1.5rem',
                  borderRadius: '0.75rem',
                  fontWeight: '600',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                  border: 'none',
                  cursor: 'pointer'
                }}
              >
                <FiPlus className="w-5 h-5" /> Post Problem
              </button>
              <div className="relative user-menu-container">
                <button 
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-3 text-gray-600 bg-gray-50 rounded-xl px-4 py-2 hover:bg-gray-100 transition-colors duration-200"
                >
                  <FiUser className="w-4 h-4" />
                  <span className="font-semibold">{user?.username}</span>
                  <FiChevronDown className={`w-4 h-4 transition-transform duration-200 ${showUserMenu ? 'rotate-180' : ''}`} />
                </button>
                
                {showUserMenu && (
                  <div className="absolute right-0 top-full mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-50 min-w-[160px]">
                    <div className="py-2">
                      <div className="px-4 py-2 text-sm text-gray-500 border-b border-gray-100">
                        {user?.email}
                      </div>
                      <button
                        onClick={() => {
                          handleLogout();
                          setShowUserMenu(false);
                        }}
                        className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 transition-colors duration-200"
                      >
                        <FiLogOut className="w-4 h-4" />
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {showProblemForm && (
          <ProblemForm 
            onProblemCreated={handleProblemCreated}
            onCancel={() => setShowProblemForm(false)}
          />
        )}

        <div className="mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">Community Problems</h2>
              <p className="text-gray-600 mt-1">Discover and solve problems together</p>
            </div>
            <div className="flex items-center gap-4">
              <div 
                className="view-toggle"
                style={{
                  display: 'flex',
                  background: '#f3f4f6',
                  borderRadius: '0.5rem',
                  padding: '0.25rem'
                }}
              >
                <button
                  className={`view-toggle-btn ${viewMode === 'grid' ? 'active' : ''}`}
                  onClick={() => setViewMode('grid')}
                  style={{
                    padding: '0.5rem 0.75rem',
                    borderRadius: '0.375rem',
                    fontSize: '0.875rem',
                    fontWeight: '500',
                    cursor: 'pointer',
                    border: 'none',
                    background: viewMode === 'grid' ? 'white' : 'transparent',
                    color: viewMode === 'grid' ? '#667eea' : '#4b5563',
                    boxShadow: viewMode === 'grid' ? '0 1px 2px 0 rgba(0, 0, 0, 0.05)' : 'none'
                  }}
                >
                  <FiGrid className="w-4 h-4" />
                </button>
                <button
                  className={`view-toggle-btn ${viewMode === 'list' ? 'active' : ''}`}
                  onClick={() => setViewMode('list')}
                  style={{
                    padding: '0.5rem 0.75rem',
                    borderRadius: '0.375rem',
                    fontSize: '0.875rem',
                    fontWeight: '500',
                    cursor: 'pointer',
                    border: 'none',
                    background: viewMode === 'list' ? 'white' : 'transparent',
                    color: viewMode === 'list' ? '#667eea' : '#4b5563',
                    boxShadow: viewMode === 'list' ? '0 1px 2px 0 rgba(0, 0, 0, 0.05)' : 'none'
                  }}
                >
                  <FiList className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {problems.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl shadow-lg border border-gray-100">
              <div className="w-24 h-24 bg-gradient-to-br from-primary-100 to-secondary-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <FiPlus className="w-12 h-12 text-primary-500" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No problems yet</h3>
              <p className="text-gray-600 mb-6">Be the first to post a problem and start the conversation!</p>
              <button 
                className="btn-primary"
                onClick={() => setShowProblemForm(true)}
                style={{
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: 'white',
                  padding: '0.75rem 1.5rem',
                  borderRadius: '0.75rem',
                  fontWeight: '600',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                  border: 'none',
                  cursor: 'pointer'
                }}
              >
                <FiPlus className="w-5 h-5" /> Post First Problem
              </button>
            </div>
          ) : (
            <div className={viewMode === 'grid' ? 'card-grid' : 'card-list'}>
              {problems.map(problem => (
                viewMode === 'grid' ? (
                  <ProblemCardGrid 
                    key={problem._id} 
                    problem={problem}
                    currentUser={user}
                    onViewSolutions={() => handleViewSolutions(problem)}
                    onProblemUpdated={handleProblemUpdated}
                    onProblemDeleted={handleProblemDeleted}
                  />
                ) : (
                  <ProblemCard 
                    key={problem._id} 
                    problem={problem}
                    currentUser={user}
                    onProblemUpdated={handleProblemUpdated}
                    onProblemDeleted={handleProblemDeleted}
                  />
                )
              ))}
            </div>
          )}
        </div>

        {showSolutionsModal && selectedProblem && (
          <SolutionsModal
            problem={selectedProblem}
            currentUser={user}
            onClose={closeSolutionsModal}
          />
        )}
      </main>
    </div>
  );
};

export default Dashboard;
