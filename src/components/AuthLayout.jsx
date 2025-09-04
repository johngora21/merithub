import React from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'

const AuthLayout = ({ children, showBackButton = true }) => {
  return (
    <div style={{ 
      backgroundColor: '#f8f9fa',
      minHeight: '100vh',
      position: 'relative'
    }}>
      {/* Back Button */}
      {showBackButton && (
        <div style={{
          position: 'absolute',
          top: '20px',
          left: '20px',
          zIndex: 10
        }}>
          <Link
            to="/"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '40px',
              height: '40px',
              backgroundColor: 'white',
              borderRadius: '8px',
              textDecoration: 'none',
              color: '#374151',
              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
              border: '1px solid #e5e7eb',
              transition: 'all 0.2s ease-in-out'
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = '#f9fafb'
              e.target.style.borderColor = '#16a34a'
              e.target.style.color = '#16a34a'
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = 'white'
              e.target.style.borderColor = '#e5e7eb'
              e.target.style.color = '#374151'
            }}
          >
            <ArrowLeft size={20} />
          </Link>
        </div>
      )}
      
      {/* Auth Content */}
      {children}
    </div>
  )
}

export default AuthLayout




