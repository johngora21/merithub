import { Bell, User, Bookmark } from 'lucide-react'

const Header = ({ setSidebarOpen }) => {
  const handleNotificationsClick = () => {
    console.log('Notifications clicked')
  }

  const handleBookmarksClick = () => {
    console.log('Bookmarks clicked')
  }

  return (
    <header style={{
      position: 'relative',
      height: '40px',
      backgroundColor: 'transparent',
      zIndex: 1000,
      display: 'flex',
      alignItems: 'center',
      paddingLeft: '16px',
      paddingRight: '16px',
      justifyContent: 'space-between',
      marginTop: '4px',
      marginBottom: '0px'
    }}>
      {/* Left Side - User Menu */}
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <button
          onClick={() => setSidebarOpen(true)}
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
          className="lg:hidden"
        >
          <User size={24} color="#262626" />
        </button>
      </div>

      {/* Right Side - Bookmarks and Notifications */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px'
      }}>
        <button
          onClick={handleBookmarksClick}
          style={{
            backgroundColor: 'transparent',
            border: 'none',
            padding: '8px',
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
            padding: '8px',
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
    </header>
  )
}

export default Header
