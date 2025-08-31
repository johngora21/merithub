import { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import Sidebar from './Sidebar'
import Header from './Header'
import BottomNavbar from './BottomNavbar'
import { useResponsive } from '../hooks/useResponsive'

const Layout = ({ children }) => {
  const screenSize = useResponsive()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const location = useLocation()

  // Define sidebar routes where bottom nav should be hidden
  const sidebarRoutes = [
    '/career-tools',
    '/tender-tools', 
    '/my-applications',
    '/my-courses',
    '/subscriptions',
    '/profile',
    '/notifications',
    '/bookmarks'
  ]

  // Check if current route is a sidebar route
  const isSidebarRoute = sidebarRoutes.includes(location.pathname)

  useEffect(() => {
    // Auto-open sidebar on desktop
    if (screenSize.isDesktop) {
      setSidebarOpen(true)
    } else {
      setSidebarOpen(false)
    }
  }, [screenSize.isDesktop])

  return (
    <div className="flex h-screen" style={{backgroundColor: '#f8f9fa'}}>
      {/* Sidebar */}
      <Sidebar 
        sidebarOpen={sidebarOpen} 
        setSidebarOpen={setSidebarOpen} 
        isDesktop={screenSize.isDesktop}
      />

      {/* Main content */}
      <div 
        className="flex-1 flex flex-col overflow-hidden transition-all duration-300"
        style={{
          marginLeft: screenSize.isDesktop && sidebarOpen ? '0' : '0'
        }}
      >
        {/* Header - Hidden when sidebar is open on mobile only */}
        {(!sidebarOpen || screenSize.isDesktop) && <Header setSidebarOpen={setSidebarOpen} isDesktop={screenSize.isDesktop} isSidebarRoute={isSidebarRoute} />}

        {/* Page content */}
        <main 
          className="flex-1 overflow-x-hidden overflow-y-auto transition-all duration-300"
          style={{
            backgroundColor: '#f8f9fa',
            padding: screenSize.isDesktop 
              ? '24px 32px 24px 32px' 
              : screenSize.isTablet
                ? '20px 20px 20px 20px'  // tablet - no bottom navbar
                : isSidebarRoute
                  ? '16px 16px 20px 16px'  // mobile sidebar route - no bottom navbar
                  : '16px 16px 80px 16px'  // mobile main route - with bottom navbar
          }}
        >
          {children}
        </main>
      </div>
      
      {/* Bottom Navigation - Mobile only, hidden on sidebar routes */}
      {!isSidebarRoute && <BottomNavbar />}
    </div>
  )
}

export default Layout
