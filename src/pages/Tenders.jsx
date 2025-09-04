import React, { useEffect, useState } from 'react'
import { useResponsive, getGridColumns, getGridGap } from '../hooks/useResponsive'
import { countries } from '../utils/countries'
import { tendersAPI } from '../lib/api-service'
import { resolveAssetUrl } from '../lib/api-service'

import { 
  Bookmark, 
  MapPin, 
  Clock, 
  Building2,
  DollarSign,
  Calendar,
  Search,
  SlidersHorizontal,
  Download,
  FileText,
  Users,
  AlertCircle,
  Shield,
  Briefcase,
  Factory,
  X,
  Check,
  Star
} from 'lucide-react'

const Tenders = () => {
  const screenSize = useResponsive()
  const [savedTenders, setSavedTenders] = useState(new Set())
  
  const [searchQuery, setSearchQuery] = useState('')
  const [showFilters, setShowFilters] = useState(false)
  const [filters, setFilters] = useState({
    sector: [],
    country: [],
    contractValueMin: '',
    contractValueMax: '',
    currency: 'USD'
  })
  const [showDetails, setShowDetails] = useState(false)
  const [selectedTender, setSelectedTender] = useState(null)
  const [tenders, setTenders] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchTenders = async () => {
      try {
        setLoading(true)
        const data = await tendersAPI.getAll()
        const apiTenders = data?.tenders || data || []
        const transformed = apiTenders.map((t) => {
          const orgLogo = t.organization_logo ? resolveAssetUrl(t.organization_logo) : ''
          const coverImage = t.cover_image ? resolveAssetUrl(t.cover_image) : ''
          const contractValue = (t.contract_value_min && t.contract_value_max)
            ? `${t.currency} ${Number(t.contract_value_min).toLocaleString()} - ${t.currency} ${Number(t.contract_value_max).toLocaleString()}`
            : 'Value not specified'
          const sector = (t.sector || '').split('-').map(s => s.charAt(0).toUpperCase() + s.slice(1)).join('-')
          return {
            id: String(t.id),
            title: t.title,
            organization: t.organization,
            organizationLogo: orgLogo,
            coverImage,
            sector,
            category: t.category,
            location: t.location,
            country: t.country,
            contractValue,
            currency: t.currency,
            duration: t.duration || 'Not specified',
            deadline: t.deadline,
            description: t.description,
            detailedDescription: t.detailed_description,
            documents: Array.isArray(t.documents) ? t.documents : [],
            tags: [], // Remove project scope from tags
            projectScope: t.project_scope || [],
            technicalRequirements: t.technical_requirements || [],
            organizationInfo: t.organization_info || null,
            submissionProcess: t.submission_process || [],
            evaluationCriteria: t.evaluation_criteria || [],
            submissions: t.submissions_count || 0,
            externalUrl: t.external_url,
            status: t.status || 'active',
            isUrgent: !!t.is_urgent
          }
        })
        setTenders(transformed)
      } catch (e) {
        console.error('Error fetching tenders:', e)
      } finally {
        setLoading(false)
      }
    }
    fetchTenders()
  }, [])
  const filterOptions = {
    sector: [
      'Technology', 'Construction', 'Healthcare', 'Transportation', 'Energy', 
      'Manufacturing', 'Education', 'Defense', 'Finance', 'Telecommunications', 
      'Agriculture', 'Mining', 'Real Estate', 'Retail', 'Media', 'Consulting', 
      'Security', 'Environment', 'Tourism', 'Food & Beverage', 'Infrastructure', 
      'Oil & Gas', 'Aviation', 'Maritime/Shipping', 'Water & Sanitation', 'Waste Management'
    ],
    country: countries.map(country => country.name) // All 195 countries
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

  const toggleSave = (tenderId) => {
    const newSaved = new Set(savedTenders)
    if (newSaved.has(tenderId)) {
      newSaved.delete(tenderId)
    } else {
      newSaved.add(tenderId)
    }
    setSavedTenders(newSaved)
  }

  const handleViewDetails = (tenderId) => {
    const tender = tenders.find(t => t.id === tenderId)
    if (tender) {
      setSelectedTender(tender)
      setShowDetails(true)
    }
  }

  const handleApply = (tenderId) => {
    console.log('Apply clicked for tender:', tenderId)
    const tender = tenders.find(t => t.id === tenderId)
    if (tender && tender.externalUrl) {
      window.open(tender.externalUrl, '_blank')
    } else {
      // Show tender details modal as fallback
      setSelectedTender(tender)
      setShowDetails(true)
    }
  }

  const handleTenderClick = (tender) => {
    setSelectedTender(tender)
    setShowDetails(true)
  }

  const handleDownloadDocs = (tenderId) => {
    console.log('Download documents clicked for tender:', tenderId)
    const tender = tenders.find(t => t.id === tenderId)
    if (tender && tender.documents && tender.documents.length > 0) {
      // Download each document
      tender.documents.forEach((doc, index) => {
        const link = document.createElement('a')
        link.href = resolveAssetUrl(doc.url || doc)
        link.download = doc.name || `document-${index + 1}`
        link.target = '_blank'
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
      })
    } else {
      alert('No documents available for this tender.')
    }
  }

  const toggleFilter = (category, value) => {
    setFilters(prev => ({
      ...prev,
      [category]: prev[category].includes(value)
        ? prev[category].filter(item => item !== value)
        : [...prev[category], value]
    }))
  }

  const clearAllFilters = () => {
    setFilters({
      sector: [],
      country: [],
      contractValueMin: '',
      contractValueMax: '',
      currency: 'USD'
    })
  }

  const getActiveFilterCount = () => {
    let count = 0
    count += filters.sector.length
    count += filters.country.length
    if (filters.contractValueMin || filters.contractValueMax) count += 1
    return count
  }

  const updateContractValueRange = (field, value) => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const getSectorIcon = (sector) => {
    switch (sector) {
      case 'Government': return Shield
      case 'Healthcare': return Users
      case 'Transportation': return MapPin
      case 'Private': return Building2
      case 'Manufacturing': return Factory
      default: return Briefcase
    }
  }

  const getSectorColor = (sector) => {
    switch (sector) {
      case 'Government': return '#1d4ed8'
      case 'Healthcare': return '#dc2626'
      case 'Transportation': return '#059669'
      case 'Private': return '#7c3aed'
      case 'Manufacturing': return '#ea580c'
      default: return '#16a34a'
    }
  }

  const getDaysUntilDeadline = (deadline) => {
    const today = new Date()
    const deadlineDate = new Date(deadline)
    const diffTime = deadlineDate - today
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  // Filter and search tenders
  const filteredTenders = tenders.filter(tender => {
    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      const matchesSearch = 
        tender.title.toLowerCase().includes(query) ||
        tender.organization.toLowerCase().includes(query) ||
        tender.sector.toLowerCase().includes(query) ||
        tender.category.toLowerCase().includes(query) ||
        tender.location.toLowerCase().includes(query) ||
        tender.description.toLowerCase().includes(query) ||
        tender.tags.some(tag => tag.toLowerCase().includes(query))
      
      if (!matchesSearch) return false
    }

    // Sector filter
    if (filters.sector.length > 0 && !filters.sector.includes(tender.sector)) {
      return false
    }

    // Country filter
    if (filters.country.length > 0 && tender.country && !filters.country.includes(tender.country)) {
      return false
    }

    // Contract value range filter
    if (filters.contractValueMin || filters.contractValueMax) {
      const contractText = tender.contractValue
      // Extract contract value numbers from tender contract text (e.g., "$2.5M - $5.2M")
      const contractNumbers = contractText.match(/\$?([\d.]+)[MK]?/g)
      
      if (contractNumbers && contractNumbers.length >= 1) {
        // Parse the contract range from the tender
        let minValue = parseFloat(contractNumbers[0].replace(/[$MK]/g, ''))
        let maxValue = contractNumbers.length > 1 ? parseFloat(contractNumbers[1].replace(/[$MK]/g, '')) : minValue
        
        // Convert M (millions) and K (thousands) to actual numbers
        if (contractText.includes('M')) {
          minValue = minValue * 1000000
          maxValue = maxValue * 1000000
        } else if (contractText.includes('K')) {
          minValue = minValue * 1000
          maxValue = maxValue * 1000
        }
        
        // Check against filter criteria
        const filterMin = filters.contractValueMin ? parseInt(filters.contractValueMin) : 0
        const filterMax = filters.contractValueMax ? parseInt(filters.contractValueMax) : Infinity
        
        // Tender contract range must overlap with filter range
        const contractOverlaps = (minValue <= filterMax && maxValue >= filterMin)
        
        if (!contractOverlaps) return false
      }
    }

    return true
  })

  return (
    <div style={{ backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
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
              placeholder="Search tenders, contracts, organizations..."
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
          <button
            onClick={() => setShowFilters(true)}
            style={{
              backgroundColor: 'white',
              border: '1px solid #e2e8f0',
              borderRadius: '8px',
              padding: '10px',
              cursor: 'pointer',
              transition: 'all 0.2s ease-in-out',
              boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
              position: 'relative'
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = '#f8f9fa'
              e.target.style.borderColor = '#16a34a'
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = 'white'
              e.target.style.borderColor = '#e2e8f0'
            }}
          >
            <SlidersHorizontal size={20} color="#64748b" />
            {getActiveFilterCount() > 0 && (
              <div style={{
                position: 'absolute',
                top: '-6px',
                right: '-6px',
                backgroundColor: '#16a34a',
                color: 'white',
                borderRadius: '10px',
                width: '20px',
                height: '20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '12px',
                fontWeight: '600'
              }}>
                {getActiveFilterCount()}
              </div>
            )}
            </button>
        </div>

        {/* Tenders List */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: `repeat(${getGridColumns(screenSize)}, 1fr)`,
          gap: getGridGap(screenSize)
        }}>
          {filteredTenders.length === 0 ? (
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
                No tenders found
              </h3>
              <p style={{
                fontSize: '14px',
                color: '#64748b',
                margin: 0
              }}>
                Try adjusting your search or filters to find more tenders
              </p>
            </div>
          ) : (
            filteredTenders.map((tender) => {
            const SectorIcon = getSectorIcon(tender.sector)
            const sectorColor = getSectorColor(tender.sector)
            const daysUntilDeadline = getDaysUntilDeadline(tender.deadline)
            const isDeadlineUrgent = daysUntilDeadline <= 7
            
            return (
              <div key={tender.id} style={{
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
              onClick={() => handleTenderClick(tender)}
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
                  {tender.coverImage ? (
                    <img 
                      src={resolveAssetUrl(tender.coverImage)} 
                      alt={tender.title}
                      style={{
                        width: '100%',
                        height: '200px',
                        objectFit: 'cover'
                      }}
                    />
                  ) : (
                <div style={{
                      width: '100%',
                      height: '200px',
                      backgroundColor: '#f8f9fa',
                  display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#64748b'
                    }}>
                      <SectorIcon size={48} color={sectorColor} />
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
                        {tender.sector}
                      </span>
                      {tender.isUrgent && (
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
                        toggleSave(tender.id)
                      }}
                      style={{
                        background: savedTenders.has(tender.id) ? '#f0fdf4' : '#f8f9fa',
                        border: savedTenders.has(tender.id) ? '1px solid #16a34a' : '1px solid #e2e8f0',
                        padding: '8px',
                        cursor: 'pointer',
                        borderRadius: '8px',
                        flexShrink: 0,
                        marginLeft: '8px',
                        transition: 'all 0.2s ease-in-out'
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.backgroundColor = savedTenders.has(tender.id) ? '#dcfce7' : '#f1f5f9'
                        e.target.style.transform = 'scale(1.05)'
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.backgroundColor = savedTenders.has(tender.id) ? '#f0fdf4' : '#f8f9fa'
                        e.target.style.transform = 'scale(1)'
                      }}
                    >
                      <Bookmark 
                        size={20} 
                        color={savedTenders.has(tender.id) ? '#16a34a' : '#64748b'}
                        fill={savedTenders.has(tender.id) ? '#16a34a' : 'none'}
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
                    {tender.title}
                  </h2>

                  {/* Organization */}
                  <div style={{
                    fontSize: '13px',
                    color: '#64748b',
                    marginBottom: '12px',
                    fontWeight: '500'
                  }}>
                    {tender.organization}
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
                      {tender.location}
                    </div>
                    <span style={{ color: '#e2e8f0' }}>•</span>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      fontSize: '13px',
                      color: isDeadlineUrgent ? '#dc2626' : '#64748b',
                      fontWeight: isDeadlineUrgent ? '600' : '500'
                    }}>
                      <Calendar size={12} />
                      Due: {new Date(tender.deadline).toLocaleDateString()} ({daysUntilDeadline} days)
                    </div>
                  </div>

                  {/* Description */}
                  <p style={{
                    fontSize: '14px',
                    color: '#475569',
                    lineHeight: '1.5',
                    margin: '0 0 12px 0',
                    display: '-webkit-box',
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                    flex: 1
                  }}>
                    {tender.description}
                  </p>

                  {/* Tags */}
                  <div style={{ marginBottom: '16px', flexShrink: 0 }}>
                    <div style={{
                      display: 'flex',
                      flexWrap: 'wrap',
                      gap: '6px'
                    }}>
                      {tender.tags.slice(0, 3).map((tag, index) => (
                        <span key={index} style={{
                          backgroundColor: '#f1f5f9',
                          color: '#475569',
                          padding: '4px 8px',
                          borderRadius: '6px',
                          fontSize: '12px',
                          fontWeight: '500'
                        }}>
                          {tag}
                        </span>
                      ))}
                      {tender.tags.length > 3 && (
                        <span style={{
                          color: '#64748b',
                          fontSize: '12px',
                          padding: '4px 8px',
                          fontWeight: '500'
                        }}>
                          +{tender.tags.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Footer */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    paddingTop: '12px',
                    borderTop: '1px solid #f1f5f9',
                    marginTop: 'auto',
                    flexShrink: 0
                  }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      fontSize: '12px',
                      color: '#64748b'
                    }}>
                      <Users size={12} />
                      {tender.submissions} submissions
                    </div>

                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          handleDownloadDocs(tender.id)
                        }}
                        style={{
                          backgroundColor: 'white',
                          color: '#64748b',
                          border: '1px solid #e2e8f0',
                          padding: '6px 12px',
                          borderRadius: '6px',
                          fontSize: '12px',
                          fontWeight: '600',
                          cursor: 'pointer',
                          transition: 'all 0.2s ease-in-out',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px'
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.backgroundColor = '#f8f9fa'
                          e.target.style.borderColor = '#16a34a'
                          e.target.style.color = '#16a34a'
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.backgroundColor = 'white'
                          e.target.style.borderColor = '#e2e8f0'
                          e.target.style.color = '#64748b'
                        }}
                      >
                        <Download size={12} />
                        Docs
                      </button>

                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          handleApply(tender.id)
                        }}
                        style={{
                          backgroundColor: '#16a34a',
                          color: 'white',
                          border: 'none',
                          padding: '8px 16px',
                          borderRadius: '8px',
                          fontSize: '13px',
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
                        Apply Now
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )
          }))}
        </div>

        {/* Filter Modal */}
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
            alignItems: screenSize.isMobile ? 'flex-end' : 'center',
            justifyContent: screenSize.isMobile ? 'stretch' : 'center',
            transition: 'all 0.3s ease-in-out'
          }}
          onClick={() => setShowFilters(false)}>
            <div style={{
              backgroundColor: 'white',
              width: screenSize.isMobile ? '100%' : 'min(800px, 90vw)',
              maxHeight: screenSize.isMobile ? '80vh' : '85vh',
              borderRadius: screenSize.isMobile ? '20px 20px 0 0' : '16px',
              padding: screenSize.isDesktop ? '32px' : '20px',
              overflowY: 'auto',
              transform: showFilters ? 'translateY(0)' : (screenSize.isMobile ? 'translateY(100%)' : 'scale(0.9)'),
              opacity: showFilters ? 1 : 0,
              transition: 'all 0.3s ease-in-out',
              boxShadow: screenSize.isMobile ? 'none' : '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
            }}
            onClick={(e) => e.stopPropagation()}>
              
              {/* Header */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '20px',
                paddingBottom: '16px',
                borderBottom: '1px solid #f0f0f0'
              }}>
                <h2 style={{
                  fontSize: '20px',
                  fontWeight: '600',
                  color: '#1a1a1a',
                  margin: 0
                }}>
                  Filters
                </h2>
                <div style={{ display: 'flex', gap: '12px' }}>
                  <button
                    onClick={clearAllFilters}
                    style={{
                      backgroundColor: 'transparent',
                      border: 'none',
                      color: '#64748b',
                      fontSize: '14px',
                      fontWeight: '500',
                      cursor: 'pointer',
                      padding: '4px 8px'
                    }}
                  >
                    Clear All
                  </button>
                  <button
                    onClick={() => setShowFilters(false)}
                    style={{
                      backgroundColor: 'transparent',
                      border: 'none',
                      padding: '4px',
                      cursor: 'pointer',
                      borderRadius: '4px'
                    }}
                  >
                    <X size={24} color="#64748b" />
                  </button>
                </div>
              </div>

              {/* Filter Categories */}
              <div style={{ 
                display: screenSize.isDesktop ? 'grid' : 'flex',
                gridTemplateColumns: screenSize.isDesktop ? 'repeat(2, 1fr)' : 'none',
                flexDirection: screenSize.isDesktop ? 'initial' : 'column',
                gap: screenSize.isDesktop ? '32px' : '24px'
              }}>
                
                {/* Sector */}
                <div>
                  <h3 style={{
                    fontSize: '16px',
                    fontWeight: '600',
                    color: '#1a1a1a',
                    margin: '0 0 12px 0'
                  }}>
                    Sector
                  </h3>
                  <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: screenSize.isMobile ? '1fr' : 'repeat(2, 1fr)', 
                    gap: '8px' 
                  }}>
                    {filterOptions.sector.map((sector) => (
                      <label key={sector} style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        cursor: 'pointer',
                        padding: '8px 0'
                      }}>
                        <div style={{
                          width: '20px',
                          height: '20px',
                          borderRadius: '4px',
                          border: '2px solid #e2e8f0',
                          backgroundColor: filters.sector.includes(sector) ? '#16a34a' : 'transparent',
                          borderColor: filters.sector.includes(sector) ? '#16a34a' : '#e2e8f0',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          transition: 'all 0.2s ease-in-out',
                          flexShrink: 0
                        }}
                        onClick={() => toggleFilter('sector', sector)}>
                          {filters.sector.includes(sector) && (
                            <Check size={12} color="white" />
                          )}
                        </div>
                        <span style={{
                          fontSize: '14px',
                          color: '#1a1a1a',
                          fontWeight: '500'
                        }}>
                          {sector}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Country */}
                <div>
                  <h3 style={{
                    fontSize: '16px',
                    fontWeight: '600',
                    color: '#1a1a1a',
                    margin: '0 0 12px 0'
                  }}>
                    Country
                  </h3>
                  <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: screenSize.isMobile ? '1fr' : 'repeat(2, 1fr)', 
                    gap: '8px',
                    maxHeight: '200px',
                    overflowY: 'auto',
                    paddingRight: '8px'
                  }}>
                    {filterOptions.country.map((country) => (
                      <label key={country} style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        cursor: 'pointer',
                        padding: '8px 0'
                      }}>
                        <div style={{
                          width: '20px',
                          height: '20px',
                          borderRadius: '4px',
                          border: '2px solid #e2e8f0',
                          backgroundColor: filters.country.includes(country) ? '#16a34a' : 'transparent',
                          borderColor: filters.country.includes(country) ? '#16a34a' : '#e2e8f0',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          transition: 'all 0.2s ease-in-out',
                          flexShrink: 0
                        }}
                        onClick={() => toggleFilter('country', country)}>
                          {filters.country.includes(country) && (
                            <Check size={12} color="white" />
                          )}
                        </div>
                        <span style={{
                          fontSize: '14px',
                          color: '#1a1a1a',
                          fontWeight: '500'
                        }}>
                          {country}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Contract Value Range */}
                <div>
                  <h3 style={{
                    fontSize: '16px',
                    fontWeight: '600',
                    color: '#1a1a1a',
                    margin: '0 0 12px 0'
                  }}>
                    Contract Value Range
                  </h3>
                  
                  {/* Currency Selection */}
                  <div style={{ marginBottom: '16px' }}>
                    <label style={{
                      display: 'block',
                      fontSize: '14px',
                      color: '#64748b',
                      marginBottom: '6px',
                      fontWeight: '500'
                    }}>
                      Currency
                    </label>
                    <select
                      value={filters.currency}
                      onChange={(e) => updateContractValueRange('currency', e.target.value)}
                      style={{
                        width: '100%',
                        padding: '10px',
                        borderRadius: '6px',
                        border: '1px solid #e2e8f0',
                        fontSize: '14px',
                        backgroundColor: 'white',
                        color: '#1a1a1a',
                        outline: 'none',
                        transition: 'border-color 0.2s ease-in-out'
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = '#16a34a'
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = '#e2e8f0'
                      }}
                    >
                      {currencies.map((currency) => (
                        <option key={currency.code} value={currency.code}>
                          {currency.code} ({currency.symbol})
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Contract Value Input Fields */}
                  <div style={{ display: 'flex', gap: '12px' }}>
                    <div style={{ flex: 1 }}>
                      <label style={{
                        display: 'block',
                        fontSize: '14px',
                        color: '#64748b',
                        marginBottom: '6px',
                        fontWeight: '500'
                      }}>
                        Minimum Value
                      </label>
                      <div style={{ position: 'relative' }}>
                        <span style={{
                          position: 'absolute',
                          left: '10px',
                          top: '50%',
                          transform: 'translateY(-50%)',
                          fontSize: '14px',
                          color: '#64748b',
                          fontWeight: '500'
                        }}>
                          {currencies.find(c => c.code === filters.currency)?.symbol}
                        </span>
                        <input
                          type="number"
                          placeholder="0"
                          value={filters.contractValueMin}
                          onChange={(e) => updateContractValueRange('contractValueMin', e.target.value)}
                          style={{
                            width: '100%',
                            padding: '10px 10px 10px 30px',
                            borderRadius: '6px',
                            border: '1px solid #e2e8f0',
                            fontSize: '14px',
                            backgroundColor: 'white',
                            color: '#1a1a1a',
                            outline: 'none',
                            transition: 'border-color 0.2s ease-in-out'
                          }}
                          onFocus={(e) => {
                            e.target.style.borderColor = '#16a34a'
                          }}
                          onBlur={(e) => {
                            e.target.style.borderColor = '#e2e8f0'
                          }}
                        />
                      </div>
                    </div>
                    
                    <div style={{ flex: 1 }}>
                      <label style={{
                        display: 'block',
                        fontSize: '14px',
                        color: '#64748b',
                        marginBottom: '6px',
                        fontWeight: '500'
                      }}>
                        Maximum Value
                      </label>
                      <div style={{ position: 'relative' }}>
                        <span style={{
                          position: 'absolute',
                          left: '10px',
                          top: '50%',
                          transform: 'translateY(-50%)',
                          fontSize: '14px',
                          color: '#64748b',
                          fontWeight: '500'
                        }}>
                          {currencies.find(c => c.code === filters.currency)?.symbol}
                        </span>
                        <input
                          type="number"
                          placeholder="No limit"
                          value={filters.contractValueMax}
                          onChange={(e) => updateContractValueRange('contractValueMax', e.target.value)}
                          style={{
                            width: '100%',
                            padding: '10px 10px 10px 30px',
                            borderRadius: '6px',
                            border: '1px solid #e2e8f0',
                            fontSize: '14px',
                            backgroundColor: 'white',
                            color: '#1a1a1a',
                            outline: 'none',
                            transition: 'border-color 0.2s ease-in-out'
                          }}
                          onFocus={(e) => {
                            e.target.style.borderColor = '#16a34a'
                          }}
                          onBlur={(e) => {
                            e.target.style.borderColor = '#e2e8f0'
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Apply Button */}
              <div style={{
                marginTop: '32px',
                paddingTop: '20px',
                borderTop: '1px solid #f0f0f0'
              }}>
                <button
                  onClick={() => setShowFilters(false)}
                  style={{
                    width: screenSize.isMobile ? '100%' : 'auto',
                    minWidth: screenSize.isMobile ? 'auto' : '200px',
                    backgroundColor: '#16a34a',
                    color: 'white',
                    border: 'none',
                    padding: screenSize.isMobile ? '16px' : '12px 24px',
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease-in-out',
                    alignSelf: screenSize.isMobile ? 'stretch' : 'flex-start'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = '#15803d'
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = '#16a34a'
                  }}
                >
                  Apply Filters ({getActiveFilterCount()})
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Tender Details Modal */}
        {showDetails && selectedTender && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            zIndex: 1000,
            display: 'flex',
            alignItems: screenSize.isMobile ? 'flex-end' : 'center',
            justifyContent: screenSize.isMobile ? 'stretch' : 'center',
            transition: 'all 0.3s ease-in-out'
          }}
          onClick={() => setShowDetails(false)}>
            <div style={{
              backgroundColor: 'white',
              width: screenSize.isMobile ? '100%' : 'min(700px, 90vw)',
              maxHeight: screenSize.isMobile ? '80vh' : '85vh',
              borderRadius: screenSize.isMobile ? '20px 20px 0 0' : '16px',
              overflowY: 'auto',
              transform: showDetails ? 'translateY(0)' : (screenSize.isMobile ? 'translateY(100%)' : 'scale(0.9)'),
              opacity: showDetails ? 1 : 0,
              transition: 'all 0.3s ease-in-out',
              boxShadow: screenSize.isMobile ? 'none' : '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
            }}
            onClick={(e) => e.stopPropagation()}>
              
              {/* Header */}
              <div style={{ 
                padding: screenSize.isMobile ? '16px 12px 0 12px' : '24px 24px 0 24px',
                borderBottom: '1px solid #f0f0f0'
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  justifyContent: 'space-between',
                  marginBottom: '20px'
                }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: screenSize.isMobile ? '12px' : '16px', flex: 1 }}>
                    {selectedTender.organizationLogo ? (
                      <img
                        src={selectedTender.organizationLogo}
                        alt={selectedTender.organization}
                        style={{
                          width: screenSize.isMobile ? '48px' : '60px',
                          height: screenSize.isMobile ? '48px' : '60px',
                          borderRadius: '50%',
                          objectFit: 'cover',
                          border: '2px solid #f8f9fa',
                          flexShrink: 0
                        }}
                      />
                    ) : (
                    <div style={{
                      width: screenSize.isMobile ? '48px' : '60px',
                      height: screenSize.isMobile ? '48px' : '60px',
                      backgroundColor: getSectorColor(selectedTender.sector) + '15',
                        borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0
                    }}>
                      {React.createElement(getSectorIcon(selectedTender.sector), {
                        size: screenSize.isMobile ? 24 : 30,
                        color: getSectorColor(selectedTender.sector)
                      })}
                    </div>
                    )}
                    
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <h2 style={{
                        fontSize: screenSize.isMobile ? '18px' : '20px',
                        fontWeight: '700',
                        color: '#1a1a1a',
                        margin: '0 0 8px 0',
                        lineHeight: '1.2'
                      }}>
                        {selectedTender.title}
                      </h2>
                      
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '16px',
                        flexWrap: 'wrap',
                        margin: '0 0 12px 0'
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <Building2 size={16} color="#64748b" />
                          <span style={{ fontSize: '14px', color: '#64748b' }}>
                            {selectedTender.organization}
                          </span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <MapPin size={16} color="#64748b" />
                          <span style={{ fontSize: '14px', color: '#64748b' }}>
                            {selectedTender.location}
                          </span>
                        </div>
                      </div>
                      
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '16px',
                        flexWrap: 'wrap'
                      }}>
                        <div style={{
                          backgroundColor: '#16a34a',
                          color: 'white',
                          padding: '4px 12px',
                          borderRadius: '12px',
                          fontSize: '12px',
                          fontWeight: '600'
                        }}>
                          {selectedTender.contractValue}
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <Clock size={14} color="#64748b" />
                          <span style={{ fontSize: '12px', color: '#64748b' }}>
                            {selectedTender.duration}
                          </span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <Calendar size={14} color="#dc2626" />
                          <span style={{ fontSize: '12px', color: '#dc2626', fontWeight: '600' }}>
                            Due: {new Date(selectedTender.deadline).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => setShowDetails(false)}
                    style={{
                      background: 'rgba(255, 255, 255, 0.9)',
                      border: '1px solid #e2e8f0',
                      padding: '8px',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      marginLeft: '12px'
                    }}
                  >
                    <X size={20} color="#64748b" />
                  </button>
                </div>
              </div>

              {/* Content */}
              <div style={{ padding: screenSize.isMobile ? '16px 12px' : '24px' }}>
                
                {/* Tender Overview */}
                <div style={{ marginBottom: '32px' }}>
                  <h3 style={{
                    fontSize: '16px',
                    fontWeight: '600',
                    color: '#1a1a1a',
                    margin: '0 0 12px 0'
                  }}>
                    Tender Overview
                  </h3>
                  <p style={{
                    fontSize: '14px',
                    color: '#4a5568',
                    lineHeight: '1.6',
                    margin: 0
                  }}>
                    {selectedTender.detailedDescription || selectedTender.description}
                  </p>
                </div>

                {/* Project Scope */}
                {selectedTender.projectScope && (
                  <div style={{ marginBottom: '32px' }}>
                    <h3 style={{
                      fontSize: '16px',
                      fontWeight: '600',
                      color: '#1a1a1a',
                      margin: '0 0 16px 0'
                    }}>
                      Project Scope
                    </h3>
                    <ul style={{
                      listStyle: 'none',
                      padding: 0,
                      margin: 0,
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '8px'
                    }}>
                      {selectedTender.projectScope.map((item, index) => (
                        <li key={index} style={{
                          display: 'flex',
                          alignItems: 'flex-start',
                          gap: '8px',
                          fontSize: '14px',
                          color: '#4a5568',
                          lineHeight: '1.5'
                        }}>
                          <span style={{
                            width: '6px',
                            height: '6px',
                            backgroundColor: '#16a34a',
                            borderRadius: '50%',
                            flexShrink: 0,
                            marginTop: '6px'
                          }}></span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Technical Requirements */}
                {selectedTender.technicalRequirements && (
                  <div style={{ marginBottom: '32px' }}>
                    <h3 style={{
                      fontSize: '16px',
                      fontWeight: '600',
                      color: '#1a1a1a',
                      margin: '0 0 16px 0'
                    }}>
                      Technical Requirements
                    </h3>
                    <ul style={{
                      listStyle: 'none',
                      padding: 0,
                      margin: 0,
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '8px'
                    }}>
                      {selectedTender.technicalRequirements.map((requirement, index) => (
                        <li key={index} style={{
                          display: 'flex',
                          alignItems: 'flex-start',
                          gap: '8px',
                          fontSize: '14px',
                          color: '#4a5568',
                          lineHeight: '1.5'
                        }}>
                          <Check size={16} color="#dc2626" style={{ flexShrink: 0, marginTop: '1px' }} />
                          {requirement}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* About the Organization */}
                {selectedTender.organizationInfo && (
                  <div style={{ marginBottom: '32px' }}>
                    <h3 style={{
                      fontSize: '16px',
                      fontWeight: '600',
                      color: '#1a1a1a',
                      margin: '0 0 16px 0'
                    }}>
                      About {selectedTender.organizationInfo.name}
                    </h3>
                    <div style={{
                      backgroundColor: '#f8f9fa',
                      borderRadius: '12px',
                      padding: '16px'
                    }}>
                      <p style={{
                        fontSize: '14px',
                        color: '#4a5568',
                        lineHeight: '1.6',
                        margin: '0 0 12px 0'
                      }}>
                        {selectedTender.organizationInfo.focus}
                      </p>
                      <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                        gap: '12px',
                        marginTop: '12px'
                      }}>
                        <div>
                          <span style={{ fontSize: '12px', color: '#64748b', fontWeight: '600' }}>Type</span>
                          <p style={{ fontSize: '14px', color: '#1a1a1a', margin: '2px 0 0 0' }}>
                            {selectedTender.organizationInfo.type}
                          </p>
                        </div>
                        <div>
                          <span style={{ fontSize: '12px', color: '#64748b', fontWeight: '600' }}>Established</span>
                          <p style={{ fontSize: '14px', color: '#1a1a1a', margin: '2px 0 0 0' }}>
                            {selectedTender.organizationInfo.established}
                          </p>
                        </div>
                        <div>
                          <span style={{ fontSize: '12px', color: '#64748b', fontWeight: '600' }}>Employees</span>
                          <p style={{ fontSize: '14px', color: '#1a1a1a', margin: '2px 0 0 0' }}>
                            {selectedTender.organizationInfo.employees}
                          </p>
                        </div>
                        <div>
                          <span style={{ fontSize: '12px', color: '#64748b', fontWeight: '600' }}>Budget</span>
                          <p style={{ fontSize: '14px', color: '#1a1a1a', margin: '2px 0 0 0' }}>
                            {selectedTender.organizationInfo.budget}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Submission Process */}
                {selectedTender.submissionProcess && (
                  <div style={{ marginBottom: '32px' }}>
                    <h3 style={{
                      fontSize: '16px',
                      fontWeight: '600',
                      color: '#1a1a1a',
                      margin: '0 0 16px 0'
                    }}>
                      Submission Process
                    </h3>
                    <div style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '12px'
                    }}>
                      {selectedTender.submissionProcess.map((step, index) => (
                        <div key={index} style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '12px',
                          padding: '12px 16px',
                          backgroundColor: '#f8f9fa',
                          borderRadius: '8px',
                          border: '1px solid #e2e8f0'
                        }}>
                          <div style={{
                            width: '24px',
                            height: '24px',
                            backgroundColor: '#16a34a',
                            color: 'white',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '12px',
                            fontWeight: '600',
                            flexShrink: 0
                          }}>
                            {index + 1}
                          </div>
                          <span style={{
                            fontSize: '14px',
                            color: '#1a1a1a',
                            fontWeight: '500'
                          }}>
                            {step}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Evaluation Criteria */}
                {selectedTender.evaluationCriteria && (
                  <div style={{ marginBottom: '32px' }}>
                    <h3 style={{
                      fontSize: '16px',
                      fontWeight: '600',
                      color: '#1a1a1a',
                      margin: '0 0 16px 0'
                    }}>
                      Evaluation Criteria
                    </h3>
                    <div style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '8px'
                    }}>
                      {selectedTender.evaluationCriteria.map((criteria, index) => (
                        <div key={index} style={{
                          backgroundColor: '#e0f2fe',
                          color: '#0369a1',
                          padding: '8px 12px',
                          borderRadius: '8px',
                          fontSize: '13px',
                          fontWeight: '600',
                          textAlign: 'center'
                        }}>
                          {criteria}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Required Documents */}
                <div style={{ marginBottom: '24px' }}>
                  <h3 style={{
                    fontSize: '16px',
                    fontWeight: '600',
                    color: '#1a1a1a',
                    margin: '0 0 16px 0'
                  }}>
                    Required Documents
                  </h3>
                  <div style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '8px'
                  }}>
                    {selectedTender.documents.map((doc, index) => (
                      <span key={index} style={{
                        backgroundColor: '#16a34a',
                        color: 'white',
                        padding: '6px 12px',
                        borderRadius: '16px',
                        fontSize: '12px',
                        fontWeight: '600'
                      }}>
                        {doc}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Tenders
