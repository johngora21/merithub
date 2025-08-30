import { useState } from 'react'
import { useLocation } from 'react-router-dom'
import Sidebar from './Sidebar'
import Header from './Header'
import BottomNavbar from './BottomNavbar'

const Layout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const location = useLocation()

  return (
    <div className="flex h-screen" style={{backgroundColor: '#f8f9fa'}}>
      {/* Sidebar */}
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header - Hidden when sidebar is open */}
        {!sidebarOpen && <Header setSidebarOpen={setSidebarOpen} />}

        {/* Page content */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto p-4 pb-20 lg:pb-6" style={{backgroundColor: '#f8f9fa'}}>
          {children}
        </main>
      </div>
      
      {/* Bottom Navigation - Mobile only */}
      <BottomNavbar />
    </div>
  )
}

export default Layout
