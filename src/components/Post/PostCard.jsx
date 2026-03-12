import { useState } from 'react'
// import { useState } from 'react'
import React from 'react'  // Add this
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import '../../styles/PostCard.css'

function PostCard({ post, onPostUpdate }) {
  const [isLiked, setIsLiked] = useState(false)
  const [likeCount, setLikeCount] = useState(post.likes.length)
  const [comments, setComments] = useState(post.comments || [])
  const [showComments, setShowComments] = useState(false)
  const [newComment, setNewComment] = useState('')

  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const user = JSON.parse(localStorage.getItem('user'))

  // Check if current user already liked
  React.useEffect(() => {
    setIsLiked(post.likes.includes(user.id))
  }, [post.likes, user.id])

  const handleLike = async () => {
    try {
      setLoading(true)
      if (isLiked) {
        // Unlike
        await axios.delete(
          `${import.meta.env.VITE_API_URL}/api/posts/${post._id}/like`,
          { data: { userId: user.id } }
        )
        setLikeCount(likeCount - 1)
      } else {
        // Like
        await axios.post(
          `${import.meta.env.VITE_API_URL}/api/posts/${post._id}/like`,
          { userId: user.id }
        )
        setLikeCount(likeCount + 1)
      }
      setIsLiked(!isLiked)
    } catch (err) {
      console.error('Failed to like/unlike post:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleCommentSubmit = async (e) => {
    e.preventDefault()
    if (!newComment.trim()) return

    try {
      setLoading(true)
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/posts/${post._id}/comments`,
        {
          userId: user.id,
          content: newComment
        }
      )
      
      setComments([...comments, response.data])
      setNewComment('')
    } catch (err) {
      console.error('Failed to add comment:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteComment = async (commentId) => {
    try {
      await axios.delete(
        `${import.meta.env.VITE_API_URL}/api/posts/comments/${commentId}`
      )
      setComments(comments.filter(c => c._id !== commentId))
    } catch (err) {
      console.error('Failed to delete comment:', err)
    }
  }

  const handleProfileClick = () => {
    navigate(`/profile/${post.userId.username}`)
  }

  return (
    <div className="post-card">
      {/* Post Header */}
      <div className="post-header">
        <img 
          src={post.userId.profilePic} 
          alt={post.userId.username}
          className="profile-pic"
          onClick={handleProfileClick}
          style={{ cursor: 'pointer' }}
        />
        <div className="post-user-info">
          <h3 
            onClick={handleProfileClick}
            style={{ cursor: 'pointer', margin: 0, color: '#333' }}
          >
            {post.userId.username}
          </h3>
          <p className="post-time">
            {new Date(post.createdAt).toLocaleDateString()}
          </p>
        </div>
      </div>

      {/* Post Content */}
      <div className="post-content">
        <p>{post.content}</p>
      </div>

      {/* Post Images */}
      {post.images && post.images.length > 0 && (
  <div className="post-images">
    {post.images.map((img, idx) => (
      <img 
        key={idx} 
        src={img} 
        alt={`post-${idx}`} 
        className="post-img"
        onError={(e) => {
          e.target.style.display = 'none';
        }}
      />
    ))}
  </div>
)}

      {/* Post Actions */}
      <div className="post-actions">
        <button 
          className={`action-btn ${isLiked ? 'liked' : ''}`}
          onClick={handleLike}
          disabled={loading}
        >
          {isLiked ? '❤️' : '🤍'} {likeCount}
        </button>
        <button 
          className="action-btn"
          onClick={() => setShowComments(!showComments)}
        >
          💬 {comments.length}
        </button>
        <button className="action-btn">
          📤 Share
        </button>
      </div>

      {/* Comments Section */}
      {showComments && (
        <div className="comments-section">
          <div className="comments-list">
            {comments.map(comment => (
              <div key={comment._id} className="comment">
                <img 
                  src={comment.userId.profilePic} 
                  alt={comment.userId.username}
                  className="comment-pic"
                />
                <div className="comment-content">
                  <h4>{comment.userId.username}</h4>
                  <p>{comment.content}</p>
                </div>
                {comment.userId._id === user.id && (
                  <button 
                    className="delete-comment-btn"
                    onClick={() => handleDeleteComment(comment._id)}
                  >
                    ✕
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* Add Comment Form */}
          <form onSubmit={handleCommentSubmit} className="comment-form">
            <input
              type="text"
              placeholder="Add a comment..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              disabled={loading}
              required
            />
            <button type="submit" disabled={loading}>
              {loading ? '...' : 'Post'}
            </button>
          </form>
        </div>
      )}
    </div>
  )
}

export default PostCard