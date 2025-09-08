import React, { useState, useEffect } from 'react'
import { useResponsive, getGridColumns, getGridGap } from '../hooks/useResponsive'
import { apiService, resolveAssetUrl } from '../lib/api-service'
import { countries } from '../utils/countries'

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
  Star,
  Building2,
  Shield,
  Factory,
  Calendar,
  Users
} from 'lucide-react'

const Bookmarks = () => {
  const screenSize = useResponsive()
  const [selectedFilter, setSelectedFilter] = useState('all')
  const [bookmarks, setBookmarks] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchBookmarks()
  }, [])

  const transformBookmarkData = (apiBookmark) => {
    const baseData = {
      id: apiBookmark.id,
      saved: apiBookmark.created_at ? new Date(apiBookmark.created_at).toLocaleDateString() : 'Recently',
      featured: apiBookmark.is_featured || false
    }

    // Convert country code to full country name
    const getCountryName = (countryCode) => {
      if (!countryCode) return 'Not specified'
      const country = countries.find(c => c.code === countryCode)
      return country ? country.name : countryCode
    }

    // Format deadline
    const formatDeadline = (deadline) => {
      if (!deadline) return 'Not specified'
      try {
        return new Date(deadline).toLocaleDateString()
      } catch {
        return deadline
      }
    }

    if (apiBookmark.job) {
      const j = apiBookmark.job
      const min = j?.salary_min != null ? Number(j.salary_min) : undefined
      const max = j?.salary_max != null ? Number(j.salary_max) : undefined
      const fmt = (n) => typeof n === 'number' && !Number.isNaN(n) ? n.toLocaleString() : ''
      let salary
      if (min != null && max != null) {
        salary = min === max
          ? `${j.currency} ${fmt(min)}`
          : `${j.currency} ${fmt(min)} - ${j.currency} ${fmt(max)}`
      } else if (min != null) {
        salary = `${j.currency} ${fmt(min)}`
      } else if (max != null) {
        salary = `${j.currency} ${fmt(max)}`
      } else {
        salary = 'Salary not specified'
      }

      return {
        ...baseData,
        type: 'job',
        title: j.title,
        company: j.company,
        industry: j.industry || 'Not specified',
        location: j.location,
        country: getCountryName(j.country),
        salary,
        type: j.job_type ? j.job_type.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join('-') : 'Not specified',
        experience: j.experience_level ? j.experience_level.charAt(0).toUpperCase() + j.experience_level.slice(1) + ' level' : 'Not specified',
        skills: j.skills || [],
        tags: j.tags || [],
        description: j.description,
        benefits: j.benefits || [],
        posted: j.created_at ? new Date(j.created_at).toLocaleDateString() : 'Recently',
        isRemote: j.work_type === 'remote',
        urgentHiring: j.is_urgent || false,
        price: j.price || null,
        postedBy: j.posted_by || 'platform',
        externalUrl: j.external_url,
        contactEmail: j.contact_email,
        applicationDeadline: j.application_deadline,
        deadline: formatDeadline(j.application_deadline),
        isFeatured: j.is_featured || false,
        status: j.status || 'active',
        applicants: j.applicants || 0,
        logo: j.company_logo ? resolveAssetUrl(j.company_logo) : null
      }
    } else if (apiBookmark.opportunity) {
      const o = apiBookmark.opportunity
      return {
        ...baseData,
        type: 'opportunity',
        title: o.title,
        company: o.organization,
        industry: o.category || 'Not specified',
        location: o.location || 'Not specified',
        country: getCountryName(o.country),
        salary: o.amount_min 
          ? `${o.currency} ${o.amount_min}`
          : 'Not specified',
        type: o.type || 'Not specified',
        experience: o.experience_level || 'Not specified',
        skills: o.skills || [],
        tags: o.tags || [],
        description: o.description,
        benefits: o.benefits || [],
        posted: o.created_at ? new Date(o.created_at).toLocaleDateString() : 'Recently',
        urgentHiring: o.is_urgent || false,
        price: o.price || null,
        postedBy: o.posted_by || 'platform',
        externalUrl: o.external_url,
        contactEmail: o.contact_email,
        applicationDeadline: o.deadline,
        deadline: formatDeadline(o.deadline),
        isFeatured: o.is_featured || false,
        status: o.status || 'active',
        applicants: o.applicants || 0,
        logo: o.organization_logo ? resolveAssetUrl(o.organization_logo) : null
      }
    } else if (apiBookmark.tender) {
      const t = apiBookmark.tender
      return {
        ...baseData,
        type: 'tender',
        title: t.title,
        company: t.organization,
        industry: t.sector || 'Not specified',
        location: t.location,
        country: getCountryName(t.country),
        salary: t.contract_value_min 
          ? `${t.currency} ${(t.contract_value_min / 1000000).toFixed(1)}M`
          : 'Not specified',
        type: t.type || 'Not specified',
        experience: t.experience_level || 'Not specified',
        skills: t.skills || [],
        tags: t.tags || [],
        description: t.description,
        benefits: t.benefits || [],
        posted: t.created_at ? new Date(t.created_at).toLocaleDateString() : 'Recently',
        urgentHiring: t.is_urgent || false,
        price: t.price || null,
        postedBy: t.posted_by || 'platform',
        externalUrl: t.external_url,
        contactEmail: t.contact_email,
        applicationDeadline: t.deadline,
        deadline: formatDeadline(t.deadline),
        isFeatured: t.is_featured || false,
        status: t.status || 'active',
        applicants: t.applicants || 0,
        logo: t.organization_logo ? resolveAssetUrl(t.organization_logo) : null
      }
    } else if (apiBookmark.course) {
      const c = apiBookmark.course
      return {
        ...baseData,
        type: 'course',
        title: c.title,
        company: c.instructor || c.author || 'Unknown',
        industry: c.category || 'Not specified',
        location: 'Online',
        country: 'Not specified',
        salary: c.is_pro ? 'Pro Content' : 'Free',
        type: c.type || 'Not specified',
        experience: c.experience_level || 'Not specified',
        skills: c.skills || [],
        tags: c.tags || [],
        description: c.description,
        benefits: c.benefits || [],
        posted: c.created_at ? new Date(c.created_at).toLocaleDateString() : 'Recently',
        urgentHiring: c.is_urgent || false,
        price: c.price || null,
        postedBy: c.posted_by || 'platform',
        externalUrl: c.external_url,
        contactEmail: c.contact_email,
        applicationDeadline: c.deadline,
        deadline: formatDeadline(c.deadline),
        isFeatured: c.is_featured || false,
        status: c.status || 'active',
        applicants: c.applicants || 0,
        logo: c.instructor_logo ? resolveAssetUrl(c.instructor_logo) : null
      }
    }

    return baseData
  }

  const fetchBookmarks = async () => {
    try {
      setLoading(true)
      const response = await apiService.get('/saved-items')
      const transformedBookmarks = (response.data.items || []).map(transformBookmarkData)
      setBookmarks(transformedBookmarks)
    } catch (error) {
      console.error('Error fetching bookmarks:', error)
      // Keep existing static data as fallback
    } finally {
      setLoading(false)
    }
  }

  // Static bookmarks data as fallback
  const staticBookmarks = []

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
    <div style={{ backgroundColor: '#f8f9fa' }}>
      <div style={{ padding: '16px 12px 90px 12px' }}>

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
        gridTemplateColumns: `repeat(${getGridColumns(screenSize)}, 1fr)`,
        gap: getGridGap(screenSize)
      }}>
        {(() => {
          const currentBookmarks = bookmarks.length > 0 ? bookmarks : staticBookmarks
          const filteredBookmarks = selectedFilter === 'all' 
            ? currentBookmarks 
            : currentBookmarks.filter(bookmark => bookmark.type === selectedFilter)
          
          return filteredBookmarks.length === 0 ? (
            <div style={{
              gridColumn: '1 / -1',
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
                🔍
              </div>
              <h3 style={{
                fontSize: '18px',
                fontWeight: '600',
                color: '#1a1a1a',
                margin: '0 0 8px 0'
              }}>
                No bookmarks found
              </h3>
              <p style={{
                fontSize: '14px',
                color: '#64748b',
                margin: 0
              }}>
                Start saving jobs, opportunities, and courses to access them here
              </p>
            </div>
          ) : (
            filteredBookmarks.map((bookmark) => {
              return (
                <div key={bookmark.id} style={{
                  backgroundColor: 'white',
                  borderRadius: '12px',
                  padding: '16px 12px',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                  border: '1px solid #f0f0f0',
                  position: 'relative',
                  transition: 'all 0.2s ease-in-out',
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)'
                  e.currentTarget.style.transform = 'translateY(-2px)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.05)'
                  e.currentTarget.style.transform = 'translateY(0)'
                }}>
                  
                  {/* PRO Badge and Remove Button - Top Right */}
                  <div style={{
                    position: 'absolute',
                    top: '12px',
                    right: '12px',
                    zIndex: 10,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}>
                    {bookmark.postedBy === 'platform' && (
                      <span style={{
                        fontSize: '10px',
                        color: 'white',
                        backgroundColor: '#3b82f6',
                        padding: '4px 8px',
                        borderRadius: '6px',
                        fontWeight: '600',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                      }}>
                        PRO
                      </span>
                    )}
                    
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        removeBookmark(bookmark.id)
                      }}
                      style={{
                        background: '#f8f9fa',
                        border: '1px solid #e2e8f0',
                        padding: '6px',
                        cursor: 'pointer',
                        borderRadius: '6px',
                        transition: 'all 0.2s ease-in-out'
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.backgroundColor = '#f1f5f9'
                        e.target.style.transform = 'translateY(-1px)'
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.backgroundColor = '#f8f9fa'
                        e.target.style.transform = 'translateY(0)'
                      }}
                    >
                      <Trash2 
                        size={16} 
                        color="#dc2626"
                      />
                    </button>
                  </div>

                  {/* Company Profile Header */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    justifyContent: 'space-between',
                    marginBottom: '10px'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1 }}>
                      {bookmark.logo && bookmark.logo.trim() !== '' ? (
                        <img 
                          src={bookmark.logo} 
                          alt={bookmark.company}
                          style={{
                            width: '44px',
                            height: '44px',
                            borderRadius: '22px',
                            objectFit: 'cover',
                            border: '2px solid #f8f9fa'
                          }}
                        />
                      ) : (
                        <div style={{
                          width: '44px',
                          height: '44px',
                          borderRadius: '22px',
                          backgroundColor: '#f8f9fa',
                          border: '2px solid #e2e8f0',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '16px',
                          fontWeight: '600',
                          color: '#64748b'
                        }}>
                          {bookmark.company ? bookmark.company.charAt(0).toUpperCase() : '?'}
                        </div>
                      )}
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <h3 style={{
                          fontSize: '14px',
                          fontWeight: '600',
                          color: '#1a1a1a',
                          margin: '0 0 1px 0',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap'
                        }}>
                          {bookmark.company}
                        </h3>
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px'
                        }}>
                          <span style={{
                            fontSize: '12px',
                            fontWeight: '500',
                            color: '#64748b'
                          }}>
                            {bookmark.industry || 'Not specified'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Job Title */}
                  <h2 style={{
                    fontSize: '16px',
                    fontWeight: '600',
                    color: '#1a1a1a',
                    margin: '0 0 8px 0',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}>
                    {bookmark.title}
                    {bookmark.urgentHiring && (
                      <Star size={14} color="#2563eb" fill="#2563eb" />
                    )}
                  </h2>

                  {/* Quick Info: two columns (pairs) */}
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '8px 12px',
                    marginBottom: '10px',
                    fontSize: '12px',
                    color: '#64748b'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <MapPin size={12} />
                      <span style={{ color: '#0f172a' }}>{bookmark.location}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{ color: '#0f172a' }}>{bookmark.country || '-'}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <DollarSign size={12} color="#16a34a" />
                      <span style={{ color: '#16a34a', fontWeight: 600 }}>{bookmark.salary || 'Not specified'}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Briefcase size={12} />
                      <span style={{ color: '#0f172a' }}>{bookmark.type || 'Not specified'}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Calendar size={12} />
                      <span style={{ color: '#dc2626', fontWeight: 600 }}>{bookmark.deadline || 'Not specified'}</span>
                    </div>
                  </div>

                  {/* Tags */}
                  {bookmark.tags && bookmark.tags.length > 0 && (
                    <div style={{ marginBottom: '10px' }}>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                        {bookmark.tags.slice(0, 4).map((tag, index) => (
                          <span key={index} style={{
                            backgroundColor: '#dbeafe',
                            color: '#1d4ed8',
                            padding: '2px 6px',
                            borderRadius: '4px',
                            fontSize: '11px',
                            fontWeight: '500'
                          }}>
                            {typeof tag === 'string' ? tag : tag?.name || tag?.title || 'Not specified'}
                          </span>
                        ))}
                        {bookmark.tags.length > 4 && (
                          <span style={{ color: '#64748b', fontSize: '11px', padding: '2px 6px', fontWeight: '500' }}>
                            +{bookmark.tags.length - 4} more
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Footer */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    paddingTop: '8px',
                    borderTop: '1px solid #f1f5f9'
                  }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}>
                      <span style={{
                        fontSize: '11px',
                        fontWeight: '700',
                        color: '#16a34a',
                        backgroundColor: '#dcfce7',
                        padding: '4px 8px',
                        borderRadius: '6px',
                        border: '1px solid #bbf7d0',
                        letterSpacing: '0.5px'
                      }}>
                        FREE
                      </span>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        // Handle view details or apply
                      }}
                      style={{
                        backgroundColor: '#16a34a',
                        color: 'white',
                        border: 'none',
                        padding: '8px 16px',
                        borderRadius: '6px',
                        fontSize: '12px',
                        fontWeight: '600',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease-in-out'
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.backgroundColor = '#15803d'
                        e.target.style.transform = 'translateY(-1px)'
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.backgroundColor = '#16a34a'
                        e.target.style.transform = 'translateY(0)'
                      }}
                    >
                      View Details
                    </button>
                  </div>
                  </div>
                )
              })
            )
          })()}
      </div>
      </div>
    </div>
  )
}

export default Bookmarks