import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import '../styles/Header.css'

function Header() {
  const navigate = useNavigate()
  const user = JSON.parse(localStorage.getItem('user'))
  const [isOpen, setIsOpen] = useState(false)

  const handleLogout = () => {
    localStorage.removeItem('user')
    navigate('/login')
  }

  const handleProfileClick = () => {
    navigate(`/profile/${user.username}`)
  }

  return (
    <header className="header">
      <div className="header-container">
        <h1 className="logo">ApexCify</h1>

        <div className="header-right">
          <button 
            className="header-btn"
            onClick={handleProfileClick}
          >
            👤 {user.username}
          </button>

          <div className="dropdown">
            <button 
              className="header-btn menu-btn"
              onClick={() => setIsOpen(!isOpen)}
            >
              ⋮
            </button>
            {isOpen && (
              <div className="dropdown-menu">
                <button onClick={handleLogout}>Logout</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header