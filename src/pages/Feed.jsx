import { useState, useEffect } from 'react'
import axios from 'axios'
import Header from '../components/Header'
import PostCard from '../components/Post/Postcard'
import '../styles/Feed.css'

function Feed() {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showCreatePost, setShowCreatePost] = useState(false)
  const [newPost, setNewPost] = useState({ content: '', images: [] })
  const user = JSON.parse(localStorage.getItem('user'))

  useEffect(() => {
    fetchPosts()
  }, [])

  const fetchPosts = async () => {
    try {
      setLoading(true)
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/posts`
      )
      setPosts(response.data)
    } catch (err) {
      setError('Failed to load posts')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleCreatePost = async (e) => {
    e.preventDefault()
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/posts`,
        {
          userId: user.id,
          content: newPost.content,
          images: newPost.images
        }
      )
      setPosts([response.data, ...posts])
      setNewPost({ content: '', images: [] })
      setShowCreatePost(false)
    } catch (err) {
      setError('Failed to create post')
      console.error(err)
    }
  }

  return (
    <div className="feed-container">
      <Header />

      <div className="feed-content">
        {/* Create Post Section */}
        <div className="create-post-section">
          <img 
            src={user.profilePic} 
            alt={user.username}
            className="create-post-pic"
          />
          <button 
            className="create-post-btn"
            onClick={() => setShowCreatePost(true)}
          >
            What's on your mind?
          </button>
        </div>

        {/* Create Post Modal */}
        {showCreatePost && (
          <div className="modal-overlay" onClick={() => setShowCreatePost(false)}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2>Create Post</h2>
                <button 
                  className="close-btn"
                  onClick={() => setShowCreatePost(false)}
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleCreatePost}>
                <textarea
                  placeholder="What's on your mind?"
                  value={newPost.content}
                  onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                  required
                  rows="5"
                ></textarea>

                <input
                  type="url"
                  placeholder="Image URL (optional)"
                  onChange={(e) => {
                    if (e.target.value) {
                      setNewPost({ 
                        ...newPost, 
                        images: [e.target.value] 
                      })
                    }
                  }}
                />

                <button type="submit" className="submit-btn">
                  Post
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Posts Feed */}
        <div className="posts-feed">
          {loading && <p className="loading">Loading posts...</p>}
          {error && <p className="error">{error}</p>}
          {posts.length === 0 && !loading && (
            <p className="no-posts">No posts yet. Be the first to post!</p>
          )}

          {posts.map(post => (
            <PostCard key={post._id} post={post} />
          ))}
        </div>
      </div>
    </div>
  )
}

export default Feed