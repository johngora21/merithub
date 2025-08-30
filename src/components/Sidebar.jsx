import { Link, useLocation } from 'react-router-dom'
import { 
  Wrench,
  FileText,
  GraduationCap,
  CreditCard
} from 'lucide-react'

const Sidebar = ({ sidebarOpen, setSidebarOpen }) => {
  const location = useLocation()

  const navigation = [
    { name: 'Career Tools', href: '/career-tools', icon: Wrench },
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
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-gray-600 bg-opacity-75 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '85%',
        maxWidth: '300px',
        height: '100%',
        backgroundColor: 'white',
        transform: sidebarOpen ? 'translateX(0)' : 'translateX(-100%)',
        transition: 'transform 0.3s ease-in-out',
        zIndex: 60
      }} className="lg:translate-x-0 lg:static lg:inset-0 lg:w-64">
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
          
          {/* Profile Section */}
          <div style={{
            padding: '20px',
            borderBottom: '1px solid #e5e7eb'
          }}>
            <Link
              to="/profile"
              onClick={() => setSidebarOpen(false)}
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
                backgroundColor: '#16a34a',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                marginRight: '12px'
              }}>
                <span style={{
                  fontSize: '20px',
                  fontWeight: '600',
                  color: 'white'
                }}>
                  U
                </span>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{
                  fontSize: '16px',
                  fontWeight: '600',
                  color: '#1a1a1a',
                  marginBottom: '2px'
                }}>
                  User Name
                </div>
                <div style={{
                  fontSize: '14px',
                  color: '#6b7280'
                }}>
                  @username
                </div>
              </div>
            </Link>
          </div>

          {/* Navigation */}
          <div style={{ flex: 1, paddingTop: '8px' }}>
            {navigation.map((item) => {
              const Icon = item.icon
              const active = isActive(item.href)
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    padding: '16px 20px',
                    textDecoration: 'none',
                    color: active ? '#16a34a' : '#1a1a1a',
                    fontSize: '18px',
                    fontWeight: active ? '600' : '400',
                    transition: 'background-color 0.2s ease-in-out',
                    backgroundColor: active ? 'rgba(22, 163, 74, 0.1)' : 'transparent'
                  }}
                  onClick={() => setSidebarOpen(false)}
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
                  <Icon size={24} color={active ? '#16a34a' : '#6b7280'} style={{ marginRight: '16px' }} />
                  {item.name}
                </Link>
              )
            })}
          </div>


        </div>
      </div>
    </>
  )
}

export default Sidebar
