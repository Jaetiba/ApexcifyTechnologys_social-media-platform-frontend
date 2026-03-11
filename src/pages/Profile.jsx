import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import Header from '../components/Header'
import PostCard from '../components/Post/Postcard'
import '../styles/Profile.css'

function Profile() {
  const { username } = useParams()
  const [profile, setProfile] = useState(null)
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [isFollowing, setIsFollowing] = useState(false)
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
      setIsFollowing(response.data.followers?.includes(currentUser.id) || false)
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
    // TODO: Implement follow/unfollow API call
    setIsFollowing(!isFollowing)
  }

  if (loading) return <div className="loading">Loading profile...</div>
  if (error) return <div className="error">{error}</div>
  if (!profile) return <div className="error">User not found</div>

  return (
    <div className="profile-container">
      <Header />

      <div className="profile-content">
        {/* Profile Header */}
        <div className="profile-header">
          <img 
            src={profile.profilePic} 
            alt={profile.username}
            className="profile-avatar"
          />

          <div className="profile-info">
            <h1>{profile.username}</h1>
            <p className="profile-bio">{profile.bio || 'No bio'}</p>

            <div className="profile-stats">
              <div className="stat">
                <span className="stat-number">{posts.length}</span>
                <span className="stat-label">Posts</span>
              </div>
              <div className="stat">
                <span className="stat-number">{profile.followers?.length || 0}</span>
                <span className="stat-label">Followers</span>
              </div>
              <div className="stat">
                <span className="stat-number">{profile.following?.length || 0}</span>
                <span className="stat-label">Following</span>
              </div>
            </div>

            {currentUser.username !== profile.username && (
              <button 
                className={`follow-btn ${isFollowing ? 'following' : ''}`}
                onClick={handleFollow}
              >
                {isFollowing ? 'Following' : 'Follow'}
              </button>
            )}
          </div>
        </div>

        {/* User Posts Grid */}
        <div className="profile-posts">
          <h2>Posts</h2>
          {posts.length === 0 ? (
            <p className="no-posts">No posts yet</p>
          ) : (
            posts.map(post => (
              <PostCard key={post._id} post={post} />
            ))
          )}
        </div>
      </div>
    </div>
  )
}

export default Profile