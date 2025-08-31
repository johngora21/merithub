import React, { useState } from 'react'
import { useResponsive } from '../hooks/useResponsive'

import { 
  Bookmark, 
  Briefcase, 
  GraduationCap, 
  FileText, 
  BookOpen,
  MapPin,
  Clock,
  DollarSign,
  Eye,
  ExternalLink,
  Trash2,
  Filter,
  Star
} from 'lucide-react'

const Bookmarks = () => {
  const screenSize = useResponsive()
  const [selectedFilter, setSelectedFilter] = useState('all')
  const [bookmarks, setBookmarks] = useState([
    {
      id: 1,
      type: 'job',
      title: 'Senior Software Engineer',
      company: 'TechCorp Inc.',
      location: 'San Francisco, CA',
      salary: '$120K - $180K',
      posted: '2 days ago',
      saved: '1 day ago',
      description: 'We are looking for a senior software engineer to join our team...',
      featured: true
    },
    {
      id: 2,
      type: 'job',
      title: 'Full Stack Developer',
      company: 'StartupFlow',
      location: 'Remote',
      salary: '$90K - $130K',
      posted: '5 days ago',
      saved: '3 days ago',
      description: 'Join our fast-growing startup as a full stack developer...',
      featured: false
    },
    {
      id: 3,
      type: 'opportunity',
      title: 'Google Summer of Code 2024',
      organization: 'Google',
      location: 'Remote',
      deadline: 'April 15, 2024',
      saved: '1 week ago',
      description: 'Contribute to open source projects with Google mentorship...',
      featured: true
    },
    {
      id: 4,
      type: 'tender',
      title: 'City Infrastructure Development',
      organization: 'City of San Francisco',
      value: '$2.5M - $5.2M',
      deadline: 'March 20, 2024',
      saved: '5 days ago',
      description: 'Major infrastructure project for city modernization...',
      featured: false
    },
    {
      id: 5,
      type: 'course',
      title: 'Advanced React Development',
      provider: 'TechLearn Academy',
      duration: '8 weeks',
      price: '$299',
      saved: '2 days ago',
      description: 'Master advanced React concepts including hooks, context...',
      featured: true
    },
    {
      id: 6,
      type: 'job',
      title: 'Data Scientist',
      company: 'DataFlow Analytics',
      location: 'New York, NY',
      salary: '$130K - $200K',
      posted: '1 week ago',
      saved: '4 days ago',
      description: 'Lead data science initiatives and machine learning projects...',
      featured: false
    }
  ])

  const filters = [
    { id: 'all', name: 'All', count: bookmarks.length, icon: Bookmark },
    { id: 'job', name: 'Jobs', count: bookmarks.filter(b => b.type === 'job').length, icon: Briefcase },
    { id: 'opportunity', name: 'Opportunities', count: bookmarks.filter(b => b.type === 'opportunity').length, icon: GraduationCap },
    { id: 'tender', name: 'Tenders', count: bookmarks.filter(b => b.type === 'tender').length, icon: FileText },
    { id: 'course', name: 'Courses', count: bookmarks.filter(b => b.type === 'course').length, icon: BookOpen }
  ]

  const filteredBookmarks = bookmarks.filter(bookmark => {
    if (selectedFilter === 'all') return true
    return bookmark.type === selectedFilter
  })

  const removeBookmark = (id) => {
    setBookmarks(prev => prev.filter(bookmark => bookmark.id !== id))
  }

  const getTypeColor = (type) => {
    switch (type) {
      case 'job': return '#16a34a'
      case 'opportunity': return '#3b82f6'
      case 'tender': return '#dc2626'
      case 'course': return '#7c3aed'
      default: return '#64748b'
    }
  }

  const getTypeIcon = (type) => {
    switch (type) {
      case 'job': return Briefcase
      case 'opportunity': return GraduationCap
      case 'tender': return FileText
      case 'course': return BookOpen
      default: return Bookmark
    }
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
          Bookmarks
        </h1>
        
        <div style={{
          fontSize: '12px',
          color: '#64748b',
          display: 'flex',
          alignItems: 'center',
          gap: '6px'
        }}>
          <Bookmark size={12} />
          {bookmarks.length} saved items
        </div>
      </div>

      {/* Filters */}
      <div style={{
        display: 'flex',
        gap: '8px',
        marginBottom: '20px',
        overflowX: 'auto',
        whiteSpace: 'nowrap'
      }}>
        {filters.map(filter => {
          const Icon = filter.icon
          return (
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
              <Icon size={12} />
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
          )
        })}
      </div>

      {/* Bookmarks Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: screenSize.isMobile ? '1fr' : screenSize.isTablet ? '1fr 1fr' : '1fr 1fr 1fr',
        gap: screenSize.isMobile ? '12px' : screenSize.isTablet ? '16px' : '20px'
      }}>
        {filteredBookmarks.length === 0 ? (
          <div style={{
            gridColumn: '1 / -1',
            backgroundColor: 'white',
            borderRadius: '12px',
            padding: '40px 20px',
            textAlign: 'center',
            border: '1px solid #f0f0f0'
          }}>
            <Bookmark size={48} color="#d1d5db" style={{ margin: '0 auto 16px' }} />
            <h3 style={{
              fontSize: '14px',
              fontWeight: '600',
              color: '#6b7280',
              margin: '0 0 8px 0'
            }}>
              No bookmarks yet
            </h3>
            <p style={{
              fontSize: '12px',
              color: '#9ca3af',
              margin: 0
            }}>
              Start saving jobs, opportunities, and courses to access them here.
            </p>
          </div>
        ) : (
          filteredBookmarks.map(bookmark => {
            const TypeIcon = getTypeIcon(bookmark.type)
            const typeColor = getTypeColor(bookmark.type)
            
            return (
              <div
                key={bookmark.id}
                style={{
                  backgroundColor: 'white',
                  borderRadius: '12px',
                  padding: '16px 12px',
                  border: '1px solid #f0f0f0',
                  position: 'relative',
                  transition: 'all 0.2s ease-in-out'
                }}
              >
                {/* Featured badge */}
                {bookmark.featured && (
                  <div style={{
                    position: 'absolute',
                    top: '12px',
                    right: '12px',
                    backgroundColor: '#fef3c7',
                    color: '#d97706',
                    borderRadius: '6px',
                    padding: '2px 6px',
                    fontSize: '10px',
                    fontWeight: '600',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '3px'
                  }}>
                    <Star size={8} fill="currentColor" />
                    Featured
                  </div>
                )}

                {/* Header */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  marginBottom: '12px'
                }}>
                  <div style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '16px',
                    backgroundColor: `${typeColor}15`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <TypeIcon size={16} color={typeColor} />
                  </div>
                  
                  <div style={{ flex: 1 }}>
                    <h3 style={{
                      fontSize: '14px',
                      fontWeight: '600',
                      color: '#1a1a1a',
                      margin: '0 0 2px 0'
                    }}>
                      {bookmark.title}
                    </h3>
                    
                    <p style={{
                      fontSize: '11px',
                      color: '#64748b',
                      margin: 0
                    }}>
                      {bookmark.company || bookmark.organization || bookmark.provider}
                    </p>
                  </div>
                </div>

                {/* Content */}
                <p style={{
                  fontSize: '12px',
                  color: '#374151',
                  margin: '0 0 12px 0',
                  lineHeight: '1.4',
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden'
                }}>
                  {bookmark.description}
                </p>

                {/* Meta info */}
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '6px',
                  marginBottom: '12px'
                }}>
                  {bookmark.location && (
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      fontSize: '11px',
                      color: '#64748b'
                    }}>
                      <MapPin size={10} />
                      {bookmark.location}
                    </div>
                  )}
                  
                  {bookmark.salary && (
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      fontSize: '11px',
                      color: '#16a34a',
                      fontWeight: '500'
                    }}>
                      <DollarSign size={10} />
                      {bookmark.salary}
                    </div>
                  )}
                  
                  {bookmark.value && (
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      fontSize: '11px',
                      color: '#16a34a',
                      fontWeight: '500'
                    }}>
                      <DollarSign size={10} />
                      {bookmark.value}
                    </div>
                  )}
                  
                  {bookmark.price && (
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      fontSize: '11px',
                      color: '#16a34a',
                      fontWeight: '500'
                    }}>
                      <DollarSign size={10} />
                      {bookmark.price}
                    </div>
                  )}
                  
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    fontSize: '11px',
                    color: '#64748b'
                  }}>
                    <Clock size={10} />
                    Saved {bookmark.saved}
                  </div>
                </div>

                {/* Actions */}
                <div style={{
                  display: 'flex',
                  gap: '6px'
                }}>
                  <button
                    style={{
                      flex: 1,
                      backgroundColor: '#16a34a',
                      color: 'white',
                      border: 'none',
                      borderRadius: '6px',
                      padding: '8px 12px',
                      fontSize: '11px',
                      fontWeight: '500',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '4px'
                    }}
                  >
                    <Eye size={10} />
                    View Details
                  </button>
                  
                  <button
                    onClick={() => removeBookmark(bookmark.id)}
                    style={{
                      backgroundColor: 'white',
                      color: '#64748b',
                      border: '1px solid #e2e8f0',
                      borderRadius: '6px',
                      padding: '8px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                    title="Remove bookmark"
                  >
                    <Trash2 size={10} />
                  </button>
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}

export default Bookmarks
