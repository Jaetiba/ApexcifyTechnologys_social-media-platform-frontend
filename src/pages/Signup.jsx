import { useState } from 'react'
import axios from 'axios'
import { useNavigate, Link } from 'react-router-dom'
import '../styles/Signup.css'

function Signup({ setIsLoggedIn }) {
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    password: '',
    bio: '',
    age: '',
    phone: '',
    profilePic: ''
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const handleSignup = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const signupResponse = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/auth/register`,
        formData
      )

      const loginResponse = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/auth/login`,
        {
          email: formData.email,
          password: formData.password
        }
      )

      const userData = {
        id: loginResponse.data.user.id,
        email: loginResponse.data.user.email,
        username: loginResponse.data.user.username,
        profilePic: loginResponse.data.user.profilePic || 'https://i.pravatar.cc/150?img=999'
      }

      localStorage.setItem('user', JSON.stringify(userData))
      setIsLoggedIn(true)
      navigate('/feed')
    } catch (err) {
      setError(err.response?.data?.error || 'Signup failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="signup-page">
      <div className="signup-container">
        {/* Left Side - Brand */}
        <div className="signup-brand">
          <div className="brand-content">
            <h1>ApexCify</h1>
            <p>Join millions sharing their story</p>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="signup-form-container">
          <form onSubmit={handleSignup} className="signup-form">
            <h2>Create account</h2>
            <p className="form-subtitle">Join our community today</p>

            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                required
                disabled={loading}
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Username</label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="username"
                  required
                  disabled={loading}
                />
              </div>
              <div className="form-group">
                <label>Age</label>
                <input
                  type="number"
                  name="age"
                  value={formData.age}
                  onChange={handleChange}
                  placeholder="25"
                  disabled={loading}
                />
              </div>
            </div>

            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                required
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label>Bio</label>
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                placeholder="Tell us about yourself..."
                rows="2"
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label>Phone (optional)</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+1 (555) 000-0000"
                disabled={loading}
              />
            </div>

            {error && <div className="error-message">{error}</div>}

            <button 
              type="submit" 
              className="signup-btn"
              disabled={loading}
            >
              {loading ? 'Creating account...' : 'Create account'}
            </button>

            <p className="login-link">
              Already have an account? <Link to="/login">Sign in</Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Signup