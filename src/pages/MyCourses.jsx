import React, { useState } from 'react'
import { Play, Book, FileText, Calendar, Clock, Star, Download, Award, Search, Eye } from 'lucide-react'

const MyCourses = () => {
  const [activeTab, setActiveTab] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')

  const tabs = [
    { id: 'all', name: 'All', count: 8 },
    { id: 'in-progress', name: 'Active', count: 3 },
    { id: 'completed', name: 'Done', count: 4 },
    { id: 'saved', name: 'Saved', count: 1 }
  ]

  const courses = [
    {
      id: 1,
      title: 'Complete Web Development Bootcamp',
      instructor: 'Angela Yu',
      type: 'Video',
      progress: 75,
      status: 'In Progress',
      duration: '65h',
      rating: 4.8,
      certificate: true
    },
    {
      id: 2,
      title: 'Clean Code: A Handbook',
      instructor: 'Robert C. Martin',
      type: 'Book',
      progress: 100,
      status: 'Completed',
      duration: '12h read',
      rating: 5.0,
      certificate: false
    },
    {
      id: 3,
      title: 'SaaS Startup Business Plan',
      instructor: 'Tech Ventures Inc.',
      type: 'Business Plan',
      progress: 45,
      status: 'In Progress',
      duration: '3h study',
      rating: 4.5,
      certificate: false
    },
    {
      id: 4,
      title: 'React Advanced Patterns',
      instructor: 'Kent C. Dodds',
      type: 'Video',
      progress: 100,
      status: 'Completed',
      duration: '8h',
      rating: 4.9,
      certificate: true
    }
  ]

  const getTypeIcon = (type) => {
    switch (type) {
      case 'Video': return Play
      case 'Book': return Book
      case 'Business Plan': return FileText
      default: return FileText
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'In Progress': return { bg: '#dbeafe', text: '#3b82f6' }
      case 'Completed': return { bg: '#f0fdf4', text: '#16a34a' }
      case 'Saved': return { bg: '#fef3c7', text: '#f59e0b' }
      default: return { bg: '#f3f4f6', text: '#6b7280' }
    }
  }

  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         course.instructor.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesTab = activeTab === 'all' || 
                      (activeTab === 'in-progress' && course.status === 'In Progress') ||
                      (activeTab === 'completed' && course.status === 'Completed') ||
                      (activeTab === 'saved' && course.status === 'Saved')
    return matchesSearch && matchesTab
  })

  return (
    <div style={{ backgroundColor: '#f8f9fa' }}>
      <div style={{ padding: '16px 12px 90px 12px' }}>
        
        {/* Search Bar */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          marginBottom: '16px'
        }}>
          <div style={{
            flex: 1,
            position: 'relative'
          }}>
            <div style={{
              position: 'absolute',
              left: '12px',
              top: '50%',
              transform: 'translateY(-50%)',
              zIndex: 1
            }}>
              <Search size={16} color="#64748b" />
            </div>
            <input
              type="text"
              placeholder="Search courses..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                backgroundColor: 'white',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                padding: '10px 14px 10px 40px',
                fontSize: '16px',
                color: '#1a1a1a',
                outline: 'none',
                transition: 'all 0.2s ease-in-out',
                boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#16a34a'
                e.target.style.boxShadow = '0 0 0 3px rgba(22, 163, 74, 0.1)'
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#e2e8f0'
                e.target.style.boxShadow = '0 1px 3px rgba(0,0,0,0.05)'
              }}
            />
          </div>
        </div>

        {/* Tabs */}
        <div style={{
          display: 'flex',
          backgroundColor: 'white',
          borderRadius: '8px',
          padding: '4px',
          marginBottom: '16px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
          border: '1px solid #f0f0f0',
          overflowX: 'auto'
        }}>
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                flex: 1,
                padding: '8px 12px',
                background: activeTab === tab.id ? '#16a34a' : 'transparent',
                color: activeTab === tab.id ? 'white' : '#64748b',
                border: 'none',
                borderRadius: '6px',
                fontSize: '14px',
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'all 0.2s ease-in-out',
                whiteSpace: 'nowrap',
                minWidth: 'fit-content'
              }}
            >
              {tab.name} ({tab.count})
            </button>
          ))}
        </div>

        {/* Courses Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
          gap: '16px'
        }}>
          {filteredCourses.length > 0 ? (
            filteredCourses.map((course) => {
              const Icon = getTypeIcon(course.type)
              const statusColors = getStatusColor(course.status)
              
              return (
                <div key={course.id} style={{
                  backgroundColor: 'white',
                  borderRadius: '12px',
                  overflow: 'hidden',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                  border: '1px solid #f0f0f0',
                  transition: 'all 0.2s ease-in-out'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)'
                  e.currentTarget.style.transform = 'translateY(-2px)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.05)'
                  e.currentTarget.style.transform = 'translateY(0)'
                }}
                >
                  {/* Thumbnail */}
                  <div style={{ position: 'relative' }}>
                    <div style={{
                      width: '100%',
                      height: '180px',
                      backgroundColor: '#f8f9fa',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <Icon size={48} color="#9ca3af" />
                    </div>
                    
                    {/* Status Badge */}
                    <div style={{
                      position: 'absolute',
                      top: '12px',
                      left: '12px'
                    }}>
                      <span style={{
                        fontSize: '11px',
                        backgroundColor: statusColors.bg,
                        color: statusColors.text,
                        padding: '4px 8px',
                        borderRadius: '6px',
                        fontWeight: '600'
                      }}>
                        {course.status === 'In Progress' ? 'ACTIVE' : 
                         course.status === 'Completed' ? 'DONE' : course.status.toUpperCase()}
                      </span>
                    </div>

                    {/* Certificate Badge */}
                    {course.certificate && course.status === 'Completed' && (
                      <div style={{
                        position: 'absolute',
                        top: '12px',
                        right: '12px'
                      }}>
                        <span style={{
                          fontSize: '11px',
                          backgroundColor: '#16a34a',
                          color: 'white',
                          padding: '4px 8px',
                          borderRadius: '6px',
                          fontWeight: '600',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px'
                        }}>
                          <Award size={12} />
                          CERT
                        </span>
                      </div>
                    )}

                    {/* Progress Overlay */}
                    {course.status !== 'Saved' && (
                      <div style={{
                        position: 'absolute',
                        bottom: '8px',
                        left: '8px',
                        right: '8px'
                      }}>
                        <div style={{
                          backgroundColor: 'rgba(0, 0, 0, 0.8)',
                          borderRadius: '4px',
                          padding: '6px 8px'
                        }}>
                          <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            marginBottom: '4px'
                          }}>
                            <span style={{
                              fontSize: '11px',
                              color: 'white',
                              fontWeight: '500'
                            }}>
                              Progress
                            </span>
                            <span style={{
                              fontSize: '11px',
                              color: 'white',
                              fontWeight: '600'
                            }}>
                              {course.progress}%
                            </span>
                          </div>
                          <div style={{
                            width: '100%',
                            height: '3px',
                            backgroundColor: 'rgba(255, 255, 255, 0.3)',
                            borderRadius: '2px',
                            overflow: 'hidden'
                          }}>
                            <div style={{
                              width: `${course.progress}%`,
                              height: '100%',
                              backgroundColor: '#16a34a'
                            }} />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div style={{ padding: '16px' }}>
                    {/* Type and Rating */}
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: '8px'
                    }}>
                      <span style={{
                        fontSize: '11px',
                        color: '#16a34a',
                        backgroundColor: '#f0fdf4',
                        padding: '2px 6px',
                        borderRadius: '4px',
                        fontWeight: '600'
                      }}>
                        {course.type.toUpperCase()}
                      </span>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '3px'
                      }}>
                        <Star size={12} color="#f59e0b" fill="#f59e0b" />
                        <span style={{
                          fontSize: '11px',
                          color: '#64748b',
                          fontWeight: '500'
                        }}>
                          {course.rating}
                        </span>
                      </div>
                    </div>

                    <h3 style={{
                      fontSize: '16px',
                      fontWeight: '600',
                      color: '#1a1a1a',
                      margin: '0 0 4px 0',
                      lineHeight: '1.4'
                    }}>
                      {course.title}
                    </h3>

                    <p style={{
                      fontSize: '13px',
                      color: '#64748b',
                      margin: '0 0 12px 0'
                    }}>
                      by {course.instructor}
                    </p>

                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      marginBottom: '12px',
                      fontSize: '12px',
                      color: '#64748b'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                        <Clock size={12} />
                        {course.duration}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div style={{ 
                      display: 'flex', 
                      gap: '8px'
                    }}>
                      <button style={{
                        flex: 1,
                        backgroundColor: course.status === 'Saved' ? '#16a34a' : course.status === 'Completed' ? 'white' : '#16a34a',
                        color: course.status === 'Completed' ? '#64748b' : 'white',
                        border: course.status === 'Completed' ? '1px solid #e2e8f0' : 'none',
                        padding: '6px 12px',
                        borderRadius: '6px',
                        fontSize: '12px',
                        fontWeight: '600',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '4px'
                      }}>
                        {course.status === 'Saved' ? (
                          <>
                            <Play size={12} />
                            Start
                          </>
                        ) : course.status === 'Completed' ? (
                          <>
                            <Eye size={12} />
                            Review
                          </>
                        ) : (
                          <>
                            <Play size={12} />
                            Continue
                          </>
                        )}
                      </button>
                      
                      {course.certificate && course.status === 'Completed' && (
                        <button style={{
                          backgroundColor: 'white',
                          color: '#64748b',
                          border: '1px solid #e2e8f0',
                          padding: '6px 12px',
                          borderRadius: '6px',
                          fontSize: '12px',
                          fontWeight: '600',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '4px'
                        }}>
                          <Download size={12} />
                          Cert
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              )
            })
          ) : (
            <div style={{
              backgroundColor: 'white',
              borderRadius: '12px',
              padding: '40px 20px',
              textAlign: 'center',
              boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
              border: '1px solid #f0f0f0'
            }}>
              <div style={{
                fontSize: '48px',
                marginBottom: '16px'
              }}>
                📚
              </div>
              <h3 style={{
                fontSize: '16px',
                fontWeight: '600',
                color: '#1a1a1a',
                margin: '0 0 8px 0'
              }}>
                No courses found
              </h3>
              <p style={{
                fontSize: '14px',
                color: '#64748b',
                margin: 0
              }}>
                Try adjusting your search or filters
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default MyCourses