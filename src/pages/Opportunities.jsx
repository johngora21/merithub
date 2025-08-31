import React, { useState } from 'react'
import { useResponsive, getGridColumns, getGridGap } from '../hooks/useResponsive'
import { countries } from '../utils/countries'
import { 
  Bookmark, 
  MapPin, 
  Clock, 
  Building2,
  DollarSign,
  GraduationCap, 
  Award, 
  Trophy, 
  Star,
  Calendar,
  Search,
  SlidersHorizontal,
  ExternalLink,
  Users,
  Target,
  Globe,
  X,
  Check
} from 'lucide-react'

const Opportunities = () => {
  const screenSize = useResponsive()
  const [savedOpportunities, setSavedOpportunities] = useState(new Set())
  const [searchQuery, setSearchQuery] = useState('')
  const [showFilters, setShowFilters] = useState(false)
  const [showDetails, setShowDetails] = useState(false)
  const [selectedOpportunity, setSelectedOpportunity] = useState(null)
  const [filters, setFilters] = useState({
    type: [],
    category: [],
    location: [],
    country: [],
    duration: [],
    targetAudience: [],
    amountMin: '',
    amountMax: '',
    currency: 'USD'
  })

  const opportunities = [
    {
      id: '1',
      title: 'Google Research Scholar Program',
      poster: 'https://images.unsplash.com/photo-1573804633927-bfcbcd909acd?w=400&h=240&fit=crop',
      type: 'Fellowship',
      category: 'Technology',
      amount: '$60,000',
      duration: '12 months',
      location: 'Global',
      country: 'Global',
      deadline: '2024-04-15',
      description: 'Support exceptional early-career professors doing research in fields relevant to computer science. Recipients receive unrestricted gifts to support their research.',
      requirements: ['PhD in Computer Science or related field', 'Faculty position at a university', 'Research focus in ML, AI, or Systems'],
      benefits: ['Research funding', 'Mentorship', 'Google collaboration', 'Conference attendance'],
      applicants: 156,
      isUrgent: true,
      tags: ['Machine Learning', 'Research', 'Academia'],
      postedTime: '2 days ago',
      detailedDescription: 'The Google Research Scholar Program supports early-career professors who are pursuing research in fields relevant to computer science. The program provides unrestricted gifts to support research activities and encourages collaboration between faculty and Google researchers.',
      eligibilityCriteria: [
        'Hold a PhD in Computer Science, Engineering, or a related technical field',
        'Be in an early-career academic position at a university',
        'Demonstrate research excellence in machine learning, AI, systems, or related areas',
        'Show potential for significant research impact',
        'Be able to collaborate with Google research teams'
      ],
      selectionProcess: [
        'Initial application review by Google Research team',
        'Technical evaluation of research proposal',
        'Assessment of academic track record and potential',
        'Final selection by committee of Google researchers',
        'Notification of results within 8-10 weeks'
      ],
      programDetails: {
        fundingAmount: '$60,000 unrestricted research gift',
        duration: '12 months with possibility of renewal',
        mentorship: 'Access to Google Research mentors and collaborators',
        networking: 'Invitation to exclusive research symposiums and events'
      }
    },
    {
      id: '2',
      title: 'Rhodes Scholarship at Oxford',
      poster: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=240&fit=crop',
      type: 'Scholarship',
      category: 'Education',
      amount: '$70,000/year',
      duration: '2-3 years',
      location: 'Oxford, UK',
      deadline: '2024-03-30',
      description: 'The Rhodes Scholarship is one of the oldest and most prestigious international scholarship programmes, enabling outstanding young people to study at the University of Oxford.',
      requirements: ['Exceptional academic achievement', 'Leadership potential', 'Commitment to service', 'Age 18-24'],
      benefits: ['Full tuition coverage', 'Living stipend', 'Travel allowance', 'Oxford network'],
      applicants: 289,
      isUrgent: false,
      tags: ['Leadership', 'International', 'Graduate Study'],
      postedTime: '1 week ago'
    },
    {
      id: '3',
      title: 'Y Combinator Startup School',
      poster: 'https://images.unsplash.com/photo-1551434678-e076c223a692?w=400&h=240&fit=crop',
      type: 'Program',
      category: 'Entrepreneurship',
      amount: 'Free',
      duration: '10 weeks',
      location: 'Online',
      deadline: '2024-05-01',
      description: 'A free online program for founders who are determined to build a startup. Get access to the same advice we give to YC startups.',
      requirements: ['Startup idea or early-stage company', 'Commitment to weekly sessions', 'Team of 1-4 founders'],
      benefits: ['YC curriculum access', 'Founder community', 'Mentorship', 'Demo day opportunity'],
      applicants: 1247,
      isUrgent: true,
      tags: ['Startup', 'Entrepreneurship', 'Technology'],
      postedTime: '3 days ago'
    },
    {
      id: '4',
      title: 'NASA Research Internship',
      poster: 'https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=400&h=240&fit=crop',
      type: 'Internship',
      category: 'Space & Science',
      amount: '$7,000/month',
      duration: '10-16 weeks',
      location: 'Various NASA Centers',
      deadline: '2024-04-01',
      description: 'Undergraduate Student Research Program provides opportunities for students to participate in research aligned to NASA mission goals.',
      requirements: ['US Citizen', 'Enrolled in STEM degree', 'Minimum 3.0 GPA', 'Sophomore level or above'],
      benefits: ['Research experience', 'NASA mentorship', 'Professional development', 'Potential job offers'],
      applicants: 892,
      isUrgent: false,
      tags: ['Space', 'STEM', 'Research', 'Government'],
      postedTime: '5 days ago'
    },
    {
      id: '5',
      title: 'Fulbright Research Grant',
      poster: 'https://images.unsplash.com/photo-1541746972996-4e0b0f93e586?w=400&h=240&fit=crop',
      type: 'Grant',
      category: 'Research',
      amount: '$30,000',
      duration: '6-12 months',
      location: 'Global',
      deadline: '2024-06-15',
      description: 'Fulbright Research Grants provide opportunities for scholars to conduct research and lecture abroad, promoting mutual understanding between nations.',
      requirements: ['US Citizen', 'PhD or equivalent professional experience', 'Language proficiency', 'Research proposal'],
      benefits: ['Research funding', 'Cultural exchange', 'International network', 'Career advancement'],
      applicants: 445,
      isUrgent: false,
      tags: ['International', 'Research', 'Cultural Exchange'],
      postedTime: '1 week ago'
    },
    {
      id: '6',
      title: 'Gates Millennium Scholars',
      poster: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=400&h=240&fit=crop',
      type: 'Scholarship',
      category: 'Education',
      amount: 'Full Tuition',
      duration: '4 years',
      location: 'United States',
      deadline: '2024-02-28',
      description: 'Provides outstanding African American, American Indian, Asian & Pacific Islander American, and Hispanic American students with opportunities to complete their undergraduate education.',
      requirements: ['High school senior', 'Minority student', 'Financial need', 'Academic excellence', 'Leadership'],
      benefits: ['Full tuition coverage', 'Graduate school funding', 'Leadership development', 'Mentorship'],
      applicants: 1856,
      isUrgent: true,
      tags: ['Diversity', 'Leadership', 'Full Funding'],
      postedTime: '4 hours ago'
    }
  ]

  const filterOptions = {
    type: ['Fellowship', 'Scholarship', 'Grant', 'Program', 'Internship'],
    category: ['Scholarships', 'Fellowships', 'Funds', 'Grants', 'Internships', 'Programs', 'Competitions', 'Research', 'Professional Development'],
    location: ['Global', 'Online', 'Remote', 'On-site'],
    country: countries.map(country => country.name), // All 195 countries
    duration: ['Short-term (under 6 months)', 'Medium-term (6-12 months)', 'Long-term (1-2 years)', 'Multi-year (2+ years)'],
    targetAudience: ['Undergraduate students', 'Graduate students', 'Early-career professionals', 'Researchers/Faculty', 'Entrepreneurs', 'High school students']
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

  const toggleSave = (opportunityId) => {
    const newSaved = new Set(savedOpportunities)
    if (newSaved.has(opportunityId)) {
      newSaved.delete(opportunityId)
    } else {
      newSaved.add(opportunityId)
    }
    setSavedOpportunities(newSaved)
  }

  const handleOpportunityClick = (opportunity) => {
    setSelectedOpportunity(opportunity)
    setShowDetails(true)
  }

  const handleApply = (opportunityId) => {
    console.log('Apply clicked for opportunity:', opportunityId)
    // Handle apply logic here
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
      type: [],
      category: [],
      location: [],
      country: [],
      duration: [],
      targetAudience: [],
      amountMin: '',
      amountMax: '',
      currency: 'USD'
    })
  }

  const getActiveFilterCount = () => {
    let count = 0
    count += filters.type.length
    count += filters.category.length
    count += filters.location.length
    count += filters.country.length
    count += filters.duration.length
    count += filters.targetAudience.length
    if (filters.amountMin || filters.amountMax) count += 1
    return count
  }

  const updateAmountRange = (field, value) => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const getTypeIcon = (type) => {
    switch (type) {
      case 'Scholarship': return GraduationCap
      case 'Fellowship': return Award
      case 'Grant': return Trophy
      case 'Program': return Target
      case 'Internship': return Building2
      default: return Star
    }
  }

  const getTypeColor = (type) => {
    switch (type) {
      case 'Scholarship': return '#1d4ed8'
      case 'Fellowship': return '#7c3aed'
      case 'Grant': return '#dc2626'
      case 'Program': return '#059669'
      case 'Internship': return '#ea580c'
      default: return '#16a34a'
    }
  }

  // Filter and search opportunities
  const filteredOpportunities = opportunities.filter(opportunity => {
    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      const matchesSearch = 
        opportunity.title.toLowerCase().includes(query) ||
        opportunity.category.toLowerCase().includes(query) ||
        opportunity.location.toLowerCase().includes(query) ||
        opportunity.description.toLowerCase().includes(query) ||
        opportunity.tags.some(tag => tag.toLowerCase().includes(query))
      
      if (!matchesSearch) return false
    }

    // Type filter
    if (filters.type.length > 0 && !filters.type.includes(opportunity.type)) {
      return false
    }

    // Category filter
    if (filters.category.length > 0 && !filters.category.includes(opportunity.category)) {
      return false
    }

    // Location filter
    if (filters.location.length > 0) {
      let matchesLocation = false
      filters.location.forEach(locationType => {
        if (locationType === 'Global' && opportunity.location === 'Global') {
          matchesLocation = true
        } else if (locationType === 'Online' && opportunity.location === 'Online') {
          matchesLocation = true
        } else if (locationType === 'Remote' && opportunity.location === 'Online') {
          matchesLocation = true
        } else if (locationType === 'On-site' && !['Online', 'Global'].includes(opportunity.location)) {
          matchesLocation = true
        }
      })
      if (!matchesLocation) return false
    }

    // Duration filter
    if (filters.duration.length > 0) {
      let matchesDuration = false
      filters.duration.forEach(durationFilter => {
        const duration = opportunity.duration
        if (durationFilter.includes('Short-term') && (duration.includes('weeks') || duration.includes('months') && parseInt(duration) < 6)) {
          matchesDuration = true
        } else if (durationFilter.includes('Medium-term') && (duration.includes('month') && parseInt(duration) >= 6 && parseInt(duration) <= 12)) {
          matchesDuration = true
        } else if (durationFilter.includes('Long-term') && (duration.includes('year') && parseInt(duration) >= 1 && parseInt(duration) <= 2)) {
          matchesDuration = true
        } else if (durationFilter.includes('Multi-year') && (duration.includes('year') && parseInt(duration) > 2)) {
          matchesDuration = true
        }
      })
      if (!matchesDuration) return false
    }

    // Target Audience filter - This is conceptual since we don't have this data in opportunities
    // In a real application, you'd add targetAudience field to opportunity data
    if (filters.targetAudience.length > 0) {
      // For now, we'll skip this filter since the data doesn't have target audience info
      // In production, you'd match against opportunity.targetAudience
    }

    // Amount range filter
    if (filters.amountMin || filters.amountMax) {
      const amountText = opportunity.amount
      
      // Handle "Free" amounts
      if (amountText.toLowerCase() === 'free') {
        const filterMin = filters.amountMin ? parseInt(filters.amountMin) : 0
        if (filterMin > 0) return false
      } else {
        // Extract amount numbers from opportunity amount text
        const amountNumbers = amountText.match(/[\d,]+/g)
        
        if (amountNumbers && amountNumbers.length >= 1) {
          // Parse the amount from the opportunity
          let amount = parseInt(amountNumbers[0].replace(/[,$]/g, ''))
          
          // Handle per year amounts
          if (amountText.includes('/year')) {
            // Amount is already annual
          } else if (amountText.includes('/month')) {
            amount = amount * 12 // Convert monthly to annual
          }
          
          // Check against filter criteria
          const filterMin = filters.amountMin ? parseInt(filters.amountMin) : 0
          const filterMax = filters.amountMax ? parseInt(filters.amountMax) : Infinity
          
          if (amount < filterMin || amount > filterMax) return false
        }
      }
    }

    return true
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
              placeholder="Search scholarships, fellowships, grants..."
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

                {/* Opportunities List */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: `repeat(${getGridColumns(screenSize)}, 1fr)`,
          gap: getGridGap(screenSize)
        }}>
          {filteredOpportunities.length === 0 ? (
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
                No opportunities found
              </h3>
              <p style={{
                fontSize: '14px',
                color: '#64748b',
                margin: 0
              }}>
                Try adjusting your search or filters to find more opportunities
              </p>
            </div>
          ) : (
            filteredOpportunities.map((opportunity) => {
            const typeColor = getTypeColor(opportunity.type)
            
            return (
              <div key={opportunity.id} style={{
                backgroundColor: 'white',
                borderRadius: '12px',
                overflow: 'hidden',
                boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                border: '1px solid #f0f0f0',
                position: 'relative',
                transition: 'all 0.2s ease-in-out',
                cursor: 'pointer'
              }}
              onClick={() => handleOpportunityClick(opportunity)}
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
                  <img 
                    src={opportunity.poster} 
                    alt={opportunity.title}
                    style={{
                      width: '100%',
                      height: '200px',
                      objectFit: 'cover'
                    }}
                  />
                  
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
                        backdropFilter: 'blur(10px)'
                      }}>
                        {opportunity.type}
                      </span>
                      {opportunity.isUrgent && (
                        <span style={{
                          fontSize: '12px',
                          color: 'white',
                          backgroundColor: '#16a34a',
                          padding: '4px 8px',
                          borderRadius: '6px',
                          fontWeight: '600',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px'
                        }}>
                          <Star size={12} fill="white" />
                          Urgent
                        </span>
                      )}
                    </div>
                    
                    <button
                      onClick={() => toggleSave(opportunity.id)}
                      style={{
                        background: savedOpportunities.has(opportunity.id) ? 'rgba(22, 163, 74, 0.9)' : 'rgba(255, 255, 255, 0.9)',
                        border: 'none',
                        padding: '8px',
                        cursor: 'pointer',
                        borderRadius: '8px',
                        transition: 'all 0.2s ease-in-out',
                        backdropFilter: 'blur(10px)'
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.transform = 'scale(1.1)'
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.transform = 'scale(1)'
                      }}
                    >
                      <Bookmark 
                        size={18} 
                        color={savedOpportunities.has(opportunity.id) ? 'white' : '#64748b'}
                        fill={savedOpportunities.has(opportunity.id) ? 'white' : 'none'}
                      />
                    </button>
                  </div>
                </div>

                {/* Content */}
                <div style={{ padding: '20px' }}>
                  {/* Title */}
                  <h2 style={{
                    fontSize: '18px',
                    fontWeight: '600',
                    color: '#1a1a1a',
                    margin: '0 0 12px 0',
                    lineHeight: '1.3'
                  }}>
                    {opportunity.title}
                  </h2>

                  {/* Category */}
                  <div style={{
                    fontSize: '13px',
                    color: '#64748b',
                    marginBottom: '12px',
                    fontWeight: '500'
                  }}>
                    {opportunity.category}
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
                      color: '#16a34a',
                      fontWeight: '600'
                    }}>
                      <DollarSign size={14} />
                      {opportunity.amount}
                    </div>
                    <span style={{ color: '#e2e8f0' }}>•</span>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      fontSize: '13px',
                      color: '#64748b'
                    }}>
                      <Clock size={14} />
                      {opportunity.duration}
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
                      {opportunity.location}
                    </div>
                  </div>

                  {/* Deadline */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    fontSize: '13px',
                    color: '#dc2626',
                    marginBottom: '12px',
                    fontWeight: '600'
                  }}>
                    <Calendar size={12} />
                    Deadline: {new Date(opportunity.deadline).toLocaleDateString()}
                  </div>

                  {/* Description */}
                  <p style={{
                    fontSize: '14px',
                    color: '#475569',
                    lineHeight: '1.5',
                    margin: '0 0 12px 0',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden'
                  }}>
                    {opportunity.description}
                  </p>

                  {/* Tags */}
                  <div style={{ marginBottom: '16px' }}>
                    <div style={{
                      display: 'flex',
                      flexWrap: 'wrap',
                      gap: '6px'
                    }}>
                      {opportunity.tags.slice(0, 4).map((tag, index) => (
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
                      {opportunity.tags.length > 4 && (
                        <span style={{
                          color: '#64748b',
                          fontSize: '12px',
                          padding: '4px 8px',
                          fontWeight: '500'
                        }}>
                          +{opportunity.tags.length - 4} more
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
                    borderTop: '1px solid #f1f5f9'
                  }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      fontSize: '12px',
                      color: '#64748b'
                    }}>
                      <Users size={12} />
                      {opportunity.applicants} applicants
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        handleApply(opportunity.id)
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
                
                {/* Opportunity Type */}
                <div>
                  <h3 style={{
                    fontSize: '16px',
                    fontWeight: '600',
                    color: '#1a1a1a',
                    margin: '0 0 12px 0'
                  }}>
                    Opportunity Type
                  </h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {filterOptions.type.map((type) => (
                      <label key={type} style={{
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
                          backgroundColor: filters.type.includes(type) ? '#16a34a' : 'transparent',
                          borderColor: filters.type.includes(type) ? '#16a34a' : '#e2e8f0',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          transition: 'all 0.2s ease-in-out'
                        }}
                        onClick={() => toggleFilter('type', type)}>
                          {filters.type.includes(type) && (
                            <Check size={12} color="white" />
                          )}
                        </div>
                        <span style={{
                          fontSize: '14px',
                          color: '#1a1a1a',
                          fontWeight: '500'
                        }}>
                          {type}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Category/Field */}
                <div>
                  <h3 style={{
                    fontSize: '16px',
                    fontWeight: '600',
                    color: '#1a1a1a',
                    margin: '0 0 12px 0'
                  }}>
                    Category
                  </h3>
                  <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: 'repeat(2, 1fr)', 
                    gap: '8px' 
                  }}>
                    {filterOptions.category.map((category) => (
                      <label key={category} style={{
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
                          backgroundColor: filters.category.includes(category) ? '#16a34a' : 'transparent',
                          borderColor: filters.category.includes(category) ? '#16a34a' : '#e2e8f0',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          transition: 'all 0.2s ease-in-out',
                          flexShrink: 0
                        }}
                        onClick={() => toggleFilter('category', category)}>
                          {filters.category.includes(category) && (
                            <Check size={12} color="white" />
                          )}
                        </div>
                        <span style={{
                          fontSize: '14px',
                          color: '#1a1a1a',
                          fontWeight: '500'
                        }}>
                          {category}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Location */}
                <div>
                  <h3 style={{
                    fontSize: '16px',
                    fontWeight: '600',
                    color: '#1a1a1a',
                    margin: '0 0 12px 0'
                  }}>
                    Location
                  </h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {filterOptions.location.map((location) => (
                      <label key={location} style={{
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
                          backgroundColor: filters.location.includes(location) ? '#16a34a' : 'transparent',
                          borderColor: filters.location.includes(location) ? '#16a34a' : '#e2e8f0',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          transition: 'all 0.2s ease-in-out'
                        }}
                        onClick={() => toggleFilter('location', location)}>
                          {filters.location.includes(location) && (
                            <Check size={12} color="white" />
                          )}
                        </div>
                        <span style={{
                          fontSize: '14px',
                          color: '#1a1a1a',
                          fontWeight: '500'
                        }}>
                          {location}
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

                {/* Duration */}
                <div>
                  <h3 style={{
                    fontSize: '16px',
                    fontWeight: '600',
                    color: '#1a1a1a',
                    margin: '0 0 12px 0'
                  }}>
                    Duration
                  </h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {filterOptions.duration.map((duration) => (
                      <label key={duration} style={{
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
                          backgroundColor: filters.duration.includes(duration) ? '#16a34a' : 'transparent',
                          borderColor: filters.duration.includes(duration) ? '#16a34a' : '#e2e8f0',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          transition: 'all 0.2s ease-in-out'
                        }}
                        onClick={() => toggleFilter('duration', duration)}>
                          {filters.duration.includes(duration) && (
                            <Check size={12} color="white" />
                          )}
                        </div>
                        <span style={{
                          fontSize: '14px',
                          color: '#1a1a1a',
                          fontWeight: '500'
                        }}>
                          {duration}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Target Audience */}
                <div>
                  <h3 style={{
                    fontSize: '16px',
                    fontWeight: '600',
                    color: '#1a1a1a',
                    margin: '0 0 12px 0'
                  }}>
                    Target Audience
                  </h3>
                  <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: 'repeat(2, 1fr)', 
                    gap: '8px' 
                  }}>
                    {filterOptions.targetAudience.map((audience) => (
                      <label key={audience} style={{
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
                          backgroundColor: filters.targetAudience.includes(audience) ? '#16a34a' : 'transparent',
                          borderColor: filters.targetAudience.includes(audience) ? '#16a34a' : '#e2e8f0',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          transition: 'all 0.2s ease-in-out',
                          flexShrink: 0
                        }}
                        onClick={() => toggleFilter('targetAudience', audience)}>
                          {filters.targetAudience.includes(audience) && (
                            <Check size={12} color="white" />
                          )}
                        </div>
                        <span style={{
                          fontSize: '14px',
                          color: '#1a1a1a',
                          fontWeight: '500'
                        }}>
                          {audience}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Amount Range */}
                <div>
                  <h3 style={{
                    fontSize: '16px',
                    fontWeight: '600',
                    color: '#1a1a1a',
                    margin: '0 0 12px 0'
                  }}>
                    Amount Range
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
                      onChange={(e) => updateAmountRange('currency', e.target.value)}
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

                  {/* Amount Input Fields */}
                  <div style={{ display: 'flex', gap: '12px' }}>
                    <div style={{ flex: 1 }}>
                      <label style={{
                        display: 'block',
                        fontSize: '14px',
                        color: '#64748b',
                        marginBottom: '6px',
                        fontWeight: '500'
                      }}>
                        Minimum Amount
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
                          value={filters.amountMin}
                          onChange={(e) => updateAmountRange('amountMin', e.target.value)}
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
                        Maximum Amount
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
                          value={filters.amountMax}
                          onChange={(e) => updateAmountRange('amountMax', e.target.value)}
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

        {/* Opportunity Details Modal */}
        {showDetails && selectedOpportunity && (
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
              
              {/* Header Image */}
              <div style={{ position: 'relative', height: '200px', overflow: 'hidden' }}>
                <img 
                  src={selectedOpportunity.poster} 
                  alt={selectedOpportunity.title}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover'
                  }}
                />
                <div style={{
                  position: 'absolute',
                  top: '16px',
                  right: '16px'
                }}>
                  <button
                    onClick={() => setShowDetails(false)}
                    style={{
                      background: 'rgba(255, 255, 255, 0.9)',
                      border: 'none',
                      padding: '8px',
                      borderRadius: '8px',
                      cursor: 'pointer'
                    }}
                  >
                    <X size={20} color="#64748b" />
                  </button>
                </div>
              </div>

              {/* Content */}
              <div style={{ padding: screenSize.isMobile ? '16px 12px' : '24px' }}>
                {/* Title and Basic Info */}
                <div style={{ marginBottom: '24px' }}>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    marginBottom: '12px'
                  }}>
                    <span style={{
                      fontSize: '12px',
                      color: '#3b82f6',
                      backgroundColor: '#eff6ff',
                      padding: '4px 8px',
                      borderRadius: '4px',
                      fontWeight: '600',
                      textTransform: 'uppercase'
                    }}>
                      {selectedOpportunity.type}
                    </span>
                    <span style={{
                      fontSize: '12px',
                      color: '#dc2626',
                      backgroundColor: '#fee2e2',
                      padding: '4px 8px',
                      borderRadius: '4px',
                      fontWeight: '600'
                    }}>
                      Deadline: {new Date(selectedOpportunity.deadline).toLocaleDateString()}
                    </span>
                  </div>

                  <h2 style={{
                    fontSize: '24px',
                    fontWeight: '700',
                    color: '#1a1a1a',
                    margin: '0 0 8px 0',
                    lineHeight: '1.3'
                  }}>
                    {selectedOpportunity.title}
                  </h2>

                  <p style={{
                    fontSize: '16px',
                    color: '#64748b',
                    margin: '0 0 16px 0'
                  }}>
                    {selectedOpportunity.category}
                  </p>

                  {/* Key Stats */}
                  <div style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '16px',
                    marginBottom: '20px',
                    fontSize: '14px',
                    color: '#64748b'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <DollarSign size={14} />
                      {selectedOpportunity.amount}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Clock size={14} />
                      {selectedOpportunity.duration}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <MapPin size={14} />
                      {selectedOpportunity.location}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Users size={14} />
                      {selectedOpportunity.applicants} applicants
                    </div>
                  </div>
                </div>

                {/* Overview */}
                <div style={{ marginBottom: '24px' }}>
                  <h3 style={{
                    fontSize: '16px',
                    fontWeight: '600',
                    color: '#1a1a1a',
                    margin: '0 0 8px 0'
                  }}>
                    Overview
                  </h3>
                  <p style={{
                    fontSize: '14px',
                    color: '#64748b',
                    lineHeight: '1.6',
                    margin: 0
                  }}>
                    {selectedOpportunity.detailedDescription || selectedOpportunity.description}
                  </p>
                </div>

                {/* Eligibility Criteria */}
                {selectedOpportunity.eligibilityCriteria && (
                  <div style={{ marginBottom: '24px' }}>
                    <h3 style={{
                      fontSize: '16px',
                      fontWeight: '600',
                      color: '#1a1a1a',
                      margin: '0 0 12px 0'
                    }}>
                      Eligibility Criteria
                    </h3>
                    <div style={{ 
                      backgroundColor: '#f8fafc',
                      borderRadius: '8px',
                      padding: '16px'
                    }}>
                      {selectedOpportunity.eligibilityCriteria.map((criteria, index) => (
                        <div key={index} style={{
                          display: 'flex',
                          alignItems: 'flex-start',
                          marginBottom: index === selectedOpportunity.eligibilityCriteria.length - 1 ? '0' : '8px',
                          fontSize: '14px',
                          color: '#374151'
                        }}>
                          <span style={{
                            color: '#3b82f6',
                            marginRight: '8px',
                            marginTop: '2px'
                          }}>•</span>
                          <span>{criteria}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Requirements */}
                {selectedOpportunity.requirements && (
                  <div style={{ marginBottom: '24px' }}>
                    <h3 style={{
                      fontSize: '16px',
                      fontWeight: '600',
                      color: '#1a1a1a',
                      margin: '0 0 12px 0'
                    }}>
                      Requirements
                    </h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {selectedOpportunity.requirements.map((req, index) => (
                        <div key={index} style={{
                          display: 'flex',
                          alignItems: 'flex-start',
                          fontSize: '14px',
                          color: '#374151'
                        }}>
                          <span style={{
                            color: '#dc2626',
                            marginRight: '8px',
                            marginTop: '2px'
                          }}>✓</span>
                          <span>{req}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Selection Process */}
                {selectedOpportunity.selectionProcess && (
                  <div style={{ marginBottom: '24px' }}>
                    <h3 style={{
                      fontSize: '16px',
                      fontWeight: '600',
                      color: '#1a1a1a',
                      margin: '0 0 12px 0'
                    }}>
                      Selection Process
                    </h3>
                    <div style={{ 
                      backgroundColor: '#f8fafc',
                      borderRadius: '8px',
                      padding: '16px'
                    }}>
                      {selectedOpportunity.selectionProcess.map((step, index) => (
                        <div key={index} style={{
                          display: 'flex',
                          alignItems: 'flex-start',
                          marginBottom: index === selectedOpportunity.selectionProcess.length - 1 ? '0' : '8px',
                          fontSize: '14px',
                          color: '#374151'
                        }}>
                          <span style={{
                            color: '#16a34a',
                            fontWeight: '600',
                            marginRight: '8px',
                            minWidth: '20px'
                          }}>
                            {index + 1}.
                          </span>
                          <span>{step}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Program Details */}
                {selectedOpportunity.programDetails && (
                  <div style={{ marginBottom: '24px' }}>
                    <h3 style={{
                      fontSize: '16px',
                      fontWeight: '600',
                      color: '#1a1a1a',
                      margin: '0 0 12px 0'
                    }}>
                      Program Details
                    </h3>
                    <div style={{ 
                      backgroundColor: '#f8fafc',
                      borderRadius: '8px',
                      padding: '16px'
                    }}>
                      {Object.entries(selectedOpportunity.programDetails).map(([key, value], index) => (
                        <div key={index} style={{
                          marginBottom: index === Object.entries(selectedOpportunity.programDetails).length - 1 ? '0' : '12px',
                          fontSize: '14px'
                        }}>
                          <span style={{ 
                            color: '#64748b',
                            textTransform: 'capitalize',
                            fontWeight: '500'
                          }}>
                            {key.replace(/([A-Z])/g, ' $1').toLowerCase()}: 
                          </span>
                          <span style={{ color: '#374151', marginLeft: '4px' }}>
                            {value}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Benefits & Tags */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: screenSize.isMobile ? '1fr' : '1fr 1fr',
                  gap: '20px',
                  marginBottom: '24px'
                }}>
                  {/* Benefits */}
                  <div>
                    <h3 style={{
                      fontSize: '16px',
                      fontWeight: '600',
                      color: '#1a1a1a',
                      margin: '0 0 8px 0'
                    }}>
                      Benefits & Rewards
                    </h3>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                      {selectedOpportunity.benefits.map((benefit, index) => (
                        <span key={index} style={{
                          fontSize: '12px',
                          color: '#16a34a',
                          backgroundColor: '#f0fdf4',
                          padding: '4px 8px',
                          borderRadius: '4px',
                          fontWeight: '500'
                        }}>
                          {benefit}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Tags */}
                  <div>
                    <h3 style={{
                      fontSize: '16px',
                      fontWeight: '600',
                      color: '#1a1a1a',
                      margin: '0 0 8px 0'
                    }}>
                      Topics & Skills
                    </h3>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                      {selectedOpportunity.tags.map((tag, index) => (
                        <span key={index} style={{
                          fontSize: '12px',
                          color: '#6366f1',
                          backgroundColor: '#eef2ff',
                          padding: '4px 8px',
                          borderRadius: '4px',
                          fontWeight: '500'
                        }}>
                          {tag}
                        </span>
                      ))}
                    </div>
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

export default Opportunities
