import React, { useState } from 'react'
import { useResponsive, getGridColumns, getGridGap } from '../hooks/useResponsive'
import { countries } from '../utils/countries'
import { 
  Bookmark, 
  MapPin, 
  Clock, 
  Building2,
  DollarSign,
  MoreHorizontal,
  Users,
  Star,
  Briefcase,
  Calendar,
  Search,
  SlidersHorizontal,
  X,
  Check
} from 'lucide-react'

const Jobs = () => {
  const screenSize = useResponsive()
  const [savedJobs, setSavedJobs] = useState(new Set())
  const [searchQuery, setSearchQuery] = useState('')
  const [showFilters, setShowFilters] = useState(false)
  const [showDetails, setShowDetails] = useState(false)
  const [selectedJob, setSelectedJob] = useState(null)
  const [filters, setFilters] = useState({
    jobType: [],
    experienceLevel: [],
    industry: [],
    location: [],
    country: [],
    salaryMin: '',
    salaryMax: '',
    currency: 'USD'
  })

  const jobs = [
    {
      id: '1',
      company: 'TechCorp Solutions',
      industry: 'Technology',
      companyLocation: 'San Francisco, CA',
      country: 'United States',
      logo: 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=80&h=80&fit=crop',
      title: 'Senior Frontend Developer',
      location: 'San Francisco, CA',
      salary: '$120,000 - $160,000',
      type: 'Full-time',
      experience: '5+ years',
      skills: ['React', 'TypeScript', 'Node.js', 'AWS'],
      description: 'We are looking for an experienced Frontend Developer to join our growing team. You will be responsible for building scalable web applications using modern technologies.',
      benefits: ['Health Insurance', 'Remote Work', '401k Match', 'Stock Options'],
      postedTime: '2 hours ago',
      applicants: 23,
      isRemote: true,
      urgentHiring: false,
      rating: 4.5,
      postedBy: 'company',
      responsibilities: [
        'Develop and maintain responsive web applications using React and TypeScript',
        'Collaborate with UX/UI designers to implement pixel-perfect designs',
        'Build reusable components and maintain component libraries',
        'Optimize applications for maximum speed and scalability',
        'Work with backend developers to integrate APIs and services',
        'Participate in code reviews and maintain coding standards',
        'Debug and troubleshoot technical issues across browsers',
        'Mentor junior developers and contribute to technical documentation'
      ],
      requirements: [
        '5+ years of experience with React and modern JavaScript',
        'Strong proficiency in TypeScript and ES6+',
        'Experience with state management (Redux, Context API)',
        'Knowledge of build tools (Webpack, Vite) and testing frameworks',
        'Familiarity with Node.js and RESTful API integration',
        'Experience with AWS services and cloud deployment',
        'Strong understanding of responsive design and CSS',
        'Excellent problem-solving and communication skills'
      ],
      companyInfo: {
        size: '200-500 employees',
        founded: '2018',
        funding: 'Series B',
        mission: 'Building innovative technology solutions that transform businesses'
      }
    },
    {
      id: '2',
      company: 'Merit Platform',
      industry: 'CloudTech Solutions',
      companyLocation: 'Global',
      country: 'Global',
      logo: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=80&h=80&fit=crop',
      title: 'Full Stack Developer',
      location: 'Remote',
      salary: '$100,000 - $140,000',
      type: 'Full-time',
      experience: '3+ years',
      skills: ['React', 'Node.js', 'PostgreSQL', 'AWS'],
      description: 'Join our team to build the next generation professional growth platform. Work on challenging problems in career development and job matching.',
      benefits: ['Health Insurance', 'Remote Work', 'Stock Options', 'Learning Budget'],
      postedTime: '1 hour ago',
      applicants: 15,
      isRemote: true,
      urgentHiring: true,
      rating: 4.8,
      postedBy: 'platform'
    },
    {
      id: '3',
      company: 'StartupXYZ Inc',
      industry: 'Fintech',
      companyLocation: 'New York, NY',
      logo: 'https://images.unsplash.com/photo-1553484771-cc0d9b8c2b33?w=80&h=80&fit=crop',
      title: 'Product Manager',
      location: 'New York, NY',
      salary: '$110,000 - $140,000',
      type: 'Full-time',
      experience: '3-5 years',
      skills: ['Product Strategy', 'Analytics', 'Agile', 'Roadmapping'],
      description: 'Lead product strategy and work with cross-functional teams to deliver innovative solutions that drive business growth.',
      benefits: ['Health Insurance', 'Flexible Hours', 'Learning Budget', 'Equity'],
      postedTime: '4 hours ago',
      applicants: 45,
      isRemote: false,
      urgentHiring: true,
      rating: 4.2,
      postedBy: 'company'
    },
    {
      id: '4',
      company: 'InnovateLabs',
      industry: 'Software Development',
      companyLocation: 'Austin, TX',
      logo: 'https://images.unsplash.com/photo-1551434678-e076c223a692?w=80&h=80&fit=crop',
      title: 'UX/UI Designer',
      location: 'Austin, TX',
      salary: '$85,000 - $115,000',
      type: 'Full-time',
      experience: '2-4 years',
      skills: ['Figma', 'User Research', 'Prototyping', 'Design Systems'],
      description: 'Create beautiful and intuitive user experiences for our mobile and web applications. Work closely with product and engineering teams.',
      benefits: ['Health Insurance', 'Remote Work', 'Design Conference Budget', 'Gym Membership'],
      postedTime: '1 day ago',
      applicants: 67,
      isRemote: true,
      urgentHiring: false,
      rating: 4.7,
      postedBy: 'company'
    },
    {
      id: '5',
      company: 'DataTech Corp',
      industry: 'Data Analytics',
      companyLocation: 'Seattle, WA',
      logo: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=80&h=80&fit=crop',
      title: 'Senior Data Scientist',
      location: 'Seattle, WA',
      salary: '$130,000 - $170,000',
      type: 'Full-time',
      experience: '4+ years',
      skills: ['Python', 'Machine Learning', 'SQL', 'TensorFlow'],
      description: 'Build machine learning models and extract insights from large datasets to drive business decisions and product improvements.',
      benefits: ['Health Insurance', 'Stock Options', 'Learning Budget', 'Flexible PTO'],
      postedTime: '2 days ago',
      applicants: 89,
      isRemote: true,
      urgentHiring: false,
      rating: 4.4,
      postedBy: 'company'
    },
    {
      id: '6',
      company: 'Merit Platform',
      industry: 'FinanceFlow Corp',
      companyLocation: 'Global',
      logo: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=80&h=80&fit=crop',
      title: 'Marketing Manager',
      location: 'San Francisco, CA',
      salary: '$95,000 - $125,000',
      type: 'Full-time',
      experience: '4+ years',
      skills: ['Digital Marketing', 'Content Strategy', 'Analytics', 'SEO'],
      description: 'Drive growth through strategic marketing initiatives. Lead campaigns to attract top talent and partner companies to our platform.',
      benefits: ['Health Insurance', 'Remote Work', 'Marketing Budget', 'Professional Development'],
      postedTime: '6 hours ago',
      applicants: 32,
      isRemote: false,
      urgentHiring: false,
      rating: 4.8,
      postedBy: 'platform'
    }
  ]

  const toggleSave = (jobId) => {
    const newSavedJobs = new Set(savedJobs)
    if (newSavedJobs.has(jobId)) {
      newSavedJobs.delete(jobId)
    } else {
      newSavedJobs.add(jobId)
    }
    setSavedJobs(newSavedJobs)
  }

  const handleJobClick = (job) => {
    setSelectedJob(job)
    setShowDetails(true)
  }

  const handleApply = (jobId) => {
    console.log('Apply clicked for job:', jobId)
    // Handle apply logic here
  }

  const filterOptions = {
    jobType: ['Full-time', 'Part-time', 'Contract', 'Internship'],
    experienceLevel: ['Entry Level (0-1 years)', 'Junior (1-3 years)', 'Mid-Level (3-5 years)', 'Senior (5+ years)', 'Executive (10+ years)'],
    industry: [
      'Technology', 'Healthcare', 'Finance', 'Education', 'Retail', 'Manufacturing', 
      'Real Estate', 'Marketing', 'Consulting', 'Media', 'Government', 'Non-profit',
      'Automotive', 'Energy', 'Food & Beverage', 'Travel', 'Sports', 'Gaming'
    ],
    location: ['Remote', 'Hybrid', 'On-site'],
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
      jobType: [],
      experienceLevel: [],
      industry: [],
      location: [],
      salaryMin: '',
      salaryMax: '',
      currency: 'USD'
    })
  }

  const getActiveFilterCount = () => {
    let count = 0
    count += filters.jobType.length
    count += filters.experienceLevel.length
    count += filters.industry.length
    count += filters.location.length
    if (filters.salaryMin || filters.salaryMax) count += 1
    return count
  }

  const updateSalaryRange = (field, value) => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }))
  }

  // Filter and search jobs
  const filteredJobs = jobs.filter(job => {
    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      const matchesSearch = 
        job.title.toLowerCase().includes(query) ||
        job.company.toLowerCase().includes(query) ||
        job.industry.toLowerCase().includes(query) ||
        job.location.toLowerCase().includes(query) ||
        job.skills.some(skill => skill.toLowerCase().includes(query)) ||
        job.description.toLowerCase().includes(query)
      
      if (!matchesSearch) return false
    }

    // Job type filter
    if (filters.jobType.length > 0 && !filters.jobType.includes(job.type)) {
      return false
    }

    // Experience level filter
    if (filters.experienceLevel.length > 0) {
      const jobExperience = job.experience
      let matchesExperience = false
      
      filters.experienceLevel.forEach(level => {
        if (level.includes('Entry Level') && (jobExperience.includes('0') || jobExperience.includes('1'))) {
          matchesExperience = true
        } else if (level.includes('Junior') && (jobExperience.includes('1') || jobExperience.includes('2') || jobExperience.includes('3'))) {
          matchesExperience = true
        } else if (level.includes('Mid-Level') && (jobExperience.includes('3') || jobExperience.includes('4') || jobExperience.includes('5'))) {
          matchesExperience = true
        } else if (level.includes('Senior') && (jobExperience.includes('5+') || jobExperience.includes('4+'))) {
          matchesExperience = true
        } else if (level.includes('Executive') && jobExperience.includes('10+')) {
          matchesExperience = true
        }
      })
      
      if (!matchesExperience) return false
    }

    // Industry filter
    if (filters.industry.length > 0 && !filters.industry.includes(job.industry)) {
      return false
    }

    // Location filter
    if (filters.location.length > 0) {
      let matchesLocation = false
      filters.location.forEach(locationType => {
        if (locationType === 'Remote' && job.isRemote) {
          matchesLocation = true
        } else if (locationType === 'On-site' && !job.isRemote) {
          matchesLocation = true
        } else if (locationType === 'Hybrid') {
          // For now, treat hybrid as any location that's not explicitly remote
          matchesLocation = true
        }
      })
      if (!matchesLocation) return false
    }

    // Country filter
    if (filters.country.length > 0 && job.country && !filters.country.includes(job.country)) {
      return false
    }

    // Salary range filter (manual input)
    if (filters.salaryMin || filters.salaryMax) {
      const salaryText = job.salary
      // Extract salary numbers from job salary text (e.g., "$120,000 - $160,000")
      const salaryNumbers = salaryText.match(/\$?([\d,]+)/g)
      
      if (salaryNumbers && salaryNumbers.length >= 1) {
        // Parse the salary range from the job
        const minSalary = parseInt(salaryNumbers[0].replace(/[$,]/g, ''))
        const maxSalary = salaryNumbers.length > 1 ? parseInt(salaryNumbers[1].replace(/[$,]/g, '')) : minSalary
        
        // Check against filter criteria
        const filterMin = filters.salaryMin ? parseInt(filters.salaryMin) : 0
        const filterMax = filters.salaryMax ? parseInt(filters.salaryMax) : Infinity
        
        // Job salary range must overlap with filter range
        const jobSalaryOverlaps = (minSalary <= filterMax && maxSalary >= filterMin)
        
        if (!jobSalaryOverlaps) return false
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
              placeholder="Search jobs, companies, or skills..."
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

        {/* Jobs List */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: `repeat(${getGridColumns(screenSize)}, 1fr)`,
          gap: getGridGap(screenSize)
        }}>
          {filteredJobs.length === 0 ? (
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
                No jobs found
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
            filteredJobs.map((job) => (
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
            onClick={() => handleJobClick(job)}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)'
              e.currentTarget.style.transform = 'translateY(-2px)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.05)'
              e.currentTarget.style.transform = 'translateY(0)'
            }}>
              
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
                
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    toggleSave(job.id)
                  }}
                  style={{
                    background: savedJobs.has(job.id) ? '#f0fdf4' : '#f8f9fa',
                    border: savedJobs.has(job.id) ? '1px solid #16a34a' : '1px solid #e2e8f0',
                    padding: '8px',
                    cursor: 'pointer',
                    borderRadius: '8px',
                    flexShrink: 0,
                    marginLeft: '8px',
                    transition: 'all 0.2s ease-in-out'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = savedJobs.has(job.id) ? '#dcfce7' : '#f1f5f9'
                    e.target.style.transform = 'scale(1.05)'
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = savedJobs.has(job.id) ? '#f0fdf4' : '#f8f9fa'
                    e.target.style.transform = 'scale(1)'
                  }}
                >
                  <Bookmark 
                    size={20} 
                    color={savedJobs.has(job.id) ? '#16a34a' : '#64748b'}
                    fill={savedJobs.has(job.id) ? '#16a34a' : 'none'}
                  />
                </button>
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
                  {job.skills.slice(0, 4).map((skill, index) => (
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
                  {job.skills.length > 4 && (
                    <span style={{
                      color: '#64748b',
                      fontSize: '11px',
                      padding: '2px 6px',
                      fontWeight: '500'
                    }}>
                      +{job.skills.length - 4} more
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
                  onClick={(e) => {
                    e.stopPropagation()
                    handleApply(job.id)
                  }}
                  style={{
                    backgroundColor: '#16a34a',
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
                    e.target.style.backgroundColor = '#15803d'
                    e.target.style.transform = 'translateY(-1px)'
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = '#16a34a'
                    e.target.style.transform = 'translateY(0)'
                  }}
                >
                  {job.postedBy === 'individual' ? 'Contact' : 'Apply Now'}
                </button>
              </div>
            </div>
            ))
          )}
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
                
                {/* Job Type */}
                <div>
                  <h3 style={{
                    fontSize: '16px',
                    fontWeight: '600',
                    color: '#1a1a1a',
                    margin: '0 0 12px 0'
                  }}>
                    Job Type
                  </h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {filterOptions.jobType.map((type) => (
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
                          backgroundColor: filters.jobType.includes(type) ? '#16a34a' : 'transparent',
                          borderColor: filters.jobType.includes(type) ? '#16a34a' : '#e2e8f0',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          transition: 'all 0.2s ease-in-out'
                        }}
                        onClick={() => toggleFilter('jobType', type)}>
                          {filters.jobType.includes(type) && (
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

                {/* Experience Level */}
                <div>
                  <h3 style={{
                    fontSize: '16px',
                    fontWeight: '600',
                    color: '#1a1a1a',
                    margin: '0 0 12px 0'
                  }}>
                    Experience Level
                  </h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {filterOptions.experienceLevel.map((level) => (
                      <label key={level} style={{
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
                          backgroundColor: filters.experienceLevel.includes(level) ? '#16a34a' : 'transparent',
                          borderColor: filters.experienceLevel.includes(level) ? '#16a34a' : '#e2e8f0',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          transition: 'all 0.2s ease-in-out'
                        }}
                        onClick={() => toggleFilter('experienceLevel', level)}>
                          {filters.experienceLevel.includes(level) && (
                            <Check size={12} color="white" />
                          )}
                        </div>
                        <span style={{
                          fontSize: '14px',
                          color: '#1a1a1a',
                          fontWeight: '500'
                        }}>
                          {level}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Industry */}
                <div>
                  <h3 style={{
                    fontSize: '16px',
                    fontWeight: '600',
                    color: '#1a1a1a',
                    margin: '0 0 12px 0'
                  }}>
                    Industry
                  </h3>
                  <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: screenSize.isMobile ? '1fr' : 'repeat(2, 1fr)', 
                    gap: '8px' 
                  }}>
                    {filterOptions.industry.map((industry) => (
                      <label key={industry} style={{
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
                          backgroundColor: filters.industry.includes(industry) ? '#16a34a' : 'transparent',
                          borderColor: filters.industry.includes(industry) ? '#16a34a' : '#e2e8f0',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          transition: 'all 0.2s ease-in-out',
                          flexShrink: 0
                        }}
                        onClick={() => toggleFilter('industry', industry)}>
                          {filters.industry.includes(industry) && (
                            <Check size={12} color="white" />
                          )}
                        </div>
                        <span style={{
                          fontSize: '14px',
                          color: '#1a1a1a',
                          fontWeight: '500'
                        }}>
                          {industry}
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

                {/* Salary Range */}
                <div>
                  <h3 style={{
                    fontSize: '16px',
                    fontWeight: '600',
                    color: '#1a1a1a',
                    margin: '0 0 12px 0'
                  }}>
                    Salary Range
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
                      onChange={(e) => updateSalaryRange('currency', e.target.value)}
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
                          {currency.symbol} {currency.name} ({currency.code})
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Salary Input Fields */}
                  <div style={{ display: 'flex', gap: '12px' }}>
                    <div style={{ flex: 1 }}>
                      <label style={{
                        display: 'block',
                        fontSize: '14px',
                        color: '#64748b',
                        marginBottom: '6px',
                        fontWeight: '500'
                      }}>
                        Minimum Salary
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
                          value={filters.salaryMin}
                          onChange={(e) => updateSalaryRange('salaryMin', e.target.value)}
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
                        Maximum Salary
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
                          value={filters.salaryMax}
                          onChange={(e) => updateSalaryRange('salaryMax', e.target.value)}
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

        {/* Job Details Modal */}
        {showDetails && selectedJob && (
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
                padding: '24px 24px 0 24px',
                borderBottom: '1px solid #f0f0f0'
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  justifyContent: 'space-between',
                  marginBottom: '20px'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1 }}>
                    <img 
                      src={selectedJob.logo} 
                      alt={selectedJob.company}
                      style={{
                        width: '60px',
                        height: '60px',
                        borderRadius: '30px',
                        objectFit: 'cover',
                        border: '2px solid #f0f0f0'
                      }}
                    />
                    <div style={{ flex: 1 }}>
                      <h2 style={{
                        fontSize: '24px',
                        fontWeight: '700',
                        color: '#1a1a1a',
                        margin: '0 0 4px 0',
                        lineHeight: '1.3'
                      }}>
                        {selectedJob.title}
                      </h2>
                      <h3 style={{
                        fontSize: '18px',
                        fontWeight: '600',
                        color: '#16a34a',
                        margin: '0 0 8px 0'
                      }}>
                        {selectedJob.company}
                      </h3>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '16px',
                        fontSize: '14px',
                        color: '#64748b'
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <MapPin size={14} />
                          {selectedJob.location}
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <Briefcase size={14} />
                          {selectedJob.type}
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <DollarSign size={14} />
                          {selectedJob.salary}
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
                {/* Job Overview */}
                <div style={{ marginBottom: '24px' }}>
                  <h3 style={{
                    fontSize: '16px',
                    fontWeight: '600',
                    color: '#1a1a1a',
                    margin: '0 0 8px 0'
                  }}>
                    Job Overview
                  </h3>
                  <p style={{
                    fontSize: '14px',
                    color: '#64748b',
                    lineHeight: '1.6',
                    margin: 0
                  }}>
                    {selectedJob.description}
                  </p>
                </div>

                {/* Key Responsibilities */}
                {selectedJob.responsibilities && (
                  <div style={{ marginBottom: '24px' }}>
                    <h3 style={{
                      fontSize: '16px',
                      fontWeight: '600',
                      color: '#1a1a1a',
                      margin: '0 0 12px 0'
                    }}>
                      Key Responsibilities
                    </h3>
                    <div style={{ 
                      backgroundColor: '#f8fafc',
                      borderRadius: '8px',
                      padding: '16px'
                    }}>
                      {selectedJob.responsibilities.map((item, index) => (
                        <div key={index} style={{
                          display: 'flex',
                          alignItems: 'flex-start',
                          marginBottom: index === selectedJob.responsibilities.length - 1 ? '0' : '8px',
                          fontSize: '14px',
                          color: '#374151'
                        }}>
                          <span style={{
                            color: '#16a34a',
                            marginRight: '8px',
                            marginTop: '2px'
                          }}>•</span>
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Requirements */}
                {selectedJob.requirements && (
                  <div style={{ marginBottom: '24px' }}>
                    <h3 style={{
                      fontSize: '16px',
                      fontWeight: '600',
                      color: '#1a1a1a',
                      margin: '0 0 12px 0'
                    }}>
                      Requirements & Qualifications
                    </h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {selectedJob.requirements.map((req, index) => (
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

                {/* Company Information */}
                {selectedJob.companyInfo && (
                  <div style={{ marginBottom: '24px' }}>
                    <h3 style={{
                      fontSize: '16px',
                      fontWeight: '600',
                      color: '#1a1a1a',
                      margin: '0 0 12px 0'
                    }}>
                      About the Company
                    </h3>
                    <div style={{ 
                      backgroundColor: '#f8fafc',
                      borderRadius: '8px',
                      padding: '16px'
                    }}>
                      <p style={{
                        fontSize: '14px',
                        color: '#374151',
                        lineHeight: '1.6',
                        marginBottom: '12px'
                      }}>
                        {selectedJob.companyInfo.mission}
                      </p>
                      <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
                        gap: '12px',
                        fontSize: '13px'
                      }}>
                        <div>
                          <span style={{ color: '#64748b' }}>Size: </span>
                          <span style={{ color: '#374151', fontWeight: '500' }}>{selectedJob.companyInfo.size}</span>
                        </div>
                        <div>
                          <span style={{ color: '#64748b' }}>Founded: </span>
                          <span style={{ color: '#374151', fontWeight: '500' }}>{selectedJob.companyInfo.founded}</span>
                        </div>
                        <div>
                          <span style={{ color: '#64748b' }}>Stage: </span>
                          <span style={{ color: '#374151', fontWeight: '500' }}>{selectedJob.companyInfo.funding}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Skills & Benefits */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: screenSize.isMobile ? '1fr' : '1fr 1fr',
                  gap: '20px',
                  marginBottom: '24px'
                }}>
                  {/* Skills */}
                  <div>
                    <h3 style={{
                      fontSize: '16px',
                      fontWeight: '600',
                      color: '#1a1a1a',
                      margin: '0 0 8px 0'
                    }}>
                      Required Skills
                    </h3>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                      {selectedJob.skills.map((skill, index) => (
                        <span key={index} style={{
                          fontSize: '12px',
                          color: '#16a34a',
                          backgroundColor: '#f0fdf4',
                          padding: '4px 8px',
                          borderRadius: '4px',
                          fontWeight: '500'
                        }}>
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Benefits */}
                  <div>
                    <h3 style={{
                      fontSize: '16px',
                      fontWeight: '600',
                      color: '#1a1a1a',
                      margin: '0 0 8px 0'
                    }}>
                      Benefits & Perks
                    </h3>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                      {selectedJob.benefits.map((benefit, index) => (
                        <span key={index} style={{
                          fontSize: '12px',
                          color: '#3b82f6',
                          backgroundColor: '#eff6ff',
                          padding: '4px 8px',
                          borderRadius: '4px',
                          fontWeight: '500'
                        }}>
                          {benefit}
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

export default Jobs