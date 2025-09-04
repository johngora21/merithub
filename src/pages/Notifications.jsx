import React, { useState } from 'react'
import { useResponsive } from '../hooks/useResponsive'

import { 
  Bell, 
  Briefcase, 
  GraduationCap, 
  FileText, 
  User, 
  Clock, 
  Check,
  Trash2,
  Filter
} from 'lucide-react'

const Notifications = () => {
  const screenSize = useResponsive()
  const [selectedFilter, setSelectedFilter] = useState('all')
  const [notifications, setNotifications] = useState([])

  const filters = [
    { id: 'all', name: 'All', count: notifications.length },
    { id: 'unread', name: 'Unread', count: notifications.filter(n => !n.read).length },
    { id: 'job', name: 'Jobs', count: notifications.filter(n => n.type === 'job').length },
    { id: 'application', name: 'Applications', count: notifications.filter(n => n.type === 'application').length },
    { id: 'tender', name: 'Tenders', count: notifications.filter(n => n.type === 'tender').length },
    { id: 'course', name: 'Courses', count: notifications.filter(n => n.type === 'course').length }
  ]

  const filteredNotifications = notifications.filter(notification => {
    if (selectedFilter === 'all') return true
    if (selectedFilter === 'unread') return !notification.read
    return notification.type === selectedFilter
  })

  const markAsRead = (id) => {
    setNotifications(prev => prev.map(notification => 
      notification.id === id ? { ...notification, read: true } : notification
    ))
  }

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(notification => ({ ...notification, read: true })))
  }

  const deleteNotification = (id) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id))
  }

  return (
    <div style={{
      maxWidth: '1200px',
      margin: '0 auto',
      padding: screenSize.isMobile ? '16px 12px 90px 12px' : '20px'
    }}>

      {/* Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '24px'
      }}>
        <h1 style={{
          fontSize: '16px',
          fontWeight: '600',
          color: '#1a1a1a',
          margin: 0
        }}>
          Notifications
        </h1>
        
        <button
          onClick={markAllAsRead}
          style={{
            backgroundColor: '#16a34a',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            padding: '8px 12px',
            fontSize: '12px',
            fontWeight: '500',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}
        >
          <Check size={12} />
          Mark All Read
        </button>
      </div>

      {/* Filters */}
      <div style={{
        display: 'flex',
        gap: '8px',
        marginBottom: '20px',
        overflowX: 'auto',
        whiteSpace: 'nowrap'
      }}>
        {filters.map(filter => (
          <button
            key={filter.id}
            onClick={() => setSelectedFilter(filter.id)}
            style={{
              backgroundColor: selectedFilter === filter.id ? '#16a34a' : 'white',
              color: selectedFilter === filter.id ? 'white' : '#64748b',
              border: '1px solid #e2e8f0',
              borderRadius: '8px',
              padding: '8px 12px',
              fontSize: '12px',
              fontWeight: '500',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              whiteSpace: 'nowrap'
            }}
          >
            {filter.name}
            <span style={{
              backgroundColor: selectedFilter === filter.id ? 'rgba(255,255,255,0.2)' : '#f1f5f9',
              color: selectedFilter === filter.id ? 'white' : '#64748b',
              borderRadius: '12px',
              padding: '2px 6px',
              fontSize: '11px',
              fontWeight: '600'
            }}>
              {filter.count}
            </span>
          </button>
        ))}
      </div>

      {/* Notifications List */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '12px'
      }}>
        {filteredNotifications.length === 0 ? (
          <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            padding: '40px 20px',
            textAlign: 'center',
            border: '1px solid #f0f0f0'
          }}>
            <Bell size={48} color="#d1d5db" style={{ margin: '0 auto 16px' }} />
            <h3 style={{
              fontSize: '14px',
              fontWeight: '600',
              color: '#6b7280',
              margin: '0 0 8px 0'
            }}>
              No notifications
            </h3>
            <p style={{
              fontSize: '12px',
              color: '#9ca3af',
              margin: 0
            }}>
              You're all caught up! Check back later for updates.
            </p>
          </div>
        ) : (
          filteredNotifications.map(notification => {
            const Icon = notification.icon
            return (
              <div
                key={notification.id}
                style={{
                  backgroundColor: 'white',
                  borderRadius: '12px',
                  padding: '16px 12px',
                  border: '1px solid #f0f0f0',
                  position: 'relative',
                  opacity: notification.read ? 0.7 : 1,
                  transition: 'all 0.2s ease-in-out'
                }}
              >
                {/* Unread indicator */}
                {!notification.read && (
                  <div style={{
                    position: 'absolute',
                    top: '12px',
                    right: '12px',
                    width: '8px',
                    height: '8px',
                    backgroundColor: '#16a34a',
                    borderRadius: '4px'
                  }} />
                )}

                <div style={{
                  display: 'flex',
                  gap: '12px',
                  alignItems: 'flex-start'
                }}>
                  {/* Icon */}
                  <div style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '20px',
                    backgroundColor: `${notification.color}15`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}>
                    <Icon size={20} color={notification.color} />
                  </div>

                  {/* Content */}
                  <div style={{ flex: 1 }}>
                    <h3 style={{
                      fontSize: '14px',
                      fontWeight: '600',
                      color: '#1a1a1a',
                      margin: '0 0 4px 0'
                    }}>
                      {notification.title}
                    </h3>
                    
                    <p style={{
                      fontSize: '13px',
                      color: '#374151',
                      margin: '0 0 8px 0',
                      lineHeight: '1.4'
                    }}>
                      {notification.message}
                    </p>

                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      fontSize: '11px',
                      color: '#64748b'
                    }}>
                      <Clock size={10} />
                      {notification.time}
                    </div>
                  </div>

                  {/* Actions */}
                  <div style={{
                    display: 'flex',
                    gap: '8px'
                  }}>
                    {!notification.read && (
                      <button
                        onClick={() => markAsRead(notification.id)}
                        style={{
                          backgroundColor: 'transparent',
                          border: '1px solid #e2e8f0',
                          borderRadius: '6px',
                          padding: '6px',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                        title="Mark as read"
                      >
                        <Check size={12} color="#64748b" />
                      </button>
                    )}
                    
                    <button
                      onClick={() => deleteNotification(notification.id)}
                      style={{
                        backgroundColor: 'transparent',
                        border: '1px solid #e2e8f0',
                        borderRadius: '6px',
                        padding: '6px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                      title="Delete notification"
                    >
                      <Trash2 size={12} color="#64748b" />
                    </button>
                  </div>
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}

export default Notifications