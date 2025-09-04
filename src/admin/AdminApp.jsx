import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import AdminLogin from './pages/AdminLogin'
import Dashboard from './pages/Dashboard'
import CRM from './pages/CRM'
import Content from './pages/Content'
import Applications from './pages/Applications'
import Finance from './pages/Finance'
import Reports from './pages/Reports'
import { apiService } from '../lib/api-service'

function AdminApp() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [user, setUser] = useState(null)

  useEffect(() => {
    checkAuthStatus()
  }, [])

  const checkAuthStatus = async () => {
    try {
      const token = localStorage.getItem('auth-token')
      if (!token) {
        setIsLoading(false)
        return
      }

      const response = await apiService.get('/auth/verify')
      if (response.success) {
        const userData = response.data?.user || response.user
        // Check if user is admin
        const isAdmin = !!userData.is_admin || userData.subscription_type === 'enterprise'
        if (isAdmin) {
          setUser(userData)
          setIsAuthenticated(true)
        } else {
          localStorage.removeItem('auth-token')
        }
      } else {
        localStorage.removeItem('auth-token')
      }
    } catch (error) {
      console.error('Auth check failed:', error)
      localStorage.removeItem('auth-token')
    } finally {
      setIsLoading(false)
    }
  }

  const handleLoginSuccess = () => {
    setIsAuthenticated(true)
  }

  const handleLogout = () => {
    localStorage.removeItem('auth-token')
    setUser(null)
    setIsAuthenticated(false)
  }

  if (isLoading) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #fff 0%, #fff7ed 50%, #fff1e6 100%)'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ 
            background: 'white', 
            borderRadius: '16px', 
            boxShadow: '0 4px 20px rgba(0,0,0,0.06)', 
            padding: '24px 28px', 
            border: '1px solid #eef2f7' 
          }}>
            <div style={{ 
              width: '48px', 
              height: '48px', 
              border: '4px solid #f3f4f6', 
              borderTop: '4px solid #f97316', 
              borderRadius: '50%', 
              animation: 'spin 1s linear infinite',
              margin: '0 auto 12px auto' 
            }}></div>
            <p style={{ color: '#475569', fontWeight: 600 }}>Checking authentication...</p>
          </div>
        </div>
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <AdminLogin onSuccess={handleLoginSuccess} />
  }

  return (
    <Router>
      <Routes>
        <Route path="/admin" element={<Dashboard user={user} onLogout={handleLogout} />} />
        <Route path="/admin/crm" element={<CRM user={user} onLogout={handleLogout} />} />
        <Route path="/admin/content" element={<Content user={user} onLogout={handleLogout} />} />
        <Route path="/admin/applications" element={<Applications user={user} onLogout={handleLogout} />} />
        <Route path="/admin/finance" element={<Finance user={user} onLogout={handleLogout} />} />
        <Route path="/admin/reports" element={<Reports user={user} onLogout={handleLogout} />} />
        <Route path="*" element={<Navigate to="/admin" replace />} />
      </Routes>
    </Router>
  )
}

export default AdminApp
