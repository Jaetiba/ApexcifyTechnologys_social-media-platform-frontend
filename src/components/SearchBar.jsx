import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import '../styles/SearchBar.css'

function SearchBar() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [isOpen, setIsOpen] = useState(false)
  const navigate = useNavigate()

  const handleSearch = async (e) => {
    const value = e.target.value
    setQuery(value)

    if (value.length > 0) {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/users/search/${value}`
        )
        setResults(response.data)
        setIsOpen(true)
      } catch (err) {
        console.error('Search failed:', err)
      }
    } else {
      setResults([])
      setIsOpen(false)
    }
  }

  const handleSelectUser = (username) => {
    navigate(`/profile/${username}`)
    setQuery('')
    setResults([])
    setIsOpen(false)
  }

  return (
    <div className="search-bar">
      <input
        type="text"
        placeholder="Search users..."
        value={query}
        onChange={handleSearch}
        className="search-input"
      />
      
      {isOpen && results.length > 0 && (
        <div className="search-results">
          {results.map(user => (
            <div
              key={user._id}
              className="search-result"
              onClick={() => handleSelectUser(user.username)}
            >
              <img src={user.profilePic} alt={user.username} />
              <div>
                <p className="result-username">{user.username}</p>
                <p className="result-bio">{user.bio || 'No bio'}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default SearchBar