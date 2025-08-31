import { Bell, User, Bookmark, ArrowLeft } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const Header = ({ setSidebarOpen, isDesktop, isSidebarRoute }) => {
  const navigate = useNavigate()
  const handleNotificationsClick = () => {
    navigate('/notifications')
  }

  const handleBookmarksClick = () => {
    navigate('/bookmarks')
  }

  const handleBackClick = () => {
    navigate('/jobs') // Navigate back to main Jobs page
  }

  return (
    <header style={{
      position: 'relative',
      height: isDesktop ? '60px' : '40px',
      backgroundColor: 'transparent',
      zIndex: 1000,
      display: 'flex',
      alignItems: 'center',
      paddingLeft: isDesktop ? '32px' : '16px',
      paddingRight: isDesktop ? '32px' : '16px',
      justifyContent: isDesktop ? 'flex-end' : 'space-between',
      marginTop: isDesktop ? '8px' : '4px',
      marginBottom: '0px'
    }}>
      {/* Left Side - Back Arrow (Sidebar routes) or User Menu (Main routes on Mobile) */}
      {!isDesktop && (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <button
            onClick={isSidebarRoute ? handleBackClick : () => setSidebarOpen(true)}
            style={{
              backgroundColor: 'rgba(0, 0, 0, 0.1)',
              border: 'none',
              padding: '8px',
              borderRadius: '20px',
              width: '40px',
              height: '40px',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              cursor: 'pointer'
            }}
          >
            {isSidebarRoute ? (
              <ArrowLeft size={20} color="#262626" />
            ) : (
              <User size={24} color="#262626" />
            )}
          </button>
        </div>
      )}

      {/* Right Side - Bookmarks and Notifications (hidden on sidebar routes for clean look) */}
      {!isSidebarRoute && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: isDesktop ? '12px' : '8px'
        }}>
          <button
            onClick={handleBookmarksClick}
            style={{
              backgroundColor: 'transparent',
              border: 'none',
              padding: isDesktop ? '10px' : '8px',
              borderRadius: '8px',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              cursor: 'pointer',
              transition: 'all 0.2s ease-in-out'
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = 'rgba(0, 0, 0, 0.05)'
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = 'transparent'
            }}
          >
            <Bookmark size={22} color="#262626" />
          </button>
          
          <button
            onClick={handleNotificationsClick}
            style={{
              backgroundColor: 'transparent',
              border: 'none',
              padding: isDesktop ? '10px' : '8px',
              borderRadius: '8px',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              cursor: 'pointer',
              position: 'relative',
              transition: 'all 0.2s ease-in-out'
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = 'rgba(0, 0, 0, 0.05)'
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = 'transparent'
            }}
          >
            <Bell size={24} color="#262626" />
            <div style={{
              position: 'absolute',
              top: '4px',
              right: '4px',
              width: '6px',
              height: '6px',
              backgroundColor: '#ed4956',
              borderRadius: '3px'
            }} />
          </button>
        </div>
      )}
    </header>
  )
}

export default Header
