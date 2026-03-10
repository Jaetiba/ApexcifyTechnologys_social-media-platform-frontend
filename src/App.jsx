import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Feed from './pages/Feed'
import Profile from './pages/Profile'

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('user'))

  return (
    <Router>
      <Routes>
        <Route 
          path="/login" 
          element={<Login setIsLoggedIn={setIsLoggedIn} />} 
        />
        <Route 
          path="/feed" 
          element={isLoggedIn ? <Feed /> : <Navigate to="/login" />} 
        />
        <Route 
          path="/profile/:username" 
          element={isLoggedIn ? <Profile /> : <Navigate to="/login" />} 
        />
        <Route path="*" element={<Navigate to={isLoggedIn ? "/feed" : "/login"} />} />
      </Routes>
    </Router>
  )
}

export default App