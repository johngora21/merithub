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
  const [selectedFilter, setSelectedFilter] = useState('job')
  const [bookmarks, setBookmarks] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    // Test if user is logged in
    const token = localStorage.getItem('auth-token')
    if (!token) {
      console.log('No auth token found - user not logged in')
      // Still show static data for testing
      const transformedStatic = staticBookmarks.map(transformBookmarkData)
      setBookmarks(transformedStatic)
    } else {
      console.log('Auth token found, fetching bookmarks...')
    fetchBookmarks()
    }
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
        workType: j.job_type ? j.job_type.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join('-') : 'Not specified',
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
      console.log('Opportunity data:', {
        id: o.id,
        title: o.title,
        poster: o.poster,
        cover_image: o.cover_image,
        coverImage: o.coverImage,
        organization_logo: o.organization_logo
      })
      return {
        ...baseData,
        type: 'opportunity',
        title: o.title,
        organization: o.organization,
        company: o.organization,
        category: o.category || 'Not specified',
        industry: o.category || 'Not specified',
        location: o.location || 'Not specified',
        country: getCountryName(o.country),
        duration: o.duration || 'Not specified',
        salary: o.amount_min 
          ? `${o.currency} ${o.amount_min}`
          : 'Not specified',
        opportunityType: o.type || 'Not specified',
        experience: o.experience_level || 'Not specified',
        skills: o.skills || [],
        tags: o.tags || [],
        description: o.description,
        benefits: o.benefits || [],
        posted: o.created_at ? new Date(o.created_at).toLocaleDateString() : 'Recently',
        urgentHiring: o.is_urgent || false,
        price: o.price || 'Free',
        postedBy: o.posted_by || 'platform',
        externalUrl: o.external_url,
        contactEmail: o.contact_email,
        applicationDeadline: o.deadline,
        deadline: formatDeadline(o.deadline),
        isFeatured: o.is_featured || false,
        status: o.status || 'active',
        applicants: o.applicants || 0,
        logo: o.organization_logo ? resolveAssetUrl(o.organization_logo) : null,
        poster: o.poster || o.cover_image || o.coverImage || o.organization_logo || null,
        coverImage: o.cover_image || o.coverImage || o.poster || o.organization_logo || null,
        cover_image: o.cover_image || o.coverImage || o.poster || o.organization_logo || null
      }
      console.log('Transformed opportunity:', {
        id: o.id,
        title: o.title,
        poster: o.poster || o.cover_image || o.coverImage || o.organization_logo || null,
        coverImage: o.cover_image || o.coverImage || o.poster || o.organization_logo || null
      })
    } else if (apiBookmark.tender) {
      const t = apiBookmark.tender
      return {
        ...baseData,
        type: 'tender',
        title: t.title,
        organization: t.organization,
        company: t.organization,
        sector: t.sector || 'Not specified',
        industry: t.sector || 'Not specified',
        location: t.location,
        country: getCountryName(t.country),
        contractValue: t.contract_value_min 
          ? `${t.currency} ${(t.contract_value_min / 1000000).toFixed(1)}M`
          : 'Not specified',
        budget: t.contract_value_min 
          ? `${t.currency} ${(t.contract_value_min / 1000000).toFixed(1)}M`
          : 'Not specified',
        salary: t.contract_value_min 
          ? `${t.currency} ${(t.contract_value_min / 1000000).toFixed(1)}M`
          : 'Not specified',
        tenderType: t.type || 'Not specified',
        experience: t.experience_level || 'Not specified',
        skills: t.skills || [],
        tags: t.tags || [],
        description: t.description,
        benefits: t.benefits || [],
        posted: t.created_at ? new Date(t.created_at).toLocaleDateString() : 'Recently',
        urgentHiring: t.is_urgent || false,
        isUrgent: t.is_urgent || false,
        price: t.price || 'Free',
        postedBy: t.posted_by || 'platform',
        externalUrl: t.external_url,
        contactEmail: t.contact_email,
        applicationDeadline: t.deadline,
        deadline: formatDeadline(t.deadline),
        isFeatured: t.is_featured || false,
        status: t.status || 'active',
        applicants: t.applicants || 0,
        logo: t.organization_logo ? resolveAssetUrl(t.organization_logo) : null,
        coverImage: t.cover_image || t.coverImage || t.organization_logo || null
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
        courseType: c.type || 'Not specified',
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
      console.log('Fetching bookmarks...')
      console.log('Auth token:', localStorage.getItem('auth-token'))
      
      const response = await apiService.get('/saved-items')
      console.log('Bookmarks API response:', response)
      console.log('Response success:', response.success)
      console.log('Response data:', response.data)
      console.log('Response items:', response.data?.items)
      console.log('Items length:', response.data?.items?.length)
      
      if (response.success && response.data && response.data.items && response.data.items.length > 0) {
        console.log('Found bookmarks in API, transforming...')
        const transformedBookmarks = response.data.items.map(transformBookmarkData)
        console.log('Transformed bookmarks:', transformedBookmarks)
        console.log('Bookmark types:', transformedBookmarks.map(b => ({ id: b.id, type: b.type })))
      setBookmarks(transformedBookmarks)
      } else {
        console.log('No bookmarks found in API response')
        console.log('Response success:', response.success)
        console.log('Response data exists:', !!response.data)
        console.log('Items exist:', !!response.data?.items)
        console.log('Items length:', response.data?.items?.length)
        console.log('Using static data as fallback')
        // Use static data as fallback
        const transformedStatic = staticBookmarks.map(transformBookmarkData)
        setBookmarks(transformedStatic)
      }
    } catch (error) {
      console.error('Error fetching bookmarks:', error)
      console.error('Error details:', error.message)
      console.log('Using static data due to error')
      // Use static data as fallback
      const transformedStatic = staticBookmarks.map(transformBookmarkData)
      setBookmarks(transformedStatic)
    } finally {
      setLoading(false)
    }
  }

  // Static bookmarks data as fallback - formatted like API response
  const staticBookmarks = [
    {
      id: 'test-job-1',
      created_at: '2024-01-15T10:00:00Z',
      is_featured: false,
      job: {
        id: 'job-1',
        title: 'Software Engineer',
        company: 'Tech Corp',
        industry: 'Technology',
        location: 'San Francisco',
        country: 'US',
        salary_min: 80000,
        salary_max: 120000,
        currency: 'USD',
        job_type: 'full-time',
        experience_level: 'mid',
        skills: ['React', 'Node.js', 'JavaScript'],
        tags: ['React', 'Node.js', 'JavaScript'],
        description: 'Great opportunity for a software engineer',
        benefits: ['Health insurance', 'Remote work'],
        created_at: '2024-01-15T10:00:00Z',
        work_type: 'hybrid',
        is_urgent: false,
        price: 'Free',
        posted_by: 'platform',
        external_url: null,
        contact_email: 'hr@techcorp.com',
        application_deadline: '2024-02-15T23:59:59Z',
        is_featured: false,
        status: 'active',
        applicants: 25,
        company_logo: null
      }
    },
    {
      id: 'test-tender-1',
      created_at: '2024-01-20T10:00:00Z',
      is_featured: false,
      tender: {
        id: 'tender-1',
        title: 'IT Infrastructure Upgrade',
        organization: 'City Government',
        sector: 'Government',
        location: 'New York',
        country: 'US',
        contract_value_min: 500000,
        currency: 'USD',
        type: 'Infrastructure',
        skills: ['Cloud', 'Security'],
        tags: ['Infrastructure', 'Cloud', 'Security'],
        description: 'Major IT infrastructure upgrade project',
        benefits: ['Long-term contract'],
        created_at: '2024-01-20T10:00:00Z',
        is_urgent: false,
        price: 'Free',
        posted_by: 'platform',
        external_url: null,
        contact_email: 'procurement@city.gov',
        deadline: '2024-03-01T23:59:59Z',
        is_featured: false,
        status: 'active',
        applicants: 12,
        organization_logo: null,
        cover_image: null,
        coverImage: null
      }
    },
    {
      id: 'test-opportunity-1',
      created_at: '2024-01-25T10:00:00Z',
      is_featured: false,
      opportunity: {
        id: 'opportunity-1',
        title: 'Scholarship Program',
        organization: 'Education Foundation',
        category: 'Education',
        location: 'Remote',
        country: 'US',
        duration: '1 year',
        amount_min: 5000,
        currency: 'USD',
        type: 'Scholarship',
        experience_level: 'entry',
        skills: ['Academic'],
        tags: ['Education', 'Scholarship', 'Students'],
        description: 'Full scholarship for outstanding students',
        benefits: ['Full tuition', 'Living allowance'],
        created_at: '2024-01-25T10:00:00Z',
        is_urgent: false,
        price: 'Free',
        posted_by: 'platform',
        external_url: null,
        contact_email: 'scholarships@edfoundation.org',
        deadline: '2024-02-28T23:59:59Z',
        is_featured: false,
        status: 'active',
        applicants: 150,
        organization_logo: null,
        poster: null,
        cover_image: null,
        coverImage: null
      }
    }
  ]

  const filters = [
    { id: 'job', name: 'Jobs', count: bookmarks.filter(b => b.type === 'job').length, icon: Briefcase },
    { id: 'opportunity', name: 'Opportunities', count: bookmarks.filter(b => b.type === 'opportunity').length, icon: GraduationCap },
    { id: 'tender', name: 'Tenders', count: bookmarks.filter(b => b.type === 'tender').length, icon: FileText },
    { id: 'course', name: 'Courses', count: bookmarks.filter(b => b.type === 'course').length, icon: BookOpen }
  ]

  const filteredBookmarks = bookmarks.filter(bookmark => {
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
      {loading ? (
        <div style={{
          gridColumn: '1 / -1',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '40px',
          backgroundColor: 'white',
          borderRadius: '12px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
        }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '24px', marginBottom: '16px' }}>⏳</div>
            <div style={{ fontSize: '16px', color: '#64748b' }}>Loading bookmarks...</div>
          </div>
        </div>
      ) : (
      <div style={{
        display: 'grid',
          gridTemplateColumns: `repeat(${getGridColumns(screenSize)}, 1fr)`,
          gap: getGridGap(screenSize)
      }}>
        {(() => {
          console.log('Filtering bookmarks...')
          console.log('Selected filter:', selectedFilter)
          console.log('All bookmark types:', bookmarks.map(b => ({ id: b.id, type: b.type })))
          
          const filteredBookmarks = bookmarks.filter(bookmark => {
            const matches = bookmark.type === selectedFilter
            console.log(`Bookmark ${bookmark.id} (type: ${bookmark.type}) matches filter ${selectedFilter}:`, matches)
            return matches
          })
          
          console.log('Current bookmarks:', bookmarks)
          console.log('Filtered bookmarks:', filteredBookmarks)
          
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
              // Helper functions for tender and opportunity cards
              const getSectorIcon = (sector) => {
                switch (sector?.toLowerCase()) {
                  case 'technology': return <Building2 size={48} color="#3b82f6" />
                  case 'government': return <Shield size={48} color="#16a34a" />
                  case 'manufacturing': return <Factory size={48} color="#f59e0b" />
                  default: return <Building2 size={48} color="#64748b" />
                }
              }

              const getSectorColor = (sector) => {
                switch (sector?.toLowerCase()) {
                  case 'technology': return '#3b82f6'
                  case 'government': return '#16a34a'
                  case 'manufacturing': return '#f59e0b'
                  default: return '#64748b'
                }
              }

              const getTypeColor = (type) => {
                switch (type) {
                  case 'Scholarships': return '#1d4ed8'      // Blue
                  case 'Fellowships': return '#7c3aed'       // Purple
                  case 'Grants': return '#dc2626'            // Red
                  case 'Funds': return '#ea580c'             // Orange
                  case 'Internships': return '#059669'       // Green
                  case 'Programs': return '#0891b2'          // Cyan
                  case 'Competitions': return '#f59e0b'      // Amber
                  case 'Research': return '#8b5cf6'          // Violet
                  case 'Professional Development': return '#ec4899' // Pink
                  default: return '#64748b'                  // Gray
                }
              }

              // Render tender cards with exact structure from Tenders.jsx
              if (bookmark.type === 'tender') {
                const sectorColor = getSectorColor(bookmark.sector)
                const SectorIcon = () => getSectorIcon(bookmark.sector)
                const isDeadlineUrgent = bookmark.deadline && new Date(bookmark.deadline) < new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
            
            return (
                  <div key={bookmark.id} style={{
                  backgroundColor: 'white',
                  borderRadius: '12px',
                    overflow: 'hidden',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                  border: '1px solid #f0f0f0',
                  position: 'relative',
                    transition: 'all 0.2s ease-in-out',
                    cursor: 'pointer',
                    height: '480px',
                    display: 'flex',
                    flexDirection: 'column'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)'
                    e.currentTarget.style.transform = 'translateY(-2px)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.05)'
                    e.currentTarget.style.transform = 'translateY(0)'
                  }}>
                    
                    {/* Cover Image */}
                    <div style={{ position: 'relative' }}>
                      {bookmark.coverImage ? (
                        <img 
                          src={resolveAssetUrl(bookmark.coverImage)} 
                          alt={bookmark.title}
                          style={{
                            width: '100%',
                            height: '250px',
                            objectFit: 'cover'
                          }}
                        />
                      ) : (
                    <div style={{
                          width: '100%',
                          height: '250px',
                          backgroundColor: '#f8f9fa',
                      display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#64748b'
                        }}>
                          <SectorIcon />
                        </div>
                      )}
                      
                      {/* Overlay badges */}
                  <div style={{
                    position: 'absolute',
                    top: '12px',
                        left: '12px',
                    right: '12px',
                        display: 'flex',
                      justifyContent: 'space-between',
                        alignItems: 'flex-start'
                      }}>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <span style={{
                            fontSize: '12px',
                            color: 'white',
                            backgroundColor: sectorColor,
                            padding: '4px 8px',
                    borderRadius: '6px',
                            fontWeight: '600',
                            backdropFilter: 'blur(10px)'
                          }}>
                            {bookmark.sector || 'Not specified'}
                          </span>
                          {bookmark.isUrgent && (
                            <span style={{
                    fontSize: '10px',
                              color: 'white',
                              backgroundColor: '#3b82f6',
                              padding: '4px 8px',
                              borderRadius: '6px',
                              fontWeight: '700',
                              letterSpacing: '0.5px',
                              display: 'inline-flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              minHeight: '20px',
                              lineHeight: '1'
                            }}>
                              URGENT
                            </span>
                          )}
                        </div>
                        
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            removeBookmark(bookmark.id)
                          }}
                          style={{
                            background: '#f8f9fa',
                            border: '1px solid #e2e8f0',
                            padding: '8px',
                            cursor: 'pointer',
                            borderRadius: '8px',
                            flexShrink: 0,
                            marginLeft: '8px',
                            transition: 'all 0.2s ease-in-out'
                          }}
                          onMouseEnter={(e) => {
                            e.target.style.backgroundColor = '#f1f5f9'
                            e.target.style.transform = 'scale(1.05)'
                          }}
                          onMouseLeave={(e) => {
                            e.target.style.backgroundColor = '#f8f9fa'
                            e.target.style.transform = 'scale(1)'
                          }}
                        >
                          <Trash2 
                            size={20} 
                            color="#dc2626"
                          />
                        </button>
                      </div>
                    </div>

                    {/* Content */}
                    <div style={{ padding: '20px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                      {/* Title */}
                      <h2 style={{
                        fontSize: '18px',
                    fontWeight: '600',
                        color: '#1a1a1a',
                        margin: '0 0 12px 0',
                        lineHeight: '1.3'
                      }}>
                        {bookmark.title}
                      </h2>

                      {/* Organization */}
                      <div style={{
                        fontSize: '13px',
                        color: '#64748b',
                        marginBottom: '12px',
                        fontWeight: '500'
                      }}>
                        {bookmark.organization || bookmark.company}
                      </div>

                      {/* Contract Value */}
                      <div style={{
                    display: 'flex',
                    alignItems: 'center',
                        gap: '4px',
                        fontSize: '13px',
                        color: '#16a34a',
                        fontWeight: '600',
                        marginBottom: '12px'
                      }}>
                        <DollarSign size={14} />
                        {bookmark.contractValue || bookmark.budget || 'Not specified'}
                  </div>

                      {/* Location and Deadline */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                        gap: '12px',
                        marginBottom: '12px',
                        flexWrap: 'wrap',
                        flexShrink: 0
                }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                          gap: '4px',
                          fontSize: '13px',
                          color: '#64748b'
                        }}>
                          <MapPin size={14} />
                          {bookmark.location}{bookmark.country && `, ${bookmark.country}`}
                        </div>
                        <span style={{ color: '#e2e8f0' }}>•</span>
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                          fontSize: '13px',
                          color: '#64748b',
                          fontWeight: '500'
                        }}>
                          <Calendar size={12} />
                          <span>Deadline:</span>
                          <span style={{ color: isDeadlineUrgent ? '#dc2626' : '#64748b', fontWeight: isDeadlineUrgent ? '600' : '500' }}>
                            {bookmark.deadline ? new Date(bookmark.deadline).toLocaleDateString() : 'Not specified'}
                          </span>
                        </div>
                  </div>
                  
                      {/* Tags */}
                      {bookmark.tags && bookmark.tags.length > 0 && (
                        <div style={{ marginBottom: '12px', flex: 1 }}>
                          <div style={{
                            display: 'flex',
                            flexWrap: 'wrap',
                            gap: '6px'
                          }}>
                            {bookmark.tags.slice(0, 4).map((tag, index) => (
                              <span key={index} style={{
                                backgroundColor: '#f1f5f9',
                                color: '#475569',
                                padding: '4px 8px',
                                borderRadius: '6px',
                                fontSize: '12px',
                                fontWeight: '500'
                              }}>
                                {typeof tag === 'string' ? tag : tag?.name || tag?.title || 'Not specified'}
                              </span>
                            ))}
                            {bookmark.tags.length > 4 && (
                              <span style={{
                                color: '#64748b',
                                fontSize: '12px',
                                padding: '4px 8px',
                                fontWeight: '500'
                              }}>
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
                        justifyContent: 'flex-end',
                        paddingTop: '12px',
                        borderTop: '1px solid #f1f5f9',
                        marginTop: 'auto',
                        flexShrink: 0
                }}>
                        <button
                          style={{
                            backgroundColor: '#16a34a',
                            color: 'white',
                            border: 'none',
                            padding: '8px 16px',
                            borderRadius: '6px',
                      fontSize: '14px',
                      fontWeight: '600',
                            cursor: 'pointer',
                            transition: 'background-color 0.2s'
                          }}
                          onMouseOver={(e) => e.target.style.backgroundColor = '#15803d'}
                          onMouseOut={(e) => e.target.style.backgroundColor = '#16a34a'}
                        >
                          Apply Now
                        </button>
                      </div>
                    </div>
                  </div>
                )
              }

              // Render opportunity cards with exact structure from Opportunities.jsx
              if (bookmark.type === 'opportunity') {
                console.log('Rendering opportunity card:', {
                  id: bookmark.id,
                  title: bookmark.title,
                  poster: bookmark.poster,
                  coverImage: bookmark.coverImage,
                  cover_image: bookmark.cover_image
                })
                const typeColor = getTypeColor(bookmark.type)

                return (
                  <div key={bookmark.id} style={{
                    backgroundColor: 'white',
                    borderRadius: '12px',
                    overflow: 'hidden',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                    border: '1px solid #f0f0f0',
                    position: 'relative',
                    transition: 'all 0.2s ease-in-out',
                    cursor: 'pointer',
                    height: '480px',
                    display: 'flex',
                    flexDirection: 'column'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)'
                    e.currentTarget.style.transform = 'translateY(-2px)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.05)'
                    e.currentTarget.style.transform = 'translateY(0)'
                  }}>
                    
                    {/* Poster Image */}
                    <div style={{ position: 'relative' }}>
                      {(bookmark.poster || bookmark.coverImage || bookmark.cover_image) ? (
                        <img 
                          src={resolveAssetUrl(bookmark.poster || bookmark.coverImage || bookmark.cover_image)} 
                          alt={bookmark.title || 'Opportunity'}
                          style={{
                            width: '100%',
                            height: '250px',
                            objectFit: 'cover'
                          }}
                          onError={(e) => {
                            e.target.style.display = 'none'
                            e.target.nextSibling.style.display = 'flex'
                          }}
                        />
                      ) : null}
                      <div style={{
                        width: '100%',
                        height: '250px',
                        backgroundColor: '#f8f9fa',
                        display: (bookmark.poster || bookmark.coverImage || bookmark.cover_image) ? 'none' : 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#64748b'
                      }}>
                        <GraduationCap size={48} color={typeColor} />
                      </div>
                      
                      {/* Overlay badges */}
                      <div style={{
                        position: 'absolute',
                        top: '12px',
                        left: '12px',
                        right: '12px',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'flex-start'
                      }}>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <span style={{
                            fontSize: '12px',
                            color: 'white',
                            backgroundColor: typeColor,
                            padding: '4px 8px',
                            borderRadius: '6px',
                            fontWeight: '600',
                            backdropFilter: 'blur(10px)',
                            textShadow: '0 1px 2px rgba(0,0,0,0.3)',
                            minHeight: '24px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}>
                            {bookmark.opportunityType}
                          </span>
                        </div>
                        
                        
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            removeBookmark(bookmark.id)
                          }}
                          style={{
                            background: '#f8f9fa',
                            border: '1px solid #e2e8f0',
                            padding: '8px',
                            cursor: 'pointer',
                            borderRadius: '8px',
                            flexShrink: 0,
                            marginLeft: '8px',
                            transition: 'all 0.2s ease-in-out'
                          }}
                          onMouseEnter={(e) => {
                            e.target.style.backgroundColor = '#f1f5f9'
                            e.target.style.transform = 'scale(1.05)'
                          }}
                          onMouseLeave={(e) => {
                            e.target.style.backgroundColor = '#f8f9fa'
                            e.target.style.transform = 'scale(1)'
                          }}
                        >
                          <Trash2 
                            size={20} 
                            color="#dc2626"
                          />
                        </button>
                  </div>
                </div>

                {/* Content */}
                    <div style={{ padding: '20px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                      {/* Title */}
                      <h2 style={{
                        fontSize: '18px',
                        fontWeight: '600',
                        color: '#1a1a1a',
                  margin: '0 0 12px 0',
                        lineHeight: '1.3'
                      }}>
                        {bookmark.title}
                      </h2>

                      {/* Organization */}
                      <div style={{
                        fontSize: '13px',
                        color: '#64748b',
                        marginBottom: '12px',
                        fontWeight: '500'
                      }}>
                        {bookmark.organization || bookmark.company || bookmark.category}
                      </div>

                      {/* Key Info Row */}
                <div style={{
                  display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        marginBottom: '12px',
                        flexWrap: 'wrap'
                      }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                          fontSize: '13px',
                      color: '#64748b'
                    }}>
                          <Clock size={14} />
                          {bookmark.duration || 'Not specified'}
                        </div>
                        <span style={{ color: '#e2e8f0' }}>•</span>
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                          fontSize: '13px',
                          color: '#64748b'
                        }}>
                          <MapPin size={14} />
                      {bookmark.location}
                    </div>
                      </div>
                  
                      {/* Deadline */}
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        fontSize: '13px',
                        color: '#64748b',
                        marginBottom: '12px',
                        fontWeight: '500'
                      }}>
                        <Calendar size={12} />
                        <span>Deadline:</span>
                        <span style={{ color: '#dc2626', fontWeight: '600' }}>
                          {bookmark.deadline ? new Date(bookmark.deadline).toLocaleDateString() : 'Not specified'}
                        </span>
                      </div>

                      {/* Tags */}
                      {bookmark.tags && bookmark.tags.length > 0 && (
                        <div style={{ marginBottom: '12px', flex: 1 }}>
                          <div style={{
                            display: 'flex',
                            flexWrap: 'wrap',
                            gap: '6px'
                          }}>
                            {bookmark.tags.slice(0, 4).map((tag, index) => (
                              <span key={index} style={{
                                backgroundColor: '#f1f5f9',
                                color: '#475569',
                                padding: '4px 8px',
                                borderRadius: '6px',
                                fontSize: '12px',
                      fontWeight: '500'
                    }}>
                                {typeof tag === 'string' ? tag : tag?.name || tag?.title || 'Not specified'}
                              </span>
                            ))}
                            {bookmark.tags.length > 4 && (
                              <span style={{
                                color: '#64748b',
                                fontSize: '12px',
                                padding: '4px 8px',
                                fontWeight: '500'
                              }}>
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
                        justifyContent: 'flex-end',
                        paddingTop: '12px',
                        borderTop: '1px solid #f1f5f9',
                        marginTop: 'auto',
                        flexShrink: 0
                      }}>
                        <button
                          style={{
                            backgroundColor: '#16a34a',
                            color: 'white',
                            border: 'none',
                            padding: '8px 16px',
                            borderRadius: '6px',
                            fontSize: '14px',
                            fontWeight: '600',
                            cursor: 'pointer',
                            transition: 'background-color 0.2s'
                          }}
                          onMouseOver={(e) => e.target.style.backgroundColor = '#15803d'}
                          onMouseOut={(e) => e.target.style.backgroundColor = '#16a34a'}
                        >
                          Apply Now
                        </button>
                    </div>
                    </div>
                  </div>
                )
              }

              // Default job card structure (unchanged)
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
                      <span style={{ color: '#0f172a' }}>{bookmark.workType || 'Not specified'}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Calendar size={12} />
                      <span>Deadline:</span>
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
      )}
      </div>
    </div>
  )
}
export default Bookmarks