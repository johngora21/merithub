import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import ProtectedRoute from './components/ProtectedRoute'
import { AuthProvider } from './contexts/AuthContext'
import { useEffect } from 'react'

import Jobs from './pages/Jobs'
import Opportunities from './pages/Opportunities'
import Tenders from './pages/Tenders'
import Courses from './pages/Courses'
import CareerTools from './pages/CareerTools'
import TenderTools from './pages/TenderTools'
import MyApplications from './pages/MyApplications'
import MyCourses from './pages/MyCourses'
import Subscriptions from './pages/Subscriptions'
import Profile from './pages/Profile'
import Notifications from './pages/Notifications'
import Bookmarks from './pages/Bookmarks'
import Post from './pages/Post'
import Login from './pages/Login'
import Register from './pages/Register'

function App() {
  // Global mobile scrollbar hiding
  useEffect(() => {
    const isMobile = window.innerWidth <= 768
    if (isMobile) {
      const style = document.createElement('style')
      style.textContent = `
        /* Hide scrollbars on mobile for all elements */
        * {
          -ms-overflow-style: none !important;
          scrollbar-width: none !important;
        }
        *::-webkit-scrollbar {
          display: none !important;
        }
      `
      document.head.appendChild(style)
      return () => {
        if (document.head.contains(style)) {
          document.head.removeChild(style)
        }
      }
    }
  }, [])

  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Auth Routes - Outside of main layout */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* Main App Routes - Inside layout */}
          <Route path="/*" element={
            <Layout>
              <Routes>
                              <Route path="/" element={<Jobs />} />
              <Route path="/jobs" element={<Jobs />} />
              <Route path="/opportunities" element={<Opportunities />} />
              <Route path="/tenders" element={<Tenders />} />
              <Route path="/courses" element={<Courses />} />
              <Route path="/career-tools" element={<ProtectedRoute><CareerTools /></ProtectedRoute>} />
              <Route path="/tender-tools" element={<ProtectedRoute><TenderTools /></ProtectedRoute>} />
              <Route path="/my-applications" element={<ProtectedRoute><MyApplications /></ProtectedRoute>} />
              <Route path="/my-courses" element={<ProtectedRoute><MyCourses /></ProtectedRoute>} />
              <Route path="/subscriptions" element={<ProtectedRoute><Subscriptions /></ProtectedRoute>} />
              <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
              <Route path="/notifications" element={<ProtectedRoute><Notifications /></ProtectedRoute>} />
              <Route path="/bookmarks" element={<ProtectedRoute><Bookmarks /></ProtectedRoute>} />
              <Route path="/post" element={<ProtectedRoute><Post /></ProtectedRoute>} />
              </Routes>
            </Layout>
          } />
        </Routes>
      </Router>
    </AuthProvider>
  )
}

export default App;