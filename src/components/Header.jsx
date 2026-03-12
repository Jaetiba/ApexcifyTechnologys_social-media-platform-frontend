import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import SearchBar from './SearchBar'
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
    setIsOpen(false)
  }

  const handleLogoClick = () => {
    navigate('/feed')
  }

  return (
    <header className="header">
      <div className="header-container">
        {/* Logo */}
        <button 
          className="logo"
          onClick={handleLogoClick}
        >
          ApexCify
        </button>

        {/* Search Bar */}
        <SearchBar />

        {/* User Menu */}
        <div className="user-menu">
          {/* Profile Picture Button */}
          <button 
            className="profile-btn"
            onClick={handleProfileClick}
            title="View Profile"
          >
            <img 
              src={user.profilePic} 
              alt={user.username}
              className="profile-avatar"
            />
          </button>

          {/* Dropdown Menu */}
          <div className="dropdown">
            <button 
              className="menu-btn"
              onClick={() => setIsOpen(!isOpen)}
              title="Menu"
            >
              ⋮
            </button>
            {isOpen && (
              <div className="dropdown-menu">
                <button onClick={handleProfileClick} className="menu-item">
                  👤 View Profile
                </button>
                <button onClick={handleLogout} className="menu-item logout">
                  🚪 Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header