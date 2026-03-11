import { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import '../styles/Login.css'
import { Link } from 'react-router-dom'

function Login({ setIsLoggedIn }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault()
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/auth/login`,
        { email, password }
      )

      localStorage.setItem('user', JSON.stringify(response.data.user))
      setIsLoggedIn(true)
      navigate('/feed')
    } catch (err) {
      setError('Invalid email or password')
      return err.response?.data?.message || 'Login failed'
    }
  }

  return (
    <div className="login-container">
      <div className="login-box">
        <h1>ApexCify</h1>
        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit">Login</button>

            {error && <p className="error">{error}</p>}
            <p style={{marginTop: '15px', textAlign: 'center'}}>
            Don't have an account? <Link to="/signup">Sign Up</Link>
            </p> 
        
        </form>
        {error && <p className="error">{error}</p>}
        <p>Test: alice@gmail.com / password123</p>
      </div>
    </div>
  )
}

export default Login