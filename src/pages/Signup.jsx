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
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/auth/register`,
        formData
      )

      // After signup, auto-login
      const loginResponse = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/auth/login`,
        {
          email: formData.email,
          password: formData.password
        }
      )

      localStorage.setItem('user', JSON.stringify(loginResponse.data.user))
      setIsLoggedIn(true)
      navigate('/feed')
    } catch (err) {
      setError(err.response?.data?.error || 'Signup failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="signup-container">
      <div className="signup-box">
        <h1>ApexCify</h1>
        <h2>Create Account</h2>
        
        <form onSubmit={handleSignup}>
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={formData.username}
            onChange={handleChange}
            required
          />
          
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          
          <input
            type="text"
            name="bio"
            placeholder="Bio (optional)"
            value={formData.bio}
            onChange={handleChange}
          />
          
          <input
            type="number"
            name="age"
            placeholder="Age (optional)"
            value={formData.age}
            onChange={handleChange}
          />
          
          <input
            type="tel"
            name="phone"
            placeholder="Phone (optional)"
            value={formData.phone}
            onChange={handleChange}
          />
          
          <input
            type="url"
            name="profilePic"
            placeholder="Profile Picture URL (optional)"
            value={formData.profilePic}
            onChange={handleChange}
          />
          
          <button type="submit" disabled={loading}>
            {loading ? 'Creating Account...' : 'Sign Up'}
          </button>
        </form>
        
        {error && <p className="error">{error}</p>}
        
        <p>Already have an account? <Link to="/login">Login</Link></p>
      </div>
    </div>
  )
}

export default Signup