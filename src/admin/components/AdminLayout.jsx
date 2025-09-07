import React from 'react'
import { Link, useLocation } from 'react-router-dom'

const navItemStyle = (active) => ({
  display: 'block',
  padding: '10px 12px',
  borderRadius: '8px',
  color: active ? '#ffffff' : '#0f172a',
  backgroundColor: active ? '#f97316' : 'transparent',
  fontSize: '14px',
  fontWeight: 600,
  textDecoration: 'none'
})

const AdminLayout = ({ children, user, onLogout }) => {
  const location = useLocation()

  const items = [
    { to: '/admin', label: 'Dashboard' },
    { to: '/admin/crm', label: 'CRM' },
    { to: '/admin/content', label: 'Content' },
    { to: '/admin/applications', label: 'Applications' },
    { to: '/admin/finance', label: 'Finance' },
    { to: '/admin/reports', label: 'Reports' }
  ]

  return (
    <div style={{ 
      display: 'grid', 
      gridTemplateColumns: '240px 1fr', 
      minHeight: '100vh', 
      backgroundColor: '#f8f9fa',
      maxWidth: '100vw',
      overflow: 'hidden'
    }}>
      <aside style={{ 
        padding: '16px', 
        borderRight: '1px solid #f0f0f0', 
        backgroundColor: '#ffffff', 
        display: 'flex', 
        flexDirection: 'column',
        overflow: 'hidden'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
          <img 
            src="/assets/images/merit-logo.png" 
            alt="Merit Logo" 
            style={{
              height: '32px',
              width: 'auto',
              objectFit: 'contain'
            }}
          />
          <div style={{ fontSize: '16px', fontWeight: 800, color: '#0f172a' }}>Merit Admin</div>
        </div>
        
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '6px', flex: 1 }}>
          {items.map((item) => (
            <Link key={item.to} to={item.to} style={navItemStyle(location.pathname === item.to)}>
              {item.label}
            </Link>
          ))}
        </nav>

        {/* User info and logout */}
        {user && (
          <div style={{ borderTop: '1px solid #f0f0f0', paddingTop: '16px' }}>
            <div style={{ marginBottom: '12px' }}>
              <div style={{ fontSize: '14px', fontWeight: 600, color: '#0f172a' }}>
                {user.username ? `@${user.username}` : `${user.first_name} ${user.last_name}`}
              </div>
              <div style={{ fontSize: '12px', color: '#64748b' }}>
                {user.email}
              </div>
            </div>
            <button
              onClick={onLogout}
              style={{
                width: '100%',
                padding: '8px 12px',
                borderRadius: '6px',
                border: '1px solid #e2e8f0',
                backgroundColor: '#f8fafc',
                color: '#64748b',
                fontSize: '12px',
                fontWeight: 500,
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = '#f1f5f9'
                e.target.style.borderColor = '#cbd5e1'
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = '#f8fafc'
                e.target.style.borderColor = '#e2e8f0'
              }}
            >
              Logout
            </button>
          </div>
        )}
      </aside>
      <main style={{ 
        padding: '0', 
        overflow: 'auto',
        maxWidth: '100%'
      }}>
        {children}
      </main>
    </div>
  )
}

export default AdminLayout


