import { Bell, User, Bookmark, ArrowLeft, Plus } from 'lucide-react'
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

  const handleCreateClick = () => {
    navigate('/post')
  }

  return (
    <header style={{
      position: 'relative',
      height: isDesktop ? '100px' : '70px',
      backgroundColor: 'transparent',
      display: 'flex',
      alignItems: 'center',
      paddingLeft: isDesktop ? '32px' : '16px',
      paddingRight: isDesktop ? '32px' : '16px',
      justifyContent: isDesktop ? 'space-between' : 'space-between',
      marginTop: isDesktop ? '16px' : '12px',
      marginBottom: '8px'
    }}>
      {/* Left Side - Menu Icon and Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: isDesktop ? '60px' : '80px' }}>
        {!isDesktop && (
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
        )}
        
        {/* Merit Logo - Next to menu icon */}
        <img 
          src="/assets/images/merit-logo.png" 
          alt="Merit Logo" 
          style={{
            height: isDesktop ? '100px' : '70px',
            width: 'auto',
            objectFit: 'contain'
          }}
        />
      </div>

      {/* Right Side - Create, Bookmarks and Notifications */}
      {!isSidebarRoute && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: isDesktop ? '12px' : '8px'
        }}>
          {/* Create Button */}
          <button
            onClick={handleCreateClick}
            style={{
              backgroundColor: '#16a34a',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              padding: isDesktop ? '8px 12px' : '8px 10px',
              fontSize: '12px',
              fontWeight: '600',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              transition: 'all 0.2s ease-in-out'
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = '#15803d'
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = '#16a34a'
            }}
          >
            <Plus size={16} strokeWidth={2.5} />
            Post
          </button>
          
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