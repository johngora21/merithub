import { Link, useLocation, useNavigate } from 'react-router-dom'
import { 
  Briefcase, 
  GraduationCap, 
  Gavel, 
  BookOpen
} from 'lucide-react'
import { useResponsive } from '../hooks/useResponsive'

const BottomNavbar = () => {
  const screenSize = useResponsive()
  const location = useLocation()
  const navigate = useNavigate()

  const navigation = [
    { name: 'Jobs', href: '/jobs', icon: Briefcase },
    { name: 'Opportunities', href: '/opportunities', icon: GraduationCap },
    { name: 'Tenders', href: '/tenders', icon: Gavel },
    { name: 'Courses', href: '/courses', icon: BookOpen },
  ]

  const isActive = (path) => {
    // Handle default route "/" mapping to "/jobs"
    const currentPath = location.pathname === '/' ? '/jobs' : location.pathname
    return currentPath === path
  }



  // Only show on mobile devices
  if (!screenSize.isMobile) {
    return null
  }

  return (
    <nav style={{
      position: 'fixed',
      bottom: 0,
      left: 0,
      right: 0,
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      borderTop: '1px solid rgba(229, 231, 235, 0.3)',
      paddingBottom: '5px',
      paddingTop: '5px',
      height: '70px',
      backdropFilter: 'blur(10px)',
      zIndex: 50,
      display: 'flex',
      justifyContent: 'space-around',
      alignItems: 'center'
    }}>
      {navigation.map((item) => {
        const Icon = item.icon
        const active = isActive(item.href)
        
        return (
          <Link
            key={item.name}
            to={item.href}
            onClick={(e) => {
              e.preventDefault()
              const currentPath = location.pathname === '/' ? '/jobs' : location.pathname
              const targetPath = item.href
              
              if (currentPath === targetPath) {
                // Same page - jump to top instantly
                window.scrollTo(0, 0)
              } else {
                // Different page - navigate using React Router
                navigate(item.href)
                // Scroll to top after navigation
                setTimeout(() => {
                  window.scrollTo({ top: 0, behavior: 'smooth' })
                }, 100)
              }
            }}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              padding: '8px 12px',
              textDecoration: 'none',
              color: active ? '#16a34a' : '#6b7280',
              fontSize: '12px',
              fontWeight: '500',
              transition: 'color 0.2s ease-in-out'
            }}
          >
            <Icon 
              size={24} 
              color={active ? '#16a34a' : '#6b7280'} 
            />
          </Link>
        )
      })}
    </nav>
  )
}

export default BottomNavbar
