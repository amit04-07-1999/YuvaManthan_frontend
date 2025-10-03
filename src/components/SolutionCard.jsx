import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FiThumbsUp, FiMessageCircle, FiUser, FiClock } from 'react-icons/fi';
import CommentForm from './CommentForm';

const SolutionCard = ({ solution, currentUser }) => {
  const [comments, setComments] = useState([]);
  const [showCommentForm, setShowCommentForm] = useState(false);
  const [upvotes, setUpvotes] = useState(solution.upvotes?.length || 0);
  const [hasUpvoted, setHasUpvoted] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchComments();
    checkUpvoteStatus();
  }, [solution._id]);

  const fetchComments = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/solutions/${solution._id}/comments`);
      setComments(response.data);
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  };

  const checkUpvoteStatus = () => {
    if (currentUser && solution.upvotes) {
      setHasUpvoted(solution.upvotes.includes(currentUser.id));
    }
  };

  const handleUpvote = async () => {
    if (!currentUser) return;

    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/api/solutions/${solution._id}/upvote`,
        {},
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      setUpvotes(response.data.upvotes);
      setHasUpvoted(response.data.hasUpvoted);
    } catch (error) {
      console.error('Error upvoting:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCommentCreated = (newComment) => {
    setComments([newComment, ...comments]);
    setShowCommentForm(false);
  };

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
    <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200">
      <div className="flex justify-between items-center mb-4 text-sm text-gray-600">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-primary-100 to-secondary-100 rounded-full flex items-center justify-center">
            <FiUser className="w-4 h-4 text-primary-600" />
          </div>
          <span className="font-semibold text-gray-900">{solution.postedBy?.username}</span>
        </div>
        <div className="flex items-center gap-1 text-gray-500">
          <FiClock className="w-4 h-4" />
          <span>{formatDate(solution.createdAt)}</span>
        </div>
      </div>

      <div className="mb-6">
        <p className="text-gray-700 leading-relaxed text-base">{solution.description}</p>
      </div>

      <div className="flex gap-3 mb-6">
        <button 
          className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-all duration-200 ${
            hasUpvoted 
              ? 'bg-blue-50 border-blue-200 text-blue-600 shadow-sm' 
              : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100 hover:border-gray-300'
          } ${loading || !currentUser ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
          onClick={handleUpvote}
          disabled={loading || !currentUser}
        >
          <FiThumbsUp className={`w-4 h-4 ${hasUpvoted ? 'fill-current' : ''}`} />
          <span className="font-medium">{upvotes}</span>
        </button>
        
        <button 
          className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-100 hover:border-gray-300 transition-all duration-200 bg-gray-50"
          onClick={() => setShowCommentForm(!showCommentForm)}
        >
          <FiMessageCircle className="w-4 h-4" />
          <span className="font-medium">{comments.length}</span>
        </button>
      </div>

      {showCommentForm && (
        <CommentForm 
          solutionId={solution._id}
          onCommentCreated={handleCommentCreated}
          onCancel={() => setShowCommentForm(false)}
        />
      )}

      {comments.length > 0 && (
        <div className="mt-6 pt-6 border-t border-gray-200">
          <h5 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <FiMessageCircle className="w-4 h-4" />
            Comments ({comments.length})
          </h5>
          <div className="space-y-4">
            {comments.map(comment => (
              <div key={comment._id} className="bg-gray-50 rounded-lg p-4 border border-gray-100">
                <div className="flex justify-between items-center mb-3 text-xs text-gray-600">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full flex items-center justify-center">
                      <FiUser className="w-3 h-3 text-gray-600" />
                    </div>
                    <span className="font-medium">{comment.postedBy?.username}</span>
                  </div>
                  <span>{formatDate(comment.createdAt)}</span>
                </div>
                <p className="text-gray-700 text-sm leading-relaxed">{comment.text}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SolutionCard;
