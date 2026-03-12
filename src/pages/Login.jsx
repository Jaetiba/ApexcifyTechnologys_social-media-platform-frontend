import { useState } from 'react'
import axios from 'axios'
import { useNavigate, Link } from 'react-router-dom'
import '../styles/Login.css'

function Login({ setIsLoggedIn }) {
  const [email, setEmail] = useState('alice@gmail.com')
  const [password, setPassword] = useState('password123')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/auth/login`,
        { email, password }
      )

      localStorage.setItem('user', JSON.stringify(response.data.user))
      setIsLoggedIn(true)
      navigate('/feed')
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-page">
      <div className="login-container">
        {/* Left Side - Brand */}
        <div className="login-brand">
          <div className="brand-content">
            <h1>ApexCify</h1>
            <p>Connect with your community</p>
            <div className="brand-features">
              <div className="feature">
                <span className="feature-icon">📸</span>
                <span>Share moments</span>
              </div>
              <div className="feature">
                <span className="feature-icon">❤️</span>
                <span>Connect & engage</span>
              </div>
              <div className="feature">
                <span className="feature-icon">👥</span>
                <span>Build community</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="login-form-container">
          <form onSubmit={handleLogin} className="login-form">
            <h2>Welcome back</h2>
            <p className="form-subtitle">Sign in to your account</p>

            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                disabled={loading}
              />
            </div>

            {error && <div className="error-message">{error}</div>}

            <button 
              type="submit" 
              className="login-btn"
              disabled={loading}
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </button>

            <p className="signup-link">
              Don't have an account? <Link to="/signup">Create one</Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Login