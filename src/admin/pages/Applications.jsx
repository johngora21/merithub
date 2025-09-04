import React, { useState, useEffect } from 'react'
import { RefreshCw, Download, Users, MapPin, DollarSign, Briefcase, Clock, Star, Search, SlidersHorizontal, X, Check, FileText, GraduationCap } from 'lucide-react'
import { useResponsive, getGridColumns, getGridGap } from '../../hooks/useResponsive'
import { countries } from '../../utils/countries'
import ApplicantsList from './ApplicantsList'
import { apiService } from '../../lib/api-service'

const Applications = () => {
  const screenSize = useResponsive()
  const [activeTab, setActiveTab] = useState('jobs')
  const [searchQuery, setSearchQuery] = useState('')
  const [showFilters, setShowFilters] = useState(false)
  const [showOverview, setShowOverview] = useState(false)
  const [selectedItem, setSelectedItem] = useState(null)
  const [showApplicantsList, setShowApplicantsList] = useState(false)
  const [selectedItemForApplicants, setSelectedItemForApplicants] = useState(null)
  const [filters, setFilters] = useState({
    status: '',
    location: ''
  })

  // API-driven data (preserve UI and structure)
  const [jobsState, setJobsState] = useState([])
  const [tendersState, setTendersState] = useState([])
  const [opportunitiesState, setOpportunitiesState] = useState([])
  const [loadingData, setLoadingData] = useState(false)
  const [loadError, setLoadError] = useState('')

  // Map backend payloads to the exact UI fields used by the cards
  const mapJob = (j) => ({
    id: j.id || j.job_id || `JOB-${j?.id || ''}`,
    title: j.title || j.position || '',
    company: j.company || j.company_name || '',
    industry: j.industry || j.category || '',
    location: j.location || j.country || '',
    type: j.type || j.employment_type || '',
    experience: j.experience || j.experience_level || '',
    salary: j.salary || j.salary_range || '',
    postedTime: j.posted_time || j.created_at || '',
    applicants: j.applicants_count || 0,
    description: j.description || '',
    skills: Array.isArray(j.skills) ? j.skills : [],
    logo: j.logo || j.company_logo || '',
    urgentHiring: !!(j.is_urgent || j.urgentHiring),
    isRemote: !!(j.is_remote || j.remote),
    postedBy: j.posted_by || j.source || 'platform',
    status: j.status || 'Active'
  })

  const mapTender = (t) => ({
    id: t.id || t.tender_id || `TENDER-${t?.id || ''}`,
    title: t.title || '',
    company: t.organization || t.company || '',
    industry: t.industry || 'Government',
    location: t.location || t.country || '',
    budget: t.budget || t.price_range || '',
    deadline: t.deadline || t.closing_date || '',
    postedTime: t.posted_time || t.created_at || '',
    applicants: t.applicants_count || 0,
    description: t.description || '',
    requirements: Array.isArray(t.requirements) ? t.requirements : [],
    logo: t.logo || t.organization_logo || '',
    postedBy: t.posted_by || 'government',
    status: t.status || 'Active'
  })

  const mapOpportunity = (o) => ({
    id: o.id || o.opportunity_id || `OPP-${o?.id || ''}`,
    title: o.title || '',
    company: o.organization || o.company || '',
    industry: o.industry || o.category || '',
    location: o.location || o.country || 'Remote',
    duration: o.duration || '',
    stipend: o.stipend || o.compensation || '',
    postedTime: o.posted_time || o.created_at || '',
    applicants: o.applicants_count || 0,
    description: o.description || '',
    benefits: Array.isArray(o.benefits) ? o.benefits : [],
    logo: o.logo || o.organization_logo || '',
    postedBy: o.posted_by || 'institution',
    status: o.status || 'Active'
  })

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        setLoadingData(true)
        setLoadError('')
        const resp = await apiService.get('/admin/applications/overview')
        const payload = resp?.data || resp || {}
        const jobs = Array.isArray(payload.jobs) ? payload.jobs : (payload.data?.jobs || [])
        const tenders = Array.isArray(payload.tenders) ? payload.tenders : (payload.data?.tenders || [])
        const opportunities = Array.isArray(payload.opportunities) ? payload.opportunities : (payload.data?.opportunities || [])
        setJobsState(jobs.map(mapJob))
        setTendersState(tenders.map(mapTender))
        setOpportunitiesState(opportunities.map(mapOpportunity))
      } catch (e) {
        console.error('Error fetching applications:', e)
        setJobsState([])
        setTendersState([])
        setOpportunitiesState([])
        setLoadError(e?.message || 'Failed to load applications')
      } finally {
        setLoadingData(false)
      }
    }
    fetchApplications()
  }, [])

  // Removed mock data: use real API data only

  const filterOptions = {
    status: ['All Status', 'Active', 'Closed', 'Draft', 'Pending Review'],
    location: ['All Countries', ...countries.map(country => country.name)]
  }

  const currencies = [
    { code: 'USD', symbol: '$', name: 'US Dollar' },
    { code: 'EUR', symbol: '€', name: 'Euro' },
    { code: 'GBP', symbol: '£', name: 'British Pound' },
    { code: 'KES', symbol: 'KSh', name: 'Kenyan Shilling' },
    { code: 'UGX', symbol: 'USh', name: 'Ugandan Shilling' },
    { code: 'TZS', symbol: 'TSh', name: 'Tanzanian Shilling' },
    { code: 'RWF', symbol: 'RWF', name: 'Rwandan Franc' },
    { code: 'ETB', symbol: 'Br', name: 'Ethiopian Birr' },
    { code: 'SOS', symbol: 'S', name: 'Somali Shilling' },
    { code: 'DJF', symbol: 'Fdj', name: 'Djiboutian Franc' },
    { code: 'ERN', symbol: 'Nfk', name: 'Eritrean Nakfa' },
    { code: 'SSP', symbol: '£', name: 'South Sudanese Pound' },
    { code: 'BIF', symbol: 'FBu', name: 'Burundian Franc' }
  ]

  const handleFilterChange = (category, value) => {
    setFilters(prev => ({
      ...prev,
      [category]: value
    }))
  }

  const clearAllFilters = () => {
    setFilters({
      status: '',
      location: ''
    })
  }

  const getActiveFilterCount = () => {
    let count = 0
    if (filters.status && filters.status !== 'All Status') count += 1
    if (filters.location && filters.location !== 'All Countries') count += 1
    return count
  }

  const updateSalaryRange = (field, value) => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }))
  }

  // Get current data based on active tab
  const getCurrentData = () => {
    switch(activeTab) {
      case 'jobs': return jobsState
      case 'tenders': return tendersState
      case 'opportunities': return opportunitiesState
      default: return jobsState
    }
  }

  // Filter and search applications
  const filteredApplications = getCurrentData().filter(item => {
    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      const matchesSearch = 
        item.title.toLowerCase().includes(query) ||
        item.company.toLowerCase().includes(query) ||
        item.industry.toLowerCase().includes(query) ||
        item.location.toLowerCase().includes(query) ||
        (item.skills && item.skills.some(skill => skill.toLowerCase().includes(query))) ||
        (item.requirements && item.requirements.some(req => req.toLowerCase().includes(query))) ||
        (item.benefits && item.benefits.some(benefit => benefit.toLowerCase().includes(query))) ||
        item.description.toLowerCase().includes(query)
      
      if (!matchesSearch) return false
    }

    // Status filter
    if (filters.status && filters.status !== 'All Status' && item.status !== filters.status) {
      return false
    }

    // Location filter
    if (filters.location && filters.location !== 'All Countries') {
      if (!item.location || !item.location.includes(filters.location)) {
        return false
      }
    }

    return true
  })

  const handleItemClick = (item) => {
    setSelectedItem(item)
    setShowOverview(true)
  }

  const handleViewApplicants = (item) => {
    setSelectedItemForApplicants({ ...item, __type: activeTab })
    setShowApplicantsList(true)
  }

  const handleBackFromApplicants = () => {
    setShowApplicantsList(false)
    setSelectedItemForApplicants(null)
    setShowOverview(false)
    setSelectedItem(null)
  }

  // Show applicants list page if active
  if (showApplicantsList && selectedItemForApplicants) {
    return (
      <ApplicantsList 
        selectedItem={selectedItemForApplicants} 
        onBack={handleBackFromApplicants} 
      />
    )
  }

  return (
    <div className="animate-fadeIn">
      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <div style={{
          display: 'flex',
          flexDirection: screenSize.isMobile ? 'column' : 'row',
          alignItems: screenSize.isMobile ? 'flex-start' : 'center',
          justifyContent: 'space-between',
          gap: '16px'
        }}>
          <div>
            <h1 style={{
              fontSize: '32px',
              fontWeight: '800',
              color: '#0f172a',
              margin: '0 0 8px 0',
              fontFamily: 'var(--font-poppins)',
              letterSpacing: '-0.025em'
            }}>
              Applications Management
            </h1>
            <p style={{
              fontSize: '16px',
              color: '#64748b',
              margin: 0,
              fontWeight: '500'
            }}>
              View all positions with their applications.
            </p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button style={{
              background: 'linear-gradient(135deg, #16a34a 0%, #15803d 100%)',
              color: 'white',
              fontWeight: '600',
              padding: '12px 24px',
              borderRadius: '12px',
              border: 'none',
              cursor: 'pointer',
              boxShadow: '0 4px 14px rgba(22, 163, 74, 0.25)',
              transition: 'all 0.3s ease',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '14px'
            }}>
              <RefreshCw size={16} />
              Refresh Data
            </button>
            <button style={{
              background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
              color: 'white',
              fontWeight: '600',
              padding: '12px 24px',
              borderRadius: '12px',
              border: 'none',
              cursor: 'pointer',
              boxShadow: '0 4px 14px rgba(59, 130, 246, 0.25)',
              transition: 'all 0.3s ease',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '14px'
            }}>
              <Download size={16} />
              Export Data
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: screenSize.isMobile ? 'repeat(3, 1fr)' : 'repeat(3, 1fr)',
        gap: '8px',
        backgroundColor: 'white',
        padding: '8px',
        borderRadius: '12px',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
        marginBottom: '20px'
      }}>
        {[
          { id: 'jobs', name: 'Jobs', icon: Briefcase },
          { id: 'tenders', name: 'Tenders', icon: FileText },
          { id: 'opportunities', name: 'Opportunities', icon: GraduationCap }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              padding: '8px 16px',
              backgroundColor: activeTab === tab.id ? '#f97316' : 'transparent',
              color: activeTab === tab.id ? 'white' : '#64748b',
              border: 'none',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: '500',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px'
            }}
          >
            <tab.icon size={16} />
            <span>{tab.name}</span>
          </button>
        ))}
      </div>

      {/* Search and Filters */}
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
            placeholder={`Search ${activeTab}...`}
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
              e.target.style.borderColor = '#ea580c'
              e.target.style.boxShadow = '0 0 0 3px rgba(234, 88, 12, 0.1)'
            }}
            onBlur={(e) => {
              e.target.style.borderColor = '#e2e8f0'
              e.target.style.boxShadow = '0 1px 3px rgba(0,0,0,0.05)'
            }}
          />
        </div>
        
        {/* Status Filter */}
        <select
          value={filters.status}
          onChange={(e) => handleFilterChange('status', e.target.value)}
          style={{
            padding: '10px 16px',
            backgroundColor: 'white',
            border: '1px solid #e2e8f0',
            borderRadius: '8px',
            color: '#1a1a1a',
            fontSize: '14px',
            fontWeight: '500',
            cursor: 'pointer',
            outline: 'none',
            minWidth: '140px'
          }}>
          {filterOptions.status.map(option => (
            <option key={option} value={option}>{option}</option>
          ))}
        </select>

        {/* Location Filter */}
        <select
          value={filters.location}
          onChange={(e) => handleFilterChange('location', e.target.value)}
          style={{
            padding: '10px 16px',
            backgroundColor: 'white',
            border: '1px solid #e2e8f0',
            borderRadius: '8px',
            color: '#1a1a1a',
            fontSize: '14px',
            fontWeight: '500',
            cursor: 'pointer',
            outline: 'none',
            minWidth: '160px'
          }}>
          {filterOptions.location.map(option => (
            <option key={option} value={option}>{option}</option>
          ))}
        </select>

        {/* Clear Filters */}
        {getActiveFilterCount() > 0 && (
          <button
            onClick={clearAllFilters}
            style={{
              padding: '10px 16px',
              backgroundColor: 'white',
              border: '1px solid #e2e8f0',
              borderRadius: '8px',
              color: '#64748b',
              fontSize: '14px',
              fontWeight: '500',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = '#f8fafc'
              e.target.style.borderColor = '#cbd5e1'
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = 'white'
              e.target.style.borderColor = '#e2e8f0'
            }}>
            Clear
          </button>
        )}
      </div>

      {/* Cards Grid - EXACT COPY FROM MAIN APP */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: `repeat(${getGridColumns(screenSize)}, 1fr)`,
        gap: getGridGap(screenSize)
      }}>
        {filteredApplications.length === 0 ? (
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
              No applications found
            </h3>
            <p style={{
              fontSize: '14px',
              color: '#64748b',
              margin: 0
            }}>
              Try adjusting your search or filters to find more applications
            </p>
          </div>
        ) : (
          filteredApplications.map((job) => (
            <div key={job.id} style={{
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
            }}
            onClick={() => handleItemClick(job)}>
              
              {/* Company Profile Header */}
              <div style={{
                display: 'flex',
                alignItems: 'flex-start',
                justifyContent: 'space-between',
                marginBottom: '10px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1 }}>
                  <img 
                    src={job.logo} 
                    alt={job.company}
                    style={{
                      width: '44px',
                      height: '44px',
                      borderRadius: '22px',
                      objectFit: 'cover',
                      border: '2px solid #f8f9fa'
                    }}
                  />
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
                      {job.company}
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
                        {job.industry}
                      </span>
                      {job.postedBy === 'platform' && (
                        <span style={{
                          fontSize: '10px',
                          color: 'white',
                          backgroundColor: '#3b82f6',
                          padding: '1px 4px',
                          borderRadius: '3px',
                          fontWeight: '600'
                        }}>
                          PRO
                        </span>
                      )}
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
                {job.title}
                {job.urgentHiring && (
                  <Star size={14} color="#16a34a" fill="#16a34a" />
                )}
              </h2>

              {/* Job Location and Status */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                marginBottom: '8px',
                fontSize: '12px',
                color: '#666',
                flexWrap: 'wrap'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
                  <MapPin size={11} />
                  {job.location}
                </div>
                <span>•</span>
                <span>{job.postedTime}</span>
                {job.isRemote && (
                  <>
                    <span>•</span>
                    <span style={{
                      color: '#16a34a',
                      fontSize: '11px',
                      fontWeight: '500'
                    }}>
                      Remote
                    </span>
                  </>
                )}
              </div>

              {/* Quick Info */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                marginBottom: '8px',
                flexWrap: 'wrap'
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '3px',
                  fontSize: '12px',
                  color: '#16a34a',
                  fontWeight: '600'
                }}>
                  <DollarSign size={12} />
                  {job.salary}
                </div>
                <span style={{ color: '#e2e8f0' }}>•</span>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '3px',
                  fontSize: '12px',
                  color: '#64748b'
                }}>
                  <Briefcase size={12} />
                  {job.type}
                </div>
                <span style={{ color: '#e2e8f0' }}>•</span>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '3px',
                  fontSize: '12px',
                  color: '#64748b'
                }}>
                  <Clock size={12} />
                  {job.experience}
                </div>
              </div>

              {/* Description */}
              <p style={{
                fontSize: '13px',
                color: '#475569',
                lineHeight: '1.4',
                margin: '0 0 8px 0',
                display: '-webkit-box',
                WebkitLineClamp: 1,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden'
              }}>
                {job.description}
              </p>

              {/* Skills */}
              <div style={{ marginBottom: '10px' }}>
                <div style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: '4px'
                }}>
                  {job.skills && job.skills.slice(0, 4).map((skill, index) => (
                    <span key={index} style={{
                      backgroundColor: '#f1f5f9',
                      color: '#475569',
                      padding: '2px 6px',
                      borderRadius: '4px',
                      fontSize: '11px',
                      fontWeight: '500'
                    }}>
                      {skill}
                    </span>
                  ))}
                  {job.requirements && job.requirements.slice(0, 4).map((req, index) => (
                    <span key={index} style={{
                      backgroundColor: '#fef3c7',
                      color: '#92400e',
                      padding: '2px 6px',
                      borderRadius: '4px',
                      fontSize: '11px',
                      fontWeight: '500'
                    }}>
                      {req}
                    </span>
                  ))}
                  {job.benefits && job.benefits.slice(0, 4).map((benefit, index) => (
                    <span key={index} style={{
                      backgroundColor: '#dcfce7',
                      color: '#166534',
                      padding: '2px 6px',
                      borderRadius: '4px',
                      fontSize: '11px',
                      fontWeight: '500'
                    }}>
                      {benefit}
                    </span>
                  ))}
                  {((job.skills && job.skills.length > 4) || 
                    (job.requirements && job.requirements.length > 4) || 
                    (job.benefits && job.benefits.length > 4)) && (
                    <span style={{
                      color: '#64748b',
                      fontSize: '11px',
                      padding: '2px 6px',
                      fontWeight: '500'
                    }}>
                      +{Math.max(
                        job.skills ? job.skills.length : 0,
                        job.requirements ? job.requirements.length : 0,
                        job.benefits ? job.benefits.length : 0
                      ) - 4} more
                    </span>
                  )}
                </div>
              </div>

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
                  gap: '3px',
                  fontSize: '11px',
                  color: '#64748b'
                }}>
                  <Users size={11} />
                  {job.applicants || 0} applicants
                </div>

                <button
                  onClick={() => handleViewApplicants(job)}
                  style={{
                    backgroundColor: '#ea580c',
                    color: 'white',
                    border: 'none',
                    padding: '6px 12px',
                    borderRadius: '6px',
                    fontSize: '12px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease-in-out'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = '#dc2626'
                    e.target.style.transform = 'translateY(-1px)'
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = '#ea580c'
                    e.target.style.transform = 'translateY(0)'
                  }}>
                  View Applicants
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Filters Modal */}
      {showFilters && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px'
        }}
        onClick={() => setShowFilters(false)}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '16px',
            padding: '24px',
            maxWidth: '400px',
            width: '100%',
            maxHeight: '80vh',
            overflow: 'auto'
          }}
          onClick={(e) => e.stopPropagation()}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '20px'
            }}>
              <h3 style={{
                fontSize: '18px',
                fontWeight: '600',
                color: '#0f172a',
                margin: 0
              }}>
                Filters
              </h3>
              <button
                onClick={() => setShowFilters(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '4px'
                }}>
                <X size={20} color="#64748b" />
              </button>
            </div>

            {/* Filter Sections */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {/* Job Type */}
              <div>
                <h4 style={{
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#374151',
                  margin: '0 0 12px 0'
                }}>
                  Job Type
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {filterOptions.jobType.map((type) => (
                    <label key={type} style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      cursor: 'pointer',
                      fontSize: '14px',
                      color: '#374151'
                    }}>
                      <input
                        type="checkbox"
                        checked={filters.jobType.includes(type)}
                        onChange={() => toggleFilter('jobType', type)}
                        style={{ width: '16px', height: '16px' }}
                      />
                      {type}
                    </label>
                  ))}
                </div>
              </div>

              {/* Experience Level */}
              <div>
                <h4 style={{
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#374151',
                  margin: '0 0 12px 0'
                }}>
                  Experience Level
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {filterOptions.experienceLevel.map((level) => (
                    <label key={level} style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      cursor: 'pointer',
                      fontSize: '14px',
                      color: '#374151'
                    }}>
                      <input
                        type="checkbox"
                        checked={filters.experienceLevel.includes(level)}
                        onChange={() => toggleFilter('experienceLevel', level)}
                        style={{ width: '16px', height: '16px' }}
                      />
                      {level}
                    </label>
                  ))}
                </div>
              </div>

              {/* Industry */}
              <div>
                <h4 style={{
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#374151',
                  margin: '0 0 12px 0'
                }}>
                  Industry
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '120px', overflow: 'auto' }}>
                  {filterOptions.industry.map((industry) => (
                    <label key={industry} style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      cursor: 'pointer',
                      fontSize: '14px',
                      color: '#374151'
                    }}>
                      <input
                        type="checkbox"
                        checked={filters.industry.includes(industry)}
                        onChange={() => toggleFilter('industry', industry)}
                        style={{ width: '16px', height: '16px' }}
                      />
                      {industry}
                    </label>
                  ))}
                </div>
              </div>

              {/* Location */}
              <div>
                <h4 style={{
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#374151',
                  margin: '0 0 12px 0'
                }}>
                  Location Type
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {filterOptions.location.map((location) => (
                    <label key={location} style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      cursor: 'pointer',
                      fontSize: '14px',
                      color: '#374151'
                    }}>
                      <input
                        type="checkbox"
                        checked={filters.location.includes(location)}
                        onChange={() => toggleFilter('location', location)}
                        style={{ width: '16px', height: '16px' }}
                      />
                      {location}
                    </label>
                  ))}
                </div>
              </div>

              {/* Salary Range */}
              <div>
                <h4 style={{
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#374151',
                  margin: '0 0 12px 0'
                }}>
                  Salary Range
                </h4>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <input
                    type="number"
                    placeholder="Min"
                    value={filters.salaryMin}
                    onChange={(e) => updateSalaryRange('salaryMin', e.target.value)}
                    style={{
                      flex: 1,
                      padding: '8px 12px',
                      border: '1px solid #e2e8f0',
                      borderRadius: '6px',
                      fontSize: '14px'
                    }}
                  />
                  <span style={{ color: '#64748b' }}>-</span>
                  <input
                    type="number"
                    placeholder="Max"
                    value={filters.salaryMax}
                    onChange={(e) => updateSalaryRange('salaryMax', e.target.value)}
                    style={{
                      flex: 1,
                      padding: '8px 12px',
                      border: '1px solid #e2e8f0',
                      borderRadius: '6px',
                      fontSize: '14px'
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div style={{
              display: 'flex',
              gap: '12px',
              marginTop: '24px',
              paddingTop: '20px',
              borderTop: '1px solid #e2e8f0'
            }}>
              <button
                onClick={clearAllFilters}
                style={{
                  flex: 1,
                  padding: '10px 16px',
                  backgroundColor: '#f8f9fa',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  color: '#64748b',
                  fontSize: '14px',
                  fontWeight: '500',
                  cursor: 'pointer'
                }}>
                Clear All
              </button>
              <button
                onClick={() => setShowFilters(false)}
                style={{
                  flex: 1,
                  padding: '10px 16px',
                  backgroundColor: '#16a34a',
                  border: '1px solid #16a34a',
                  borderRadius: '8px',
                  color: 'white',
                  fontSize: '14px',
                  fontWeight: '500',
                  cursor: 'pointer'
                }}>
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Overview Modal */}
      {showOverview && selectedItem && !showApplicantsList && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px'
        }}
        onClick={() => setShowOverview(false)}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '16px',
            maxWidth: '600px',
            width: '100%',
            maxHeight: '80vh',
            overflow: 'auto',
            position: 'relative'
          }}
          onClick={(e) => e.stopPropagation()}>
            {/* Header */}
            <div style={{
              padding: '24px 24px 0 24px',
              borderBottom: '1px solid #e2e8f0'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '16px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <img 
                    src={selectedItem.logo} 
                    alt={selectedItem.company}
                    style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: '24px',
                      objectFit: 'cover'
                    }}
                  />
                  <div>
                    <h2 style={{
                      fontSize: '20px',
                      fontWeight: '600',
                      color: '#0f172a',
                      margin: '0 0 4px 0'
                    }}>
                      {selectedItem.company}
                    </h2>
                    <p style={{
                      fontSize: '14px',
                      color: '#64748b',
                      margin: 0
                    }}>
                      {selectedItem.industry}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowOverview(false)}
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    padding: '8px',
                    borderRadius: '8px',
                    color: '#64748b'
                  }}>
                  <X size={20} />
                </button>
              </div>
              
              <h1 style={{
                fontSize: '24px',
                fontWeight: '700',
                color: '#0f172a',
                margin: '0 0 12px 0'
              }}>
                {selectedItem.title}
              </h1>

              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
                flexWrap: 'wrap',
                fontSize: '14px',
                color: '#64748b',
                marginBottom: '16px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <MapPin size={16} />
                  {selectedItem.location}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Clock size={16} />
                  {selectedItem.postedTime}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Users size={16} />
                  {selectedItem.applicants} applicants
                </div>
                <span style={{
                  padding: '4px 8px',
                  backgroundColor: selectedItem.status === 'Active' ? '#dcfce7' : '#fef3c7',
                  color: selectedItem.status === 'Active' ? '#166534' : '#92400e',
                  borderRadius: '6px',
                  fontSize: '12px',
                  fontWeight: '600'
                }}>
                  {selectedItem.status}
                </span>
              </div>
            </div>

            {/* Content */}
            <div style={{ padding: '24px' }}>
              {/* Key Details */}
              <div style={{ marginBottom: '24px' }}>
                <h3 style={{
                  fontSize: '16px',
                  fontWeight: '600',
                  color: '#0f172a',
                  margin: '0 0 12px 0'
                }}>
                  Key Details
                </h3>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                  gap: '12px'
                }}>
                  {activeTab === 'jobs' && (
                    <>
                      <div>
                        <label style={{
                          fontSize: '12px',
                          color: '#64748b',
                          fontWeight: '500',
                          marginBottom: '4px',
                          display: 'block'
                        }}>
                          Job Type
                        </label>
                        <p style={{
                          fontSize: '14px',
                          color: '#0f172a',
                          margin: 0,
                          fontWeight: '500'
                        }}>
                          {selectedItem.type}
                        </p>
                      </div>
                      <div>
                        <label style={{
                          fontSize: '12px',
                          color: '#64748b',
                          fontWeight: '500',
                          marginBottom: '4px',
                          display: 'block'
                        }}>
                          Experience
                        </label>
                        <p style={{
                          fontSize: '14px',
                          color: '#0f172a',
                          margin: 0,
                          fontWeight: '500'
                        }}>
                          {selectedItem.experience}
                        </p>
                      </div>
                      <div>
                        <label style={{
                          fontSize: '12px',
                          color: '#64748b',
                          fontWeight: '500',
                          marginBottom: '4px',
                          display: 'block'
                        }}>
                          Salary
                        </label>
                        <p style={{
                          fontSize: '14px',
                          color: '#16a34a',
                          margin: 0,
                          fontWeight: '600'
                        }}>
                          {selectedItem.salary}
                        </p>
                      </div>
                    </>
                  )}
                  
                  {activeTab === 'tenders' && (
                    <>
                      <div>
                        <label style={{
                          fontSize: '12px',
                          color: '#64748b',
                          fontWeight: '500',
                          marginBottom: '4px',
                          display: 'block'
                        }}>
                          Budget
                        </label>
                        <p style={{
                          fontSize: '14px',
                          color: '#16a34a',
                          margin: 0,
                          fontWeight: '600'
                        }}>
                          {selectedItem.budget}
                        </p>
                      </div>
                      <div>
                        <label style={{
                          fontSize: '12px',
                          color: '#64748b',
                          fontWeight: '500',
                          marginBottom: '4px',
                          display: 'block'
                        }}>
                          Deadline
                        </label>
                        <p style={{
                          fontSize: '14px',
                          color: '#dc2626',
                          margin: 0,
                          fontWeight: '500'
                        }}>
                          {selectedItem.deadline}
                        </p>
                      </div>
                    </>
                  )}
                  
                  {activeTab === 'opportunities' && (
                    <>
                      <div>
                        <label style={{
                          fontSize: '12px',
                          color: '#64748b',
                          fontWeight: '500',
                          marginBottom: '4px',
                          display: 'block'
                        }}>
                          Duration
                        </label>
                        <p style={{
                          fontSize: '14px',
                          color: '#0f172a',
                          margin: 0,
                          fontWeight: '500'
                        }}>
                          {selectedItem.duration}
                        </p>
                      </div>
                      <div>
                        <label style={{
                          fontSize: '12px',
                          color: '#64748b',
                          fontWeight: '500',
                          marginBottom: '4px',
                          display: 'block'
                        }}>
                          Stipend
                        </label>
                        <p style={{
                          fontSize: '14px',
                          color: '#16a34a',
                          margin: 0,
                          fontWeight: '600'
                        }}>
                          {selectedItem.stipend}
                        </p>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Description */}
              <div style={{ marginBottom: '24px' }}>
                <h3 style={{
                  fontSize: '16px',
                  fontWeight: '600',
                  color: '#0f172a',
                  margin: '0 0 12px 0'
                }}>
                  Description
                </h3>
                <p style={{
                  fontSize: '14px',
                  color: '#475569',
                  lineHeight: '1.6',
                  margin: 0
                }}>
                  {selectedItem.description}
                </p>
              </div>

              {/* Skills/Requirements/Benefits */}
              {selectedItem.skills && (
                <div style={{ marginBottom: '24px' }}>
                  <h3 style={{
                    fontSize: '16px',
                    fontWeight: '600',
                    color: '#0f172a',
                    margin: '0 0 12px 0'
                  }}>
                    Required Skills
                  </h3>
                  <div style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '8px'
                  }}>
                    {selectedItem.skills.map((skill, index) => (
                      <span key={index} style={{
                        backgroundColor: '#f1f5f9',
                        color: '#475569',
                        padding: '6px 12px',
                        borderRadius: '6px',
                        fontSize: '13px',
                        fontWeight: '500'
                      }}>
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {selectedItem.requirements && (
                <div style={{ marginBottom: '24px' }}>
                  <h3 style={{
                    fontSize: '16px',
                    fontWeight: '600',
                    color: '#0f172a',
                    margin: '0 0 12px 0'
                  }}>
                    Requirements
                  </h3>
                  <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '8px'
                  }}>
                    {selectedItem.requirements.map((req, index) => (
                      <div key={index} style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        fontSize: '14px',
                        color: '#475569'
                      }}>
                        <div style={{
                          width: '6px',
                          height: '6px',
                          backgroundColor: '#16a34a',
                          borderRadius: '50%'
                        }}></div>
                        {req}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {selectedItem.benefits && (
                <div style={{ marginBottom: '24px' }}>
                  <h3 style={{
                    fontSize: '16px',
                    fontWeight: '600',
                    color: '#0f172a',
                    margin: '0 0 12px 0'
                  }}>
                    Benefits
                  </h3>
                  <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '8px'
                  }}>
                    {selectedItem.benefits.map((benefit, index) => (
                      <div key={index} style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        fontSize: '14px',
                        color: '#475569'
                      }}>
                        <div style={{
                          width: '6px',
                          height: '6px',
                          backgroundColor: '#16a34a',
                          borderRadius: '50%'
                        }}></div>
                        {benefit}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div style={{
                display: 'flex',
                gap: '12px',
                paddingTop: '20px',
                borderTop: '1px solid #e2e8f0'
              }}>
                <button 
                  onClick={() => {
                    setShowOverview(false)
                    handleViewApplicants(selectedItem)
                  }}
                  style={{
                    flex: 1,
                    padding: '12px 24px',
                    backgroundColor: '#ea580c',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}>
                  View All Applicants
                </button>
                <button style={{
                  padding: '12px 24px',
                  backgroundColor: 'white',
                  color: '#64748b',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: '500',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}>
                  Edit
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Applications
