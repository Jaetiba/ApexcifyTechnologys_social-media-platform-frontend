import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import '../../styles/PostCard.css'

function PostCard({ post }) {
  const [isLiked, setIsLiked] = useState(false)
  const [likeCount, setLikeCount] = useState(post.likes.length)
  const [showComments, setShowComments] = useState(false)
  const [newComment, setNewComment] = useState('')
  const navigate = useNavigate()
  const user = JSON.parse(localStorage.getItem('user'))

  const handleLike = async () => {
    setIsLiked(!isLiked)
    setLikeCount(isLiked ? likeCount - 1 : likeCount + 1)
    // TODO: Call backend API to like/unlike
  }

  const handleCommentSubmit = async (e) => {
    e.preventDefault()
    // TODO: Call backend API to add comment
    setNewComment('')
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
            <img key={idx} src={img} alt={`post-${idx}`} className="post-img" />
          ))}
        </div>
      )}

      {/* Post Actions */}
      <div className="post-actions">
        <button 
          className={`action-btn ${isLiked ? 'liked' : ''}`}
          onClick={handleLike}
        >
          {isLiked ? '❤️' : '🤍'} {likeCount}
        </button>
        <button 
          className="action-btn"
          onClick={() => setShowComments(!showComments)}
        >
          💬 {post.comments.length}
        </button>
        <button className="action-btn">
          📤 Share
        </button>
      </div>

      {/* Comments Section */}
      {showComments && (
        <div className="comments-section">
          <div className="comments-list">
            {post.comments.map(comment => (
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
              required
            />
            <button type="submit">Post</button>
          </form>
        </div>
      )}
    </div>
  )
}

export default PostCard