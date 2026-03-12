import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import Header from '../components/Header'
import PostCard from '../components/Post/PostCard'
import '../styles/Profile.css'

function Profile() {
  const { username } = useParams()
  const [profile, setProfile] = useState(null)
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [isFollowing, setIsFollowing] = useState(false)
  const [actionLoading, setActionLoading] = useState(false)
  const currentUser = JSON.parse(localStorage.getItem('user'))

  useEffect(() => {
    fetchProfile()
    fetchUserPosts()
  }, [username])

  const fetchProfile = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/users/${username}`
      )
      setProfile(response.data)
      setIsFollowing(response.data.followers?.some(f => f._id === currentUser.id || f === currentUser.id) || false)
    } catch (err) {
      setError('Failed to load profile')
    } finally {
      setLoading(false)
    }
  }

  const fetchUserPosts = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/posts/user/${username}`
      )
      setPosts(response.data)
    } catch (err) {
      console.error('Failed to load posts')
    }
  }

  const handleFollow = async () => {
    try {
      setActionLoading(true)
      if (isFollowing) {
        await axios.delete(
          `${import.meta.env.VITE_API_URL}/api/users/${profile._id}/follow`,
          { data: { userId: currentUser.id } }
        )
      } else {
        await axios.post(
          `${import.meta.env.VITE_API_URL}/api/users/${profile._id}/follow`,
          { userId: currentUser.id }
        )
      }
      setIsFollowing(!isFollowing)
      fetchProfile()
    } catch (err) {
      console.error('Failed to follow/unfollow:', err)
    } finally {
      setActionLoading(false)
    }
  }

  if (loading) return (
    <div className="profile-page">
      <Header />
      <div className="loading">Loading profile...</div>
    </div>
  )
  if (error) return (
    <div className="profile-page">
      <Header />
      <div className="error">{error}</div>
    </div>
  )
  if (!profile) return (
    <div className="profile-page">
      <Header />
      <div className="error">User not found</div>
    </div>
  )

  return (
    <div className="profile-page">
      <Header />

      <div className="profile-wrapper">
        {/* Profile Info Section */}
        <div className="profile-info">
          <div className="profile-avatar-section">
            <img 
              src={profile.profilePic} 
              alt={profile.username}
              className="profile-avatar-large"
            />
          </div>

          <div className="profile-details-section">
            <div className="profile-header-top">
              <h1>{profile.username}</h1>
              {currentUser.username !== profile.username && (
                <button 
                  className={`follow-btn-large ${isFollowing ? 'following' : ''}`}
                  onClick={handleFollow}
                  disabled={actionLoading}
                >
                  {actionLoading ? '...' : (isFollowing ? 'Following' : 'Follow')}
                </button>
              )}
            </div>

            <div className="profile-stats-large">
              <div className="stat-item">
                <span className="stat-count">{posts.length}</span>
                <span className="stat-name">posts</span>
              </div>
              <div className="stat-item">
                <span className="stat-count">{profile.followers?.length || 0}</span>
                <span className="stat-name">followers</span>
              </div>
              <div className="stat-item">
                <span className="stat-count">{profile.following?.length || 0}</span>
                <span className="stat-name">following</span>
              </div>
            </div>

            <div className="profile-bio-section">
              <p className="profile-username-display">{profile.username}</p>
              <p className="profile-bio-text">{profile.bio || 'No bio'}</p>
            </div>
          </div>
        </div>

        {/* Posts Grid */}
        <div className="posts-section">
          <div className="posts-divider">
            <span>POSTS</span>
          </div>

          {posts.length === 0 ? (
            <p className="no-posts">No posts yet</p>
          ) : (
            <div className="posts-feed">
              {posts.map(post => (
                <PostCard key={post._id} post={post} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Profile