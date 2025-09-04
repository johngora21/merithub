import { Link, useLocation, useNavigate } from 'react-router-dom'
import { 
  Wrench,
  FileText,
  GraduationCap,
  CreditCard,
  Briefcase,
  BookOpen,
  Hammer,
  Gavel,
  User
} from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'

const Sidebar = ({ sidebarOpen, setSidebarOpen, isDesktop }) => {
  const location = useLocation()
  const navigate = useNavigate()
  const { user, isAuthenticated, logout } = useAuth()
  const profileImageUrl = user && user.profile_image
    ? (user.profile_image.startsWith('http') ? user.profile_image : `http://localhost:8000${user.profile_image}`)
    : null

  // Main navigation items for desktop
  const mainNavigation = [
    { name: 'Jobs', href: '/jobs', icon: Briefcase },
    { name: 'Opportunities', href: '/opportunities', icon: GraduationCap },
    { name: 'Tenders', href: '/tenders', icon: Gavel },
    { name: 'Courses', href: '/courses', icon: BookOpen },
  ]

  // User-specific navigation items
  const userNavigation = [
    { name: 'Career Tools', href: '/career-tools', icon: Wrench },
    { name: 'Tender Tools', href: '/tender-tools', icon: Hammer },
    { name: 'My Applications', href: '/my-applications', icon: FileText },
    { name: 'My Courses', href: '/my-courses', icon: GraduationCap },
    { name: 'Subscriptions', href: '/subscriptions', icon: CreditCard },
  ]

  const isActive = (path) => {
    return location.pathname === path
  }

  return (
    <>
      {/* Mobile sidebar overlay */}
      {sidebarOpen && !isDesktop && (
        <div 
          className="fixed inset-0 z-40 bg-gray-600 bg-opacity-75"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div style={{
        position: isDesktop ? 'static' : 'fixed',
        top: 0,
        left: 0,
        width: isDesktop ? '280px' : '85%',
        maxWidth: isDesktop ? '280px' : '300px',
        height: '100%',
        backgroundColor: 'white',
        transform: sidebarOpen ? 'translateX(0)' : (isDesktop ? 'translateX(0)' : 'translateX(-100%)'),
        transition: 'transform 0.3s ease-in-out',
        zIndex: isDesktop ? 10 : 60,
        borderRight: isDesktop ? '1px solid #e5e7eb' : 'none',
        boxShadow: isDesktop ? 'none' : (sidebarOpen ? '0 10px 25px rgba(0, 0, 0, 0.1)' : 'none')
      }}>
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
          
          {/* Profile Section */}
          <div style={{
            padding: '20px',
            borderBottom: '1px solid #e5e7eb'
          }}>
            <Link
              to={isAuthenticated ? "/profile" : "/login"}
              onClick={() => !isDesktop && setSidebarOpen(false)}
              style={{
                display: 'flex',
                alignItems: 'center',
                textDecoration: 'none',
                cursor: 'pointer',
                borderRadius: '8px',
                padding: '8px',
                transition: 'background-color 0.2s ease-in-out'
              }}
              onMouseEnter={(e) => e.target.style.backgroundColor = 'rgba(0, 0, 0, 0.05)'}
              onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
            >
              <div style={{
                width: '50px',
                height: '50px',
                borderRadius: '25px',
                backgroundColor: '#f3f4f6',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                marginRight: '12px',
                overflow: 'hidden',
                border: '2px solid #e5e7eb'
              }}>
                {profileImageUrl ? (
                  <img 
                    src={profileImageUrl}
                    alt="Profile"
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover'
                    }}
                    onError={(e) => {
                      e.target.style.display = 'none'
                      e.target.nextSibling.style.display = 'flex'
                    }}
                  />
                ) : null}
                <span style={{
                  fontSize: '20px',
                  fontWeight: '600',
                  color: '#6b7280',
                  display: profileImageUrl ? 'none' : 'flex'
                }}>
                  {user && user.first_name ? user.first_name.charAt(0).toUpperCase() : <User size={20} />}
                </span>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{
                  fontSize: '16px',
                  fontWeight: '600',
                  color: '#1a1a1a',
                  marginBottom: '2px'
                }}>
                  {user && user.first_name ? `${user.first_name} ${user.last_name || ''}`.trim() : 'Login'}
                </div>
                <div style={{
                  fontSize: '14px',
                  color: '#6b7280'
                }}>
                  {user && user.username ? `@${user.username}` : (user && user.first_name ? `@${user.first_name.toLowerCase()}${user.last_name ? user.last_name.toLowerCase() : ''}` : 'Sign in to your account')}
                </div>
              </div>
            </Link>
          </div>

          {/* Navigation */}
          <div style={{ flex: 1, paddingTop: '8px' }}>
            {/* Main Navigation - Desktop only */}
            {isDesktop && (
              <div style={{ marginBottom: '24px' }}>
                <div style={{
                  padding: '8px 20px',
                  fontSize: '12px',
                  fontWeight: '600',
                  color: '#6b7280',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}>
                  Explore
                </div>
                {mainNavigation.map((item) => {
                  const Icon = item.icon
                  const active = isActive(item.href) || (location.pathname === '/' && item.href === '/jobs')
                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        padding: '12px 20px',
                        textDecoration: 'none',
                        color: active ? '#16a34a' : '#1a1a1a',
                        fontSize: '16px',
                        fontWeight: active ? '600' : '400',
                        transition: 'background-color 0.2s ease-in-out',
                        backgroundColor: active ? 'rgba(22, 163, 74, 0.1)' : 'transparent'
                      }}
                      onMouseEnter={(e) => {
                        if (!active) {
                          e.target.style.backgroundColor = 'rgba(0, 0, 0, 0.05)'
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!active) {
                          e.target.style.backgroundColor = 'transparent'
                        } else {
                          e.target.style.backgroundColor = 'rgba(22, 163, 74, 0.1)'
                        }
                      }}
                    >
                      <Icon size={20} color={active ? '#16a34a' : '#6b7280'} style={{ marginRight: '12px' }} />
                      {item.name}
                    </Link>
                  )
                })}
              </div>
            )}

            {/* User Navigation */}
            <div>
              <div style={{
                padding: '8px 20px',
                fontSize: '12px',
                fontWeight: '600',
                color: '#6b7280',
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}>
                {isDesktop ? 'Personal' : 'Menu'}
              </div>
              {userNavigation.map((item) => {
                const Icon = item.icon
                const active = isActive(item.href)
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      padding: isDesktop ? '12px 20px' : '16px 20px',
                      textDecoration: 'none',
                      color: active ? '#16a34a' : '#1a1a1a',
                      fontSize: isDesktop ? '16px' : '18px',
                      fontWeight: active ? '600' : '400',
                      transition: 'background-color 0.2s ease-in-out',
                      backgroundColor: active ? 'rgba(22, 163, 74, 0.1)' : 'transparent'
                    }}
                    onClick={() => !isDesktop && setSidebarOpen(false)}
                    onMouseEnter={(e) => {
                      if (!active) {
                        e.target.style.backgroundColor = 'rgba(0, 0, 0, 0.05)'
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!active) {
                        e.target.style.backgroundColor = 'transparent'
                      } else {
                        e.target.style.backgroundColor = 'rgba(22, 163, 74, 0.1)'
                      }
                    }}
                  >
                    <Icon size={isDesktop ? 20 : 24} color={active ? '#16a34a' : '#6b7280'} style={{ marginRight: isDesktop ? '12px' : '16px' }} />
                    {item.name}
                  </Link>
                )
              })}
            </div>
          </div>

          {/* Logout button */}
          {isAuthenticated && (
            <div style={{ padding: '12px', borderTop: '1px solid #e5e7eb', marginTop: 'auto' }}>
              <button
                onClick={() => {
                  logout()
                  if (!isDesktop) setSidebarOpen(false)
                  navigate('/login')
                }}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  padding: '10px 12px',
                  backgroundColor: 'white',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  color: '#ef4444',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                Logout
              </button>
            </div>
          )}
          
        </div>
      </div>
    </>
  )
}

export default Sidebar